const fs = require('fs');
let code = fs.readFileSync('js/feedback.js', 'utf8');

// Replace addDoc with fetch
const oldAddDoc = `await addDoc(collection(db, "feedback"), {
        specialistId: form.specialistId.value,
        senderName: form.senderName.value,
        contactInfo: form.contactInfo.value,
        message: form.message.value,
        createdAt: serverTimestamp(),
        status: "new" // status for admin panel tracking
      });`;
      
const newAddDoc = `const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specialistId: form.specialistId.value,
          senderName: form.senderName.value,
          contactInfo: form.contactInfo.value,
          message: form.message.value
        })
      });
      if (!response.ok) {
        throw new Error('Failed to submit feedback to backend');
      }`;

if (code.includes(oldAddDoc)) {
  code = code.replace(oldAddDoc, newAddDoc);
  console.log("Replaced addDoc with fetch.");
} else {
  console.log("Could not find addDoc block.");
}

// Add catalogLink definition
const oldAdminLink = `const adminLink = form.specialistId.value ? \`\${baseURL}/admin.html?id=\${form.specialistId.value}&feedback=\${encodedFeedback}#edit-live-\${form.specialistId.value}\` : \`\${baseURL}/admin.html\`;`;
const newAdminLink = `const catalogLink = form.specialistId.value ? \`\${baseURL}/catalog.html?id=\${form.specialistId.value}\` : \`\${baseURL}/catalog.html\`;
          const adminLink = form.specialistId.value ? \`\${baseURL}/admin.html?id=\${form.specialistId.value}&feedback=\${encodedFeedback}#edit-live-\${form.specialistId.value}\` : \`\${baseURL}/admin.html\`;`;

if (code.includes(oldAdminLink)) {
  code = code.replace(oldAdminLink, newAdminLink);
  console.log("Fixed catalogLink ReferenceError.");
} else {
  console.log("Could not find adminLink block.");
}

// Remove imports of db, collection, addDoc, serverTimestamp if they are no longer needed
// Actually, db is used? Wait, they are imported but we don't strictly need to remove them for it to work.
// But let's leave them or clean them up.

fs.writeFileSync('js/feedback.js', code);
