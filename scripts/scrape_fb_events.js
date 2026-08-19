import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: 'en-US',
    timezoneId: 'America/Toronto'
  });
  const page = await context.newPage();
  
  console.log("Navigating to group events page...");
  await page.goto('https://www.facebook.com/groups/ukrainian.waterloo.wellington/events', { waitUntil: 'networkidle' });
  
  console.log("Extracting event links...");
  const eventLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="/events/"]'))
      .map(a => a.href)
      .filter(href => /\/events\/\d+/.test(href))
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 5); // Grab top 5 events to not take too long
  });
  
  console.log(`Found ${eventLinks.length} event links.`);
  
  const events = [];
  
  for (const link of eventLinks) {
    console.log(`Scraping event: ${link}`);
    try {
      const eventPage = await context.newPage();
      await eventPage.goto(link, { waitUntil: 'networkidle' });
      
      const data = await eventPage.evaluate(() => {
        const titleRaw = document.title;
        const title = titleRaw.replace(' | Facebook', '').trim();
        
        let img = document.querySelector('img[data-imgperflogname="profileCoverPhoto"]')?.src;
        if (!img) {
          const allImgs = Array.from(document.querySelectorAll('img'));
          for (let i of allImgs) {
            if (i.src.includes('scontent') || i.src.includes('fbcdn')) {
              if (i.width > 200 && i.height > 200) {
                img = i.src;
                break;
              }
            }
          }
        }
        
        const text = document.body.innerText;
        const match = text.match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+[A-Z][a-z]+\s+\d{1,2},\s+\d{4}\s+at\s+\d{1,2}:\d{2}\s*(?:AM|PM)[^\n]*/i);
        const date = match ? match[0] : '';
        
        return { title, img: img || '', date };
      });
      
      events.push({
        url: link.split('?')[0],
        title: data.title,
        date: data.date,
        image: data.img
      });
      
      await eventPage.close();
    } catch (err) {
      console.error(`Error scraping ${link}:`, err);
    }
  }
  
  await browser.close();
  
  const dataPath = path.join(__dirname, '..', 'data', 'events.json');
  fs.writeFileSync(dataPath, JSON.stringify(events, null, 2));
  console.log(`Saved ${events.length} events to ${dataPath}`);
})();
