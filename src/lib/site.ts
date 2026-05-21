/**
 * Site-wide configuration. Imported by Astro pages and by scripts/generate-qr.mjs.
 *
 * The production origin (used for QR targets and Open Graph URLs) is set in
 * astro.config.mjs via the QR_BASE_URL environment variable. `defaultBaseUrl`
 * below is only the fallback when that variable is not set.
 */
export const SITE = {
  name: 'XUGA Towel Tales',
  brand: 'XUGA',
  tagline: 'Every XUGA piece has a tale.',
  description:
    'Every XUGA garment is sewn from a real beach towel. Scan its code and the towel tells you where it has been.',
  defaultBaseUrl: 'https://towels.xugaislandwear.com',
  shopUrl: 'https://xugaislandwear.lovable.app',
  instagram: {
    handle: '@xuga_mlt',
    url: 'https://www.instagram.com/xuga_mlt/',
  },
  email: 'xuga.islandwear@gmail.com',
  place: 'Malta',
};

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Tales', href: '/tales/' },
  { label: 'About', href: '/about/' },
];
