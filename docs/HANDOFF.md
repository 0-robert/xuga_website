# XUGA Island Wear — Handoff

**For the next agent or developer. Start here.**

Last updated: 2026-05-22

This document hands off two phases of work, in order:

1. **Phase 1 — Finish the website revamp** (Gallery and Contact are done; docs,
   a stylise pass, and an accessibility audit remain).
2. **Phase 2 — Make the site editable by a non-technical team** (a browser CMS
   for towel stories, all page copy, and site settings).

Do Phase 1 completely, verify it, commit it, then do Phase 2.

---

## Project orientation

**What this is.** XUGA is a Malta-based, student-led brand that upcycles worn-out
beach towels into one-of-a-kind clothing. This repo is the XUGA Island Wear
website. Its signature feature is **Towel Tales**: every garment carries a QR
code; scanning it opens a story page where the original towel, given a voice,
narrates how it became the garment.

**Pages.** Home (`/`), Gallery (`/gallery/`), Tales (`/tales/`), a story page per
garment (`/t/<id>/`), About (`/about/`), Contact (`/contact/`).

**Stack.** Astro 6, Tailwind CSS v4, TypeScript, Astro content collections with
Zod, Vitest, `motion` (Motion One), `qrcode`. Node 22+, npm.

**Commands.**
- `npm run dev` — dev server
- `npm run build` — static build to `dist/` (must stay green)
- `npm test` — Vitest (10 tests, must stay green)
- `npm run qr` — regenerate QR codes into `public/qr/`
- `npx astro check` — type checking
- `node scripts/screenshot.mjs` — full-page screenshots (run `npm run preview`
  first); output in `screenshots/`

**Reference documents.**
- Spec: `docs/superpowers/specs/2026-05-21-xuga-towel-tales-design.md` — written
  when the scope was a *standalone microsite*. Scope has since changed to a full
  XUGA website. Phase 1 includes updating it.
- Original build plan: `docs/superpowers/plans/2026-05-21-xuga-towel-tales.md`
- Brand context: `PRODUCT.md`. Design system: `DESIGN.md`. Read both.
- Content guides: `docs/adding-a-story.md`, `docs/towel-voice-guide.md`,
  `docs/towel-character-upgrade.md`.

**Design skills** (in `.claude/skills/`, invoke via the Skill tool or read the
SKILL.md): `frontend-design`, `impeccable`, `design-motion-principles`,
`ui-ux-pro-max`, `humanizer`. Use `design-motion-principles` for the motion
audit and `humanizer` for any story or marketing copy.

**Key files.**
- `src/content.config.ts` — the `towels` collection and its Zod schema
- `src/content/towels/*.md` — one garment per file (3 examples exist)
- `src/lib/site.ts` — site config (`SITE`) and nav (`NAV`)
- `src/lib/eco.ts`, `src/lib/character-tier.ts` — tested pure logic
- `src/styles/global.css` — Tailwind import, OKLCH `@theme` tokens, base layer
- `src/layouts/BaseLayout.astro` — shell; holds the site-wide scroll-reveal script
- `src/components/` — `Doodle`, `WaveEdge`, `TowelCharacter`, `TowelEyes`,
  `Chapter`, `BeforeAfter`, `EcoCounter`, `StickyTowel`, `TaleCard`, `SiteHeader`,
  `SiteFooter`
- `src/pages/` — `index`, `gallery`, `tales`, `about`, `contact`, `t/[id]`
- `scripts/generate-qr.mjs` — QR generator

**Conventions — respect these.**
- Astro 6 uses rolldown-vite. Tailwind is wired through `postcss.config.mjs`,
  NOT `@tailwindcss/vite` (that plugin breaks this build).
- Tailwind v4 only generates classes that appear as *literal strings* in source.
  `bg-${x}` interpolation produces nothing. Use lookup maps of literal classes.
