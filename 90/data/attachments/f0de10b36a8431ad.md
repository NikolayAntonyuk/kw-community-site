# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel E2E >> should delete live application when confirmation is accepted
- Location: tests/e2e/admin.spec.ts:306:7

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
  225 |         body: `
  226 |           export const collection = () => {};
  227 |           export const query = () => {};
  228 |           export const where = () => {};
  229 |           export const getDocs = async () => ({ empty: true });
  230 |           export const updateDoc = async () => {};
  231 |           export const doc = () => {};
  232 |           export const addDoc = async () => {};
  233 |           export const getFirestore = () => ({});
  234 |           export const serverTimestamp = () => ({});
  235 |         `
  236 |       });
  237 |     });
  238 | 
  239 |     await page.goto('/admin.html');
  240 |     await page.waitForFunction(() => typeof window.deleteLiveApp === 'function');
  241 | 
  242 |     let dialogAppeared = false;
  243 |     let dialogMessage = '';
  244 |     
  245 |     page.on('dialog', async dialog => {
  246 |       dialogAppeared = true;
  247 |       dialogMessage = dialog.message();
  248 |       await dialog.dismiss();
  249 |     });
  250 | 
  251 |     await page.evaluate(() => {
  252 |       document.body.innerHTML += '<div id="live-card-del1"></div>';
  253 |       return window.deleteLiveApp('del1');
  254 |     });
  255 | 
  256 |     expect(dialogAppeared).toBeTruthy();
  257 |     expect(dialogMessage).toContain('видалити цього спеціаліста');
  258 |     
  259 |     const cardExists = await page.evaluate(() => {
  260 |       const el = document.getElementById('live-card-del1');
  261 |       return el && el.style.display !== 'none';
  262 |     });
  263 |     expect(cardExists).toBeTruthy();
  264 |   });
  265 | 
  266 |   test('should cancel rejection when dismiss is clicked on prompt', async ({ page }) => {
  267 |     await page.goto('/admin.html');
  268 |     await page.waitForFunction(() => typeof window.rejectApp === 'function');
  269 | 
  270 |     let promptShown = false;
  271 |     page.on('dialog', async dialog => {
  272 |       promptShown = true;
  273 |       await dialog.dismiss();
  274 |     });
  275 | 
  276 |     await page.evaluate(() => {
  277 |       document.body.innerHTML += '<div id="card-rej-cancel"></div>';
  278 |       return window.rejectApp('rej-cancel', 'user@example.com', 'Test User');
  279 |     });
  280 | 
  281 |     expect(promptShown).toBeTruthy();
  282 |     const cardExists = await page.evaluate(() => !!document.getElementById('card-rej-cancel'));
  283 |     expect(cardExists).toBeTruthy();
  284 |   });
  285 | 
  286 |   test('should display formatted dates on live catalog cards', async ({ page }) => {
  287 |     await page.goto('/admin.html');
  288 |     await page.waitForFunction(() => typeof window.loadLiveCatalog === 'function');
  289 | 
  290 |     await page.evaluate(() => {
  291 |       document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style); window.switchTab&&window.switchTab('live-catalog');
  292 |       return window.loadLiveCatalog();
  293 |     });
  294 | 
  295 |     // Wait for the live catalog to load from data/specialists.json
  296 |     await page.waitForSelector('#live-catalog-list .application-card', { state: 'attached', timeout: 5000 });
  297 | 
  298 |     // Verify first card has created date rendered
  299 |     const firstCardText = await page.locator('#live-catalog-list .application-card').first().innerText();
  300 |     expect(firstCardText).toContain('Створено:');
  301 |     expect(firstCardText).toContain('Відредаговано:');
  302 |     // Ensure it does not say "Невідомо"
  303 |     expect(firstCardText).not.toContain('Створено: Невідомо');
  304 |   });
  305 | 
  306 |   test('should delete live application when confirmation is accepted', async ({ page }) => {
  307 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
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
> 325 |     await page.waitForFunction(() => typeof window.deleteLiveApp === 'function');
      |                ^ Error: page.waitForFunction: Test timeout of 30000ms exceeded.
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
```