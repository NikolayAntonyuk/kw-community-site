# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel E2E >> should require confirmation before deleting live application
- Location: tests/e2e/admin.spec.ts:220:7

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
  140 |       });
  141 |     });
  142 | 
  143 |     await page.goto('/admin.html');
  144 |     
  145 |     // Wait for the admin.js module to finish loading
  146 |     await page.waitForFunction(() => typeof window.rejectApp === 'function');
  147 | 
  148 |     let dialogMessages: string[] = [];
  149 |     page.on('dialog', async dialog => {
  150 |       dialogMessages.push(dialog.message());
  151 |       if (dialog.type() === 'prompt') {
  152 |         await dialog.accept('Test rejection reason');
  153 |       } else {
  154 |         await dialog.accept();
  155 |       }
  156 |     });
  157 | 
  158 |     await page.evaluate(() => {
  159 |       document.body.innerHTML += '<div id="card-noemail"></div>';
  160 |       // userEmail = '' (empty)
  161 |       return window.rejectApp('noemail', '', 'Test User');
  162 |     });
  163 | 
  164 |     // Wait a bit for async operations (dialogs to appear)
  165 |     await page.waitForTimeout(500);
  166 | 
  167 |     expect(dialogMessages).toContain('Вкажіть причину відхилення (або залиште порожнім):');
  168 |     
  169 |     // Check if the specific email warning was shown
  170 |     const modalText = await page.textContent('#custom-alert-message');
  171 |     const hasEmailWarning = modalText.includes('Лист не відправлено, оскільки у спеціаліста немає валідного email');
  172 |     expect(hasEmailWarning).toBeTruthy();
  173 |   });
  174 | 
  175 |   test('should require confirmation before approving application', async ({ page }) => {
  176 |     // Mock Firestore
  177 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  178 |       await route.fulfill({
  179 |         contentType: 'application/javascript',
  180 |         body: `
  181 |           export const collection = () => {};
  182 |           export const query = () => {};
  183 |           export const where = () => {};
  184 |           export const getDocs = async () => ({ empty: true });
  185 |           export const updateDoc = async () => {};
  186 |           export const doc = () => {};
  187 |           export const addDoc = async () => {};
  188 |           export const getFirestore = () => ({});
  189 |           export const serverTimestamp = () => ({});
  190 |         `
  191 |       });
  192 |     });
  193 | 
  194 |     await page.goto('/admin.html');
  195 |     await page.waitForFunction(() => typeof window.approveApp === 'function');
  196 | 
  197 |     let dialogAppeared = false;
  198 |     let dialogMessage = '';
  199 |     
  200 |     // Test CANCEL
  201 |     page.on('dialog', async dialog => {
  202 |       dialogAppeared = true;
  203 |       dialogMessage = dialog.message();
  204 |       await dialog.dismiss();
  205 |     });
  206 | 
  207 |     await page.evaluate(() => {
  208 |       document.body.innerHTML += '<div id="card-approve1"></div>';
  209 |       return window.approveApp('approve1');
  210 |     });
  211 | 
  212 |     // Check if card still exists (action was cancelled)
  213 |     expect(dialogAppeared).toBeTruthy();
  214 |     expect(dialogMessage).toContain('хочете підтвердити');
  215 |     
  216 |     const cardExists = await page.evaluate(() => !!document.getElementById('card-approve1'));
  217 |     expect(cardExists).toBeTruthy();
  218 |   });
  219 | 
  220 |   test('should require confirmation before deleting live application', async ({ page }) => {
  221 |     // Mock Firestore
  222 |     await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
  223 |       await route.fulfill({
  224 |         contentType: 'application/javascript',
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
> 240 |     await page.waitForFunction(() => typeof window.deleteLiveApp === 'function');
      |                ^ Error: page.waitForFunction: Test timeout of 30000ms exceeded.
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
  306 |   // @T16: Desktop layout - all tabs visible
  307 |   test('(@T16) should display all tabs visible on desktop (>768px)', async ({ page }) => {
  308 |     await page.setViewportSize({ width: 1024, height: 768 });
  309 |     await page.goto('/admin.html');
  310 | 
  311 |     // Wait for page to load
  312 |     await page.waitForFunction(() => typeof window.switchTab === 'function');
  313 | 
  314 |     // Tab links should be visible on desktop
  315 |     const tabLinks = page.locator('nav a, .nav-links a');
  316 |     const tabCount = await tabLinks.count();
  317 | 
  318 |     // Hamburger menu should be hidden on desktop
  319 |     const hamburger = page.locator('.menu-button, .hamburger');
  320 |     const hamburgerVisible = await hamburger.isVisible().catch(() => false);
  321 |     expect(hamburgerVisible).toBeFalsy();
  322 |   });
  323 | 
  324 |   // @T17: Mobile layout - hamburger menu appears
  325 |   test('(@T17) should display hamburger menu on mobile (<768px)', async ({ page }) => {
  326 |     await page.setViewportSize({ width: 375, height: 667 });
  327 |     await page.goto('/admin.html');
  328 | 
  329 |     await page.waitForFunction(() => typeof window.toggleAdminMenu === 'function');
  330 | 
  331 |     // Hamburger menu should be visible on mobile
  332 |     const hamburger = page.locator('.menu-button, button:has-text("☰")');
  333 |     await expect(hamburger).toBeVisible();
  334 | 
  335 |     // Main tab links should be hidden (wrapped in dropdown)
  336 |     const navLinks = page.locator('nav a:not(.email-badge-btn)');
  337 |     const linksVisible = await navLinks.first().isVisible().catch(() => false);
  338 |     // On mobile, nav links might be in dropdown, so they could be hidden initially
  339 |   });
  340 | 
```