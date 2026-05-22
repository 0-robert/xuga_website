# XUGA Island Wear

The website for XUGA, a student-led brand in Malta that upcycles worn-out beach
towels into one-of-a-kind island wear.

Every garment carries a sewn-in code. Scan it and you reach that piece's
**Towel Tale**: a page where the original towel, given a voice, tells you where
it has been before it became the thing you are holding.

The site is a static Astro site. No server, no database, no running costs.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home |
| `/gallery/` | The collection and the range of pieces |
| `/tales/` | Index of every towel's story |
| `/t/<id>/` | One garment's story page (the QR destination) |
| `/about/` | The brand and the sustainability case |
| `/contact/` | How to reach XUGA |

## Requirements

- Node 20 or newer (built on Node 22+)
- npm

## Commands

```bash
npm install        # install dependencies (first time only)
npm run dev        # local dev server with hot reload
npm run build      # build the static site into dist/
npm run preview    # serve the built site locally
npm run qr         # generate a QR code for every garment
npm test           # run the unit tests (eco-impact, character tier)
```

## Adding a garment

The whole catalogue is plain Markdown. To add a piece you do not touch code:

1. Copy `src/content/towels/_template.md.example` to
   `src/content/towels/<piece-id>.md`.
2. Fill in the frontmatter and write the story. Field reference:
   [`docs/adding-a-story.md`](docs/adding-a-story.md).
3. Write the story in the towel's voice and run the humanizer pass:
   [`docs/towel-voice-guide.md`](docs/towel-voice-guide.md).
4. Add the images under `src/assets/garments/`.
5. Run `npm run qr` to mint the QR code for the new piece.

## QR codes

`npm run qr` reads every garment and writes, into `public/qr/`:

- one `.svg` and one `.png` QR per piece, pointing at `/t/<id>/`
- `qr-sheet.html`, a printable A4 sheet of every code for the workshop

The codes encode an absolute URL, so set the production domain before the final
print run:

```bash
QR_BASE_URL=https://your-domain.com npm run qr
QR_BASE_URL=https://your-domain.com npm run build
```

Without `QR_BASE_URL` the site falls back to the default origin in
`astro.config.mjs`.

A printed paper QR will not survive a wash. Use a woven or printed
care-label-style tag on the garment.

## The towel character

Each story page shows the towel as a character. It works in three tiers and
upgrades on its own as you add better assets, with no code changes. See
[`docs/towel-character-upgrade.md`](docs/towel-character-upgrade.md).

## Deploying

`npm run build` outputs a static site to `dist/`. Host it anywhere that serves
static files (Netlify, Vercel, GitHub Pages, Cloudflare Pages). Run `npm run qr`
before `npm run build` so the QR assets are included.

## Project layout

```
src/
  content/towels/   one Markdown file per garment
  content.config.ts garment schema (Zod)
  lib/              site config + tested logic (eco, character tier)
  components/       header, footer, towel character, story chapters
  layouts/          BaseLayout
  pages/            home, gallery, tales, about, contact, /t/[id]
  assets/           garment and towel images
scripts/generate-qr.mjs   QR generation
docs/                     content, character, and voice guides
```

## Docs

- [`docs/adding-a-story.md`](docs/adding-a-story.md) — every garment field
- [`docs/towel-voice-guide.md`](docs/towel-voice-guide.md) — how the towels talk
- [`docs/towel-character-upgrade.md`](docs/towel-character-upgrade.md) — eyes, video, Rive
- [`docs/superpowers/specs/`](docs/superpowers/specs/) — design spec
