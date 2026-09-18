const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { initializeApp, cert, getApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const Imap = require('imap');
const { simpleParser } = require('mailparser');

const app = express();
const PORT = process.env.PORT || 3010;

// CORS
app.use(cors());
app.use(express.json());

// Firebase Initialization
let db;
if (process.env.NODE_ENV === 'test') {
  // Use mock DB for tests
  db = global.__TEST_DB__ || require('./tests/unit/mockDb.js');
} else {
  const serviceAccount = require('./firebase-key.json');
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
  db = getFirestore();
}

// ===== SEO Routes =====
app.get('/robots.txt', (req, res) => {
  const robotsPath = path.join(__dirname, 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.sendFile(robotsPath);
  }
  res.status(404).send('robots.txt not found');
});

app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.sendFile(sitemapPath);
  }
  res.status(404).send('sitemap.xml not found');
});

// ===== API Routes =====

// 1. GET all specialists (live catalog)
app.get('/api/specialists', async (req, res) => {
  try {
    const snapshot = await db.collection('pending_specialists')
      .where('status', '==', 'approved')
      .get();

    const specialists = [];
    snapshot.forEach(doc => {
      specialists.push({ id: doc.id, ...doc.data() });
    });

    res.json(specialists);
  } catch (err) {
    console.error('Error fetching specialists:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. GET pending applications (admin)
app.get('/api/admin/pending', async (req, res) => {
  try {
    const snapshot = await db.collection('pending_specialists')
      .where('status', '==', 'pending')
      .get();

    const apps = [];
    snapshot.forEach(doc => {
      apps.push({ id: doc.id, ...doc.data() });
    });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET rejected applications (archive)
app.get('/api/admin/rejected', async (req, res) => {
  try {
    const snapshot = await db.collection('pending_specialists')
      .where('status', '==', 'rejected')
      .get();

    const apps = [];
    snapshot.forEach(doc => {
      apps.push({ id: doc.id, ...doc.data() });
    });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. CREATE or UPDATE specialist (CRUD)
app.post('/api/specialists', async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const timestamp = FieldValue.serverTimestamp();

    if (id) {
      // Update existing
      console.log(`[CRUD] UPDATE specialist ID: ${id}`, { ...data, updatedAt: 'serverTimestamp' });
      await db.collection('pending_specialists').doc(id).set({
        ...data,
        updatedAt: timestamp,
        status: data.status || 'approved'
      }, { merge: true });
      console.log(`[CRUD] ✅ Successfully updated ID: ${id}`);
      res.json({ success: true, id, message: 'Спеціаліста оновлено' });
    } else {
      // Create new
      const newRef = db.collection('pending_specialists').doc(data.id || db.collection('pending_specialists').doc().id);
      await newRef.set({
        id: newRef.id,
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
        status: data.status || 'approved'
      });
      console.log(`[CRUD] CREATE specialist with ID: ${newRef.id}`, data);
      console.log(`[CRUD] ✅ Successfully created ID: ${newRef.id}`);
      res.json({ success: true, id: newRef.id, message: 'Спеціаліста додано' });
    }
  } catch (err) {
    console.error(`[CRUD] ❌ Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE specialist
app.delete('/api/specialists/:id', async (req, res) => {
  try {
    await db.collection('pending_specialists').doc(req.params.id).delete();
    res.json({ success: true, message: 'Спеціаліста видалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. APPROVE application
app.patch('/api/admin/approve/:id', async (req, res) => {
  try {
    await db.collection('pending_specialists').doc(req.params.id).update({
      status: 'approved',
      updatedAt: FieldValue.serverTimestamp()
    });
    res.json({ success: true, message: 'Заявка підтверджена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. REJECT application
app.patch('/api/admin/reject/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    await db.collection('pending_specialists').doc(req.params.id).update({
      status: 'rejected',
      rejectReason: reason || '',
      updatedAt: FieldValue.serverTimestamp()
    });
    res.json({ success: true, message: 'Заявка відхилена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. RESTORE rejected to pending
app.patch('/api/admin/restore/:id', async (req, res) => {
  try {
    await db.collection('pending_specialists').doc(req.params.id).update({
      status: 'pending',
      rejectReason: null,
      updatedAt: FieldValue.serverTimestamp()
    });
    res.json({ success: true, message: 'Заявка повернута у розгляд' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. FEEDBACK (Inaccuracy Reports)
app.post('/api/feedback', async (req, res) => {
  try {
    const { specialistId, senderName, contactInfo, message, status } = req.body;
    const timestamp = FieldValue.serverTimestamp();

    const docRef = await db.collection('feedback').add({
      specialistId: specialistId || null,
      senderName: senderName || 'Anonymous',
      contactInfo: contactInfo || '',
      message: message || '',
      status: status || 'new',
      createdAt: timestamp
    });

    console.log(`[FEEDBACK] Created report ${docRef.id} for specialist ${specialistId}`);
    res.json({ success: true, id: docRef.id, message: 'Звіт успішно відправлено' });
  } catch (err) {
    console.error(`[FEEDBACK] Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// 9.1 RESOLVE FEEDBACK
app.patch('/api/feedback/:id/resolve', async (req, res) => {
  try {
    await db.collection('feedback').doc(req.params.id).update({
      status: 'resolved',
      resolvedAt: FieldValue.serverTimestamp()
    });
    console.log(`[FEEDBACK] Resolved report ${req.params.id}`);
    res.json({ success: true, message: 'Звіт позначено як вирішений' });
  } catch (err) {
    console.error(`[FEEDBACK] Error resolving:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// 10. SYNC to JSON
app.post('/api/sync', async (req, res) => {
  try {
    const approvedSnapshot = await db.collection('pending_specialists')
      .where('status', '==', 'approved')
      .get();
      
    const deletedSnapshot = await db.collection('pending_specialists')
      .where('status', '==', 'deleted')
      .get();
      
    if (approvedSnapshot.empty && deletedSnapshot.empty) {
      return res.json({ success: true, message: 'Немає нових змін' });
    }

    const specialistsPath = path.join(__dirname, 'data', 'specialists.json');
    let staticData = [];
    if (fs.existsSync(specialistsPath)) {
      staticData = JSON.parse(fs.readFileSync(specialistsPath, 'utf8'));
    }

    const updates = [];
    const deletes = [];
    const batch = db.batch();

    let maxId = 0;
    staticData.forEach(s => {
      if (s.id && !isNaN(Number(s.id))) {
        maxId = Math.max(maxId, Number(s.id));
      }
    });

    approvedSnapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id;
      if (data.createdAt && typeof data.createdAt.toDate === 'function') data.createdAt = data.createdAt.toDate().toISOString();
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') data.updatedAt = data.updatedAt.toDate().toISOString();
      
      if (!data.id || isNaN(Number(data.id))) {
        maxId++;
        data.id = String(maxId);
      }
      
      batch.delete(doc.ref);
      updates.push(data);
    });

    deletedSnapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id;
      const targetId = data.id || id;
      batch.delete(doc.ref);
      deletes.push(targetId);
    });

    updates.forEach(u => {
      const idx = staticData.findIndex(s => s.id === u.id || String(s.id) === String(u.id));
      if (idx !== -1) {
        staticData[idx] = { ...staticData[idx], ...u };
      } else {
        staticData.push(u);
      }
    });

    deletes.forEach(dId => {
      staticData = staticData.filter(s => String(s.id) !== String(dId));
    });

    // Унікальність ID (видаляємо дублікати, залишаючи останній оновлений варіант)
    const seen = new Set();
    const finalData = [];
    for (let i = staticData.length - 1; i >= 0; i--) {
      const sId = String(staticData[i].id);
      if (!seen.has(sId)) {
        seen.add(sId);
        finalData.unshift(staticData[i]);
      }
    }
    staticData = finalData;

    fs.writeFileSync(specialistsPath, JSON.stringify(staticData, null, 2));
    await batch.commit();

    res.json({ success: true, synced: updates.length, deleted: deletes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. SEND REJECTION EMAIL via SMTP
app.post('/api/send-rejection-email', async (req, res) => {
  try {
    const { to_email, reject_reason, to_name } = req.body;

    if (!to_email || !to_email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Invalid recipient email' });
    }

    const emailUser = process.env.GMAIL_USER || 'ukrskw@gmail.com';
    const emailPass = process.env.GMAIL_PASS;

    if (!emailPass) {
      console.warn('[EMAIL] Warning: GMAIL_PASS not set. Using test mode.');
      return res.json({ success: true, message: 'Email would be sent (test mode)', testMode: true });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const mailOptions = {
      from: emailUser,
      to: to_email,
      cc: emailUser,
      subject: 'Відповідь на вашу заявку - Разом KW',
      html: `
        <p>Привіт <strong>${to_name || 'друже'}</strong>,</p>
        <p>Дякуємо за вашу заявку до каталогу <strong>Разом KW</strong>!</p>
        <p>На жаль, ми не можемо підтвердити вашу заявку на цей момент з наступної причини:</p>
        <blockquote style="background:#f5f5f5;padding:1rem;border-left:4px solid #007bff;">
          <strong>${reject_reason || 'Не відповідає правилам спільноти'}</strong>
        </blockquote>
        <p>Якщо у вас є запитання або ви хочете внести зміни, напишіть нам на <strong>ukrskw@gmail.com</strong>.</p>
        <p>З повагою,<br><strong>Команда Разом KW</strong><br>
        <a href="https://ukrainianskw.ca" style="color:#007bff;">ukrainianskw.ca</a></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] ✅ Rejection email sent to ${to_email}, CC: ${emailUser}`);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('[EMAIL] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. GET EMAILS from REST API
app.get('/api/emails', async (req, res) => {
  try {
    const accessToken = await getGmailAccessToken();
    if (!accessToken) {
      console.log('[EMAIL] Token not available - returning demo data');
      return res.json({
        success: true,
        emails: [
          {
            from: 'заявник@example.com',
            subject: 'Я додав телефон як просили',
            text: 'Привіт! Я додав телефон до мого профілю. Надіюсь тепер все в порядку. +1 (234) 567-8900',
            date: new Date(Date.now() - 3600000).toISOString(),
            seqno: 1,
            flags: ['\\Seen']
          },
          {
            from: 'інший@example.com',
            subject: 'Питання про каталог',
            text: 'Чи можу я додати більше категорій до мого профілю?',
            date: new Date(Date.now() - 7200000).toISOString(),
            seqno: 2,
            flags: []
          }
        ],
        unreadCount: 1,
        demo: true
      });
    }

        const folder = req.query.folder || 'inbox';
    let query = 'in:inbox';
    if (folder === 'sent') query = 'in:sent';
    else if (folder === 'trash') query = 'in:trash';
    else if (folder === 'spam') query = 'in:spam';
    else if (folder === 'archive') query = '-in:inbox -in:trash -in:spam -in:sent';
    else if (folder === 'unread') query = 'is:unread';
    
    const mailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=20`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const mailData = await mailRes.json();
    if (!mailData.messages) {
      return res.json({ success: true, emails: [], unreadCount: 0 });
    }

    const emails = [];
    let unreadCount = 0;

    await Promise.all(mailData.messages.map(async (msgItem, index) => {
      const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgItem.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const msgDetails = await msgRes.json();
      
      const headers = msgDetails.payload?.headers || [];
      const fromHeader = headers.find(h => h.name.toLowerCase() === 'from')?.value || 'Unknown';
      const toHeader = headers.find(h => h.name.toLowerCase() === 'to')?.value || 'Unknown';
      const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '(no subject)';
      const dateHeader = headers.find(h => h.name.toLowerCase() === 'date')?.value || new Date().toISOString();
      
      const isUnread = msgDetails.labelIds && msgDetails.labelIds.includes('UNREAD');
      const flags = isUnread ? [] : ['\\Seen'];
      if (isUnread) unreadCount++;

      emails.push({
        id: msg.id,
        seqno: index + 1,
        from: fromHeader,
        to: toHeader,
        subject: subjectHeader,
        text: msgDetails.snippet || '',
        date: new Date(dateHeader).toISOString(),
        flags: flags
      });
    }));

    res.json({
      success: true,
      emails: emails.sort((a, b) => new Date(b.date) - new Date(a.date)),
      unreadCount
    });
  } catch (err) {
    console.error('[EMAIL] REST API Error:', err.message);
    res.json({ success: true, emails: [], unreadCount: 0 });
  }
});

// 13. SEND REPLY EMAIL via REST API
app.post('/api/send-reply-email', async (req, res) => {
  try {
    const { to_email, subject, reply_text, original_subject } = req.body;

    if (!to_email || !reply_text) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const emailUser = 'ukrskw@gmail.com';
    const accessToken = await getGmailAccessToken();

    if (!accessToken) {
      return res.status(400).json({ success: false, error: 'OAuth2 access token not available' });
    }

    const msgId = `<${Date.now()}.${Math.random().toString(36).substring(2)}@gmail.com>`;
    const dateStr = new Date().toUTCString();
    
    // subject is passed from frontend, so we don't need to force "Re: " here
    const finalSubject = subject || 'Reply';
    
    const emailText = [
      'Content-Type: text/html; charset="UTF-8"',
      'MIME-Version: 1.0',
      `Date: ${dateStr}`,
      `Message-ID: ${msgId}`,
      `To: <${to_email}>`,
      `From: Разом KW <${emailUser}>`,
      `Subject: =?UTF-8?B?${Buffer.from(finalSubject).toString('base64')}?=`,
      '',
      `<p>${reply_text.replace(/\n/g, '<br>')}</p>`
    ].join('\r\n');

    const raw = Buffer.from(emailText).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
    const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw })
    });

    if (!sendRes.ok) {
      throw new Error('Failed to send email via Gmail API');
    }

    console.log(`[EMAIL] ✅ Reply sent to ${to_email}`);
    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (err) {
    console.error('[EMAIL] Send Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== OAuth2 Email (Gmail) =====
const GMAIL_OAUTH_CLIENT_ID = '352202414760-mvu4oi0rh7r7gavqj4f1v9lnhd9fuj4b.apps.googleusercontent.com';

// OAuth2 Start - redirect to Google for authorization
app.get('/oauth/start', (req, res) => {
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', GMAIL_OAUTH_CLIENT_ID);
  authUrl.searchParams.append('redirect_uri', 'https://ukrainianskw.ca/oauth/callback');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send');
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'select_account consent');
  res.redirect(authUrl.toString());
});

// OAuth2 Callback - exchanges code for refresh token
app.get('/oauth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).send('Missing authorization code');

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GMAIL_OAUTH_CLIENT_ID,
        client_secret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
        redirect_uri: 'https://ukrainianskw.ca/oauth/callback',
        grant_type: 'authorization_code'
      })
    });

    const data = await tokenRes.json();
    if (data.refresh_token) {
      res.send(`<html><body style="font-family:sans-serif;max-width:600px;margin:50px auto;padding:20px">
        <h2>✅ Авторизація успішна!</h2>
        <p>Збережи цей <strong>refresh token</strong> і надішли мені (Миколі):</p>
        <textarea readonly style="width:100%;height:80px;font-size:12px;padding:10px;border:2px solid #28a745;border-radius:8px">${data.refresh_token}</textarea>
        <p style="color:#666;font-size:13px">Токен діє безстроково (поки не відкликаєш доступ у Google Account).</p>
      </body></html>`);
    } else {
      res.status(400).send('Error: ' + JSON.stringify(data));
    }
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// Helper: get access token from refresh token
async function getGmailAccessToken() {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GMAIL_OAUTH_CLIENT_ID,
      client_secret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    })
  });
  const data = await tokenRes.json();
  return data.access_token || null;
}

// ===== Scheduled Tasks =====

// Daily Facebook scraping (midnight)
const { exec } = require('child_process');
cron.schedule('0 0 * * *', () => {
  console.log('Starting daily Facebook event scraping...');
  exec('node scripts/scrape_fb_events.js', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Facebook scraping execution error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Facebook scraping stderr: ${stderr}`);
    }
    console.log(`Facebook scraping output:\n${stdout}`);
  });
});

// ===== Static Files & Cache Headers =====
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path.endsWith('.js') || req.path.endsWith('.json') || req.path === '/' || req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  next();
});

app.use(express.static('.', {
  etag: false,
  lastModified: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.json')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    }
  }
}));

// ===== Start Server =====
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🌐 Public URL will be: https://kw-ua-community.duckdns.org`);
    console.log(`🔐 Firebase initialized: ${getApp().name}`);
  });
}

// Export for both CommonJS and ESM
module.exports = app;
module.exports.default = app;

// Modify email labels (e.g. mark read, archive)
app.post('/api/emails/:id/modify', async (req, res) => {
  try {
    const { addLabels, removeLabels } = req.body;
    const accessToken = await getGmailAccessToken();
    if (!accessToken) return res.status(401).json({ success: false, error: 'No token' });

    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${req.params.id}/modify`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        addLabelIds: addLabels || [],
        removeLabelIds: removeLabels || []
      })
    });

    if (!response.ok) throw new Error('Failed to modify email');
    res.json({ success: true });
  } catch (err) {
    console.error('Modify email error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trash an email
app.post('/api/emails/:id/trash', async (req, res) => {
  try {
    const accessToken = await getGmailAccessToken();
    if (!accessToken) return res.status(401).json({ success: false, error: 'No token' });

    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${req.params.id}/trash`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) throw new Error('Failed to trash email');
    res.json({ success: true });
  } catch (err) {
    console.error('Trash email error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
