const fs = require('fs');
const file = '/home/mykola/kw-community-site/js/apply.js';
let content = fs.readFileSync(file, 'utf8');

const validationLogic = `
  const hasContact = [
    specialistData.phone,
    specialistData.telegram,
    specialistData.instagram,
    specialistData.facebook,
    specialistData.website
  ].some(contact => contact && contact.trim() !== "");

  if (!hasContact) {
    formMessage.textContent = window.t ? window.t("apply_no_contacts_error") || "Будь ласка, вкажіть хоча б один контакт (Телефон, Telegram, Instagram, Facebook або Вебсайт)." : "Будь ласка, вкажіть хоча б один контакт (Телефон, Telegram, Instagram, Facebook або Вебсайт).";
    formMessage.classList.add("error");
    submitBtn.disabled = false;
    submitBtn.textContent = window.t ? window.t("apply_submit") : "Відправити заявку";
    return;
  }

  try {`;

content = content.replace('  try {', validationLogic);
fs.writeFileSync(file, content, 'utf8');
