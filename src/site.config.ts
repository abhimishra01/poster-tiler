// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
export default {
  name: 'Print Large Poster',                 // shown in header, title, footer
  domain: 'printlargeposter.com',            // no https://, no www. Used for canonical, sitemap, robots
  cloudflareProject: 'poster-tiler',    // Cloudflare Pages project name (used by npm run deploy)
  keyword: 'print poster on multiple pages',
  title: 'Print Poster on Multiple Pages: Free Poster Tiler',   // home page <title>, under 60 characters
  h1: 'Print a poster on multiple pages',
  keywords: ['poster tiler', 'print large poster', 'poster maker', 'tile image to pages', 'multi page poster printing', 'enlarge image to poster'],
  tagline: 'Free, private, no watermark',  // short line used in the title after the keyword
  description:
    'Split any image into a multi-page PDF poster. Free, no watermark, no sign-up. Your picture never leaves your device.',
  email: 'hello@printlargeposter.com',       // contact email (shown on Contact and Privacy pages)
  ga4: '',                            // GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty = Google Analytics off
  adsense: '',                        // AdSense publisher ID, e.g. 'ca-pub-1234567890123456'. Empty = ads off
  brand: '#b8431d',                   // brand colour (hex)
  locale: 'en-US',                    // BCP 47 language tag
  ogImage: '/og.png',                        // e.g. '/og.png' (1200x630 file in public/). Empty = no image
  category: 'UtilitiesApplication',   // schema.org applicationCategory
  owner: 'Print Large Poster',                // name used in legal pages (person or business)
};
