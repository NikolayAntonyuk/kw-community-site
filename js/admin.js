import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, query, where, getDocs, getDoc, updateDoc, doc, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// GLOBAL: Switch between admin tabs
window.goToPage = function(tabElement, contentId) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));

  // Show selected content
  const content = document.getElementById(contentId);
  if (content) {
    content.classList.add('active');
  }

  // Mark tab as active
  if (tabElement && tabElement.classList) {
    tabElement.classList.add('active');
  } else if (contentId) {
    const tab = document.getElementById('tab-' + contentId.replace('-section', '').replace('-', '-'));
    if (tab) tab.classList.add('active');
  }
};

window.showAdminAlert = function(htmlMsg) {
  let m = document.getElementById("custom-alert-modal");
  if (!m) {
    const html = `<div id="custom-alert-modal" class="modal" aria-hidden="true" hidden style="z-index: 1000;"><div class="modal-dialog" style="max-width: 400px; padding: 1.5rem; text-align: center;"><div id="custom-alert-message" style="margin-bottom: 1.5rem; font-size: 1.1rem; line-height: 1.4;"></div><button class="btn btn-approve" onclick="document.getElementById('custom-alert-modal').setAttribute('hidden', '');" style="width: 100%;">Зрозуміло</button></div></div>`;
    document.body.insertAdjacentHTML("beforeend", html);
    m = document.getElementById("custom-alert-modal");
  }
  document.getElementById("custom-alert-message").innerHTML = htmlMsg;
  m.removeAttribute("hidden");
};

window.closeInaccuracyReport = function() {
  const modal = document.getElementById("inaccuracy-modal");
  if (modal) {
    modal.setAttribute("hidden", "");
    modal.style.display = "none";
  }
};

