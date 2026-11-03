'use strict';
const path = require('path');
const { plate } = require('../tools/lib/storybook');
const { layOut, mapper, contentBox, saveShapes } = require('../tools/lib/layout');
const TC = require('../tools/lib/tagchart');
const D = require('../tools/lib/draw');
const Lt = require('../tools/lib/letter');
const H = require('./shop');
const M = require('./mail');
const { K } = M;

const FAST = process.argv.includes('--fast');
const HERE = path.join(__dirname, '..');

async function main() {
  const L = await layOut(path.join(HERE, 'mcp/run/layout.mmd'), { face: 'Kevin Serif Bold', svgOut: path.join(HERE, 'out/run-layout.svg') });
  const P = plate({ id: 'run', w: 216, h: 216, ppm: FAST ? 5 : 10, seed: 'tracker-run-1', paper: 'hotpress' });
  const m = mapper(contentBox(L), { x: 52, y: 46, w: 112, h: 136 });
  saveShapes(path.join(HERE, 'out/run-pele.json'), L, m);

  P.text('The morning post round  ·  VII', 12.5, 13.6, { face: 'serif-bold', size: 3.8 });
  P.text('A morning run', 11, 30, { size: 15 });
  P.italic('the same steps every day, even when a source fails', 12.5, 39.6, { face: 'serif-bold', size: 4.0 });

  M.note(P, 5, 74, 44, 25, ['A source that fails', 'never stops the run.', 'The digest says', 'which one did.'], { size: 2.7, gap: 4.6, color: '#f6e3a0' });
  M.note(P, 167, 128, 44, 25, ['Seen items are', 'dropped BEFORE', 'scoring, so you', 'never get repeats.'], { size: 2.7, gap: 4.6, color: '#d9ecd9' });

  M.desk(P, 4, 212, 199.4, 14);
  H.bell(P, 24, 197.6, 0.8);
  M.parcel(P, 66, 197.6, 0.9);
  M.envelope(P, 170, 195.0, 0.55, { rot: -0.05, seal: true });
  M.parcel(P, 198, 197.6, 0.7, { w: 12, h: 8 });

  const lab = (n) => n.lines.map((q) => q.text).join(' ');
  const tint = (n) => (/inbox/.test(lab(n)) ? '#cfe5c9' : /failed/.test(lab(n)) ? '#f6e3a0' : /asleep/.test(lab(n)) ? '#cfe0ee' : '#f6ecd4');
  TC.draw(P, L, m, {
    style: 'soft', tagColor: tint, labelsBeside: true, stopShort: 2.2, bounds: { x0: 4, x1: 212 },
    avoid: [{ x0: 4, x1: 50, y0: 72, y1: 101 }, { x0: 166, x1: 212, y0: 126, y1: 155 }, { x0: 4, x1: 212, y0: 186, y1: 214 }],
  });
  const out = await P.finish(path.join(HERE, 'out/run.png'), { sizes: [['-x.jpg', 2048, 93], ['-preview.png', 1080]] });
  console.log(out);
}
main().catch((e) => { console.error(e); process.exit(1); });
