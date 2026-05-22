# Context for the next agent

Last updated: 2026-05-22. Working branch: `build/towel-tales` (also the
default branch on GitHub; there is no `main`). Live at
**https://xugawear.vercel.app**.

Read this first, then `docs/HANDOFF.md` for the original Phase 1/2 plan
and `docs/superpowers/specs/2026-05-21-xuga-towel-tales-design.md` for
the design spec.

---

## What this is, in one paragraph

XUGA Island Wear is a Malta-based, student-led brand that upcycles
retired beach towels into one-of-a-kind clothing (bucket hats, shorts,
belt bags, pouches, trousers). The website's signature feature is
**Towel Tales**: every garment carries a QR code that opens a story page
where the original towel, given a voice, narrates how it became the
garment. The team is competing in **JA YE Gen-E** (Junior Achievement
European entrepreneurship finals), so any further work should be filtered
through "would a Gen-E judge care about this?".

---

## Current state (live)

- 8 static pages: `/`, `/gallery/`, `/tales/`, `/about/`, `/contact/`,
  `/t/<id>/` (one per garment, 3 examples), `/admin/` (Sveltia CMS).
- Site is fully editable through the CMS at `/admin/` (Tales, Pages,
  Site settings). See `docs/editing-the-site.md` for the editor flow.
- Auto-deploys: every push to `build/towel-tales` triggers a
  GitHub Action (`.github/workflows/deploy.yml`) that runs
  `vercel pull && vercel build && vercel deploy --prod`. Editors clicking
  Publish in `/admin/` trigger the same pipeline. ~40 seconds from
  Publish to live.
- Build & tests are green: `npm run build` (8 pages, ~1s),
  `npm test` (10/10 Vitest), `npx astro check` (0 errors, 0 warnings,
  29 hints — all the `'z' is deprecated` from `astro:content`, which is
  the current valid pattern).

---

## Tech stack and conventions

- **Astro 6** (rolldown-vite). Tailwind v4 is wired via
  `postcss.config.mjs`, **not** `@tailwindcss/vite` (that plugin breaks
  this build).
- **TypeScript**, **Vitest**, **Motion One** (used minimally), `qrcode`.
- Node 22+, npm.
- `trailingSlash: 'always'` — internal links end with `/`.
- **OKLCH only**, no `#000`/`#fff`. Tokens live in
  `src/styles/global.css @theme`. Brand: sand, sand-deep, ink, ink-soft,
  sun, sun-deep, sea, shell, lime, grape, paper.
- **No em dashes** anywhere (in code comments OR copy). See `DESIGN.md`.
- Tailwind v4 only generates classes that appear as **literal strings**
  in source. `bg-${x}` interpolation produces nothing. Use lookup maps
  of literal classes (see `src/pages/contact.astro` `swatchClass` for
  the pattern).
- Reduced motion is honoured site-wide (`@media (prefers-reduced-motion:
  reduce)` in `global.css` plus per-component gates).

### Commands

```bash
npm run dev            # dev server
npm run build          # static build into dist/
npm test               # Vitest
npm run qr             # regenerate QRs into public/qr/ (gitignored)
npx astro check        # type checking
node scripts/screenshot.mjs   # full-page screenshots after `npm run preview`
```

To deploy manually (Action does this automatically):

```bash
export VERCEL_TOKEN=$(grep VERCEL_TOKEN .env.local | cut -d= -f2)
vercel --prod --token "$VERCEL_TOKEN" --yes
```

---

## Content model

Three Astro content collections (`src/content.config.ts`):

1. **`towels`** — one Markdown file per garment in
   `src/content/towels/`. Frontmatter validated by Zod; the Markdown
   body is the story in the towel's voice. Schema has required fields
   (garmentName, garmentType, garmentPhoto, towelName, madeDate) plus
   many optional ones (origin, eyes, eco data, accent colour, etc.).
   Schema deliberately tolerant: missing optionals degrade gracefully.

2. **`pages`** — one JSON file per editable page in
   `src/content/pages/` (`home.json`, `gallery.json`, `about.json`,
   `contact.json`). Each entry's schema uses `.passthrough()` so the
   CMS can add fields ahead of code without blocking publish. Each page
   `.astro` reads its entry via `getEntry('pages', '<id>')`.

3. **`settings/site.json`** — single file (`src/content/settings/`),
   not a collection. Imported directly by `src/lib/site.ts` so both
   Astro pages and the Node QR script (`scripts/generate-qr.mjs`) read
   the same source. Brand name, tagline, nav, social handles, footer
   text.

### Adding a new garment

Through the CMS at `/admin/` is the recommended path; see
`docs/adding-a-story.md`. For developers editing the repo directly:
create `src/content/towels/<slug>.md`, run `npm run qr` (the build
also runs this), publish.

---

## CMS (Sveltia)

