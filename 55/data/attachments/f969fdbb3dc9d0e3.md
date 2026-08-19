# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel E2E >> should approve application when confirmation is accepted
- Location: tests/e2e/admin.spec.ts:343:3

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
```

# Test source

```ts
  261 | 
  262 |   test('should cancel rejection when dismiss is clicked on prompt', async ({ page }) => {
  263 |     await page.goto('/admin.html');
  264 |     await page.waitForFunction(() => typeof window.rejectApp === 'function');
  265 | 
  266 |     let promptShown = false;
  267 |     page.on('dialog', async dialog => {
  268 |       promptShown = true;
  269 |       await dialog.dismiss();
  270 |     });
  271 | 
  272 |     await page.evaluate(() => {
  273 |       document.body.innerHTML += '<div id="card-rej-cancel"></div>';
  274 |       return window.rejectApp('rej-cancel', 'user@example.com', 'Test User');
  275 |     });
  276 | 
  277 |     expect(promptShown).toBeTruthy();
  278 |     const cardExists = await page.evaluate(() => !!document.getElementById('card-rej-cancel'));
  279 |     expect(cardExists).toBeTruthy();
  280 |   });
  281 | 
  282 |   test('should display formatted dates on live catalog cards', async ({ page }) => {
  283 |     await page.goto('/admin.html');
  284 |     await page.waitForFunction(() => typeof window.loadLiveCatalog === 'function');
  285 | 
  286 |     await page.evaluate(() => {
  287 |       document.getElementById('dashboard-section')!.style.display = 'block';
  288 |       return window.loadLiveCatalog();
  289 |     });
  290 | 
  291 |     // Wait for the live catalog to load from data/specialists.json
  292 |     await page.waitForSelector('#live-catalog-list .application-card', { state: 'attached', timeout: 5000 });
  293 | 
  294 |     // Verify first card has created date rendered
  295 |     const firstCardText = await page.locator('#live-catalog-list .application-card').first().innerText();
  296 |     expect(firstCardText).toContain('Створено:');
  297 |     expect(firstCardText).toContain('Відредаговано:');
  298 |     // Ensure it does not say "Невідомо"
  299 |     expect(firstCardText).not.toContain('Створено: Невідомо');
  300 |   });
  301 | 
  302 |   test('should delete live application when confirmation is accepted', async ({ page }) => {
  303 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  304 |       await route.fulfill({
  305 |         contentType: 'application/javascript',
  306 |         body: `
  307 |           export const collection = () => {};
  308 |           export const query = () => {};
  309 |           export const where = () => {};
  310 |           export const getDocs = async () => ({ empty: true });
  311 |           export const updateDoc = async () => {};
  312 |           export const doc = () => {};
  313 |           export const addDoc = async () => {};
  314 |           export const getFirestore = () => ({});
  315 |         `
  316 |       });
  317 |     });
  318 | 
  319 |     await page.goto('/admin.html');
  320 |     await page.waitForFunction(() => typeof window.deleteLiveApp === 'function');
  321 | 
  322 |     let dialogAppeared = false;
  323 |     page.on('dialog', async dialog => {
  324 |       dialogAppeared = true;
  325 |       await dialog.accept(); // Accept the confirmation
  326 |     });
  327 | 
  328 |     await page.evaluate(() => {
  329 |       document.body.innerHTML += '<div id="live-card-del-accept"></div>';
  330 |       return window.deleteLiveApp('del-accept');
  331 |     });
  332 | 
  333 |     expect(dialogAppeared).toBeTruthy();
  334 |     
  335 |     // Card should be hidden after successful deletion
  336 |     const cardHidden = await page.evaluate(() => {
  337 |       const el = document.getElementById('live-card-del-accept');
  338 |       return !el || el.style.display === 'none';
  339 |     });
  340 |     expect(cardHidden).toBeTruthy();
  341 |   });
  342 | 
  343 |   test('should approve application when confirmation is accepted', async ({ page }) => {
  344 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  345 |       await route.fulfill({
  346 |         contentType: 'application/javascript',
  347 |         body: `
  348 |           export const collection = () => {};
  349 |           export const query = () => {};
  350 |           export const where = () => {};
  351 |           export const getDocs = async () => ({ empty: true });
  352 |           export const updateDoc = async () => {};
  353 |           export const doc = () => {};
  354 |           export const addDoc = async () => {};
  355 |           export const getFirestore = () => ({});
  356 |         `
  357 |       });
  358 |     });
  359 | 
  360 |     await page.goto('/admin.html');
