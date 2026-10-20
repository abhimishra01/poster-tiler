// Builds the multi-page PDF. Runs in the browser; also runs in Node for tests.
// `lib` is the pdf-lib module. `image` is { bytes, type: 'jpg' | 'png' }.
import { tileLabel, tileOrigin, showLen } from './tile.js';

const PT = 72;

export async function buildPdf(lib, L, image, opts = {}, onProgress = () => {}) {
  const { PDFDocument, StandardFonts, rgb, pushGraphicsState, popGraphicsState, rectangle, clip, endPath } = lib;
  const { marks = true, labels = true, map = false, unit = 'in' } = opts;
  const doc = await PDFDocument.create();
  doc.setTitle('Poster tiles');
  doc.setProducer('printlargeposter.com');
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const img = image.type === 'png' ? await doc.embedPng(image.bytes) : await doc.embedJpg(image.bytes);
  const pw = L.page.w * PT;
  const ph = L.page.h * PT;
  const m = L.margin * PT;
  const total = L.sheets + (map ? 1 : 0);
  const black = rgb(0, 0, 0);
  let done = 0;

  for (let r = 0; r < L.rows; r++) {
    for (let c = 0; c < L.cols; c++) {
      const page = doc.addPage([pw, ph]);
      const o = tileOrigin(L, c, r);
      // Clip to the printable box, then draw the whole poster image shifted so this tile sits in the box.
      page.pushOperators(pushGraphicsState(), rectangle(m, m, L.printW * PT, L.printH * PT), clip(), endPath());
      page.drawImage(img, {
        x: m - o.x * PT,
        y: ph - m - (L.posterH - o.y) * PT,
        width: L.posterW * PT,
        height: L.posterH * PT,
      });
      page.pushOperators(popGraphicsState());

      const tick = Math.min(m * 0.8, 0.22 * PT);
      if (marks && tick >= 4) drawMarks(page, L, c, r, m, pw, ph, tick, black);
      if (labels) {
        const text = tileLabel(c, r);
        if (m >= 0.2 * PT) {
          const size = Math.min(10, m * 0.55);
          page.drawText(text, { x: pw / 2 - font.widthOfTextAtSize(text, size) / 2, y: ph - m / 2 - size * 0.35, size, font: bold, color: black });
        } else {
          // No room in the margin. Put the label in the bottom right corner of the picture box,
          // the strip that the next page covers when you glue.
          const size = 11;
          const w = font.widthOfTextAtSize(text, size);
          const x0 = pw - m - w - 11, y0 = m + 3;
          page.drawRectangle({ x: x0, y: y0, width: w + 8, height: size + 6, color: rgb(1, 1, 1), opacity: 0.85 });
          page.drawText(text, { x: x0 + 4, y: y0 + 5, size, font: bold, color: black });
        }
      }
      done++;
      onProgress(done, total);
      await new Promise((res) => setTimeout(res, 0));
    }
  }
  if (map) {
    drawMap(doc, L, font, bold, rgb, unit);
    done++;
    onProgress(done, total);
  }
  return doc.save();
}

// Crop-style ticks outside the printable box. Solid = cut here. Dashed = glue edge (the next page goes on top).
function drawMarks(page, L, c, r, m, pw, ph, t, color) {
  const left = m, right = pw - m, bottom = m, top = ph - m;
  const glueRight = c < L.cols - 1, glueBottom = r < L.rows - 1;
  const line = (x1, y1, x2, y2, dashed) => page.drawLine({
    start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: 0.6, color,
    ...(dashed ? { dashArray: [2, 2] } : {}),
  });
  // vertical edges: ticks above and below the box
  line(left, top, left, top + t, false); line(left, bottom, left, bottom - t, false);
  line(right, top, right, top + t, glueRight); line(right, bottom, right, bottom - t, glueRight);
  // horizontal edges: ticks left and right of the box
  line(left, top, left - t, top, false); line(right, top, right + t, top, false);
  line(left, bottom, left - t, bottom, glueBottom); line(right, bottom, right + t, bottom, glueBottom);
}

function drawMap(doc, L, font, bold, rgb, unit) {
  const page = doc.addPage([L.page.w * PT, L.page.h * PT]);
  const pw = L.page.w * PT, ph = L.page.h * PT;
  const ink = rgb(0.1, 0.1, 0.12);
  page.drawText('Assembly map', { x: 40, y: ph - 56, size: 22, font: bold, color: ink });
  page.drawText(`${L.cols} pages across, ${L.rows} down. Poster size ${showLen(L.posterW, unit, 1)} x ${showLen(L.posterH, unit, 1)} ${unit}.`, { x: 40, y: ph - 76, size: 11, font, color: ink });
  const notes = [
    'Print at 100% or Actual size. Do not use Fit to page.',
    'Trim the white margin along the solid marks. Leave the dashed edges uncut.',
    'Place each page over its left and upper neighbor so the picture lines up. Then glue.',
  ];
  notes.forEach((n, i) => page.drawText(n, { x: 40, y: ph - 100 - i * 14, size: 10, font, color: ink }));
  const areaX = 40, areaY = 40, areaW = pw - 80, areaH = ph - 220;
  const s = Math.min(areaW / L.gridW, areaH / L.gridH);
  const ox = areaX + (areaW - L.gridW * s) / 2;
  const oy = areaY + (areaH - L.gridH * s) / 2;
  for (let r = 0; r < L.rows; r++) {
    for (let c = 0; c < L.cols; c++) {
      const o = tileOrigin(L, c, r);
      const x = ox + o.x * s, w = L.printW * s, h = L.printH * s;
      const y = oy + (L.gridH - o.y) * s - h;
      page.drawRectangle({ x, y, width: w, height: h, borderColor: ink, borderWidth: 0.8, color: rgb(0.93, 0.93, 0.9), opacity: 0.5 });
      const text = tileLabel(c, r);
      const size = Math.max(8, Math.min(26, Math.min(w, h) * 0.3));
      page.drawText(text, { x: x + w / 2 - font.widthOfTextAtSize(text, size) / 2, y: y + h / 2 - size * 0.35, size, font: bold, color: ink });
    }
  }
}
