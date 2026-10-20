# Design and SEO review: poster-tiler (printlargeposter.com)

Reviewer: Miranda (independent). Build: `astro build --outDir dist-design`, served on port 4476, viewed with playwright-cli at 1280 and 390, light and dark.

## Scores (Lighthouse 13, headless, local static server)

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Mobile | 100 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Mobile: LCP 1.2 s, CLS 0, TBT 80 ms. Page weight 36 KiB on first load. pdf-lib (about 430 KB) loads only when Download is pressed. No horizontal scroll at 390. Console clean. A real PDF was downloaded (6 pages, Letter, 11 KB) and the unit tests were not re-run by me.

## Verdict

Clearly better than the competitors in the research: free, no watermark, private, live preview with labels and overlap strips, dpi warning, six paper sizes, banner mode, a real worked example and tables. Look and feel is clean, consistent and calm in both themes. Two must-fix items are about feedback on a phone and on invalid input. The rest is polish and missing features.

JSON-LD parsed OK (WebApplication, BreadcrumbList, FAQPage). Title 49 characters, meta description 112, one H1, clean H2 outline, canonical and OG tags present, sitemap and robots correct, article about 850 words.

## Findings (max 25)

| # | Severity | Area | Finding | Fix |
|---|---|---|---|---|
| 1 | Must-fix | Phone UX | At 390 the preview sits above all settings. When the user changes pages across, paper or overlap, the preview and the Sheets stat are scrolled out of view, so there is no visible result of the change. The Download button is about 1,200 px down. | Make a compact sticky strip on phones (sheet count + small preview or "6 sheets, 23 x 15 in") pinned under the header, or put the settings first and a repeated stats row next to the download button. |
| 2 | Must-fix | Error state | Invalid input (empty size, 0, 50 across, overlap 9, negative margin) sets the Download button to disabled and writes a message in the summary under the preview, but the preview and the three stat tiles keep the old values. The message is off screen on phone and far from the field that caused it. | Grey out or clear the preview and stats on error, and show the message next to the field (aria-describedby, red border) as well as in the summary. |
| 3 | Medium | Preview | The grey hatched strip in the preview (unused page area below the picture) has no legend. Alternating tints also make B2 look different from B1 and B3. A user may think it prints blank or is a bug. | Add a one-line legend under the preview: "Hatched = blank paper, shaded strip = overlap you glue, A1 = page name". Do not apply the checker tint over the hatched area. |
| 4 | Medium | Tool gap | No "test print at 100%" page, though the FAQ and page copy say scale is the main failure. The research listed it as a feature that beats competitors. | Add an optional first page with a 2 inch square and a ruler line: "Measure this. It must be exactly 2 in". |
| 5 | Medium | Tool gap | No fit, fill or crop control and no way to shift the image on the poster. The poster takes the exact image shape, so a 3:2 photo can never fill 24 x 36 in. Research listed fit, fill, crop. | Add a "Poster shape" select (Keep image shape, 2:3, 3:4, 4:5, 1:1, custom) with fill and crop, and a drag to move the crop. |
| 6 | Medium | Desktop layout | At 1280 x 800 the Download button is at y 1190, below the fold. Only the preview is sticky. The primary action is the last thing in the left column. | Make the download card sticky at the bottom of the left column, or put a second "Download PDF" under the stats tiles on desktop. |
| 7 | Medium | Keyboard / a11y | The hidden file input and its label are two tab stops ("INPUT#file", then "LABEL#file-btn"). A screen reader user hears the file control twice. | Remove `tabindex="0"` from the label and let the input take focus, with `:focus-within` styling on the label. Keep the Enter and Space handler only if needed. |
| 8 | Medium | SEO content | The main query "print poster on multiple pages" has page 1 results about Word, Mac, Adobe, PowerPoint and Canon. The page has one generic print note. No sections for those intents. | Add short H2 sections: "Print a poster on multiple pages in Word", "...on a Mac", "...with Adobe Reader or Chrome" (about 120 words each, pointing back to the tool and the 100% rule). |
| 9 | Medium | SEO structure | One indexable page plus legal pages. No internal links from the article to deeper pages. Research noted pre-rendering long-tail pages is the Astro advantage. | Later: add 6 to 10 static pages (for example "24x36 poster on letter paper", "A4 poster 3x3", "print a banner on multiple pages") using the same tool and a prefilled setting. Link them from the article table rows. |
| 10 | Low | Phone | The three stat tiles wrap ("23 x 15.3 in" and "78 dpi, fair" use two lines each) and tile heights differ. | Use `text-sm` on stat values under 400 px, or switch to a 2 column layout with the dpi tile full width. |
| 11 | Low | Phone | "Pages across" wraps to two lines inside its segment while "Width" and "Height" do not. The select and Portrait/Landscape control touch with only 8 px gap. | Rename the segment to "Across", and add `mt-3` between select and orientation control. |
| 12 | Low | Logo | The mark (four tiles with a mountain across the lower row) reads well at 512 but the mountain peak is cut by the tile gaps and looks messy at 28 px in the header. | Simplify: a 2 x 2 grid with one clean mountain and sun, or draw the mountain only in the bottom two tiles with straight edges. |
| 13 | Low | Favicon | The SVG favicon is the full detail icon. At 16 px the sun and mountain become noise. | Make a simpler 16 px version (2 x 2 tiles only) for the 16 and 32 px sizes. |
| 14 | Low | OG image | Good layout and brand. The illustration is abstract and does not show a poster being split with the tool UI. Domain text is small. | Optional: show a real preview crop with A1 to B3 labels. Increase domain size to 36 px. |
| 15 | Low | Touch targets | Footer links under the tool (About, Privacy, Terms, Contact) are 17 to 20 px tall. The checkbox inputs are 20 px (their labels are 44 px, so this is fine). | Add `py-2` to the footer link rows. |
| 16 | Low | Copy | Intro says "Your picture never leaves your device" and badge says "Free, private, no watermark". The same message appears in the badge, description, article and FAQ. | Keep the badge, trim the intro to one sentence. |
| 17 | Low | Copy | "Print quality 78 dpi, fair" and then "looks a little soft up close". Two lines say nearly the same thing. | Show only the colored tile and one line of advice with the maximum poster size that gives 150 dpi ("Up to 11 x 16 in looks sharp"). |
| 18 | Low | Image states | The empty state is a sample picture. Good. But there is no drop-zone hint on the preview, and a non-image drop is ignored with no message. | Show "Drop an image here" on hover, and an error line for a non-image file. |
| 19 | Low | SEO | The BreadcrumbList has one item. It adds no value and Google ignores it. | Remove it, or keep only on inner pages. |
| 20 | Low | SEO | `meta keywords` is ignored by Google and shows the keyword list to competitors. | Remove the tag. |
| 21 | Low | SEO | Sitemap has no `lastmod`. | Add lastmod with the sitemap integration option `serialize`. |
| 22 | Low | SEO | Title omits the brand and leads with the keyword (good). "Free Poster Tiler" mixes a second term; the H1 text differs from the title. | Acceptable. Optionally align: "Print a Poster on Multiple Pages (Free, No Watermark)". |
| 23 | Low | FAQ | Eight questions, real and useful. Missing the two most searched: "How do I print a poster on A4 paper?" and "How many pages do I need for a 24x36 poster?" | Add both, with the table numbers. The second also feeds the "sheets" table. |
| 24 | Low | Article | "Tabloid" appears in the tool but the tables show only Letter and A4. The claim "the count is the same for Letter and A4" is correct for the four rows tested but is not shown for A3 or Legal. | Add one row group for Legal and A3, or a short note on how to compute. |
| 25 | Low | Print stylesheet | Not checked in the tool. If someone prints the page itself, the nav and tool appear. | Optional `@media print` hide for the header, tool and footer. |

## Cleanup

Server on port 4476 stopped, playwright session closed, `dist-design/` and `tmp-design/` removed.
