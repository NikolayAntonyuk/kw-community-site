# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel E2E >> should paginate live catalog 50 per page with working prev/next buttons
- Location: tests/e2e/admin.spec.ts:459:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#live-pagination')
Timeout: 5000ms
- Expected substring  - 1
+ Received string     + 7

- Всього: 60
+
+       
+         ← Назад
+         Сторінка 1 з 2 (Всього: 61)
+         Далі →
+       
+     

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#live-pagination')
    14 × locator resolved to <div id="live-pagination">…</div>
       - unexpected value "
      
        ← Назад
        Сторінка 1 з 2 (Всього: 61)
        Далі →
      
    "

```

```yaml
- button "← Назад" [disabled]
- strong: "Сторінка 1 з 2 (Всього: 61)"
- button "Далі →"
```

# Test source

```ts
  395 |           export const getDocs = async () => ({ empty: true });
  396 |           export const updateDoc = async () => {};
  397 |           export const doc = () => {};
  398 |           export const addDoc = async () => {};
  399 |           export const getFirestore = () => ({});
  400 |           export const serverTimestamp = () => ({});
  401 |         `
  402 |       });
  403 |     });
  404 | 
  405 |     await page.route('**/api/specialists', route => route.fulfill({ status: 200, body: '{}' }));
  406 |     await page.route('**/api/sync', route => route.fulfill({ status: 200, body: '{}' }));
  407 |     await page.goto('/admin.html');
  408 |     await page.waitForFunction(() => typeof window.saveEdit === 'function');
  409 | 
  410 |     let dialogAppeared = false;
  411 |     page.on('dialog', async dialog => {
  412 |       dialogAppeared = true;
  413 |       await dialog.accept();
  414 |     });
  415 | 
  416 |     await page.evaluate(() => {
  417 |       document.body.innerHTML += `
  418 |         <div id="display-name-edit-accept"></div>
  419 |         <div id="display-cat-edit-accept"></div>
  420 |         <div id="display-desc-edit-accept"></div>
  421 |         <div id="display-loc-edit-accept"></div>
  422 |         <div id="display-address-edit-accept"></div>
  423 |         <div id="display-phone-edit-accept"></div>
  424 |         <div id="display-tg-edit-accept"></div>
  425 |         <div id="display-inst-edit-accept"></div>
  426 |         <div id="display-fb-edit-accept"></div>
  427 |         <div id="display-web-edit-accept"></div>
  428 |         <div id="display-price-edit-accept"></div>
  429 |         <div id="display-notes-edit-accept"></div>
  430 |       `;
  431 |       document.getElementById('edit-id').value = 'edit-accept';
  432 |       document.getElementById('edit-islive').value = 'false';
  433 |       document.getElementById('edit-name').value = 'New Name';
  434 |       document.getElementById('edit-desc').value = 'New Desc';
  435 |       document.getElementById('edit-phone').value = 'New Phone';
  436 |       document.getElementById('edit-tg').value = 'New Tg';
  437 |       document.getElementById('edit-inst').value = 'New Inst';
  438 |       document.getElementById('edit-fb').value = 'New Fb';
  439 |       document.getElementById('edit-web').value = 'New Web';
  440 |       document.getElementById('edit-category').value = 'New Cat';
  441 |       document.getElementById('edit-subcategory').value = 'New Subcat';
  442 |       document.getElementById('edit-loc').value = 'New Loc';
  443 |       document.getElementById('edit-address').value = 'New Addr';
  444 |       document.getElementById('edit-price').value = 'New Price';
  445 |       document.getElementById('edit-notes').value = 'New Notes';
  446 |       document.getElementById('form-section').classList.add('active');
  447 |       return window.saveEdit();
  448 |     });
  449 | 
  450 |     expect(dialogAppeared).toBeTruthy();
  451 |     
  452 |     const modalHidden = await page.evaluate(() => !document.getElementById('form-section')?.classList.contains('active'));
  453 |     expect(modalHidden).toBeTruthy();
  454 |     
  455 |     const updatedName = await page.evaluate(() => document.getElementById('display-name-edit-accept')?.textContent);
  456 |     expect(updatedName).toBe('New Name');
  457 |   });
  458 | 
  459 |   test('should paginate live catalog 50 per page with working prev/next buttons', async ({ page }) => {
  460 |     // Generate 60 mock specialists
  461 |     const mockData = Array.from({ length: 60 }, (_, i) => ({
  462 |       id: `mock-id-${i}`,
  463 |       name: `Specialist ${i}`,
  464 |       category: 'Test',
  465 |       subcategory: 'Test',
  466 |       description: 'Desc',
  467 |       locationType: 'Waterloo',
  468 |       phone: '123-456',
  469 |       website: 'example.com',
  470 |       createdAt: '2023-01-01T00:00:00Z',
  471 |       updatedAt: '2023-01-01T00:00:00Z'
  472 |     }));
  473 | 
  474 |     await page.route('**/data/specialists.json*', async route => {
  475 |       await route.fulfill({
  476 |         contentType: 'application/json',
  477 |         body: JSON.stringify(mockData)
  478 |       });
  479 |     });
  480 | 
  481 |     await page.goto('/admin.html');
  482 |     await page.waitForFunction(() => typeof window.loadLiveCatalog === 'function');
  483 | 
  484 |     await page.evaluate(() => {
  485 |       document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style); window.switchTab&&window.switchTab('live-catalog');
  486 |       return window.loadLiveCatalog();
  487 |     });
  488 | 
  489 |     // Wait for the live catalog to load
  490 |     await page.waitForSelector('#live-catalog-list .application-card', { state: 'attached', timeout: 5000 });
  491 | 
  492 |     // Page 1: 50 cards out of 60, "Назад" disabled
  493 |     expect(await page.locator('#live-catalog-list .application-card').count()).toBe(50);
  494 |     await expect(page.locator('#live-pagination')).toContainText('Сторінка 1 з 2');
> 495 |     await expect(page.locator('#live-pagination')).toContainText('Всього: 60');
      |                                                    ^ Error: expect(locator).toContainText(expected) failed
  496 |     await expect(page.locator('#live-pagination button:has-text("← Назад")')).toBeDisabled();
  497 | 
  498 |     // Page 2: remaining 10 cards, "Далі" disabled
  499 |     await page.locator('#live-pagination button:has-text("Далі →")').click();
  500 |     expect(await page.locator('#live-catalog-list .application-card').count()).toBe(10);
  501 |     await expect(page.locator('#live-pagination')).toContainText('Сторінка 2 з 2');
  502 |     await expect(page.locator('#live-pagination button:has-text("Далі →")')).toBeDisabled();
  503 | 
  504 |     // Back to page 1
  505 |     await page.locator('#live-pagination button:has-text("← Назад")').click();
  506 |     expect(await page.locator('#live-catalog-list .application-card').count()).toBe(50);
  507 |     await expect(page.locator('#live-pagination')).toContainText('Сторінка 1 з 2');
  508 |   });
  509 | 
  510 |   test('should show card IDs and keep search input usable while filtering', async ({ page }) => {
  511 |     const mockData = Array.from({ length: 60 }, (_, i) => ({
  512 |       id: `mock-id-${i}`,
  513 |       name: `Specialist ${i}`,
  514 |       category: 'Test',
  515 |       subcategory: 'Test',
  516 |       description: 'Desc',
  517 |       locationType: 'Waterloo',
  518 |       phone: '123-456',
  519 |       website: 'example.com',
  520 |       createdAt: '2023-01-01T00:00:00Z',
  521 |       updatedAt: '2023-01-01T00:00:00Z'
  522 |     }));
  523 | 
  524 |     await page.route('**/data/specialists.json*', async route => {
  525 |       await route.fulfill({
  526 |         contentType: 'application/json',
  527 |         body: JSON.stringify(mockData)
  528 |       });
  529 |     });
  530 | 
  531 |     await page.goto('/admin.html');
  532 |     await page.waitForFunction(() => typeof window.loadLiveCatalog === 'function');
  533 | 
  534 |     await page.evaluate(() => {
  535 |       document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style); window.switchTab&&window.switchTab('live-catalog');
  536 |       return window.loadLiveCatalog();
  537 |     });
  538 | 
  539 |     await page.waitForSelector('#live-catalog-list .application-card', { state: 'attached', timeout: 5000 });
  540 | 
  541 |     // Every card shows its ID (data is reversed, so newest first)
  542 |     await expect(page.locator('#live-card-mock-id-59')).toContainText('#mock-id-59');
  543 |     await expect(page.locator('#live-card-mock-id-59')).toContainText('ID: mock-id-59');
  544 | 
  545 |     // Typing several characters must keep focus and the full query in the field
  546 |     const search = page.locator('#live-search');
  547 |     await search.click();
  548 |     await page.keyboard.type('mock-id-42');
  549 |     await expect(search).toHaveValue('mock-id-42');
  550 |     await expect(search).toBeFocused();
  551 | 
  552 |     expect(await page.locator('#live-catalog-list .application-card').count()).toBe(1);
  553 |     await expect(page.locator('#live-catalog-list .application-card')).toContainText('Specialist 42');
  554 |     await expect(page.locator('#live-pagination')).toContainText('Всього: 1');
  555 |   });
  556 | 
  557 | 
  558 |   test.skip('should center edit modal and apply correct width on mobile screens', async ({ page }) => {
  559 |     // Set viewport to mobile size
  560 |     await page.setViewportSize({ width: 375, height: 667 });
  561 |     await page.goto('/admin.html');
  562 |     
  563 |     // Wait for the admin.js module to finish loading
  564 |     await page.waitForFunction(() => typeof window.editApp === 'function');
  565 | 
  566 |     // Trigger modal
  567 |     await page.evaluate(() => {
  568 |       document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style);
  569 |       document.body.innerHTML += `
  570 |         <div id="display-name-test_mob">TestName</div>
  571 |         <div id="display-cat-test_mob">Cat</div>
  572 |         <div id="display-desc-test_mob">Desc</div>
  573 |         <div id="display-loc-test_mob">Loc</div>
  574 |         <div id="display-address-test_mob">Addr</div>
  575 |         <div id="display-phone-test_mob">Phone</div>
  576 |         <div id="display-tg-test_mob">Tg</div>
  577 |         <div id="display-inst-test_mob">Inst</div>
  578 |         <div id="display-fb-test_mob">Fb</div>
  579 |         <div id="display-web-test_mob">Web</div>
  580 |         <div id="display-price-test_mob">Price</div>
  581 |         <div id="display-notes-test_mob">Notes</div>
  582 |       `;
  583 |       window.editApp('test_mob', false);
  584 |     });
  585 | 
  586 |     const modal = page.locator('#form-section');
  587 |     await expect(modal).toBeVisible();
  588 | 
  589 |     // The modal container
  590 |     await expect(modal).toHaveCSS('display', 'flex');
  591 |     await expect(modal).toHaveCSS('justify-content', 'center');
  592 |     await expect(modal).toHaveCSS('align-items', 'center');
  593 |     
  594 |     // The inner content block of the modal
  595 |     const modalInner = modal.locator('> div');
```