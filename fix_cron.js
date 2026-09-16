const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const oldCron = `// Daily Facebook scraping (03:00 AM)
cron.schedule('0 3 * * *', async () => {
  console.log('Starting daily Facebook event scraping...');
  try {
    // Placeholder for actual scraping logic
    // In production, call your Playwright scraper here
    console.log('Facebook scraping completed');
  } catch (err) {
    console.error('Facebook scraping error:', err);
  }
});`;

const newCron = `// Daily Facebook scraping (midnight)
const { exec } = require('child_process');
cron.schedule('0 0 * * *', () => {
  console.log('Starting daily Facebook event scraping...');
  exec('node scripts/scrape_fb_events.js', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error(\`Facebook scraping execution error: \${error.message}\`);
      return;
    }
    if (stderr) {
      console.error(\`Facebook scraping stderr: \${stderr}\`);
    }
    console.log(\`Facebook scraping output:\\n\${stdout}\`);
  });
});`;

if (code.includes(oldCron)) {
  code = code.replace(oldCron, newCron);
  fs.writeFileSync('server.js', code);
  console.log("Fixed cron");
} else {
  console.log("Could not find old cron string");
}
