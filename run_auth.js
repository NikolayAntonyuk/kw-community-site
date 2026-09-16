const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.route("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js", (route) => {
      route.continue();
  });
  await page.goto('http://127.0.0.1:8080/admin.html?id=39');
  await page.waitForTimeout(2000);
  await browser.close();
})();
