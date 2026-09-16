const fs = require('fs');
let content = fs.readFileSync('tests/e2e/crm.spec.ts', 'utf8');

// Add a beforeEach block to block firebase
content = content.replace("test.describe('CRM Panel E2E', () => {", 
"test.describe('CRM Panel E2E', () => {\n  test.beforeEach(async ({ page }) => {\n    await page.route('https://www.gstatic.com/firebasejs/**', route => route.abort());\n  });");

fs.writeFileSync('tests/e2e/crm.spec.ts', content);
