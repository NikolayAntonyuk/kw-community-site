const fs = require('fs');
let code = fs.readFileSync('js/admin.js', 'utf8');

// Find loadFeedback where it renders resolveFeedback button
const oldRenderBtn = '<button class="btn btn-approve" style="background: #28a745;" onclick="window.resolveFeedback(\'${docSnap.id}\')">Позначити як вирішене</button>';
const newRenderBtn = '<button class="btn btn-approve" style="background: #28a745;" onclick="window.resolveFeedback(\'${docSnap.id}\', decodeURIComponent(\'${encodedMsg}\'), decodeURIComponent(\'${encodeURIComponent(data.contactInfo || "")}\'))">Позначити як вирішене</button>';

code = code.replace(oldRenderBtn, newRenderBtn);

// Replace the resolveFeedback function
const oldResolveFeedback = `window.resolveFeedback = async (id) => {
  if (!confirm("Закрити цей звіт?")) return;
  try {
    await updateDoc(doc(db, "feedback", id), {
      status: "resolved",
      resolvedAt: serverTimestamp()
    });
    document.getElementById(\`fb-card-\${id}\`).remove();
    showAdminAlert("Звіт позначено як вирішений!");
  } catch (error) {
    showAdminAlert("Помилка: " + error.message);
  }
};`;

const newResolveFeedback = `window.resolveFeedback = async (id, messageText, contactInfo) => {
  const emailMatch = contactInfo.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';
  
  if (confirm("Надіслати резолюцію автору (лист-подяку)?\\n\\nOK (Так) - відкрити чернетку листа.\\nCancel (Ні) - просто архівувати звіт.")) {
    window.showResolutionEmailModal(id, email);
  } else {
    // Resolve without email
    if (!confirm("Закрити цей звіт і архівувати без листа?")) return;
    try {
      await updateDoc(doc(db, "feedback", id), {
        status: "resolved",
        resolvedAt: serverTimestamp()
      });
      document.getElementById(\`fb-card-\${id}\`).remove();
      showAdminAlert("Звіт позначено як вирішений!");
    } catch (error) {
      showAdminAlert("Помилка: " + error.message);
    }
  }
};

window.showResolutionEmailModal = (docId, email) => {
  let modal = document.getElementById("resolution-email-modal");
  if (!modal) {
    const html = \`<div id="resolution-email-modal" hidden style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:none;align-items:center;justify-content:center;z-index:2000;overflow-y:auto;padding:1rem;">
      <div style="background:white;padding:2rem;border-radius:8px;max-width:700px;width:90%;box-shadow:0 4px 16px rgba(0,0,0,0.2);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
          <h2>Надіслати резолюцію</h2>
          <button type="button" class="btn" style="background:#6c757d;width:auto;" onclick="window.closeResolutionEmailModal()">✕ Закрити</button>
        </div>
        
        <div class="form-group" style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:bold;">Кому (Email):</label>
          <input type="email" id="res-email-to" style="width:100%;padding:0.75rem;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;">
        </div>
        
        <div class="form-group" style="margin-bottom:1rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:bold;">Тема листа:</label>
          <input type="text" id="res-email-subject" value="Дякуємо за ваш звіт про неточність!" style="width:100%;padding:0.75rem;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;">
        </div>

        <div class="form-group" style="margin-bottom:1.5rem;">
          <label style="display:block;margin-bottom:0.5rem;font-weight:bold;">Повідомлення (Чернетка):</label>
          <textarea id="res-email-text" style="width:100%;height:150px;padding:0.75rem;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;font-family:inherit;">Вітаємо!

Дякуємо за ваш відгук. Повідомляємо, що дані були успішно перевірені та оновлені! 
Дякуємо, що допомагаєте покращувати наш каталог та берете активну участь у житті громади.

З повагою,
Команда Разом KW</textarea>
        </div>
        
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button class="btn btn-approve" style="flex:1;min-width:200px;background:#28a745;" onclick="window.sendResolutionAndResolve()">Відправити та вирішити</button>
          <button class="btn" style="flex:1;background:#6c757d;min-width:140px;" onclick="window.closeResolutionEmailModal()">Скасувати</button>
        </div>
      </div>
    </div>\`;
    document.body.insertAdjacentHTML("beforeend", html);
    modal = document.getElementById("resolution-email-modal");
  }

  window.currentResolutionFeedbackId = docId;
  document.getElementById("res-email-to").value = email;
  modal.style.display = "flex";
  modal.removeAttribute("hidden");
};

window.closeResolutionEmailModal = () => {
  const modal = document.getElementById("resolution-email-modal");
  if (modal) {
    modal.setAttribute("hidden", "");
    modal.style.display = "none";
  }
};

window.sendResolutionAndResolve = async () => {
  const docId = window.currentResolutionFeedbackId;
  const toEmail = document.getElementById("res-email-to").value.trim();
  const subject = document.getElementById("res-email-subject").value.trim();
  const message = document.getElementById("res-email-text").value.trim();
  
  if (!toEmail) {
    alert("Будь ласка, вкажіть email отримувача.");
    return;
  }
  
  try {
    const btn = document.querySelector("#resolution-email-modal .btn-approve");
    const oldText = btn.innerText;
    btn.innerText = "Відправка...";
    btn.disabled = true;

    // Send email using existing API endpoint
    const response = await fetch(\`\${window.apiBaseUrl}/api/send-reply-email\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to_email: toEmail,
        subject: subject,
        original_subject: "", // not a reply to specific thread
        reply_text: message
      })
    });

    const result = await response.json();
    btn.innerText = oldText;
    btn.disabled = false;

    if (result.success) {
      showAdminAlert("✅ Лист успішно відправлено!");
      window.closeResolutionEmailModal();
      
      // Resolve feedback
      await updateDoc(doc(db, "feedback", docId), {
        status: "resolved",
        resolvedAt: serverTimestamp()
      });
      const card = document.getElementById(\`fb-card-\${docId}\`);
      if (card) card.remove();
      showAdminAlert("Звіт позначено як вирішений!");
    } else {
      showAdminAlert("❌ Помилка відправки: " + result.error);
    }
  } catch (error) {
    showAdminAlert("❌ Помилка: " + error.message);
  }
};`;

code = code.replace(oldResolveFeedback, newResolveFeedback);
fs.writeFileSync('js/admin.js', code);
