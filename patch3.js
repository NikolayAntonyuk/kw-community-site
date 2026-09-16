const fs = require('fs');
const lines = fs.readFileSync('server.js', 'utf8').split('\n');

// 1. Add dotenv to top
lines.unshift("require('dotenv').config();");
lines.unshift("const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));");

const newCode = lines.join('\n');

// Find boundaries
const startGet = newCode.indexOf("// 12. GET EMAILS");
const startSend = newCode.indexOf("// 13. SEND REPLY EMAIL");
const startScheduled = newCode.indexOf("// ===== Scheduled Tasks =====");

const beforeGet = newCode.substring(0, startGet);
const afterScheduled = newCode.substring(startScheduled);

const middleCode = `// 12. GET EMAILS from REST API
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
            flags: ['\\\\Seen']
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

    const mailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:inbox&maxResults=20', {
      headers: { Authorization: \`Bearer \${accessToken}\` }
    });
    const mailData = await mailRes.json();
    if (!mailData.messages) {
      return res.json({ success: true, emails: [], unreadCount: 0 });
    }

    const emails = [];
    let unreadCount = 0;

    await Promise.all(mailData.messages.map(async (msgItem, index) => {
      const msgRes = await fetch(\`https://gmail.googleapis.com/gmail/v1/users/me/messages/\${msgItem.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date\`, {
        headers: { Authorization: \`Bearer \${accessToken}\` }
      });
      const msgDetails = await msgRes.json();
      
      const headers = msgDetails.payload?.headers || [];
      const fromHeader = headers.find(h => h.name.toLowerCase() === 'from')?.value || 'Unknown';
      const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '(no subject)';
      const dateHeader = headers.find(h => h.name.toLowerCase() === 'date')?.value || new Date().toISOString();
      
      const isUnread = msgDetails.labelIds && msgDetails.labelIds.includes('UNREAD');
      const flags = isUnread ? [] : ['\\\\Seen'];
      if (isUnread) unreadCount++;

      emails.push({
        seqno: index + 1,
        from: fromHeader,
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

    const emailText = [
      'Content-Type: text/html; charset="UTF-8"',
      'MIME-Version: 1.0',
      \`To: \${to_email}\`,
      \`From: \${emailUser}\`,
      \`Subject: Re: \${original_subject || subject || 'Reply'}\`,
      '',
      \`<p>\${reply_text.replace(/\\n/g, '<br>')}</p>\`
    ].join('\\r\\n');

    const raw = Buffer.from(emailText).toString('base64').replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
    
    const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { 
        'Authorization': \`Bearer \${accessToken}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw })
    });

    if (!sendRes.ok) {
      throw new Error('Failed to send email via Gmail API');
    }

    console.log(\`[EMAIL] ✅ Reply sent to \${to_email}\`);
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
      res.send(\`<html><body style="font-family:sans-serif;max-width:600px;margin:50px auto;padding:20px">
        <h2>✅ Авторизація успішна!</h2>
        <p>Збережи цей <strong>refresh token</strong> і надішли мені (Миколі):</p>
        <textarea readonly style="width:100%;height:80px;font-size:12px;padding:10px;border:2px solid #28a745;border-radius:8px">\${data.refresh_token}</textarea>
        <p style="color:#666;font-size:13px">Токен діє безстроково (поки не відкликаєш доступ у Google Account).</p>
      </body></html>\`);
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

`;

fs.writeFileSync('server.js', beforeGet + middleCode + afterScheduled);
