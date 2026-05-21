# XUGA Towel Tales Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Astro microsite where every upcycled XUGA garment carries a QR code that opens an animated story page narrated by the original towel.

**Architecture:** Astro static site. Each garment is one Markdown file in a content collection validated by Zod. One story-page template builds one static page per garment. Pure logic (eco-impact, character-tier selection) lives in tested `src/lib` modules. A Node script generates one QR per garment plus a printable contact sheet. No backend.

**Tech Stack:** Astro 5, Tailwind CSS v4, TypeScript, Zod (Astro content collections), Vitest (logic tests), Motion One (orchestrated animation), `qrcode` (QR generation), Node 22+, npm.

Spec: `docs/superpowers/specs/2026-05-21-xuga-towel-tales-design.md`

---

## File Structure

```
package.json, astro.config.mjs, tsconfig.json, vitest.config.ts
PRODUCT.md, DESIGN.md, README.md
src/
  content.config.ts          content collection + Zod schema
  content/towels/*.md         one file per garment (frontmatter + story body)
  lib/site.ts                 site config: base URL, brand defaults
  lib/eco.ts                  eco-impact computation (tested)
  lib/character-tier.ts       towel-character tier selection (tested)
  styles/global.css           Tailwind import + OKLCH design tokens
  layouts/BaseLayout.astro
  components/SiteHeader.astro, SiteFooter.astro
  components/TowelEyes.astro       Tier 1 SVG eyes
  components/TowelCharacter.astro  tier dispatch (eyes / video / rive)
  components/Chapter.astro         scroll-reveal chapter wrapper
  components/BeforeAfter.astro     scroll-scrubbed before/after reveal
  components/EcoCounter.astro      count-up eco stat
  components/StickyTowel.astro     persistent companion
  pages/index.astro, tales.astro, about.astro
  pages/t/[id].astro               story page template
scripts/generate-qr.mjs
public/images/...                  garment + towel photos
public/qr/...                      generated QR output
tests/eco.test.ts, tests/character-tier.test.ts
docs/adding-a-story.md, docs/towel-character-upgrade.md, docs/towel-voice-guide.md
```

---

## Task 1: Project scaffold

**Files:** Create `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `src/pages/index.astro` (temporary).

- [ ] Run `npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --yes`
- [ ] Install deps: `npm install` then `npm install tailwindcss @tailwindcss/vite motion qrcode` and `npm install -D vitest`
- [ ] Add the Tailwind Vite plugin to `astro.config.mjs`; add `@import "tailwindcss";` to `src/styles/global.css`
- [ ] Add npm scripts: `"qr": "node scripts/generate-qr.mjs"`, `"test": "vitest run"`
- [ ] Verify: `npm run dev` serves a page at localhost without error; `npm run build` succeeds.
- [ ] Commit: `chore: scaffold Astro + Tailwind project`

## Task 2: Brand context (impeccable + ui-ux-pro-max)

**Files:** Create `PRODUCT.md`, `DESIGN.md`.

- [ ] Run `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "sustainable handmade fashion brand storytelling playful beachy" --design-system -f markdown` and keep the palette/type/style guidance.
- [ ] Write `PRODUCT.md` (impeccable brand register): users (XUGA buyers, gift-givers, market visitors), brand voice (warm, handmade, Maltese, sustainable), `register: brand`, anti-references (generic SaaS, fast-fashion gloss).
- [ ] Write `DESIGN.md`: OKLCH palette (sun-bleached cream base, deep sea navy, warm coral, accent set), type pairing, spacing rhythm, motion rules (ease-out exponential, no bounce). No `#000`/`#fff`, no em dashes, no gradient text.
- [ ] Commit: `docs: add PRODUCT.md and DESIGN.md brand context`

## Task 3: Design tokens

**Files:** Modify `src/styles/global.css`.

- [ ] Define CSS custom properties in `:root` for the OKLCH palette from DESIGN.md, a type scale (≥1.25 ratio between steps), spacing scale, radii, and a `--accent` variable that story pages override per garment.
- [ ] Add base layer: tinted-neutral background, body font, `prefers-reduced-motion` reset for animations.
- [ ] Verify: `npm run build` succeeds; index page shows the tinted background.
- [ ] Commit: `feat: add OKLCH design tokens and base styles`

