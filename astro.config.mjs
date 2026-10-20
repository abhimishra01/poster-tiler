import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import site from './src/site.config.ts';

// GitHub Pages builds set PAGES_BASE (for example /poster-tiler/) and PAGES_SITE.
export default defineConfig({
  site: site.bingemind ? 'https://bingemind.com' : (process.env.PAGES_SITE || 'https://bingemind.com'),
  base: site.bingemind ? '/poster-tiler/' : (process.env.PAGES_BASE || '/'),
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
