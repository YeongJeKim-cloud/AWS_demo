import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 900 } });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const tabs = ['factory', 'inspection', 'isolation'];
for (let i = 0; i < 3; i++) {
  await page.click(`.twin-tabs button:nth-child(${i + 1})`);
  await page.waitForTimeout(500);
  const m = await page.evaluate(() => {
    const h2 = document.querySelector('.twin-title h2');
    const range = document.createRange();
    range.selectNodeContents(h2);
    const tr = range.getBoundingClientRect();
    const before = getComputedStyle(document.querySelector('.twin-title-frame'), '::before');
    return {
      text: h2.textContent,
      textWidth: Math.round(tr.width),
      textLeft: Math.round(tr.left),
      textRight: Math.round(tr.right),
    };
  });
  // trapezoid spans 568..1112 (=544px), box spans 480..1200
  console.log(tabs[i], JSON.stringify(m), '| trapezoid 568..1112');
}
await browser.close();
