// FAQ items. Rendered on the home page AND output as FAQPage JSON-LD.
export const faq = [
  { q: 'Is this poster tiler really free?', a: 'Yes. There is no sign-up, no watermark and no limit on posters. The PDF you download is yours to print as often as you like.' },
  { q: 'Is my image uploaded to a server?', a: 'No. Your image and the PDF are made in your browser. Nothing is sent to us. You can turn off the internet after the page loads and the tool still works.' },
  { q: 'How do I print a poster on multiple pages without Fit to page changing the size?', a: 'In the print dialog, choose 100% or Actual size. Fit to page, Shrink to fit and Scale to fit all resize every tile. The pieces then no longer match. Set the scale before you print the first sheet.' },
  { q: 'How much overlap should I use?', a: 'A half inch (about 1.3 cm) works for most posters. It gives you a strip to glue and hides small errors in alignment. Use a bigger overlap if you want a wider glue strip.' },
  { q: 'Why is there a margin setting?', a: 'Most home printers cannot print within about 0.25 inch (6 mm) of the paper edge. The margin keeps the picture inside the area your printer can reach, so no part of the picture is cut off.' },
  { q: 'What image size do I need for a big poster?', a: 'For a sharp print, aim for 150 dpi or more. Divide the width of your image in pixels by the poster width in inches. A 3600 pixel wide photo makes a 24 inch poster at 150 dpi. The tool shows this number for you.' },
  { q: 'Can I print a banner in a single row?', a: 'Yes. Use a wide image, choose Height, and type a value that fits on one page, such as 8 inches on landscape Letter. The tool then builds one strip of pages.' },
  { q: 'Which paper sizes work?', a: 'Letter, A4, Legal, Tabloid (11 x 17 inch), A3 and A5, in portrait or landscape. Use the paper that your printer holds.' },
];
