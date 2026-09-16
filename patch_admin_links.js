const fs = require('fs');
let code = fs.readFileSync('js/admin.js', 'utf8');

// The exact string to replace
const oldLine = 'onclick="window.resolveFeedback(\'${docSnap.id}\', decodeURIComponent(\'${encodedMsg}\'), decodeURIComponent(\'${encodeURIComponent(data.contactInfo || "").replace(/\\\'/g, "%27")}\'))">Позначити як вирішене</button>';
const newLine = 'onclick="window.resolveFeedback(\'${docSnap.id}\', decodeURIComponent(\'${encodedMsg}\'), decodeURIComponent(\'${encodeURIComponent(data.contactInfo || "").replace(/\\\'/g, "%27")}\'), \\`${data.specialistId || ""}\\`)">Позначити як вирішене</button>';

if (code.includes(oldLine)) {
  code = code.replace(oldLine, newLine);
  console.log("Replaced button render logic.");
} else {
  console.log("Could not find button render exact match.");
  process.exit(1);
}

// 2. Replace the block from resolveFeedback down to window.closeResolutionEmailModal
const startStr = 'window.resolveFeedback = async (id, messageText, contactInfo) => {';
const endStr = 'window.closeResolutionEmailModal = () => {';

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);
if (startIdx === -1 || endIdx === -1) {
    console.error("Could not find the function block to replace");
    process.exit(1);
}
const oldBlock = code.substring(startIdx, endIdx);

const newBlock = `window.resolveFeedback = async (id, messageText, contactInfo, specialistId) => {
  const emailMatch = contactInfo.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';
  window.showResolutionChoiceModal(id, email, specialistId);
};

window.showResolutionChoiceModal = (docId, email, specialistId) => {
  let modal = document.getElementById("resolution-choice-modal");
  if (!modal) {
    const html = \`<div id="resolution-choice-modal" hidden style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:none;align-items:center;justify-content:center;z-index:2000;overflow-y:auto;padding:1rem;">
      <div style="background:white;padding:2rem;border-radius:8px;max-width:500px;width:90%;box-shadow:0 4px 16px rgba(0,0,0,0.2);text-align:center;">
        <h2 style="margin-bottom:1rem;">Надіслати резолюцію автору?</h2>
        <p style="margin-bottom:2rem;color:#666;">Ви хочете відправити лист-подяку про те, що дані було успішно оновлено?</p>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          <button class="btn btn-approve" style="background:#28a745;width:100%;" onclick="window.confirmResolutionChoice('yes')">ТАК (відкрити чернетку листа)</button>
          <button class="btn btn-approve" style="background:#ffc107;color:black;width:100%;" onclick="window.confirmResolutionChoice('no')">НІ (просто заархівувати звіт)</button>
          <button class="btn" style="background:#6c757d;width:100%;" onclick="window.closeResolutionChoiceModal()">Відмінити (закрити вікно)</button>
        </div>
      </div>
    </div>\`;
    document.body.insertAdjacentHTML("beforeend", html);
    modal = document.getElementById("resolution-choice-modal");
  }

  window.currentResolutionFeedbackId = docId;
  window.currentResolutionEmail = email;
  window.currentResolutionSpecialistId = specialistId;
  
  modal.style.display = "flex";
  modal.removeAttribute("hidden");
};

window.closeResolutionChoiceModal = () => {
  const modal = document.getElementById("resolution-choice-modal");
  if (modal) {
    modal.setAttribute("hidden", "");
    modal.style.display = "none";
  }
};

window.confirmResolutionChoice = async (choice) => {
  window.closeResolutionChoiceModal();
  const id = window.currentResolutionFeedbackId;
  const email = window.currentResolutionEmail;
  const specId = window.currentResolutionSpecialistId;
  
  if (choice === 'yes') {
    window.showResolutionEmailModal(id, email, specId);
  } else if (choice === 'no') {
    try {
      await updateDoc(doc(db, "feedback", id), {
        status: "resolved",
        resolvedAt: serverTimestamp()
      });
      const card = document.getElementById(\`fb-card-\${id}\`);
      if (card) card.remove();
      showAdminAlert("Звіт позначено як вирішений!");
    } catch (error) {
      showAdminAlert("Помилка: " + error.message);
    }
  }
};

window.showResolutionEmailModal = (docId, email, specialistId) => {
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
          <textarea id="res-email-text" style="width:100%;height:200px;padding:0.75rem;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;font-family:inherit;"></textarea>
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
  
  let draftText = "Вітаємо!\\n\\nДякуємо за ваш відгук. Повідомляємо, що дані були успішно перевірені та оновлені!\\n";
  if (specialistId && specialistId !== 'undefined' && specialistId !== '') {
    draftText += "\\nВи можете переглянути оновлену картку за цим посиланням:\\nhttps://ukrainianskw.ca/specialist.html?id=" + specialistId + "\\n";
  }
  draftText += "\\nДякуємо, що допомагаєте покращувати наш каталог та берете активну участь у житті громади.\\n\\nЗ повагою,\\nКоманда Разом KW";
  
  document.getElementById("res-email-text").value = draftText;
  
  modal.style.display = "flex";
  modal.removeAttribute("hidden");
};

`;

code = code.replace(oldBlock, newBlock);
fs.writeFileSync('js/admin.js', code);
console.log("Successfully replaced block.");
