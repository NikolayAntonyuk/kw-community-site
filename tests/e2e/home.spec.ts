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

  test('should display the video hero section correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check if the video element exists
    const video = page.locator('video.hero-video');
    await expect(video).toBeVisible();
    
    // Check for required attributes (autoplay, loop, muted)
    await expect(video).toHaveAttribute('autoplay', '');
    await expect(video).toHaveAttribute('loop', '');
    await expect(video).toHaveAttribute('muted', '');
    
    // Verify fallback poster
    await expect(video).toHaveAttribute('poster', 'assets/hero-community.jpg');
    
    // Check the text overlay on top of the video
    const overlayContent = page.locator('.hero-content h1');
    await expect(overlayContent).toBeVisible();
  });
});
