const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

// 1. Update GET /api/emails query
const oldQueryLine = "const mailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:inbox&maxResults=20', {";
const newQueryLine = `    const folder = req.query.folder || 'inbox';
    let query = 'in:inbox';
    if (folder === 'sent') query = 'in:sent';
    else if (folder === 'trash') query = 'in:trash';
    else if (folder === 'spam') query = 'in:spam';
    else if (folder === 'unread') query = 'is:unread';
    
    const mailRes = await fetch(\`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=\${encodeURIComponent(query)}&maxResults=20\`, {`;

code = code.replace(oldQueryLine, newQueryLine);

// 2. Add To header to metadata so we can show "To: xxx" for Sent emails
const oldMetadata = `metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date\`, {`;
const newMetadata = `metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date\`, {`;
code = code.replace(oldMetadata, newMetadata);

// 3. Extract 'to' header
const oldFromHeader = `const fromHeader = headers.find(h => h.name.toLowerCase() === 'from')?.value || 'Unknown';`;
const newFromHeader = `const fromHeader = headers.find(h => h.name.toLowerCase() === 'from')?.value || 'Unknown';
      const toHeader = headers.find(h => h.name.toLowerCase() === 'to')?.value || 'Unknown';`;
code = code.replace(oldFromHeader, newFromHeader);

// 4. Push 'to' into emails array
const oldPush = `from: fromHeader,
        subject: subjectHeader,`;
const newPush = `from: fromHeader,
        to: toHeader,
        subject: subjectHeader,`;
code = code.replace(oldPush, newPush);

// 5. Update SEND REPLY EMAIL subject encoding
const oldSubject = "      `Subject: Re: ${original_subject || subject || 'Reply'}`,";
const newSubject = "      `Subject: =?UTF-8?B?${Buffer.from('Re: ' + (original_subject || subject || 'Reply')).toString('base64')}?=`,";
code = code.replace(oldSubject, newSubject);

fs.writeFileSync('server.js', code);
console.log("server.js updated successfully.");
