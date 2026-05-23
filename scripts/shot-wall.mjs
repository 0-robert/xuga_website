import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1.5 });
await p.emulateMedia({ reducedMotion: 'reduce' });
await p.goto('http://localhost:4322/anywhere/', { waitUntil: 'networkidle' });
await p.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
  window.scrollTo(0, 0);
});
await p.waitForTimeout(600);
// Crop to just the wall area
const wall = await p.$('.board__wall');
await wall.scrollIntoViewIfNeeded();
await p.waitForTimeout(200);
await wall.screenshot({ path: 'screenshots/anywhere-wall.png' });
await b.close();
