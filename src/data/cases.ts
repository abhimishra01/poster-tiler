// Landing pages for common poster jobs. Each one starts the tool on its own preset and has its own text.
// The tables on each page are computed from the same math as the tool (src/lib/tile.js), at build time.
// shape is the width and height of the sample picture, so the sample has the same shape as the page's poster.
// fit 'fill' crops the picture to the exact poster size w x h (inches).
export type Preset = { paper: string; orient: 'portrait' | 'landscape'; mode: 'across' | 'width' | 'height'; value: number; unit: 'in'; shape: [number, number]; fit?: 'fill'; w?: number; h?: number };
export type Table =
  | { kind: 'sizes'; caption: string; sizes: { w: number; h: number }[]; papers: [string, string][] }
  | { kind: 'across'; caption: string; pages: number; shapes: [number, number, string][] };
export type Case = {
  slug: string;
  title: string;           // under 45 characters, the site name is added after it
  h1: string;
  description: string;
  preset: Preset;
  sheets: number;          // the sheet count the page text promises for the preset; scripts/test.mjs checks it against the math
  intro: string[];
  table: Table;
  sections: { h: string; p?: string[]; ul?: string[] }[];
  faq: { q: string; a: string }[];
  related: string[];
};

export const cases: Case[] = [
  {
    slug: '24x36-poster-on-letter-paper',
    title: 'Print a 24x36 Poster on Letter Paper',
    h1: 'Print a 24 x 36 inch poster on Letter paper',
    description: 'A 24 x 36 inch poster takes 16 Letter sheets in portrait or 15 in landscape. Split your image into a PDF, free, with no watermark.',
    sheets: 16,
    preset: { paper: 'letter', orient: 'portrait', mode: 'width', value: 24, unit: 'in', shape: [2, 3], fit: 'fill', w: 24, h: 36 },
    intro: [
      '24 x 36 inches is the standard movie poster size, and it is the size most people mean when they ask for a "big poster". A home printer cannot print it in one piece. You print it as tiles on Letter paper and join the sheets.',
      'With a 0.25 inch printer margin and a 0.5 inch glue overlap, a 24 x 36 inch poster takes 16 Letter sheets in portrait (4 across, 4 down) or 15 sheets in landscape (3 across, 5 down). The tool below is already set to a 24 inch wide poster on portrait Letter. Add your image and it fills in the rest.',
    ],
    table: { kind: 'sizes', caption: 'Sheets for a 24 x 36 inch poster', sizes: [{ w: 24, h: 36 }, { w: 36, h: 24 }], papers: [['letter', 'Letter'], ['tabloid', 'Tabloid (11 x 17)']] },
    sections: [
      { h: 'Which layout should you pick?', p: [
        'Landscape saves one sheet on a 24 x 36 inch portrait poster, because 3 landscape sheets across cover the width with less waste than 4 portrait sheets. Check the thin strip warning in the tool. If the last row holds only a sliver of picture, the tool offers a slightly smaller poster that saves a whole row.',
        'If you have a printer that takes Tabloid (11 x 17 inch) paper, the same poster needs only 9 sheets in portrait, which means fewer seams.' ] },
      { h: 'What image size do you need?', p: [
        'For a 24 inch wide poster, you need about 3600 pixels across to reach 150 dpi. A recent phone photo is usually 3000 to 4000 pixels wide, so it is close. If the tool shows a dpi below 100, expect soft edges up close. From across a room it still looks fine.' ] },
      { h: 'Hanging a 16 sheet poster', ul: [
        'Lay the sheets on a clean floor in the grid order (A1, A2, A3, A4 in the top row).',
        'Glue or tape from the back, one row at a time. Join the rows last.',
        'Mount the finished poster on foam board or hang it with removable strips, so the seams do not sag.' ] },
    ],
    faq: [
      { q: 'How many Letter pages make a 24 x 36 inch poster?', a: 'With a 0.25 inch margin and a 0.5 inch overlap, 16 sheets in portrait (4 x 4) or 15 sheets in landscape (3 x 5). A smaller overlap or margin can lower the count.' },
      { q: 'Is a 24 x 36 inch poster the same on A4 paper?', a: 'Almost. A4 is a little narrower than Letter and a little taller, but the count at this size is the same: 16 in portrait or 15 in landscape. See the A4 page for details.' },
      { q: 'Can I print it with no overlap?', a: 'Yes. Set the overlap to 0. The sheets then butt together. Joining is harder, and small printer errors show as gaps, so a thin overlap is easier for most people.' },
    ],
    related: ['24x36-poster-on-a4-paper', '18x24-poster-on-letter-paper', '36x48-poster-on-letter-paper'],
  },
  {
    slug: '18x24-poster-on-letter-paper',
    title: 'Print an 18x24 Poster on Letter Paper',
    h1: 'Print an 18 x 24 inch poster on Letter paper',
    description: 'An 18 x 24 inch poster takes 9 Letter sheets in portrait or 8 in landscape. Free PDF tiler with overlap, cut marks and page labels.',
    sheets: 9,
    preset: { paper: 'letter', orient: 'portrait', mode: 'width', value: 18, unit: 'in', shape: [3, 4], fit: 'fill', w: 18, h: 24 },
    intro: [
      '18 x 24 inches is a common size for school projects, science fair boards and wall prints. It is also the largest size that stays easy to handle on a table. You can lay it out and glue it in one sitting.',
      'On Letter paper with a 0.25 inch margin and a 0.5 inch overlap, the poster takes 9 sheets in portrait (3 across, 3 down). In landscape it takes 8 sheets (2 across, 4 down). The tool is set to 18 inches wide. Add your picture to see the grid.',
    ],
    table: { kind: 'sizes', caption: 'Sheets for an 18 x 24 inch poster', sizes: [{ w: 18, h: 24 }, { w: 24, h: 18 }], papers: [['letter', 'Letter'], ['tabloid', 'Tabloid (11 x 17)']] },
    sections: [
      { h: 'Why landscape wins here', p: [
        'Two landscape sheets cover 18 inches across with their overlap. The extra sheet in portrait only adds waste. Landscape cuts one sheet and one seam. The cost is a longer column of 4 sheets. If your poster is wider than it is tall, flip the numbers and the same logic applies.' ] },
      { h: 'Best uses', ul: [
        'Science fair title banners and project boards.',
        'A map or a timeline for a classroom wall.',
        'Fan art, a child\'s drawing or a family photo for a bedroom.' ] },
      { h: 'Resolution for 18 inches', p: [
        'You need about 2700 pixels across for 150 dpi at 18 inches wide. Most phone photos are larger. Screenshots and web images often are not, so check the dpi line in the tool before you print 9 sheets.' ] },
    ],
    faq: [
      { q: 'How many sheets is an 18 x 24 inch poster?', a: '9 Letter sheets in portrait (3 x 3) or 8 in landscape (2 x 4), with a 0.25 inch margin and a 0.5 inch overlap. On Tabloid paper it takes 4.' },
      { q: 'Can I print 18 x 24 on A4?', a: 'Yes. Choose A4 in the paper list. The counts are the same as for Letter at this size.' },
      { q: 'Should I print a test page first?', a: 'Yes. The test page button prints only page A1. Measure it, check your margins, and then print the other sheets.' },
    ],
    related: ['24x36-poster-on-letter-paper', 'poster-on-4-pages-2x2', 'classroom-bulletin-board-poster'],
  },
  {
    slug: '36x48-poster-on-letter-paper',
    title: 'Print a 36x48 Poster on Letter Paper',
    h1: 'Print a 36 x 48 inch poster on Letter paper',
    description: 'A 36 x 48 inch poster takes 25 Letter sheets in portrait or 28 in landscape. Plan the sheets, the glue and the wall space first.',
    sheets: 25,
    preset: { paper: 'letter', orient: 'portrait', mode: 'width', value: 36, unit: 'in', shape: [3, 4], fit: 'fill', w: 36, h: 48 },
    intro: [
      '36 x 48 inches is a large poster, about the width of a doorway. On Letter paper with a 0.25 inch margin and a 0.5 inch overlap, it takes 25 sheets in portrait (5 x 5). Landscape needs more, 28 sheets (4 x 7), so portrait is the better choice here.',
      'This is the point where paper size matters. If you can print on Tabloid (11 x 17 inch), the same poster needs 12 sheets in portrait (4 across, 3 down). The tool is set to 36 inches wide. Change the paper to compare.',
    ],
    table: { kind: 'sizes', caption: 'Sheets for a 36 x 48 inch poster', sizes: [{ w: 36, h: 48 }, { w: 48, h: 36 }], papers: [['letter', 'Letter'], ['tabloid', 'Tabloid (11 x 17)']] },
    sections: [
      { h: 'Before you print 25 sheets', ul: [
        'Print the test page (A1 only) and measure it with a ruler.',
        'Check that the ink or toner will last. A full color page uses a lot.',
        'Use draft or economy mode for the first pass if you only want to check the layout.' ] },
      { h: 'Image quality at this size', p: [
        'At 36 inches wide, 150 dpi needs 5400 pixels across. Most phone photos give about 100 dpi here. That looks fine from 6 feet away, and soft at arm\'s length. A poster this large is rarely read up close, so 100 dpi is usually acceptable. Below 72 dpi it looks blurry.' ] },
      { h: 'Putting it together', p: [
        'Work in rows. Glue the sheets of one row into a strip, then join the strips. This keeps errors small. Use a large table or a clean floor. A rolling pin or a ruler helps flatten the seams.',
        'Hang it with painter\'s tape on a wall you can reach with a step stool, or mount it on a foam board in two or three pieces.' ] },
    ],
    faq: [
      { q: 'How many sheets is a 36 x 48 inch poster?', a: '25 Letter sheets in portrait (5 x 5), 28 in landscape (4 x 7), or 12 on Tabloid paper in portrait (3 x 4), with a 0.25 inch margin and a 0.5 inch overlap.' },
      { q: 'Is it cheaper to print at a copy shop?', a: 'Often, yes, if you just need one. A copy shop can print a 36 x 48 inch sheet in one piece. This tool is for when you have no shop nearby, want it today, or want the poster in pieces to carry or to mount in sections.' },
      { q: 'What about the 200 sheet limit?', a: 'The tool stops at 200 sheets in one PDF. A 36 x 48 inch poster is far below that.' },
    ],
    related: ['24x36-poster-on-letter-paper', 'poster-on-9-pages-3x3', 'large-map-on-multiple-pages'],
  },
  {
    slug: '24x36-poster-on-a4-paper',
    title: 'Print a 24x36 Poster on A4 Paper',
    h1: 'Print a 24 x 36 inch poster on A4 paper',
    description: 'A 24 x 36 inch (61 x 91 cm) poster takes 16 A4 sheets in portrait or 15 in landscape. Free PDF tiler, no watermark.',
    sheets: 16,
    preset: { paper: 'a4', orient: 'portrait', mode: 'width', value: 24, unit: 'in', shape: [2, 3], fit: 'fill', w: 24, h: 36 },
    intro: [
      'A 24 x 36 inch poster is about 61 x 91 cm. On A4 paper (210 x 297 mm) with a 0.25 inch (6 mm) margin and a 0.5 inch (13 mm) overlap, it takes 16 sheets in portrait (4 across, 4 down) or 15 in landscape (3 across, 5 down).',
      'The tool opens set to A4 and a 24 inch wide poster. Switch the units to centimeters if you prefer to type 61 cm.',
    ],
    table: { kind: 'sizes', caption: 'Sheets for a 24 x 36 inch (61 x 91 cm) poster', sizes: [{ w: 24, h: 36 }, { w: 36, h: 24 }], papers: [['a4', 'A4'], ['a3', 'A3 (297 x 420 mm)']] },
    sections: [
      { h: 'A4 compared with Letter', p: [
        'A4 is 8.27 x 11.69 inches. Letter is 8.5 x 11. A4 is narrower and taller, so A4 tiles are a bit taller than Letter tiles. At this size the totals are the same, but the grid shape can differ on other sizes. The preview shows your exact grid.' ] },
      { h: 'Using A3 instead', p: [
        'If your printer takes A3, the same poster needs 9 sheets in portrait (3 x 3). That is 7 fewer sheets to glue. Many print shops also print A3 for a small fee, which can make a home printer plus a trip to the shop a good mix.' ] },
      { h: 'Print settings that matter on A4', ul: [
        'Choose A4 as the paper size in the print dialog, not Letter.',
        'Set scale to 100%, or Actual size. Never Fit to page.',
        'Turn off any "borderless" mode unless you set the printer margin to 0 in the tool.' ] },
    ],
    faq: [
      { q: 'How many A4 pages for a poster 61 x 91 cm?', a: '16 sheets in portrait or 15 in landscape, with a 6 mm margin and a 13 mm overlap.' },
      { q: 'Can I type the size in centimeters?', a: 'Yes. Pick Centimeters under the poster size. The tool stores the size in inches, so switching back and forth does not change the numbers.' },
      { q: 'Does the tool fit the A4 paper in a different country?', a: 'The paper size is the same everywhere. Only the unit labels change. The tool works the same in the UK, Canada, Australia and elsewhere.' },
    ],
    related: ['a4-poster-3x3-pages', '24x36-poster-on-letter-paper', '18x24-poster-on-letter-paper'],
  },
  {
    slug: 'a4-poster-3x3-pages',
    title: 'A4 Poster on 3 x 3 Pages (9 Sheets)',
    h1: 'Make an A4 poster from 3 x 3 pages',
    description: 'Nine A4 sheets make a poster about 22 inches (57 cm) wide. See the size for your picture shape and download a free PDF.',
    sheets: 9,
    preset: { paper: 'a4', orient: 'portrait', mode: 'across', value: 3, unit: 'in', shape: [4, 5] },
    intro: [
      'Nine A4 sheets in a 3 x 3 grid are the most popular home poster. It is big enough to fill a wall, and small enough to glue on a kitchen table. With a 6 mm margin and a 13 mm overlap, three A4 sheets side by side cover 22.3 inches (57 cm).',
      'The height depends on your picture. A 3:4 portrait photo fills 3 x 3 sheets exactly, giving a poster of 22.3 x 29.7 inches (57 x 75 cm). A square picture makes 22.3 x 22.3 inches and also uses 9 sheets. The tool is set to 3 pages across on A4.',
    ],
    table: { kind: 'across', caption: 'Poster size with 3 pages across', pages: 3, shapes: [[1, 1, 'Square'], [3, 4, '3:4 portrait'], [2, 3, '2:3 portrait'], [3, 2, '3:2 landscape']] },
    sections: [
      { h: 'Choosing the shape of your picture', p: [
        'In Fit mode the tool keeps the shape of your image and does not crop. The number of pages down comes from the shape. If you want exactly 3 x 3, crop your picture to a 3:4 portrait in a photo app first. A tall 2:3 picture makes 3 x 4, which is 12 sheets.' ] },
      { h: 'Margins and overlap on A4', p: [
        'Most home printers lose about 6 mm at each edge. Keep the margin at 0.25 inch unless your printer manual says it can print closer. If you set the margin to 0, borderless printing can cut off part of the picture or shift it.' ] },
      { h: 'Finishing', ul: [
        'Trim the white edge along the solid marks.',
        'Place each sheet over its left and upper neighbor. The overlap hides small errors.',
        'Tape from behind first, then add glue along the seams if the poster will hang for months.' ] },
    ],
    faq: [
      { q: 'How big is a poster made of 9 A4 sheets?', a: 'About 22.3 inches (57 cm) wide, and between 22 and 30 inches (57 to 75 cm) tall for a square or 3:4 picture. Those numbers assume a 6 mm margin and a 13 mm overlap.' },
      { q: 'What if I want it to be taller?', a: 'Use more pages across, or pick the Height setting and enter the size you want. The tool works out the sheets.' },
      { q: 'Can I use Letter instead?', a: 'Yes. Pick Letter in the paper list. Three Letter sheets across give a poster 23 inches wide.' },
    ],
    related: ['24x36-poster-on-a4-paper', 'poster-on-9-pages-3x3', 'poster-on-4-pages-2x2'],
  },
  {
    slug: 'poster-on-4-pages-2x2',
    title: 'Print a Poster on 4 Pages (2 x 2)',
    h1: 'Print a poster on 4 pages (2 x 2)',
    description: 'Four Letter sheets make a poster of about 15.5 x 20 inches. Quick, cheap and easy to glue. Free tiler with no watermark.',
    sheets: 4,
    preset: { paper: 'letter', orient: 'portrait', mode: 'across', value: 2, unit: 'in', shape: [4, 5] },
    intro: [
      'A 2 x 2 poster is the easiest tiled poster to make. It takes four sheets, one seam each way, and about ten minutes. With a 0.25 inch margin and a 0.5 inch overlap, two Letter sheets across cover 15.5 inches.',
      'A 4:5 picture makes a poster of 15.5 x 19.4 inches on exactly 4 sheets. A 3:4 picture is a little taller (15.5 x 20.7 inches) and needs 6 sheets. The tool is set to 2 pages across on Letter.',
    ],
    table: { kind: 'across', caption: 'Poster size with 2 pages across', pages: 2, shapes: [[1, 1, 'Square'], [3, 4, '3:4 portrait'], [2, 3, '2:3 portrait'], [3, 2, '3:2 landscape']] },
    sections: [
      { h: 'When 2 x 2 is the right size', ul: [
        'A framed print for a desk or a shelf.',
        'A door sign or a locker poster.',
        'A first try, to see how your printer handles the marks and the margin.' ] },
      { h: 'A trick for an exact 4 sheets', p: [
        'If your picture is taller than 4:5, the tool may need 2 x 3 sheets. Look at the thin strip tip under the preview. Press Apply to shrink the poster a little. If that gives you 2 x 2, you save two sheets and lose only a narrow strip of height.' ] },
      { h: 'Image quality', p: [
        'At 15.5 inches wide, 150 dpi needs only 2325 pixels. Almost every phone photo and many web images pass. This is the size where a low-resolution image looks best.' ] },
    ],
    faq: [
      { q: 'How big is a poster on 4 sheets?', a: 'About 15.5 inches (39 cm) wide on Letter, with the height set by your picture. A 4:5 picture gives 15.5 x 19.4 inches on 4 sheets. A square picture gives 15.5 x 15.5 inches on 4 sheets too.' },
      { q: 'Do I need cut marks for four sheets?', a: 'They help. The marks show where to trim and which edges to leave uncut for the glue strip. You can turn them off in the options.' },
      { q: 'How do I join the sheets?', a: 'Trim the white edge along the solid marks. Then lay each sheet over its left and upper neighbor at the overlap, line up the picture, and tape.' },
    ],
    related: ['poster-on-9-pages-3x3', '18x24-poster-on-letter-paper', 'a4-poster-3x3-pages'],
  },
  {
    slug: 'poster-on-9-pages-3x3',
    title: 'Print a Poster on 9 Pages (3 x 3)',
    h1: 'Print a poster on 9 pages (3 x 3)',
    description: 'Nine Letter sheets make a poster about 23 inches wide. See the size for your picture and get a free PDF with cut marks.',
    sheets: 9,
    preset: { paper: 'letter', orient: 'portrait', mode: 'across', value: 3, unit: 'in', shape: [4, 5] },
    intro: [
      'A 3 x 3 grid uses nine sheets and gives you a poster you can see from across a room. With Letter paper, a 0.25 inch margin and a 0.5 inch overlap, three sheets across cover 23 inches.',
      'Height depends on your picture. A square picture makes 23 x 23 inches and uses 9 sheets. A 3:4 picture makes 23 x 30.7 inches and takes 12 Letter sheets (3 x 4), or 9 sheets on Legal paper. The tool is set to 3 pages across.',
    ],
    table: { kind: 'across', caption: 'Poster size with 3 pages across', pages: 3, shapes: [[1, 1, 'Square'], [3, 4, '3:4 portrait'], [2, 3, '2:3 portrait'], [3, 2, '3:2 landscape']] },
    sections: [
      { h: 'Square pictures fill 3 x 3', p: [
        'For a Letter poster that is exactly 9 sheets, use a square picture or a picture only slightly taller than wide. A 3:2 landscape picture is only 2 sheets tall, so 3 x 2 gives 6 sheets. A 2:3 portrait is 4 sheets tall, so it needs 12.' ] },
      { h: 'Paper choices', p: [
        'On Tabloid paper, three pages across cover 30.5 inches, and a 3:4 picture takes 9 sheets. On Legal paper, 3 pages across cover 23 inches and a 2:3 picture takes 9 sheets. Pick the paper that suits your printer and compare the grid in the preview.' ] },
      { h: 'Order of work', ul: [
        'Print all nine pages in one go so the colors match.',
        'Number them on the back if you do not use the page labels.',
        'Glue row by row, top row first, and keep the rows straight with a ruler.' ] },
    ],
    faq: [
      { q: 'How big is a poster on 9 Letter sheets?', a: 'About 23 inches (58 cm) wide. A square picture makes it 23 inches tall, and a 3:4 picture makes it 30.7 inches tall (12 Letter sheets, or 9 on Legal or Tabloid).' },
      { q: 'How do I get exactly 3 x 3?', a: 'Crop your picture to a square first, or choose a Height that gives three rows. The tool shows sheets and size at once, so you can try values.' },
      { q: 'Should I print double-sided?', a: 'No. Print one side. Page labels and marks are on the front.' },
    ],
    related: ['poster-on-4-pages-2x2', 'a4-poster-3x3-pages', '36x48-poster-on-letter-paper'],
  },
  {
    slug: 'print-banner-on-multiple-pages',
    title: 'Print a Banner on Multiple Pages',
    h1: 'Print a banner on multiple pages',
    description: 'Make a long banner from Letter or A4 sheets in one row. Set the height to one page and the tool builds the strip. Free, private, no watermark.',
    sheets: 5,
    preset: { paper: 'letter', orient: 'landscape', mode: 'height', value: 8, unit: 'in', shape: [6, 1] },
    intro: [
      'A banner is a poster that is one page tall. Use it for birthdays, welcome signs, team names and classroom headers. You print one sheet for each section and join them in a row.',
      'On landscape Letter paper with a 0.25 inch margin, one page shows 8 inches of height. A 48 x 8 inch banner takes 5 sheets, and a 36 x 8 inch banner takes 4. The tool is set to a height of 8 inches on landscape Letter. Add a wide picture and it builds a single row.',
    ],
    table: { kind: 'sizes', caption: 'Sheets for banners that are 8 inches tall (landscape Letter)', sizes: [{ w: 24, h: 8 }, { w: 36, h: 8 }, { w: 48, h: 8 }, { w: 72, h: 8 }], papers: [['letter', 'Letter, landscape']] },
    sections: [
      { h: 'Make a banner image', p: [
        'Create a very wide picture, for example 4800 x 800 pixels, in any design app. Put the words at least 1 inch from the top and bottom so they stay inside the printable area. Export as PNG or JPG.' ] },
      { h: 'Letters that stay in one piece', p: [
        'Seams cut across letters. Leave a gap between words and try to put the seams in the gaps. The preview shows where every seam falls, so you can nudge the poster width until a seam lands between words.' ] },
      { h: 'Hanging a banner', ul: [
        'Glue the sheets to a strip of ribbon or kraft paper so the banner does not sag.',
        'Use painter\'s tape or removable hooks on the wall.',
        'For outdoors, laminate the sheets or use a poly sleeve against rain.' ] },
    ],
    faq: [
      { q: 'How do I get one row of pages?', a: 'Choose the Height setting and enter a value no taller than one page, for example 8 inches on landscape Letter. The tool then builds one row.' },
      { q: 'How many sheets for a 6 foot banner?', a: 'A 72 x 8 inch banner takes 8 landscape Letter sheets with a 0.5 inch overlap. The preview shows the exact count for your picture shape.' },
      { q: 'Should the picture be wide?', a: 'Yes. In Fit mode the tool does not crop. A square picture at 8 inches tall makes a banner only 8 inches wide.' },
    ],
    related: ['classroom-bulletin-board-poster', 'large-map-on-multiple-pages', 'poster-on-4-pages-2x2'],
  },
  {
    slug: 'classroom-bulletin-board-poster',
    title: 'Print a Classroom Bulletin Board Poster',
    h1: 'Print a classroom bulletin board poster',
    description: 'Enlarge a drawing, chart or border to fit a bulletin board using Letter or A4 sheets. Free, private and without a watermark.',
    sheets: 15,
    preset: { paper: 'letter', orient: 'portrait', mode: 'width', value: 36, unit: 'in', shape: [3, 2], fit: 'fill', w: 36, h: 24 },
    intro: [
      'Teachers often need a big picture for a bulletin board: a map of the world, a number line, a seasonal tree or a character from a book. School printers handle Letter or A4 sheets. This tool splits a picture over as many sheets as you need.',
      'A common bulletin board is 36 x 48 inches, or 3 x 4 feet. A 36 inch wide picture takes 5 sheets across on Letter paper. A 24 inch wide picture takes 4. A 36 x 24 inch piece takes 15 sheets in all. The tool is set to 36 inches wide. Change the width to match your board.',
    ],
    table: { kind: 'sizes', caption: 'Sheets for common bulletin board pieces', sizes: [{ w: 24, h: 18 }, { w: 36, h: 24 }, { w: 36, h: 48 }, { w: 48, h: 36 }], papers: [['letter', 'Letter, portrait'], ['tabloid', 'Tabloid, portrait']] },
    sections: [
      { h: 'Let students do the gluing', p: [
        'A tiled poster is a good group job. Give each student or pair one sheet to color or decorate before the sheets are joined. The labels (A1, A2, B1) tell them where their piece goes. Print a clean copy for the board, and let the class color a second set.' ] },
      { h: 'Save toner and paper', ul: [
        'Use a drawing with a white background. Large colored areas use a lot of toner.',
        'Turn off the assembly map page for classroom sets.',
        'Use the test page button to check the size before you print 20 copies.' ] },
      { h: 'Borders and titles', p: [
        'For a border, make a long strip. Set the height to one page and see the Banner page for details. For a title, use a wide picture of the words and make it 8 inches tall.' ] },
    ],
    faq: [
      { q: 'How big is a standard bulletin board?', a: 'Common sizes are 24 x 36, 36 x 48 and 48 x 72 inches. Measure yours and enter the width or height in the tool.' },
      { q: 'Can students use this on a school computer?', a: 'Yes. It runs in the browser. No sign-up, no app, and the image does not leave the computer.' },
      { q: 'Do I need to install anything?', a: 'No. Open the page, add the picture, and download the PDF. Print it from your PDF viewer at 100% scale.' },
    ],
    related: ['print-banner-on-multiple-pages', '18x24-poster-on-letter-paper', 'large-map-on-multiple-pages'],
  },
  {
    slug: 'large-map-on-multiple-pages',
    title: 'Print a Large Map on Multiple Pages',
    h1: 'Print a large map on multiple pages',
    description: 'Print a wall map, a floor plan or a game map across many sheets. Overlap and labels help you line up fine details. Free and private.',
    sheets: 16,
    preset: { paper: 'letter', orient: 'landscape', mode: 'width', value: 36, unit: 'in', shape: [3, 2], fit: 'fill', w: 36, h: 24 },
    intro: [
      'Maps have thin lines and small text, so seams matter more than on a photo. A wall map, a floor plan, a battle map for a tabletop game or a trail map for a group trip all work better on one big sheet. You can build one from Letter or A4 pages.',
      'A 36 x 24 inch map takes 16 landscape Letter sheets (4 x 4), or 15 portrait sheets (5 x 3). On Tabloid paper it takes 9 in landscape (3 x 3). The tool is set to 36 inches wide on landscape Letter.',
    ],
    table: { kind: 'sizes', caption: 'Sheets for common map sizes', sizes: [{ w: 24, h: 18 }, { w: 36, h: 24 }, { w: 48, h: 36 }], papers: [['letter', 'Letter, landscape'], ['tabloid', 'Tabloid, landscape']] },
    sections: [
      { h: 'Start with a sharp source', p: [
        'Export the map as a PNG at a high resolution, or take a screenshot at the largest zoom that fits your screen. For a 36 inch wide map, aim for at least 3600 pixels across. That is 100 dpi, which keeps most text readable. Text smaller than about 10 points on the printed map may blur.' ] },
      { h: 'Use more overlap on detailed maps', p: [
        'A larger overlap, such as 0.75 inch, gives you more room to match roads and borders. The cost is a few more sheets. Set it with the overlap field and watch the sheet count.' ] },
      { h: 'Uses', ul: [
        'Tabletop role-playing maps.',
        'Floor plans for a renovation or a party layout.',
        'A trail or route map for a group.',
        'A world map for a classroom.' ] },
    ],
    faq: [
      { q: 'Will the seams break roads and text?', a: 'Seams are always visible, but the overlap lets you match lines when you glue. The page labels and cut marks show which edges to line up.' },
      { q: 'Can I print a map from a PDF?', a: 'Convert one page of the PDF to a PNG or JPG first. The tool takes image files, not PDFs.' },
      { q: 'What is the best paper size?', a: 'Use the largest your printer handles. Fewer sheets mean fewer seams. If the printer takes Tabloid (11 x 17), use it.' },
    ],
    related: ['36x48-poster-on-letter-paper', 'classroom-bulletin-board-poster', 'print-banner-on-multiple-pages'],
  },
];
