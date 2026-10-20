import assert from 'node:assert/strict';
import * as lib from 'pdf-lib';
import zlib from 'node:zlib';
import * as t from '../src/lib/tile.js';
import { buildPdf } from '../src/lib/pdf.js';

const near = (a, b, e = 0.001) => assert.ok(Math.abs(a - b) < e, `${a} vs ${b}`);
const base = { imgW: 1500, imgH: 1000, paper: 'letter', orientation: 'portrait', mode: 'across', value: 3, unit: 'in', margin: 0.25, overlap: 0.5 };

// Paper sizes
near(t.pageSize('a4', 'portrait').w, 8.2677, 0.001);
near(t.pageSize('a4', 'portrait').h, 11.6929, 0.001);
assert.deepEqual(t.pageSize('legal', 'landscape'), { w: 14, h: 8.5 });

// Letter portrait, margin 0.25, overlap 0.5: printable 8 x 10.5, step 7.5 x 10
let L = t.layout(base);
assert.ok(L.ok);
near(L.printW, 8); near(L.printH, 10.5); near(L.stepX, 7.5); near(L.stepY, 10);
// 3 pages across: 8 + 2 * 7.5 = 23 in wide, 15.333 in tall, so 2 rows
near(L.posterW, 23); near(L.posterH, 15.3333, 0.001);
assert.equal(L.cols, 3); assert.equal(L.rows, 2); assert.equal(L.sheets, 6);
near(L.dpi, 1500 / 23, 0.001);

// Width mode, square image, 24 in: cols = ceil((24-8)/7.5)+1 = 4, rows = ceil((24-10.5)/10)+1 = 3
L = t.layout({ ...base, imgW: 1000, imgH: 1000, mode: 'width', value: 24 });
assert.equal(L.cols, 4); assert.equal(L.rows, 3);
// Exact fit does not add a page: 23 in wide is 3 columns
L = t.layout({ ...base, imgW: 1000, imgH: 1000, mode: 'width', value: 23 });
assert.equal(L.cols, 3);
// Poster that fits one printable box needs one page
L = t.layout({ ...base, imgW: 1000, imgH: 1000, mode: 'width', value: 8 });
assert.equal(L.cols, 1); assert.equal(L.rows, 1);
// Centimeters: 60.96 cm is 24 in
L = t.layout({ ...base, imgW: 1000, imgH: 1000, mode: 'width', value: 60.96, unit: 'cm', margin: 0.635, overlap: 1.27 });
assert.equal(L.cols, 4); assert.equal(L.rows, 3);
// Height mode: 36 in tall, image 2:3 (width:height), so 24 in wide. Landscape letter: print 10.5 x 8, step 10 x 7.5
L = t.layout({ ...base, imgW: 2000, imgH: 3000, mode: 'height', value: 36, orientation: 'landscape' });
near(L.posterW, 24); assert.equal(L.cols, 3); assert.equal(L.rows, 5);
// Same poster on portrait letter: 4 x 4
L = t.layout({ ...base, imgW: 2000, imgH: 3000, mode: 'height', value: 36 });
assert.equal(L.cols, 4); assert.equal(L.rows, 4);

// Errors
assert.equal(t.layout({ ...base, imgW: 0 }).ok, false);
assert.equal(t.layout({ ...base, overlap: 9 }).ok, false);
assert.equal(t.layout({ ...base, margin: 5 }).ok, false);
assert.equal(t.layout({ ...base, mode: 'width', value: 2000 }).ok, false); // too many sheets
assert.equal(t.layout({ ...base, value: 0 }).ok, false);
// A blank margin or overlap field is not "negative"
assert.match(t.layout({ ...base, margin: NaN }).error, /Enter a number/);
assert.match(t.layout({ ...base, overlap: NaN }).error, /Enter a number/);
assert.match(t.layout({ ...base, margin: -1 }).error, /negative/);
assert.doesNotMatch(t.layout({ ...base, mode: 'width', value: 1e15 }).error, /\d{6}/);

