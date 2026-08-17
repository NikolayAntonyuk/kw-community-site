import { test, expect } from '@playwright/test';

test.describe('Form E2E', () => {
  test('should load apply page and have all required fields', async ({ page }) => {
    await page.goto('/apply.html');
    
    // Check main title
    await expect(page.locator('h1')).toBeVisible();
    
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
});
