# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: crm.spec.ts >> CRM Panel E2E >> should load dashboard with statistics
- Location: tests/e2e/crm.spec.ts:105:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#tab-dashboard')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#tab-dashboard')

```

```yaml
- heading "⚡ KW CRM" [level=2]
- text: Email
- textbox "admin@example.com"
- text: Пароль
- textbox "••••••••"
- button "Увійти"
- text: ✅ Firebase модулі завантажені успішно! ❌ Користувач не авторизований
```

# Test source

```ts
  17  |     await page.goto('/crm.html');
  18  | 
  19  |     // Fill form with wrong credentials
  20  |     await page.locator('#loginEmail').fill('wrong@example.com');
  21  |     await page.locator('#loginPass').fill('wrongpass');
  22  | 
  23  |     // Mock Firebase error
  24  |     await page.route('https://identitytoolkit.googleapis.com/**', async (route) => {
  25  |       await route.fulfill({
  26  |         status: 400,
  27  |         contentType: 'application/json',
  28  |         body: JSON.stringify({
  29  |           error: { message: 'INVALID_LOGIN_CREDENTIALS' }
  30  |         })
  31  |       });
  32  |     });
  33  | 
  34  |     await page.click('button:has-text("Увійти")');
  35  | 
  36  |     // Wait for error message
  37  |     const errorMsg = page.locator('#loginError');
  38  |     await expect(errorMsg).toBeVisible({ timeout: 3000 });
  39  |     await expect(errorMsg).toContainText('Помилка');
  40  |   });
  41  | 
  42  |   test('should toggle between tabs in app view', async ({ page }) => {
  43  |     await page.goto('/crm.html');
  44  | 
  45  |     // Mock Firebase to show app without login
  46  |     await page.evaluate(() => {
  47  |       localStorage.setItem('kw_token', 'test-token');
  48  |       (window as any).currentUser = { email: 'test@example.com' };
  49  |     });
  50  | 
  51  |     // Reload to trigger showApp
  52  |     await page.reload();
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
> 117 |     await expect(page.locator('#tab-dashboard')).toBeVisible();
      |                                                  ^ Error: expect(locator).toBeVisible() failed
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
  153 |     await page.click('a:has-text("👥")');
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
```