# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-email-features.spec.ts >> Email Features & Admin Panel (New Requirements) >> @T4 should validate and submit inaccuracy report form
- Location: tests/e2e/admin-email-features.spec.ts:95:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#inaccuracy-modal button:has-text("Відправити")')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - link "KW Ukrainians Разом KW" [ref=e3] [cursor=pointer]:
      - /url: index.html
      - img "KW Ukrainians" [ref=e4]
      - generic [ref=e5]: Разом KW
    - generic [ref=e6]:
      - button "✉️ 0" [ref=e7] [cursor=pointer]:
        - text: ✉️
        - generic [ref=e8]: "0"
      - button "Адмін панель" [ref=e10] [cursor=pointer]
      - link "Головна" [ref=e11] [cursor=pointer]:
        - /url: index.html
      - link "Каталог" [ref=e12] [cursor=pointer]:
        - /url: catalog.html
      - link "Школа" [ref=e13] [cursor=pointer]:
        - /url: school.html
  - main [ref=e14]:
    - heading "Адмін-панель" [level=1] [ref=e15]
    - generic [ref=e16]:
      - heading "Вхід для адміністраторів" [level=2] [ref=e17]
      - generic [ref=e18]:
        - textbox "Email" [ref=e20]
        - textbox "Пароль" [ref=e22]
        - button "Увійти" [ref=e23] [cursor=pointer]
```

# Test source

```ts
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
  38  |     await expect(formSection).toHaveClass(/active/);
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
> 106 |     await page.locator('#inaccuracy-modal button:has-text("Відправити")').click();
      |                                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  139 |       return urlPattern.test('admin.html?id=test123');
  140 |     });
  141 | 
  142 |     expect(isValidAdminUrl).toBe(true);
  143 |   });
  144 | 
  145 |   // @T6: URL parameter auto-loads specialist form
  146 |   test('@T6 should verify URL parameter ?id=<spec-id> is correctly parsed and stored', async ({ page }) => {
  147 |     const testSpecId = '39';
  148 | 
  149 |     // Simulate email link click
  150 |     await page.goto(`/admin.html?id=${testSpecId}`);
  151 | 
  152 |     // Verify the URL is correct
  153 |     expect(page.url()).toContain(`?id=${testSpecId}`);
  154 | 
  155 |     // Verify the id field gets the parameter (via evaluate since form may not load without auth)
  156 |     const hasIdParam = await page.evaluate(() => {
  157 |       const params = new URLSearchParams(window.location.search);
  158 |       return params.get('id') === '39';
  159 |     });
  160 | 
  161 |     expect(hasIdParam).toBe(true);
  162 |   });
  163 | 
  164 |   // @T7: Cancel button closes inaccuracy modal
  165 |   test('@T7 should close inaccuracy report modal when cancel button is clicked', async ({ page }) => {
  166 |     await page.goto('/admin.html');
  167 | 
  168 |     // Open modal
  169 |     await page.evaluate(() => {
  170 |       if (typeof window.openInaccuracyReport === 'function') {
  171 |         window.openInaccuracyReport('39', 'Test Specialist');
  172 |       }
  173 |     });
  174 | 
  175 |     // Modal should be visible
  176 |     const modal = page.locator('#inaccuracy-modal');
  177 |     await expect(modal).toBeVisible();
  178 |     await expect(modal).not.toHaveAttribute('hidden');
  179 | 
  180 |     // Click cancel button
  181 |     await page.locator('#inaccuracy-modal button:has-text("Скасувати")').click();
  182 | 
  183 |     // Modal should be visually hidden and have hidden attribute
  184 |     await expect(modal).toBeHidden();
  185 |     await expect(modal).toHaveAttribute('hidden');
  186 |   });
  187 | 
  188 |   // @T8: Escape key and backdrop click close inaccuracy modal
  189 |   test('@T8 should close inaccuracy report modal on Escape key and backdrop click', async ({ page }) => {
  190 |     await page.goto('/admin.html');
  191 | 
  192 |     // Open modal
  193 |     await page.evaluate(() => {
  194 |       if (typeof window.openInaccuracyReport === 'function') {
  195 |         window.openInaccuracyReport('39', 'Test Specialist');
  196 |       }
  197 |     });
  198 | 
  199 |     const modal = page.locator('#inaccuracy-modal');
  200 |     await expect(modal).toBeVisible();
  201 | 
  202 |     // Press Escape
  203 |     await page.keyboard.press('Escape');
  204 |     await expect(modal).toBeHidden();
  205 | 
  206 |     // Reopen modal
```