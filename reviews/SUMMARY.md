# Fix summary: poster-tiler (Sam, 2026-10-20)

## Fixed
Template items: README now describes this tool; US spelling (color, personalized); fixed "Last updated" (October 20, 2026) on Privacy and Terms; scripts/new-tool.sh removed; screenshots/, .playwright-cli/ and dist-*/tmp-* in .gitignore; duplicate legal link block removed from home (footer keeps them); `deploy` runs `npm test` first; Privacy no longer claims a consent banner (says Google shows its consent message when ads are on); no absolute paths in scripts.
Tailwind scans `src` only (`source(none)` + `@source "../"`). Built CSS: 117,994 bytes before, 23,822 bytes after.
GitHub Pages: `astro.config.mjs` reads PAGES_BASE and PAGES_SITE; all links, icons, manifest (relative paths) and og:image use `withBase()` (src/lib/url.ts); canonical and og:url stay on https://printlargeposter.com/; `.github/workflows/pages.yml` added (checkout@v4, setup-node@v4 node 22, npm ci, npm test, build with PAGES_BASE=/poster-tiler/, upload-pages-artifact@v3, deploy-pages@v4). Verified a PAGES_BASE build served under /poster-tiler/: home, about, contact, privacy, terms, icons, manifest, og.png, sitemap all load, no 4xx, nav highlight works. dist-pages deleted. Branch is `main` (the site folder had no git repo, so I ran `git init -b main` here; the parent repo ignores sites/).
Review findings fixed:
- Photo orientation: `imageOrientation: 'from-image'` with fallback. Tested with an EXIF-rotated JPEG: 200x400, PDF top tile is the right color.
- False offline claim removed from FAQ (and the "no limit" wording; the 200-sheet cap is stated).
- Assembly map follows the chosen unit. Page label with margin under 0.2 in moved to the bottom right corner (the glue strip), not over the picture.
- Waste tip: strip minus overlap, singular "sheet", test added. New "Apply" button next to each tip sets the size that drops the thin column or row (5 of 5 customers asked).
- Blank margin or overlap field gives "Enter a number..." (test). Huge size message no longer prints a giant number.
- Unit switching no longer drifts: sizes, margin and overlap are stored in inches (test for showLen).
- Errors clear the stat tiles, dim the preview, reset the button label, and show the message in the download bar too.
- Download button always in reach: sticky bar on phones, and on desktop the stats and Download sit above the preview.
- Button reads "Download sample PDF" while the sample is shown. Bold 100% print note at the button.
- SVG and non-image files rejected with a clear message; `accept` lists raster types only. A file dropped anywhere on the page loads (no more leaving the tool).
- Pages across rounds to whole pages (1.5 shows 2).
- Low-quality help: shows the width that gives 150 dpi. Legend under the preview. One tab stop for the file picker. "Across" label, "glue strip" label. Footer links get larger touch area. Smaller stat text under 420 px.
- PDF image cap lowered from 300 to 200 dpi (lighter PDFs). Constants named and commented.
- Tests: PDF now checks clip box and picture matrix for all 4 tiles of a 2x2 poster, and label position at zero margin.
- SEO and copy: removed one-item BreadcrumbList and meta keywords; About no longer invents a backstory; FAQ dpi wording matches the tool; 2 new FAQs (A4, 24x36 page count); new article section "How to print the PDF at actual size" (Adobe, Chrome, Mac Preview, phone); width table says portrait. Dead code removed (Image fallback in decode, unused Src fields, setTimeout guard, duplicate step rule).

## Rejected, with reason
- Preload pdf-lib for offline use: costs 430 KB for every visitor. Wording fixed instead.
- Crop one JPEG per tile (reviewer: spooler may be slow): unproven; placement was verified correct and file size is small. Cap lowered instead. Test a 25-page PDF on a real printer later.
- Move state into a state.js module with tests: the bugs found were fixed and the unit logic is tested through showLen. Not worth a refactor.
- Cut marks in the margin band may not print on printers with big margins: the marks only need the printer margin to match the real one. Not changed.
- Marks at the poster edge in last column or row, hide map labels on 100+ sheet jobs, decode image once: nice items, left.
- Custom paper, crop and fit, banner shortcut, presets, test-print page, Word/Mac long-tail pages: new features or Phase 2.
- Sitemap lastmod, print stylesheet, logo and favicon redraw, OG image redraw, wrangler dependency: low value now.

## Status
`npm test` passes. `npm run build` passes. Lighthouse (local, headless): mobile 100/100/100/100, desktop 100/100/100/100 (performance, accessibility, best practices, SEO). LCP 1.4 s mobile. Screenshots at 1280 and 390, light and dark, checked (in screenshots/, git-ignored).

## Left for the owner
- Push `main` to a GitHub repo named `poster-tiler` under abhimishra01 and turn on Pages (Source: GitHub Actions). Barney pushes.
- Pages build also lists github.io URLs in its sitemap; canonical points to the real domain. Add noindex for the Pages build if you do not want it indexed.
- Before AdSense or GA4: set up Google's consent message.
- Real printer test of marks and labels; Safari and Firefox check of the rotated-photo case.

## Phase 2 SEO pages (top 20 candidates, not built)
1. 24x36 poster on Letter paper
2. 18x24 poster on Letter paper
3. 36x48 poster on Letter paper
4. 24x36 poster on A4 paper
5. A4 poster 3x3 pages
6. Print a poster on multiple pages in Word
7. Print a poster on multiple pages on a Mac
8. Print a poster on multiple pages with Adobe Reader
9. Print a poster on multiple pages from Chrome
10. Print a banner on multiple pages
11. Print a large map on multiple pages
12. Print a poster on 4 pages (2x2)
13. Print a poster on 9 pages (3x3)
14. Print a poster on 16 pages (4x4)
15. Print a poster from a phone or iPad
16. Print a photo as a wall poster
17. Print a classroom bulletin board poster
18. How many pages for a 27x40 poster
19. Print a poster on Legal or Tabloid paper
20. Blow up a drawing to poster size
