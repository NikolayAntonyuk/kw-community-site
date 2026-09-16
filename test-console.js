const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));
  
  await page.route('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js', async route => {
    route.fulfill({
      contentType: 'application/javascript',
      body: `
        export const collection = () => {};
        export const query = () => {};
        export const where = () => {};
        export const getDocs = async () => ({ empty: true });
        export const updateDoc = async () => {};
        export const doc = () => {};
        export const addDoc = async () => {};
        export const getDoc = async () => ({});
        export const getFirestore = () => ({});
        export const serverTimestamp = () => ({});
      `
    });
  });
  
  await page.goto('http://127.0.0.1:8080/admin.html');
  await page.waitForTimeout(2000);
  await browser.close();
})();
