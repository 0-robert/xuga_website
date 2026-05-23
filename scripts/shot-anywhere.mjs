import { chromium } from 'playwright';
const browser = await chromium.launch();
const BASE = 'http://localhost:4322';
const shots = [
  { name: 'anywhere-desktop', url: '/anywhere/', width: 1280 },
  { name: 'anywhere-mobile',  url: '/anywhere/', width: 390 },
  { name: 'home-desktop',     url: '/',          width: 1280 },
];
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.width, height: 900 }, deviceScaleFactor: 1.25 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(BASE + s.url, { waitUntil: 'networkidle' });
  // scroll the page to force any lazy images to load
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `screenshots/${s.name}.png`, fullPage: true });
  await page.close();
  console.log('shot', s.name);
}
await browser.close();
