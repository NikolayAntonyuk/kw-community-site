import { test, expect } from '@playwright/test';

const char1 = 'A';
const char2 = 'Ab';
const char101 = 'A'.repeat(101);

test.describe('Form E2E - Boundary Values, Pairwise & Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.route("https://firestore.googleapis.com/**", (route) => route.abort());
    await page.goto('/apply.html');
  });

  test('Повинні бути присутні всі необхідні поля (UI перевірка)', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#f-name')).toBeVisible();
    await expect(page.locator('#f-email')).toBeVisible();
    await expect(page.locator('#f-category')).toBeVisible();
    await expect(page.locator('#f-subcategory')).toBeVisible();
    await expect(page.locator('#f-locationType')).toBeVisible();
    await expect(page.locator('#submit-btn')).toBeVisible();
  });

  test('BVA: Неможливо відправити форму з пустими обов\'язковими полями', async ({ page }) => {
    await page.locator('#submit-btn').click();
    await expect(page.locator('#submit-btn')).not.toBeDisabled();
  });

  test('BVA & Boundary: Мінімальні та максимальні значення для імені та опису', async ({ page }) => {
    await page.fill('#f-email', 'test@test.com');
    await page.fill('#f-name', char1); // minlength 2
    await page.selectOption('#f-category', 'Beauty');
    await page.fill('#f-subcategory', char1); // minlength 2
    await page.fill('#f-description', '1234'); // minlength 5
    await page.selectOption('#f-locationType', 'Waterloo');
    await page.fill('#f-phone', '1234567890');
    
    await page.locator('#submit-btn').click();
    // HTML5 error, button should NOT be disabled
    await expect(page.locator('#submit-btn')).not.toBeDisabled();
    
    // Валідні граничні значення (мінімально допустимі)
    await page.fill('#f-name', char2);
    await page.fill('#f-subcategory', char2);
    await page.fill('#f-description', '12345');
    
    await page.locator('#submit-btn').click();
    // Якщо валідація пройшла, кнопка стає disabled на час відправки
    await expect(page.locator('#submit-btn')).toBeDisabled();
  });

  test('Pairwise & Equivalence Partitioning: Перевірка валідації контактів (хоча б один контакт)', async ({ page }) => {
    await page.fill('#f-email', 'test@example.com');
    await page.fill('#f-name', 'Тест Спеціаліст');
    await page.selectOption('#f-category', 'Auto');
    await page.fill('#f-subcategory', 'Ремонт');
    await page.fill('#f-description', 'Хороший ремонт авто');
    await page.selectOption('#f-locationType', 'Kitchener');

    await page.locator('#submit-btn').click();
    await expect(page.locator('.form-message.error')).toBeVisible();
    const text = await page.locator('.form-message.error').textContent();
    expect(text).toMatch(/контакт|apply_no_contacts_error/i);

    // Додаємо телефон
    await page.fill('#f-phone', '519-123-4567');
    await page.locator('#submit-btn').click();
    // Валідація проходить
    await expect(page.locator('#submit-btn')).toBeDisabled();
  });

  test('Pairwise & Equivalence Partitioning: Інші комбінації одного контакту', async ({ page }) => {
    const contacts = [
      { id: '#f-telegram', value: '@valid_telegram' },
      { id: '#f-instagram', value: 'https://instagram.com/test' },
      { id: '#f-facebook', value: 'https://facebook.com/test' },
      { id: '#f-website', value: 'https://test.com' },
    ];

    for (const contact of contacts) {
      await page.goto('/apply.html');
      await page.fill('#f-email', 'test@example.com');
      await page.fill('#f-name', 'Тест Спеціаліст');
      await page.selectOption('#f-category', 'Auto');
      await page.fill('#f-subcategory', 'Ремонт');
      await page.fill('#f-description', 'Хороший ремонт авто');
      await page.selectOption('#f-locationType', 'Kitchener');
      
      await page.fill(contact.id, contact.value);
      await page.locator('#submit-btn').click();
      
      await expect(page.locator('#submit-btn')).toBeDisabled();
    }
  });

  test('Equivalence Partitioning: Невалідні формати контактів (Phone, Telegram, Price)', async ({ page }) => {
    await page.fill('#f-email', 'test@example.com');
    await page.fill('#f-name', 'Тест Спеціаліст');
    await page.selectOption('#f-category', 'Food');
    await page.fill('#f-subcategory', 'Торти');
    await page.fill('#f-description', 'Смачні торти на замовлення');
    await page.selectOption('#f-locationType', 'Cambridge');

    await page.fill('#f-phone', '123-456-7890 ext ABC');
    await page.locator('#submit-btn').click();
    await expect(page.locator('#submit-btn')).not.toBeDisabled();
    
    await page.fill('#f-phone', '+1 (519) 123-4567');
    await page.fill('#f-telegram', '@ab');
    await page.locator('#submit-btn').click();
    await expect(page.locator('#submit-btn')).not.toBeDisabled();

    await page.fill('#f-telegram', 'https://t.me/valid_user');
    await page.fill('#f-price', 'Дорого');
    await page.locator('#submit-btn').click();
    await expect(page.locator('#submit-btn')).not.toBeDisabled();

    await page.fill('#f-price', '100$ - 200$');
    await page.locator('#submit-btn').click();
    
    await expect(page.locator('#submit-btn')).toBeDisabled();
  });

  test('Security & Boundary: Обмеження довжини (Maxlength HTML5 enforced)', async ({ page }) => {
    await page.fill('#f-name', char101);
    const nameVal = await page.inputValue('#f-name');
    expect(nameVal.length).toBe(100);

    await page.fill('#f-description', 'A'.repeat(250));
    const descVal = await page.inputValue('#f-description');
    expect(descVal.length).toBe(200);

    await page.fill('#f-notes', 'A'.repeat(1500));
    const notesVal = await page.inputValue('#f-notes');
    expect(notesVal.length).toBe(1000);
    
    const locationVal = await page.locator('#f-locationType').evaluate(el => el.tagName);
    expect(locationVal.toLowerCase()).toBe('select');
  });
});
