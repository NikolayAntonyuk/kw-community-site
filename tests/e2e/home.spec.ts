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

  test('hero video should load without network errors', async ({ page }) => {
    // Listen for any console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait for video to be loaded
    const video = page.locator('video.hero-video');
    await expect(video).toBeVisible();

    // Check that video has actually started loading or is ready
    const videoElement = await video.elementHandle();
    const readyState = await videoElement?.evaluate((el: HTMLVideoElement) => el.readyState);

    // readyState >= 2 means at least metadata is loaded
    expect(readyState).toBeGreaterThanOrEqual(2);

    // Ensure no console errors related to video
    const videoErrors = consoleErrors.filter(e => e.toLowerCase().includes('video') || e.toLowerCase().includes('media'));
    expect(videoErrors).toHaveLength(0);
  });

  test.describe('School CTA layout and spacing requirements', () => {
    test('school CTA button should be left-aligned on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');

      const ctaWrap = page.locator('.school-cta-wrap');
      await expect(ctaWrap).toBeVisible();

      // Check justify-content property on desktop
      const justifyContent = await ctaWrap.evaluate(el => window.getComputedStyle(el).justifyContent);
      expect(justifyContent).toBe('flex-start');

      // Verify button is left-aligned relative to the section container
      const schoolBox = await page.locator('.school').boundingBox();
      const buttonBox = await page.locator('.school-cta-wrap a').boundingBox();
      expect(schoolBox).not.toBeNull();
      expect(buttonBox).not.toBeNull();
      expect(buttonBox!.x).toBeLessThan(schoolBox!.x + 50);
    });

    test('school CTA button should be centered on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const ctaWrap = page.locator('.school-cta-wrap');
      await expect(ctaWrap).toBeVisible();

      // Check justify-content property on mobile (< 768px)
      const justifyContent = await ctaWrap.evaluate(el => window.getComputedStyle(el).justifyContent);
      expect(justifyContent).toBe('center');

      // Verify button center roughly matches viewport center
      const buttonBox = await page.locator('.school-cta-wrap a').boundingBox();
      expect(buttonBox).not.toBeNull();
      const buttonCenter = buttonBox!.x + buttonBox!.width / 2;
      expect(Math.abs(buttonCenter - 375 / 2)).toBeLessThan(15);
    });

    test('should have generous vertical spacing between school CTA and activity events', async ({ page }) => {
      await page.goto('/');

      const buttonBox = await page.locator('.school-cta-wrap a').boundingBox();
      const activityHeadingBox = await page.locator('#activity-heading').boundingBox();

      expect(buttonBox).not.toBeNull();
      expect(activityHeadingBox).not.toBeNull();

      const verticalGap = activityHeadingBox!.y - (buttonBox!.y + buttonBox!.height);
      // Separation should be at least 40px
      expect(verticalGap).toBeGreaterThanOrEqual(40);
    });

    test('should not duplicate text in school section', async ({ page }) => {
      await page.goto('/');

      const schoolParagraph = page.locator('.school p');
      const text = await schoolParagraph.textContent();
      const count = (text?.match(/В регіоні Ватерлу діє суботня українська школа/g) || []).length;
      expect(count).toBe(1);
    });
  });
});