window.openInaccuracyReport = function(specId, specName) {
  let modal = document.getElementById("inaccuracy-modal");
  if (!modal) {
    const html = `<div id="inaccuracy-modal" hidden style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:none;align-items:center;justify-content:center;z-index:2000;">
      <div style="background:white;padding:2rem;border-radius:8px;max-width:500px;width:90%;box-shadow:0 4px 16px rgba(0,0,0,0.2);">
        <h2>⚠️ Звіт про неточність</h2>
        <p><strong>Спеціаліст:</strong> <span id="report-spec-name">${specName}</span> (ID: <span id="report-spec-id">${specId}</span>)</p>
        <div style="margin:1.5rem 0;">
          <label style="display:block;margin-bottom:0.5rem;">Ваше ім'я:</label>
          <input type="text" id="report-sender-name" placeholder="Ім'я" style="width:100%;padding:0.75rem;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;">
        </div>
        <div style="margin:1.5rem 0;">
          <label style="display:block;margin-bottom:0.5rem;">Контакт (email/telegram):</label>
          <input type="text" id="report-contact" placeholder="ваш@email.com" style="width:100%;padding:0.75rem;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;">
        </div>
        <div style="margin:1.5rem 0;">
          <label style="display:block;margin-bottom:0.5rem;">Що саме неточно:</label>
          <textarea id="report-message" placeholder="Опишіть неточність..." style="width:100%;padding:0.75rem;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;min-height:100px;"></textarea>
        </div>
        <div style="display:flex;gap:1rem;margin-top:1.5rem;">
          <button type="button" class="btn btn-approve" style="flex:1;" onclick="window.submitInaccuracyReport('${specId}')">Відправити</button>
          <button type="button" class="btn" id="inaccuracy-cancel-btn" style="flex:1;background:#ccc;color:#000;" onclick="window.closeInaccuracyReport()">Скасувати</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", html);
    modal = document.getElementById("inaccuracy-modal");

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        window.closeInaccuracyReport();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && !modal.hasAttribute("hidden")) {
        window.closeInaccuracyReport();
      }
    });
  }
  document.getElementById("report-spec-id").textContent = specId;
  document.getElementById("report-spec-name").textContent = specName;
  document.getElementById("report-sender-name").value = "";
  document.getElementById("report-contact").value = "";
  document.getElementById("report-message").value = "";
  modal.removeAttribute("hidden");
  modal.style.display = "flex";
};

window.submitInaccuracyReport = async function(specId) {
  const senderName = document.getElementById("report-sender-name").value.trim();
  const contact = document.getElementById("report-contact").value.trim();
  const message = document.getElementById("report-message").value.trim();

  if (!senderName || !contact || !message) {
    showAdminAlert("Будь ласка, заповніть усі поля.");
    return;
  }

  try {
    await addDoc(collection(db, "feedback"), {
      specialistId: specId,
      senderName: senderName,
      contactInfo: contact,
      message: message,
      status: 'new',
      createdAt: serverTimestamp()
    });

    window.closeInaccuracyReport();
    showAdminAlert("✅ Звіт успішно відправлено! Дякуємо за допомогу.");
  } catch (error) {
    showAdminAlert("Помилка при відправленні звіту: " + error.message);
  }
};

const authSection = document.getElementById("auth-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const authError = document.getElementById("auth-error");
const applicationsList = document.getElementById("applications-list");
const logoutBtn = document.getElementById("logout-btn");
const logoutBtnMenu = document.getElementById("logout-btn-menu");
const emailBadgeBtn = document.getElementById("email-badge-btn");
const refreshBtn = document.getElementById("refresh-btn");

// Handle logout from main button
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.reload();
  });
}

// Handle logout from menu button
if (logoutBtnMenu) {
  logoutBtnMenu.addEventListener("click", async () => {
    await signOut(auth);
    window.location.reload();
  });
}

// Handle email badge click
if (emailBadgeBtn) {
  emailBadgeBtn.addEventListener("click", async () => {
    await window.goToEmailSection();
  });
}

// Handle Authentication State
onAuthStateChanged(auth, (user) => {
  window.currentUser = user;
  if (user) {
    authSection.style.display = "none";
    dashboardSection.style.display = "block";
    logoutBtn.style.display = "inline-block";
    if (refreshBtn) refreshBtn.style.display = "inline-block";
    showAdminPanelWhenLogged();
    // Update email badge periodically
    window.updateEmailBadge();
    setInterval(() => window.updateEmailBadge(), 60000); // Every minute
    loadApplications();
  } else {
    authSection.style.display = "block";
    dashboardSection.style.display = "none";
    logoutBtn.style.display = "none";
    if (refreshBtn) refreshBtn.style.display = "none";
    showAdminPanelWhenLogged();
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
          <p><strong>Локація:</strong> <span id="display-loc-${docSnap.id}">${data.locationType || '—'}</span></p>
          <p><strong>Адреса:</strong> <span id="display-address-${docSnap.id}">${data.address || '—'}</span></p>
          <p><strong>Ціна:</strong> <span id="display-price-${docSnap.id}">${data.price || '—'}</span></p>
          <p><strong>Нотатки:</strong> <span id="display-notes-${docSnap.id}">${data.notes || '—'}</span></p>
          <p><strong>Телефон:</strong> <span id="display-phone-${docSnap.id}">${data.phone || '—'}</span></p>
          <p><strong>Telegram:</strong> <span id="display-tg-${docSnap.id}">${data.telegram || '—'}</span></p>
          <p><strong>Instagram:</strong> <span id="display-inst-${docSnap.id}">${data.instagram || '—'}</span></p>
          <p><strong>Facebook:</strong> <span id="display-fb-${docSnap.id}">${data.facebook || '—'}</span></p>
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
    showAdminAlert("Заявку підтверджено!");
    fetch("/api/sync", {method: "POST"}).catch(console.error);
  } catch (error) {
    showAdminAlert("Помилка: " + error.message);
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

    let trimmedEmail = userEmail ? userEmail.trim() : "";

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      showAdminAlert("Заявку відхилено. Лист не відправлено, оскільки у спеціаліста немає валідного email.");
    } else {
      try {
        const response = await fetch('/api/send-rejection-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to_email: trimmedEmail,
            to_name: userName,
            reject_reason: reason || "Не відповідає правилам спільноти."
          })
        });

        const result = await response.json();
        if (result.success) {
          showAdminAlert("Заявка відхилена. Лист успішно відправлено від ukrskw@gmail.com!");
        } else {
          showAdminAlert("Заявка відхилена, але помилка при надсиланні листа: " + (result.error || "unknown"));
        }
      } catch (emailError) {
        console.error("Error sending rejection email:", emailError);
        showAdminAlert("Заявка відхилена, але помилка при надсиланні листа.");
      }
    }

    document.getElementById(`card-${id}`).remove();
  } catch (error) {
    showAdminAlert("Помилка при відхиленні: " + error.message);
  }
};

// Edit Application Modal logic


window.copyFeedbackText = () => {
  const helperText = document.getElementById('feedback-helper-text');
  const btn = document.getElementById('btn-copy-feedback');
  if (helperText && helperText.innerText) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(helperText.innerText).then(() => {
        if (btn) {
          const oldText = btn.innerHTML;
          btn.innerHTML = "✅ Скопійовано!";
          setTimeout(() => { btn.innerHTML = oldText; }, 2000);
        }
      }).catch(err => {
        console.warn("Clipboard copy failed, selecting text:", err);
        const range = document.createRange();
        range.selectNodeContents(helperText);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      });
    } else {
      const range = document.createRange();
      range.selectNodeContents(helperText);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
};

window.editApp = async (id, isLive = false, feedbackMsg = "") => {
  document.getElementById('form-title').innerText = "Редагувати заявку";
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-islive').value = isLive ? "true" : "false";
  
  const helperContainer = document.getElementById('feedback-helper-container');
  const helperText = document.getElementById('feedback-helper-text');
  
  // 1. If not passed directly, check URL query parameters
  if (!feedbackMsg) {
    const urlParams = new URLSearchParams(window.location.search);
    feedbackMsg = urlParams.get('feedback') || urlParams.get('msg') || '';
  }

  // 2. If still empty, check Firestore for active "new" error reports for this specialist ID
  if (!feedbackMsg && typeof db !== 'undefined' && id) {
    try {
      const qFb = query(collection(db, "feedback"), where("specialistId", "==", String(id)), where("status", "==", "new"));
      const fbSnap = await getDocs(qFb);
      if (!fbSnap.empty) {
        const msgs = [];
        fbSnap.forEach(d => {
          const dData = d.data();
          if (dData && dData.message) msgs.push(dData.message);
        });
        if (msgs.length > 0) {
          feedbackMsg = msgs.join("\n\n---\n\n");
        }
      }
    } catch (e) {
      console.warn("Could not check feedback reports for specialist:", e);
    }
  }

  if (feedbackMsg) {
    helperText.innerText = feedbackMsg;
    helperContainer.style.display = 'block';
  } else {
    helperText.innerText = "";
    helperContainer.style.display = 'none';
  }
  
  let name="", desc="", cat="", subcat="", loc="", address="", phone="", tg="", inst="", fb="", web="", price="", notes="";

  let prefix = isLive ? 'live-' : '';
  const nameEl = document.getElementById(`${prefix}display-name-${id}`);
  
  if (nameEl) {
    name = nameEl.innerText || "";
    desc = (document.getElementById(`${prefix}display-desc-${id}`) || {}).innerText || "";
    const catEl = document.getElementById(`${prefix}display-cat-${id}`);
    const catText = (catEl ? catEl.innerText : "").split(" > ");
    cat = (catText[0] || '').trim();
    subcat = (catText[1] || '').trim();
    loc = (document.getElementById(`${prefix}display-loc-${id}`) || {}).innerText || "";
    address = (document.getElementById(`${prefix}display-address-${id}`) || {}).innerText || "";
    phone = (document.getElementById(`${prefix}display-phone-${id}`) || {}).innerText || "";
    tg = (document.getElementById(`${prefix}display-tg-${id}`) || {}).innerText || "";
    inst = (document.getElementById(`${prefix}display-inst-${id}`) || {}).innerText || "";
    fb = (document.getElementById(`${prefix}display-fb-${id}`) || {}).innerText || "";
    web = (document.getElementById(`${prefix}display-web-${id}`) || {}).innerText || "";
    price = (document.getElementById(`${prefix}display-price-${id}`) || {}).innerText || "";
    notes = (document.getElementById(`${prefix}display-notes-${id}`) || {}).innerText || "";
  } else {
    let item = null;
    if (typeof liveCatalogData !== 'undefined' && Array.isArray(liveCatalogData) && liveCatalogData.length > 0) {
      item = liveCatalogData.find(i => String(i.id) === String(id));
    }

    if (!item) {
      try {
        const res = await fetch(`data/specialists.json?v=${new Date().getTime()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            liveCatalogData = data;
            item = liveCatalogData.find(i => String(i.id) === String(id));
          }
        }
      } catch (e) {
        console.warn("Could not fetch specialists.json:", e);
      }
    }

    if (!item && typeof db !== 'undefined') {
      try {
        const docSnap = await getDoc(doc(db, "pending_specialists", String(id)));
        if (docSnap && docSnap.exists && docSnap.exists()) {
          item = { id: docSnap.id, ...docSnap.data() };
        }
      } catch (e) {
        console.warn("Firestore lookup in pending_specialists failed:", e);
      }
    }

    if (item) {
      name = item.name || '';
      desc = item.description || '';
      cat = item.category || '';
      subcat = item.subcategory || '';
      loc = item.locationType || '';
      address = item.address || '';
      phone = item.phone || '';
      tg = item.telegram || '';
      inst = item.instagram || '';
      fb = item.facebook || '';
      web = item.website || '';
      price = item.price || '';
      notes = item.notes || '';
    }
  }

  document.getElementById('edit-name').value = name;
  document.getElementById('edit-desc').value = desc;
  document.getElementById('edit-category').value = cat;
  document.getElementById('edit-subcategory').value = subcat;
  
  document.getElementById('edit-loc').value = loc === '—' ? '' : loc;
  document.getElementById('edit-address').value = address === '—' ? '' : address;
  document.getElementById('edit-phone').value = phone === '—' ? '' : phone;
  document.getElementById('edit-tg').value = tg === '—' ? '' : tg;
  document.getElementById('edit-inst').value = inst === '—' ? '' : inst;
  document.getElementById('edit-fb').value = fb === '—' ? '' : fb;
  document.getElementById('edit-web').value = web === '—' ? '' : web;
  document.getElementById('edit-price').value = price === '—' ? '' : price;
  document.getElementById('edit-notes').value = notes === '—' ? '' : notes;
  
  // Navigate to form section, hide tabs
  document.querySelector('.admin-tabs').style.display = 'none';
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById('form-section').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.showAddForm = () => {
  document.getElementById('form-title').innerText = "Додати спеціаліста";
  document.getElementById('edit-id').value = "";
  document.getElementById('edit-islive').value = "true"; // Added directly to live
  
  const helperContainer = document.getElementById('feedback-helper-container');
  const helperText = document.getElementById('feedback-helper-text');
  if (helperContainer) helperContainer.style.display = 'none';
  if (helperText) helperText.innerText = "";

  document.getElementById('edit-name').value = "";
  document.getElementById('edit-desc').value = "";
  document.getElementById('edit-category').value = "";
  document.getElementById('edit-subcategory').value = "";
  document.getElementById('edit-loc').value = "";
  document.getElementById('edit-address').value = "";
  document.getElementById('edit-phone').value = "";
  document.getElementById('edit-tg').value = "";
  document.getElementById('edit-inst').value = "";
  document.getElementById('edit-fb').value = "";
  document.getElementById('edit-web').value = "";
  document.getElementById('edit-price').value = "";
  document.getElementById('edit-notes').value = "";
  
  // Navigate to form section
  document.querySelector('.admin-tabs').style.display = 'none';
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById('form-section').classList.add('active');
};

