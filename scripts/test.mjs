import assert from 'node:assert/strict';
import * as lib from 'pdf-lib';
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

console.log('All tests passed');
