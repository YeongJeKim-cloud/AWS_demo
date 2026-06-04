import { chromium } from 'playwright';

const browser = await chromium.launch();

const checkFactoryBackdrop = async (page) => page.evaluate(() => {
  const scene = document.querySelector('.factory-reference-scene');
  if (!scene) return { ok: false, reason: 'missing factory reference scene' };
  return {
    ok: getComputedStyle(scene).backgroundImage.includes('factory-reference-bg'),
    alarmHotspots: document.querySelectorAll('.factory-reference-scene .twin-tag.alarm').length,
    htmlAlarmHotspots: document.querySelectorAll('.twin-tag.alarm').length,
  };
});

const checkViewport = async (name, viewport) => {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);

  const factoryBackdrop = await checkFactoryBackdrop(page);
  await page.click('.twin-tag.alarm');
  await page.waitForSelector('.robot-inspection');
  await page.waitForTimeout(500);
  await page.click('.robot-quarantine-btn');
  await page.waitForSelector('.lot-isolation-scene');
  await page.waitForTimeout(6800);

  const state = await page.evaluate(() => ({
    tabClass: document.querySelector('.twin')?.className,
    titleOverlap: (() => {
      const title = document.querySelector('.twin-title h2')?.getBoundingClientRect();
      const right = document.querySelector('.twin-corner.right')?.getBoundingClientRect();
      if (!title || !right) return false;
      return !(title.right < right.left || right.right < title.left || title.bottom < right.top || right.bottom < title.top);
    })(),
    lockedZones: document.querySelectorAll('.iso-zone.locked').length,
    physicalLocks: document.querySelectorAll('.iso-zone.locked .iso-physical-lock').length,
  }));

  await page.screenshot({ path: `shots/verify-${name}.png`, fullPage: true });
  await page.close();
  return { name, viewport, factoryBackdrop, ...state };
};

const results = [
  await checkViewport('desktop', { width: 1680, height: 900 }),
  await checkViewport('mobile', { width: 390, height: 844 }),
];

await browser.close();

const failed = results.filter((r) => !r.factoryBackdrop.ok || r.factoryBackdrop.htmlAlarmHotspots < 1 || r.titleOverlap || !r.tabClass.includes('tab-isolation') || r.lockedZones < 5 || r.physicalLocks < 5);
console.log(JSON.stringify(results, null, 2));

if (failed.length) {
  throw new Error(`Twin verification failed: ${failed.map((r) => r.name).join(', ')}`);
}
