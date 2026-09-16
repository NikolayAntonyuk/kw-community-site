const fs = require('fs');
let code = fs.readFileSync('js/admin.js', 'utf8');

const startIdx = code.indexOf('window.showEmailDetail = (idx) => {');
const endIdx = code.indexOf('};', code.indexOf('document.getElementById("email-reply-form").style.display = "block";', startIdx)) + 2;

if(startIdx > 0 && endIdx > startIdx) {
  const newDetail = `window.showEmailDetail = (idx) => {
  let modal = document.getElementById("email-detail-modal");
  if (!modal) {
    const html = \`<div id="email-detail-modal" hidden style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:none;align-items:center;justify-content:center;z-index:2000;overflow-y:auto;padding:1rem;">
      <div style="background:white;padding:2rem;border-radius:8px;max-width:700px;width:90%;box-shadow:0 4px 16px rgba(0,0,0,0.2);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
          <h2>Деталі листа</h2>
          <button type="button" class="btn" style="background:#6c757d;width:auto;" onclick="window.closeEmailModal()">✕ Закрити</button>
        </div>
        <div id="email-detail-content" style="margin-bottom:1.5rem;"></div>
        <hr style="margin:1.5rem 0;">
        <div id="email-reply-form" style="display:none;">
          <h3>Відповідь</h3>
          <textarea id="reply-text" placeholder="Напишіть відповідь..." style="width:100%;height:120px;padding:0.75rem;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;margin-bottom:1rem;"></textarea>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn btn-approve" style="flex:1;" onclick="window.sendEmailReply()">Відправити відповідь</button>
            <button class="btn" style="flex:1;background:#6c757d;" onclick="document.getElementById('email-reply-form').style.display='none';">Скасувати</button>
          </div>
        </div>
      </div>
    </div>\`;
    document.body.insertAdjacentHTML("beforeend", html);
    modal = document.getElementById("email-detail-modal");
  }

  // Load email data from window.currentEmailsList
  const email = window.currentEmailsList && window.currentEmailsList[idx];
  if (!email) return;

  const subject = email.subject || '';
  const fromText = email.from ? (email.from.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/)?.[0] || email.from) : 'Unknown';
  const toText = email.to ? (email.to.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/)?.[0] || email.to) : 'Unknown';
  const dateText = new Date(email.date).toLocaleString('uk-UA');
  const fullText = email.text || 'No content';

  window.currentEmailIdx = idx;
  
  // If we are looking at sent folder, reply to the original recipient, else reply to the sender
  if (window.currentMailFolder === 'sent') {
    window.currentEmailFrom = toText;
  } else {
    window.currentEmailFrom = fromText;
  }
  
  window.currentEmailSubject = subject.replace(/^[\\s🔵📧]+/, ''); // strip emoji

  let contactLine = "";
  if (window.currentMailFolder === 'sent') {
    contactLine = \`<div><strong>Кому:</strong> \${toText}</div><div><strong>Від:</strong> \${fromText}</div>\`;
  } else {
    contactLine = \`<div><strong>Від:</strong> \${fromText}</div>\`;
  }

  const detailHtml = \`
    <strong style="font-size:1.2rem;display:block;margin-bottom:0.5rem;">\${subject}</strong>
    <div style="color:#666;font-size:0.95rem;margin-bottom:1rem;">
      \${contactLine}
      <div><strong>Дата:</strong> \${dateText}</div>
    </div>
    <div style="background:#f8f9fa;padding:1rem;border-radius:4px;white-space:pre-wrap;font-size:1rem;line-height:1.5;">\${fullText}</div>
  \`;
  
  document.getElementById("email-detail-content").innerHTML = detailHtml;
  document.getElementById("reply-text").value = "";
  
  // Show reply form only if it's not Spam/Trash (or always show it, up to you)
  document.getElementById("email-reply-form").style.display = "block";
  modal.style.display = "flex";
};`;

  code = code.substring(0, startIdx) + newDetail + code.substring(endIdx);
  fs.writeFileSync('js/admin.js', code);
  console.log("admin.js detail modal patched successfully");
} else {
  console.log("Could not find detail modal bounds", startIdx, endIdx);
}
