# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel E2E >> should approve application when confirmation is accepted
- Location: tests/e2e/admin.spec.ts:576:7

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
      - link "Головна" [ref=e7] [cursor=pointer]:
        - /url: index.html
      - link "Каталог" [ref=e8] [cursor=pointer]:
        - /url: catalog.html
      - link "Школа" [ref=e9] [cursor=pointer]:
        - /url: school.html
  - main [ref=e10]:
    - heading "Адмін-панель" [level=1] [ref=e11]
    - generic [ref=e12]:
      - heading "Вхід для адміністраторів" [level=2] [ref=e13]
      - generic [ref=e14]:
        - textbox "Email" [ref=e16]
        - textbox "Пароль" [ref=e18]
        - button "Увійти" [ref=e19] [cursor=pointer]
```

# Test source

```ts
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
> 595 |     await page.waitForFunction(() => typeof window.approveApp === 'function');
      |                ^ Error: page.waitForFunction: Test timeout of 30000ms exceeded.
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
  654 |         <div id="display-fb-edit-accept"></div>
  655 |         <div id="display-web-edit-accept"></div>
  656 |         <div id="display-price-edit-accept"></div>
  657 |         <div id="display-notes-edit-accept"></div>
  658 |       `;
  659 |       document.getElementById('edit-id').value = 'edit-accept';
  660 |       document.getElementById('edit-islive').value = 'false';
  661 |       document.getElementById('edit-name').value = 'New Name';
  662 |       document.getElementById('edit-desc').value = 'New Desc';
  663 |       document.getElementById('edit-phone').value = 'New Phone';
  664 |       document.getElementById('edit-tg').value = 'New Tg';
  665 |       document.getElementById('edit-inst').value = 'New Inst';
  666 |       document.getElementById('edit-fb').value = 'New Fb';
  667 |       document.getElementById('edit-web').value = 'New Web';
  668 |       document.getElementById('edit-category').value = 'New Cat';
  669 |       document.getElementById('edit-subcategory').value = 'New Subcat';
  670 |       document.getElementById('edit-loc').value = 'New Loc';
  671 |       document.getElementById('edit-address').value = 'New Addr';
  672 |       document.getElementById('edit-price').value = 'New Price';
  673 |       document.getElementById('edit-notes').value = 'New Notes';
  674 |       document.getElementById('form-section').classList.add('active');
  675 |       return window.saveEdit();
  676 |     });
  677 | 
  678 |     expect(dialogAppeared).toBeTruthy();
  679 |     
  680 |     const modalHidden = await page.evaluate(() => !document.getElementById('form-section')?.classList.contains('active'));
  681 |     expect(modalHidden).toBeTruthy();
  682 |     
  683 |     const updatedName = await page.evaluate(() => document.getElementById('display-name-edit-accept')?.textContent);
  684 |     expect(updatedName).toBe('New Name');
  685 |   });
  686 | 
  687 |   test('should paginate live catalog 50 per page with working prev/next buttons', async ({ page }) => {
  688 |     // Generate 60 mock specialists
  689 |     const mockData = Array.from({ length: 60 }, (_, i) => ({
  690 |       id: `mock-id-${i}`,
  691 |       name: `Specialist ${i}`,
  692 |       category: 'Test',
  693 |       subcategory: 'Test',
  694 |       description: 'Desc',
  695 |       locationType: 'Waterloo',
```