window.cancelForm = () => {
  const helperContainer = document.getElementById('feedback-helper-container');
  const helperText = document.getElementById('feedback-helper-text');
  if (helperContainer) helperContainer.style.display = 'none';
  if (helperText) helperText.innerText = "";

  const activeTab = document.querySelector('.admin-tab.active');
  console.log('[ADMIN] cancelForm: activeTab before tabs show', activeTab ? activeTab.id : 'none');

  document.querySelector('.admin-tabs').style.display = 'flex';
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

  if (activeTab) {
    if (activeTab.id === 'tab-new-apps') {
      console.log('[ADMIN] Restoring tab: new-apps');
      document.getElementById('new-apps').classList.add('active');
    }
    else if (activeTab.id === 'tab-live-catalog') {
      console.log('[ADMIN] Restoring tab: live-catalog');
      document.getElementById('live-catalog').classList.add('active');
    }
    else if (activeTab.id === 'tab-rejected-apps') {
      console.log('[ADMIN] Restoring tab: rejected-apps');
      document.getElementById('rejected-apps').classList.add('active');
    }
    else if (activeTab.id === 'tab-feedback') {
      console.log('[ADMIN] Restoring tab: feedback-section');
      document.getElementById('feedback-section').classList.add('active');
    }
    else if (activeTab.id === 'tab-archived-catalog') {
      console.log('[ADMIN] Restoring tab: archived-catalog');
      document.getElementById('archived-catalog').classList.add('active');
    }
  } else {
    console.log('[ADMIN] No activeTab found, defaulting to live-catalog');
    document.getElementById('live-catalog').classList.add('active');
  }
};


