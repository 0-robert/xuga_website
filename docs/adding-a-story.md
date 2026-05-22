# Adding a new garment story

There are two ways to add a story. Most editors should use the first.

## Through the CMS (recommended for non-developers)

Go to https://xugawear.vercel.app/admin/, sign in, click **Tales → New Tale**,
fill in the fields, drop in photos, write the story, and click **Publish**.
The QR code is generated automatically on the next build. See
`docs/editing-the-site.md` for the full walkthrough.

The rest of this document describes the same process for a developer working
directly in the repo.

---

## Through the repo (for developers)

Every garment is one Markdown file. Adding a piece takes a few minutes and no
code. Here is the whole process.

## 1. Copy an existing story

Duplicate a file in `src/content/towels/` and rename it. The filename, without
`.md`, becomes the piece's ID, its URL, and its QR target. Use lowercase words
and hyphens, ending in a number:

```
src/content/towels/dolphin-belt-002.md
```

## 2. Add the photos

Put the images in `src/assets/garments/`. Each piece needs at least a finished
garment photo. A photo of the original towel is what gives it the talking-eyes
character, so include one whenever you can.

## 3. Fill in the frontmatter

The block between the `---` lines at the top of the file.

| Field | Required | What it is |
|---|---|---|
| `garmentType` | yes | One of: Belt bag, Shorts, Bucket hat, Pouch, Trousers, Other |
| `garmentName` | yes | Display title, e.g. "The Dolphin Belt Bag" |
| `garmentPhoto` | yes | Path to the finished-garment image |
| `towelName` | yes | The towel's character name, e.g. "Finn" |
| `madeDate` | yes | Date finished, `YYYY-MM-DD` |
| `greeting` | recommended | The towel's opening line, shown handwritten in the hero |
| `towelPhoto` | recommended | The original towel; powers the eyes character |
| `towelPersonality` | optional | A few words that steer the writing voice |
| `originPlace` | optional | Where the towel came from |
| `originType` | optional | donated, hotel, thrift, family, found, unknown |
| `originYearApprox` | optional | Loose era, e.g. "the mid-2010s" |
| `beforePhoto` / `afterPhoto` | optional | The before/after slider; default to towel and garment |
| `maker` | optional | Who sewed the piece |
| `accent` | optional | Page accent colour in OKLCH, e.g. `oklch(0.68 0.12 215)` |
| `eyes` | optional | `{ x, y, scale }` to place the eyes on the towel photo (percentages) |
| `featured` | optional | `true` shows it on the home page |
| `editionNote` | optional | Defaults to "1 of 1" |
| `ecoTowelWeightGrams` | optional | Towel weight; the eco chapter is estimated from it |
| `ecoWaterSavedLitres` / `ecoCo2SavedKg` / `ecoTextileSavedGrams` | optional | Explicit eco overrides instead of estimates |

Any optional field can be left out. A missing field simply removes its part of
the page; nothing breaks. If a piece has no `towelPhoto`, `towelVideo` or
`towelRive`, the page renders without a character.

## 4. Write the story

Everything below the closing `---` is the towel's origin story, in its own
voice. Read `towel-voice-guide.md` first, then **run the draft through the
humanizer skill** before saving. This is not optional. The voice is the point.

## 5. Generate the QR code

```
npm run qr
```

This writes a new QR code to `public/qr/` and refreshes the printable sheet at
`public/qr/qr-sheet.html`. Set the real domain first:

```
QR_BASE_URL=https://your-domain npm run qr
```

## 6. Build and deploy

```
npm run build
```

Upload `dist/`. The new story is live at `/t/<id>/`.
