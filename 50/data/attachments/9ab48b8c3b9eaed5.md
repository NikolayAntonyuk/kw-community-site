# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: form-validation.spec.ts >> Form Validation and Security (Test Design / Boundary / Edge Cases) >> should reject form with no contacts provided
- Location: tests/e2e/form-validation.spec.ts:294:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "контакт"
Received string:    "apply_no_contacts_error"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - link "Разом KW" [ref=e3] [cursor=pointer]:
      - /url: index.html
    - link "← Назад до каталогу" [ref=e6] [cursor=pointer]:
      - /url: catalog.html
    - button "Змінити мову / Change language" [ref=e7] [cursor=pointer]:
      - img "English" [ref=e8]
  - banner [ref=e9]:
    - heading "Подати заявку в Каталог" [level=1] [ref=e10]
    - paragraph [ref=e11]: Заповніть форму нижче, щоб додати свої послуги до каталогу громади Kitchener-Waterloo.
  - main [ref=e12]:
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]: Ваш Email (не публікується, потрібен для зв'язку) *
        - textbox "Ваш Email (не публікується, потрібен для зв'язку) *" [ref=e17]: test@example.com
      - generic [ref=e18]:
        - generic [ref=e19]: Ім'я спеціаліста або назва компанії *
        - textbox "Ім'я спеціаліста або назва компанії *" [ref=e20]: Test Specialist
      - generic [ref=e21]:
        - generic [ref=e22]: Головна категорія *
        - combobox "Головна категорія *" [ref=e23]:
          - option "Оберіть категорию..."
          - option "Beauty (Краса)" [selected]
          - option "Здоров'я та Медицина"
          - option "Освіта / Дитсадки / Гуртки"
          - option "Побутові та інші послуги"
          - option "Авто послуги"
          - option "Юридичні послуги"
          - option "Нерухомість"
          - option "Їжа та Кондитери"
      - generic [ref=e24]:
        - generic [ref=e25]: "Підкатегорія (наприклад: Перукар, Юрист) *"
        - 'textbox "Підкатегорія (наприклад: Перукар, Юрист) *" [ref=e26]': Перукар
      - generic [ref=e27]:
        - generic [ref=e28]: Короткий опис послуг *
        - textbox "Короткий опис послуг *" [ref=e29]: Provide hair services
      - generic [ref=e30]:
        - generic [ref=e31]: Місто (Kitchener, Waterloo, Cambridge, Guelph тощо) *
        - combobox "Місто (Kitchener, Waterloo, Cambridge, Guelph тощо) *" [ref=e32]:
          - option "Оберіть місто..."
          - option "Kitchener" [selected]
          - option "Waterloo"
          - option "Cambridge"
          - option "Guelph"
          - option "Breslau"
          - option "Elmira"
          - option "Ayr"
          - option "Online / Віддалено"
          - option "Інше (вкажіть в адресі)"
      - generic [ref=e33]:
        - generic [ref=e34]: Точна адреса (якщо є)
        - textbox "Точна адреса (якщо є)" [ref=e35]
      - generic [ref=e36]:
        - generic [ref=e37]: Телефон
        - textbox "Телефон" [ref=e38]
      - generic [ref=e39]:
        - generic [ref=e40]: Telegram (лінк або нікнейм)
        - textbox "Telegram (лінк або нікнейм)" [ref=e41]
      - generic [ref=e42]:
        - generic [ref=e43]: Instagram (лінк)
        - textbox "Instagram (лінк)" [ref=e44]
      - generic [ref=e45]:
        - generic [ref=e46]: Facebook (лінк)
        - textbox "Facebook (лінк)" [ref=e47]
      - generic [ref=e48]:
        - generic [ref=e49]: Вебсайт (лінк)
        - textbox "Вебсайт (лінк)" [ref=e50]
      - generic [ref=e51]:
        - generic [ref=e52]: Орієнтовна ціна
        - textbox "Орієнтовна ціна" [ref=e53]
      - generic [ref=e54]:
        - generic [ref=e55]: Додаткові нотатки / Опис
        - textbox "Додаткові нотатки / Опис" [ref=e56]
      - button "Відправити заявку" [ref=e57] [cursor=pointer]
      - generic [ref=e58]: apply_no_contacts_error
  - contentinfo [ref=e59]:
    - paragraph [ref=e60]: Дані каталогу оновлюються через громадську модерацію.
```

# Test source

```ts
  225 | 
  226 |     const validity = await telegramInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
  227 |     expect(validity).toBe(false);
  228 |   });
  229 | 
  230 |   test("should reject telegram with special SQL characters", async ({ page }) => {
  231 |     const telegramInput = page.locator("#f-telegram");
  232 |     await telegramInput.fill("@user'; DROP--");
  233 |     await telegramInput.blur();
  234 | 
  235 |     const validity = await telegramInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
  236 |     expect(validity).toBe(false);
  237 |   });
  238 | 
  239 |   // ==================== URL FIELDS (Instagram, Facebook, Website) ====================
  240 |   test("should accept valid URLs", async ({ page }) => {
  241 |     const instagramInput = page.locator("#f-instagram");
  242 |     const validUrl = "https://instagram.com/testuser";
  243 |     await instagramInput.fill(validUrl);
  244 | 
  245 |     const validity = await instagramInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
  246 |     expect(validity).toBe(true);
  247 |   });
  248 | 
  249 |   test("should reject invalid URL format", async ({ page }) => {
  250 |     const instagramInput = page.locator("#f-instagram");
  251 |     await instagramInput.fill("not a url");
  252 |     await instagramInput.blur();
  253 | 
  254 |     const validity = await instagramInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
  255 |     expect(validity).toBe(false);
  256 |   });
  257 | 
  258 |   test("should restrict URL fields to HTTP(S) only via type=url", async ({ page }) => {
  259 |     const websiteInput = page.locator("#f-website");
  260 |     const inputType = await websiteInput.getAttribute("type");
  261 | 
  262 |     // The field is type=url which provides built-in XSS protection
  263 |     expect(inputType).toBe("url");
  264 |   });
  265 | 
  266 |   // ==================== PRICE FIELD VALIDATION ====================
  267 |   test("should have price pattern validation (no letters)", async ({ page }) => {
  268 |     const priceInput = page.locator("#f-price");
  269 |     const pattern = await priceInput.getAttribute("pattern");
  270 | 
  271 |     // Pattern should prevent letters
  272 |     expect(pattern).toContain("[^a-zA-Z");
  273 |   });
  274 | 
  275 |   test("should reject price with letters", async ({ page }) => {
  276 |     const priceInput = page.locator("#f-price");
  277 |     await priceInput.fill("fifteen dollars");
  278 |     await priceInput.blur();
  279 | 
  280 |     const validity = await priceInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
  281 |     expect(validity).toBe(false);
  282 |   });
  283 | 
  284 |   test("should reject price with SQL injection", async ({ page }) => {
  285 |     const priceInput = page.locator("#f-price");
  286 |     await priceInput.fill("10; DELETE FROM--");
  287 |     await priceInput.blur();
  288 | 
  289 |     const validity = await priceInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
  290 |     expect(validity).toBe(false);
  291 |   });
  292 | 
  293 |   // ==================== CONTACT REQUIREMENT ====================
  294 |   test("should reject form with no contacts provided", async ({ page }) => {
  295 |     // Fill all required fields except contacts
  296 |     await page.locator("#f-email").fill("test@example.com");
  297 |     await page.locator("#f-name").fill("Test Specialist");
  298 |     await page.locator("#f-category").selectOption("Beauty");
  299 |     await page.locator("#f-subcategory").fill("Перукар");
  300 |     await page.locator("#f-description").fill("Provide hair services");
  301 |     await page.locator("#f-locationType").selectOption("Kitchener");
  302 | 
  303 |     // Leave all contacts empty
  304 |     await page.locator("#f-phone").fill("");
  305 |     await page.locator("#f-telegram").fill("");
  306 |     await page.locator("#f-instagram").fill("");
  307 |     await page.locator("#f-facebook").fill("");
  308 |     await page.locator("#f-website").fill("");
  309 | 
  310 |     // Wait a bit for form to be ready
  311 |     await page.waitForTimeout(500);
  312 | 
  313 |     await page.locator("#submit-btn").click();
  314 | 
  315 |     // Wait for error message to appear
  316 |     await page.waitForTimeout(1000);
  317 | 
  318 |     // Should show error message
  319 |     const errorMessage = page.locator("#form-message");
  320 |     const isVisible = await errorMessage.isVisible();
  321 |     const errorClass = await errorMessage.getAttribute("class");
  322 | 
  323 |     if (isVisible && errorClass?.includes("error")) {
  324 |       const text = await errorMessage.textContent();
> 325 |       expect(text).toContain("контакт");
      |                    ^ Error: expect(received).toContain(expected) // indexOf
  326 |     } else {
  327 |       // If not visible, this test will fail - but that's the point
  328 |       expect(isVisible).toBe(true);
  329 |     }
  330 |   });
  331 | 
  332 |   test("should accept form with at least one contact (phone)", async ({ page }) => {
  333 |     // Fill all required fields
  334 |     await page.locator("#f-email").fill("test@example.com");
  335 |     await page.locator("#f-name").fill("Test Specialist");
  336 |     await page.locator("#f-category").selectOption("Beauty");
  337 |     await page.locator("#f-subcategory").fill("Перукар");
  338 |     await page.locator("#f-description").fill("Provide hair services");
  339 |     await page.locator("#f-locationType").selectOption("Kitchener");
  340 | 
  341 |     // Fill only phone contact
  342 |     await page.locator("#f-phone").fill("519-555-0123");
  343 | 
  344 |     await page.locator("#submit-btn").click();
  345 | 
  346 |     // Should not show error message
  347 |     const errorMessage = page.locator("#form-message");
  348 |     await expect(errorMessage).not.toHaveClass(/error/);
  349 |   });
  350 | 
  351 |   // ==================== TEXTAREA VALIDATION ====================
  352 |   test("should accept notes up to 1000 characters", async ({ page }) => {
  353 |     const notesInput = page.locator("#f-notes");
  354 |     const notes = "A".repeat(1000);
  355 |     await notesInput.fill(notes);
  356 | 
  357 |     const actualLength = await notesInput.evaluate((el: HTMLTextAreaElement) => el.value.length);
  358 |     expect(actualLength).toBe(1000);
  359 |   });
  360 | 
  361 |   test("should prevent notes exceeding 1000 characters", async ({ page }) => {
  362 |     const notesInput = page.locator("#f-notes");
  363 |     const longNotes = "A".repeat(1001);
  364 |     await notesInput.fill(longNotes);
  365 | 
  366 |     const actualLength = await notesInput.evaluate((el: HTMLTextAreaElement) => el.value.length);
  367 |     expect(actualLength).toBeLessThanOrEqual(1000);
  368 |   });
  369 | 
  370 |   test("should reject notes with HTML injection", async ({ page }) => {
  371 |     const notesInput = page.locator("#f-notes");
  372 |     await notesInput.fill("<script>alert('xss')</script>");
  373 | 
  374 |     // The script should not execute; it should be treated as plain text
  375 |     const value = await notesInput.evaluate((el: HTMLTextAreaElement) => el.value);
  376 |     expect(value).toContain("<script>");
  377 |   });
  378 | 
  379 |   // ==================== ADDRESS FIELD ====================
  380 |   test("should accept address with special characters", async ({ page }) => {
  381 |     const addressInput = page.locator("#f-address");
  382 |     await addressInput.fill("123 Main St. #456, Kitchener, ON N2H 1A1");
  383 | 
  384 |     const validity = await addressInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
  385 |     expect(validity).toBe(true);
  386 |   });
  387 | 
  388 |   test("should reject address exceeding 150 characters", async ({ page }) => {
  389 |     const addressInput = page.locator("#f-address");
  390 |     const longAddress = "A".repeat(151);
  391 |     await addressInput.fill(longAddress);
  392 | 
  393 |     const actualLength = await addressInput.evaluate((el: HTMLInputElement) => el.value.length);
  394 |     expect(actualLength).toBeLessThanOrEqual(150);
  395 |   });
  396 | 
  397 |   // ==================== WHITESPACE TRIMMING ====================
  398 |   test("should trim whitespace from all text inputs", async ({ page }) => {
  399 |     const nameInput = page.locator("#f-name");
  400 |     await nameInput.fill("  Test Name  ");
  401 | 
  402 |     const valueAttribute = await nameInput.evaluate((el: HTMLInputElement) => el.value);
  403 |     // The raw value might still have spaces; trimming happens on submit
  404 |     expect(valueAttribute.trim()).toBe("Test Name");
  405 |   });
  406 | 
  407 |   // ==================== ACCESSIBILITY ====================
  408 |   test("should have proper labels for all form fields", async ({ page }) => {
  409 |     const labels = await page.locator("label").count();
  410 |     const inputs = await page.locator("input, select, textarea").count();
  411 | 
  412 |     // Should have roughly equal number of labels to inputs
  413 |     expect(labels).toBeGreaterThan(0);
  414 |     expect(inputs).toBeGreaterThan(0);
  415 |   });
  416 | 
  417 |   test("should have required attribute on mandatory fields", async ({ page }) => {
  418 |     const requiredFields = ["f-email", "f-name", "f-category", "f-subcategory", "f-description", "f-locationType"];
  419 | 
  420 |     for (const fieldId of requiredFields) {
  421 |       const field = page.locator(`#${fieldId}`);
  422 |       const isRequired = await field.evaluate((el: HTMLInputElement | HTMLSelectElement) => el.required);
  423 |       expect(isRequired).toBe(true);
  424 |     }
  425 |   });
```