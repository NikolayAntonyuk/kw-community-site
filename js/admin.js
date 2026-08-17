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

// Зрозумілі повідомлення замість сирих кодів Firebase
function describeAuthError(error) {
  switch (error.code) {
    case "auth/configuration-not-found":
      return "Firebase Authentication не увімкнено в проєкті. Відкрий Firebase Console → Authentication → Get started → Sign-in method → Email/Password → Enable.";
    case "auth/operation-not-allowed":
      return "Вхід через Email/Password вимкнено. Увімкни його в Firebase Console → Authentication → Sign-in method.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Невірний email або пароль. Переконайся, що цього користувача створено в Firebase Console → Authentication → Users.";
    case "auth/invalid-email":
      return "Некоректний формат email.";
    case "auth/too-many-requests":
      return "Забагато спроб входу. Спробуй за кілька хвилин.";
    case "auth/network-request-failed":
      return "Немає зв'язку з Firebase. Перевір інтернет-з'єднання.";
    default:
      return "Помилка входу: " + error.message;
  }
}

// Handle Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    authError.style.display = "none";
  } catch (error) {
    authError.textContent = describeAuthError(error);
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
      const createdStr = data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toLocaleDateString("uk-UA") : (data.createdAt ? new Date(data.createdAt).toLocaleDateString("uk-UA") : 'Невідомо');
      const updatedStr = data.updatedAt && typeof data.updatedAt.toDate === 'function' ? data.updatedAt.toDate().toLocaleDateString("uk-UA") : (data.updatedAt ? new Date(data.updatedAt).toLocaleDateString("uk-UA") : 'Невідомо');
      html += `
        <div class="application-card" id="card-${docSnap.id}">
          <h3><span style="color:#007bff; font-family:monospace;">#${docSnap.id}</span> <span id="display-name-${docSnap.id}">${data.name}</span> <small>(<span id="display-cat-${docSnap.id}">${data.category} > ${data.subcategory}</span>)</small></h3>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Опис:</strong> <span id="display-desc-${docSnap.id}">${data.description}</span></p>
          <p><strong>Локація:</strong> <span id="display-loc-${docSnap.id}">${data.locationType}</span></p>
          <p><strong>Телефон:</strong> <span id="display-phone-${docSnap.id}">${data.phone || '—'}</span></p>
          <p><strong>Вебсайт:</strong> <span id="display-web-${docSnap.id}">${data.website || '—'}</span></p>
          <div class="application-actions">
            <button class="btn btn-approve" onclick="window.approveApp('${docSnap.id}')">Підтвердити</button>
            <button class="btn btn-edit" style="background:#ffc107;color:black;" onclick="window.editApp('${docSnap.id}', false)">Редагувати</button>
            <button class="btn btn-reject" onclick="window.rejectApp('${docSnap.id}', '${data.email || ''}', '${data.name}')">Відхилити</button>
          </div>
          <p class="card-admin-dates">ID: ${docSnap.id} | Створено: ${createdStr} | Відредаговано: ${updatedStr}</p>
        </div>
      `;
    });
    applicationsList.innerHTML = html;

    // Scroll to specific application if hash is present
    if (window.location.hash) {
      setTimeout(() => {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetElement.style.border = "2px solid #007bff";
          targetElement.style.boxShadow = "0 0 10px rgba(0,123,255,0.5)";
        }
      }, 100);
    }

  } catch (error) {
    console.error("Помилка завантаження заявок: ", error);
    applicationsList.innerHTML = "<p style='color:red;'>Помилка завантаження. Перевірте консоль.</p>";
  }
}

// Global functions for inline handlers
window.approveApp = async (id) => {
  if (!confirm("Ви впевнені, що хочете підтвердити цю заявку?")) return;
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
    
    const EMAILJS_SERVICE_ID = "service_e521b5c";
    const EMAILJS_TEMPLATE_ID = "template_gu2b17w";
    const EMAILJS_PUBLIC_KEY = "064MymkRcVYVYhuJE";
    
    let trimmedEmail = userEmail ? userEmail.trim() : "";

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      alert("Заявку відхилено. Лист не відправлено, оскільки у спеціаліста немає валідного email.");
    } else {
      if (EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID" && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_email: trimmedEmail,
          to_name: userName,
          reject_reason: reason || "Не відповідає правилам спільноти."
        });
        console.log("Email sent successfully to: " + trimmedEmail);
        alert("Заявка відхилена. Лист успішно відправлено!");
      } else {
        console.warn("EmailJS не налаштовано повністю. Лист не відправлено.");
        alert("Заявка відхилена.");
      }
    }
    
    document.getElementById(`card-${id}`).remove();
  } catch (error) {
    alert("Помилка при відхиленні: " + error.message);
  }
};

