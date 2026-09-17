# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: catalog-improvements.spec.ts >> Catalog Improvements >> 3. Ukrainian translations: All categories show Ukrainian names in catalog
- Location: tests/e2e/catalog-improvements.spec.ts:76:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
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
      - link "Головна" [ref=e7] [cursor=pointer]:
        - /url: index.html
      - link "Каталог спеціалістів" [ref=e8] [cursor=pointer]:
        - /url: catalog.html
      - link "Школа" [ref=e9] [cursor=pointer]:
        - /url: school.html
      - link "+ Додати спеціаліста" [ref=e10] [cursor=pointer]:
        - /url: apply.html
      - button "Змінити мову / Change language" [ref=e11] [cursor=pointer]:
        - img "English" [ref=e12]
  - main [ref=e13]:
    - region "Фільтри каталогу" [ref=e14]:
      - generic [ref=e15]:
        - searchbox "Пошук" [ref=e16]
        - combobox "Локація" [ref=e17]
      - group "Головні категорії" [ref=e18]
      - group "Підкатегорії"
    - paragraph [ref=e19]: Завантаження…
    - region "Спеціалісти"
  - contentinfo [ref=e20]:
    - paragraph [ref=e21]: Дані каталогу оновлюються через громадську модерацію. Побачили помилку чи хочете додати спеціаліста? Зверніться до модераторів громади KW.
```

# Test source

```ts
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
  47  |     await page.goto("/apply.html");
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
  106 |     }
  107 | 
  108 |     // Verify no English category names are shown
  109 |     const allPillsText = await page.locator("#category-pills").textContent();
  110 |     expect(allPillsText).not.toContain("Beauty");
  111 |     expect(allPillsText).not.toContain("Health");
  112 |     expect(allPillsText).not.toContain("Education");
  113 |     expect(allPillsText).not.toContain("Services");
  114 |     expect(allPillsText).not.toContain("Service");
  115 |     expect(allPillsText).not.toContain("Auto");
  116 |     expect(allPillsText).not.toContain("Legal");
  117 |     expect(allPillsText).not.toContain("Real Estate");
  118 |     expect(allPillsText).not.toContain("Food");
  119 |     expect(allPillsText).not.toContain("Photo/Video");
  120 | 
  121 |     // At least some Ukrainian categories should be present
  122 |     const foundCount = Object.values(expectedTranslations).filter((v) => v)
  123 |       .length;
> 124 |     expect(foundCount).toBeGreaterThan(0);
      |                        ^ Error: expect(received).toBeGreaterThan(expected)
  125 |   });
  126 | 
  127 |   test("4. No duplicate categories in apply form", async ({ page }) => {
  128 |     await page.goto("/apply.html");
  129 | 
  130 |     const formSelect = page.locator("#f-category");
  131 |     const formOptions = formSelect.locator("option");
  132 | 
  133 |     const formCategories: string[] = [];
  134 |     for (let i = 0; i < (await formOptions.count()); i++) {
  135 |       const option = formOptions.nth(i);
  136 |       const value = await option.getAttribute("value");
  137 | 
  138 |       if (value && value.trim()) {
  139 |         formCategories.push(value);
  140 |       }
  141 |     }
  142 | 
  143 |     // Check for duplicates
  144 |     const uniqueCategories = new Set(formCategories);
  145 |     expect(formCategories.length).toBe(
  146 |       uniqueCategories.size,
  147 |       "Form has duplicate categories"
  148 |     );
  149 | 
  150 |     // Verify no "Legal and bookkeeping" duplicate
  151 |     expect(formCategories).not.toContain("Legal and bookkeeping");
  152 |   });
  153 | 
  154 |   test("5. Category sync: Same categories in admin edit form", async ({
  155 |     page,
  156 |   }) => {
  157 |     await page.goto("/admin.html");
  158 |     await page.waitForLoadState("domcontentloaded");
  159 | 
  160 |     // Get categories from apply form first
  161 |     const applyPage = await page.context().newPage();
  162 |     await applyPage.goto("/apply.html");
  163 | 
  164 |     const applySelect = applyPage.locator("#f-category");
  165 |     const applyOptions = applySelect.locator("option");
  166 |     const applyCategories: string[] = [];
  167 | 
  168 |     for (let i = 0; i < (await applyOptions.count()); i++) {
  169 |       const option = applyOptions.nth(i);
  170 |       const value = await option.getAttribute("value");
  171 |       if (value && value.trim()) {
  172 |         applyCategories.push(value);
  173 |       }
  174 |     }
  175 | 
  176 |     // Get categories from admin form
  177 |     const adminSelect = page.locator("select[name='category']");
  178 |     const adminOptions = adminSelect.locator("option");
  179 |     const adminCategories: string[] = [];
  180 | 
  181 |     for (let i = 0; i < (await adminOptions.count()); i++) {
  182 |       const option = adminOptions.nth(i);
  183 |       const value = await option.getAttribute("value");
  184 |       if (value && value.trim()) {
  185 |         adminCategories.push(value);
  186 |       }
  187 |     }
  188 | 
  189 |     // Verify same categories in both forms
  190 |     expect(adminCategories.sort()).toEqual(applyCategories.sort());
  191 | 
  192 |     await applyPage.close();
  193 |   });
  194 | });
  195 | 
```