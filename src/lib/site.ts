/**
 * Site-wide configuration. Imported by Astro pages and by scripts/generate-qr.mjs.
 *
 * The production origin (used for QR targets and Open Graph URLs) is set in
 * astro.config.mjs via the QR_BASE_URL environment variable. `defaultBaseUrl`
 * below is only the fallback when that variable is not set.
 */
export const SITE = {
  name: 'XUGA Island Wear',
  brand: 'XUGA',
  tagline: 'Island Wear Anywhere',
  /** The name of the QR storytelling feature. */
  talesName: 'Towel Tales',
  talesLine: 'Every XUGA piece has a tale.',
  description:
    'XUGA upcycles worn-out beach towels into one-of-a-kind island wear in Malta. Every piece carries a code: scan it and the towel tells you where it has been.',
  defaultBaseUrl: 'https://xugaislandwear.com',
  instagram: {
    handle: '@xuga_mlt',
    url: 'https://www.instagram.com/xuga_mlt/',
  },
  email: 'xuga.islandwear@gmail.com',
  place: 'Malta',
};

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Tales', href: '/tales/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];
