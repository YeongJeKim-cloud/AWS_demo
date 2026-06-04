import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('shots/qa', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 900 }, deviceScaleFactor: 2 });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.click('.twin-tabs button:nth-child(2)'); // Robot Inspection
await page.waitForTimeout(1000);

// left portion (robot + target marker), avoiding the right analysis panel
await page.screenshot({ path: 'shots/qa/target-left.png', clip: { x: 0, y: 80, width: 960, height: 760 } });

const m = await page.evaluate(() => {
  const t = document.querySelector('.tightening-target');
  const insp = document.querySelector('.robot-inspection');
  const tr = t.getBoundingClientRect();
  const ir = insp.getBoundingClientRect();
  return {
    markerCenterX: Math.round(tr.left + tr.width / 2),
    markerCenterY: Math.round(tr.top + tr.height / 2),
    inspW: Math.round(ir.width), inspH: Math.round(ir.height),
    markerPctX: ((tr.left + tr.width / 2 - ir.left) / ir.width * 100).toFixed(1),
    markerPctY: ((tr.top + tr.height / 2 - ir.top) / ir.height * 100).toFixed(1),
  };
});
console.log(JSON.stringify(m));
await browser.close();
