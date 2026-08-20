const fs = require('fs');

// Read admin.html
let html = fs.readFileSync('admin.html', 'utf8');

const newTabContent = `
      <div id="form-section" class="tab-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <h2 id="form-title">Редагувати заявку</h2>
          <button class="btn" style="background:#6c757d; max-width: 150px;" onclick="window.cancelForm()">Скасувати</button>
        </div>
        <div style="background: #fdfdfd; padding: 1.5rem; border-radius: 8px; border: 1px solid #eee;">
          <input type="hidden" id="edit-id">
          <input type="hidden" id="edit-islive">
          <div class="form-group"><label>Ім'я/Назва:</label><input type="text" id="edit-name"></div>
          <div class="form-group"><label>Категорія:</label><input type="text" id="edit-category"></div>
          <div class="form-group"><label>Підкатегорія:</label><input type="text" id="edit-subcategory"></div>
          <div class="form-group"><label>Опис (короткий):</label><input type="text" id="edit-desc"></div>
          <div class="form-group"><label>Локація (Місто):</label><input type="text" id="edit-loc"></div>
          <div class="form-group"><label>Адреса:</label><input type="text" id="edit-address"></div>
          <div class="form-group"><label>Телефон:</label><input type="text" id="edit-phone"></div>
          <div class="form-group"><label>Telegram:</label><input type="text" id="edit-tg"></div>
          <div class="form-group"><label>Instagram:</label><input type="text" id="edit-inst"></div>
          <div class="form-group"><label>Facebook:</label><input type="text" id="edit-fb"></div>
          <div class="form-group"><label>Вебсайт:</label><input type="text" id="edit-web"></div>
          <div class="form-group"><label>Ціна:</label><input type="text" id="edit-price"></div>
          <div class="form-group"><label>Нотатки:</label><textarea id="edit-notes" style="width:100%; height:80px; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"></textarea></div>
          <div class="application-actions" style="margin-top: 1.5rem;">
            <button class="btn btn-approve" onclick="window.saveEdit()">Зберегти</button>
          </div>
        </div>
      </div>
`;

html = html.replace('</div>\n    </div>\n  </main>', '</div>\n' + newTabContent + '\n    </div>\n  </main>');

// Add the button to add a specialist in the live catalog
html = html.replace('<h2>Живий каталог (вже підтверджені)</h2>', '<h2>Живий каталог (вже підтверджені)</h2>\n          <button class="btn" style="background: #28a745; max-width: 200px; padding: 8px 15px;" onclick="window.showAddForm()">➕ Додати спеціаліста</button>');

html = html.replace('<div class="admin-tab" onclick="window.goToPage(this, \'new-apps\')">', '<div class="admin-tab active" id="tab-new-apps" onclick="window.goToPage(this, \'new-apps\')">');
html = html.replace('<div class="admin-tab" onclick="window.goToPage(this, \'live-catalog\')">', '<div class="admin-tab" id="tab-live-catalog" onclick="window.goToPage(this, \'live-catalog\')">');
html = html.replace('<div class="admin-tab" onclick="window.goToPage(this, \'rejected-apps\')">', '<div class="admin-tab" id="tab-rejected-apps" onclick="window.goToPage(this, \'rejected-apps\')">');

fs.writeFileSync('admin.html', html);
console.log("Updated admin.html");

// Now update js/admin.js
let js = fs.readFileSync('js/admin.js', 'utf8');

// Remove the modal injection
js = js.replace(/const editModalHTML = `[\s\S]*?`;\s*document\.body\.insertAdjacentHTML\('beforeend', editModalHTML\);/, '');

