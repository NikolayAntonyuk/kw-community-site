# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel E2E >> should delete live application when confirmation is accepted
- Location: tests/e2e/admin.spec.ts:534:7

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
      - button "Адмін панель" [ref=e10] [cursor=pointer]
      - link "Головна" [ref=e11] [cursor=pointer]:
        - /url: index.html
      - link "Каталог" [ref=e12] [cursor=pointer]:
        - /url: catalog.html
      - link "Школа" [ref=e13] [cursor=pointer]:
        - /url: school.html
  - main [ref=e14]:
    - heading "Адмін-панель" [level=1] [ref=e15]
    - generic [ref=e16]:
      - heading "Вхід для адміністраторів" [level=2] [ref=e17]
      - generic [ref=e18]:
        - textbox "Email" [ref=e20]
        - textbox "Пароль" [ref=e22]
        - button "Увійти" [ref=e23] [cursor=pointer]
```

# Test source

```ts
  453 |     await page.goto('/admin.html');
  454 | 
  455 |     await page.waitForFunction(() => typeof window.toggleAdminMenu === 'function');
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
> 553 |     await page.waitForFunction(() => typeof window.deleteLiveApp === 'function');
      |                ^ Error: page.waitForFunction: Test timeout of 30000ms exceeded.
  554 | 
  555 |     let dialogAppeared = false;
  556 |     page.on('dialog', async dialog => {
  557 |       dialogAppeared = true;
  558 |       await dialog.accept(); // Accept the confirmation
  559 |     });
  560 | 
  561 |     await page.evaluate(() => {
  562 |       document.body.innerHTML += '<div id="live-card-del-accept"></div>';
  563 |       return window.deleteLiveApp('del-accept');
  564 |     });
  565 | 
  566 |     expect(dialogAppeared).toBeTruthy();
  567 |     
  568 |     // Card should be hidden after successful deletion
  569 |     const cardHidden = await page.evaluate(() => {
  570 |       const el = document.getElementById('live-card-del-accept');
  571 |       return !el || el.style.display === 'none';
  572 |     });
  573 |     expect(cardHidden).toBeTruthy();
  574 |   });
  575 | 
  576 |   test('should approve application when confirmation is accepted', async ({ page }) => {
  577 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  578 |       await route.fulfill({
  579 |         contentType: 'application/javascript',
  580 |         body: `
  581 |           export const collection = () => {};
  582 |           export const query = () => {};
  583 |           export const where = () => {};
  584 |           export const getDocs = async () => ({ empty: true });
  585 |           export const updateDoc = async () => {};
  586 |           export const doc = () => {};
  587 |           export const addDoc = async () => {};
  588 |           export const getFirestore = () => ({});
  589 |           export const serverTimestamp = () => ({});
  590 |         `
  591 |       });
  592 |     });
  593 | 
  594 |     await page.goto('/admin.html');
  595 |     await page.waitForFunction(() => typeof window.approveApp === 'function');
  596 | 
  597 |     let dialogAppeared = false;
  598 |     page.on('dialog', async dialog => {
  599 |       dialogAppeared = true;
  600 |       await dialog.accept();
  601 |     });
  602 | 
  603 |     await page.evaluate(() => {
  604 |       document.body.innerHTML += '<div id="card-approve-accept"></div>';
  605 |       return window.approveApp('approve-accept');
  606 |     });
  607 | 
  608 |     expect(dialogAppeared).toBeTruthy();
  609 |     
  610 |     // Card should be removed after approval
  611 |     const cardExists = await page.evaluate(() => !!document.getElementById('card-approve-accept'));
  612 |     expect(cardExists).toBeFalsy();
  613 |   });
  614 | 
  615 |   test('should require confirmation before saving edit and proceed on accept', async ({ page }) => {
  616 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  617 |       await route.fulfill({
  618 |         contentType: 'application/javascript',
  619 |         body: `
  620 |           export const collection = () => {};
  621 |           export const query = () => {};
  622 |           export const where = () => {};
  623 |           export const getDocs = async () => ({ empty: true });
  624 |           export const updateDoc = async () => {};
  625 |           export const doc = () => {};
  626 |           export const addDoc = async () => {};
  627 |           export const getFirestore = () => ({});
  628 |           export const serverTimestamp = () => ({});
  629 |         `
  630 |       });
  631 |     });
  632 | 
  633 |     await page.route('**/api/specialists', route => route.fulfill({ status: 200, body: '{}' }));
  634 |     await page.route('**/api/sync', route => route.fulfill({ status: 200, body: '{}' }));
  635 |     await page.goto('/admin.html');
  636 |     await page.waitForFunction(() => typeof window.saveEdit === 'function');
  637 | 
  638 |     let dialogAppeared = false;
  639 |     page.on('dialog', async dialog => {
  640 |       dialogAppeared = true;
  641 |       await dialog.accept();
  642 |     });
  643 | 
  644 |     await page.evaluate(() => {
  645 |       document.body.innerHTML += `
  646 |         <div id="display-name-edit-accept"></div>
  647 |         <div id="display-cat-edit-accept"></div>
  648 |         <div id="display-desc-edit-accept"></div>
  649 |         <div id="display-loc-edit-accept"></div>
  650 |         <div id="display-address-edit-accept"></div>
  651 |         <div id="display-phone-edit-accept"></div>
  652 |         <div id="display-tg-edit-accept"></div>
  653 |         <div id="display-inst-edit-accept"></div>
```