import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots/qa', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 900 }, deviceScaleFactor: 2 });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2200);

const shotEl = async (sel, name) => {
  const el = await page.$(sel);
  if (el) { await el.screenshot({ path: `shots/qa/${name}.png` }); console.log('ok', name); }
  else console.log('MISSING', sel);
};

// ---- Tab 1: Factory Overview ----
await shotEl('.twin', '1-factory-full');
await shotEl('.situation-left', '1-left');
await shotEl('.situation-right', '1-right');

// ---- Tab 2: Robot Inspection ----
await page.click('.twin-tag.alarm');
await page.waitForTimeout(1200);
await shotEl('.twin', '2-inspection-full');
await shotEl('.robot-status-strip', '2-statusstrip');
await shotEl('.cctv-live-card', '2-cctv');

// ---- Tab 3: Lot Isolation ----
await page.click('.robot-quarantine-btn');
await page.waitForTimeout(6800);
await shotEl('.twin', '3-isolation-full');
await shotEl('.iso-command', '3-command');
await shotEl('.factory-isolation-floor', '3-floor');
await shotEl('.iso-event-feed', '3-feed');

await browser.close();
console.log('done');
