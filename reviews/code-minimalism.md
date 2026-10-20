# Code review, minimalism lens: poster-tiler

Verdict: small, clean tool code with one real bloat problem (the stylesheet is about 5x too big because Tailwind scans the whole folder); 1 must-fix, no logic problems found from this lens.

Known template leftovers (README, new-tool.sh, screenshots in git, duplicate legal links block on the home page, build-date "Last updated", British spelling) are on the fixer's list and not repeated here.

| # | Severity | file:line | Finding | Why | Fix |
|---|----------|-----------|---------|-----|-----|
| 1 | must | src/styles/global.css:1 | Built CSS is 118 KB (about 21 KB gzipped, 1,300+ rules). Tailwind v4 scans every file in the site folder that is not git-ignored: `package-lock.json` hashes, `dist-design/`, `dist-customers/`, `tmp-*/`, `README.md`, screenshots. It emits utilities such as `-bg-conic`, `-mt-16` and hash fragments like `.006`. The page only uses about 200 rules. | Render-blocking CSS on every page, on the page that must score well on speed for SEO. Same defect will hit every site made from this template. | Replace line 1 with `@import "tailwindcss" source(none);` and add `@source "../";` (path is relative to the CSS file, so it points at `src/`). I built a copy with this change: CSS drops from 118 KB to 23 KB and `lg:grid-cols-*` classes are still present. Fix it in the template too. |
| 2 | should | src/components/Tool.astro:98, 201, 206 | `Src` has fields `name` and `sample` that nothing reads after `setSource` stores them. `setSource` takes `name` and `sample` only to build the status line. | Dead state invites a reader to look for where it is used. | Drop `name` and `sample` from the `Src` type and from the stored object. Keep the parameters, they feed the status text. |
| 3 | should | src/components/Tool.astro:184-199 | `decode()` has an `Image()` fallback for when `createImageBitmap` throws. `prepareJpeg` (line 276) calls `createImageBitmap` again with no fallback. A file that needs the fallback loads, previews, then fails at Download with the generic error. | The 14-line fallback adds a path that cannot complete the job anyway. It hides an unsupported file until the last step. | Remove the fallback and let `decode` fail fast with the existing "This browser cannot open that file" message. Or, if the fallback matters, give `prepareJpeg` the same one. Prefer deleting. |
| 4 | nice | src/components/Tool.astro:115 and 251 | The step rule `m === 'across' ? 1 : unit === 'in' ? 1 : 2` is written twice. | One rule in two places can drift apart. | `const stepFor = (m) => (m === 'across' || unit === 'in' ? 1 : 2);` and use it in both. |
| 5 | nice | src/pages/index.astro:25-29 | `BreadcrumbList` JSON-LD with a single item (the home page itself). | A one-item breadcrumb gives no rich result and adds markup to the page. | Delete the block. Keep `WebApplication` and `FAQPage`. |
| 6 | nice | src/lib/pdf.js:53 | `typeof setTimeout === 'function'` guard. `setTimeout` exists in every browser and in Node 18+. | Dead condition. | Use `await new Promise((res) => setTimeout(res, 0));`. |
| 7 | nice | src/lib/pdf.js:15, scripts/test.mjs | The PNG branch of `embedPng` is never used in the browser: `prepareJpeg` always re-encodes to JPEG. Only the tests feed PNG. | Test-only path in production code. | Acceptable as is (the 1x1 PNG is the easy test fixture). Alternative: delete the branch and use a tiny JPEG fixture. Low value, optional. |
| 8 | nice | src/styles/global.css:46 | `.prose-site h3` rule: no `<h3>` exists in any article or legal page. | Unused rule. Minor after fix 1, which does not remove hand-written CSS. | Delete the line. |
| 9 | nice | src/lib/tile.js:10, 22, 36 | `MAX_SHEETS`, `rowLabel` and `describeQuality` are exported but only the tests import them. | Wider public surface than needed. | Fine to keep for tests. Mention only, no action needed. |
| 10 | nice | src/layouts/Base.astro:22 and src/site.config.ts:10 | `<meta name="keywords">` fed by `site.keywords` and `site.keyword`. Search engines ignore this tag. | Dead config and markup. This is a template item, so fix it there, not per site. | Drop the tag and the `keywords` array in the template. Keep `site.keyword` for the title. |

## Checked and fine (no action)

- `pdf-lib` is dynamically imported on click (`es.*.js`, 428 KB), so it does not load with the page. Good.
- Tool script is 12 KB built, no extra dependencies. `tile.js` and `pdf.js` are small and every export is used.
- All imports in `Tool.astro`, `pdf.js` and `tile.js` are used.
- No leftover template demo code found in this tool's own files (`Tool.astro`, `lib/`, `data/faq.ts`, `Article.astro`).
- Paper list has six sizes while the spec lists three. The extras cost four lines and the FAQ and article already name them, so I did not flag it.