// Edit Application Modal logic
const editModalHTML = `
  <div id="edit-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999;">
    <div style="background:#fff; max-width:500px; margin:50px auto; padding:2rem; border-radius:8px;">
      <h2>Редагувати заявку</h2>
      <input type="hidden" id="edit-id">
      <input type="hidden" id="edit-islive">
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

window.editApp = async (id, isLive = false) => {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-islive').value = isLive ? "true" : "false";
  
  let prefix = isLive ? 'live-' : '';
  document.getElementById('edit-name').value = document.getElementById(`${prefix}display-name-${id}`).innerText;
  document.getElementById('edit-desc').value = document.getElementById(`${prefix}display-desc-${id}`).innerText;
  
  const phone = document.getElementById(`${prefix}display-phone-${id}`).innerText;
  document.getElementById('edit-phone').value = phone === '—' ? '' : phone;
  
  const web = document.getElementById(`${prefix}display-web-${id}`).innerText;
  document.getElementById('edit-web').value = web === '—' ? '' : web;
  
  document.getElementById('edit-modal').style.display = 'block';
};

window.saveEdit = async () => {
  if (!confirm("Ви впевнені, що хочете зберегти ці зміни?")) return;
  const id = document.getElementById('edit-id').value;
  const isLive = document.getElementById('edit-islive').value === "true";
  const newName = document.getElementById('edit-name').value;
  const newDesc = document.getElementById('edit-desc').value;
  const newPhone = document.getElementById('edit-phone').value;
  const newWeb = document.getElementById('edit-web').value;
  
  try {
    if (isLive) {
      // Create an edit request in Firebase that sync.js will merge
      import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js").then(async (firestore) => {
        await firestore.addDoc(firestore.collection(db, "pending_specialists"), {
          id: id,
          name: newName,
          description: newDesc,
          phone: newPhone,
          website: newWeb,
          updatedAt: firestore.serverTimestamp(),
          status: "approved"
        });
      });
      alert("Зміни збережено в базу! Вони з'являться в каталозі після наступної синхронізації GitHub (за кілька хвилин).");
    } else {
      // Update pending doc
      const docRef = doc(db, "pending_specialists", id);
      import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js").then(async (firestore) => {
        await updateDoc(docRef, {
          name: newName,
          description: newDesc,
          phone: newPhone,
          website: newWeb,
          updatedAt: firestore.serverTimestamp()
        });
      });
      alert("Зміни збережено!");
    }
    
    // Update UI
    let prefix = isLive ? 'live-' : '';
    document.getElementById(`${prefix}display-name-${id}`).innerText = newName;
    document.getElementById(`${prefix}display-desc-${id}`).innerText = newDesc;
    document.getElementById(`${prefix}display-phone-${id}`).innerText = newPhone || '—';
    document.getElementById(`${prefix}display-web-${id}`).innerText = newWeb || '—';
    
    document.getElementById('edit-modal').style.display = 'none';
  } catch (error) {
    alert("Помилка: " + error.message);
  }
};

window.deleteLiveApp = async (id) => {
  if (!confirm("Ви впевнені, що хочете видалити цього спеціаліста з каталогу?")) return;
  try {
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js").then(async (firestore) => {
      await firestore.addDoc(firestore.collection(db, "pending_specialists"), {
        id: id,
        status: "deleted"
      });
    });
    alert("Запит на видалення надіслано! Спеціаліст зникне з каталогу після наступної синхронізації (за кілька хвилин).");
    const el = document.getElementById(`live-card-${id}`);
    if (el) el.style.display = 'none';
  } catch (error) {
    alert("Помилка при видаленні: " + error.message);
  }
};

// --- Live Catalog Fetcher ---
let liveCatalogData = [];
let liveCatalogFiltered = [];
let liveCatalogPageSize = 50;
let liveCatalogCurrentPage = 1;

async function loadLiveCatalog() {
  const liveList = document.getElementById("live-catalog-list");
  if (!liveList) return;
  liveList.innerHTML = "Завантаження каталогу...";
  
  try {
    // Add cache buster to ensure fresh data
    const res = await fetch(`data/specialists.json?v=${new Date().getTime()}`);
    if (!res.ok) throw new Error("Failed to fetch catalog");
    const data = await res.json();
    
    if (!data || data.length === 0) {
      liveList.innerHTML = "<p>Каталог порожній.</p>";
      const emptyPagination = document.getElementById("live-pagination");
      if (emptyPagination) emptyPagination.innerHTML = "";
      return;
    }
    
    // Reverse once so newest is first
    liveCatalogData = data.reverse();
    // Assign random ID to any item that missed one
    liveCatalogData.forEach(item => {
      if (!item.id) item.id = Math.random().toString(36).substr(2, 9);
    });
    
    liveCatalogFiltered = [...liveCatalogData];
    renderLiveCatalog();
  } catch (error) {
    console.error("Error loading live catalog:", error);
    liveList.innerHTML = "<p style='color:red;'>Помилка завантаження каталогу.</p>";
  }
}

window.filterLiveCatalog = (query) => {
  liveCatalogCurrentPage = 1;
  if (!query) {
    liveCatalogFiltered = [...liveCatalogData];
  } else {
    const lower = query.toLowerCase();
    liveCatalogFiltered = liveCatalogData.filter(item => 
      (item.name || "").toLowerCase().includes(lower) ||
      (item.description || "").toLowerCase().includes(lower) ||
      (item.id || "").toLowerCase().includes(lower) ||
      (item.category || "").toLowerCase().includes(lower) ||
      (item.subcategory || "").toLowerCase().includes(lower)
    );
  }
  renderLiveCatalog();
};

window.prevLivePage = () => {
  if (liveCatalogCurrentPage > 1) {
    liveCatalogCurrentPage--;
    renderLiveCatalog();
  }
};

window.nextLivePage = () => {
  const maxPage = Math.ceil(liveCatalogFiltered.length / liveCatalogPageSize);
  if (liveCatalogCurrentPage < maxPage) {
    liveCatalogCurrentPage++;
    renderLiveCatalog();
  }
};

function renderLiveCatalog() {
  const liveList = document.getElementById("live-catalog-list");
  if (!liveList) return;
  
  const start = (liveCatalogCurrentPage - 1) * liveCatalogPageSize;
  const end = start + liveCatalogPageSize;
  const recent = liveCatalogFiltered.slice(start, end);
  
  const maxPage = Math.ceil(liveCatalogFiltered.length / liveCatalogPageSize) || 1;
  
  // Pagination bar lives outside #live-catalog-list so the search field
  // above it never gets re-created (and never loses focus) while typing.
  const pagination = document.getElementById("live-pagination");
  if (pagination) {
    pagination.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: #f8f9fa; padding: 10px; border-radius: 5px;">
        <button class="btn" style="flex: 0 0 auto; padding: 8px 20px; background: ${liveCatalogCurrentPage === 1 ? '#ccc' : '#007bff'}"
                onclick="window.prevLivePage()" ${liveCatalogCurrentPage === 1 ? 'disabled' : ''}>← Назад</button>
        <strong>Сторінка ${liveCatalogCurrentPage} з ${maxPage} <span style="font-weight:normal; color:#666;">(Всього: ${liveCatalogFiltered.length})</span></strong>
        <button class="btn" style="flex: 0 0 auto; padding: 8px 20px; background: ${liveCatalogCurrentPage === maxPage ? '#ccc' : '#007bff'}"
                onclick="window.nextLivePage()" ${liveCatalogCurrentPage === maxPage ? 'disabled' : ''}>Далі →</button>
      </div>
    `;
  }

  let html = "";

  if (recent.length === 0) {
    html += "<p>Нічого не знайдено за вашим запитом.</p>";
  }
  
  recent.forEach((item) => {
    const itemId = item.id;
    const createdStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString("uk-UA") : '—';
    const updatedStr = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("uk-UA") : '—';

    html += `
      <div class="application-card" id="live-card-${itemId}">
        <h3><span style="color:#007bff; font-family:monospace;">#${itemId}</span> <span id="live-display-name-${itemId}">${item.name}</span> <small>(<span id="live-display-cat-${itemId}">${item.category} > ${item.subcategory}</span>)</small></h3>
        <p><strong>Опис:</strong> <span id="live-display-desc-${itemId}">${item.description || ''}</span></p>
        <p><strong>Локація:</strong> <span id="live-display-loc-${itemId}">${item.locationType || ''}</span></p>
        <p><strong>Телефон:</strong> <span id="live-display-phone-${itemId}">${item.phone || '—'}</span></p>
        <p><strong>Вебсайт:</strong> <span id="live-display-web-${itemId}">${item.website || '—'}</span></p>
        <div class="application-actions">
          <button class="btn btn-edit" style="background:#ffc107;color:black;" onclick="window.editApp('${itemId}', true)">Редагувати</button>
          <button class="btn btn-reject" onclick="window.deleteLiveApp('${itemId}')">Видалити</button>
        </div>
        <p class="card-admin-dates">ID: ${itemId} | Створено: ${createdStr} | Відредаговано: ${updatedStr}</p>
      </div>
    `;
  });
  
  liveList.innerHTML = html;
}

window.loadLiveCatalog = loadLiveCatalog;

// Hook into loadApplications so it loads both
const originalLoad = loadApplications;
loadApplications = async () => {
  await originalLoad();
  await loadLiveCatalog();
};


