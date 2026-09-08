# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-email-features.spec.ts >> Email Features & Admin Panel (New Requirements) >> @T1 should auto-load specialist for editing when ?id=<spec-id> URL param is present
- Location: tests/e2e/admin-email-features.spec.ts:27:7

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#form-section')
Expected pattern: /active/
Received string:  "tab-content"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#form-section')
    14 × locator resolved to <div id="form-section" class="tab-content">…</div>
       - unexpected value "tab-content"

```

```yaml
- navigation:
  - link "KW Ukrainians Разом KW":
    - /url: index.html
    - img "KW Ukrainians"
    - text: Разом KW
  - button "✉️ 0"
  - button "Адмін панель"
  - link "Головна":
    - /url: index.html
  - link "Каталог":
    - /url: catalog.html
  - link "Школа":
    - /url: school.html
- main:
  - heading "Адмін-панель" [level=1]
  - heading "Вхід для адміністраторів" [level=2]
  - textbox "Email"
  - textbox "Пароль"
  - button "Увійти"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Email Features & Admin Panel (New Requirements)', () => {
  4   | 
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await page.route("**/api/feedback", (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }));
  7   |     await page.route("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js", (route) => {
  8   |       route.fulfill({
  9   |         contentType: 'application/javascript',
  10  |         body: `
  11  |           export const collection = () => {};
  12  |           export const query = () => {};
  13  |           export const where = () => {};
  14  |           export const getDocs = async () => ({ empty: true, forEach: () => {} });
  15  |           export const updateDoc = async () => {};
  16  |           export const doc = () => {};
  17  |           export const addDoc = async () => {};
  18  |           export const serverTimestamp = () => {};
  19  |           export const getFirestore = () => ({});
  20  |         `
  21  |       });
  22  |     });
  23  |     await page.route("https://api.emailjs.com/**", (route) => route.abort());
  24  |   });
  25  | 
  26  |   // @T1: Specialist ID as clickable link to edit
  27  |   test('@T1 should auto-load specialist for editing when ?id=<spec-id> URL param is present', async ({ page }) => {
  28  |     const testSpecId = '39'; // Using a known specialist ID
  29  | 
  30  |     // Navigate to admin page with ?id parameter
  31  |     await page.goto(`/admin.html?id=${testSpecId}`);
  32  | 
  33  |     // Wait for dashboard to load (form should auto-open)
  34  |     await page.waitForSelector('.admin-container', { timeout: 5000 });
  35  | 
  36  |     // The form should be visible (not the auth section)
  37  |     const formSection = page.locator('#form-section');
> 38  |     await expect(formSection).toHaveClass(/active/);
      |                               ^ Error: expect(locator).toHaveClass(expected) failed
  39  | 
  40  |     // ID field should be populated with the specialist ID
  41  |     const idField = page.locator('#edit-id');
  42  |     const idValue = await idField.inputValue();
  43  |     expect(idValue).toBe(testSpecId);
  44  |   });
  45  | 
  46  |   // @T2: "Inaccuracy Report" button on specialist card (can be tested via direct modal trigger)
  47  |   test('@T2 should display "Report Inaccuracy" button when modal is opened', async ({ page }) => {
  48  |     // Since live catalog requires authentication, we test the button via direct function call
  49  |     await page.goto('/admin.html');
  50  | 
  51  |     // Use evaluate to trigger the modal function directly
  52  |     await page.evaluate(() => {
  53  |       if (typeof window.openInaccuracyReport === 'function') {
  54  |         window.openInaccuracyReport('test-spec-123', 'Test Specialist');
  55  |       }
  56  |     });
  57  | 
  58  |     // Modal should appear
  59  |     const modal = page.locator('#inaccuracy-modal');
  60  |     await expect(modal).not.toHaveAttribute('hidden');
  61  | 
  62  |     // Check that specialist info is shown
  63  |     await expect(page.locator('#report-spec-id')).toHaveText('test-spec-123');
  64  |     await expect(page.locator('#report-spec-name')).toHaveText('Test Specialist');
  65  |   });
  66  | 
  67  |   // @T3: Inaccuracy report modal form structure
  68  |   test('@T3 should display correct form fields in inaccuracy report modal', async ({ page }) => {
  69  |     await page.goto('/admin.html');
  70  | 
  71  |     // Open modal via evaluate
  72  |     await page.evaluate(() => {
  73  |       if (typeof window.openInaccuracyReport === 'function') {
  74  |         window.openInaccuracyReport('39', 'Katya Manicure');
  75  |       }
  76  |     });
  77  | 
  78  |     // Modal should appear
  79  |     const modal = page.locator('#inaccuracy-modal');
  80  |     await expect(modal).not.toHaveAttribute('hidden');
  81  | 
  82  |     // Check modal contains required fields
  83  |     await expect(page.locator('#report-sender-name')).toBeVisible();
  84  |     await expect(page.locator('#report-contact')).toBeVisible();
  85  |     await expect(page.locator('#report-message')).toBeVisible();
  86  | 
  87  |     // Check buttons
  88  |     const submitBtn = modal.locator('button:has-text("Відправити")');
  89  |     const cancelBtn = modal.locator('button:has-text("Скасувати")');
  90  |     await expect(submitBtn).toBeVisible();
  91  |     await expect(cancelBtn).toBeVisible();
  92  |   });
  93  | 
  94  |   // @T4: Submit inaccuracy report form validation
  95  |   test('@T4 should validate and submit inaccuracy report form', async ({ page }) => {
  96  |     await page.goto('/admin.html');
  97  | 
  98  |     // Open modal
  99  |     await page.evaluate(() => {
  100 |       if (typeof window.openInaccuracyReport === 'function') {
  101 |         window.openInaccuracyReport('39', 'Test Specialist');
  102 |       }
  103 |     });
  104 | 
  105 |     // Try to submit without filling fields (should show alert)
  106 |     await page.locator('#inaccuracy-modal button:has-text("Відправити")').click();
  107 | 
  108 |     // Alert should show validation error
  109 |     const alertCheck = await page.evaluate(() => {
  110 |       const modal = document.getElementById('custom-alert-modal');
  111 |       return modal && !modal.hasAttribute('hidden');
  112 |     });
  113 | 
  114 |     // Now fill in the form properly
  115 |     await page.locator('#report-sender-name').fill('Test Reporter');
  116 |     await page.locator('#report-contact').fill('test@example.com');
  117 |     await page.locator('#report-message').fill('This specialist info is outdated');
  118 | 
  119 |     // Submit the form
  120 |     await page.locator('#inaccuracy-modal button:has-text("Відправити")').click();
  121 | 
  122 |     // Form submission should trigger (even if API fails due to Firebase)
  123 |     // The modal may close or show error, but the function should execute
  124 |     await page.waitForTimeout(500);
  125 |   });
  126 | 
  127 |   // @T5: Email contains formatted links (not bare URLs)
  128 |   test('@T5 should generate email with formatted links in HTML', async ({ page }) => {
  129 |     // This test verifies the email template logic (checked in apply.js)
  130 |     await page.goto('/apply.html');
  131 | 
  132 |     // We can't directly test email sending, but we can verify the URL generation logic
  133 |     const expectedAdminUrl = new RegExp(/admin\.html\?id=/);
  134 |     const expectedCatalogUrl = new RegExp(/catalog\.html/);
  135 | 
  136 |     // The URLs are constructed in JavaScript; this test ensures they're properly formatted
  137 |     const isValidAdminUrl = await page.evaluate(() => {
  138 |       const urlPattern = /admin\.html\?id=[a-zA-Z0-9_-]+/;
```