window.saveEdit = async () => {
  let id = document.getElementById('edit-id').value;
  const isLive = document.getElementById('edit-islive').value === "true";
  const newName = document.getElementById('edit-name').value;
  const newDesc = document.getElementById('edit-desc').value;
  const newCategory = document.getElementById('edit-category').value;
  const newSubcategory = document.getElementById('edit-subcategory').value;
  const newLoc = document.getElementById('edit-loc').value;
  const newAddress = document.getElementById('edit-address').value;
  const newPhone = document.getElementById('edit-phone').value;
  const newTg = document.getElementById('edit-tg').value;
  const newInst = document.getElementById('edit-inst').value;
  const newFb = document.getElementById('edit-fb').value;
  const newWeb = document.getElementById('edit-web').value;
  const newPrice = document.getElementById('edit-price').value;
  const newNotes = document.getElementById('edit-notes').value;

  if (!confirm("Зберегти зміни?")) return;

  try {
    console.log('[ADMIN] saveEdit called', { id, isLive, name: newName });
    let msg = "";
    const payload = {
      name: newName,
      description: newDesc,
      category: newCategory,
      subcategory: newSubcategory,
      locationType: newLoc,
      address: newAddress,
      phone: newPhone,
      telegram: newTg,
      instagram: newInst,
      facebook: newFb,
      website: newWeb,
      price: newPrice,
      notes: newNotes,
      status: "approved"
    };

    if (!id) {
      console.log('[ADMIN] Creating new specialist');
      await addDoc(collection(db, "pending_specialists"), {
        name: newName,
        description: newDesc,
        category: newCategory,
        subcategory: newSubcategory,
        locationType: newLoc,
        address: newAddress,
        phone: newPhone,
        telegram: newTg,
        instagram: newInst,
        facebook: newFb,
        website: newWeb,
        price: newPrice,
        notes: newNotes,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "approved"
      });
      msg = "Спеціаліста успішно додано!";
    } else if (isLive) {
      console.log('[ADMIN] Updating live specialist via new document approach', { id });
      await addDoc(collection(db, "pending_specialists"), {
        id: id,
        name: newName,
        description: newDesc,
        category: newCategory,
        subcategory: newSubcategory,
        locationType: newLoc,
        address: newAddress,
        phone: newPhone,
        telegram: newTg,
        instagram: newInst,
        facebook: newFb,
        website: newWeb,
        price: newPrice,
        notes: newNotes,
        updatedAt: serverTimestamp(),
        status: "approved"
      });
      msg = "✅ Зміни успішно збережено в базі!";
    } else {
      console.log('[ADMIN] Updating pending specialist', { id });
      await updateDoc(doc(db, "pending_specialists", id), {
        name: newName,
        description: newDesc,
        category: newCategory,
        subcategory: newSubcategory,
        locationType: newLoc,
        address: newAddress,
        phone: newPhone,
        telegram: newTg,
        instagram: newInst,
        facebook: newFb,
        website: newWeb,
        price: newPrice,
        notes: newNotes,
        updatedAt: serverTimestamp()
      });
      msg = "✅ Зміни успішно збережено!";
    }

    if (id && document.getElementById('live-display-name-' + id) && isLive) {
      document.getElementById('live-display-name-' + id).innerText = newName;
      document.getElementById('live-display-cat-' + id).innerText = `${newCategory} > ${newSubcategory}`;
      document.getElementById('live-display-desc-' + id).innerText = newDesc;
      document.getElementById('live-display-loc-' + id).innerText = newLoc || '—';
      document.getElementById('live-display-address-' + id).innerText = newAddress || '—';
      document.getElementById('live-display-phone-' + id).innerText = newPhone || '—';
      document.getElementById('live-display-tg-' + id).innerText = newTg || '—';
      document.getElementById('live-display-inst-' + id).innerText = newInst || '—';
      document.getElementById('live-display-fb-' + id).innerText = newFb || '—';
      document.getElementById('live-display-web-' + id).innerText = newWeb || '—';
      document.getElementById('live-display-price-' + id).innerText = newPrice || '—';
      document.getElementById('live-display-notes-' + id).innerText = newNotes || '—';
    } else if (id && document.getElementById('display-name-' + id) && !isLive) {
      document.getElementById('display-name-' + id).innerText = newName;
      document.getElementById('display-cat-' + id).innerText = `${newCategory} > ${newSubcategory}`;
      document.getElementById('display-desc-' + id).innerText = newDesc;
      document.getElementById('display-loc-' + id).innerText = newLoc || '—';
      document.getElementById('display-address-' + id).innerText = newAddress || '—';
      document.getElementById('display-phone-' + id).innerText = newPhone || '—';
      document.getElementById('display-tg-' + id).innerText = newTg || '—';
      document.getElementById('display-inst-' + id).innerText = newInst || '—';
      document.getElementById('display-fb-' + id).innerText = newFb || '—';
      document.getElementById('display-web-' + id).innerText = newWeb || '—';
      document.getElementById('display-price-' + id).innerText = newPrice || '—';
      document.getElementById('display-notes-' + id).innerText = newNotes || '—';
    }

    showAdminAlert(msg);
    window.cancelForm();
    if (!id || isLive) {
      if (id && isLive) {
        const item = liveCatalogData.find(i => String(i.id) === String(id));
        if (item) {
          item.name = newName;
          item.description = newDesc;
          item.category = newCategory;
          item.subcategory = newSubcategory;
          item.locationType = newLoc;
          item.address = newAddress;
          item.phone = newPhone;
          item.telegram = newTg;
          item.instagram = newInst;
          item.facebook = newFb;
          item.website = newWeb;
          item.price = newPrice;
          item.notes = newNotes;
        }
      } else if (!id) {
        const newItem = {
          id: id,
          name: newName,
          description: newDesc,
          category: newCategory,
          subcategory: newSubcategory,
          locationType: newLoc,
          address: newAddress,
          phone: newPhone,
          telegram: newTg,
          instagram: newInst,
          facebook: newFb,
          website: newWeb,
          price: newPrice,
          notes: newNotes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        liveCatalogData.unshift(newItem);
      }
      const searchVal = document.getElementById('live-search') ? document.getElementById('live-search').value : '';
      window.filterLiveCatalog(searchVal);
    }
  } catch (error) {
    showAdminAlert("Помилка при збереженні: " + error.message);
    console.error("Save error:", error);
  }
};

window.deleteLiveApp = async (id) => {
  if (!confirm("Ви впевнені, що хочете видалити цього спеціаліста?")) return;
  try {
    await addDoc(collection(db, "pending_specialists"), {
      id: String(id),
      status: "deleted",
      updatedAt: serverTimestamp()
    });
    showAdminAlert("✅ Спеціаліста видалено з каталогу!");
    const el = document.getElementById(`live-card-${id}`);
    if (el) el.style.display = 'none';
    liveCatalogData = liveCatalogData.filter(i => String(i.id) !== String(id));
    const searchVal = document.getElementById('live-search') ? document.getElementById('live-search').value : '';
    window.filterLiveCatalog(searchVal);
  } catch (error) {
    showAdminAlert("Помилка при видаленні: " + error.message);
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
    // 1. Fetch static JSON
    let staticSpecialists = [];
    try {
      const res = await fetch(`data/specialists.json?v=${new Date().getTime()}`);
      if (res.ok) {
        staticSpecialists = await res.json();
      }
    } catch (e) {
      console.warn("Could not fetch static specialists:", e);
    }
    
    // 2. Fetch Firebase live approved / deleted updates
    const uniqueMap = new Map();
    staticSpecialists.forEach(item => {
      if (item.id != null) {
        uniqueMap.set(String(item.id), item);
      }
    });

    try {
      const q = query(collection(db, "pending_specialists"), where("status", "in", ["approved", "deleted"]));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const itemId = data.id || docSnap.id;
        if (data.status === "deleted") {
          if (itemId) uniqueMap.delete(String(itemId));
        } else if (data.status === "approved") {
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            data.createdAt = data.createdAt.toDate().toISOString();
          }
          if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
            data.updatedAt = data.updatedAt.toDate().toISOString();
          }
          uniqueMap.set(String(itemId), { ...data, id: String(itemId) });
        }
      });
    } catch (e) {
      console.warn("Could not fetch live specialists from Firebase:", e);
    }

    const data = Array.from(uniqueMap.values());

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
      String(item.id || "").toLowerCase().includes(lower) ||
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
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; background: #f8f9fa; padding: 10px; border-radius: 5px;">
        <button class="btn" style="flex: 0 0 auto; padding: 8px 15px; background: ${liveCatalogCurrentPage === 1 ? '#ccc' : '#007bff'}"
                onclick="window.prevLivePage()" ${liveCatalogCurrentPage === 1 ? 'disabled' : ''}>← Назад</button>
        <strong style="flex: 1; text-align: center; min-width: 150px;">Сторінка ${liveCatalogCurrentPage} з ${maxPage} <br><span style="font-weight:normal; color:#666; font-size: 0.85em;">(Всього: ${liveCatalogFiltered.length})</span></strong>
        <button class="btn" style="flex: 0 0 auto; padding: 8px 15px; background: ${liveCatalogCurrentPage === maxPage ? '#ccc' : '#007bff'}"
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
        <p><strong>Локація:</strong> <span id="live-display-loc-${itemId}">${item.locationType || '—'}</span></p>
        <p><strong>Адреса:</strong> <span id="live-display-address-${itemId}">${item.address || '—'}</span></p>
        <p><strong>Ціна:</strong> <span id="live-display-price-${itemId}">${item.price || '—'}</span></p>
        <p><strong>Нотатки:</strong> <span id="live-display-notes-${itemId}">${item.notes || '—'}</span></p>
        <p><strong>Телефон:</strong> <span id="live-display-phone-${itemId}">${item.phone || '—'}</span></p>
        <p><strong>Telegram:</strong> <span id="live-display-tg-${itemId}">${item.telegram || '—'}</span></p>
        <p><strong>Instagram:</strong> <span id="live-display-inst-${itemId}">${item.instagram || '—'}</span></p>
        <p><strong>Facebook:</strong> <span id="live-display-fb-${itemId}">${item.facebook || '—'}</span></p>
        <p><strong>Вебсайт:</strong> <span id="live-display-web-${itemId}">${item.website || '—'}</span></p>
        <div class="application-actions">
          <button class="btn btn-edit" style="background:#ffc107;color:black;" onclick="window.editApp('${itemId}', true)">Редагувати</button>
          <button class="btn" style="background:#ff6b35;" onclick="window.openInaccuracyReport('${itemId}', '${item.name || ''}')">⚠️ Звіт</button>
          <button class="btn btn-reject" onclick="window.deleteLiveApp('${itemId}')">Видалити</button>
        </div>
        <p class="card-admin-dates">ID: ${itemId} | Створено: ${createdStr} | Відредаговано: ${updatedStr}</p>
      </div>
    `;
  });
  
  liveList.innerHTML = html;
}

window.loadLiveCatalog = loadLiveCatalog;

// --- Rejected Applications Fetcher ---
async function loadRejectedApplications() {
  const rejectedList = document.getElementById("rejected-applications-list");
  if (!rejectedList) return;
  rejectedList.innerHTML = "Завантаження...";
  
  const q = query(collection(db, "pending_specialists"), where("status", "==", "rejected"));
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      rejectedList.innerHTML = "<p>Немає відхилених заявок.</p>";
      return;
    }
    
    let html = "";
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const createdStr = data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toLocaleDateString("uk-UA") : (data.createdAt ? new Date(data.createdAt).toLocaleDateString("uk-UA") : 'Невідомо');
      const updatedStr = data.updatedAt && typeof data.updatedAt.toDate === 'function' ? data.updatedAt.toDate().toLocaleDateString("uk-UA") : (data.updatedAt ? new Date(data.updatedAt).toLocaleDateString("uk-UA") : 'Невідомо');
      html += `
        <div class="application-card" id="rejected-card-${docSnap.id}" style="background: #fff5f5; border-color: #ffcccc;">
          <h3 style="margin-bottom: 0.5rem;"><span style="color:#dc3545; font-family:monospace;">#${docSnap.id}</span> ${data.name} <small>(${data.category} > ${data.subcategory})</small></h3>
          <p style="margin-bottom: 0.5rem;"><strong>Причина відхилення:</strong> <span style="color: #dc3545; font-weight: bold;">${data.rejectReason || 'Не вказано'}</span></p>
          <p style="margin-bottom: 0.5rem;"><strong>Email:</strong> ${data.email || '—'}</p>
          <p style="margin-bottom: 0.5rem;"><strong>Опис:</strong> ${data.description || '—'}</p>
          <div class="application-actions" style="margin-top: 1rem;">
            <button class="btn btn-approve" style="background: #17a2b8;" onclick="window.restoreApp('${docSnap.id}')">Відновити на розгляд</button>
          </div>
          <p class="card-admin-dates" style="margin-top: 0.5rem;">ID: ${docSnap.id} | Створено: ${createdStr} | Відхилено: ${updatedStr}</p>
        </div>
      `;
    });
    rejectedList.innerHTML = html;
  } catch (error) {
    console.error("Помилка завантаження відхилених заявок: ", error);
    rejectedList.innerHTML = "<p style='color:red;'>Помилка завантаження. Перевірте консоль.</p>";
  }
}

window.restoreApp = async (id) => {
  if (!confirm("Ви впевнені, що хочете повернути цю заявку на повторний розгляд? Вона знову з'явиться в списку нових.")) return;
  try {
    await updateDoc(doc(db, "pending_specialists", id), {
      status: "pending",
      updatedAt: serverTimestamp()
    });
    showAdminAlert("Заявку відновлено!");
    // Reload both lists to move it from rejected to pending visually
    await loadApplications();
  } catch (error) {
    showAdminAlert("Помилка при відновленні: " + error.message);
  }
};

// --- Feedback / Reports Fetcher ---
async function loadArchivedCatalog() {
  const arcList = document.getElementById("archived-catalog-list");
  if (!arcList) return;
  arcList.innerHTML = "Завантаження...";
  try {
    const res = await fetch("data/archived_specialists.json");
    if (!res.ok) {
      if (res.status === 404) {
        arcList.innerHTML = "<p>Архів порожній.</p>";
        return;
      }
      throw new Error("Network response was not ok");
    }
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // If it's malformed JSON (or empty file)
      arcList.innerHTML = "<p>Архів порожній.</p>";
      return;
    }
    if (!data || data.length === 0) {
      arcList.innerHTML = "<p>Архів порожній.</p>";
      return;
    }
    let html = "";
    data.forEach(item => {
      html += `
        <div class="application-card" style="background: #fdfdfd; border-color: #ddd;">
          <h3 style="margin-bottom: 0.5rem;"><span style="color:#6c757d; font-family:monospace;">#${item.id}</span> ${item.name} <small>(${item.category} > ${item.subcategory})</small></h3>
          <p style="margin-bottom: 0.5rem;"><strong>Причина архівації:</strong> <span style="color: #856404; font-weight: bold;">${item.archiveReason || 'Не вказано'}</span></p>
          <p style="margin-bottom: 0.5rem;"><strong>Email/Контакти:</strong> ${item.email || item.telegram || item.instagram || '—'}</p>
          <p class="card-admin-dates" style="margin-top: 0.5rem;">Архівовано: ${item.archivedAt ? new Date(item.archivedAt).toLocaleDateString("uk-UA") : 'Невідомо'}</p>
        </div>
      `;
    });
    arcList.innerHTML = html;
  } catch (error) {
    console.error("Помилка завантаження архіву каталогу: ", error);
    arcList.innerHTML = "<p style='color:red;'>Не вдалося завантажити архів.</p>";
  }
}

async function loadFeedback() {
  const fbList = document.getElementById("feedback-list");
  if (!fbList) return;
  fbList.innerHTML = "Завантаження...";
  
  // load "new" feedback
  const q = query(collection(db, "feedback"), where("status", "==", "new"));
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      fbList.innerHTML = "<p>Немає нових звітів про помилки.</p>";
      return;
    }
    
    let html = "";
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const createdStr = data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toLocaleDateString("uk-UA", {hour:'2-digit', minute:'2-digit'}) : 'Невідомо';
      
      const specIdText = data.specialistId ? `ID: ${data.specialistId}` : "Загальний звіт";
      const encodedMsg = encodeURIComponent(data.message || '').replace(/'/g, "%27");
      const editButton = data.specialistId ? `<button class="btn btn-edit" style="background:#ffc107;color:black;" onclick="window.editApp('${data.specialistId}', true, decodeURIComponent('${encodedMsg}'))">Редагувати картку</button>` : '';

      html += `
        <div class="application-card" id="fb-card-${docSnap.id}" style="background: #fff8e1; border-color: #ffeeba;">
          <h3 style="margin-bottom: 0.5rem;"><span style="color:#856404;">⚠️ Звіт про неточність</span> <small>(${specIdText})</small></h3>
          <p><strong>Від кого:</strong> ${data.senderName || '—'} (Контакт: ${data.contactInfo || '—'})</p>
          <p><strong>Повідомлення:</strong> <span style="background: white; padding: 5px; display: block; border: 1px solid #ddd; margin-top: 5px;">${data.message || '—'}</span></p>
          <div class="application-actions" style="margin-top: 1rem;">
            ${editButton}
            <button class="btn btn-approve" style="background: #28a745;" onclick="window.resolveFeedback('${docSnap.id}')">Позначити як вирішене</button>
          </div>
          <p class="card-admin-dates" style="margin-top: 0.5rem;">Відправлено: ${createdStr}</p>
        </div>
      `;
    });
    fbList.innerHTML = html;
  } catch (error) {
    console.error("Помилка завантаження відгуків: ", error);
    fbList.innerHTML = "<p style='color:red;'>Помилка завантаження. Перевірте консоль.</p>";
  }
}

window.resolveFeedback = async (id) => {
  if (!confirm("Закрити цей звіт?")) return;
  try {
    await updateDoc(doc(db, "feedback", id), {
      status: "resolved",
      resolvedAt: serverTimestamp()
    });
    document.getElementById(`fb-card-${id}`).remove();
    showAdminAlert("Звіт позначено як вирішений!");
  } catch (error) {
    showAdminAlert("Помилка: " + error.message);
  }
};

// TOGGLE ADMIN MENU
// GO TO EMAIL SECTION
window.goToEmailSection = async () => {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  const emailSection = document.getElementById('emails-section');
  if (emailSection) {
    emailSection.classList.add('active');
  }
  await window.loadEmails?.();
};

// TOGGLE ADMIN PANEL MENU
window.toggleAdminPanelMenu = function(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('admin-panel-dropdown');
  dropdown.classList.toggle('show');
};

// GO TO ADMIN TAB
window.goToAdminTab = function(pageId) {
  const dropdown = document.getElementById('admin-panel-dropdown');
  dropdown.classList.remove('show');

  const tabId = pageId.replace('section', 'apps').replace('feedback', 'feedback').replace('rejected', 'rejected-apps');
  const actualTabId =
    pageId === 'new-apps' ? 'tab-new-apps' :
    pageId === 'live-catalog' ? 'tab-live-catalog' :
    pageId === 'feedback-section' ? 'tab-feedback' :
    pageId === 'rejected-apps' ? 'tab-rejected-apps' :
    pageId === 'archived-catalog' ? 'tab-archived-catalog' : null;

  const tab = document.getElementById(actualTabId);
  if (tab) {
    window.goToPage(tab, pageId);
  }
};

// SHOW ADMIN PANEL WHEN LOGGED IN
const showAdminPanelWhenLogged = () => {
  const adminMenu = document.getElementById('admin-panel-menu');
  if (adminMenu) {
    adminMenu.style.display = window.currentUser ? 'inline-block' : 'none';
  }
};

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('admin-panel-dropdown');
  const menu = document.getElementById('admin-panel-menu');
  if (menu && !menu.contains(e.target) && dropdown) {
    dropdown.classList.remove('show');
  }
});

// UPDATE EMAIL BADGE
window.updateEmailBadge = async () => {
  try {
    const response = await fetch(`${window.apiBaseUrl}/api/emails`, {
      method: 'GET'
    });
    const result = await response.json();
    const unreadCount = result.unreadCount || 0;

    const badge = document.getElementById('email-unread-count');
    const badgeBtn = document.getElementById('email-badge-btn');

    if (badgeBtn) badgeBtn.style.display = window.currentUser ? 'inline-block' : 'none';

    if (unreadCount > 0 && badge) {
      badge.textContent = unreadCount;
      badge.style.display = 'flex';
    } else if (badge) {
      badge.style.display = 'none';
    }
  } catch (err) {
    console.error('Error updating email badge:', err);
  }
};

// LOAD EMAILS from IMAP
window.loadEmails = async () => {
  const emailsList = document.getElementById("emails-list");
  emailsList.innerHTML = "Завантаження листів...";
  try {
    const response = await fetch(`${window.apiBaseUrl}/api/emails`, {
      method: 'GET'
    });
    const result = await response.json();

    if (!result.success || !result.emails) {
      emailsList.innerHTML = "<p style='color:red;'>Помилка завантаження листів</p>";
      return;
    }

    const emails = result.emails || [];
    if (emails.length === 0) {
      emailsList.innerHTML = "<p style='text-align:center;color:#666;'>Немає листів</p>";
      return;
    }

    // Update badge count
    window.updateEmailBadge();

    let html = "";
    emails.forEach((email, idx) => {
      const date = new Date(email.date).toLocaleString('uk-UA');
      const fromEmail = email.from.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || email.from;
      const preview = email.text.substring(0, 100).replace(/\n/g, " ") + (email.text.length > 100 ? "..." : "");

      html += `
        <div style="border: 1px solid #ddd; padding: 1rem; margin-bottom: 1rem; border-radius: 6px; background: #fafafa;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
            <div style="flex: 1;">
              <strong style="font-size: 1.05rem; display: block; margin-bottom: 0.3rem;">📧 ${email.subject}</strong>
              <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">
                <div><strong>Від:</strong> ${fromEmail}</div>
                <div><strong>Дата:</strong> ${date}</div>
              </div>
              <div style="background: white; padding: 0.75rem; border-radius: 4px; border-left: 3px solid #0056b3; margin: 0.75rem 0; font-size: 0.95rem; line-height: 1.4;">
                ${preview}
              </div>
            </div>
            <button class="btn" style="background: #0056b3; padding: 0.6rem 1rem; width: auto;" onclick="window.showEmailDetail(${idx})">Переглянути</button>
          </div>
        </div>
      `;
    });

    emailsList.innerHTML = html;
  } catch (error) {
    console.error("Помилка завантаження листів:", error);
    emailsList.innerHTML = "<p style='color:red;'>Помилка: " + error.message + "</p>";
  }
};

// SHOW FULL EMAIL & REPLY FORM
window.showEmailDetail = (idx) => {
  let modal = document.getElementById("email-detail-modal");
  if (!modal) {
    const html = `<div id="email-detail-modal" hidden style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:none;align-items:center;justify-content:center;z-index:2000;overflow-y:auto;padding:1rem;">
      <div style="background:white;padding:2rem;border-radius:8px;max-width:700px;width:90%;box-shadow:0 4px 16px rgba(0,0,0,0.2);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
          <h2>Деталі листа</h2>
          <button type="button" class="btn" style="background:#6c757d;width:auto;" onclick="window.closeEmailModal()">✕ Закрити</button>
        </div>
        <div id="email-detail-content" style="margin-bottom:1.5rem;"></div>
        <hr style="margin:1.5rem 0;">
        <div id="email-reply-form" style="display:none;">
          <h3>Відповідь</h3>
          <textarea id="reply-text" placeholder="Напишіть відповідь..." style="width:100%;height:120px;padding:0.75rem;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;margin-bottom:1rem;"></textarea>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn btn-approve" style="flex:1;" onclick="window.sendEmailReply()">Відправити відповідь</button>
            <button class="btn" style="flex:1;background:#6c757d;" onclick="document.getElementById('email-reply-form').style.display='none';">Скасувати</button>
          </div>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", html);
    modal = document.getElementById("email-detail-modal");
  }

  // Load email data from emails-list
  const emailsList = document.getElementById("emails-list");
  const emailDivs = emailsList.querySelectorAll('[style*="border: 1px solid #ddd"]');
  const emailDiv = emailDivs[idx];

  if (!emailDiv) return;

  const subject = emailDiv.querySelector('strong').textContent;
  const fromText = emailDiv.textContent.match(/Від:([^\n]+)/)?.[1]?.trim() || 'Unknown';
  const dateText = emailDiv.textContent.match(/Дата:([^\n]+)/)?.[1]?.trim() || '';
  const contentDiv = emailDiv.querySelector('[style*="border-left"]');
  const fullText = contentDiv ? contentDiv.textContent : 'No content';

  window.currentEmailIdx = idx;
  window.currentEmailFrom = fromText;
  window.currentEmailSubject = subject;

  const detailHtml = `
    <div style="background:#f5f5f5;padding:1rem;border-radius:6px;margin-bottom:1rem;">
      <div><strong>Тема:</strong> ${subject}</div>
      <div><strong>Від:</strong> ${fromText}</div>
      <div><strong>Дата:</strong> ${dateText}</div>
    </div>
    <div style="background:white;padding:1rem;border:1px solid #ddd;border-radius:6px;min-height:150px;white-space:pre-wrap;word-break:break-word;line-height:1.5;">
      ${fullText}
    </div>
  `;

  document.getElementById("email-detail-content").innerHTML = detailHtml;
  document.getElementById("email-reply-form").style.display = "block";
  document.getElementById("reply-text").value = "";
  modal.removeAttribute("hidden");
  modal.style.display = "flex";
};