## Task 4: Content collection + Zod schema

**Files:** Create `src/content.config.ts`.

- [ ] Define collection `towels` with a glob loader over `src/content/towels/*.md` and this Zod schema (required: `garmentType` enum, `garmentName`, `garmentPhoto` image, `towelName`, `madeDate`; optional: `towelPersonality`, `towelPhoto`, `towelVideo` `{src,poster}`, `towelRive` `{src,stateMachine}`, `originPlace`, `originType` enum, `originYearApprox`, `beforePhoto`, `afterPhoto`, `maker`, `gallery`, `editionNote` default `"1 of 1"`, `accent`, `ecoTowelWeightGrams`, `ecoWaterSavedLitres`, `ecoCo2SavedKg`, `ecoTextileSavedGrams`). The entry `id` comes from the filename.
- [ ] Verify: `npm run build` succeeds with an empty collection.
- [ ] Commit: `feat: add towels content collection schema`

## Task 5: Eco-impact module (TDD)

**Files:** Create `src/lib/eco.ts`, `tests/eco.test.ts`, `vitest.config.ts`.

- [ ] **Write failing tests** in `tests/eco.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { computeEco } from '../src/lib/eco';

describe('computeEco', () => {
  it('returns null when no inputs given', () => {
    expect(computeEco({})).toBeNull();
  });
  it('estimates water and co2 from towel weight', () => {
    const r = computeEco({ towelWeightGrams: 600 })!;
    expect(r.textileSavedGrams).toBe(600);
    expect(r.waterSavedLitres).toBe(6000);   // 10 L per gram
    expect(r.co2SavedKg).toBe(9);            // 0.015 kg per gram
    expect(r.estimated).toBe(true);
  });
  it('uses explicit overrides when provided', () => {
    const r = computeEco({ towelWeightGrams: 600, ecoWaterSavedLitres: 8000 })!;
    expect(r.waterSavedLitres).toBe(8000);
  });
});
```

- [ ] Run `npm test` — expect FAIL (module not found).
- [ ] **Implement** `src/lib/eco.ts`: `EcoInput`/`EcoImpact` types; `computeEco` returns `null` when `towelWeightGrams` and all overrides are absent; constants `WATER_LITRES_PER_GRAM = 10`, `CO2_KG_PER_GRAM = 0.015` with a comment citing average new-cotton production; water rounded to integer, co2 rounded to 1 decimal.
- [ ] Run `npm test` — expect PASS.
- [ ] Commit: `feat: add tested eco-impact computation`

## Task 6: Character-tier module (TDD)

**Files:** Create `src/lib/character-tier.ts`, `tests/character-tier.test.ts`.

- [ ] **Write failing tests**:

```ts
import { describe, it, expect } from 'vitest';
import { selectTier } from '../src/lib/character-tier';

describe('selectTier', () => {
  it('returns null with no assets', () => {
    expect(selectTier({})).toBeNull();
  });
  it('prefers eyes when only a photo exists', () => {
    expect(selectTier({ towelPhoto: {} })).toBe('eyes');
  });
  it('prefers video over photo', () => {
    expect(selectTier({ towelPhoto: {}, towelVideo: { src: 'a.mp4' } })).toBe('video');
  });
  it('prefers rive over everything', () => {
    expect(selectTier({ towelPhoto: {}, towelVideo: { src: 'a.mp4' }, towelRive: { src: 'a.riv' } })).toBe('rive');
  });
});
```

- [ ] Run `npm test` — expect FAIL.
- [ ] **Implement** `src/lib/character-tier.ts`: `CharacterTier = 'rive' | 'video' | 'eyes'`; `selectTier` checks rive, then video, then photo, returns `null` if none.
- [ ] Run `npm test` — expect PASS.
- [ ] Commit: `feat: add tested towel-character tier selection`

## Task 7: Example garment content + images

**Files:** Create `src/content/towels/dolphin-belt-001.md`, `rainbow-shorts-001.md`, `hotel-bucket-001.md`; add images under `public/images/`.

