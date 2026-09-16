const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.route("**/api/feedback", (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }));
  await page.route("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js", (route) => {
      route.fulfill({
        contentType: 'application/javascript',
        body: `
          export const getAuth = () => ({});
          export const signInWithEmailAndPassword = async () => {};
          export const onAuthStateChanged = (auth, callback) => {
            callback({ uid: 'mock-admin', email: 'admin@example.com' });
            return () => {};
          };
          export const signOut = async () => {};
        `
      });
  });
  await page.route("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js", (route) => {
      route.fulfill({
        contentType: 'application/javascript',
        body: `
          export const collection = () => {};
          export const query = () => {};
          export const where = () => {};
          export const getDocs = async () => ({ empty: true, forEach: () => {} });
          export const getDoc = async () => ({ exists: () => false, data: () => ({}) });
          export const updateDoc = async () => {};
          export const doc = () => {};
          export const addDoc = async () => {};
          export const serverTimestamp = () => {};
          export const getFirestore = () => ({});
        `
      });
  });
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERR:', err.message));
  
  await page.goto('http://127.0.0.1:8080/admin.html');
  await page.waitForTimeout(2000);
  
  const hasEditApp = await page.evaluate(() => typeof window.editApp === 'function');
  console.log('hasEditApp:', hasEditApp);
  
  await browser.close();
})();
