# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel E2E >> should require confirmation before saving edit and proceed on accept
- Location: tests/e2e/admin.spec.ts:376:3

# Error details

```
Error: expect(received).toBeFalsy()

Received: true
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - link "← Головна" [ref=e3] [cursor=pointer]:
      - /url: index.html
    - heading "Адмін-панель" [level=1] [ref=e4]
  - main [ref=e5]:
    - generic [ref=e6]:
      - heading "Вхід для адміністраторів" [level=2] [ref=e7]
      - generic [ref=e8]:
        - textbox "Email" [ref=e10]
        - textbox "Пароль" [ref=e12]
        - button "Увійти" [ref=e13] [cursor=pointer]
  - generic [ref=e15]:
    - heading "Редагувати заявку" [level=2] [ref=e16]
    - generic [ref=e17]:
      - text: "Ім'я/Назва:"
      - textbox [ref=e18]: New Name
    - generic [ref=e19]:
      - text: "Опис:"
      - textbox [ref=e20]: New Desc
    - generic [ref=e21]:
      - text: "Телефон:"
      - textbox [ref=e22]: New Phone
    - generic [ref=e23]:
      - text: "Telegram:"
      - textbox [ref=e24]: New Tg
    - generic [ref=e25]:
      - text: "Instagram:"
      - textbox [ref=e26]: New Inst
    - generic [ref=e27]:
      - text: "Facebook:"
      - textbox [ref=e28]: New Fb
    - generic [ref=e29]:
      - text: "Вебсайт:"
      - textbox [ref=e30]: New Web
    - generic [ref=e31]:
      - button "Зберегти" [ref=e32] [cursor=pointer]
      - button "Скасувати" [ref=e33] [cursor=pointer]
  - generic [ref=e34]: New Name
  - generic [ref=e35]: New Desc
  - generic [ref=e36]: New Phone
```

# Test source