// CLOSE EMAIL MODAL
window.closeEmailModal = () => {
  const modal = document.getElementById("email-detail-modal");
  if (modal) {
    modal.setAttribute("hidden", "");
    modal.style.display = "none";
  }
};

// SEND EMAIL REPLY
window.sendEmailReply = async () => {
  const replyText = document.getElementById("reply-text").value.trim();
  if (!replyText) {
    alert("Напишіть відповідь");
    return;
  }

  try {
    const response = await fetch(`${window.apiBaseUrl}/api/send-reply-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to_email: window.currentEmailFrom,
        subject: "Re: " + window.currentEmailSubject,
        original_subject: window.currentEmailSubject,
        reply_text: replyText
      })
    });

    const result = await response.json();
    if (result.success) {
      showAdminAlert("✅ Відповідь відправлена!");
      window.closeEmailModal();
      setTimeout(() => window.loadEmails(), 1000);
    } else {
      showAdminAlert("❌ Помилка: " + result.error);
    }
  } catch (error) {
    console.error("Помилка відправки відповіді:", error);
    showAdminAlert("❌ Помилка: " + error.message);
  }
};

const originalLoad = loadApplications;
loadApplications = async () => {
  await originalLoad();
  await loadLiveCatalog();
  await loadRejectedApplications();
  await loadArchivedCatalog();
  await loadFeedback();

  const params = new URLSearchParams(window.location.search);
  const specIdFromUrl = params.get('id');
  const feedbackFromUrl = params.get('feedback') || params.get('msg') || '';

  if (specIdFromUrl) {
    setTimeout(() => {
      window.editApp(specIdFromUrl, true, feedbackFromUrl);
    }, 400);
  } else if (window.location.hash.startsWith('#edit-live-')) {
    const editId = window.location.hash.replace('#edit-live-', '');
    setTimeout(() => {
      window.editApp(editId, true, feedbackFromUrl);
    }, 400);
  } else if (window.location.hash.startsWith('#edit-pending-')) {
    const editId = window.location.hash.replace('#edit-pending-', '');
    setTimeout(() => {
      window.editApp(editId, false, feedbackFromUrl);
    }, 400);
  }
};

