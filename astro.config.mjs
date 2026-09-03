// @ts-check
import { defineConfig } from 'astro/config';

// Three locales: Serbian Latin (default), Serbian Cyrillic, English.
// `cir` is used rather than `sr-Cyrl` so the URLs stay short: /sr, /cir, /en.
export default defineConfig({
  site: 'https://savkovic-advokat.rs',
  i18n: {
    defaultLocale: 'sr',
    locales: ['sr', 'cir', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  redirects: {
    '/': '/sr',
  },
});
