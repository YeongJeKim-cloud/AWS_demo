import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 900 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.click('.twin-tabs button:nth-child(3)');
await page.waitForTimeout(8000); // wait full sequence (all locks + SEQ-DONE)
const m = await page.evaluate(() => {
  const r = (el) => { if(!el) return null; const b=el.getBoundingClientRect(); return {top:Math.round(b.top),bottom:Math.round(b.bottom),left:Math.round(b.left),right:Math.round(b.right),h:Math.round(b.height)}; };
  const feed = document.querySelector('.iso-event-feed');
  const floor = document.querySelector('.factory-isolation-floor');
  const zones = [...document.querySelectorAll('.iso-zone')].map(z=>r(z));
  const lines = document.querySelectorAll('.iso-event-feed p').length;
  const tabs = document.querySelector('.twin-tabs');
  return { feed:r(feed), floor:r(floor), zone0:zones[0], zone1:zones[1], feedLines:lines, tabs:r(tabs), vh: window.innerHeight };
});
console.log(JSON.stringify(m,null,2));
await browser.close();
