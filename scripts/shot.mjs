import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 900 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2200);

const shot = async (name) => {
  const el = await page.$('.twin');
  if (el) await el.screenshot({ path: `shots/${name}.png` });
  else await page.screenshot({ path: `shots/${name}.png` });
  console.log('shot', name);
};

await shot('demo-1-factory');

await page.click('.twin-tag.alarm');
await page.waitForTimeout(1000);
await shot('demo-2-inspection');

await page.click('.robot-quarantine-btn');
await page.waitForTimeout(6800);
await shot('demo-3-isolation');

await browser.close();
console.log('done');
