import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseConfig from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
        message: form.message.value,
        createdAt: new Date().toISOString()
      });
      statusMsg.style.color = "green";
      statusMsg.textContent = "Дякуємо! Ваше повідомлення надіслано.";
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
