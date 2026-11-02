'use strict';
const path = require('path');
const { plate } = require('../tools/lib/storybook');
const { layOut, mapper, contentBox, saveShapes } = require('../tools/lib/layout');
const TC = require('../tools/lib/tagchart');
const D = require('../tools/lib/draw');
const Lt = require('../tools/lib/letter');
const { person } = require('../tools/lib/people');
const H = require('./shop');
const M = require('./mail');
const { K } = M;

const FAST = process.argv.includes('--fast');
const HERE = path.join(__dirname, '..');

async function main() {
  const L = await layOut(path.join(HERE, 'mcp/kit/layout.mmd'), { face: 'Kevin Serif Bold', svgOut: path.join(HERE, 'out/kit-layout.svg') });
  const P = plate({ id: 'kit', w: 216, h: 216, ppm: FAST ? 5 : 10, seed: 'mcp-kit-1', paper: 'hotpress' });
  const m = mapper(contentBox(L), { x: 8, y: 52, w: 200, h: 128 });
  saveShapes(path.join(HERE, 'out/kit-pele.json'), L, m);

  P.text('MCP at the mail desk  ·  V', 12.5, 13.6, { face: 'serif-bold', size: 3.8 });
  P.text('Kit and key', 11, 30, { size: 15 });
  P.italic('adding a plugin does not sign you in', 12.5, 39.6, { face: 'serif-bold', size: 4.2 });

  // key card: the two separate steps
  H.part(P, D.rrect(126, 6, 209, 47, 1.2), '#fbf5e2', { nib: 0.24, pressure: 0.4, passes: 1 });
  P.text('two separate steps', 130, 13.4, { face: 'serif-bold', size: 3.4 });
  M.parcel(P, 137, 29, 0.55, { w: 14, h: 10 });
  P.text('1  the kit:', 147, 25.4, { face: 'serif-bold', size: 3.1 });
  P.italic('add the plugin', 147 + Lt.measure('1  the kit: ', 'serif-bold', 3.1), 25.4, { face: 'serif-bold', size: 3.1 });
  M.key(P, 132, 40, 0.62, 0.0, K.brass);
  P.text('2  the key:', 147, 40.4, { face: 'serif-bold', size: 3.1 });
  P.italic('sign in to its connector'.replace(' to its connector',''), 147 + Lt.measure('2  the key: ', 'serif-bold', 3.1), 40.4, { face: 'serif-bold', size: 3.1 });

  M.note(P, 8, 160, 62, 22, ['Its skills load right away.', 'But a skill cannot reach your', 'tool until it says Connected.'], { size: 2.8, gap: 4.6 });
  M.note(P, 146, 160, 62, 22, ['Remove the plugin and the', 'connector stays connected', '(ChatGPT docs say so).'], { size: 2.8, gap: 4.6, color: '#d9ecd9' });

  // the desk
  M.desk(P, 4, 212, 199.4, 14);
  H.bell(P, 40, 197.6, 0.8);
  M.parcel(P, 84, 197.6, 0.9);
  M.key(P, 120, 195.4, 0.8, -0.25, K.brass);
  M.envelope(P, 156, 195.0, 0.55, { rot: 0.06, seal: true });
  M.padlock(P, 188, 197.6, 0.55, { open: true, color: K.steel });

  const lab = (n) => n.lines.map((q) => q.text).join(' ');
  const tint = (n) => (/both ready/.test(lab(n)) ? '#cfe5c9' : /not signed in/.test(lab(n)) ? '#f6e3a0' : /no plugin/.test(lab(n)) ? '#cfe0ee' : '#f6ecd4');
  TC.draw(P, L, m, {
    style: 'soft', tagColor: tint, labelsBeside: true, stopShort: 2.2, bounds: { x0: 4, x1: 212 },
    avoid: [{ x0: 124, x1: 210, y0: 4, y1: 49 }, { x0: 6, x1: 72, y0: 158, y1: 184 }, { x0: 144, x1: 210, y0: 158, y1: 184 }, { x0: 4, x1: 212, y0: 186, y1: 214 }],
  });
  const out = await P.finish(path.join(HERE, 'out/kit.png'), { sizes: [['-x.jpg', 2048, 93], ['-preview.png', 1080]] });
  console.log(out);
}
main().catch((e) => { console.error(e); process.exit(1); });
