require('dotenv').config();
const nodemailer = require('nodemailer');

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
  if(!accessToken) { console.log("NO TOKEN"); return; }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'ukrskw@gmail.com',
      clientId: GMAIL_OAUTH_CLIENT_ID,
      clientSecret: GMAIL_OAUTH_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
      accessToken
    }
  });

  try {
    await transporter.verify();
    console.log("SMTP verify success");
  } catch (err) {
    console.error("SMTP verify error:", err.message);
  }
}
run();
