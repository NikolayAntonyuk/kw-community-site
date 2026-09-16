const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

const oldGetEmails = `app.get('/api/emails', async (req, res) => {
  try {
    const emailUser = 'ukrskw@gmail.com';
    let xoauth2Token;

    if (typeof GMAIL_REFRESH_TOKEN !== 'undefined' && GMAIL_REFRESH_TOKEN) {
      const accessToken = await getGmailAccessToken();
      if (accessToken) {
        xoauth2Token = Buffer.from([
          'user=' + emailUser,
          'auth=Bearer ' + accessToken,
          '', ''
        ].join('\x01')).toString('base64');
      }
    }

    if (!xoauth2Token) {
      console.log('[EMAIL] XOAUTH2 token not available - returning demo data');
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

    const emails = [];
    const imap = new Imap({
      xoauth2: xoauth2Token,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    });

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          console.error('[IMAP] Error opening inbox:', err.message);
          imap.end();
          return res.json({ success: true, emails: [], unreadCount: 0 });
        }

        imap.search(['ALL'], (err, results) => {
          if (err || !results || results.length === 0) {
            imap.closeBox(false, () => imap.end());
            return res.json({ success: true, emails: [], unreadCount: 0 });
          }

          const f = imap.fetch(results.slice(-20), { bodies: '' }); // Last 20 emails
          let fetchErr = false;

          f.on('message', (msg, seqno) => {
            const emailData = { seqno };

            msg.on('body', (stream) => {
              simpleParser(stream, (parseErr, parsedEmail) => {
                if (!parseErr) {
                  emailData.from = parsedEmail.from?.text || 'Unknown';
                  emailData.subject = parsedEmail.subject || '(no subject)';
                  emailData.text = (parsedEmail.text || parsedEmail.html || '').substring(0, 200);
                  emailData.date = parsedEmail.date || new Date();
                  emails.push(emailData);
                }
              });
            });

            msg.once('attributes', (attrs) => {
              emailData.flags = attrs.flags || [];
            });
          });

          f.once('error', (err) => {
            fetchErr = true;
            imap.closeBox(false, () => imap.end());
            return res.json({ success: true, emails: [], unreadCount: 0 });
          });

          f.once('end', () => {
            imap.closeBox(false, () => imap.end());
            setTimeout(() => {
              if (!fetchErr) {
                const unreadCount = emails.filter(e => !e.flags || !e.flags.includes('\\\\Seen')).length;
                res.json({
                  success: true,
                  emails: emails.sort((a, b) => new Date(b.date) - new Date(a.date)),
                  unreadCount
                });
              }
            }, 500);
          });
        });
      });
    });

    imap.once('error', (err) => {
      console.error('[IMAP] Connection error:', err.message);
      res.json({ success: true, emails: [], unreadCount: 0 });
    });

    imap.connect();
  } catch (err) {
    console.error('[IMAP] Error:', err.message);
    res.json({ success: true, emails: [], unreadCount: 0 });
  }
});`;

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

const oldPostReply = `app.post('/api/send-reply-email', async (req, res) => {
  try {
    const { to_email, subject, reply_text, original_subject } = req.body;

    if (!to_email || !reply_text) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const emailUser = 'ukrskw@gmail.com';
    let transporter;

    if (typeof GMAIL_REFRESH_TOKEN !== 'undefined' && GMAIL_REFRESH_TOKEN) {
      transporter = await getGmailTransporter();
    }

    if (!transporter) {
      return res.status(400).json({ success: false, error: 'OAuth2 Transporter not configured' });
    }

    const mailOptions = {
      from: emailUser,
      to: to_email,
      cc: emailUser,
      subject: \`Re: \${original_subject || subject || 'Reply'}\`,
      text: reply_text,
      html: \`<p>\${reply_text.replace(/\\n/g, '<br>')}</p>\`
    };

    await transporter.sendMail(mailOptions);
    console.log(\`[EMAIL] ✅ Reply sent to \${to_email}\`);
    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (err) {
    console.error('[EMAIL] Error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to send reply' });
  }
});`;

const newPostReply = `app.post('/api/send-reply-email', async (req, res) => {
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
    res.status(500).json({ success: false, error: 'Failed to send reply' });
  }
});`;


if (code.includes('imap.once(\'ready\'')) {
  code = code.replace(oldGetEmails, newGetEmails);
  code = code.replace(oldPostReply, newPostReply);
  fs.writeFileSync('server.js', code);
  console.log("Patched server.js successfully.");
} else {
  console.log("Could not find the old code. Ensure it wasn't already replaced.");
}
