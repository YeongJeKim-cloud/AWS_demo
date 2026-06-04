import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots/qa', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 900 }, deviceScaleFactor: 2 });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

const clipTop = async (name) => {
  await page.screenshot({ path: `shots/qa/${name}.png`, clip: { x: 0, y: 0, width: 1680, height: 120 } });
  console.log('ok', name);
};

await clipTop('title-1');

// tab 2 via tab button
await page.click('.twin-tabs button:nth-child(2)');
await page.waitForTimeout(900);
await clipTop('title-2');

// tab 3 via tab button
await page.click('.twin-tabs button:nth-child(3)');
await page.waitForTimeout(900);
await clipTop('title-3');

await browser.close();
console.log('done');
