// @ts-check
import { defineConfig } from 'astro/config';

// `site` is the production origin used for QR targets and Open Graph URLs.
// Override at build time with the QR_BASE_URL environment variable.
// Tailwind v4 is wired in through postcss.config.mjs.
export default defineConfig({
  site: process.env.QR_BASE_URL ?? 'https://xugawear.vercel.app',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
