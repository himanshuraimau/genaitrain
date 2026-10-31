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
  const L = await layOut(path.join(HERE, 'mcp/ask/layout.mmd'), { face: 'Kevin Serif Bold', svgOut: path.join(HERE, 'out/ask-layout.svg') });
  const P = plate({ id: 'ask', w: 216, h: 216, ppm: FAST ? 5 : 10, seed: 'mcp-ask-1', paper: 'hotpress' });
  const m = mapper(contentBox(L), { x: 8, y: 50, w: 200, h: 118 });
  saveShapes(path.join(HERE, 'out/ask-pele.json'), L, m);
  for (const n of L.nodes) console.log(n.lines.map((q) => q.text).join(' '), [m.X(n.cx - n.w / 2), m.Y(n.cy - n.h / 2), m.X(n.cx + n.w / 2), m.Y(n.cy + n.h / 2)].map((v) => Math.round(v)).join(','));

  P.text('MCP at the mail desk  ·  I', 12.5, 13.6, { face: 'serif-bold', size: 3.8 });
  P.text('Asking first', 11, 30, { size: 15 });
  P.italic('when Claude wants to use a tool', 12.5, 39.6, { face: 'serif-bold', size: 4.2 });

  // key card: the three settings
  const card = D.rrect(126, 6, 209, 50, 1.2);
  H.part(P, card, '#fbf5e2', { nib: 0.24, pressure: 0.4, passes: 1 });
  P.text('each tool has one setting', 130, 13.4, { face: 'serif-bold', size: 3.4 });
  const rows = [['Always allow', 'runs at once'], ['Needs approval', 'asks you first'], ['Blocked', 'never runs']];
  rows.forEach(([a1, b1], i) => {
    const y = 23 + i * 10.4;
    P.text(a1 + ':', 143.5, y + 0.4, { face: 'serif-bold', size: 3.1 });
    P.italic(b1, 143.5 + Lt.measure(a1 + ': ', 'serif-bold', 3.1) + 0.4, y + 0.4, { face: 'serif-bold', size: 3.1 });
  });
  M.padlock(P, 136, 27.2, 0.5, { open: true, color: K.steel });
  M.askBubble(P, 136, 40, 0.55);
  M.padlock(P, 136, 49, 0.5);

  // note about Allow always
  M.note(P, 8, 50, 49, 20, ['"Allow always" means it', 'stops asking next time.', 'Only for tools you trust.'], { size: 2.75, gap: 4.6 });

  // back wall: pigeonholes
  M.pigeonholes(P, 124, 171, 158, 191, 2, 3, { fill: [[0, 1], [1, 2], [0, 0]] });
  // the clerk, then the desk in front of them
  person(P, 36, 198, 0.9, { seed: 'clerk-ask', pose: 'stand', hair: 'bun', shirt: { color: K.sky }, apron: K.mint, look: 0.8, front: { r: true } });
  M.desk(P, 4, 212, 197.4, 16);
  H.bell(P, 66, 195.6, 0.8);
  M.envelope(P, 88, 193.2, 0.55, { rot: -0.08, seal: false });
  M.envelope(P, 91, 191, 0.55, { rot: 0.1, stamp: K.green });
  M.parcel(P, 114, 195.6, 0.8);
  M.padlock(P, 170, 195.6, 0.55);
  M.stampTool(P, 187, 195.6, 0.62);
  M.inkPad(P, 203, 195.6, 0.66);
  M.stampMark(P, 190, 176, ['OK'], -0.14, '#b8352f', 3.4);

  const lab = (n) => n.lines.map((q) => q.text).join(' ');
  const tint = (n) => (/runs/.test(lab(n)) ? '#cfe5c9' : /stopped/.test(lab(n)) ? '#f4c9c4' : /waiting/.test(lab(n)) ? '#f6e3a0' : '#f6ecd4');
  TC.draw(P, L, m, {
    style: 'soft', tagColor: tint, labelsBeside: true, stopShort: 2.2, bounds: { x0: 4, x1: 212 },
    avoid: [{ x0: 124, x1: 210, y0: 4, y1: 52 }, { x0: 6, x1: 59, y0: 48, y1: 72 }, { x0: 4, x1: 212, y0: 169, y1: 214 }],
  });
  const out = await P.finish(path.join(HERE, 'out/ask.png'), { sizes: [['-x.jpg', 2048, 93], ['-preview.png', 1080]] });
  console.log(out);
}
main().catch((e) => { console.error(e); process.exit(1); });
