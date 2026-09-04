import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const specId = urlParams.get('id');
  
  if (specId) {
    document.getElementById('specialist-id').value = specId;
    document.getElementById('specialist-id-display').textContent = `#${specId}`;
  } else {
    document.getElementById('specialist-id-display').textContent = 'Не вказано';
  }

  const form = document.getElementById("feedback-form");
  const statusMsg = document.getElementById("status-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    btn.disabled = true;
    btn.textContent = "Надсилання...";

    try {
      await addDoc(collection(db, "feedback"), {
        specialistId: form.specialistId.value,
        senderName: form.senderName.value,
        contactInfo: form.contactInfo.value,
        message: form.message.value,
        createdAt: serverTimestamp(),
        status: "new" // status for admin panel tracking
      });

      try {
        const EMAILJS_SERVICE_ID = "service_e521b5c";
        const EMAILJS_TEMPLATE_ID = "template_kvwa447";
        const EMAILJS_PUBLIC_KEY = "064MymkRcVYVYhuJE";
        const ADMIN_EMAILS = "mykola.antoniyk@gmail.com, tetyana.chuchkevych@gmail.com";

        if (window.emailjs) {
          emailjs.init(EMAILJS_PUBLIC_KEY);
          
          const baseURL = window.location.origin + window.location.pathname.replace(/\/feedback\.html$/, '');
          const catalogLink = form.specialistId.value ? `${baseURL}/catalog.html?id=${form.specialistId.value}` : 'Не вказано (загальне)';
          const adminLink = form.specialistId.value ? `${baseURL}/admin.html#edit-live-${form.specialistId.value}` : `${baseURL}/admin.html`;
          
          const fullMessage = [
            `Контакт: ${form.contactInfo.value}`,
            "",
            `Повідомлення:`,
            form.message.value,
            "",
            `Переглянути в каталозі:`,
            catalogLink,
            "",
            `Відкрити для редагування в адмінці:`,
            adminLink
          ].join("\n");

          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_email: ADMIN_EMAILS,
            from_name: form.senderName.value,
            category: "Звіт про неточність" + (form.specialistId.value ? " (ID: " + form.specialistId.value + ")" : ""),
            message: fullMessage,
            admin_link: adminLink
          });
        }
      } catch (e) {
        console.error("Помилка відправки email адміну: ", e);
      }

      statusMsg.style.color = "green";
      statusMsg.textContent = "Дякуємо! Ваше повідомлення успішно надіслано адміністраторам.";
      form.reset();
    } catch (err) {
      console.error(err);
      statusMsg.style.color = "red";
      statusMsg.textContent = "Помилка при надсиланні. Спробуйте пізніше.";
    } finally {
      btn.disabled = false;
      btn.textContent = "Надіслати";
    }
  });
});
