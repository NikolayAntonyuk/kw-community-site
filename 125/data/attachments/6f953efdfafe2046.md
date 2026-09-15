# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: crm.spec.ts >> CRM Panel E2E >> should open edit modal with populated data
- Location: tests/e2e/crm.spec.ts:239:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('a:has-text("👥")')
    - locator resolved to <a class="tab-btn" onclick="switchTab('catalog')">👥 Каталог</a>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    57 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - generic [ref=f1e3]:
    - heading "⚡ KW CRM" [level=2] [ref=f1e4]
    - generic [ref=f1e5]:
      - generic [ref=f1e6]: Email
      - textbox "admin@example.com" [ref=f1e7]
    - generic [ref=f1e8]:
      - generic [ref=f1e9]: Пароль
      - textbox "••••••••" [ref=f1e10]
    - button "Увійти" [ref=f1e11] [cursor=pointer]
  - generic [ref=f1e12]:
    - generic [ref=f1e13]: ✅ Firebase модулі завантажені успішно!
    - generic [ref=f1e14]: ❌ Користувач не авторизований
```

# Test source

```ts
  169 |       await route.fulfill({
  170 |         status: 200,
  171 |         contentType: 'application/json',
  172 |         body: JSON.stringify({
  173 |           success: true,
  174 |           emails: [
  175 |             {
  176 |               from: 'sender@example.com',
  177 |               subject: 'Test Subject',
  178 |               text: 'Test message body',
  179 |               date: new Date().toISOString(),
  180 |               seqno: 1,
  181 |               flags: []
  182 |             }
  183 |           ],
  184 |           unreadCount: 1
  185 |         })
  186 |       });
  187 |     });
  188 | 
  189 |     // Set token
  190 |     await page.evaluate(() => {
  191 |       localStorage.setItem('kw_token', 'test-token');
  192 |       (window as any).currentUser = { email: 'test@example.com' };
  193 |     });
  194 | 
  195 |     await page.reload();
  196 | 
  197 |     // Navigate to emails
  198 |     await page.click('a:has-text("✉️")');
  199 | 
  200 |     // Email list should be visible
  201 |     const emailList = page.locator('#emailList');
  202 |     await expect(emailList).toBeVisible();
  203 |   });
  204 | 
  205 |   test('should logout user', async ({ page }) => {
  206 |     await page.goto('/crm.html');
  207 | 
  208 |     // Set token
  209 |     await page.evaluate(() => {
  210 |       localStorage.setItem('kw_token', 'test-token');
  211 |       (window as any).currentUser = { email: 'test@example.com' };
  212 |     });
  213 | 
  214 |     await page.reload();
  215 | 
  216 |     // App view should be visible
  217 |     await expect(page.locator('#appView')).toBeVisible();
  218 | 
  219 |     // Click logout button
  220 |     await page.click('button.logout-btn');
  221 | 
  222 |     // Should return to login view
  223 |     await expect(page.locator('#loginView')).toBeVisible();
  224 |     await expect(page.locator('#appView')).not.toBeVisible();
  225 |   });
  226 | 
  227 |   test('should handle Firebase initialization error gracefully', async ({ page }) => {
  228 |     // Block Firebase CDN
  229 |     await page.route('https://www.gstatic.com/firebasejs/**', async (route) => {
  230 |       await route.abort();
  231 |     });
  232 | 
  233 |     await page.goto('/crm.html');
  234 | 
  235 |     // Page should still load (with error handling)
  236 |     await expect(page.locator('#loginView')).toBeVisible();
  237 |   });
  238 | 
  239 |   test('should open edit modal with populated data', async ({ page }) => {
  240 |     await page.goto('/crm.html');
  241 | 
  242 |     // Set token and mock data
  243 |     await page.evaluate(() => {
  244 |       localStorage.setItem('kw_token', 'test-token');
  245 |       (window as any).currentUser = { email: 'test@example.com' };
  246 |       (window as any).allSpecs = [
  247 |         {
  248 |           id: 'spec-123',
  249 |           name: 'Олена Кравченко',
  250 |           category: 'Краса',
  251 |           locationType: 'Toronto',
  252 |           status: 'approved',
  253 |           phone: '+1 (416) 555-0001',
  254 |           email: 'olena@beauty.ca',
  255 |           telegram: '@olena_beauty',
  256 |           website: 'olena-beauty.ca',
  257 |           description: 'Салон краси',
  258 |           address: '123 Main St, Toronto',
  259 |           price: '$$',
  260 |           instagram: '@olenakravchenko',
  261 |           notes: 'Топ майстер'
  262 |         }
  263 |       ];
  264 |     });
  265 | 
  266 |     await page.reload();
  267 | 
  268 |     // Navigate to specialists
> 269 |     await page.click('a:has-text("👥")');
      |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  270 | 
  271 |     // Click edit button
  272 |     await page.click('.actions button.edit');
  273 | 
  274 |     // Modal should open with data
  275 |     await expect(page.locator('#specModal')).toHaveCSS('display', 'flex');
  276 |     await expect(page.locator('#specName')).toHaveValue('Олена Кравченко');
  277 |     await expect(page.locator('#specCategory')).toHaveValue('Краса');
  278 |     await expect(page.locator('#specPhone')).toHaveValue('+1 (416) 555-0001');
  279 |     await expect(page.locator('#specEmail')).toHaveValue('olena@beauty.ca');
  280 |   });
  281 | 
  282 |   test('should handle search filter in specialists table', async ({ page }) => {
  283 |     await page.goto('/crm.html');
  284 | 
  285 |     // Set token and mock data
  286 |     await page.evaluate(() => {
  287 |       localStorage.setItem('kw_token', 'test-token');
  288 |       (window as any).currentUser = { email: 'test@example.com' };
  289 |       (window as any).allSpecs = [
  290 |         { id: '1', name: 'Олена', category: 'Краса', locationType: 'Toronto', status: 'approved' },
  291 |         { id: '2', name: 'Іван', category: 'IT', locationType: 'Waterloo', status: 'approved' }
  292 |       ];
  293 |     });
  294 | 
  295 |     await page.reload();
  296 | 
  297 |     // Navigate to specialists
  298 |     await page.click('a:has-text("👥")');
  299 | 
  300 |     // Type in search
  301 |     await page.fill('#specSearch', 'Олена');
  302 | 
  303 |     // Trigger filter
  304 |     await page.locator('#specSearch').evaluate((el: HTMLInputElement) => {
  305 |       el.dispatchEvent(new Event('input'));
  306 |     });
  307 | 
  308 |     // Wait a bit for filter to apply
  309 |     await page.waitForTimeout(100);
  310 | 
  311 |     // Table should still be visible (filter works client-side)
  312 |     await expect(page.locator('#specTable')).toBeVisible();
  313 |   });
  314 | });
  315 | 
```