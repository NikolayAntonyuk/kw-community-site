import { test, expect } from '@playwright/test';

test.describe('Ukrainian School Page', () => {

  test('should display school navigation link in the header', async ({ page }) => {
    await page.goto('/');
    const navSchoolLink = page.locator('nav a[href="school.html"]');
    await expect(navSchoolLink).toBeVisible();
    await expect(navSchoolLink).toHaveText(/школа/i);
  });

  test('should display "Details" link in info section on home page', async ({ page }) => {
    await page.goto('/');
    const infoSchoolLink = page.locator('.school a[href="school.html"]');
    await expect(infoSchoolLink).toBeVisible();
  });

  test('should navigate to the school page and display correct title', async ({ page }) => {
    await page.goto('/school.html');
    await expect(page).toHaveTitle(/Школа/i);
    const heading = page.locator('h1');
    await expect(heading).toContainText(/Українська школа/i);
  });

  test('should display sections for junior children, teens, and parents', async ({ page }) => {
    await page.goto('/school.html');
    await expect(page.locator('h2', { hasText: 'Для молодших дітей' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Для підлітків' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Для батьків' })).toBeVisible();
  });

  test('should contain correct registration and contact links', async ({ page }) => {
    await page.goto('/school.html');
    const juniorLink = page.locator('a[href="https://tinyurl.com/ukrainian-school-2026KW"]');
    await expect(juniorLink).toBeVisible();

    const parentChatLink = page.locator('a[href="https://chat.whatsapp.com/GVAm3xAzqo7LZkRnUiptrL"]');
    await expect(parentChatLink).toBeVisible();

    const teenCreditLink = page.locator('a[href="https://schoolweb.tdsb.on.ca/conedsecondarycreditprogram/Saturday-International-Languages"]');
    await expect(teenCreditLink).toBeVisible();
  });

  test('should translate school page to English correctly', async ({ page }) => {
    await page.goto('/school.html');

    // Find and click language toggle button
    const langToggle = page.locator('#lang-toggle');
    await expect(langToggle).toBeVisible();
    await langToggle.click();

    // Wait for translations to apply
    await page.waitForTimeout(300);

    // Check that content is translated to English
    await expect(page).toHaveTitle(/Ukrainian School Waterloo/i);
    const heading = page.locator('h1');
    await expect(heading).toContainText(/Ukrainian School in Waterloo Region/i);

    // Check that sections are translated
    await expect(page.locator('h2', { hasText: /For Younger Children/i })).toBeVisible();
    await expect(page.locator('h2', { hasText: /For Teens/i })).toBeVisible();
    await expect(page.locator('h2', { hasText: /For Parents/i })).toBeVisible();
  });

  test('should toggle language back to Ukrainian correctly', async ({ page }) => {
    await page.goto('/school.html');

    const langToggle = page.locator('#lang-toggle');

    // Switch to English
    await langToggle.click();
    await page.waitForTimeout(300);
    await expect(page.locator('h2', { hasText: /For Younger Children/i })).toBeVisible();

    // Switch back to Ukrainian
    await langToggle.click();
    await page.waitForTimeout(300);
    await expect(page.locator('h2', { hasText: 'Для молодших дітей' })).toBeVisible();
  });

  test('should preserve language selection after page reload', async ({ page }) => {
    await page.goto('/school.html');

    // Switch to English
    const langToggle = page.locator('#lang-toggle');
    await langToggle.click();
    await page.waitForTimeout(300);
    await expect(page.locator('h2', { hasText: /For Younger Children/i })).toBeVisible();

    // Reload page
    await page.reload();

    // Language should still be English
    await expect(page.locator('h2', { hasText: /For Younger Children/i })).toBeVisible();
  });
});
