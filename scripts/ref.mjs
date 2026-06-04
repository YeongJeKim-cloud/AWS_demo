import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots', { recursive: true });
const URL = 'https://endemo.finereport.com/webroot/decision/view/duchamp?viewlet=fvs%252FSmart%2BFactory%2BOperation%2Band%2BControl%2BPlatform%252FSmart%2BFactory%2BOperation%2Band%2BControl%2BPlatform11.fvs&ref_t=design&ref_c=b60039ab-a5c6-4589-b527-98f59787ac3a&page_number=1';

const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
p.on('console', (m) => { if (m.type() === 'error') console.log('PAGE-ERR', m.text().slice(0, 120)); });
try {
  await p.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
} catch (e) { console.log('goto:', e.message); }

for (const s of [6, 12, 20]) {
  await p.waitForTimeout(s * 1000 - (s === 6 ? 0 : (s === 12 ? 6000 : 12000)));
  await p.screenshot({ path: `shots/ref_${s}s.png` });
  console.log('captured at', s, 's');
}
console.log('title:', await p.title());
await b.close();
console.log('done');
