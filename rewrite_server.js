const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

// Ensure dotenv is loaded
if (!code.includes("require('dotenv').config()")) {
  code = "require('dotenv').config();\n" + code;
}

// Ensure fetch is available at top if not there
if (!code.includes("const fetch = (...args)")) {
  code = code.replace("require('dotenv').config();", "require('dotenv').config();\nconst fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));");
}

// 1. Rewrite GET /api/emails
const startGet = code.indexOf("app.get('/api/emails'");
const endGet = code.indexOf("});", code.indexOf("res.json({ success: true, emails: [], unreadCount: 0 });", startGet)) + 3;

const newGetEmails = `app.get('/api/emails', async (req, res) => {
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
});`;

if(startGet > 0) code = code.substring(0, startGet) + newGetEmails + code.substring(endGet);


// 2. Rewrite POST /api/send-reply-email
const startSend = code.indexOf("app.post('/api/send-reply-email'");
const endSend = code.indexOf("});", code.indexOf("res.status(500).json({ success: false, error: err.message });", startSend)) + 3;

const newSend = `app.post('/api/send-reply-email', async (req, res) => {
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
});`;

if(startSend > 0) code = code.substring(0, startSend) + newSend + code.substring(endSend);


// Ensure getGmailAccessToken is intact and correctly positioned (it might already be there, but let's make sure it is updated to properly use process.env values)
const getGmailRegex = /async function getGmailAccessToken\(\) \{[\s\S]*?\}/;
const newGetGmail = `async function getGmailAccessToken() {
  const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
  const GMAIL_OAUTH_CLIENT_ID = process.env.GMAIL_OAUTH_CLIENT_ID || '352202414760-mvu4oi0rh7r7gavqj4f1v9lnhd9fuj4b.apps.googleusercontent.com';
  const GMAIL_OAUTH_CLIENT_SECRET = process.env.GMAIL_OAUTH_CLIENT_SECRET;
  
  if (!GMAIL_REFRESH_TOKEN) return null;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GMAIL_OAUTH_CLIENT_ID,
      client_secret: GMAIL_OAUTH_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    })
  });
  const data = await res.json();
  return data.access_token || null;
}`;

if (code.match(getGmailRegex)) {
  code = code.replace(getGmailRegex, newGetGmail);
} else {
  // Append it if missing
  code += "\n\n" + newGetGmail;
}

// Remove old app.get('/api/emails-v2' if present
const v2Match = /app\.get\('\/api\/emails-v2'[\s\S]*?\}\);\n/g;
code = code.replace(v2Match, '');

// Save file
fs.writeFileSync('server.js', code);
console.log("Rewrote server.js successfully.");
