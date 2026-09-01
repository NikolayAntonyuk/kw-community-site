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
});