```ts
  329 |     
  330 |     // Card should be hidden after successful deletion
  331 |     const cardHidden = await page.evaluate(() => {
  332 |       const el = document.getElementById('live-card-del-accept');
  333 |       return !el || el.style.display === 'none';
  334 |     });
  335 |     expect(cardHidden).toBeTruthy();
  336 |   });
  337 | 
  338 |   test('should approve application when confirmation is accepted', async ({ page }) => {
  339 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  340 |       await route.fulfill({
  341 |         contentType: 'application/javascript',
  342 |         body: `
  343 |           export const collection = () => {};
  344 |           export const query = () => {};
  345 |           export const where = () => {};
  346 |           export const getDocs = async () => ({ empty: true });
  347 |           export const updateDoc = async () => {};
  348 |           export const doc = () => {};
  349 |           export const addDoc = async () => {};
  350 |           export const getFirestore = () => ({});
  351 |         `
  352 |       });
  353 |     });
  354 | 
  355 |     await page.goto('/admin.html');
  356 |     await page.waitForFunction(() => typeof window.approveApp === 'function');
  357 | 
  358 |     let dialogAppeared = false;
  359 |     page.on('dialog', async dialog => {
  360 |       dialogAppeared = true;
  361 |       await dialog.accept();
  362 |     });
  363 | 
  364 |     await page.evaluate(() => {
  365 |       document.body.innerHTML += '<div id="card-approve-accept"></div>';
  366 |       return window.approveApp('approve-accept');
  367 |     });
  368 | 
  369 |     expect(dialogAppeared).toBeTruthy();
  370 |     
  371 |     // Card should be removed after approval
  372 |     const cardExists = await page.evaluate(() => !!document.getElementById('card-approve-accept'));
  373 |     expect(cardExists).toBeFalsy();
  374 |   });
  375 | 
  376 |   test('should require confirmation before saving edit and proceed on accept', async ({ page }) => {
  377 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  378 |       await route.fulfill({
  379 |         contentType: 'application/javascript',
  380 |         body: `
  381 |           export const collection = () => {};
  382 |           export const query = () => {};
  383 |           export const where = () => {};
  384 |           export const getDocs = async () => ({ empty: true });
  385 |           export const updateDoc = async () => {};
  386 |           export const doc = () => {};
  387 |           export const addDoc = async () => {};
  388 |           export const getFirestore = () => ({});
  389 |           export const serverTimestamp = () => ({});
  390 |         `
  391 |       });
  392 |     });
  393 | 
  394 |     await page.goto('/admin.html');
  395 |     await page.waitForFunction(() => typeof window.saveEdit === 'function');
  396 | 
  397 |     let dialogAppeared = false;
  398 |     page.on('dialog', async dialog => {
  399 |       dialogAppeared = true;
  400 |       await dialog.accept();
  401 |     });
  402 | 
  403 |     await page.evaluate(() => {
  404 |       document.body.innerHTML += `
  405 |         <div id="display-name-edit-accept"></div>
  406 |         <div id="display-desc-edit-accept"></div>
  407 |         <div id="display-phone-edit-accept"></div>
  408 |         <div id="display-tg-edit-accept"></div>
  409 |         <div id="display-inst-edit-accept"></div>
  410 |         <div id="display-fb-edit-accept"></div>
  411 |         <div id="display-web-edit-accept"></div>
  412 |       `;
  413 |       document.getElementById('edit-id').value = 'edit-accept';
  414 |       document.getElementById('edit-islive').value = 'false';
  415 |       document.getElementById('edit-name').value = 'New Name';
  416 |       document.getElementById('edit-desc').value = 'New Desc';
  417 |       document.getElementById('edit-phone').value = 'New Phone';
  418 |       document.getElementById('edit-tg').value = 'New Tg';
  419 |       document.getElementById('edit-inst').value = 'New Inst';
  420 |       document.getElementById('edit-fb').value = 'New Fb';
  421 |       document.getElementById('edit-web').value = 'New Web';
  422 |       document.getElementById('edit-modal').style.display = 'block';
  423 |       return window.saveEdit();
  424 |     });
  425 | 
  426 |     expect(dialogAppeared).toBeTruthy();
  427 |     
  428 |     const modalVisible = await page.evaluate(() => document.getElementById('edit-modal')?.style.display !== 'none');
> 429 |     expect(modalVisible).toBeFalsy();
      |                          ^ Error: expect(received).toBeFalsy()
  430 |     
  431 |     const updatedName = await page.evaluate(() => document.getElementById('display-name-edit-accept')?.textContent);
  432 |     expect(updatedName).toBe('New Name');
  433 |   });
  434 | 
  435 |   test('should paginate live catalog 50 per page with working prev/next buttons', async ({ page }) => {
  436 |     // Generate 60 mock specialists
  437 |     const mockData = Array.from({ length: 60 }, (_, i) => ({
  438 |       id: `mock-id-${i}`,
  439 |       name: `Specialist ${i}`,
  440 |       category: 'Test',
  441 |       subcategory: 'Test',
  442 |       description: 'Desc',
  443 |       locationType: 'Waterloo',
  444 |       phone: '123-456',
  445 |       website: 'example.com',
  446 |       createdAt: '2023-01-01T00:00:00Z',
  447 |       updatedAt: '2023-01-01T00:00:00Z'
  448 |     }));
  449 | 
  450 |     await page.route('**/data/specialists.json*', async route => {
  451 |       await route.fulfill({
  452 |         contentType: 'application/json',
  453 |         body: JSON.stringify(mockData)
  454 |       });
  455 |     });
  456 | 
  457 |     await page.goto('/admin.html');
  458 |     await page.waitForFunction(() => typeof window.loadLiveCatalog === 'function');
  459 | 
  460 |     await page.evaluate(() => {
  461 |       document.getElementById('dashboard-section')!.style.display = 'block';
  462 |       return window.loadLiveCatalog();
  463 |     });
  464 | 
  465 |     // Wait for the live catalog to load
  466 |     await page.waitForSelector('#live-catalog-list .application-card', { state: 'attached', timeout: 5000 });
  467 | 
  468 |     // Page 1: 50 cards out of 60, "Назад" disabled
  469 |     expect(await page.locator('#live-catalog-list .application-card').count()).toBe(50);
  470 |     await expect(page.locator('#live-pagination')).toContainText('Сторінка 1 з 2');
  471 |     await expect(page.locator('#live-pagination')).toContainText('Всього: 60');
  472 |     await expect(page.locator('#live-pagination button:has-text("← Назад")')).toBeDisabled();
  473 | 
  474 |     // Page 2: remaining 10 cards, "Далі" disabled
  475 |     await page.locator('#live-pagination button:has-text("Далі →")').click();
  476 |     expect(await page.locator('#live-catalog-list .application-card').count()).toBe(10);
  477 |     await expect(page.locator('#live-pagination')).toContainText('Сторінка 2 з 2');
  478 |     await expect(page.locator('#live-pagination button:has-text("Далі →")')).toBeDisabled();
  479 | 
  480 |     // Back to page 1
  481 |     await page.locator('#live-pagination button:has-text("← Назад")').click();
  482 |     expect(await page.locator('#live-catalog-list .application-card').count()).toBe(50);
  483 |     await expect(page.locator('#live-pagination')).toContainText('Сторінка 1 з 2');
  484 |   });
  485 | 
  486 |   test('should show card IDs and keep search input usable while filtering', async ({ page }) => {
  487 |     const mockData = Array.from({ length: 60 }, (_, i) => ({
  488 |       id: `mock-id-${i}`,
  489 |       name: `Specialist ${i}`,
  490 |       category: 'Test',
  491 |       subcategory: 'Test',
  492 |       description: 'Desc',
  493 |       locationType: 'Waterloo',
  494 |       phone: '123-456',
  495 |       website: 'example.com',
  496 |       createdAt: '2023-01-01T00:00:00Z',
  497 |       updatedAt: '2023-01-01T00:00:00Z'
  498 |     }));
  499 | 
  500 |     await page.route('**/data/specialists.json*', async route => {
  501 |       await route.fulfill({
  502 |         contentType: 'application/json',
  503 |         body: JSON.stringify(mockData)
  504 |       });
  505 |     });
  506 | 
  507 |     await page.goto('/admin.html');
  508 |     await page.waitForFunction(() => typeof window.loadLiveCatalog === 'function');
  509 | 
  510 |     await page.evaluate(() => {
  511 |       document.getElementById('dashboard-section')!.style.display = 'block';
  512 |       return window.loadLiveCatalog();
  513 |     });
  514 | 
  515 |     await page.waitForSelector('#live-catalog-list .application-card', { state: 'attached', timeout: 5000 });
  516 | 
  517 |     // Every card shows its ID (data is reversed, so newest first)
  518 |     await expect(page.locator('#live-card-mock-id-59')).toContainText('#mock-id-59');
  519 |     await expect(page.locator('#live-card-mock-id-59')).toContainText('ID: mock-id-59');
  520 | 
  521 |     // Typing several characters must keep focus and the full query in the field
  522 |     const search = page.locator('#live-search');
  523 |     await search.click();
  524 |     await page.keyboard.type('mock-id-42');
  525 |     await expect(search).toHaveValue('mock-id-42');
  526 |     await expect(search).toBeFocused();
  527 | 
  528 |     expect(await page.locator('#live-catalog-list .application-card').count()).toBe(1);
  529 |     await expect(page.locator('#live-catalog-list .application-card')).toContainText('Specialist 42');
```