> 361 |     await page.waitForFunction(() => typeof window.approveApp === 'function');
      |                ^ Error: page.waitForFunction: Test timeout of 30000ms exceeded.
  362 | 
  363 |     let dialogAppeared = false;
  364 |     page.on('dialog', async dialog => {
  365 |       dialogAppeared = true;
  366 |       await dialog.accept();
  367 |     });
  368 | 
  369 |     await page.evaluate(() => {
  370 |       document.body.innerHTML += '<div id="card-approve-accept"></div>';
  371 |       return window.approveApp('approve-accept');
  372 |     });
  373 | 
  374 |     expect(dialogAppeared).toBeTruthy();
  375 |     
  376 |     // Card should be removed after approval
  377 |     const cardExists = await page.evaluate(() => !!document.getElementById('card-approve-accept'));
  378 |     expect(cardExists).toBeFalsy();
  379 |   });
  380 | 
  381 |   test('should require confirmation before saving edit and proceed on accept', async ({ page }) => {
  382 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  383 |       await route.fulfill({
  384 |         contentType: 'application/javascript',
  385 |         body: `
  386 |           export const collection = () => {};
  387 |           export const query = () => {};
  388 |           export const where = () => {};
  389 |           export const getDocs = async () => ({ empty: true });
  390 |           export const updateDoc = async () => {};
  391 |           export const doc = () => {};
  392 |           export const addDoc = async () => {};
  393 |           export const getFirestore = () => ({});
  394 |           export const serverTimestamp = () => ({});
  395 |         `
  396 |       });
  397 |     });
  398 | 
  399 |     await page.goto('/admin.html');
  400 |     await page.waitForFunction(() => typeof window.saveEdit === 'function');
  401 | 
  402 |     let dialogAppeared = false;
  403 |     page.on('dialog', async dialog => {
  404 |       dialogAppeared = true;
  405 |       await dialog.accept();
  406 |     });
  407 | 
  408 |     await page.evaluate(() => {
  409 |       document.body.innerHTML += `
  410 |         <div id="display-name-edit-accept"></div>
  411 |         <div id="display-cat-edit-accept"></div>
  412 |         <div id="display-desc-edit-accept"></div>
  413 |         <div id="display-loc-edit-accept"></div>
  414 |         <div id="display-address-edit-accept"></div>
  415 |         <div id="display-phone-edit-accept"></div>
  416 |         <div id="display-tg-edit-accept"></div>
  417 |         <div id="display-inst-edit-accept"></div>
  418 |         <div id="display-fb-edit-accept"></div>
  419 |         <div id="display-web-edit-accept"></div>
  420 |         <div id="display-price-edit-accept"></div>
  421 |         <div id="display-notes-edit-accept"></div>
  422 |       `;
  423 |       document.getElementById('edit-id').value = 'edit-accept';
  424 |       document.getElementById('edit-islive').value = 'false';
  425 |       document.getElementById('edit-name').value = 'New Name';
  426 |       document.getElementById('edit-desc').value = 'New Desc';
  427 |       document.getElementById('edit-phone').value = 'New Phone';
  428 |       document.getElementById('edit-tg').value = 'New Tg';
  429 |       document.getElementById('edit-inst').value = 'New Inst';
  430 |       document.getElementById('edit-fb').value = 'New Fb';
  431 |       document.getElementById('edit-web').value = 'New Web';
  432 |       document.getElementById('edit-category').value = 'New Cat';
  433 |       document.getElementById('edit-subcategory').value = 'New Subcat';
  434 |       document.getElementById('edit-loc').value = 'New Loc';
  435 |       document.getElementById('edit-address').value = 'New Addr';
  436 |       document.getElementById('edit-price').value = 'New Price';
  437 |       document.getElementById('edit-notes').value = 'New Notes';
  438 |       document.getElementById('edit-modal').style.display = 'block';
  439 |       return window.saveEdit();
  440 |     });
  441 | 
  442 |     expect(dialogAppeared).toBeTruthy();
  443 |     
  444 |     const modalVisible = await page.evaluate(() => document.getElementById('edit-modal')?.style.display !== 'none');
  445 |     expect(modalVisible).toBeFalsy();
  446 |     
  447 |     const updatedName = await page.evaluate(() => document.getElementById('display-name-edit-accept')?.textContent);
  448 |     expect(updatedName).toBe('New Name');
  449 |   });
  450 | 
  451 |   test('should paginate live catalog 50 per page with working prev/next buttons', async ({ page }) => {
  452 |     // Generate 60 mock specialists
  453 |     const mockData = Array.from({ length: 60 }, (_, i) => ({
  454 |       id: `mock-id-${i}`,
  455 |       name: `Specialist ${i}`,
  456 |       category: 'Test',
  457 |       subcategory: 'Test',
  458 |       description: 'Desc',
  459 |       locationType: 'Waterloo',
  460 |       phone: '123-456',
  461 |       website: 'example.com',
```