import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 900 }, deviceScaleFactor: 3 });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.click('.twin-tabs button:nth-child(2)');
await page.waitForTimeout(1000);
// zoom around tool tip + marker (marker center ~686,527)
await page.screenshot({ path: 'shots/qa/tip-zoom.png', clip: { x: 520, y: 400, width: 280, height: 220 } });
console.log('done');
await browser.close();
