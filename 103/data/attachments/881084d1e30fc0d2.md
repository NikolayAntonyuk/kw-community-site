# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel E2E >> (@T18) should display email button in header on both desktop and mobile
- Location: tests/e2e/admin.spec.ts:342:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('.email-badge-btn, button:has-text("✉️")')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.email-badge-btn, button:has-text("✉️")')
    14 × locator resolved to <button id="email-badge-btn" class="email-badge-btn" onclick="window.goToEmailSection()">…</button>
       - unexpected value "hidden"

```

```yaml
- navigation:
  - link "KW Ukrainians Разом KW":
    - /url: index.html
    - img "KW Ukrainians"
    - text: Разом KW
  - link "Головна":
    - /url: index.html
  - link "Каталог":
    - /url: catalog.html
  - link "Школа":
    - /url: school.html
- main:
  - heading "Адмін-панель" [level=1]
  - heading "Вхід для адміністраторів" [level=2]
  - textbox "Email"
  - textbox "Пароль"
  - button "Увійти"
```

# Test source

```ts
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
  341 |   // @T18: Email button always visible in header
  342 |   test('(@T18) should display email button in header on both desktop and mobile', async ({ page }) => {
  343 |     // Test on desktop
  344 |     await page.setViewportSize({ width: 1024, height: 768 });
  345 |     await page.goto('/admin.html');
  346 | 
  347 |     const emailBadgeBtn = page.locator('.email-badge-btn, button:has-text("✉️")');
> 348 |     await expect(emailBadgeBtn).toBeVisible();
      |                                 ^ Error: expect(locator).toBeVisible() failed
  349 | 
  350 |     // Test on mobile
  351 |     await page.setViewportSize({ width: 375, height: 667 });
  352 |     await expect(emailBadgeBtn).toBeVisible();
  353 |   });
  354 | 
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
```