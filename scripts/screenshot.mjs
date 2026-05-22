/**
 * Dev helper: captures full-page screenshots of the site for visual review.
 * Run `npm run preview` (or `npm run dev`) first, then `node scripts/screenshot.mjs`.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.SHOT_BASE ?? 'http://localhost:4321';
await mkdir('screenshots', { recursive: true });

const shots = [
  { name: '1-home-desktop', url: '/', width: 1280 },
  { name: '2-story-desktop', url: '/t/dolphin-belt-001/', width: 1280 },
  { name: '3-tales-desktop', url: '/tales/', width: 1280 },
  { name: '4-about-desktop', url: '/about/', width: 1040 },
  { name: '5-gallery-desktop', url: '/gallery/', width: 1280 },
  { name: '6-contact-desktop', url: '/contact/', width: 1040 },
  { name: '7-home-mobile', url: '/', width: 390 },
  { name: '8-story-mobile', url: '/t/hotel-bucket-001/', width: 390 },
  { name: '9-gallery-mobile', url: '/gallery/', width: 390 },
];

const browser = await chromium.launch();

for (const s of shots) {
  const page = await browser.newPage({
    viewport: { width: s.width, height: 900 },
    deviceScaleFactor: 1.5,
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // Retry until the preview server is up.
  let loaded = false;
  for (let i = 0; i < 20 && !loaded; i++) {
    try {
      await page.goto(BASE + s.url, { waitUntil: 'networkidle', timeout: 8000 });
      loaded = true;
    } catch {
      await page.waitForTimeout(800);
    }
  }

  // Scroll through so lazy images and fonts settle, then return to the top.
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        let y = 0;
        const timer = setInterval(() => {
          window.scrollBy(0, window.innerHeight);
          y += window.innerHeight;
          if (y >= document.body.scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 80);
      }),
  );
  await page.waitForTimeout(700);

  await page.screenshot({
    path: `screenshots/${s.name}.png`,
    fullPage: true,
  });
  await page.close();
  console.log('captured', s.name);
}

await browser.close();