- No em dashes anywhere, in code comments or copy (`DESIGN.md`, `humanizer`).
- Colour is OKLCH only; never `#000`/`#fff`. Tokens live in `global.css @theme`.
- Story pages tint `--accent` per garment from the entry's `accent` field.
- Scroll reveal: mark an element `data-reveal` (optional `style="--reveal-delay:0.1s"`).
  The observer is in `BaseLayout.astro` and runs site-wide.
- `trailingSlash: 'always'` — internal links end with `/`.
- Towel story text is written in a warm, sentimental voice and MUST be run
  through the `humanizer` skill before shipping. See `docs/towel-voice-guide.md`.

**Current state (verified 2026-05-22).** Build passes (8 pages). `npm test`
passes (10/10). The full site exists and is rebranded to "XUGA Island Wear" with
a 5-item nav and a mobile menu. Gallery and Contact pages are built. Three
example garments are in `src/content/towels/`. All work is committed on the
branch `build/towel-tales` (not yet merged to `main`); continue on that branch.

---

## Phase 1 — Finish the revamp

Work top to bottom. Commit after each item. Keep `npm run build` and `npm test`
green throughout.

- [ ] **1.1 Verify the baseline.** Run `npm install`, `npm run build`,
  `npm test`, `npx astro check`. Build and tests must be green. Note any
  `astro check` errors and fix the real ones.

- [ ] **1.2 Stylise pass.** The brief was "a teeny bit more stylised" — enhance,
  do not redesign. Follow `DESIGN.md`, `frontend-design`, and `impeccable`.
  - Apply `data-reveal` consistently to the section eyebrows/headings on the
    home page ("How it works", "Meet the towels", "Closing"), `tales.astro`, and
    `about.astro`, so scroll reveals are uniform site-wide.
  - Use `WaveEdge` between every major colour-band transition (sand to
    sand-deep to ink), consistently across all pages.
  - Apply the `grain` / `grain-layer` texture utilities (already defined in
    `global.css`) to large flat bands for tactile depth.
  - Extend the sticker motif tastefully: chunky offset shadow
    (`shadow-[3px_3px_0_var(--color-ink)]`) and small rotated badges, as already
    used on footer chips and gallery edition badges.
  - Verify the build and re-screenshot. Commit.

- [ ] **1.3 Motion audit.** Invoke the `design-motion-principles` skill. For this
  playful brand site, weight Jakub primary, Jhey secondary, Emil selective.
  Apply its Critical and Important findings. Commit.

- [ ] **1.4 Accessibility and responsive pass.** Use `ui-ux-pro-max` sections
  1 to 3. Confirm: every animation respects `prefers-reduced-motion`; all images
  have width/height or aspect-ratio (no layout shift); touch targets are at
  least 44px; text contrast is at least 4.5:1; keyboard navigation works and
  focus is visible. Check the site at 375px and at desktop width. Commit.

- [ ] **1.5 About page review.** Confirm `about.astro` reads as the full XUGA
  website, not a microsite. Light copy edits only; run changed copy through
  `humanizer`. Commit.

- [ ] **1.6 Regenerate QR codes.** The production domain affects QR targets.
  Confirm the real domain with the site owner and set it in `astro.config.mjs`
  (`site:`, currently `https://xugawear.vercel.app`). Then run `npm run qr` and
  confirm a generated QR resolves to `/t/<id>/`. Commit the regenerated
  `public/qr/` contents only if they are not gitignored.

- [ ] **1.7 Update the spec.** Edit
  `docs/superpowers/specs/2026-05-21-xuga-towel-tales-design.md`: it describes a
  "standalone microsite". Update the concept, architecture, and deliverables
  sections to reflect the full XUGA website (Home, Gallery, Tales, About,
  Contact). Commit.

- [ ] **1.8 Final verification.** Use the `verification-before-completion`
  skill. Run `npm run build` and `npm test`; both green. Build, `npm run
  preview`, run `node scripts/screenshot.mjs`, and review every page on desktop
  and mobile. Commit.

