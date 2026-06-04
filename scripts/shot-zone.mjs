import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots/qa', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 900 }, deviceScaleFactor: 2 });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.click('.twin-tag.alarm');
await page.waitForTimeout(1000);
await page.click('.robot-quarantine-btn');
await page.waitForTimeout(6800);

const zones = await page.$$('.iso-zone');
for (let i = 0; i < Math.min(zones.length, 2); i++) {
  await zones[i].screenshot({ path: `shots/qa/zone-${i}.png` });
  console.log('ok zone', i);
}
await browser.close();
console.log('done');
