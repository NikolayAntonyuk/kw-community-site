# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel E2E >> should require confirmation before saving edit and proceed on accept
- Location: tests/e2e/admin.spec.ts:373:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "New Name"
Received: ""
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
  - textbox [ref=e14]: New Name
  - textbox [ref=e15]: New Desc
  - textbox [ref=e16]: New Phone
  - textbox [ref=e17]: New Web
```

# Test source

```ts
  323 |     });
  324 | 
  325 |     expect(dialogAppeared).toBeTruthy();
  326 |     
  327 |     // Card should be hidden after successful deletion
  328 |     const cardHidden = await page.evaluate(() => {
  329 |       const el = document.getElementById('live-card-del-accept');
  330 |       return !el || el.style.display === 'none';
  331 |     });
  332 |     expect(cardHidden).toBeTruthy();
  333 |   });
  334 | 
  335 |   test('should approve application when confirmation is accepted', async ({ page }) => {
  336 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  337 |       await route.fulfill({
  338 |         contentType: 'application/javascript',
  339 |         body: `
  340 |           export const collection = () => {};
  341 |           export const query = () => {};
  342 |           export const where = () => {};
  343 |           export const getDocs = async () => ({ empty: true });
  344 |           export const updateDoc = async () => {};
  345 |           export const doc = () => {};
  346 |           export const addDoc = async () => {};
  347 |           export const getFirestore = () => ({});
  348 |         `
  349 |       });
  350 |     });
  351 | 
  352 |     await page.goto('/admin.html');
  353 |     await page.waitForFunction(() => typeof window.approveApp === 'function');
  354 | 
  355 |     let dialogAppeared = false;
  356 |     page.on('dialog', async dialog => {
  357 |       dialogAppeared = true;
  358 |       await dialog.accept();
  359 |     });
  360 | 
  361 |     await page.evaluate(() => {
  362 |       document.body.innerHTML += '<div id="card-approve-accept"></div>';
  363 |       return window.approveApp('approve-accept');
  364 |     });
  365 | 
  366 |     expect(dialogAppeared).toBeTruthy();
  367 |     
  368 |     // Card should be removed after approval
  369 |     const cardExists = await page.evaluate(() => !!document.getElementById('card-approve-accept'));
  370 |     expect(cardExists).toBeFalsy();
  371 |   });
  372 | 
  373 |   test('should require confirmation before saving edit and proceed on accept', async ({ page }) => {
  374 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  375 |       await route.fulfill({
  376 |         contentType: 'application/javascript',
  377 |         body: `
  378 |           export const collection = () => {};
  379 |           export const query = () => {};
  380 |           export const where = () => {};
  381 |           export const getDocs = async () => ({ empty: true });
  382 |           export const updateDoc = async () => {};
  383 |           export const doc = () => {};
  384 |           export const addDoc = async () => {};
  385 |           export const getFirestore = () => ({});
  386 |           export const serverTimestamp = () => ({});
  387 |         `
  388 |       });
  389 |     });
  390 | 
  391 |     await page.goto('/admin.html');
  392 |     await page.waitForFunction(() => typeof window.saveEdit === 'function');
  393 | 
  394 |     let dialogAppeared = false;
  395 |     page.on('dialog', async dialog => {
  396 |       dialogAppeared = true;
  397 |       await dialog.accept();
  398 |     });
  399 | 
  400 |     await page.evaluate(() => {
  401 |       document.body.innerHTML += `
  402 |         <input type="hidden" id="edit-id" value="edit-accept">
  403 |         <input type="hidden" id="edit-islive" value="false">
  404 |         <input type="text" id="edit-name" value="New Name">
  405 |         <input type="text" id="edit-desc" value="New Desc">
  406 |         <input type="text" id="edit-phone" value="New Phone">
  407 |         <input type="text" id="edit-web" value="New Web">
  408 |         <div id="display-name-edit-accept"></div>
  409 |         <div id="display-desc-edit-accept"></div>
  410 |         <div id="display-phone-edit-accept"></div>
  411 |         <div id="display-web-edit-accept"></div>
  412 |         <div id="edit-modal" style="display:block;"></div>
  413 |       `;
  414 |       return window.saveEdit();
  415 |     });
  416 | 
  417 |     expect(dialogAppeared).toBeTruthy();
  418 |     
  419 |     const modalVisible = await page.evaluate(() => document.getElementById('edit-modal')?.style.display !== 'none');
  420 |     expect(modalVisible).toBeFalsy();
  421 |     
  422 |     const updatedName = await page.evaluate(() => document.getElementById('display-name-edit-accept')?.innerText);
> 423 |     expect(updatedName).toBe('New Name');
      |                         ^ Error: expect(received).toBe(expected) // Object.is equality
  424 |   });
  425 | });
  426 | 
  427 | 
```