const fs = require('fs');
let content = fs.readFileSync('tests/e2e/admin.spec.ts', 'utf8');

// Replace test: should switch between tabs
const test1Old = `  test('should switch between tabs (new apps, live catalog, rejected apps)', async ({ page }) => {
    await page.goto('/admin.html');

    // Wait for admin.js to load and initialize goToPage
    await page.waitForFunction(() => typeof window.goToPage === 'function');

    // Show dashboard
    await page.evaluate(() => {
      document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style);
    });

    // Wait a moment for tabs to render
    await page.waitForSelector('.admin-tab');

    // Tab 1: Нові заявки should be active by default
    const newAppsTab = page.locator('.admin-tab').nth(0);
    const newAppsContent = page.locator('#new-apps');

    await expect(newAppsTab).toHaveClass(/active/);
    await expect(newAppsContent).toHaveClass(/active/);

    // Click "Живий каталог" tab (second tab, index 1)
    const liveTab = page.locator('.admin-tab').nth(1);
    await liveTab.click();

    // Live catalog should become active
    await expect(liveTab).toHaveClass(/active/);
    await expect(page.locator('#live-catalog')).toHaveClass(/active/);

    // New apps should not be active anymore
    await expect(newAppsTab).not.toHaveClass(/active/);
    await expect(newAppsContent).not.toHaveClass(/active/);

    // Click "Архів" tab (third tab, index 2)
    const archiveTab = page.locator('.admin-tab').nth(3); // Changed from 2 to 3
    await archiveTab.click();

    // Wait a moment for rendering
    await page.waitForTimeout(300);

    // Archive should become active
    await expect(archiveTab).toHaveClass(/active/);
    await expect(page.locator('#rejected-apps')).toHaveClass(/active/);

    // Live catalog should not be active anymore
    await expect(liveTab).not.toHaveClass(/active/);
    await expect(page.locator('#live-catalog')).not.toHaveClass(/active/);

    // Switch back to new apps (first tab)
    await newAppsTab.click();
    await expect(newAppsTab).toHaveClass(/active/);
    await expect(newAppsContent).toHaveClass(/active/);
  });`;

const test1New = `  test('should switch between tabs (new apps, live catalog, rejected apps)', async ({ page }) => {
    await page.goto('/admin.html');

    await page.waitForFunction(() => typeof window.goToAdminTab === 'function');

    await page.evaluate(() => {
      document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style);
    });

    await page.waitForSelector('.admin-sidebar-menu button');
    
    // Default should be new-apps
    const newAppsContent = page.locator('#new-apps');
    await expect(newAppsContent).toHaveClass(/active/);

    const liveBtn = page.locator('.admin-sidebar-menu button', { hasText: 'Живий каталог' });
    await liveBtn.click();
    await expect(page.locator('#live-catalog')).toHaveClass(/active/);
    await expect(newAppsContent).not.toHaveClass(/active/);

    const archiveBtn = page.locator('.admin-sidebar-menu button', { hasText: 'Архів' });
    await archiveBtn.click();
    await expect(page.locator('#archive-section')).toHaveClass(/active/);
    await expect(page.locator('#live-catalog')).not.toHaveClass(/active/);
  });`;

// Replace test: should display separate content areas
const test2Old = `  test('should display separate content areas for new applications, archive, feedback, and live catalog', async ({ page }) => {
    await page.goto('/admin.html');

    // Wait for admin.js to load
    await page.waitForFunction(() => typeof window.goToPage === 'function');
    
    // Show dashboard
    await page.evaluate(() => {
      document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style);
    });

    await page.waitForSelector('.admin-tab');

    // Verify tabs exist
    const tabs = page.locator('.admin-tab');
    const tabCount = await tabs.count();
    expect(tabCount).toBe(5);

    // Verify tab labels
    await expect(tabs.nth(0)).toContainText('Нові заявки');
    await expect(tabs.nth(1)).toContainText('Живий каталог');
    await expect(tabs.nth(2)).toContainText('Звіти про помилки');
    await expect(tabs.nth(3)).toContainText('Архів заявок');
    await expect(tabs.nth(4)).toContainText('Архів каталогу');

    // Verify content sections exist
    const contentSections = page.locator('.tab-content');
    const sectionCount = await contentSections.count();
    expect(sectionCount).toBe(6); // new-apps, live-catalog, feedback-section, rejected-apps, archived-catalog, form-section
  });`;

const test2New = `  test('should display separate content areas for new applications, archive, feedback, and live catalog', async ({ page }) => {
    await page.goto('/admin.html');

    await page.waitForFunction(() => typeof window.goToAdminTab === 'function');
    
    await page.evaluate(() => {
      document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style);
    });

    await page.waitForSelector('.admin-sidebar-menu button');
    
    const tabs = page.locator('.admin-sidebar-menu button');
    const tabCount = await tabs.count();
    expect(tabCount).toBe(5);

    await expect(tabs.nth(0)).toContainText('Нові заявки');
    await expect(tabs.nth(1)).toContainText('Живий каталог');
    await expect(tabs.nth(2)).toContainText('Звіти про помилки');
    await expect(tabs.nth(3)).toContainText('Архів');
    await expect(tabs.nth(4)).toContainText('Пошта');
  });`;

content = content.replace(test1Old, test1New);
content = content.replace(test2Old, test2New);

fs.writeFileSync('tests/e2e/admin.spec.ts', content);
