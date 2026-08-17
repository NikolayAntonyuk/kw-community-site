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
            <p><span id="live-display-desc-test123">Опис тест</span></p>
            <p><span id="live-display-phone-test123">123-456</span></p>
            <p><span id="live-display-web-test123">example.com</span></p>
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
});

