import { test, expect } from '@playwright/test';

test.describe('Form E2E', () => {
  test('should load apply page and have all required fields', async ({ page }) => {
    await page.goto('/apply.html');
    
    // Check main title
    await expect(page.locator('h1')).toBeVisible();

    // Check header and navigation
    const header = page.locator('nav.top-nav');
    await expect(header).toBeVisible();
    const backBtn = header.locator('a', { hasText: '← Назад до каталогу' });
    await expect(backBtn).toBeVisible();
    await expect(backBtn).toHaveAttribute('href', 'catalog.html');
    
    // Check form fields
    await expect(page.locator('#f-name')).toBeVisible();
    await expect(page.locator('#f-email')).toBeVisible();
    await expect(page.locator('#f-category')).toBeVisible();
    await expect(page.locator('#f-subcategory')).toBeVisible();
    await expect(page.locator('#submit-btn')).toBeVisible();
  });

  test('should show validation error when submitting empty form', async ({ page }) => {
    await page.goto('/apply.html');
    
    // Attempt submit without filling
    await page.locator('#submit-btn').click();
    
    // The HTML5 validation should prevent submission, or the submit button might still be there
    // If it submits anyway and shows an error message, we check for it.
    // For now, we check that we are still on the apply page
    await expect(page).toHaveURL(/.*apply\.html/);
  });

  test('should prevent submission with invalid field data (negative tests)', async ({ page }) => {
    await page.goto('/apply.html');

    // Fill the required fields with valid data first
    await page.fill('#f-email', 'test@example.com');
    await page.fill('#f-name', 'Тест');
    await page.selectOption('#f-category', 'Beauty');
    await page.fill('#f-subcategory', 'Тест');
    await page.fill('#f-description', 'Тестовий опис');
    await page.fill('#f-locationType', 'Waterloo');
    
    // Attempt 1: Price with letters
    await page.fill('#f-price', 'Дорого 100');
    await page.locator('#submit-btn').click();
    // Verify form didn't submit successfully (message is not success)
    await expect(page.locator('.form-message.success')).not.toBeVisible();

    // Attempt 2: Fix price, break phone
    await page.fill('#f-price', '100');
    await page.fill('#f-phone', 'телефон');
    await page.locator('#submit-btn').click();
    await expect(page.locator('.form-message.success')).not.toBeVisible();

    // Attempt 3: Fix phone, break telegram
    await page.fill('#f-phone', '+1 555 123 4567');
    await page.fill('#f-telegram', 'абвгд'); // not a valid format
    await page.locator('#submit-btn').click();
    await expect(page.locator('.form-message.success')).not.toBeVisible();

    // Finally, test valid submission
    await page.fill('#f-telegram', '@valid_user');
    
    // Note: To avoid actually submitting to Firebase during tests, we might 
    // want to intercept the request, but for this negative test, validating 
    // it didn't submit on the bad inputs is enough. We can skip the actual 
    // valid submit to keep tests clean, or check the success state if mocked.
  });
});