- [ ] Place garment/towel images in `public/images/` (real XUGA photos from `extracted_assets/`, plus any AI-generated polished shots supplied by the user).
- [ ] Write the three Markdown files: full frontmatter, and a story body in the **warm & sentimental** voice. Dolphin belt bag = "Finn" (use the approved sample). Rainbow shorts and hotel bucket hat get their own warm characters; the hotel bucket hat uses the branded hotel towel for strong provenance.
- [ ] Run each story through the **humanizer skill**: draft, then "what makes the below so obviously AI generated?", then final revision. No em dashes, no "plot twist", no clipped punch fragments, no rule of three.
- [ ] Verify: `npm run build` succeeds; schema validates all three.
- [ ] Commit: `content: add three example garment stories`

## Task 8: Layout, header, footer

**Files:** Create `src/layouts/BaseLayout.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/lib/site.ts`.

- [ ] `src/lib/site.ts`: export `SITE` with `baseUrl` (from `import.meta.env.QR_BASE_URL` or a documented default), brand name, shop URL, Instagram `@xuga_mlt`, email `xuga.islandwear@gmail.com`.
- [ ] `BaseLayout.astro`: `<head>` with viewport meta, fonts, per-page `title`/`description`/`accent` props (sets `--accent`), `prefers-reduced-motion` respected; slots for header/main/footer.
- [ ] `SiteHeader`/`SiteFooter`: XUGA wordmark, nav (Home, Tales, About), footer with shop/Instagram links and "every XUGA piece has a tale".
- [ ] Verify: dev server renders header/footer on the index page.
- [ ] Commit: `feat: add base layout, header, footer`

## Task 9: Towel character component

**Files:** Create `src/components/TowelEyes.astro`, `src/components/TowelCharacter.astro`.

- [ ] `TowelEyes.astro`: Tier 1. Renders the towel photo with two SVG eyes overlaid. Client script: idle blink (randomized interval), pupils track scroll progress and pointer, a squash "speaking" beat triggerable via a data attribute. Disabled under `prefers-reduced-motion` (eyes stay open, no motion).
- [ ] `TowelCharacter.astro`: props `{ tier, towelName, photo?, video?, rive? }`. Uses `selectTier` from `src/lib/character-tier.ts`. Renders `TowelEyes` for `eyes`, a looping muted `<video>` for `video`, a Rive canvas mount point for `rive`, nothing if tier is `null`. `alt`/`aria-label` from `towelName`.
- [ ] Verify: a scratch page renders Finn's photo with blinking eyes.
- [ ] Commit: `feat: add media-agnostic towel character component`

## Task 10: Story chapter components

**Files:** Create `src/components/Chapter.astro`, `BeforeAfter.astro`, `EcoCounter.astro`, `StickyTowel.astro`.

- [ ] `Chapter.astro`: section wrapper with a scroll-reveal entrance (CSS scroll-driven animation with IntersectionObserver fallback), props for chapter label/heading.
- [ ] `BeforeAfter.astro`: props `before`/`after` images; a scroll-scrubbed or drag reveal between the two; reduced-motion fallback shows both side by side.
- [ ] `EcoCounter.astro`: props `value`, `label`, `unit`; counts up from 0 when scrolled into view; reduced-motion shows the final value immediately.
- [ ] `StickyTowel.astro`: small fixed-corner instance of `TowelCharacter` that reacts on scroll; hidden on small screens if it crowds content.
- [ ] Verify: scratch page renders each component without console errors.
- [ ] Commit: `feat: add story chapter components`

## Task 11: Story page template

**Files:** Create `src/pages/t/[id].astro`.

- [ ] `getStaticPaths` over the `towels` collection; one page per garment.
- [ ] Compose the five chapters from the spec: Meet the towel (hero + `TowelCharacter`), My first life (origin), The transformation (`BeforeAfter` + maker/date), What I saved (`EcoCounter` via `computeEco`; omit chapter when `computeEco` returns null), One of one (piece code, edition, share button, shop/Instagram links). Render the Markdown body as the towel's voice. Sets `--accent` from the garment.
- [ ] Per-page `<title>`/`<meta description>`/Open Graph image for good link previews when scanned/shared.
- [ ] Verify: `/t/dolphin-belt-001/` renders all chapters; eco chapter omitted for any garment lacking eco data.
- [ ] Commit: `feat: add garment story page template`

