/**
 * Site-wide configuration. Reads from src/content/settings/site.json so the
 * brand name, tagline, nav, social handles and similar values can be edited
 * through Sveltia CMS at /admin/ without touching code.
 *
 * Imported by Astro pages and by scripts/generate-qr.mjs; both Node 22 and
 * the Astro bundler resolve the JSON import natively.
 *
 * The production origin (used for QR targets and Open Graph URLs) is set in
 * astro.config.mjs via the QR_BASE_URL environment variable. `defaultBaseUrl`
 * below is only the fallback when that variable is not set.
 */
import settings from '../content/settings/site.json' with { type: 'json' };

export const SITE = {
  name: settings.name,
  brand: settings.brand,
  tagline: settings.tagline,
  /** The name of the QR storytelling feature. */
  talesName: settings.talesName,
  talesLine: settings.talesLine,
  description: settings.description,
  defaultBaseUrl: settings.defaultBaseUrl,
  instagram: {
    handle: settings.instagramHandle,
    url: settings.instagramUrl,
  },
  email: settings.email,
  place: settings.place,
  footerTagline: settings.footerTagline,
  footerBlurb: settings.footerBlurb,
};

export const NAV = settings.nav;
