import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { webkit } from 'playwright-core';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'output');
await mkdir(output, { recursive: true });

const browser = await webkit.launch({ headless: true });
const report = {};

try {
  for (const variant of ['desktop', 'tablet', 'mobile']) {
    const page = await browser.newPage({
      viewport: { width: 2250, height: 1000 },
      deviceScaleFactor: 1,
    });
    await page.goto(`${pathToFileURL(path.join(root, 'composition.html')).href}?variant=${variant}`);
    const checks = await page.evaluate(async () => {
      await Promise.all([document.fonts.load('400 52px Geist'), document.fonts.load('500 104px Albert')]);
      await document.fonts.ready;
      await Promise.all(Array.from(document.images, (img) => img.decode()));
      const frame = document.querySelector(`.${document.body.dataset.variant} .frame`);
      const rect = frame.getBoundingClientRect();
      const selectors = document.body.dataset.variant === 'mobile'
        ? ['.mobile .brand', '.mobile .channel', '.mobile .relation-label', '.mobile .source .card-heading', '.mobile .source .card-body', '.mobile .emulator .card-heading', '.mobile .emulator .card-body']
        : document.body.dataset.variant === 'tablet'
          ? ['.tablet .brand', '.tablet .source .ui-title', '.tablet .source-card', '.tablet .policy-copy', '.tablet .emulator .ui-title', '.tablet .prompt-card', '.tablet .emulator .response-card', '.tablet .match']
          : ['.desktop .brand', '.desktop .source .ui-title', '.desktop .source-card', '.desktop .preview-card', '.desktop .emulator .ui-title', '.desktop .prompt-card', '.desktop .emulator .response-card', '.desktop .retrieval', '.desktop .source-used'];
      const bounds = Object.fromEntries(selectors.map((selector) => {
        const element = document.querySelector(selector);
        const r = element.getBoundingClientRect();
        return [selector, { x: r.x, y: r.y, width: r.width, height: r.height }];
      }));
      return {
        canvas: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
        frame: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        fontsLoaded: document.fonts.check('400 52px Geist') && document.fonts.check('500 104px Albert'),
        imagesLoaded: Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
        bounds,
      };
    });
    if (checks.canvas.width !== 2250 || checks.canvas.height !== 1000 || !checks.fontsLoaded || !checks.imagesLoaded) {
      throw new Error(`${variant}: failed rendering prerequisites: ${JSON.stringify(checks)}`);
    }
    const { x, y, width, height } = checks.frame;
    if (x < 225 || y < 120 || x + width > 2025 || y + height > 880) {
      throw new Error(`${variant}: frame extends outside the essential-content safe area`);
    }
    for (const [selector, rect] of Object.entries(checks.bounds)) {
      if (rect.x < 225 || rect.y < 120 || rect.x + rect.width > 2025 || rect.y + rect.height > 880) {
        throw new Error(`${variant}: ${selector} extends outside the safe area`);
      }
    }
    await page.screenshot({ path: path.join(output, `wabrix-${variant}.png`), fullPage: false });
    report[variant] = checks;
    await page.close();
  }
} finally {
  await browser.close();
}

await writeFile(path.join(output, 'render-qa.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log('Rendered desktop, tablet, and mobile 2250x1000 PNGs.');
