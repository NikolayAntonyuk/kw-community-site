import { test, expect } from '@playwright/test';

test.describe('Language toggle (UA / EN)', () => {
  // Кожен тест отримує свіжий browser context, тож localStorage порожній
  // і мова за замовчуванням — українська.

  test('показує SVG-прапор, а не емоджі (емоджі не рендеряться на Windows)', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('#lang-toggle');
    await expect(toggle).toBeVisible();

    // Всередині кнопки має бути саме картинка прапора
    const flag = toggle.locator('img');
    await expect(flag).toBeVisible();
    await expect(flag).toHaveAttribute('src', /assets\/flags\/us\.svg$/);

    // Картинка має реально завантажитись (не broken image)
    const loaded = await flag.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(loaded).toBe(true);

    // В кнопці не має лишитись емоджі-прапорів
    await expect(toggle).not.toContainText('🇺🇸');
    await expect(toggle).not.toContainText('🇺🇦');
  });

  test('перемикає мову на EN і назад на UA', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('#lang-toggle');
    const heading = page.locator('h1');

    await expect(heading).toContainText('Українська громада');

    await toggle.click();
    await expect(heading).toContainText('Ukrainian Community');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(toggle.locator('img')).toHaveAttribute('src', /assets\/flags\/ua\.svg$/);

    await toggle.click();
    await expect(heading).toContainText('Українська громада');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ua');
  });

  test('запам\'ятовує вибрану мову між сторінками', async ({ page }) => {
    await page.goto('/');
    await page.locator('#lang-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.goto('/catalog.html');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#lang-toggle')).toBeVisible();
  });

  test('заголовок школи має SVG-прапор України', async ({ page }) => {
    await page.goto('/');

    const flag = page.locator('#school-heading img.inline-flag');
    await expect(flag).toBeVisible();
    const loaded = await flag.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(loaded).toBe(true);
  });

  test('каталог динамічно перекладає елементи без перезавантаження', async ({ page }) => {
    await page.goto('/catalog.html');
    
    // Check initial Ukrainian text
    await expect(page.locator('#search-input')).toHaveAttribute('placeholder', 'Пошук за іменем, описом або підкатегорією…');
    // Mock the data to avoid pending state if it fetches fast, or just wait for status to show "Знайдено"
    await expect(page.locator('#status')).toContainText('Знайдено');

    // Switch to English
    const toggle = page.locator('#lang-toggle');
    await toggle.click();

    // Check English text
    await expect(page.locator('#search-input')).toHaveAttribute('placeholder', 'Search by name, description, or subcategory...');
    await expect(page.locator('#status')).toContainText('Found');
  });

  test('перекладає сторінку школи (school.html) на EN і назад на UA', async ({ page }) => {
    await page.goto('/school.html');

    // Початковий український текст
    await expect(page).toHaveTitle(/Українська школа Ватерлу/);
    await expect(page.locator('h1')).toContainText('Українська школа в регіоні Ватерлу');
    await expect(page.locator('h2', { hasText: 'Для молодших дітей' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Для підлітків' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Для батьків' })).toBeVisible();

    // Перемикаємо на англійську
    const toggle = page.locator('#lang-toggle');
    await toggle.click();

    // Перевіряємо англійський переклад
    await expect(page).toHaveTitle(/Ukrainian School Waterloo/);
    await expect(page.locator('h1')).toContainText('Ukrainian School in Waterloo Region');
    await expect(page.locator('h2', { hasText: 'For Younger Children' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'For Teens' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'For Parents' })).toBeVisible();
    await expect(page.locator('nav a.nav-link[href="school.html"]')).toHaveText('School');
    await expect(page.locator('nav a.nav-link[href="index.html"]')).toHaveText('Home');

    // Перемикаємо назад на українську
    await toggle.click();
    await expect(page).toHaveTitle(/Українська школа Ватерлу/);
    await expect(page.locator('h1')).toContainText('Українська школа в регіоні Ватерлу');
    await expect(page.locator('h2', { hasText: 'Для молодших дітей' })).toBeVisible();
    await expect(page.locator('nav a.nav-link[href="school.html"]')).toHaveText('Школа');
  });
});

