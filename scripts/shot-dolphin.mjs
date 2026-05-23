import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1.25 });
p.on('console', m => console.log('PAGE:', m.type(), m.text()));
p.on('pageerror', e => console.log('PAGEERROR:', e.message));
await p.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
// scroll once to load lazy
await p.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); }
});
// now park at the bottom of the page so closing-section is fully in viewport
await p.evaluate(() => {
  const s = document.querySelector('.closing-section');
  s.scrollIntoView({ block: 'center' });
});
await p.waitForTimeout(300); // let observer fire
const t0 = Date.now();
const sample = async (delay, name) => {
  const wait = delay - (Date.now() - t0);
  if (wait > 0) await p.waitForTimeout(wait);
  // screenshot only the current viewport so timing across samples is consistent
  await p.screenshot({ path: `screenshots/dolphin-${name}.png` });
  console.log('shot', name, 'at', Date.now() - t0, 'ms');
};
await sample(50,   'a-50ms');
await sample(700,  'b-700ms');
await sample(1500, 'c-1500ms');
await sample(2900, 'd-2900ms');
await sample(4500, 'e-4500ms');
await sample(6500, 'f-6500ms');
await sample(8200, 'g-8200ms-end');
await b.close();
