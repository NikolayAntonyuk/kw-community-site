import { test, expect } from '@playwright/test';

test.describe('Homepage & Navigation E2E', () => {
  test('should load the homepage with correct title and content', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Українська громада/);
    
    // Check the main heading
    await expect(page.locator('h1')).toBeVisible();
    
    // Check the brand in top nav
    const brand = page.locator('.brand');
    await expect(brand).toBeVisible();
  });

  test('should navigate to the catalog page', async ({ page }) => {
    await page.goto('/');
    
    // Click the catalog button in navigation
    const navCta = page.locator('.nav-cta').first();
    await navCta.click();
    
    // Verify URL change
    await expect(page).toHaveURL(/.*catalog\.html/);
  });
});
