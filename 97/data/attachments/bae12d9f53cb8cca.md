# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: error-reports.spec.ts >> Error Reports Requirements (Звіти про помилки) >> @T14 Opening admin via email link with feedback parameter auto-opens edit form with helper box
- Location: tests/e2e/error-reports.spec.ts:172:7

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator:  locator('#edit-name')
Expected: "Tanya UPDATED"
Received: "Tanya "
Timeout:  5000ms

Call log:
  - Expect "toHaveValue" with timeout 5000ms
  - waiting for locator('#edit-name')
    14 × locator resolved to <input type="text" id="edit-name"/>
       - unexpected value "Tanya "

```

```yaml
- textbox: Tanya
```

# Test source

```ts
  83  | 
  84  |     // Helper text must contain the suggested message
  85  |     const helperText = page.locator('#feedback-helper-text');
  86  |     await expect(helperText).toHaveText(suggestion);
  87  | 
  88  |     // Copy button must be visible inside helper container
  89  |     const copyBtn = page.locator('#btn-copy-feedback');
  90  |     await expect(copyBtn).toBeVisible();
  91  |     await expect(copyBtn).toHaveText(/Копіювати/);
  92  | 
  93  |     // Verify user-select style is set to "all" for easy copying
  94  |     const userSelect = await helperText.evaluate((el) => window.getComputedStyle(el).userSelect);
  95  |     expect(userSelect).toBe('all');
  96  |   });
  97  | 
  98  |   // @T11: Normal editing or adding specialist should NOT display auxiliary field
  99  |   test('@T11 Auxiliary suggestion field must be hidden during regular edits or creating new cards', async ({ page }) => {
  100 |     await page.goto('/admin.html');
  101 |     await page.waitForFunction(() => typeof window.editApp === 'function' && typeof window.showAddForm === 'function');
  102 | 
  103 |     // First open with feedback message
  104 |     await page.evaluate(() => {
  105 |       window.editApp('39', true, 'Правка');
  106 |     });
  107 |     await expect(page.locator('#feedback-helper-container')).toBeVisible();
  108 | 
  109 |     // Now open regular edit without feedback message
  110 |     await page.evaluate(() => {
  111 |       window.editApp('39', true);
  112 |     });
  113 |     await expect(page.locator('#feedback-helper-container')).toBeHidden();
  114 | 
  115 |     // Open add new specialist form
  116 |     await page.evaluate(() => {
  117 |       window.showAddForm();
  118 |     });
  119 |     await expect(page.locator('#feedback-helper-container')).toBeHidden();
  120 |   });
  121 | 
  122 |   // @T12: Report card should be saved with standard fields only and auxiliary field is not sent to DB
  123 |   test('@T12 Report card should be saved with standard fields only after editing (auxiliary field not saved to DB)', async ({ page }) => {
  124 |     await page.goto('/admin.html');
  125 |     await page.waitForFunction(() => typeof window.editApp === 'function');
  126 | 
  127 |     await page.evaluate(() => {
  128 |       window.editApp('39', true, 'Виправте веб-сайт на https://example.com');
  129 |     });
  130 | 
  131 |     // Helper container is only a visual DIV banner, not an input/textarea/select
  132 |     const inputsInHelper = page.locator('#feedback-helper-container input, #feedback-helper-container textarea, #feedback-helper-container select');
  133 |     await expect(inputsInHelper).toHaveCount(0);
  134 | 
  135 |     // Form inputs should only consist of standard specialist fields
  136 |     const formFieldIds = await page.evaluate(() => {
  137 |       const inputs = Array.from(document.querySelectorAll('#form-section input, #form-section textarea, #form-section select'));
  138 |       return inputs.map(i => i.id).filter(id => id.startsWith('edit-'));
  139 |     });
  140 | 
  141 |     // Verify list of standard fields
  142 |     const standardFields = ['edit-id', 'edit-islive', 'edit-name', 'edit-category', 'edit-subcategory', 'edit-desc', 'edit-loc', 'edit-address', 'edit-phone', 'edit-tg', 'edit-inst', 'edit-fb', 'edit-web', 'edit-price', 'edit-notes'];
  143 |     expect(formFieldIds).toEqual(standardFields);
  144 |     expect(formFieldIds).not.toContain('feedback-helper-text');
  145 |   });
  146 | 
  147 |   // @T13: Cancel returns admin to "Звіти про помилки" tab
  148 |   test('@T13 Canceling form should return admin to "Звіти про помилки" tab when opened from feedback', async ({ page }) => {
  149 |     await page.goto('/admin.html');
  150 |     await page.waitForFunction(() => typeof window.goToPage === 'function' && typeof window.editApp === 'function');
  151 | 
  152 |     // Admin selects "Звіти про помилки" tab
  153 |     await page.evaluate(() => {
  154 |       const tabEl = document.getElementById('tab-feedback');
  155 |       if (tabEl) window.goToPage(tabEl, 'feedback-section');
  156 |       window.editApp('39', true, 'Деяка пропозиція');
  157 |     });
  158 | 
  159 |     // Edit form is open
  160 |     await expect(page.locator('#form-section')).toHaveClass(/active/);
  161 | 
  162 |     // Admin clicks cancel
  163 |     await page.locator('#form-section button:has-text("Скасувати")').click();
  164 | 
  165 |     // Feedback tab and its content section should be active
  166 |     await expect(page.locator('#tab-feedback')).toHaveClass(/active/);
  167 |     await expect(page.locator('#feedback-section')).toHaveClass(/active/);
  168 |     await expect(page.locator('#form-section')).not.toHaveClass(/active/);
  169 |   });
  170 | 
  171 |   // @T14: Opening admin via email link with query parameter or hash auto-opens edit form with helper
  172 |   test('@T14 Opening admin via email link with feedback parameter auto-opens edit form with helper box', async ({ page }) => {
  173 |     const feedbackParam = 'Прошу оновити номер телефону та категорію';
  174 |     await page.goto(`/admin.html?id=1&feedback=${encodeURIComponent(feedbackParam)}`);
  175 |     await page.waitForFunction(() => typeof window.editApp === 'function');
  176 | 
  177 |     // Form section should be active
  178 |     const formSection = page.locator('#form-section');
  179 |     await expect(formSection).toHaveClass(/active/);
  180 | 
  181 |     // Specialist data pre-filled
  182 |     await expect(page.locator('#edit-id')).toHaveValue('1');
> 183 |     await expect(page.locator('#edit-name')).toHaveValue('Tanya UPDATED');
      |                                              ^ Error: expect(locator).toHaveValue(expected) failed
  184 | 
  185 |     // Helper container with feedback message from URL
  186 |     const helperContainer = page.locator('#feedback-helper-container');
  187 |     await expect(helperContainer).toBeVisible();
  188 |     const helperText = page.locator('#feedback-helper-text');
  189 |     await expect(helperText).toHaveText(feedbackParam);
  190 | 
  191 |     // Copy button is present
  192 |     await expect(page.locator('#btn-copy-feedback')).toBeVisible();
  193 |   });
  194 | 
  195 |   // @T15: Direct database saving without GitHub token prompts
  196 |   test('@T15 Saving card executes direct database update without GitHub token prompt', async ({ page }) => {
  197 |     await page.goto('/admin.html');
  198 |     await page.waitForFunction(() => typeof window.editApp === 'function' && typeof window.saveEdit === 'function');
  199 | 
  200 |     let promptCalled = false;
  201 |     page.on('dialog', async (dialog) => {
  202 |       if (dialog.type() === 'prompt') {
  203 |         promptCalled = true;
  204 |       }
  205 |       await dialog.accept();
  206 |     });
  207 | 
  208 |     await page.evaluate(async () => {
  209 |       await window.editApp('1', true, 'Зміна');
  210 |     });
  211 | 
  212 |     await page.locator('#edit-name').fill('Tanya Pro');
  213 |     await page.locator('#form-section button:has-text("Зберегти")').click();
  214 | 
  215 |     expect(promptCalled).toBe(false);
  216 |   });
  217 | 
  218 | });
  219 | 
```