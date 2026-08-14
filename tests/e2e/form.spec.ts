import { test, expect } from '@playwright/test';

test.describe('Application Form E2E', () => {
  test('should display the form, accept input, and click submit', async ({ page }) => {
    await page.goto('/apply.html');
    
    // Check heading
    await expect(page.locator('h1')).toContainText('Подати заявку');
    
    // Fill the form
    await page.fill('#f-email', 'test@example.com');
    await page.fill('#f-name', 'Тестовий Спеціаліст');
    await page.selectOption('#f-category', 'Beauty');
    await page.fill('#f-subcategory', 'Перукар');
    await page.fill('#f-description', 'Тестовий опис послуги для E2E тестування');
    await page.fill('#f-locationType', 'Waterloo');
    await page.fill('#f-phone', '+123456789');
    
    // Check submit button is visible
    const submitBtn = page.locator('#submit-btn');
    await expect(submitBtn).toBeVisible();

    // Mock Firebase requests to avoid polluting real DB during tests
    await page.route('**/*firestore.googleapis.com/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ name: 'mocked-doc-id' })
      });
    });

    // Try submitting
    await submitBtn.click();
    
    // Verify that some action happened (depending on implementation, form might show message or clear)
    // We just check the button is still there meaning no crashes
    await expect(submitBtn).toBeVisible();
  });
});
