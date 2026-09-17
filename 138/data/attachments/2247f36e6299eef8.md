# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site.spec.js >> показує іконку категорії та посилання на форму зворотного зв'язку в модалці
- Location: tests/e2e/site.spec.js:147:5

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('.card').filter({ hasText: 'Salon Kalyna' }).locator('.category-icon')
Expected pattern: /fa-spa/
Received string:  "fas fa-star category-icon"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('.card').filter({ hasText: 'Salon Kalyna' }).locator('.category-icon')
    14 × locator resolved to <i class="fas fa-star category-icon"></i>
       - unexpected value "fas fa-star category-icon"

```

```yaml
- text: 
```

# Test source

```ts
  51  | }
  52  | 
  53  | test.beforeEach(async ({ page }) => {
  54  |   await mockDataFetch(page);
  55  |   await page.goto("/catalog.html");
  56  |   await expect(page.locator(".card")).toHaveCount(3);
  57  | });
  58  | 
  59  | test("завантажує дані та показує картки спеціалістів", async ({ page }) => {
  60  |   await expect(page.locator("#status")).toHaveText("Знайдено: 3");
  61  | 
  62  |   const names = await page.locator(".card-name").allTextContents();
  63  |   expect(names.sort()).toEqual(
  64  |     ["Dr. Olena Ivanenko", "Salon Kalyna", "Марія Коваль"].sort()
  65  |   );
  66  | 
  67  |   const first = page.locator(".card", { hasText: "Dr. Olena Ivanenko" });
  68  |   await first.click();
  69  |   await expect(page.locator("#modal-contacts .card-contact-phone")).toHaveAttribute(
  70  |     "href",
  71  |     "tel:+15195550101"
  72  |   );
  73  |   await expect(page.locator("#modal-contacts .card-contact-instagram")).toHaveAttribute(
  74  |     "href",
  75  |     "https://instagram.com/dr_ivanenko"
  76  |   );
  77  |   // Telegram і Facebook порожні для цього спеціаліста — не мають рендеритись.
  78  |   await expect(page.locator("#modal-contacts .card-contact-telegram")).toHaveCount(0);
  79  |   await expect(page.locator("#modal-contacts .card-contact-facebook")).toHaveCount(0);
  80  | });
  81  | 
  82  | test("пошук фільтрує картки за іменем/описом/підкатегорією", async ({ page }) => {
  83  |   await page.locator("#search-input").fill("Salon");
  84  |   await expect(page.locator(".card")).toHaveCount(1);
  85  |   await expect(page.locator(".card-name")).toHaveText("Salon Kalyna");
  86  |   await expect(page.locator("#status")).toHaveText("Знайдено: 1");
  87  | 
  88  |   await page.locator("#search-input").fill("");
  89  |   await expect(page.locator(".card")).toHaveCount(3);
  90  | });
  91  | 
  92  | test("перемикання категорії оновлює набір підкатегорій і карток", async ({ page }) => {
  93  |   await page.locator(".pill", { hasText: "Освіта" }).click();
  94  | 
  95  |   await expect(page.locator(".card")).toHaveCount(1);
  96  |   await expect(page.locator(".card-name")).toHaveText("Марія Коваль");
  97  |   await expect(page.locator(".chip")).toHaveCount(1);
  98  |   await expect(page.locator(".chip")).toHaveText("Репетитори");
  99  | 
  100 |   await expect(page.locator(".pill")).toHaveCount(2);
  101 |   await expect(page.locator(".pill.active")).toHaveText("Освіта");
  102 |   await expect(page.locator(".pill-clear")).toBeVisible();
  103 | 
  104 |   await page.locator(".pill-clear").click();
  105 |   await expect(page.locator(".card")).toHaveCount(3);
  106 |   await expect(page.locator(".chip")).toHaveCount(0);
  107 | 
  108 |   await page.locator(".pill", { hasText: "Краса та догляд" }).click();
  109 | 
  110 |   await expect(page.locator(".card")).toHaveCount(1);
  111 |   await expect(page.locator(".card-name")).toHaveText("Salon Kalyna");
  112 |   await expect(page.locator(".chip")).toHaveCount(1);
  113 |   await expect(page.locator(".chip")).toHaveText("Перукар");
  114 | 
  115 |   await page.locator(".pill.active", { hasText: "Краса та догляд" }).click();
  116 |   await expect(page.locator(".card")).toHaveCount(3);
  117 |   await expect(page.locator(".chip")).toHaveCount(0);
  118 | });
  119 | 
  120 | test("локація фільтрує за містом з адреси або типу локації", async ({ page }) => {
  121 |   await page.selectOption("#location-select", "Kitchener");
  122 |   await expect(page.locator(".card")).toHaveCount(1);
  123 |   await expect(page.locator(".card-name")).toHaveText("Dr. Olena Ivanenko");
  124 | 
  125 |   await page.selectOption("#location-select", "Waterloo");
  126 |   await expect(page.locator(".card")).toHaveCount(1);
  127 |   await expect(page.locator(".card-name")).toHaveText("Salon Kalyna");
  128 |   
  129 |   await page.selectOption("#location-select", "Guelph");
  130 |   await expect(page.locator(".card")).toHaveCount(1);
  131 |   await expect(page.locator(".card-name")).toHaveText("Марія Коваль");
  132 | 
  133 |   await page.selectOption("#location-select", "");
  134 |   await expect(page.locator(".card")).toHaveCount(3);
  135 | });
  136 | 
  137 | test("каталог має загальну шапку з кнопкою 'Додати спеціаліста'", async ({ page }) => {
  138 |   const header = page.locator("nav.top-nav");
  139 |   await expect(header).toBeVisible();
  140 |   
  141 |   const addBtn = header.locator("a", { hasText: "Додати спеціаліста" });
  142 |   await expect(addBtn).toBeVisible();
  143 |   await expect(addBtn).toHaveAttribute("href", "apply.html");
  144 | });
  145 | 
  146 | 
  147 | test("показує іконку категорії та посилання на форму зворотного зв'язку в модалці", async ({ page }) => {
  148 |   const card = page.locator(".card", { hasText: "Salon Kalyna" });
  149 | 
  150 |   // Icon
> 151 |   await expect(card.locator(".category-icon")).toHaveClass(/fa-spa/);
      |                                                ^ Error: expect(locator).toHaveClass(expected) failed
  152 | 
  153 |   // Click to open modal
  154 |   await card.click();
  155 | 
  156 |   // Feedback link in modal
  157 |   const feedbackLink = page.locator("#modal-feedback-link");
  158 |   await expect(feedbackLink).toBeVisible();
  159 |   await expect(feedbackLink).toHaveAttribute("href", "feedback.html?id=1");
  160 | });
  161 | 
```