# Print Large Poster (poster-tiler)

Free browser tool at printlargeposter.com. It splits one image into a multi-page PDF so you can print a large poster on Letter, A4, Legal, Tabloid, A3 or A5 paper. The image never leaves the device. Astro (static) and Tailwind 4. No backend.

## Where the logic lives

- `src/lib/tile.js`: pure tiling math (paper sizes, columns and rows, overlap, dpi, tips). No DOM.
- `src/lib/pdf.js`: builds the PDF with pdf-lib (tile clipping, cut and glue marks, page labels, assembly map).
- `src/components/Tool.astro`: the screen: upload, settings, live preview, download. Lengths are stored in inches; the unit only changes the display.
- `src/data/faq.ts` and `src/components/Article.astro`: FAQ (also JSON-LD) and the article. The tables in the article come from the same math as the tool.
- `src/site.config.ts`: name, domain, text, brand color, GA4 and AdSense IDs (empty means off).
- `src/lib/url.ts`: `withBase()` for every internal link, so the site works at `/` and under `/poster-tiler/`.

## Commands

- `npm run dev`: work on the site.
- `npm test`: unit tests for the math and the PDF (page count, size, picture placement per tile).
- `npm run build`: make `dist/`.
- `npm run deploy`: test, build, then upload to Cloudflare Pages (you run `npx wrangler login` once first).

## GitHub Pages

`.github/workflows/pages.yml` builds on every push to `main` with `PAGES_BASE=/poster-tiler/` and `PAGES_SITE=https://abhimishra01.github.io`, then deploys. Canonical links always point to https://printlargeposter.com/. To check locally:

```
PAGES_BASE=/poster-tiler/ npx astro build --outDir dist-pages
```

Serve the parent of `dist-pages` so the folder is reachable as `/poster-tiler/`. Delete `dist-pages` when done.

## Before launch

- No GA4 or AdSense ID until the consent message is set up in AdSense (Privacy and messaging).
- The Privacy page says Google shows its consent message when ads are on.
