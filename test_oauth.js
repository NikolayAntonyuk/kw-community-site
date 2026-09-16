require('dotenv').config();
const Imap = require('imap');

async function run() {
  const GMAIL_OAUTH_CLIENT_ID = process.env.GMAIL_OAUTH_CLIENT_ID || '352202414760-mvu4oi0rh7r7gavqj4f1v9lnhd9fuj4b.apps.googleusercontent.com';
  const GMAIL_OAUTH_CLIENT_SECRET = process.env.GMAIL_OAUTH_CLIENT_SECRET;
  const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

  console.log("Exchanging token...");
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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
  console.log("Token response:", data);

  if (!data.access_token) return;

  const emailUser = 'ukrskw@gmail.com';
  const xoauth2Token = Buffer.from([
    'user=' + emailUser,
    'auth=Bearer ' + data.access_token,
    '', ''
  ].join('\x01')).toString('base64');

  const imap = new Imap({
    xoauth2: xoauth2Token,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    debug: console.log
  });

  imap.once('ready', () => {
    console.log('IMAP connected!');
    imap.end();
  });

  imap.once('error', (err) => {
    console.error('IMAP Error:', err);
  });

  imap.connect();
}
run();
