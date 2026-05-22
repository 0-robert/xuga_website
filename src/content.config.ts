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

export const collections = { towels };