**Phase 1 is done when** the build and tests are green, every page is styled and
accessible, the QR codes point at the real domain, and the spec is current.

---

## Phase 2 — Make the site editable by a team

**Goal.** A non-technical XUGA team member can log in through a browser and edit
(a) every towel story, (b) all page copy on Home / Gallery / About / Contact,
and (c) site settings (brand name, nav, socials, footer) — and upload images —
with no code and no git knowledge.

**Tool.** Sveltia CMS — a git-based CMS, GitHub login, free, drop-in. (Decap CMS
is the fallback; TinaCMS is the option if inline visual editing is wanted later.)

- [ ] **2.1 Extract page copy into content.** Today the copy on `index.astro`,
  `gallery.astro`, `about.astro`, and `contact.astro` is hardcoded. Make it data:
  - Add a `pages` content collection in `src/content.config.ts` with one entry
    per page (`home`, `gallery`, `about`, `contact`), each with a Zod schema
    naming every heading, paragraph, button label, and repeatable list (for
    example home: `heroEyebrow`, `heroHeading`, `heroBody`, `ctaPrimaryLabel`,
    `steps` array, and so on).
  - Add a `settings` singleton (for example `src/content/settings/site.json`,
    or have `src/lib/site.ts` read a data file) for brand name, tagline, nav
    labels, Instagram, email, and footer text.
  - Refactor each page `.astro` to read its copy from the content entry.
    Structure and layout stay in the `.astro`; only text and image references
    move to data.
  - Verify the built output is unchanged. Commit.

- [ ] **2.2 Add Sveltia CMS.** Create `public/admin/index.html` (loads Sveltia
  from its CDN) and `public/admin/config.yml` with three collections:
  - `towels` — folder collection over `src/content/towels/`, fields mirroring
    the Zod schema in `src/content.config.ts`, with the story as the Markdown
    body.
  - `pages` — file collection, one file per page, fields mirroring the page
    schemas from step 2.1.
  - `settings` — file collection (single file) for the site settings.
  - Configure the media folder so editors upload photos (to `src/assets/` if
    images should be optimised by Astro, or `public/images/` otherwise — match
    whatever the garment images currently use).
  - Backend `github`, on the deploy branch. Commit.

- [ ] **2.3 Wire QR generation into the build.** So a garment added through the
  CMS gets a QR automatically: change the `build` script in `package.json` to
  run `node scripts/generate-qr.mjs` before `astro build` (or call it from a
  small Astro integration). Confirm `public/qr/` is produced on every build.
  Commit.

- [ ] **2.4 Deploy and auth.** Deploy to a host that rebuilds on push to the
  main branch (Netlify, Vercel, or Cloudflare Pages — all free). Set up GitHub
  auth for Sveltia (a GitHub OAuth app, or the host's auth helper). Test logging
  in at `/admin/` and publishing an edit. Document the setup.

- [ ] **2.5 Docs.** Update `docs/adding-a-story.md` to describe the CMS flow.
  Add `docs/editing-the-site.md` for non-technical editors: how to log in, edit
  a page or a story, upload an image, publish, and the roughly two-minute
  rebuild wait. Note that story text should still pass the `humanizer` step.
  Commit.

**Phase 2 is done when** a non-technical person can log into `/admin/`, edit any
story, any page's copy, and the site settings, upload an image, publish, and see
it live after the rebuild — and a garment added through the CMS gets its QR code
on the next build.

---

## Definition of done (both phases)

- `npm run build` and `npm test` are green; `npx astro check` is clean.
- Every page is styled, responsive, and accessible (reduced-motion, contrast,
  keyboard, touch targets).
- QR codes target the real production domain.
- The team can edit stories, page copy, and settings through `/admin/`.
- The spec and the docs reflect the shipped site.
