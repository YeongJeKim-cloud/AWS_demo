import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('shots/qa', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 900 }, deviceScaleFactor: 2 });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.click('.twin-tabs button:nth-child(3)');
// mid-animation: ~2 zones held, rest running
await page.waitForTimeout(2600);
await page.screenshot({ path: 'shots/qa/iso-mid.png', clip: { x: 28, y: 250, width: 1624, height: 400 } });
// final state
await page.waitForTimeout(5000);
await page.screenshot({ path: 'shots/qa/iso-final-full.png', clip: { x: 0, y: 0, width: 1680, height: 900 } });
const zones = await page.$$('.iso-zone');
if (zones[0]) await zones[0].screenshot({ path: 'shots/qa/iso-zone0.png' });
await browser.close();
console.log('done');
