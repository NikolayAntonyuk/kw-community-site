const fs = require('fs');
let content = fs.readFileSync('tests/e2e/admin.spec.ts', 'utf8');
content = content.replace("    await page.goto('/admin.html');\n    await page.waitForFunction(() => typeof window.saveEdit === 'function');", 
  "    await page.route('**/api/specialists', route => route.fulfill({ status: 200, body: '{}' }));\n" +
  "    await page.route('**/api/sync', route => route.fulfill({ status: 200, body: '{}' }));\n" +
  "    await page.goto('/admin.html');\n    await page.waitForFunction(() => typeof window.saveEdit === 'function');"
);
fs.writeFileSync('tests/e2e/admin.spec.ts', content);
