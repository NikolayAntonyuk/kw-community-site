# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: crm.spec.ts >> CRM Panel E2E >> should display specialists table with data
- Location: tests/e2e/crm.spec.ts:129:7

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
  53  | 
  54  |     // App view should be visible
  55  |     await expect(page.locator('#appView')).toBeVisible();
  56  | 
  57  |     // Click specialists tab
  58  |     await page.click('a:has-text("👥")');
  59  |     await expect(page.locator('#tab-specialists')).toBeVisible();
  60  | 
  61  |     // Click emails tab
  62  |     await page.click('a:has-text("✉️")');
  63  |     await expect(page.locator('#tab-emails')).toBeVisible();
  64  | 
  65  |     // Click applications tab
  66  |     await page.click('a:has-text("📋")');
  67  |     await expect(page.locator('#tab-applications')).toBeVisible();
  68  | 
  69  |     // Click archived tab
  70  |     await page.click('a:has-text("📦")');
  71  |     await expect(page.locator('#tab-archived')).toBeVisible();
  72  | 
  73  |     // Click feedback tab
  74  |     await page.click('a:has-text("⚠️")');
  75  |     await expect(page.locator('#tab-feedback')).toBeVisible();
  76  |   });
  77  | 
  78  |   test('should open specialist modal and clear fields for new specialist', async ({ page }) => {
  79  |     await page.goto('/crm.html');
  80  | 
  81  |     // Set token to show app
  82  |     await page.evaluate(() => {
  83  |       localStorage.setItem('kw_token', 'test-token');
  84  |       (window as any).currentUser = { email: 'test@example.com' };
  85  |     });
  86  | 
  87  |     await page.reload();
  88  | 
  89  |     // Navigate to specialists tab
  90  |     await page.click('a:has-text("👥")');
  91  | 
  92  |     // Click add button
  93  |     await page.click('button:has-text("➕")');
  94  | 
  95  |     // Modal should be visible
  96  |     await expect(page.locator('#specModal')).toHaveCSS('display', 'flex');
  97  |     await expect(page.locator('#specModalTitle')).toContainText('Новий');
  98  | 
  99  |     // All fields should be empty for new specialist
  100 |     await expect(page.locator('#specName')).toHaveValue('');
  101 |     await expect(page.locator('#specEmail')).toHaveValue('');
  102 |     await expect(page.locator('#specPhone')).toHaveValue('');
  103 |   });
  104 | 
  105 |   test('should load dashboard with statistics', async ({ page }) => {
  106 |     await page.goto('/crm.html');
  107 | 
  108 |     // Set token
  109 |     await page.evaluate(() => {
  110 |       localStorage.setItem('kw_token', 'test-token');
  111 |       (window as any).currentUser = { email: 'test@example.com' };
  112 |     });
  113 | 
  114 |     await page.reload();
  115 | 
  116 |     // Dashboard should be visible by default
  117 |     await expect(page.locator('#tab-dashboard')).toBeVisible();
  118 | 
  119 |     // Stats should exist
  120 |     await expect(page.locator('#statSpec')).toBeVisible();
  121 |     await expect(page.locator('#statPending')).toBeVisible();
  122 |     await expect(page.locator('#statRejected')).toBeVisible();
  123 |     await expect(page.locator('#statEmails')).toBeVisible();
  124 | 
  125 |     // Stats table should exist
  126 |     await expect(page.locator('#dashApps')).toBeVisible();
  127 |   });
  128 | 
  129 |   test('should display specialists table with data', async ({ page }) => {
  130 |     await page.goto('/crm.html');
  131 | 
  132 |     // Set token
  133 |     await page.evaluate(() => {
  134 |       localStorage.setItem('kw_token', 'test-token');
  135 |       (window as any).currentUser = { email: 'test@example.com' };
  136 |       // Mock allSpecs with test data
  137 |       (window as any).allSpecs = [
  138 |         {
  139 |           id: '1',
  140 |           name: 'Тест Спеціаліст',
  141 |           category: 'IT',
  142 |           locationType: 'Toronto',
  143 |           status: 'approved',
  144 |           phone: '123-456',
  145 |           email: 'test@test.com'
  146 |         }
  147 |       ];
  148 |     });
  149 | 
  150 |     await page.reload();
  151 | 
  152 |     // Navigate to specialists
> 153 |     await page.click('a:has-text("👥")');
      |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  154 | 
  155 |     // Wait for table to be rendered
  156 |     const table = page.locator('#specTable');
  157 |     await expect(table).toBeVisible();
  158 | 
  159 |     // Should have edit and delete buttons
  160 |     await expect(page.locator('.actions button.edit')).toBeVisible();
  161 |     await expect(page.locator('.actions button.reject')).toBeVisible();
  162 |   });
  163 | 
  164 |   test('should display emails from API', async ({ page }) => {
  165 |     await page.goto('/crm.html');
  166 | 
  167 |     // Mock emails endpoint
  168 |     await page.route('/api/emails', async (route) => {
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
```