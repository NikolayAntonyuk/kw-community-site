import { test, expect } from '@playwright/test';

test.describe('Homepage & Navigation E2E', () => {
  test('should load the homepage with correct title and content', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Українська громада/);
    
    // Check the main heading
    await expect(page.locator('h1')).toBeVisible();
    
    // Check the unified header
    const brand = page.locator('.brand');
    await expect(brand).toBeVisible();
    
    // Verify unified navigation links are present
    await expect(page.locator('.nav-link', { hasText: 'Каталог' })).toBeVisible();
    await expect(page.locator('.nav-link', { hasText: 'Школа' })).toBeVisible();
  });

  test('should navigate to the catalog page', async ({ page }) => {
    await page.goto('/');
    
    // Click the catalog link in the unified navigation
    const catalogLink = page.locator('.nav-link', { hasText: 'Каталог' }).first();
    await catalogLink.click();
    
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

  test('hero video should be the actual high-quality drone video (file size check)', async ({ request }) => {
    // We want to guarantee that the video is the correct 7.9MB drone view, not a tiny stub/rabbit
    const response = await request.get('/assets/hero.mp4');
    expect(response.ok()).toBeTruthy();
    
    const buffer = await response.body();
    const sizeInMB = buffer.length / (1024 * 1024);
    
    // The correct drone video is > 5MB. This guarantees we didn't fallback to a small stub.
    expect(sizeInMB).toBeGreaterThan(5);
  });
});
