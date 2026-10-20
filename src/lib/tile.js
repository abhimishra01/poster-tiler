// Poster tiling math. Pure functions, no DOM. All lengths are in inches inside this file.
export const PAPER = {
  letter: { name: 'Letter (8.5 x 11 in)', w: 8.5, h: 11 },
  a4: { name: 'A4 (210 x 297 mm)', w: 210 / 25.4, h: 297 / 25.4 },
  legal: { name: 'Legal (8.5 x 14 in)', w: 8.5, h: 14 },
  tabloid: { name: 'Tabloid (11 x 17 in)', w: 11, h: 17 },
  a3: { name: 'A3 (297 x 420 mm)', w: 297 / 25.4, h: 420 / 25.4 },
  a5: { name: 'A5 (148 x 210 mm)', w: 148 / 25.4, h: 210 / 25.4 },
};
export const MAX_SHEETS = 200;
const EPS = 1e-6;

export const toInches = (v, unit) => (unit === 'cm' ? v / 2.54 : v);
export const fromInches = (v, unit) => (unit === 'cm' ? v * 2.54 : v);

export function pageSize(paperKey, orientation) {
  const p = PAPER[paperKey] || PAPER.letter;
  return orientation === 'landscape' ? { w: p.h, h: p.w } : { w: p.w, h: p.h };
}

// Row letter plus column number: A1, A2, B1. After Z the letters go AA, AB.
export function rowLabel(r) {
  let s = '';
  let n = r;
  do { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; } while (n >= 0);
  return s;
}
export const tileLabel = (c, r) => rowLabel(r) + (c + 1);

// Count of pages needed to cover `size` when each page adds `step` after the first one, which adds `printable`.
function count(size, printable, step) {
  if (size <= printable + EPS) return 1;
  return Math.ceil((size - printable) / step - EPS) + 1;
}

export function describeQuality(dpi) {
  if (dpi >= 200) return { level: 'great', text: 'sharp' };
  if (dpi >= 120) return { level: 'good', text: 'good' };
  if (dpi >= 72) return { level: 'fair', text: 'a little soft up close' };
  return { level: 'low', text: 'blurry, use a larger image or a smaller poster' };
}

/**
 * opts: imgW, imgH (pixels), paper, orientation, mode ('across'|'width'|'height'),
 *       value (pages, or a length in `unit`), unit ('in'|'cm'), margin, overlap (in `unit`)
 */
export function layout(opts) {
  const { imgW, imgH, paper = 'letter', orientation = 'portrait', mode = 'across', unit = 'in' } = opts;
  const value = Number(opts.value);
  const margin = toInches(Number(opts.margin), unit);
  const overlap = toInches(Number(opts.overlap), unit);
  const fail = (error) => ({ ok: false, error });
  if (!(imgW > 0 && imgH > 0)) return fail('Choose an image first.');
  if (!(value > 0)) return fail(mode === 'across' ? 'Enter how many pages across.' : 'Enter a poster size.');
  if (!(margin >= 0) || !(overlap >= 0)) return fail('Margin and overlap cannot be negative.');
  const page = pageSize(paper, orientation);
  const printW = page.w - 2 * margin;
  const printH = page.h - 2 * margin;
  if (printW < 1 || printH < 1) return fail('The margin is too large for this paper.');
  const stepX = printW - overlap;
  const stepY = printH - overlap;
  if (stepX < 0.5 || stepY < 0.5) return fail('The overlap is too large for this paper.');

  let posterW, posterH;
  if (mode === 'across') {
    const cols = Math.round(value);
    if (cols < 1) return fail('Enter at least 1 page across.');
    posterW = printW + (cols - 1) * stepX;
    posterH = (posterW * imgH) / imgW;
  } else if (mode === 'width') {
    posterW = toInches(value, unit);
    posterH = (posterW * imgH) / imgW;
  } else {
    posterH = toInches(value, unit);
    posterW = (posterH * imgW) / imgH;
  }
  const cols = count(posterW, printW, stepX);
  const rows = count(posterH, printH, stepY);
  if (cols * rows > MAX_SHEETS) return fail(`That needs ${cols * rows} sheets. The limit is ${MAX_SHEETS}. Choose a smaller poster.`);

  const lastColFill = cols > 1 ? (posterW - (cols - 1) * stepX) / printW : 1;
  const lastRowFill = rows > 1 ? (posterH - (rows - 1) * stepY) / printH : 1;
  const dpi = imgW / posterW;
  return {
    ok: true, cols, rows, sheets: cols * rows,
    page, margin, overlap, printW, printH, stepX, stepY,
    posterW, posterH, dpi, quality: describeQuality(dpi),
    lastColFill, lastRowFill,
    gridW: (cols - 1) * stepX + printW, gridH: (rows - 1) * stepY + printH,
  };
}

// Top-left corner of a tile in poster space (inches, y down).
export const tileOrigin = (L, c, r) => ({ x: c * L.stepX, y: r * L.stepY });

// Tip when the last column or row only holds a thin strip of the poster.
export function wasteTip(L, unit = 'in') {
  const tips = [];
  const fmt = (v) => `${Math.round(fromInches(v, unit) * 10) / 10} ${unit}`;
  if (L.cols > 1 && L.lastColFill < 0.2) {
    const strip = L.posterW - (L.cols - 1) * L.stepX;
    tips.push(`The last column holds only a ${fmt(strip)} strip. Make the poster ${fmt(strip)} narrower to save ${L.rows} sheets.`);
  }
  if (L.rows > 1 && L.lastRowFill < 0.2) {
    const strip = L.posterH - (L.rows - 1) * L.stepY;
    tips.push(`The last row holds only a ${fmt(strip)} strip. Make the poster ${fmt(strip)} shorter to save ${L.cols} sheets.`);
  }
  return tips;
}
