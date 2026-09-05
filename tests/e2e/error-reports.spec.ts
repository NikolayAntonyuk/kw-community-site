import { test, expect } from '@playwright/test';

test.describe('Error Reports Requirements (Звіти про помилки)', () => {

  test.beforeEach(async ({ page }) => {
    await page.route("**/api/feedback", (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }));
    await page.route("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js", (route) => {
      route.fulfill({
        contentType: 'application/javascript',
        body: `
          export const getAuth = () => ({});
          export const signInWithEmailAndPassword = async () => {};
          export const onAuthStateChanged = (auth, callback) => {
            callback({ uid: 'mock-admin', email: 'admin@example.com' });
            return () => {};
          };
          export const signOut = async () => {};
        `
      });
    });
    await page.route("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js", (route) => {
      route.fulfill({
        contentType: 'application/javascript',
        body: `
          export const collection = () => {};
          export const query = () => {};
          export const where = () => {};
          export const getDocs = async () => ({ empty: true, forEach: () => {} });
          export const updateDoc = async () => {};
          export const doc = () => {};
          export const addDoc = async () => {};
          export const serverTimestamp = () => {};
          export const getFirestore = () => ({});
        `
      });
    });
    await page.route("https://api.emailjs.com/**", (route) => route.abort());
  });

  // @T9: Admin can open edit form from error report card
  test('@T9 Admin should be able to open edit form from an error report card', async ({ page }) => {
    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.editApp === 'function');

    // Call editApp as if triggered from error report card
    await page.evaluate(() => {
      window.editApp('39', true, 'Змініть адресу на Main St 12');
    });

    // Form section should become active
    const formSection = page.locator('#form-section');
    await expect(formSection).toHaveClass(/active/);

    // ID field must be populated with the specialist ID
    const editId = page.locator('#edit-id');
    await expect(editId).toHaveValue('39');

    // Form title should be "Редагувати заявку"
    const formTitle = page.locator('#form-title');
    await expect(formTitle).toHaveText('Редагувати заявку');
  });

  // @T10: Admin should see auxiliary field with suggested changes
  test('@T10 Admin should see an auxiliary field with suggested changes when editing a report', async ({ page }) => {
    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.editApp === 'function');

    const suggestion = 'Рекомендовано змінити номер телефону на +1 519 555 0199 та оновити соцмережі';
    await page.evaluate((msg) => {
      window.editApp('39', true, msg);
    }, suggestion);

    // Helper container must be visible
    const helperContainer = page.locator('#feedback-helper-container');
    await expect(helperContainer).toBeVisible();

    // Helper text must contain the suggested message
    const helperText = page.locator('#feedback-helper-text');
    await expect(helperText).toHaveText(suggestion);

    // Verify user-select style is set to "all" for easy copying
    const userSelect = await helperText.evaluate((el) => window.getComputedStyle(el).userSelect);
    expect(userSelect).toBe('all');
  });

  // @T11: Normal editing or adding specialist should NOT display auxiliary field
  test('@T11 Auxiliary suggestion field must be hidden during regular edits or creating new cards', async ({ page }) => {
    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.editApp === 'function' && typeof window.showAddForm === 'function');

    // First open with feedback message
    await page.evaluate(() => {
      window.editApp('39', true, 'Правка');
    });
    await expect(page.locator('#feedback-helper-container')).toBeVisible();

    // Now open regular edit without feedback message
    await page.evaluate(() => {
      window.editApp('39', true);
    });
    await expect(page.locator('#feedback-helper-container')).toBeHidden();

    // Open add new specialist form
    await page.evaluate(() => {
      window.showAddForm();
    });
    await expect(page.locator('#feedback-helper-container')).toBeHidden();
  });

  // @T12: Report card should be saved with standard fields only and auxiliary field is not sent to DB
  test('@T12 Report card should be saved with standard fields only after editing (auxiliary field not saved to DB)', async ({ page }) => {
    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.editApp === 'function');

    await page.evaluate(() => {
      window.editApp('39', true, 'Виправте веб-сайт на https://example.com');
    });

    // Helper container is only a visual DIV banner, not an input/textarea/select
    const inputsInHelper = page.locator('#feedback-helper-container input, #feedback-helper-container textarea, #feedback-helper-container select');
    await expect(inputsInHelper).toHaveCount(0);

    // Form inputs should only consist of standard specialist fields
    const formFieldIds = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('#form-section input, #form-section textarea, #form-section select'));
      return inputs.map(i => i.id).filter(id => id.startsWith('edit-'));
    });

    // Verify list of standard fields
    const standardFields = ['edit-id', 'edit-islive', 'edit-name', 'edit-category', 'edit-subcategory', 'edit-desc', 'edit-loc', 'edit-address', 'edit-phone', 'edit-tg', 'edit-inst', 'edit-fb', 'edit-web', 'edit-price', 'edit-notes'];
    expect(formFieldIds).toEqual(standardFields);
    expect(formFieldIds).not.toContain('feedback-helper-text');
  });

  // @T13: Cancel returns admin to "Звіти про помилки" tab
  test('@T13 Canceling form should return admin to "Звіти про помилки" tab when opened from feedback', async ({ page }) => {
    await page.goto('/admin.html');
    await page.waitForFunction(() => typeof window.goToPage === 'function' && typeof window.editApp === 'function');

    // Admin selects "Звіти про помилки" tab
    await page.evaluate(() => {
      const tabEl = document.getElementById('tab-feedback');
      if (tabEl) window.goToPage(tabEl, 'feedback-section');
      window.editApp('39', true, 'Деяка пропозиція');
    });

    // Edit form is open
    await expect(page.locator('#form-section')).toHaveClass(/active/);

    // Admin clicks cancel
    await page.locator('#form-section button:has-text("Скасувати")').click();

    // Feedback tab and its content section should be active
    await expect(page.locator('#tab-feedback')).toHaveClass(/active/);
    await expect(page.locator('#feedback-section')).toHaveClass(/active/);
    await expect(page.locator('#form-section')).not.toHaveClass(/active/);
  });

});
