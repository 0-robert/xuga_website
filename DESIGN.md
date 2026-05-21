# DESIGN.md — XUGA Towel Tales

## Direction

One committed direction: **sun-bleached, tactile, hand-made editorial**. Warm
and organic, like a well-loved towel left in the sun. Not a clean SaaS look.
Inherits XUGA's identity: navy bubble-letter wordmark, sandy backgrounds,
beach-confetti accents, sun and wave motifs.

Pattern: **scroll-triggered storytelling** — a story page is a sequence of
chapters, each with its own colour, building as the reader scrolls.

## Colour

OKLCH only. Never pure `#000` or `#fff`. Every neutral is tinted warm. Strategy
is full-palette: this is an identity-driven brand site, not a restrained UI.

```css
--sand:        oklch(0.972 0.018 78);   /* page background, warm cream    */
--sand-deep:   oklch(0.935 0.030 76);   /* recessed surfaces, towel bands */
--ink:         oklch(0.300 0.070 256);  /* primary text, deep sea navy    */
--ink-soft:    oklch(0.430 0.055 256);  /* secondary text                 */
--sun:         oklch(0.740 0.155 58);   /* warm coral-orange, default CTA */
--sea:         oklch(0.700 0.095 210);  /* teal, links and waves          */
--shell:       oklch(0.880 0.045 20);   /* soft pink, confetti            */
--lime:        oklch(0.830 0.130 130);  /* confetti green                 */
--grape:       oklch(0.560 0.130 300);  /* confetti purple                */
--paper:       oklch(0.995 0.010 80);   /* cards, lifted surfaces         */
--accent:      var(--sun);              /* per-garment override on /t/    */
```

Each story page overrides `--accent` from the garment's `accent` field so the
page feels like its towel. Confetti colours are used sparingly, as accents
only.

## Typography

Three roles, loaded from Google Fonts.

- **Display — Fraunces.** Chapter headings, garment names. Soft, optical,
  warm editorial serif. Weights 400 and 600, soft + slight wonk.
- **Hand — Caveat.** The towel's spoken greetings and pull-quotes. A warm
  handwriting face, used only for the towel's own words.
- **Body — Cabin.** All running text. Humanist sans, friendly, readable.

Type scale (ratio ~1.28): 0.84 / 1 / 1.28 / 1.6 / 2.1 / 2.7 / 3.6 rem.
Body line length capped at 66ch. Hierarchy via scale and weight, not colour.

## Layout

- Spacing scale: 4 8 12 16 24 32 48 64 96 px. Vary it for rhythm; never uniform.
- No identical card grids. Chapters are full-width bands, not cards.
- Content measure max 66ch for prose; full-bleed for imagery.
- Radii: 8px small, 18px medium, 999px pill.

## Elevation

Soft, low, warm-tinted shadows only. One scale:
`--lift-1: 0 1px 2px oklch(0.30 0.07 256 / 0.08)`,
`--lift-2: 0 8px 24px oklch(0.30 0.07 256 / 0.12)`. No hard black shadows.

## Motion

- Ease-out exponential: `--ease: cubic-bezier(0.22, 1, 0.36, 1)`. No bounce, no
  elastic.
- Story reveals 400-600ms (playful storytelling context allows longer).
  Micro-interactions 150-300ms. Exits ~70% of enter duration.
- Animate `transform`, `opacity`, `filter` only. Never layout properties.
- Every animation respects `prefers-reduced-motion`: reveals become instant,
  the towel's eyes stay open and still, counters show final values.

## Absolute bans (from impeccable)

No glassmorphism as decoration. No gradient text. No side-stripe borders. No
em dashes in any copy. No emoji as icons (use inline SVG).
