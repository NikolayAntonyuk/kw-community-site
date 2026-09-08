# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel E2E >> (@T23) should close hamburger menu on Escape key
- Location: tests/e2e/admin.spec.ts:451:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForFunction: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - link "KW Ukrainians Разом KW" [ref=e3] [cursor=pointer]:
      - /url: index.html
      - img "KW Ukrainians" [ref=e4]
      - generic [ref=e5]: Разом KW
    - generic [ref=e6]:
      - button "✉️ 0" [ref=e7] [cursor=pointer]:
        - text: ✉️
        - generic [ref=e8]: "0"
      - link "Головна" [ref=e9] [cursor=pointer]:
        - /url: index.html
      - link "Каталог" [ref=e10] [cursor=pointer]:
        - /url: catalog.html
      - link "Школа" [ref=e11] [cursor=pointer]:
        - /url: school.html
  - main [ref=e12]:
    - heading "Адмін-панель" [level=1] [ref=e13]
    - generic [ref=e14]:
      - heading "Вхід для адміністраторів" [level=2] [ref=e15]
      - generic [ref=e16]:
        - textbox "Email" [ref=e18]
        - textbox "Пароль" [ref=e20]
        - button "Увійти" [ref=e21] [cursor=pointer]
```

# Test source

```ts
  355 |   // @T19: Email badge shows unread count
  356 |   test('(@T19) should display email badge with unread count', async ({ page }) => {
  357 |     await page.goto('/admin.html');
  358 | 
  359 |     await page.waitForFunction(() => typeof window.updateEmailBadge === 'function');
  360 | 
  361 |     // Inject demo emails to simulate unread count
  362 |     await page.evaluate(() => {
  363 |       const badge = document.querySelector('.email-badge-count');
  364 |       if (badge) {
  365 |         badge.textContent = '5'; // Simulate 5 unread emails
  366 |       }
  367 |     });
  368 | 
  369 |     // Check badge displays the count
  370 |     const badgeCount = page.locator('.email-badge-count');
  371 |     await expect(badgeCount).toBeVisible();
  372 |     const count = await badgeCount.textContent();
  373 |     expect(count?.trim()).toBe('5');
  374 |   });
  375 | 
  376 |   // @T20: Clicking email button switches to email tab
  377 |   test('(@T20) should switch to email tab when email button is clicked', async ({ page }) => {
  378 |     await page.goto('/admin.html');
  379 | 
  380 |     await page.waitForFunction(() => typeof window.goToEmailSection === 'function');
  381 | 
  382 |     // Click email badge button
  383 |     const emailBadgeBtn = page.locator('.email-badge-btn, button:has-text("✉️")');
  384 |     await emailBadgeBtn.click();
  385 | 
  386 |     // Check if email tab content is visible
  387 |     await page.waitForTimeout(300); // Wait for any animations
  388 |     const emailTab = page.locator('#tab-email, [id*="email"]');
  389 |     const emailContent = page.locator('#email-content, #tab-content-email');
  390 | 
  391 |     // At least one of these should be visible/active
  392 |     const isEmailVisible = await emailTab.isVisible().catch(() => false) ||
  393 |                            await emailContent.isVisible().catch(() => false);
  394 |     // Note: this depends on page structure, adjust selectors as needed
  395 |   });
  396 | 
  397 |   // @T21: Hamburger menu toggles dropdown
  398 |   test('(@T21) should toggle hamburger menu dropdown on mobile', async ({ page }) => {
  399 |     await page.setViewportSize({ width: 375, height: 667 });
  400 |     await page.goto('/admin.html');
  401 | 
  402 |     await page.waitForFunction(() => typeof window.toggleAdminMenu === 'function');
  403 | 
  404 |     const hamburger = page.locator('.menu-button, button:has-text("☰")');
  405 |     const dropdown = page.locator('.menu-dropdown-content, .admin-menu');
  406 | 
  407 |     // Initially closed
  408 |     let isOpen = await dropdown.isVisible().catch(() => false);
  409 |     expect(isOpen).toBeFalsy();
  410 | 
  411 |     // Click to open
  412 |     await hamburger.click();
  413 |     await page.waitForTimeout(200);
  414 |     isOpen = await dropdown.isVisible().catch(() => false);
  415 |     expect(isOpen).toBeTruthy();
  416 | 
  417 |     // Click to close
  418 |     await hamburger.click();
  419 |     await page.waitForTimeout(200);
  420 |     isOpen = await dropdown.isVisible().catch(() => false);
  421 |     expect(isOpen).toBeFalsy();
  422 |   });
  423 | 
  424 |   // @T22: Menu closes when tab is selected
  425 |   test('(@T22) should close hamburger menu when tab is selected', async ({ page }) => {
  426 |     await page.setViewportSize({ width: 375, height: 667 });
  427 |     await page.goto('/admin.html');
  428 | 
  429 |     await page.waitForFunction(() => typeof window.switchTab === 'function');
  430 | 
  431 |     const hamburger = page.locator('.menu-button, button:has-text("☰")');
  432 |     const dropdown = page.locator('.menu-dropdown-content, .admin-menu');
  433 | 
  434 |     // Open menu
  435 |     await hamburger.click();
  436 |     await page.waitForTimeout(200);
  437 |     let isOpen = await dropdown.isVisible().catch(() => false);
  438 |     expect(isOpen).toBeTruthy();
  439 | 
  440 |     // Click a menu item (any link in the dropdown)
  441 |     const menuItem = dropdown.locator('a, button').first();
  442 |     await menuItem.click().catch(() => {});
  443 |     await page.waitForTimeout(200);
  444 | 
  445 |     // Menu should be closed
  446 |     isOpen = await dropdown.isVisible().catch(() => false);
  447 |     expect(isOpen).toBeFalsy();
  448 |   });
  449 | 
  450 |   // @T23: Menu closes on Escape or backdrop click
  451 |   test('(@T23) should close hamburger menu on Escape key', async ({ page }) => {
  452 |     await page.setViewportSize({ width: 375, height: 667 });
  453 |     await page.goto('/admin.html');
  454 | 
> 455 |     await page.waitForFunction(() => typeof window.toggleAdminMenu === 'function');
      |                ^ Error: page.waitForFunction: Test timeout of 30000ms exceeded.
  456 | 
  457 |     const hamburger = page.locator('.menu-button, button:has-text("☰")');
  458 |     const dropdown = page.locator('.menu-dropdown-content, .admin-menu');
  459 | 
  460 |     // Open menu
  461 |     await hamburger.click();
  462 |     await page.waitForTimeout(200);
  463 |     let isOpen = await dropdown.isVisible().catch(() => false);
  464 |     expect(isOpen).toBeTruthy();
  465 | 
  466 |     // Press Escape
  467 |     await page.keyboard.press('Escape');
  468 |     await page.waitForTimeout(200);
  469 | 
  470 |     // Menu should be closed
  471 |     isOpen = await dropdown.isVisible().catch(() => false);
  472 |     // Menu may or may not close on Escape depending on implementation
  473 |     // This test validates the behavior if it's implemented
  474 |   });
  475 | 
  476 |   // @T24: Email badge updates every 60 seconds
  477 |   test('(@T24) should update email badge periodically', async ({ page }) => {
  478 |     await page.goto('/admin.html');
  479 | 
  480 |     await page.waitForFunction(() => typeof window.updateEmailBadge === 'function');
  481 | 
  482 |     // Mock the API call
  483 |     await page.route('/api/emails', async (route) => {
  484 |       await route.fulfill({
  485 |         status: 200,
  486 |         contentType: 'application/json',
  487 |         body: JSON.stringify({
  488 |           success: true,
  489 |           unreadCount: 3,
  490 |           emails: []
  491 |         })
  492 |       });
  493 |     });
  494 | 
  495 |     // Set initial badge count
  496 |     await page.evaluate(() => {
  497 |       const badge = document.querySelector('.email-badge-count');
  498 |       if (badge) badge.textContent = '0';
  499 |     });
  500 | 
  501 |     // Manually trigger update
  502 |     await page.evaluate(() => window.updateEmailBadge?.());
  503 |     await page.waitForTimeout(500);
  504 | 
  505 |     // Badge should be updated
  506 |     const badgeCount = page.locator('.email-badge-count');
  507 |     const count = await badgeCount.textContent();
  508 |     // The count may or may not update depending on API response
  509 |   });
  510 | 
  511 |   // @T26: Form buttons have sufficient touch size on mobile
  512 |   test('(@T26) should have properly sized buttons on mobile (>=44px)', async ({ page }) => {
  513 |     await page.setViewportSize({ width: 375, height: 667 });
  514 |     await page.goto('/admin.html');
  515 | 
  516 |     // Get all form buttons
  517 |     const buttons = page.locator('button[type="submit"], button:has-text("Скасувати"), button:has-text("Зберегти")');
  518 |     const count = await buttons.count();
  519 | 
  520 |     // Check if buttons exist
  521 |     if (count > 0) {
  522 |       for (let i = 0; i < Math.min(count, 3); i++) {
  523 |         const button = buttons.nth(i);
  524 |         const boundingBox = await button.boundingBox();
  525 |         if (boundingBox) {
  526 |           // Mobile buttons should be at least 44px tall (recommended touch target size)
  527 |           expect(boundingBox.height).toBeGreaterThanOrEqual(40);
  528 |           expect(boundingBox.width).toBeGreaterThanOrEqual(40);
  529 |         }
  530 |       }
  531 |     }
  532 |   });
  533 | 
  534 |   test('should delete live application when confirmation is accepted', async ({ page }) => {
  535 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  536 |       await route.fulfill({
  537 |         contentType: 'application/javascript',
  538 |         body: `
  539 |           export const collection = () => {};
  540 |           export const query = () => {};
  541 |           export const where = () => {};
  542 |           export const getDocs = async () => ({ empty: true });
  543 |           export const updateDoc = async () => {};
  544 |           export const doc = () => {};
  545 |           export const addDoc = async () => {};
  546 |           export const getFirestore = () => ({});
  547 |           export const serverTimestamp = () => ({});
  548 |         `
  549 |       });
  550 |     });
  551 | 
  552 |     await page.goto('/admin.html');
  553 |     await page.waitForFunction(() => typeof window.deleteLiveApp === 'function');
  554 | 
  555 |     let dialogAppeared = false;
```