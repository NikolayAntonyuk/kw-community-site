# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: catalog-improvements.spec.ts >> Catalog Improvements >> 4. No duplicate categories in apply form
- Location: tests/e2e/catalog-improvements.spec.ts:127:7

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected value: not "Legal and bookkeeping"
Received array:     ["Beauty", "Health", "Education", "Services", "Service", "Auto", "Legal", "Legal and bookkeeping", "Real Estate", "Food", "Photo/Video", "IT", "Житло (рієлтор, прибирання, ремонт)", "Лікарі/ветеринари", "Освіта/Дитсадки/Гуртки", "Перекладач", "Швеї"]
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - navigation [ref=f1e2]:
    - link "KW Ukrainians Разом KW" [ref=f1e3] [cursor=pointer]:
      - /url: index.html
      - img "KW Ukrainians" [ref=f1e4]
      - generic [ref=f1e5]: Разом KW
    - generic [ref=f1e6]:
      - link "Головна" [ref=f1e7] [cursor=pointer]:
        - /url: index.html
      - link "Каталог спеціалістів" [ref=f1e8] [cursor=pointer]:
        - /url: catalog.html
      - link "Школа" [ref=f1e9] [cursor=pointer]:
        - /url: school.html
      - button "Змінити мову / Change language" [ref=f1e10] [cursor=pointer]:
        - img "English" [ref=f1e11]
  - banner [ref=f1e12]:
    - heading "Подати заявку в Каталог" [level=1] [ref=f1e13]
    - paragraph [ref=f1e14]: Заповніть форму нижче, щоб додати свої послуги до каталогу громади Kitchener-Waterloo.
  - main [ref=f1e15]:
    - generic [ref=f1e17]:
      - generic [ref=f1e18]:
        - generic [ref=f1e19]: Ваш Email (не публікується, потрібен для зв'язку) *
        - textbox "Ваш Email (не публікується, потрібен для зв'язку) *" [ref=f1e20]
      - generic [ref=f1e21]:
        - generic [ref=f1e22]: Ім'я спеціаліста або назва компанії *
        - textbox "Ім'я спеціаліста або назва компанії *" [ref=f1e23]
      - generic [ref=f1e24]:
        - generic [ref=f1e25]: Головна категорія *
        - combobox "Головна категорія *" [ref=f1e26]:
          - option "Оберіть категорию..." [selected]
          - option "Beauty (Краса)"
          - option "Здоров'я та Медицина"
          - option "Освіта / Дитсадки / Гуртки"
          - option "Побутові та інші послуги"
          - option "Інші послуги"
          - option "Авто послуги"
          - option "Юридичні послуги"
          - option "Юридичні послуги"
          - option "Нерухомість"
          - option "Їжа та Кондитери"
          - option "Фото/Відео"
          - option "IT"
          - option "Житло (рієлтор, прибирання, ремонт)"
          - option "Лікарі/ветеринари"
          - option "Освіта/Дитсадки/Гуртки"
          - option "Перекладач"
          - option "Швеї"
      - generic [ref=f1e27]:
        - generic [ref=f1e28]: "Підкатегорія (наприклад: Перукар, Юрист) *"
        - 'textbox "Підкатегорія (наприклад: Перукар, Юрист) *" [ref=f1e29]'
      - generic [ref=f1e30]:
        - generic [ref=f1e31]: Короткий опис послуг *
        - textbox "Короткий опис послуг *" [ref=f1e32]
      - generic [ref=f1e33]:
        - generic [ref=f1e34]: Місто (Kitchener, Waterloo, Cambridge, Guelph тощо) *
        - combobox "Місто (Kitchener, Waterloo, Cambridge, Guelph тощо) *" [ref=f1e35]:
          - option "Оберіть місто..." [selected]
          - option "Kitchener"
          - option "Waterloo"
          - option "Cambridge"
          - option "Guelph"
          - option "Online / Віддалено"
          - option "Інше (вкажіть в адресі)"
      - generic [ref=f1e36]:
        - generic [ref=f1e37]: Точна адреса (якщо є)
        - textbox "Точна адреса (якщо є)" [ref=f1e38]
      - generic [ref=f1e39]:
        - generic [ref=f1e40]: Телефон
        - textbox "Телефон" [ref=f1e41]
      - generic [ref=f1e42]:
        - generic [ref=f1e43]: Telegram (лінк або нікнейм)
        - textbox "Telegram (лінк або нікнейм)" [ref=f1e44]
      - generic [ref=f1e45]:
        - generic [ref=f1e46]: Instagram (лінк)
        - textbox "Instagram (лінк)" [ref=f1e47]
      - generic [ref=f1e48]:
        - generic [ref=f1e49]: Facebook (лінк)
        - textbox "Facebook (лінк)" [ref=f1e50]
      - generic [ref=f1e51]:
        - generic [ref=f1e52]: Вебсайт (лінк)
        - textbox "Вебсайт (лінк)" [ref=f1e53]
      - generic [ref=f1e54]:
        - generic [ref=f1e55]: Орієнтовна ціна
        - textbox "Орієнтовна ціна" [ref=f1e56]
      - generic [ref=f1e57]:
        - generic [ref=f1e58]: Додаткові нотатки / Опис
        - textbox "Додаткові нотатки / Опис" [ref=f1e59]
      - button "Відправити заявку" [ref=f1e60] [cursor=pointer]
  - contentinfo [ref=f1e61]:
    - paragraph [ref=f1e62]: Дані каталогу оновлюються через громадську модерацію.
```

# Test source

```ts
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
  124 |     expect(foundCount).toBeGreaterThan(0);
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
> 151 |     expect(formCategories).not.toContain("Legal and bookkeeping");
      |                                ^ Error: expect(received).not.toContain(expected) // indexOf
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