- Loaded at `/admin/` from unpkg (`public/admin/index.html`).
- Config at `public/admin/config.yml`. Mirrors the Zod schema in
  `src/content.config.ts`; **if you change the Zod schema, update the
  CMS config too**, otherwise editors can publish data the build
  rejects.
- Auth: **Personal Access Token (PAT)**. Each editor generates a PAT
  with `Contents: read+write` on `0-robert/xuga_website` and pastes it
  into Sveltia's sign-in. Sveltia remembers it in localStorage.
- Backend branch: `build/towel-tales` (the default). If the default
  branch is ever renamed, update `backend.branch` in `config.yml`.
- Media folder: `public/images/` (Sveltia uploads land here). Team
  photos live in `public/images/team/`; the beach background lives at
  `public/images/team-beach.png`.

### Why PAT instead of GitHub OAuth?
The simpler-UX option is "Sign in with GitHub", which needs a
Cloudflare Worker (`sveltia-cms-auth`) and a GitHub OAuth app. The
user chose PAT for now because the team is small (~7 editors) and the
one-time setup is acceptable. To upgrade later: deploy the Sveltia
auth Worker, add `base_url: <worker-url>` to `config.yml`. Zero code
changes in the repo.

---

## Visuals — the polish details that matter

- **The polaroids in `Meet the team`**: each card has its own deterministic
  tilt, washi tape colour, and sway timing (`src/pages/index.astro`,
  near `team-card`). Hover steadies and lifts. Mobile=2 columns, tablet=3,
  desktop=4. With 7 members, the orphan row centres because the grid is a
  flex/wrap+justify-center.
- **Layered wave transitions**: two places use a stacked-band wave
  rather than the single `<WaveEdge>`:
  1. Hero → product band (3 bands: sand → blend → sand-deep)
  2. Team → closing (4 bands: foam → shallow → sea → ink)
  Each band drifts horizontally on its own period via
  `@keyframes wave-drift` and a `--drift-distance` custom property.
  This is the visual signature the user liked most — preserve it.
- **Beach background behind the team** (`team-beach.png` in
  `public/images/`). The PNG was originally RGB with the editor's
  transparency rasterised as light-grey pixels. Cleaned with ImageMagick
  (saturation mask + hard alpha threshold). The CSS adds a bottom-edge
  mask gradient so the sand dissolves into the page cream rather than
  cutting hard.
- **`--accent-ink` token**: the brand's bright sun (oklch 0.74 0.155 58)
  on sand fails AA Large contrast (~2:1). I originally darkened it
  toward ink, but the user wanted the warm orange back and explicitly
  accepted the contrast trade-off for the decorative handwritten
  eyebrows. `--accent-ink: var(--accent)` is intentional. **Do not
  re-darken it** without checking with the user — it's a documented
  brand choice in `global.css` and re-mentioned in the handoff docs.

---

## Conversations already had with the owner

The owner's design preferences, summarised so you don't have to relitigate:

- **No fade-in scroll reveals.** Disabled site-wide; `data-reveal`
  attributes left in markup for future use but the CSS is a no-op.
  Ambient animations (polaroid sway, wave drift) stay.
- **Orange stays bright.** See `--accent-ink` note above.
- **Centre alignment** on product and team headers (matches centred
  content below). The pieces grid inside the product section is
  `text-left` because cards need their own reading flow.
- **Polaroids should look swingy, not subtly tilted.** Current tilts
  range -5 to +5 degrees with a ±1.6° sway around each card's rest. If
  this gets dialled down, run it past the owner.
- **Beach background placement is "perfect"** — don't move it. Only
  the seam treatments below it have been tuned.
- **Footer sits flush against the closing section** (no top margin).
  Its wave drips up into the ink. Don't reintroduce the 6rem gap.
- **Names in the team grid use the display name field, not the photo
  filename.** Nabeel's photo file is `Nabeel.jpg`; the JSON name field
  is `"Nabeel"`. If renaming a file again, update both. Don't rename
  through the OS without also updating `home.json`.

---

## What I would build next (Gen-E impact)

I had a strategic conversation with the owner about what would elevate
the site for JA YE Gen-E judging. Five ideas, in order of impact-per-hour:

### 1. Live impact strip on the home page
**Why for Gen-E**: judges score traction. Numbers ticking up turn
"sustainable" from a claim into a balance sheet. Single most impactful
addition.

**Where**: between the product section and the team section, or just
above the closing CTA. Use the existing `EcoCounter` component but with
site-wide totals computed from the towels collection at build time.

