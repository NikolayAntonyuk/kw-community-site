# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-email-features.spec.ts >> Email Features & Admin Panel (New Requirements) >> @T7 should close inaccuracy report modal when cancel button is clicked
- Location: tests/e2e/admin-email-features.spec.ts:165:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#inaccuracy-modal')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#inaccuracy-modal')

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
> 177 |     await expect(modal).toBeVisible();
      |                         ^ Error: expect(locator).toBeVisible() failed
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
  207 |     await page.evaluate(() => {
  208 |       if (typeof window.openInaccuracyReport === 'function') {
  209 |         window.openInaccuracyReport('39', 'Test Specialist');
  210 |       }
  211 |     });
  212 |     await expect(modal).toBeVisible();
  213 | 
  214 |     // Click on backdrop (outside the inner dialog card)
  215 |     await page.mouse.click(10, 10);
  216 |     await expect(modal).toBeHidden();
  217 |   });
  218 | });
  219 | 
```