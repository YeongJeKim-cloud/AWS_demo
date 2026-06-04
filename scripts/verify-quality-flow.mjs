import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 920 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });

await page.click('.device-alarm-entry button');
await page.waitForSelector('.alarm-row');
await page.click('.alarm-row');
await page.waitForSelector('.modal-card');

const modalState = await page.evaluate(() => ({
  normalCallouts: document.querySelectorAll('.torque-col.normal .torque-callout').length,
  badCallouts: document.querySelectorAll('.torque-col.bad .torque-callout').length,
  hasOperatorNote: Boolean(document.querySelector('.operator-note')),
  title: document.querySelector('.modal-head h3')?.textContent,
}));

await page.screenshot({ path: 'shots/quality-modal.png', fullPage: true });
await page.click('.btn-decision.quarantine');
await page.waitForSelector('.quarantine-panel');
await page.waitForTimeout(6800);

const quarantineState = await page.evaluate(() => ({
  traceNodes: document.querySelectorAll('.lts-node.active').length,
  isolatedNodes: document.querySelectorAll('.qnode.revealed:not(.clear)').length,
  clearNodes: document.querySelectorAll('.qnode.revealed.clear').length,
  done: Boolean(document.querySelector('.qlog-line.done')),
  mapIsolated: document.querySelectorAll('.eq-tile.state-isolated').length,
  mapClear: document.querySelectorAll('.eq-tile.state-clear').length,
}));

await page.screenshot({ path: 'shots/quality-quarantine.png', fullPage: true });
await browser.close();

const result = { modalState, quarantineState };
console.log(JSON.stringify(result, null, 2));

if (
  modalState.normalCallouts < 3
  || modalState.badCallouts < 3
  || !modalState.hasOperatorNote
  || quarantineState.traceNodes < 6
  || quarantineState.isolatedNodes < 4
  || quarantineState.clearNodes < 1
  || quarantineState.mapIsolated < 4
  || quarantineState.mapClear < 1
) {
  throw new Error('Quality flow verification failed');
}
