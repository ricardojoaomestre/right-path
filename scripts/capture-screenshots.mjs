import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const baseUrl = process.env.APP_URL ?? 'http://127.0.0.1:4173';
const outDir = fileURLToPath(new URL('../docs/screenshots/', import.meta.url));
const shot = (name) => `${outDir}/${name}`;

async function extractPath(page) {
  return page.evaluate(() => {
    const parse = (label) => {
      const match = label.match(/([A-Z])(\d+)/);
      if (!match) return null;
      return {
        col: match[1].charCodeAt(0) - 65,
        row: Number.parseInt(match[2], 10) - 1,
        label: `${match[1]}${match[2]}`,
      };
    };

    const cells = [...document.querySelectorAll('.tile--highlighted, .tile--start, .tile--end')]
      .map((el) => parse(el.getAttribute('aria-label') ?? ''))
      .filter(Boolean);

    const key = (cell) => `${cell.row},${cell.col}`;
    const lookup = new Map(cells.map((cell) => [key(cell), cell]));
    const start = cells.find((cell) =>
      document.querySelector(`[aria-label="Entry tile ${cell.label}"]`),
    );

    if (!start) return [];

    const path = [start];
    const visited = new Set([key(start)]);
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    while (path.length < cells.length) {
      const current = path[path.length - 1];
      let next = null;

      for (const [dr, dc] of dirs) {
        const candidate = { row: current.row + dr, col: current.col + dc };
        const candidateKey = key(candidate);
        if (lookup.has(candidateKey) && !visited.has(candidateKey)) {
          next = lookup.get(candidateKey);
          break;
        }
      }

      if (!next) break;
      path.push(next);
      visited.add(key(next));
    }

    return path.map((cell) => cell.label);
  });
}

async function clickTile(page, label) {
  await page
    .locator(
      `button[aria-label="Entry tile ${label}"], button[aria-label="Exit tile ${label}"], button[aria-label="Tile ${label}"]`,
    )
    .first()
    .click();
}

async function openDifficultyMenu(page) {
  await page.goto(baseUrl, { waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('.screen--splash', { state: 'visible', timeout: 60000 });
  await page.waitForTimeout(800);
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 932 } });

await openDifficultyMenu(page);
await page.screenshot({ path: shot('splash.png'), fullPage: true });

await page.getByRole('button', { name: 'Play' }).click();
await page.waitForSelector('.difficulty-options', { state: 'visible', timeout: 10000 });
await page.waitForTimeout(300);
await page.screenshot({ path: shot('menu.png'), fullPage: true });

await page.getByRole('radio', { name: /Easy/i }).click();
await page.getByRole('button', { name: 'Start Game' }).click();
await page.waitForSelector('.board', { timeout: 10000 });
await page.waitForTimeout(1000);
await page.screenshot({ path: shot('path-reveal.png'), fullPage: true });

await page.waitForFunction(
  () => document.querySelector('button.btn--token:not([disabled])'),
  { timeout: 20000 },
);
await page.waitForTimeout(300);

let path = [];
for (let attempt = 0; attempt < 24; attempt += 1) {
  path = await extractPath(page);
  if (path.length > 1) break;
  await page.waitForTimeout(250);
}

if (path.length <= 1) {
  await page.getByRole('button', { name: /Use Token/i }).click();
  await page.waitForTimeout(4500);
  path = await extractPath(page);
}

if (path.length <= 1) {
  throw new Error('Could not extract path for victory screenshot');
}

await page.screenshot({ path: shot('gameplay.png'), fullPage: true });

for (const label of path) {
  await clickTile(page, label);
  await page.waitForTimeout(100);
}

await page.waitForSelector('.modal__title--win', { timeout: 10000 });
await page.waitForTimeout(400);
await page.screenshot({ path: shot('victory.png'), fullPage: true });

await browser.close();
console.log('Screenshots saved to docs/screenshots');
