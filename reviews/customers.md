# Mock customer test: Print Large Poster (poster-tiler)

Tested on the built page (own build folder, port 4477) with playwright-cli. Each persona used real files and values. I downloaded real PDFs for personas 1, 2 and 5 and checked page 1 of the PDF (label A1, cut marks, picture) with a thumbnail render.

## Persona 1: Linda, 52, 4th grade teacher, laptop 1280x800 (beginner)
Task: make a classroom poster from a child's drawing (1200x1600 px).
She lands on the page, sees "Print a poster on multiple pages" and a sample poster already split into A1 to B3. That tells her what the tool does in two seconds. She clicks Choose an image, picks the file, and the grid updates. She wants 24 inches wide, so she clicks Width and types 24. It says 4 x 4 = 16 sheets, 50 dpi, blurry. She clicks Download PDF and gets "poster-4x4-pages.pdf".
- Click it on Google? "Yes. 'Free, private, no watermark' is exactly what I search for. I have been burned by sites that add a logo on every page."
- Under 30 seconds? "Yes, about 25 seconds, but only because the sample showed me what to expect."
- Confused: "Printer margin and overlap. I do not know what to type. The small note helps, but I just left the numbers." Also: "It says 'blurry' but my drawing is only 1200 pixels. What should I do? I cannot make the picture bigger." And the tip about making the poster 2 in shorter: "How do I do that? I want it to snap to whole pages."
- To bookmark: poster size presets (18x24, 24x36), and a clear "your picture is too small" answer with the biggest good size.
- Trust: "Yes, the preview matches the PDF and page 1 has marks and a label. I would still print one page first."
- Come back: "Yes, for every bulletin board project."

## Persona 2: Maria, 34, mom, iPhone-size phone 390x844 (beginner)
Task: blow up her daughter's drawing photo for a bedroom wall.
The page is clean on the phone, no sideways scroll. The upload button is at the top and the preview sits right under it. After she picks the photo, the grid appears at once. The preview is small (about 160 px wide for a portrait poster) but the A1, B2 labels are readable. She taps minus on Pages across to get fewer sheets: 2 x 3, 77 dpi, "a little soft up close". The Download button is about 1,700 px down the page, so she scrolls past paper, size, margin, overlap and three checkboxes to reach it.
- Click it on Google? "Probably. I would pick the one that says free and no sign-up."
- Under 30 seconds? "No, about 50 seconds. A lot of scrolling on my phone."
- Confused: "The bottom row is mostly gray stripes. Is that part of my poster?" "'Save 2 sheets' text, I do not know what to do with it." "What does Pages across mean?"
- To bookmark: a Download button that stays visible, and a short sentence on how to print from a phone (AirPrint, 100%).
- Trust: "I trust it because it says my photo stays on my phone."
- Come back: "Yes, if it stays this easy."

## Persona 3: Dave, 41, crafter who sells wall decals, desktop 1440x900 (expert)
Task: 120 cm wide banner from a 6000x4000 photo, A4 landscape, 1 cm margin, 1.5 cm overlap.
He picks A4, Landscape, Centimeters, Width, types 120, 1 and 1.5. Result: 5 x 5 = 25 sheets, 120 x 80 cm, 127 dpi good. Units switch correctly and the values convert. He tries bad input: 0 and empty give "Enter a poster size", 9999 gives "needs 145542 sheets, the limit is 200", a 20 cm margin gives "margin is too large", a negative gives a clear message. All fine.
- Click it on Google? "Yes, because it does cm and A4 and shows the grid."
- Under 30 seconds? "Yes, about 20 seconds."
- Confused: "The last column and last row are mostly empty. The poster 120 x 80 needs 25 sheets, but with a smart split it could be 20." "When there is an error, the stats cards still show the old numbers." "No way to say 4 x 3 pages and let it crop or scale the picture."
- To bookmark: fit to N x M pages, crop or position the image on the grid, custom paper size, rotate image, and a "make poster X cm narrower" button instead of text.
- Trust: "Yes. Numbers add up. dpi is useful."
- Come back: "Yes, if I can lock to whole pages."

