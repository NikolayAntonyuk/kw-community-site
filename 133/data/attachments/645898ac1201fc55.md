# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: catalog-improvements.spec.ts >> Catalog Improvements >> 5. Category sync: Same categories in admin edit form
- Location: tests/e2e/catalog-improvements.spec.ts:154:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/catalog.html
Call log:
  - navigating to "http://localhost:3000/catalog.html", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("Catalog Improvements", () => {
  4   |   test.beforeEach(async ({ page }) => {
> 5   |     await page.goto("http://localhost:3000/catalog.html");
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/catalog.html
  6   |     await page.waitForLoadState("networkidle");
  7   |   });
  8   | 
  9   |   test("1. Phone display: Shows only number without 'Телефон:' label", async ({
  10  |     page,
  11  |   }) => {
  12  |     // Click first specialist card to open modal
  13  |     const firstCard = page.locator(".cards-grid button").first();
  14  |     await firstCard.click();
  15  | 
  16  |     // Get modal contacts
  17  |     const contactsDiv = page.locator("#modal-contacts");
  18  |     const contactsText = await contactsDiv.textContent();
  19  | 
  20  |     // Verify phone is shown without "Телефон:" prefix
  21  |     expect(contactsText).not.toContain("Телефон:");
  22  | 
  23  |     // Verify phone number is present (should be digits)
  24  |     const phoneLink = contactsDiv.locator("a[href^='tel:']");
  25  |     const phoneText = await phoneLink.textContent();
  26  |     expect(phoneText).toMatch(/^\d+$/); // Only digits
  27  |   });
  28  | 
  29  |   test("2. Categories sync: All catalog categories exist in apply form", async ({
  30  |     page,
  31  |   }) => {
  32  |     // Get categories from catalog
  33  |     const categoryPills = page.locator("#category-pills .pill");
  34  |     const catalogCategories: string[] = [];
  35  | 
  36  |     for (let i = 0; i < (await categoryPills.count()); i++) {
  37  |       const pill = categoryPills.nth(i);
  38  |       const text = await pill.textContent();
  39  |       // Extract category name (after icon)
  40  |       const categoryName = text?.replace(/[^\w\s]/g, "").trim() || "";
  41  |       if (categoryName && !categoryName.includes("Усі")) {
  42  |         catalogCategories.push(categoryName);
  43  |       }
  44  |     }
  45  | 
  46  |     // Navigate to apply form
  47  |     await page.goto("http://localhost:3000/apply.html");
  48  | 
  49  |     // Get categories from form select
  50  |     const formSelect = page.locator("#f-category");
  51  |     const formOptions = formSelect.locator("option");
  52  | 
  53  |     const formCategories: string[] = [];
  54  |     for (let i = 0; i < (await formOptions.count()); i++) {
  55  |       const option = formOptions.nth(i);
  56  |       const value = await option.getAttribute("value");
  57  |       const text = await option.textContent();
  58  | 
  59  |       // Skip empty option
  60  |       if (value && text && text.trim()) {
  61  |         formCategories.push(text.trim());
  62  |       }
  63  |     }
  64  | 
  65  |     // Verify all catalog categories are in form
  66  |     for (const catFromCatalog of catalogCategories) {
  67  |       const found = formCategories.some((formCat) =>
  68  |         formCat.toLowerCase().includes(catFromCatalog.toLowerCase())
  69  |       );
  70  |       expect(found).toBeTruthy(
  71  |         `Category "${catFromCatalog}" from catalog not found in form`
  72  |       );
  73  |     }
  74  |   });
  75  | 
  76  |   test("3. Ukrainian translations: All categories show Ukrainian names in catalog", async ({
  77  |     page,
  78  |   }) => {
  79  |     // Expected Ukrainian category translations
  80  |     const expectedTranslations: Record<string, boolean> = {
  81  |       "Краса та догляд": false,
  82  |       "Здоров'я та Медицина": false,
  83  |       "Освіта / Дитсадки / Гуртки": false,
  84  |       "Побутові та інші послуги": false,
  85  |       "Інші послуги": false,
  86  |       Авто: false,
  87  |       "Юридичні послуги": false,
  88  |       Нерухомість: false,
  89  |       "Їжа та Кондитери": false,
  90  |       "Фото/Відео": false,
  91  |     };
  92  | 
  93  |     // Get all category pills text
  94  |     const categoryPills = page.locator("#category-pills .pill");
  95  | 
  96  |     for (let i = 0; i < (await categoryPills.count()); i++) {
  97  |       const pill = categoryPills.nth(i);
  98  |       const text = await pill.textContent();
  99  | 
  100 |       // Check if any expected Ukrainian translation is present
  101 |       for (const ukrCategory of Object.keys(expectedTranslations)) {
  102 |         if (text?.includes(ukrCategory)) {
  103 |           expectedTranslations[ukrCategory] = true;
  104 |         }
  105 |       }
```