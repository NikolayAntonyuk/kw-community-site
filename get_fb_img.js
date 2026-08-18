import { chromium } from '@playwright/test';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://facebook.com/events/1528321775242523/', { waitUntil: 'networkidle' });
  // find the image
  const imgUrl = await page.evaluate(() => {
    const img = document.querySelector('img[data-imgperflogname="profileCoverPhoto"]');
    if (img) return img.src;
    const allImgs = Array.from(document.querySelectorAll('img'));
    for (let i of allImgs) {
      if (i.src.includes('scontent') || i.src.includes('fbcdn')) {
        if (i.width > 200 && i.height > 200) return i.src;
      }
    }
    return null;
  });
  console.log("IMGURL:" + imgUrl);
  await browser.close();
})();