**Implementation sketch**:
- In `src/lib/eco.ts`, export a `siteTotals(towels)` that sums each
  garment's `computeEco()` output. Returns `{ towels: N,
  textileSavedGrams, waterSavedLitres, co2SavedKg, piecesSewn }`.
- In `index.astro`, await it after `getCollection('towels')` and render
  a strip of 4 `EcoCounter`s with the right values.
- Schema in `home.json` for `impactEyebrow`, `impactHeading`,
  `impactBody` so the CMS controls the copy.
- The `EcoCounter` already does the count-up animation when scrolled
  into view, with `prefers-reduced-motion` support. Just reuse it.

### 2. Reserve-a-piece flow
**Why for Gen-E**: judges will ask "what's your revenue mechanism?"
Right now there's none on the site. A captured-intent form is enough —
no payment processor required.

**Options**:
- Simplest: a `mailto:` link per garment, pre-filled with the piece ID
  and "I'd like to reserve <garmentName>". Zero infra.
- Better: a Tally / Typeform / Netlify Forms / Formspree endpoint
  with a piece-code field. Tracks form submissions = lead count to
  quote in the pitch.

**Where**: a "Reserve this piece" button next to "Meet <towelName>" on
each gallery row, and on the story page.

### 3. Newsletter signup
**Why for Gen-E**: audience size is growth proof. 200 emails on the
list is a different pitch than zero.

**Where**: bottom of home + gallery + footer. One email field. Service:
Buttondown / Beehiiv / Mailchimp free tier. User creates the account
and provides the form action URL; agent drops it in.

### 4. Sustainability methodology page (`/impact/`)
**Why for Gen-E**: pre-empts the "are those numbers real?" question.
Defensible methodology turns a weakness into a strength.

**Where**: new route `src/pages/impact.astro`, linked from `/about/`
and from each story page's eco chapter. Document: assumptions per kg
of cotton (water, CO2e), source citations, how each towel's weight is
measured, and an honest "these are estimates" framing.

### 5. Founder origin story
**Why for Gen-E**: team conviction scores. Personal narrative makes the
brand memorable in a room of 80 pitches.

**Where**: one paragraph at the top of `/about/`, first-person, with a
photo. CMS: add `founderStory` + `founderPhoto` fields to `about.json`.

### Lower priority but worth knowing

- **Press / "as seen in" strip** if any media coverage exists.
- **Customer testimonials wall** if any reviews exist. Bias toward
  first-name + piece-code attribution; feels real, not corporate.
- **Workshop / behind-the-scenes content** — process photos, hand-sewing
  close-ups. Could be a new content collection (`workshop_notes`?) or
  just a single section on `/about/`.
- **A team origin story photo / video** — Gen-E judges love a 60-90
  second pitch video. Could be embedded on `/about/`.

---

## What I would NOT do without asking

- Rebrand colours or typography.
- Switch the CMS or auth model.
- Move the beach background or change the polaroid tilt ranges.
- Re-darken `--accent-ink` for contrast (the owner accepted the trade).
- Remove `data-reveal` markup (left in deliberately for future
  re-enablement; doesn't render anything right now).
- Push directly to production without going through the
  `build/towel-tales` branch + GitHub Action.

---

## Files most likely to be touched by the next agent

- `src/pages/index.astro` — the home page, where most new sections will
  land.
- `src/content/pages/home.json` — copy for any new sections.
- `src/content.config.ts` — schema for any new copy fields.
- `public/admin/config.yml` — matching CMS fields.
- `src/lib/eco.ts` — already has `computeEco`, would gain a
  `siteTotals` for the impact strip.
- `src/components/EcoCounter.astro` — reusable counter component.
- `src/components/SiteFooter.astro` — likely home of a newsletter form.

---

## Risks / things to watch

- **The CMS YAML and the Zod schema can drift apart.** When you add a
  field, update both. The build will fail on missing required values;
  the CMS will let editors save anything.
- **Per-garment accent colour** is a free-form OKLCH string in the
  towel frontmatter, applied as `--accent` per page. Some accents
  (very light yellows) will fail contrast on `bg-sand`. The
  `--accent-ink` token kept this in scope per owner decision; if you
  add new garments with extreme accents, eyeball the story page in
  preview before publishing.
- **The Sveltia auth uses PAT**. If a PAT leaks, the holder can write
  to the repo. Tokens should be short-scoped (Contents only) and have
  a 6-month expiry. Document this in `docs/editing-the-site.md` (it's
  already there). When a team member leaves, revoke their token at
  https://github.com/settings/personal-access-tokens.
- **Vercel project is connected via GitHub Action, not the Vercel
  GitHub App.** The Action lives at `.github/workflows/deploy.yml` and
  pulls three secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
  `VERCEL_PROJECT_ID`. All three are set on the repo. If the user ever
  installs the Vercel GitHub App, the Action becomes redundant — leave
  it in place anyway as a fallback.

---

## Quick orientation if you only have 5 minutes

1. Read this file.
2. `npm install && npm run build && npm test` — confirm baseline is
   green.
3. Open https://xugawear.vercel.app/ on a phone and a laptop. The vibe
   you should preserve: warm, handmade, tactile, slightly playful.
4. Open https://xugawear.vercel.app/admin/ and look at the field set
   for "Tales" and "Home page" so you know what content shape is.
5. Ask the user which of the Gen-E ideas they want to prioritise,
   biggest-impact-first.

Good luck.
