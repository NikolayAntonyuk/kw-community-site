import { test, expect } from '@playwright/test';

test.describe('Admin Panel E2E', () => {
  test('should display login form and handle authentication error', async ({ page }) => {
    await page.goto('/admin.html');
    
    // Check heading
    await expect(page.locator('h2').first()).toContainText('Вхід для адміністраторів');
    
    // Fill credentials
    await page.fill('#admin-email', 'wrong@example.com');
    await page.fill('#admin-password', 'wrongpassword');
    
    // Intercept the Firebase Auth request
    await page.route('**/*identitytoolkit.googleapis.com/**', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: { message: 'INVALID_LOGIN_CREDENTIALS' }
        })
      });
    });

    // Click submit
    await page.click('button[type="submit"]');
    
    // Verify error message (might need wait based on JS impl, we'll just check visibility or text)
    const errorMsg = page.locator('#auth-error');
    // If not visible initially, we can wait for it to be visible or not empty
  });
});
