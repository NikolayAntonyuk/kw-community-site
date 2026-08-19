import { test, expect } from '@playwright/test';

test.describe('Admin Panel E2E', () => {
  test('should load the admin login page', async ({ page }) => {
    await page.goto('/admin.html');
    
    // Check main title
    await expect(page.locator('h1')).toHaveText('Адмін-панель');
    
    // Auth section should be visible
    await expect(page.locator('#auth-section')).toBeVisible();
    await expect(page.locator('#login-form')).toBeVisible();
    await expect(page.locator('#admin-email')).toBeVisible();
    await expect(page.locator('#admin-password')).toBeVisible();
  });

  test('should show error on wrong password', async ({ page }) => {
    await page.goto('/admin.html');
    
    // Fill form
    await page.locator('#admin-email').fill('wrong@example.com');
    await page.locator('#admin-password').fill('wrongpassword123');
    
    // Mock the Firebase auth call via networking if possible, 
    // or just let it hit the real Firebase which will return an error anyway
    await page.route('https://identitytoolkit.googleapis.com/**', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: "INVALID_LOGIN_CREDENTIALS",
            domain: "global",
            reason: "invalid"
          }
        })
      });
    });

    await page.locator('#login-form button[type="submit"]').click();

    // Wait for the error message
    const errorMsg = page.locator('#auth-error');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
    await expect(errorMsg).toContainText('Невірний email або пароль');
  });

  test('should explain when Firebase Authentication is not enabled', async ({ page }) => {
    await page.goto('/admin.html');

    await page.locator('#admin-email').fill('admin@example.com');
    await page.locator('#admin-password').fill('somepassword123');

    // Саме цю помилку віддає Firebase, поки Authentication не увімкнено в консолі
    await page.route('https://identitytoolkit.googleapis.com/**', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: "CONFIGURATION_NOT_FOUND",
            domain: "global",
            reason: "invalid"
          }
        })
      });
    });

    await page.locator('#login-form button[type="submit"]').click();

    const errorMsg = page.locator('#auth-error');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
    await expect(errorMsg).toContainText('Authentication не увімкнено');
  });

  test('should display live catalog edit modal and populate fields', async ({ page }) => {
    await page.goto('/admin.html');
    
    // Wait for the admin.js module to finish loading
    await page.waitForFunction(() => typeof window.editApp === 'function');

    // Inject a dummy live catalog item into the DOM and make dashboard visible
    await page.evaluate(() => {
      document.getElementById('dashboard-section')!.style.display = 'block';
      const liveList = document.getElementById('live-catalog-list');
      if (liveList) {
        liveList.innerHTML = `
          <div class="application-card" id="live-card-test123">
            <h3><span id="live-display-name-test123">Тестовий Спец</span></h3>
            <p><span id="live-display-cat-test123">Cat > Subcat</span></p>
            <p><span id="live-display-desc-test123">Опис тест</span></p>
            <p><span id="live-display-loc-test123">Місто</span></p>
            <p><span id="live-display-address-test123">Адреса</span></p>
            <p><span id="live-display-phone-test123">123-456</span></p>
            <p><span id="live-display-tg-test123">@test</span></p>
            <p><span id="live-display-inst-test123">@test_inst</span></p>
            <p><span id="live-display-fb-test123">fb</span></p>
            <p><span id="live-display-web-test123">example.com</span></p>
            <p><span id="live-display-price-test123">100</span></p>
            <p><span id="live-display-notes-test123">Notes</span></p>
            <button id="trigger-edit" onclick="window.editApp('test123', true)">Редагувати</button>
          </div>
        `;
      }
    });

    // Click the edit button
    await page.click('#trigger-edit');

    // Verify modal appears and is populated
    await expect(page.locator('#edit-modal')).toBeVisible();
    await expect(page.locator('#edit-id')).toHaveValue('test123');
    await expect(page.locator('#edit-islive')).toHaveValue('true');
    await expect(page.locator('#edit-name')).toHaveValue('Тестовий Спец');
    await expect(page.locator('#edit-desc')).toHaveValue('Опис тест');
    await expect(page.locator('#edit-phone')).toHaveValue('123-456');
    await expect(page.locator('#edit-web')).toHaveValue('example.com');

    // Click cancel to close modal
    await page.click('button:has-text("Скасувати")');
    await expect(page.locator('#edit-modal')).not.toBeVisible();
  });

  test('should show warning when rejecting application without valid email', async ({ page }) => {
    // Mock Firestore to prevent hanging
    await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
      await route.fulfill({
        contentType: 'application/javascript',
        body: `
          export const collection = () => {};
          export const query = () => {};
          export const where = () => {};
          export const getDocs = async () => ({ empty: true });
          export const updateDoc = async () => {};
          export const doc = () => {};
          export const addDoc = async () => {};
          export const getFirestore = () => ({});
          export const serverTimestamp = () => ({});
        `
      });
    });

    await page.goto('/admin.html');
    
    // Wait for the admin.js module to finish loading
    await page.waitForFunction(() => typeof window.rejectApp === 'function');

    let dialogMessages: string[] = [];
    page.on('dialog', async dialog => {
      dialogMessages.push(dialog.message());
      if (dialog.type() === 'prompt') {
        await dialog.accept('Test rejection reason');
      } else {
        await dialog.accept();
      }
    });

    await page.evaluate(() => {
      document.body.innerHTML += '<div id="card-noemail"></div>';
      // userEmail = '' (empty)
      return window.rejectApp('noemail', '', 'Test User');
    });

    // Wait a bit for async operations (dialogs to appear)
    await page.waitForTimeout(500);

    expect(dialogMessages).toContain('Вкажіть причину відхилення (або залиште порожнім):');
    
    // Check if the specific email warning was shown
    const hasEmailWarning = dialogMessages.some(msg => msg.includes('Лист не відправлено, оскільки у спеціаліста немає валідного email'));
    expect(hasEmailWarning).toBeTruthy();
  });

  test('should require confirmation before approving application', async ({ page }) => {
    // Mock Firestore
    await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
      await route.fulfill({
        contentType: 'application/javascript',
        body: `
          export const collection = () => {};
          export const query = () => {};
          export const where = () => {};
          export const getDocs = async () => ({ empty: true });
          export const updateDoc = async () => {};
          export const doc = () => {};
          export const addDoc = async () => {};
          export const getFirestore = () => ({});
          export const serverTimestamp = () => ({});
        `
      });
    });

    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.approveApp === 'function');

    let dialogAppeared = false;
    let dialogMessage = '';
    
    // Test CANCEL
    page.on('dialog', async dialog => {
      dialogAppeared = true;
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });

    await page.evaluate(() => {
      document.body.innerHTML += '<div id="card-approve1"></div>';
      return window.approveApp('approve1');
    });

    // Check if card still exists (action was cancelled)
    expect(dialogAppeared).toBeTruthy();
    expect(dialogMessage).toContain('хочете підтвердити');
    
    const cardExists = await page.evaluate(() => !!document.getElementById('card-approve1'));
    expect(cardExists).toBeTruthy();
  });

  test('should require confirmation before deleting live application', async ({ page }) => {
    // Mock Firestore
    await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
      await route.fulfill({
        contentType: 'application/javascript',
        body: `
          export const collection = () => {};
          export const query = () => {};
          export const where = () => {};
          export const getDocs = async () => ({ empty: true });
          export const updateDoc = async () => {};
          export const doc = () => {};
          export const addDoc = async () => {};
          export const getFirestore = () => ({});
          export const serverTimestamp = () => ({});
        `
      });
    });

    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.deleteLiveApp === 'function');

    let dialogAppeared = false;
    let dialogMessage = '';
    
    page.on('dialog', async dialog => {
      dialogAppeared = true;
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });

    await page.evaluate(() => {
      document.body.innerHTML += '<div id="live-card-del1"></div>';
      return window.deleteLiveApp('del1');
    });

    expect(dialogAppeared).toBeTruthy();
    expect(dialogMessage).toContain('видалити цього спеціаліста');
    
    const cardExists = await page.evaluate(() => {
      const el = document.getElementById('live-card-del1');
      return el && el.style.display !== 'none';
    });
    expect(cardExists).toBeTruthy();
  });

  test('should cancel rejection when dismiss is clicked on prompt', async ({ page }) => {
    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.rejectApp === 'function');

    let promptShown = false;
    page.on('dialog', async dialog => {
      promptShown = true;
      await dialog.dismiss();
    });

    await page.evaluate(() => {
      document.body.innerHTML += '<div id="card-rej-cancel"></div>';
      return window.rejectApp('rej-cancel', 'user@example.com', 'Test User');
    });

    expect(promptShown).toBeTruthy();
    const cardExists = await page.evaluate(() => !!document.getElementById('card-rej-cancel'));
    expect(cardExists).toBeTruthy();
  });

  test('should display formatted dates on live catalog cards', async ({ page }) => {
    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.loadLiveCatalog === 'function');

    await page.evaluate(() => {
      document.getElementById('dashboard-section')!.style.display = 'block';
      return window.loadLiveCatalog();
    });

    // Wait for the live catalog to load from data/specialists.json
    await page.waitForSelector('#live-catalog-list .application-card', { state: 'attached', timeout: 5000 });

    // Verify first card has created date rendered
    const firstCardText = await page.locator('#live-catalog-list .application-card').first().innerText();
    expect(firstCardText).toContain('Створено:');
    expect(firstCardText).toContain('Відредаговано:');
    // Ensure it does not say "Невідомо"
    expect(firstCardText).not.toContain('Створено: Невідомо');
  });

  test('should delete live application when confirmation is accepted', async ({ page }) => {
    await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
      await route.fulfill({
        contentType: 'application/javascript',
        body: `
          export const collection = () => {};
          export const query = () => {};
          export const where = () => {};
          export const getDocs = async () => ({ empty: true });
          export const updateDoc = async () => {};
          export const doc = () => {};
          export const addDoc = async () => {};
          export const getFirestore = () => ({});
          export const serverTimestamp = () => ({});
        `
      });
    });

    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.deleteLiveApp === 'function');

    let dialogAppeared = false;
    page.on('dialog', async dialog => {
      dialogAppeared = true;
      await dialog.accept(); // Accept the confirmation
    });

    await page.evaluate(() => {
      document.body.innerHTML += '<div id="live-card-del-accept"></div>';
      return window.deleteLiveApp('del-accept');
    });

    expect(dialogAppeared).toBeTruthy();
    
    // Card should be hidden after successful deletion
    const cardHidden = await page.evaluate(() => {
      const el = document.getElementById('live-card-del-accept');
      return !el || el.style.display === 'none';
    });
    expect(cardHidden).toBeTruthy();
  });

  test('should approve application when confirmation is accepted', async ({ page }) => {
    await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
      await route.fulfill({
        contentType: 'application/javascript',
        body: `
          export const collection = () => {};
          export const query = () => {};
          export const where = () => {};
          export const getDocs = async () => ({ empty: true });
          export const updateDoc = async () => {};
          export const doc = () => {};
          export const addDoc = async () => {};
          export const getFirestore = () => ({});
          export const serverTimestamp = () => ({});
        `
      });
    });

    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.approveApp === 'function');

    let dialogAppeared = false;
    page.on('dialog', async dialog => {
      dialogAppeared = true;
      await dialog.accept();
    });

    await page.evaluate(() => {
      document.body.innerHTML += '<div id="card-approve-accept"></div>';
      return window.approveApp('approve-accept');
    });

    expect(dialogAppeared).toBeTruthy();
    
    // Card should be removed after approval
    const cardExists = await page.evaluate(() => !!document.getElementById('card-approve-accept'));
    expect(cardExists).toBeFalsy();
  });

  test('should require confirmation before saving edit and proceed on accept', async ({ page }) => {
    await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
      await route.fulfill({
        contentType: 'application/javascript',
        body: `
          export const collection = () => {};
          export const query = () => {};
          export const where = () => {};
          export const getDocs = async () => ({ empty: true });
          export const updateDoc = async () => {};
          export const doc = () => {};
          export const addDoc = async () => {};
          export const getFirestore = () => ({});
          export const serverTimestamp = () => ({});
        `
      });
    });

    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.saveEdit === 'function');

    let dialogAppeared = false;
    page.on('dialog', async dialog => {
      dialogAppeared = true;
      await dialog.accept();
    });

    await page.evaluate(() => {
      document.body.innerHTML += `
        <div id="display-name-edit-accept"></div>
        <div id="display-cat-edit-accept"></div>
        <div id="display-desc-edit-accept"></div>
        <div id="display-loc-edit-accept"></div>
        <div id="display-address-edit-accept"></div>
        <div id="display-phone-edit-accept"></div>
        <div id="display-tg-edit-accept"></div>
        <div id="display-inst-edit-accept"></div>
        <div id="display-fb-edit-accept"></div>
        <div id="display-web-edit-accept"></div>
        <div id="display-price-edit-accept"></div>
        <div id="display-notes-edit-accept"></div>
      `;
      document.getElementById('edit-id').value = 'edit-accept';
      document.getElementById('edit-islive').value = 'false';
      document.getElementById('edit-name').value = 'New Name';
      document.getElementById('edit-desc').value = 'New Desc';
      document.getElementById('edit-phone').value = 'New Phone';
      document.getElementById('edit-tg').value = 'New Tg';
      document.getElementById('edit-inst').value = 'New Inst';
      document.getElementById('edit-fb').value = 'New Fb';
      document.getElementById('edit-web').value = 'New Web';
      document.getElementById('edit-category').value = 'New Cat';
      document.getElementById('edit-subcategory').value = 'New Subcat';
      document.getElementById('edit-loc').value = 'New Loc';
      document.getElementById('edit-address').value = 'New Addr';
      document.getElementById('edit-price').value = 'New Price';
      document.getElementById('edit-notes').value = 'New Notes';
      document.getElementById('edit-modal').style.display = 'block';
      return window.saveEdit();
    });

    expect(dialogAppeared).toBeTruthy();
    
    const modalVisible = await page.evaluate(() => document.getElementById('edit-modal')?.style.display !== 'none');
    expect(modalVisible).toBeFalsy();
    
    const updatedName = await page.evaluate(() => document.getElementById('display-name-edit-accept')?.textContent);
    expect(updatedName).toBe('New Name');
  });

  test('should paginate live catalog 50 per page with working prev/next buttons', async ({ page }) => {
    // Generate 60 mock specialists
    const mockData = Array.from({ length: 60 }, (_, i) => ({
      id: `mock-id-${i}`,
      name: `Specialist ${i}`,
      category: 'Test',
      subcategory: 'Test',
      description: 'Desc',
      locationType: 'Waterloo',
      phone: '123-456',
      website: 'example.com',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }));

    await page.route('**/data/specialists.json*', async route => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(mockData)
      });
    });

    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.loadLiveCatalog === 'function');

    await page.evaluate(() => {
      document.getElementById('dashboard-section')!.style.display = 'block';
      return window.loadLiveCatalog();
    });

    // Wait for the live catalog to load
    await page.waitForSelector('#live-catalog-list .application-card', { state: 'attached', timeout: 5000 });

    // Page 1: 50 cards out of 60, "Назад" disabled
    expect(await page.locator('#live-catalog-list .application-card').count()).toBe(50);
    await expect(page.locator('#live-pagination')).toContainText('Сторінка 1 з 2');
    await expect(page.locator('#live-pagination')).toContainText('Всього: 60');
    await expect(page.locator('#live-pagination button:has-text("← Назад")')).toBeDisabled();

    // Page 2: remaining 10 cards, "Далі" disabled
    await page.locator('#live-pagination button:has-text("Далі →")').click();
    expect(await page.locator('#live-catalog-list .application-card').count()).toBe(10);
    await expect(page.locator('#live-pagination')).toContainText('Сторінка 2 з 2');
    await expect(page.locator('#live-pagination button:has-text("Далі →")')).toBeDisabled();

    // Back to page 1
    await page.locator('#live-pagination button:has-text("← Назад")').click();
    expect(await page.locator('#live-catalog-list .application-card').count()).toBe(50);
    await expect(page.locator('#live-pagination')).toContainText('Сторінка 1 з 2');
  });

  test('should show card IDs and keep search input usable while filtering', async ({ page }) => {
    const mockData = Array.from({ length: 60 }, (_, i) => ({
      id: `mock-id-${i}`,
      name: `Specialist ${i}`,
      category: 'Test',
      subcategory: 'Test',
      description: 'Desc',
      locationType: 'Waterloo',
      phone: '123-456',
      website: 'example.com',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }));

    await page.route('**/data/specialists.json*', async route => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(mockData)
      });
    });

    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.loadLiveCatalog === 'function');

    await page.evaluate(() => {
      document.getElementById('dashboard-section')!.style.display = 'block';
      return window.loadLiveCatalog();
    });

    await page.waitForSelector('#live-catalog-list .application-card', { state: 'attached', timeout: 5000 });

    // Every card shows its ID (data is reversed, so newest first)
    await expect(page.locator('#live-card-mock-id-59')).toContainText('#mock-id-59');
    await expect(page.locator('#live-card-mock-id-59')).toContainText('ID: mock-id-59');

    // Typing several characters must keep focus and the full query in the field
    const search = page.locator('#live-search');
    await search.click();
    await page.keyboard.type('mock-id-42');
    await expect(search).toHaveValue('mock-id-42');
    await expect(search).toBeFocused();

    expect(await page.locator('#live-catalog-list .application-card').count()).toBe(1);
    await expect(page.locator('#live-catalog-list .application-card')).toContainText('Specialist 42');
    await expect(page.locator('#live-pagination')).toContainText('Всього: 1');
  });
});

