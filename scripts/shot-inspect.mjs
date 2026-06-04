import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 900 }, deviceScaleFactor: 2 });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2200);

// enter twin Robot Inspection (tab 2) via the factory alarm hotspot
await page.click('.twin-tag.alarm');
await page.waitForTimeout(1200);

const panel = await page.$('.robot-analysis-panel');
if (panel) await panel.screenshot({ path: 'shots/inspect-zoom.png' });
const cctv = await page.$('.cctv-live-card');
if (cctv) await cctv.screenshot({ path: 'shots/inspect-cctv.png' });
console.log('done');

await browser.close();
