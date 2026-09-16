const fs = require('fs');
let code = fs.readFileSync('js/admin.js', 'utf8');

const oldCodeStart = 'window.resolveFeedback = async (id, messageText, contactInfo) => {';
const oldCodeEnd = 'window.showResolutionEmailModal = (docId, email) => {'; // we replace up to this

// Find the precise block
const startIdx = code.indexOf(oldCodeStart);
const endIdx = code.indexOf(oldCodeEnd);
if (startIdx === -1 || endIdx === -1) {
    console.error("Could not find the block to replace");
    process.exit(1);
}

const oldBlock = code.substring(startIdx, endIdx);

const newBlock = `window.resolveFeedback = async (id, messageText, contactInfo) => {
  const emailMatch = contactInfo.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';
  window.showResolutionChoiceModal(id, email);
};

window.showResolutionChoiceModal = (docId, email) => {
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
  
  if (choice === 'yes') {
    window.showResolutionEmailModal(id, email);
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

`;

code = code.replace(oldBlock, newBlock);
fs.writeFileSync('js/admin.js', code);
console.log("Successfully replaced block.");
