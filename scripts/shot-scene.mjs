import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('shots/qa', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 900 }, deviceScaleFactor: 2 });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2200);
// factory overview is default (tab 1). Capture center scene region between side panels.
await page.screenshot({ path: 'shots/qa/scene.png', clip: { x: 250, y: 80, width: 1180, height: 760 } });
console.log('done');
await browser.close();
