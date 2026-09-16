const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));
  await page.goto('http://127.0.0.1:8080/admin.html');
  const t = await page.evaluate(() => typeof window.openInaccuracyReport);
  console.log('TYPEOF:', t);
  await browser.close();
})();
