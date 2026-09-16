const fs = require('fs');
let code = fs.readFileSync('admin.html', 'utf8');

const oldMailHtml = `<div id="emails-section" class="tab-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <h2>Пошта (ukrskw@gmail.com)</h2>
          <button class="btn" style="background: #0056b3; max-width: 150px;" onclick="window.loadEmails()">🔄 Оновити</button>
        </div>
        <div id="emails-list" style="max-height: 600px; overflow-y: auto;">
          Завантаження листів...
        </div>
      </div>`;

const newMailHtml = `<div id="emails-section" class="tab-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2>Пошта (ukrskw@gmail.com)</h2>
          <button class="btn" style="background: #0056b3; max-width: 150px;" onclick="window.loadEmails(window.currentMailFolder || 'inbox')">🔄 Оновити</button>
        </div>
        
        <div class="admin-tabs" style="margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: flex-start; border-bottom: 1px solid #ddd; padding-bottom: 0.5rem;">
          <div class="admin-tab active" id="mail-tab-inbox" onclick="window.switchMailFolder('inbox', this)" style="padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px;">📥 Вхідні</div>
          <div class="admin-tab" id="mail-tab-unread" onclick="window.switchMailFolder('unread', this)" style="padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px;">📩 Непрочитані</div>
          <div class="admin-tab" id="mail-tab-sent" onclick="window.switchMailFolder('sent', this)" style="padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px;">📤 Відправлені</div>
          <div class="admin-tab" id="mail-tab-spam" onclick="window.switchMailFolder('spam', this)" style="padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px;">🚫 Спам</div>
          <div class="admin-tab" id="mail-tab-trash" onclick="window.switchMailFolder('trash', this)" style="padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px;">🗑️ Видалені</div>
        </div>

        <div id="emails-list" style="max-height: 600px; overflow-y: auto;">
          Завантаження листів...
        </div>
      </div>`;

if(code.includes(oldMailHtml)) {
  code = code.replace(oldMailHtml, newMailHtml);
  fs.writeFileSync('admin.html', code);
  console.log("admin.html patched");
} else {
  console.log("Could not find old html");
}
