import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const ADMIN_EMAILS = "mykola.antoniyk@gmail.com, tetyana.chuchkevych@gmail.com";
const form = document.getElementById("apply-form");
const submitBtn = document.getElementById("submit-btn");
const formMessage = document.getElementById("form-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  submitBtn.disabled = true;
  submitBtn.textContent = window.t ? window.t("apply_sending") : "Відправлення...";
  formMessage.className = "form-message";
  formMessage.textContent = "";

  const specialistData = {
    email: document.getElementById("f-email").value.trim(),
    name: document.getElementById("f-name").value.trim(),
    category: document.getElementById("f-category").value,
    subcategory: document.getElementById("f-subcategory").value.trim(),
    description: document.getElementById("f-description").value.trim(),
    locationType: document.getElementById("f-locationType").value.trim(),
    address: document.getElementById("f-address").value.trim(),
    phone: document.getElementById("f-phone").value.trim(),
    telegram: document.getElementById("f-telegram").value.trim(),
    instagram: document.getElementById("f-instagram").value.trim(),
    facebook: document.getElementById("f-facebook").value.trim(),
    website: document.getElementById("f-website").value.trim(),
    price: document.getElementById("f-price").value.trim(),
    notes: document.getElementById("f-notes").value.trim(),
    createdAt: serverTimestamp(),
    status: "pending"
  };


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

  try {
    const docRef = await addDoc(collection(db, "pending_specialists"), specialistData);
    
    try {
      const EMAILJS_SERVICE_ID = "service_e521b5c";
      const EMAILJS_TEMPLATE_ID = "template_kvwa447";
      const EMAILJS_PUBLIC_KEY = "064MymkRcVYVYhuJE";

      if (window.emailjs) {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        const currentHost = window.location.origin;
        const adminUrl = `${currentHost}/admin.html?id=${docRef.id}`;
        const catalogUrl = `${currentHost}/catalog.html`;
        const messageText = [
          `Підкатегорія: ${specialistData.subcategory}`,
          `Місто / Локація: ${specialistData.locationType}`,
          specialistData.address ? `Адреса: ${specialistData.address}` : null,
          specialistData.phone ? `Телефон: ${specialistData.phone}` : null,
          specialistData.email ? `Email: ${specialistData.email}` : null,
          specialistData.telegram ? `Telegram: ${specialistData.telegram}` : null,
          specialistData.instagram ? `Instagram: ${specialistData.instagram}` : null,
          specialistData.facebook ? `Facebook: ${specialistData.facebook}` : null,
          specialistData.website ? `Сайт: ${specialistData.website}` : null,
          specialistData.price ? `Ціна: ${specialistData.price}` : null,
          `Опис: ${specialistData.description || "Без додаткового опису"}`,
          specialistData.notes ? `Нотатки: ${specialistData.notes}` : null,
          "",
          `Редагувати заявку в адмінці:`,
          adminUrl,
          "",
          `Переглянути каталог:`,
          catalogUrl
        ].filter(line => line !== null).join("\n");

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_email: ADMIN_EMAILS,
          from_name: specialistData.name,
          category: specialistData.category,
          message: messageText,
          admin_link: adminUrl,
          spec_id: docRef.id
        });
      } else {
        console.warn("EmailJS Template ID для нових заявок не встановлено. Лист адміну не відправлено.");
      }
    } catch (e) {
      console.error("Помилка відправки email адміну: ", e);
    }

    formMessage.textContent = window.t ? window.t("apply_success") : "Ваша заявка успішно відправлена та очікує на модерацію!";
    formMessage.classList.add("success");
    form.reset();
  } catch (error) {
    console.error("Помилка відправлення заявки: ", error);
    formMessage.textContent = window.t ? window.t("apply_error") : "Сталася помилка при відправленні. Спробуйте пізніше.";
    formMessage.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = window.t ? window.t("apply_submit") : "Відправити заявку";
  }
});
