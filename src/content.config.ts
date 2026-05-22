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
      howEyebrow: z.string().optional(),
      howHeading: z.string().optional(),
      howSteps: z
        .array(z.object({ title: z.string(), body: z.string(), doodle: z.string() }))
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

export const collections = { towels, pages };