// Replace window.editApp
let newEditApp = `window.editApp = async (id, isLive = false) => {
  document.getElementById('form-title').innerText = "Редагувати заявку";
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-islive').value = isLive ? "true" : "false";
  
  let prefix = isLive ? 'live-' : '';
  document.getElementById('edit-name').value = document.getElementById(\`\${prefix}display-name-\${id}\`).innerText;
  document.getElementById('edit-desc').value = document.getElementById(\`\${prefix}display-desc-\${id}\`).innerText;

  const catText = document.getElementById(\`\${prefix}display-cat-\${id}\`).innerText.split(" > ");
  document.getElementById('edit-category').value = (catText[0] || '').trim();
  document.getElementById('edit-subcategory').value = (catText[1] || '').trim();
  
  const loc = document.getElementById(\`\${prefix}display-loc-\${id}\`).innerText;
  document.getElementById('edit-loc').value = loc === '—' ? '' : loc;

  const address = document.getElementById(\`\${prefix}display-address-\${id}\`).innerText;
  document.getElementById('edit-address').value = address === '—' ? '' : address;

  const phone = document.getElementById(\`\${prefix}display-phone-\${id}\`).innerText;
  document.getElementById('edit-phone').value = phone === '—' ? '' : phone;

  const tg = document.getElementById(\`\${prefix}display-tg-\${id}\`).innerText;
  document.getElementById('edit-tg').value = tg === '—' ? '' : tg;
  
  const inst = document.getElementById(\`\${prefix}display-inst-\${id}\`).innerText;
  document.getElementById('edit-inst').value = inst === '—' ? '' : inst;
  
  const fb = document.getElementById(\`\${prefix}display-fb-\${id}\`).innerText;
  document.getElementById('edit-fb').value = fb === '—' ? '' : fb;
  
  const web = document.getElementById(\`\${prefix}display-web-\${id}\`).innerText;
  document.getElementById('edit-web').value = web === '—' ? '' : web;

  const price = document.getElementById(\`\${prefix}display-price-\${id}\`).innerText;
  document.getElementById('edit-price').value = price === '—' ? '' : price;

  const notes = document.getElementById(\`\${prefix}display-notes-\${id}\`).innerText;
  document.getElementById('edit-notes').value = notes === '—' ? '' : notes;
  
  // Navigate to form section, hide tabs
  document.querySelector('.admin-tabs').style.display = 'none';
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById('form-section').classList.add('active');
};

window.showAddForm = () => {
  document.getElementById('form-title').innerText = "Додати спеціаліста";
  document.getElementById('edit-id').value = "";
  document.getElementById('edit-islive').value = "true"; // Added directly to live
  
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
  document.querySelector('.admin-tabs').style.display = 'flex';
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  // Determine which tab to go back to. Let's default to live catalog for Add, or previous one for edit.
  // We can just rely on the active tab from before, but we removed .active from .admin-tab ? 
  // No, we didn't remove .active from .admin-tab when hiding .admin-tabs. 
  // So we just re-activate the content that matches the active tab.
  const activeTab = document.querySelector('.admin-tab.active');
  if (activeTab) {
    if (activeTab.id === 'tab-new-apps') document.getElementById('new-apps').classList.add('active');
    else if (activeTab.id === 'tab-live-catalog') document.getElementById('live-catalog').classList.add('active');
    else if (activeTab.id === 'tab-rejected-apps') document.getElementById('rejected-apps').classList.add('active');
  } else {
    document.getElementById('live-catalog').classList.add('active');
  }
};
`;

js = js.replace(/window\.editApp = async \([\s\S]*?modal\.setAttribute\('aria-hidden', 'false'\);\s*};/, newEditApp);

// Now in saveEdit
js = js.replace(/document\.getElementById\('edit-modal'\)\.setAttribute\('hidden', ''\);\s*document\.getElementById\('edit-modal'\)\.setAttribute\('aria-hidden', 'true'\);/, 'window.cancelForm();');

// Also update the UI updates inside saveEdit
let saveEditUpdate = `
    if (!id) {
      // It's a new addition
      id = "ext-" + Math.random().toString(36).substr(2, 9);
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
        createdAt: serverTimestamp(),
        status: "approved"
      });
      msg = "Спеціаліста додано в базу! Щоб він з'явився в каталозі зараз, <br><a href='#' onclick='window.triggerSync(); return false;' style='color:#1f6feb; text-decoration:underline;'>запустіть синхронізацію вручну тут</a>.";
    } else {
      if (isLive) {
        // ... (existing update logic)
`;

js = js.replace(/if \(isLive\) \{/, saveEditUpdate + '\n      // We already had logic for isLive here. Wait, let\'s properly rewrite saveEdit');

// It's safer to just rewrite window.saveEdit completely
let newSaveEdit = `window.saveEdit = async () => {
  if (!confirm("Ви впевнені, що хочете зберегти ці зміни?")) return;
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

  try {
    let msg = "";
    if (!id) {
      // Create new
      id = "ext-" + Math.random().toString(36).substr(2, 9);
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
        createdAt: serverTimestamp(),
        status: "approved"
      });
      msg = "Спеціаліста додано в базу! Щоб він з'явився в каталозі зараз, <br><a href='#' onclick='window.triggerSync(); return false;' style='color:#1f6feb; text-decoration:underline;'>запустіть синхронізацію вручну тут</a>.";
    } else if (isLive) {
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
      msg = "Зміни збережено в базу! Щоб вони з'явилися в каталозі зараз, <br><a href='#' onclick='window.triggerSync(); return false;' style='color:#1f6feb; text-decoration:underline;'>запустіть синхронізацію вручну тут</a>.";
    } else {
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
      msg = "Зміни успішно збережено!";
    }

    if (id && document.getElementById('live-display-name-' + id) && isLive) {
      document.getElementById('live-display-name-' + id).innerText = newName;
      document.getElementById('live-display-cat-' + id).innerText = \`\${newCategory} > \${newSubcategory}\`;
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
      document.getElementById('display-cat-' + id).innerText = \`\${newCategory} > \${newSubcategory}\`;
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
      loadLiveCatalog();
    }
  } catch (error) {
    showAdminAlert("Помилка при збереженні: " + error.message);
    console.error("Save error:", error);
  }
};`;

js = js.replace(/window\.saveEdit = async \(\) => \{[\s\S]*?console\.error\("Save error:", error\);\s*\}\s*\};/, newSaveEdit);

fs.writeFileSync('js/admin.js', js);
console.log("Updated js/admin.js");