// Labels: row letter, column number
assert.equal(t.tileLabel(0, 0), 'A1');
assert.equal(t.tileLabel(2, 1), 'B3');
assert.equal(t.rowLabel(25), 'Z');
assert.equal(t.rowLabel(26), 'AA');
assert.equal(t.rowLabel(27), 'AB');
assert.equal(t.rowLabel(701), 'ZZ');
assert.equal(t.rowLabel(702), 'AAA');

// Tile origin
L = t.layout(base);
assert.deepEqual(t.tileOrigin(L, 2, 1), { x: 15, y: 10 });

// Quality
assert.equal(t.describeQuality(300).level, 'great');
assert.equal(t.describeQuality(150).level, 'good');
assert.equal(t.describeQuality(90).level, 'fair');
assert.equal(t.describeQuality(40).level, 'low');

// Waste tip: 8.5 in wide on letter needs 2 columns, strip = 8.5 - 7.5 = 1 in... fill 0.125 < 0.2
L = t.layout({ ...base, imgW: 1000, imgH: 1000, mode: 'width', value: 8.5 });
assert.equal(L.cols, 2);
assert.ok(t.wasteTip(L).length >= 1);
// Tip says how much to cut: the strip minus the overlap. 23.3 in wide gives a 0.8 in strip, so 0.3 in is enough.
L = t.layout({ ...base, imgW: 1000, imgH: 1000, mode: 'width', value: 23.3 });
assert.equal(L.cols, 4);
let tip = t.wasteTip(L)[0];
assert.match(tip.text, /0\.8 in strip/);
assert.match(tip.text, /0\.3 in narrower to save \d+ sheets?\./);
// Applying the fix really drops a column
near(tip.fix.inches, 23, 0.001);
assert.equal(tip.fix.mode, 'width');
assert.equal(t.layout({ ...base, imgW: 1000, imgH: 1000, mode: 'width', value: tip.fix.inches }).cols, 3);
// Singular: one row of pages saves "1 sheet", not "1 sheets"
L = t.layout({ ...base, imgW: 1000, imgH: 1000, mode: 'width', value: 23.3, orientation: 'portrait' });
L = { ...L, rows: 1 };
assert.match(t.wasteTip(L)[0].text, /to save 1 sheet\./);
// Unit switch never drifts: the stored inches stay, only the display changes
const stored = 0.125;
assert.equal(t.showLen(stored, 'cm'), 0.32);
assert.equal(t.showLen(stored, 'in'), 0.13);
near(t.toInches(2.54, 'cm'), 1);
assert.equal(t.wasteTip(t.layout(base)).length, 0);

// PDF: 6 tiles + 1 map page, right page size, bytes start with %PDF
const png = Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==', 'base64'));
L = t.layout(base);
let progress = 0;
const bytes = await buildPdf(lib, L, { bytes: png, type: 'png' }, { marks: true, labels: true, map: true }, (d) => { progress = d; });
assert.equal(Buffer.from(bytes.slice(0, 4)).toString(), '%PDF');
const doc = await lib.PDFDocument.load(bytes);
assert.equal(doc.getPageCount(), 7);
assert.equal(progress, 7);
near(doc.getPage(0).getWidth(), 612, 0.01); near(doc.getPage(0).getHeight(), 792, 0.01);
// No marks, no labels, no map: exactly the tile count
const bytes2 = await buildPdf(lib, L, { bytes: png, type: 'png' }, { marks: false, labels: false, map: false });
assert.equal((await lib.PDFDocument.load(bytes2)).getPageCount(), 6);
// Zero margin works
const L0 = t.layout({ ...base, margin: 0 });
const bytes3 = await buildPdf(lib, L0, { bytes: png, type: 'png' }, { marks: true, labels: true, map: false });
assert.equal((await lib.PDFDocument.load(bytes3)).getPageCount(), L0.sheets);