## Persona 4: Jess, 29, parent, Android phone 360x780 (beginner to intermediate)
Task: birthday banner "HAPPY BIRTHDAY EMMA" from a wide image (1600x400), one row of pages.
She finds Height, types 8, picks Landscape. It builds 4 pages across, 1 down. The preview strip is thin on the phone but readable. She sees the text is cut by the page edge in the 4th page, which is mostly empty. The tip says "Make the poster 2 in narrower to save 1 sheets."
- Click it on Google? "Yes. 'Print banner on multiple pages' is what I would type, and the page says banner in the FAQ."
- Under 30 seconds? "About 45 seconds, because I had to guess to use Height."
- Confused: "Why Height for a banner? I thought it would ask for width." "'1 sheets' reads wrong." "4th page is almost empty, I do not want to print it."
- To bookmark: a Banner shortcut (one row) and a way to set the number of pages across and down at once.
- Trust: "Mostly. The blurry warning was honest."
- Come back: "Yes, for every party."

## Persona 5: Tom, 67, retired, uses laptop 1366x768 and dark mode (beginner)
Task: print a map poster. He does not read much text. He clicks the moon icon (dark mode works, good contrast), clicks Choose an image, tries a file that is not a picture (a .heic-named text file) and gets "This browser cannot open that file. Try a JPG or PNG image." The Download button stays on and still prints the sample picture. He turns on the assembly map and gets 7 pages with the map.
- Click it on Google? "I would click the first result. This looks simple."
- Under 30 seconds? "No. About 1 minute. I did not see where the Download button was. It is under the fold on my laptop."
- Confused: "I did not understand the sample picture is not mine. The button says Download PDF even before I pick my file." "Fit to page warning is small gray text."
- To bookmark: a big first step, the Download button visible without scrolling, and the print warning in bold.
- Trust: "I trust it, nothing asks for my email."
- Come back: "Yes if my daughter shows me again."

## Ranked change list

### Must
1. Make the Download button easy to find on phones and small laptops (sticky bottom bar on phones, or move a second Download button next to the preview/stats). Asked by 4 of 5 (Linda, Maria, Tom, Jess).
2. Fix and strengthen the "last row/column is almost empty" advice. Add a button that applies it ("Make it 22.5 in wide, save 4 sheets") instead of text only. Fix the grammar "save 1 sheets". Asked by 5 of 5.
3. Help with low-quality images: tell the person what to do (smaller poster size that gives 100 dpi, shown as one click) when quality is "low" or "blurry". Asked by 3 of 5 (Linda, Dave, Jess).
4. Make the print instruction impossible to miss: "Print at 100% / Actual size, not Fit to page" as a bold line near Download and again after the PDF is made. Asked by 3 of 5 (Tom, Linda, Maria).

### Should
5. Plain-language help for Printer margin and Overlap (a "?" with one sentence, or label "Glue strip"). Asked by 3 of 5 (Linda, Maria, Dave in the sense of defaults).
6. A Banner shortcut (one row) and a "pages across x pages down" option. Asked by 3 of 5 (Jess, Dave, Linda).
7. Poster size presets (18x24, 24x36, 27x40). Asked by 2 of 5 (Linda, Maria).
8. Show clearly when the sample is still in use: label the button "Download sample PDF" or disable until a file is chosen. Asked by 2 of 5 (Tom, Maria).
9. When an error appears, grey out or clear the stats cards so old numbers do not mislead. Asked by 2 of 5 (Dave, Tom).
10. Short phone print note (AirPrint or share to the printer app, 100%). Asked by 1 of 5 (Maria).

### Nice
11. Crop and position the image on the grid, custom paper size, rotate image. Asked by 1 of 5 (Dave).
12. Make the phone preview a little bigger and let the preview tap-zoom. Asked by 1 of 5 (Jess).
13. Remember last paper and unit between visits. Asked by 1 of 5 (Dave).

## What worked
- Sample poster on load shows the idea instantly. No sideways scroll on 360 and 390 widths. Dark mode is readable.
- Real PDF built in the browser: labels, cut marks and picture present on page 1. Messages for bad input are clear.
- Privacy message "stays on your device" came up as a trust point in 4 of 5 stories.
