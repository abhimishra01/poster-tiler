// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
// SITE_MODE=bingemind builds the public copy at bingemind.com/<slug>/.
const bingemind = process.env.SITE_MODE === 'bingemind';
export default {
  name: 'Print Large Poster',                 // shown in header, title, footer
  domain: 'bingemind.com/poster-tiler',   // canonical host + path, no https://. Sites live at bingemind.com/<slug>/            // no https://, no www. Used for canonical, sitemap, robots
  cloudflareProject: 'poster-tiler',    // Cloudflare Pages project name (used by npm run deploy)
  keyword: 'print poster on multiple pages',
  title: 'Print Poster on Multiple Pages: Free Poster Tiler',   // home page <title>, under 60 characters
  h1: 'Print a poster on multiple pages',
  keywords: ['poster tiler', 'print large poster', 'poster maker', 'tile image to pages', 'multi page poster printing', 'enlarge image to poster'],
  tagline: 'Free, private, no watermark',  // short line used in the title after the keyword
  description:
    'Split any image into a multi-page PDF poster. Free, no watermark, no sign-up. Your picture never leaves your device.',
  email: 'hello@printlargeposter.com',
  // Bingemind build (SITE_MODE=bingemind): owner is Bingemind, contact goes to the Bingemind contact section (no invented email).
  bingemind,
  contactHref: bingemind ? 'https://bingemind.com/#contact' : 'mailto:' + 'hello@printlargeposter.com',
  contactLabel: bingemind ? 'bingemind.com/#contact' : 'hello@printlargeposter.com',
  contactLead: bingemind ? 'Contact:' : 'Email:',       // contact email (shown on Contact and Privacy pages)
  ga4: '',                            // GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty = Google Analytics off
  adsense: '',                        // AdSense publisher ID, e.g. 'ca-pub-1234567890123456'. Empty = ads off
  brand: '#a21caf',                   // brand color (hex)
  skin: 'retro',                      // visual skin: minimal, swiss, clay or retro
  locale: 'en-US',                    // BCP 47 language tag
  ogImage: '/og.png',                        // e.g. '/og.png' (1200x630 file in public/). Empty = no image
  category: 'UtilitiesApplication',   // schema.org applicationCategory
  owner: bingemind ? 'Bingemind' : 'Print Large Poster',                // name used in legal pages (person or business)
};
