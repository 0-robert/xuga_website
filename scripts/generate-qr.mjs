/**
 * Generates one QR code per garment, plus a printable contact sheet.
 *
 *   node scripts/generate-qr.mjs
 *   QR_BASE_URL=https://your-domain npm run qr
 *
 * Each QR encodes the absolute URL of that garment's story page. Output lands
 * in public/qr/ as <id>.svg, <id>.png and qr-sheet.html. Run this before
 * `npm run build` whenever towels are added or the domain changes.
 */
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { SITE } from '../src/lib/site.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const towelsDir = path.join(root, 'src/content/towels');
const outDir = path.join(root, 'public/qr');

const baseUrl = (process.env.QR_BASE_URL ?? SITE.defaultBaseUrl).replace(
  /\/+$/,
  '',
);
if (!process.env.QR_BASE_URL) {
  console.warn(`! QR_BASE_URL is not set, using the default: ${baseUrl}`);
  console.warn('  Set it before the final print run so the codes are live.\n');
}

// Black on white, error-correction M: reliable scanning off a fabric tag.
const qrOptions = { errorCorrectionLevel: 'M', margin: 2 };

/** Pull simple top-level "key: value" pairs from a Markdown frontmatter block. */
function readFrontmatter(markdown) {
  const block = markdown.match(/^---\n([\s\S]*?)\n---/);
  const data = {};
  if (block) {
    for (const line of block[1].split('\n')) {
      const pair = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.+)$/);
      if (pair) data[pair[1]] = pair[2].trim();
    }
  }
  return data;
}

const files = (await readdir(towelsDir))
  .filter((f) => f.endsWith('.md'))
  .sort();

if (files.length === 0) {
  console.error('No garment files found in src/content/towels/.');
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const pieces = [];
for (const file of files) {
  const id = file.replace(/\.md$/, '');
  const fm = readFrontmatter(await readFile(path.join(towelsDir, file), 'utf8'));
  const url = `${baseUrl}/t/${id}/`;

  const svg = await QRCode.toString(url, { ...qrOptions, type: 'svg' });
  await writeFile(path.join(outDir, `${id}.svg`), svg, 'utf8');
  await QRCode.toFile(path.join(outDir, `${id}.png`), url, {
    ...qrOptions,
    width: 1024,
  });

  pieces.push({ id, url, name: fm.garmentName ?? id, towel: fm.towelName ?? '' });
  console.log(`  ${id}  ->  ${url}`);
}

const cells = pieces
  .map(
    (p) => `
    <figure class="cell">
      <img src="${p.id}.png" alt="QR code for ${p.name}" />
      <figcaption>
        <strong>${p.name}</strong>
        <span>${p.towel ? `${p.towel} &middot; ` : ''}${p.id}</span>
        <em>Scan to read the tale</em>
      </figcaption>
    </figure>`,
  )
  .join('');

const sheet = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>XUGA Towel Tales — QR contact sheet</title>
<style>
  @page { size: A4; margin: 12mm; }
  body { font-family: ui-sans-serif, system-ui, sans-serif; color: #21243f; margin: 0; }
  h1 { font-size: 16pt; margin: 0 0 2mm; }
  p.lead { margin: 0 0 8mm; color: #5b5f7a; font-size: 9pt; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8mm; }
  .cell { break-inside: avoid; text-align: center; border: 1px solid #e3ddca; border-radius: 4mm; padding: 5mm; margin: 0; }
  .cell img { width: 44mm; height: 44mm; display: block; margin: 0 auto 3mm; }
  figcaption strong { display: block; font-size: 10pt; }
  figcaption span { display: block; font-size: 7.5pt; color: #5b5f7a; margin-top: 1mm; }
  figcaption em { display: block; font-size: 7.5pt; color: #21243f; margin-top: 2mm; font-style: normal; font-weight: 600; }
</style>
</head>
<body>
  <h1>XUGA Towel Tales — QR tags</h1>
  <p class="lead">${pieces.length} pieces. Base URL: ${baseUrl}. Print, cut, and sew one tag into each garment.</p>
  <div class="grid">${cells}
  </div>
</body>
</html>
`;
await writeFile(path.join(outDir, 'qr-sheet.html'), sheet, 'utf8');

console.log(
  `\n${pieces.length} QR codes written to public/qr/ (svg + png).`,
);
console.log('Printable sheet: public/qr/qr-sheet.html');
