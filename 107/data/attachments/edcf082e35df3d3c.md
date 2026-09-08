# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: i18n.spec.ts >> Language toggle (UA / EN) >> каталог динамічно перекладає елементи без перезавантаження
- Location: tests/e2e/i18n.spec.ts:65:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#status')
Expected substring: "Знайдено"
Received string:    "Завантаження…"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#status')
    14 × locator resolved to <p id="status" class="status" aria-live="polite">Завантаження…</p>
       - unexpected value "Завантаження…"

```

```yaml
- paragraph: Завантаження…
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Language toggle (UA / EN)', () => {
  4   |   // Кожен тест отримує свіжий browser context, тож localStorage порожній
  5   |   // і мова за замовчуванням — українська.
  6   | 
  7   |   test('показує SVG-прапор, а не емоджі (емоджі не рендеряться на Windows)', async ({ page }) => {
  8   |     await page.goto('/');
  9   | 
  10  |     const toggle = page.locator('#lang-toggle');
  11  |     await expect(toggle).toBeVisible();
  12  | 
  13  |     // Всередині кнопки має бути саме картинка прапора
  14  |     const flag = toggle.locator('img');
  15  |     await expect(flag).toBeVisible();
  16  |     await expect(flag).toHaveAttribute('src', /assets\/flags\/ca\.svg$/);
  17  | 
  18  |     // Картинка має реально завантажитись (не broken image)
  19  |     const loaded = await flag.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
  20  |     expect(loaded).toBe(true);
  21  | 
  22  |     // В кнопці не має лишитись емоджі-прапорів
  23  |     await expect(toggle).not.toContainText('🇨🇦');
  24  |     await expect(toggle).not.toContainText('🇺🇦');
  25  |   });
  26  | 
  27  |   test('перемикає мову на EN і назад на UA', async ({ page }) => {
  28  |     await page.goto('/');
  29  | 
  30  |     const toggle = page.locator('#lang-toggle');
  31  |     const heading = page.locator('h1');
  32  | 
  33  |     await expect(heading).toContainText('Українська громада');
  34  | 
  35  |     await toggle.click();
  36  |     await expect(heading).toContainText('Ukrainian Community');
  37  |     await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  38  |     await expect(toggle.locator('img')).toHaveAttribute('src', /assets\/flags\/ua\.svg$/);
  39  | 
  40  |     await toggle.click();
  41  |     await expect(heading).toContainText('Українська громада');
  42  |     await expect(page.locator('html')).toHaveAttribute('lang', 'ua');
  43  |     await expect(toggle.locator('img')).toHaveAttribute('src', /assets\/flags\/ca\.svg$/);
  44  |   });
  45  | 
  46  |   test('запам\'ятовує вибрану мову між сторінками', async ({ page }) => {
  47  |     await page.goto('/');
  48  |     await page.locator('#lang-toggle').click();
  49  |     await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  50  | 
  51  |     await page.goto('/catalog.html');
  52  |     await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  53  |     await expect(page.locator('#lang-toggle')).toBeVisible();
  54  |   });
  55  | 
  56  |   test('заголовок школи має SVG-прапор України', async ({ page }) => {
  57  |     await page.goto('/');
  58  | 
  59  |     const flag = page.locator('#school-heading img.inline-flag');
  60  |     await expect(flag).toBeVisible();
  61  |     const loaded = await flag.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
  62  |     expect(loaded).toBe(true);
  63  |   });
  64  | 
  65  |   test('каталог динамічно перекладає елементи без перезавантаження', async ({ page }) => {
  66  |     await page.goto('/catalog.html');
  67  |     
  68  |     // Check initial Ukrainian text
  69  |     await expect(page.locator('#search-input')).toHaveAttribute('placeholder', 'Пошук за іменем, описом або підкатегорією…');
  70  |     // Mock the data to avoid pending state if it fetches fast, or just wait for status to show "Знайдено"
> 71  |     await expect(page.locator('#status')).toContainText('Знайдено');
      |                                           ^ Error: expect(locator).toContainText(expected) failed
  72  | 
  73  |     // Switch to English
  74  |     const toggle = page.locator('#lang-toggle');
  75  |     await toggle.click();
  76  | 
  77  |     // Check English text
  78  |     await expect(page.locator('#search-input')).toHaveAttribute('placeholder', 'Search by name, description, or subcategory...');
  79  |     await expect(page.locator('#status')).toContainText('Found');
  80  |   });
  81  | 
  82  |   test('перекладає сторінку школи (school.html) на EN і назад на UA', async ({ page }) => {
  83  |     await page.goto('/school.html');
  84  | 
  85  |     // Початковий український текст
  86  |     await expect(page).toHaveTitle(/Українська школа Ватерлу/);
  87  |     await expect(page.locator('h1')).toContainText('Українська школа в регіоні Ватерлу');
  88  |     await expect(page.locator('h2', { hasText: 'Для молодших дітей' })).toBeVisible();
  89  |     await expect(page.locator('h2', { hasText: 'Для підлітків' })).toBeVisible();
  90  |     await expect(page.locator('h2', { hasText: 'Для батьків' })).toBeVisible();
  91  | 
  92  |     // Перемикаємо на англійську
  93  |     const toggle = page.locator('#lang-toggle');
  94  |     await toggle.click();
  95  | 
  96  |     // Перевіряємо англійський переклад
  97  |     await expect(page).toHaveTitle(/Ukrainian School Waterloo/);
  98  |     await expect(page.locator('h1')).toContainText('Ukrainian School in Waterloo Region');
  99  |     await expect(page.locator('h2', { hasText: 'For Younger Children' })).toBeVisible();
  100 |     await expect(page.locator('h2', { hasText: 'For Teens' })).toBeVisible();
  101 |     await expect(page.locator('h2', { hasText: 'For Parents' })).toBeVisible();
  102 |     await expect(page.locator('nav a.nav-link[href="school.html"]')).toHaveText('School');
  103 |     await expect(page.locator('nav a.nav-link[href="index.html"]')).toHaveText('Home');
  104 | 
  105 |     // Перемикаємо назад на українську
  106 |     await toggle.click();
  107 |     await expect(page).toHaveTitle(/Українська школа Ватерлу/);
  108 |     await expect(page.locator('h1')).toContainText('Українська школа в регіоні Ватерлу');
  109 |     await expect(page.locator('h2', { hasText: 'Для молодших дітей' })).toBeVisible();
  110 |     await expect(page.locator('nav a.nav-link[href="school.html"]')).toHaveText('Школа');
  111 |   });
  112 | });
  113 | 
  114 | 
```