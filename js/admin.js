import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const authSection = document.getElementById("auth-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const authError = document.getElementById("auth-error");
const applicationsList = document.getElementById("applications-list");
const logoutBtn = document.getElementById("logout-btn");

// Handle Authentication State
onAuthStateChanged(auth, (user) => {
  if (user) {
    authSection.style.display = "none";
    dashboardSection.style.display = "block";
    loadApplications();
  } else {
    authSection.style.display = "block";
    dashboardSection.style.display = "none";
  }
});

// Handle Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    authError.style.display = "none";
  } catch (error) {
    authError.textContent = "Невірний email або пароль.";
    authError.style.display = "block";
  }
});

// Handle Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

// Load pending applications
async function loadApplications() {
  applicationsList.innerHTML = "Завантаження...";
  
  const q = query(collection(db, "pending_specialists"), where("status", "==", "pending"));
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      applicationsList.innerHTML = "<p>Немає нових заявок.</p>";
      return;
    }
    
    let html = "";
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      html += `
        <div class="application-card" id="card-${docSnap.id}">
          <h3><span id="display-name-${docSnap.id}">${data.name}</span> <small>(<span id="display-cat-${docSnap.id}">${data.category} > ${data.subcategory}</span>)</small></h3>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Опис:</strong> <span id="display-desc-${docSnap.id}">${data.description}</span></p>
          <p><strong>Локація:</strong> <span id="display-loc-${docSnap.id}">${data.locationType}</span></p>
          <p><strong>Телефон:</strong> <span id="display-phone-${docSnap.id}">${data.phone || '—'}</span></p>
          <p><strong>Вебсайт:</strong> <span id="display-web-${docSnap.id}">${data.website || '—'}</span></p>
          <div class="application-actions">
            <button class="btn btn-approve" onclick="window.approveApp('${docSnap.id}')">Підтвердити</button>
            <button class="btn btn-edit" style="background:#ffc107;color:black;" onclick="window.editApp('${docSnap.id}')">Редагувати</button>
            <button class="btn btn-reject" onclick="window.rejectApp('${docSnap.id}', '${data.email}', '${data.name}')">Відхилити</button>
          </div>
        </div>
      `;
    });
    applicationsList.innerHTML = html;
  } catch (error) {
    console.error("Помилка завантаження заявок: ", error);
    applicationsList.innerHTML = "<p style='color:red;'>Помилка завантаження. Перевірте консоль.</p>";
  }
}

// Global functions for inline handlers
window.approveApp = async (id) => {
  try {
    await updateDoc(doc(db, "pending_specialists", id), {
      status: "approved"
    });
    document.getElementById(`card-${id}`).remove();
    alert("Заявка підтверджена! Вона з'явиться в каталозі.");
  } catch (error) {
    alert("Помилка: " + error.message);
  }
};

window.rejectApp = async (id, userEmail, userName) => {
  const reason = prompt("Вкажіть причину відхилення (або залиште порожнім):");
  if (reason === null) return; // Cancelled
  
  try {
    await updateDoc(doc(db, "pending_specialists", id), {
      status: "rejected",
      rejectReason: reason
    });
    
    // ВАЖЛИВО: Замініть ці константи на ваші справжні ключі EmailJS
    const EMAILJS_SERVICE_ID = "service_e521b5c";
    const EMAILJS_TEMPLATE_ID = "template_gu2b17w"; // Вставте Template ID
    const EMAILJS_PUBLIC_KEY = "064MymkRcVYVYhuJE"; // Вставте Public Key

    if (EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID" && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: userEmail,
        to_name: userName,
        reject_reason: reason || "Не відповідає правилам спільноти."
      });
      console.log("Email sent successfully!");
    } else {
      console.warn("EmailJS не налаштовано повністю. Лист не відправлено.");
    }

    document.getElementById(`card-${id}`).remove();
    alert("Заявка відхилена.");
  } catch (error) {
    alert("Помилка: " + error.message);
  }
};

// Edit Application Modal logic
const editModalHTML = `
  <div id="edit-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999;">
    <div style="background:#fff; max-width:500px; margin:50px auto; padding:2rem; border-radius:8px;">
      <h2>Редагувати заявку</h2>
      <input type="hidden" id="edit-id">
      <div class="form-group"><label>Ім'я/Назва:</label><input type="text" id="edit-name"></div>
      <div class="form-group"><label>Опис:</label><input type="text" id="edit-desc"></div>
      <div class="form-group"><label>Телефон:</label><input type="text" id="edit-phone"></div>
      <div class="form-group"><label>Вебсайт:</label><input type="text" id="edit-web"></div>
      <div class="application-actions">
        <button class="btn btn-approve" onclick="window.saveEdit()">Зберегти</button>
        <button class="btn" onclick="document.getElementById('edit-modal').style.display='none'">Скасувати</button>
      </div>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', editModalHTML);

window.editApp = async (id) => {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-name').value = document.getElementById(`display-name-${id}`).innerText;
  document.getElementById('edit-desc').value = document.getElementById(`display-desc-${id}`).innerText;
  
  const phone = document.getElementById(`display-phone-${id}`).innerText;
  document.getElementById('edit-phone').value = phone === '—' ? '' : phone;
  
  const web = document.getElementById(`display-web-${id}`).innerText;
  document.getElementById('edit-web').value = web === '—' ? '' : web;
  
  document.getElementById('edit-modal').style.display = 'block';
};

window.saveEdit = async () => {
  const id = document.getElementById('edit-id').value;
  const newName = document.getElementById('edit-name').value;
  const newDesc = document.getElementById('edit-desc').value;
  const newPhone = document.getElementById('edit-phone').value;
  const newWeb = document.getElementById('edit-web').value;
  
  try {
    const docRef = doc(db, "pending_specialists", id);
    await updateDoc(docRef, {
      name: newName,
      description: newDesc,
      phone: newPhone,
      website: newWeb
    });
    
    // Update UI
    document.getElementById(`display-name-${id}`).innerText = newName;
    document.getElementById(`display-desc-${id}`).innerText = newDesc;
    document.getElementById(`display-phone-${id}`).innerText = newPhone || '—';
    document.getElementById(`display-web-${id}`).innerText = newWeb || '—';
    
    document.getElementById('edit-modal').style.display = 'none';
    alert("Зміни збережено!");
  } catch (error) {
    alert("Помилка: " + error.message);
  }
};