// PDF placement: read the content stream of each page and check where the picture is drawn.
function content(page) {
  const refs = page.node.Contents();
  const parts = (refs.asArray ? refs.asArray() : [refs]).map((r) => page.doc.context.lookup(r));
  return parts.map((p) => Buffer.from(zlib.inflateSync(Buffer.from(p.getContents()))).toString('latin1')).join('\n');
}
const Lp = t.layout({ ...base, imgW: 2000, imgH: 2000, mode: 'width', value: 15.5 }); // 2 x 2 on Letter, poster 15.5 in square
assert.equal(Lp.cols, 2); assert.equal(Lp.rows, 2);
const bp = await buildPdf(lib, Lp, { bytes: png, type: 'png' }, { marks: true, labels: true, map: false });
const dp = await lib.PDFDocument.load(bp);
const pt = (v) => v * 72;
for (const [i, [c, r]] of [[0, 0], [1, 0], [0, 1], [1, 1]].entries()) {
  const txt = content(dp.getPage(i));
  const o = t.tileOrigin(Lp, c, r);
  // clip box = printable area
  const clip = txt.match(/([\d.-]+) ([\d.-]+) ([\d.-]+) ([\d.-]+) re\s+W/);
  assert.ok(clip, 'clip rectangle');
  near(+clip[1], pt(0.25), 0.1); near(+clip[2], pt(0.25), 0.1);
  near(+clip[3], pt(Lp.printW), 0.1); near(+clip[4], pt(Lp.printH), 0.1);
  // picture matrix: width and height of the whole poster, shifted so tile (c, r) sits in the box
  const tr = [...txt.matchAll(/1 0 0 1 ([\d.-]+) ([\d.-]+) cm/g)].find((x) => +x[1] !== 0 || +x[2] !== 0) || [0, '0', '0'];
  const sc = [...txt.matchAll(/([\d.-]+) 0 0 ([\d.-]+) 0 0 cm/g)].find((x) => +x[1] > 1);
  assert.ok(tr && sc, 'image matrix');
  near(+sc[1], pt(Lp.posterW), 0.1); near(+sc[2], pt(Lp.posterH), 0.1);
  near(+tr[1], pt(0.25) - pt(o.x), 0.1);
  near(+tr[2], 792 - pt(0.25) - pt(Lp.posterH - o.y), 0.1);
}
// Zero margin: the label sits in the bottom right corner of the box, not on top of the picture's top left
const bz = await buildPdf(lib, L0, { bytes: png, type: 'png' }, { marks: false, labels: true, map: false });
const tz = content((await lib.PDFDocument.load(bz)).getPage(0));
const td = tz.match(/1 0 0 1 ([\d.-]+) ([\d.-]+) Tm/);
assert.ok(td, 'label position');
assert.ok(+td[1] > 612 * 0.7 && +td[2] < 792 * 0.2, 'label is near the bottom right');

console.log('All tests passed');

// Test page: only tile (0,0) is built, and no map page
const bo = await buildPdf(lib, L, { bytes: png, type: 'png' }, { marks: true, labels: true, map: true, only: [0, 0] });
assert.equal((await lib.PDFDocument.load(bo)).getPageCount(), 1);
const bo2 = await buildPdf(lib, L, { bytes: png, type: 'png' }, { marks: true, labels: true, only: [2, 1] });
assert.equal((await lib.PDFDocument.load(bo2)).getPageCount(), 1);

// Landing page presets: the counts written on the pages match the math
const cnt = (o) => t.layout({ ...base, imgW: 2000, imgH: 3000, mode: 'width', unit: 'in', ...o });
assert.equal(cnt({ value: 24 }).sheets, 16);
assert.equal(cnt({ value: 24, orientation: 'landscape' }).sheets, 15);
assert.equal(cnt({ value: 18, imgW: 3, imgH: 4 }).sheets, 9);
assert.equal(t.layout({ ...base, imgW: 3, imgH: 4, paper: 'a4', mode: 'across', value: 3 }).sheets, 9);
assert.equal(t.layout({ ...base, imgW: 8, imgH: 1, orientation: 'landscape', mode: 'height', value: 8 }).rows, 1);
{
  const { cases } = await import('../src/data/cases.ts');
  assert.equal(cases.length, 10);
  assert.equal(new Set(cases.map((c) => c.slug)).size, 10);
  for (const c of cases) {
    assert.ok(c.title.length <= 45, c.title);
    assert.ok(c.preset.paper in t.PAPER, c.slug);
    for (const r of c.related) assert.ok(cases.some((x) => x.slug === r), `${c.slug} -> ${r}`);
    assert.ok(!/[—–]/.test(JSON.stringify(c)), `${c.slug} has a dash`);
  }
}
console.log('Landing page checks passed');
