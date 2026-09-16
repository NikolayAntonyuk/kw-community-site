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
  if(!accessToken) return;

  const emailText = [
    'Content-Type: text/html; charset="UTF-8"',
    'MIME-Version: 1.0',
    `To: mykola.antoniyk@gmail.com`,
    `From: ukrskw@gmail.com`,
    `Subject: Re: Test from REST API`,
    '',
    `<p>This is a test of the REST API send functionality.</p>`
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

  const sendData = await sendRes.json();
  console.log("Send response:", sendData);
}
run();
