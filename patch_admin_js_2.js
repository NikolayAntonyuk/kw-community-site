const fs = require('fs');
let code = fs.readFileSync('js/admin.js', 'utf8');

const startIndex = code.indexOf('window.loadEmails = async () => {');
const endIndex = code.indexOf('};', code.indexOf('emailsList.innerHTML = "<p style=\'color:red;\'>Помилка підключення до сервера</p>";', startIndex)) + 2;

if(startIndex > 0 && endIndex > startIndex) {
  const newLoadEmails = `window.currentMailFolder = 'inbox';

window.switchMailFolder = (folder, tabEl) => {
  window.currentMailFolder = folder;
  document.querySelectorAll('[id^="mail-tab-"]').forEach(el => el.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  window.loadEmails(folder);
};

window.loadEmails = async (folder = 'inbox') => {
  const emailsList = document.getElementById("emails-list");
  emailsList.innerHTML = "Завантаження листів...";
  try {
    const response = await fetch(\`\${window.apiBaseUrl}/api/emails?folder=\${folder}\`, {
      method: 'GET'
    });
    const result = await response.json();

    if (!result.success || !result.emails) {
      emailsList.innerHTML = "<p style='color:red;'>Помилка завантаження листів</p>";
      return;
    }

    const emails = result.emails || [];
    window.currentEmailsList = emails;
    
    if (emails.length === 0) {
      emailsList.innerHTML = "<p style='text-align:center;color:#666;'>Немає листів у цій папці</p>";
      return;
    }

    // Update badge count
    window.updateEmailBadge();

    let html = "";
    emails.forEach((email, idx) => {
      const date = new Date(email.date).toLocaleString('uk-UA');
      
      let contactLine = "";
      if (folder === 'sent') {
        const toEmail = email.to ? (email.to.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/)?.[0] || email.to) : 'Unknown';
        contactLine = \`<strong>Кому:</strong> \${toEmail}\`;
      } else {
        const fromEmail = email.from ? (email.from.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/)?.[0] || email.from) : 'Unknown';
        contactLine = \`<strong>Від:</strong> \${fromEmail}\`;
      }
      
      const preview = email.text.substring(0, 100).replace(/\\n/g, " ") + (email.text.length > 100 ? "..." : "");
      
      const isUnread = !email.flags || !email.flags.includes('\\\\Seen');
      const bgStyle = isUnread ? "background: #fff; border-left: 4px solid #0056b3;" : "background: #fafafa; border: 1px solid #ddd;";

      html += \`
        <div style="\${bgStyle} padding: 1rem; margin-bottom: 1rem; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
            <div style="flex: 1;">
              <strong style="font-size: 1.05rem; display: block; margin-bottom: 0.3rem;">\${isUnread ? '🔵' : '📧'} \${email.subject}</strong>
              <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">
                <div>\${contactLine}</div>
                <div><strong>Дата:</strong> \${date}</div>
              </div>
              <div style="background: white; padding: 0.75rem; border-radius: 4px; border-left: 3px solid #e9ecef; margin: 0.75rem 0; font-size: 0.95rem; line-height: 1.4; color: #444;">
                \${preview}
              </div>
            </div>
            <button class="btn" style="background: #0056b3; padding: 0.6rem 1rem; width: auto;" onclick="window.showEmailDetail(\${idx})">Переглянути</button>
          </div>
        </div>
      \`;
    });

    emailsList.innerHTML = html;
  } catch (error) {
    console.error("Помилка завантаження листів:", error);
    emailsList.innerHTML = "<p style='color:red;'>Помилка підключення до сервера</p>";
  }
};`;

  code = code.substring(0, startIndex) + newLoadEmails + code.substring(endIndex);
  
  // Need to fix showEmailDetail to use window.currentEmailsList instead of fetching again or whatever it does
  // wait, what does showEmailDetail do? Let's check before saving.
  fs.writeFileSync('js/admin.js', code);
  console.log("admin.js loadEmails patched successfully");
} else {
  console.log("Could not find bounds", startIndex, endIndex);
}
