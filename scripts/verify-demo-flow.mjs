import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 900 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
await page.locator('.twin').screenshot({ path: 'shots/demo-1-factory.png' });

await page.click('.twin-tag.alarm');
await page.waitForSelector('.robot-inspection');
await page.waitForTimeout(800);
await page.locator('.twin').screenshot({ path: 'shots/demo-2-inspection.png' });

const inspection = await page.evaluate(() => ({
  hasBg: getComputedStyle(document.querySelector('.robot-photo-bg')).backgroundImage.includes('robot-tightening-bg'),
  curveCards: document.querySelectorAll('.robot-curve-card').length,
  pins: document.querySelectorAll('.robot-curve-pin').length,
  cctv: Boolean(document.querySelector('.cctv-live-screen')),
  cctvFeed: getComputedStyle(document.querySelector('.cctv-live-screen')).backgroundImage.includes('robot-tightening-bg'),
  quarantineButton: Boolean(document.querySelector('.robot-quarantine-btn')),
}));

await page.click('.robot-quarantine-btn');
await page.waitForSelector('.lot-isolation-scene');
await page.waitForTimeout(6800);
await page.locator('.twin').screenshot({ path: 'shots/demo-3-isolation.png' });

const isolation = await page.evaluate(() => ({
  traceActive: document.querySelectorAll('.iso-trace-chain .active').length,
  lockedZones: document.querySelectorAll('.iso-zone.locked').length,
  physicalLocks: document.querySelectorAll('.iso-zone.locked .iso-physical-lock').length,
  laserLines: document.querySelectorAll('.iso-zone.locked .iso-laser').length,
  stamps: document.querySelectorAll('.iso-zone.locked .iso-stamp').length,
  feedLines: document.querySelectorAll('.iso-event-feed p').length,
}));

await browser.close();

const result = { inspection, isolation };
console.log(JSON.stringify(result, null, 2));

if (
  !inspection.hasBg
  || inspection.curveCards < 2
  || inspection.pins < 6
  || !inspection.cctv
  || !inspection.cctvFeed
  || !inspection.quarantineButton
  || isolation.traceActive < 6
  || isolation.lockedZones < 5
  || isolation.physicalLocks < 5
  || isolation.laserLines < 15
  || isolation.stamps < 5
  || isolation.feedLines < 6
) {
  throw new Error('Demo flow verification failed');
}
