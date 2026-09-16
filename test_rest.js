require('dotenv').config();
async function run() {
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const GMAIL_OAUTH_CLIENT_ID = process.env.GMAIL_OAUTH_CLIENT_ID || '352202414760-mvu4oi0rh7r7gavqj4f1v9lnhd9fuj4b.apps.googleusercontent.com';
  const GMAIL_OAUTH_CLIENT_SECRET = process.env.GMAIL_OAUTH_CLIENT_SECRET;
  const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

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
  const accessToken = data.access_token;
  if(!accessToken) { console.log("No token:", data); return; }

  const mailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:inbox&maxResults=5', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const mailData = await mailRes.json();
  if(!mailData.messages) return;

  const emails = [];
  let unreadCount = 0;

  await Promise.all(mailData.messages.map(async (msgItem, index) => {
    const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgItem.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const msgDetails = await msgRes.json();
    
    const headers = msgDetails.payload?.headers || [];
    const fromHeader = headers.find(h => h.name.toLowerCase() === 'from')?.value || 'Unknown';
    const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '(no subject)';
    const dateHeader = headers.find(h => h.name.toLowerCase() === 'date')?.value || new Date();
    
    const isUnread = msgDetails.labelIds && msgDetails.labelIds.includes('UNREAD');
    const flags = isUnread ? [] : ['\\Seen'];
    if (isUnread) unreadCount++;

    emails.push({
      seqno: index + 1,
      from: fromHeader,
      subject: subjectHeader,
      text: msgDetails.snippet || '',
      date: dateHeader,
      flags: flags
    });
  }));

  console.log({
    success: true,
    emails: emails.sort((a, b) => new Date(b.date) - new Date(a.date)),
    unreadCount
  });
}
run();
