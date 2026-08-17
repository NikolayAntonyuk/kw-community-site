import { test, expect } from '@playwright/test';

test.describe('Admin Panel E2E', () => {
  test('should load the admin login page', async ({ page }) => {
    await page.goto('/admin.html');
    
    // Check main title
    await expect(page.locator('h1')).toHaveText('Адмін-панель');
    
    // Auth section should be visible
    await expect(page.locator('#auth-section')).toBeVisible();
    await expect(page.locator('#login-form')).toBeVisible();
    await expect(page.locator('#admin-email')).toBeVisible();
    await expect(page.locator('#admin-password')).toBeVisible();
  });

  test('should show error on wrong password', async ({ page }) => {
    await page.goto('/admin.html');
    
    // Fill form
    await page.locator('#admin-email').fill('wrong@example.com');
    await page.locator('#admin-password').fill('wrongpassword123');
    
    // Mock the Firebase auth call via networking if possible, 
    // or just let it hit the real Firebase which will return an error anyway
    await page.route('https://identitytoolkit.googleapis.com/**', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: "INVALID_LOGIN_CREDENTIALS",
            domain: "global",
            reason: "invalid"
          }
        })
      });
    });

    await page.locator('#login-form button[type="submit"]').click();

    // Wait for the error message
    const errorMsg = page.locator('#auth-error');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
    await expect(errorMsg).toContainText('Невірний email або пароль');
  });

  test('should explain when Firebase Authentication is not enabled', async ({ page }) => {
    await page.goto('/admin.html');

    await page.locator('#admin-email').fill('admin@example.com');
    await page.locator('#admin-password').fill('somepassword123');

    // Саме цю помилку віддає Firebase, поки Authentication не увімкнено в консолі
    await page.route('https://identitytoolkit.googleapis.com/**', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: "CONFIGURATION_NOT_FOUND",
            domain: "global",
            reason: "invalid"
          }
        })
      });
    });

    await page.locator('#login-form button[type="submit"]').click();

    const errorMsg = page.locator('#auth-error');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
    await expect(errorMsg).toContainText('Authentication не увімкнено');
  });
});