## Task 12: Home, tales index, about

**Files:** Create `src/pages/index.astro`, `tales.astro`, `about.astro`.

- [ ] `index.astro`: hero explaining Towel Tales and how to scan; featured stories; one memorable load sequence (frontend-design guidance).
- [ ] `tales.astro`: gallery of all stories linking to each `/t/[id]/`.
- [ ] `about.astro`: the brand, the student-led story, the sustainability case.
- [ ] Verify: all routes build and link correctly.
- [ ] Commit: `feat: add home, tales index, and about pages`

## Task 13: QR generation script

**Files:** Create `scripts/generate-qr.mjs`.

- [ ] Read every `src/content/towels/*.md`, derive `id` from the filename, build URL `${baseUrl}/t/${id}/`.
- [ ] For each: write `public/qr/${id}.svg` and `public/qr/${id}.png` with the `qrcode` package (error-correction level M).
- [ ] Write `public/qr/qr-sheet.html`: an A4-print-friendly grid of every QR labelled with its garment name and id.
- [ ] Base URL from `process.env.QR_BASE_URL` or the `src/lib/site.ts` default; print a warning if the default is used.
- [ ] Verify: `npm run qr` produces 3 SVGs, 3 PNGs, and the sheet; scanning a PNG opens the right path.
- [ ] Commit: `feat: add QR code generation script`

## Task 14: Documentation

**Files:** Create `docs/adding-a-story.md`, `docs/towel-character-upgrade.md`, `docs/towel-voice-guide.md`, `README.md`.

- [ ] `adding-a-story.md`: copy a Markdown file, fill frontmatter, write the body, run the humanizer pass, run `npm run qr`, deploy. Field reference table.
- [ ] `towel-character-upgrade.md`: Tier 1 vs 2 vs 3; how to add a Higgsfield looping video; how to add a Rive `.riv`; how to commission an illustrated mascot (Option 2).
- [ ] `towel-voice-guide.md`: the warm & sentimental register, the Finn reference sample, the humanizer rules and audit process, banned tells.
- [ ] `README.md`: install, `npm run dev`, `npm run build`, `npm run qr`, `npm test`, deploy to a static host, the `QR_BASE_URL` env var.
- [ ] Commit: `docs: add content, character, voice guides and README`

## Task 15: Motion audit and polish

**Files:** Touch components/pages as the audit requires.

- [ ] Run the **design-motion-principles** skill audit, weighted Jakub primary, Jhey secondary, Emil selective. Apply its critical and important findings.
- [ ] Confirm: every animation respects `prefers-reduced-motion`; images have width/height or aspect-ratio (no layout shift); touch targets ≥44px; contrast ≥4.5:1; keyboard navigable.
- [ ] Verify: `npm run build` and `npm test` pass; check `/t/dolphin-belt-001/` at 375px and desktop, with reduced motion on and off.
- [ ] Commit: `polish: motion audit and accessibility pass`

---

## Self-Review

**Spec coverage:** Concept and architecture → Tasks 1, 4, 11. Business assessment → documented in spec, no code needed. Content model/Zod → Task 4. Eco logic → Task 5. Towel character three tiers → Tasks 6, 9. Voice and humanizer → Task 7, 14. Story page chapters → Tasks 10, 11. Visual direction/skills → Tasks 2, 3, 15. QR generation → Task 13. Deliverables (site, 3 garments, QR sheet, PRODUCT/DESIGN, three docs, voice guide, README) → Tasks 2, 7, 13, 14. Out of scope respected (no backend). Open items (QR base URL) → Task 8 (`site.ts`), Task 13.

**Placeholder scan:** Logic tasks (5, 6, 13) carry full code/tests. Visual component tasks carry interfaces and explicit requirements verified by build/run rather than pre-pasted markup, since markup is design work confirmed visually.

**Type consistency:** `computeEco(EcoInput): EcoImpact | null` used in Task 11. `selectTier(CharacterAssets): CharacterTier | null` used in Task 9. `SITE` from `src/lib/site.ts` used in Tasks 8, 13. Schema field names in Task 4 reused verbatim in Tasks 7, 9, 11.
