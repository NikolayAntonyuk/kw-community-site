# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel E2E >> should require confirmation before saving edit and proceed on accept
- Location: tests/e2e/admin.spec.ts:387:7

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
  308 |       await route.fulfill({
  309 |         contentType: 'application/javascript',
  310 |         body: `
  311 |           export const collection = () => {};
  312 |           export const query = () => {};
  313 |           export const where = () => {};
  314 |           export const getDocs = async () => ({ empty: true });
  315 |           export const updateDoc = async () => {};
  316 |           export const doc = () => {};
  317 |           export const addDoc = async () => {};
  318 |           export const getFirestore = () => ({});
  319 |           export const serverTimestamp = () => ({});
  320 |         `
  321 |       });
  322 |     });
  323 | 
  324 |     await page.goto('/admin.html');
  325 |     await page.waitForFunction(() => typeof window.deleteLiveApp === 'function');
  326 | 
  327 |     let dialogAppeared = false;
  328 |     page.on('dialog', async dialog => {
  329 |       dialogAppeared = true;
  330 |       await dialog.accept(); // Accept the confirmation
  331 |     });
  332 | 
  333 |     await page.evaluate(() => {
  334 |       document.body.innerHTML += '<div id="live-card-del-accept"></div>';
  335 |       return window.deleteLiveApp('del-accept');
  336 |     });
  337 | 
  338 |     expect(dialogAppeared).toBeTruthy();
  339 |     
  340 |     // Card should be hidden after successful deletion
  341 |     const cardHidden = await page.evaluate(() => {
  342 |       const el = document.getElementById('live-card-del-accept');
  343 |       return !el || el.style.display === 'none';
  344 |     });
  345 |     expect(cardHidden).toBeTruthy();
  346 |   });
  347 | 
  348 |   test('should approve application when confirmation is accepted', async ({ page }) => {
  349 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  350 |       await route.fulfill({
  351 |         contentType: 'application/javascript',
  352 |         body: `
  353 |           export const collection = () => {};
  354 |           export const query = () => {};
  355 |           export const where = () => {};
  356 |           export const getDocs = async () => ({ empty: true });
  357 |           export const updateDoc = async () => {};
  358 |           export const doc = () => {};
  359 |           export const addDoc = async () => {};
  360 |           export const getFirestore = () => ({});
  361 |           export const serverTimestamp = () => ({});
  362 |         `
  363 |       });
  364 |     });
  365 | 
  366 |     await page.goto('/admin.html');
  367 |     await page.waitForFunction(() => typeof window.approveApp === 'function');
  368 | 
  369 |     let dialogAppeared = false;
  370 |     page.on('dialog', async dialog => {
  371 |       dialogAppeared = true;
  372 |       await dialog.accept();
  373 |     });
  374 | 
  375 |     await page.evaluate(() => {
  376 |       document.body.innerHTML += '<div id="card-approve-accept"></div>';
  377 |       return window.approveApp('approve-accept');
  378 |     });
  379 | 
  380 |     expect(dialogAppeared).toBeTruthy();
  381 |     
  382 |     // Card should be removed after approval
  383 |     const cardExists = await page.evaluate(() => !!document.getElementById('card-approve-accept'));
  384 |     expect(cardExists).toBeFalsy();
  385 |   });
  386 | 
  387 |   test('should require confirmation before saving edit and proceed on accept', async ({ page }) => {
  388 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  389 |       await route.fulfill({
  390 |         contentType: 'application/javascript',
  391 |         body: `
  392 |           export const collection = () => {};
  393 |           export const query = () => {};
  394 |           export const where = () => {};
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
> 408 |     await page.waitForFunction(() => typeof window.saveEdit === 'function');
      |                ^ Error: page.waitForFunction: Test timeout of 30000ms exceeded.
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
  495 |     await expect(page.locator('#live-pagination')).toContainText('Всього: 60');
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
```