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
// A length for display or an input box. The stored value stays in inches, so switching units never drifts.
export const showLen = (inches, unit, digits = 2) => Math.round(fromInches(inches, unit) * 10 ** digits) / 10 ** digits;

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

// The part of the picture that stays when it fills a poster of another shape.
// fx and fy (0 to 1) place the kept window on the side that has spare picture. 0.5 is the center.
export function cropRect(imgW, imgH, posterW, posterH, fx = 0.5, fy = 0.5) {
  const clamp = (v) => Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0.5));
  const want = posterW / posterH;
  let sw = imgW, sh = imgH;
  if (imgW / imgH > want) sw = imgH * want; else sh = imgW / want;
  const sx = (imgW - sw) * clamp(fx);
  const sy = (imgH - sh) * clamp(fy);
  return { sx, sy, sw, sh, cutPct: Math.round((1 - (sw * sh) / (imgW * imgH)) * 100) };
}

/**
 * opts: imgW, imgH (pixels), paper, orientation, mode ('across'|'width'|'height'),
 *       value (pages, or a length in `unit`), unit ('in'|'cm'), margin, overlap (in `unit`)
 *       fit ('fit' keeps the whole picture, 'fill' crops it to fillW x fillH in `unit`), fx, fy (crop position)
 */
export function layout(opts) {
  const { imgW, imgH, paper = 'letter', orientation = 'portrait', mode = 'across', unit = 'in' } = opts;
  const fill = opts.fit === 'fill';
  const value = Number(opts.value);
  const margin = toInches(Number(opts.margin), unit);
  const overlap = toInches(Number(opts.overlap), unit);
  const fail = (error) => ({ ok: false, error });
  if (!(imgW > 0 && imgH > 0)) return fail('Choose an image first.');
  if (fill && !(Number(opts.fillW) > 0 && Number(opts.fillH) > 0)) return fail('Enter a poster width and a poster height.');
  if (!fill && !(value > 0)) return fail(mode === 'across' ? 'Enter how many pages across.' : 'Enter a poster size.');
  if (Number.isNaN(margin) || Number.isNaN(overlap)) return fail('Enter a number for the margin and the overlap.');
  if (margin < 0 || overlap < 0) return fail('Margin and overlap cannot be negative.');
  const page = pageSize(paper, orientation);
  const printW = page.w - 2 * margin;
  const printH = page.h - 2 * margin;
  if (printW < 1 || printH < 1) return fail('The margin is too large for this paper.');
  const stepX = printW - overlap;
  const stepY = printH - overlap;
  if (stepX < 0.5 || stepY < 0.5) return fail('The overlap is too large for this paper.');

  let posterW, posterH;
  if (fill) {
    posterW = toInches(Number(opts.fillW), unit);
    posterH = toInches(Number(opts.fillH), unit);
  } else if (mode === 'across') {
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
  if (cols * rows > MAX_SHEETS) return fail(`That needs more than ${MAX_SHEETS} sheets, which is the limit. Choose a smaller poster.`);

  const lastColFill = cols > 1 ? (posterW - (cols - 1) * stepX) / printW : 1;
  const lastRowFill = rows > 1 ? (posterH - (rows - 1) * stepY) / printH : 1;
  const crop = fill ? cropRect(imgW, imgH, posterW, posterH, opts.fx, opts.fy) : { sx: 0, sy: 0, sw: imgW, sh: imgH, cutPct: 0 };
  const dpi = crop.sw / posterW;
  return {
    ok: true, fill, crop, cols, rows, sheets: cols * rows,
    page, margin, overlap, printW, printH, stepX, stepY,
    posterW, posterH, dpi, quality: describeQuality(dpi),
    lastColFill, lastRowFill,
    gridW: (cols - 1) * stepX + printW, gridH: (rows - 1) * stepY + printH,
  };
}

// Top-left corner of a tile in poster space (inches, y down).
export const tileOrigin = (L, c, r) => ({ x: c * L.stepX, y: r * L.stepY });

// Tips when the last column or row only holds a thin strip of the poster.
// Each tip: { text, fix } where fix = { mode: 'width' | 'height', inches } is a poster size that drops that column or row.
// The strip includes the overlap, so the poster only needs to shrink by (strip - overlap).
export function wasteTip(L, unit = 'in') {
  const tips = [];
  const fmt = (v) => `${Math.ceil(fromInches(v, unit) * 10 - 1e-9) / 10} ${unit}`;
  const sheets = (n) => `${n} ${n === 1 ? 'sheet' : 'sheets'}`;
  if (L.cols > 1 && L.lastColFill < 0.2) {
    const strip = L.posterW - (L.cols - 1) * L.stepX;
    const cut = strip - L.overlap;
    tips.push({
      text: `The last column holds only a ${fmt(strip)} strip. Make the poster ${fmt(cut)} narrower to save ${sheets(L.rows)}.`,
      fix: { mode: 'width', inches: L.posterW - cut },
    });
  }
  if (L.rows > 1 && L.lastRowFill < 0.2) {
    const strip = L.posterH - (L.rows - 1) * L.stepY;
    const cut = strip - L.overlap;
    tips.push({
      text: `The last row holds only a ${fmt(strip)} strip. Make the poster ${fmt(cut)} shorter to save ${sheets(L.cols)}.`,
      fix: { mode: 'height', inches: L.posterH - cut },
    });
  }
  return tips;
}

// The layout a guide page opens with: its sample picture (shape = [w, h]) at the preset, default margin and overlap.
export function presetLayout(p, margin = 0.25, overlap = 0.5) {
  return layout({
    imgW: p.shape[0] * 1000, imgH: p.shape[1] * 1000, paper: p.paper, orientation: p.orient, mode: p.mode, value: p.value, unit: p.unit, margin, overlap,
    ...(p.fit === 'fill' ? { fit: 'fill', fillW: p.w, fillH: p.h } : {}),
  });
}
