'use strict';
const path = require('path');
const { plate } = require('../tools/lib/storybook');
const { layOut, mapper, contentBox, saveShapes } = require('../tools/lib/layout');
const TC = require('../tools/lib/tagchart');
const D = require('../tools/lib/draw');
const Lt = require('../tools/lib/letter');
const H = require('./shop');
const M = require('./mail');
const { K, RED } = M;

const FAST = process.argv.includes('--fast');
const HERE = path.join(__dirname, '..');

async function main() {
  const L = await layOut(path.join(HERE, 'mcp/trifecta/layout.mmd'), { face: 'Kevin Serif Bold', svgOut: path.join(HERE, 'out/trifecta-layout.svg') });
  const chart = { ...L, nodes: L.nodes.filter((n) => !/^lg/.test(n.id)), clusters: [] };
  const lab = (n) => n.lines.map((q) => q.text).join(' ');
  const PATH = [['just chatting', 'can read your private files'], ['can read your private files', 'can send things out'], ['can send things out', 'all three at once'], ['all three at once', 'your private data leaks']];
  const near = (p, n) => Math.abs(p[0] - n.cx) <= n.w / 2 + 2 && Math.abs(p[1] - n.cy) <= n.h / 2 + 2;
  chart.edges = chart.edges.map((e) => {
    const a = chart.nodes.find((n) => near(e.pts[0], n)), b = chart.nodes.find((n) => near(e.marker ? e.marker[0] : e.pts[e.pts.length - 1], n));
    return { ...e, bug: !!(a && b && PATH.some(([x, y]) => lab(a) === x && lab(b) === y)) };
  });
  const P = plate({ id: 'trifecta', w: 216, h: 216, ppm: FAST ? 5 : 10, seed: 'mcp-trifecta-1', paper: 'hotpress' });
  const m = mapper(contentBox(chart), { x: 8, y: 50, w: 200, h: 158 });
  saveShapes(path.join(HERE, 'out/trifecta-pele.json'), chart, m);
  for (const n of chart.nodes) console.log(n.lines.map((q) => q.text).join(' '), n.classes.join('|'), [m.X(n.cx - n.w / 2), m.Y(n.cy - n.h / 2), m.X(n.cx + n.w / 2), m.Y(n.cy + n.h / 2)].map((v) => Math.round(v)).join(','));

  P.text('MCP at the mail desk  ·  IV', 12.5, 13.6, { face: 'serif-bold', size: 3.8 });
  P.text('The trifecta', 11, 30, { size: 14 });
  P.italic('how private data can leak', 12.5, 39.4, { face: 'serif-bold', size: 4.4 });

  M.ladybug(P, 122, 35, 0.85, -0.3);

  // the rule card (like the bug plate's key)
  H.part(P, D.rrect(128, 7, 208, 44, 1.2), '#fbf5e2', { nib: 0.22, pressure: 0.4, passes: 1 });
  P.text('the rule', 132, 14.4, { face: 'serif-bold', size: 3.4 });
  P.italic('private data must never', 132, 21, { face: 'serif-bold', size: 3.2 });
  P.italic('leak out of a chat', 132, 26, { face: 'serif-bold', size: 3.2 });
  P.ink([[132, 32.4], [142, 32.4]], { nib: 0.42, color: RED });
  P.text('the path TLC found', 144.4, 33.6, { face: 'serif-bold', size: 3.1 });
  P.italic('(4 steps)', 132, 40, { face: 'serif-bold', size: 2.9 });

  // the three legs, as a legend column
  P.text('the three legs', 191, 62, { face: 'serif-bold', size: 3.4, align: 'center' });
  M.pigeonholes(P, 174, 70, 208, 88, 2, 3, { fill: [[0, 0], [0, 2], [1, 1]] });
  P.italic('1  private files', 191, 94.4, { face: 'serif-bold', size: 2.9, align: 'center' });
  M.envelope(P, 191, 114, 1.0, { rot: 0.08, stamp: false, lines: false, color: '#f0e6f6' });
  P.text('?', 191, 117.4, { face: 'serif-bold', size: 7, align: 'center', color: RED, slant: 0 });
  P.italic("2  a stranger's text", 191, 128.6, { face: 'serif-bold', size: 2.9, align: 'center' });
  M.mailbox(P, 191, 168, 0.95);
  P.italic('3  a way out', 191, 176, { face: 'serif-bold', size: 2.9, align: 'center' });
  P.italic('any one alone is fine', 191, 188, { face: 'serif-bold', size: 2.7, align: 'center' });
  P.italic('all three at once is not', 191, 193, { face: 'serif-bold', size: 2.7, align: 'center', color: RED });

  M.note(P, 8, 178, 62, 25, ['A hidden instruction can sit', 'inside an email or web page.', 'The AI may obey it.'], { size: 2.85, gap: 4.8 });
  H.magnifier(P, 16, 100, 6.0, 0.75);

  const broken = chart.nodes.find((n) => n.classes.includes('breaks'));
  TC.draw(P, chart, m, {
    style: 'soft', tagColor: '#f6ecd4', breakFill: '#f7cfc9', bugColor: RED, labelsBeside: true, stopShort: 1.8, bounds: { x0: 8, x1: 170 },
    avoid: [{ x0: 126, x1: 210, y0: 5, y1: 46 }, { x0: 170, x1: 212, y0: 56, y1: 198 }, { x0: 6, x1: 72, y0: 176, y1: 206 }, { x0: 118, x1: 168, y0: 112, y1: 130 }, { x0: 92, x1: 106, y0: 104, y1: 113 }, { x0: 4, x1: 30, y0: 84, y1: 112 }],
  });
  M.stampMark(P, m.X(broken.cx + broken.w / 2) + 15, m.Y(broken.cy) - 3, ['rule', 'broken'], -0.2, RED, 3.4);
  const out = await P.finish(path.join(HERE, 'out/trifecta.png'), { sizes: [['-x.jpg', 2048, 93], ['-preview.png', 1080]] });
  console.log(out);
}
main().catch((e) => { console.error(e); process.exit(1); });
