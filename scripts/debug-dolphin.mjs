import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
p.on('console', m => console.log('PAGE:', m.type(), m.text().slice(0, 200)));
p.on('pageerror', e => console.log('ERROR:', e.message));
p.on('requestfailed', r => console.log('FAIL:', r.url(), r.failure()?.errorText));
await p.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
await p.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); }
});
const info = await p.evaluate(() => {
  return {
    gsap: typeof gsap,
    motionPath: typeof MotionPathPlugin,
    dolphin: !!document.querySelector('.closing-dolphin .dolphin-img'),
    section: !!document.querySelector('.closing-section'),
    splash1: !!document.querySelector('.dolphin-splash--1'),
    splash2: !!document.querySelector('.dolphin-splash--2'),
    pathInjected: !!document.getElementById('dolphinPath'),
    dolphinStyle: (() => {
      const el = document.querySelector('.closing-dolphin .dolphin-img');
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { transform: cs.transform.slice(0, 80), opacity: cs.opacity, display: cs.display, visibility: cs.visibility };
    })(),
  };
});
console.log('STATE:', JSON.stringify(info, null, 2));
await p.evaluate(() => {
  const s = document.querySelector('.closing-section');
  s.scrollIntoView({ block: 'center' });
});
await p.waitForTimeout(2500);
const info2 = await p.evaluate(() => {
  const el = document.querySelector('.closing-dolphin .dolphin-img');
  if (!el) return null;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return { transform: cs.transform.slice(0, 100), opacity: cs.opacity, rect: { x: r.x, y: r.y, w: r.width, h: r.height } };
});
console.log('AFTER 2.5s:', JSON.stringify(info2, null, 2));
await b.close();
