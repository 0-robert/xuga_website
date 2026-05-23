import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One Markdown file per garment in src/content/towels/.
 * Frontmatter holds structured data; the Markdown body holds the origin story
 * in the towel's warm, sentimental voice.
 *
 * Required fields are enforced. Optional fields may be absent and the story
 * page degrades gracefully (a missing chapter is simply not rendered).
 *
 * Image fields use Astro's image() so they are optimised at build time;
 * reference them relative to the Markdown file, e.g.
 *   garmentPhoto: ../../assets/garments/dolphin-belt.jpg
 */
const towels = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/towels' }),
  schema: ({ image }) =>
    z.object({
      // --- Required ---
      garmentType: z.enum([
        'Belt bag',
        'Shorts',
        'Bucket hat',
        'Pouch',
        'Trousers',
        'Other',
      ]),
      garmentName: z.string(),
      garmentPhoto: image(),
      towelName: z.string(),
      madeDate: z.coerce.date(),
      /** The towel's opening line, shown handwritten in the hero. */
      greeting: z.string().optional(),

      // --- Towel character (optional; drives the tier system) ---
      towelPersonality: z.string().optional(),
      towelPhoto: image().optional(),
      towelVideo: z
        .object({ src: z.string(), poster: image().optional() })
        .optional(),
      towelRive: z
        .object({ src: z.string(), stateMachine: z.string().optional() })
        .optional(),

      // --- Origin / provenance (optional) ---
      originPlace: z.string().optional(),
      originType: z
        .enum(['donated', 'hotel', 'thrift', 'family', 'found', 'unknown'])
        .optional(),
      originYearApprox: z.string().optional(),

      // --- Transformation (optional) ---
      beforePhoto: image().optional(),
      afterPhoto: image().optional(),
      maker: z.string().optional(),

      // --- Identity & presentation (optional) ---
      gallery: z.array(image()).optional(),
      editionNote: z.string().default('1 of 1'),
      accent: z.string().optional(),
      featured: z.boolean().default(false),

      // Where the towel-character eyes sit on the towel photo, as
      // percentages of the photo, plus a size multiplier.
      eyes: z
        .object({
          x: z.number().default(50),
          y: z.number().default(40),
          scale: z.number().default(1),
        })
        .default({ x: 50, y: 40, scale: 1 }),

      // --- Eco impact (optional) ---
      ecoTowelWeightGrams: z.number().optional(),
      ecoWaterSavedLitres: z.number().optional(),
      ecoCo2SavedKg: z.number().optional(),
      ecoTextileSavedGrams: z.number().optional(),
    }),
});

/**
 * One JSON file per editable page in src/content/pages/.
 * Holds the headings, paragraphs, button labels and repeatable lists that
 * editors can change through Sveltia CMS without touching code. The page's
 * .astro file imports its entry and renders the structure around it.
 *
 * Schemas are deliberately lenient (extra fields allowed, optional defaults)
 * so adding a new copy field through the CMS does not require a schema bump
 * before content publishes. The .astro renders fall back gracefully.
 */
const pages = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/pages' }),
  schema: z
    .object({
      // Common across pages
      introEyebrow: z.string().optional(),
      introHeading: z.string().optional(),
      introBody: z.string().optional(),

      // Home
      heroEyebrow: z.string().optional(),
      heroHeading: z.string().optional(),
      heroBody: z.string().optional(),
      ctaPrimaryLabel: z.string().optional(),
      ctaPrimaryHref: z.string().optional(),
      ctaSecondaryLabel: z.string().optional(),
      ctaSecondaryHref: z.string().optional(),
      // (Legacy 'how a tale works' fields, kept optional for backward
      // compatibility with old home.json values; the section was replaced
      // by the team block below.)
      howEyebrow: z.string().optional(),
      howHeading: z.string().optional(),
      howSteps: z
        .array(z.object({ title: z.string(), body: z.string(), doodle: z.string() }))
        .optional(),
      teamEyebrow: z.string().optional(),
      teamHeading: z.string().optional(),
      teamBody: z.string().optional(),
      teamMembers: z
        .array(
          z.object({
            name: z.string(),
            role: z.string(),
            photo: z.string(),
          }),
        )
        .optional(),
      meetEyebrow: z.string().optional(),
      meetHeading: z.string().optional(),
      meetBody: z.string().optional(),
      meetMoreLabel: z.string().optional(),
      meetMoreHref: z.string().optional(),
      closingHeading: z.string().optional(),
      closingBody: z.string().optional(),
      closingCtaLabel: z.string().optional(),
      closingCtaHref: z.string().optional(),

      // Gallery
      rangeEyebrow: z.string().optional(),
      rangeHeading: z.string().optional(),
      rangeItems: z
        .array(z.object({ type: z.string(), doodle: z.string(), note: z.string() }))
        .optional(),
      closingCtaInstagramLabel: z.string().optional(),
      closingCtaContactLabel: z.string().optional(),

      // About
      sections: z
        .array(
          z.object({
            heading: z.string(),
            tone: z.enum(['sand', 'sand-deep']).default('sand'),
            paragraphs: z.array(z.string()),
          }),
        )
        .optional(),
      helloHeading: z.string().optional(),
      helloBody: z.string().optional(),

      // Contact
      channels: z
        .array(
          z.object({
            doodle: z.string(),
            swatch: z.string(),
            label: z.string(),
            value: z.string(),
            note: z.string(),
            href: z.string().optional().default(''),
          }),
        )
        .optional(),
      commissionEyebrow: z.string().optional(),
      commissionHeading: z.string().optional(),
      commissionBody: z.string().optional(),
      commissionCtaLabel: z.string().optional(),
    })
    .passthrough(),
});

/**
 * One Markdown file per travel snapshot in src/content/places/.
 * Each entry is a photo of a XUGA piece in the wild, pinned to the travel
 * board on /anywhere/. Frontmatter only for now; the Markdown body is unused
 * (kept available so editors can append longer notes through the CMS later).
 *
 * mapX / mapY are percentages on the stylised world-strip SVG used by the
 * board (0% left / 0% top). They drive both the pin position on the map
 * and the dotted-string anchor to the artifact below.
 */
const places = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/places' }),
  schema: ({ image }) =>
    z.object({
      place: z.string(),
      country: z.string(),
      photo: image(),
      caption: z.string(),
      /** Free-form line under the place name, e.g. "Andrew · Dolphin bucket hat". */
      credit: z.string().optional(),
      /** Card style: postcard (washi tape + caption), polaroid (square + handwritten), snap (bare pinned photo). */
      variant: z.enum(['postcard', 'polaroid', 'snap']).default('postcard'),
      /** Palette key driving the pin + accent of this artifact. */
      pin: z.enum(['sun', 'sea', 'shell', 'lime', 'grape']).default('sun'),
      mapX: z.number().min(0).max(100),
      mapY: z.number().min(0).max(100),
      order: z.number().default(0),
      /** Optional slug linking the artifact to a /t/<slug>/ story page. */
      garmentSlug: z.string().optional(),
    }),
});

export const collections = { towels, pages, places };
