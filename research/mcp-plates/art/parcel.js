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
  const L = await layOut(path.join(HERE, 'mcp/parcel/layout.mmd'), { face: 'Kevin Serif Bold', svgOut: path.join(HERE, 'out/parcel-layout.svg') });
  const chart = { ...L, nodes: L.nodes.filter((n) => !/^lg/.test(n.id)), clusters: [] };
  const lab = (n) => n.lines.map((q) => q.text).join(' ');
  const PATH = [['you look for a plugin', 'added from a link or file'], ['added from a link or file', 'used in Cowork or Claude Code (from a link or file)'], ['used in Cowork or Claude Code (from a link or file)', 'its code runs on your computer (from a link or file)']];
  const near = (p, n) => Math.abs(p[0] - n.cx) <= n.w / 2 + 2 && Math.abs(p[1] - n.cy) <= n.h / 2 + 2;
  chart.edges = chart.edges.map((e) => {
    const a = chart.nodes.find((n) => near(e.pts[0], n)), b = chart.nodes.find((n) => near(e.marker ? e.marker[0] : e.pts[e.pts.length - 1], n));
    return { ...e, bug: !!(a && b && PATH.some(([x, y]) => lab(a) === x && lab(b) === y)) };
  });
  const P = plate({ id: 'parcel', w: 216, h: 216, ppm: FAST ? 5 : 10, seed: 'mcp-parcel-1', paper: 'hotpress' });
  const m = mapper(contentBox(chart), { x: 8, y: 50, w: 200, h: 146 });
  saveShapes(path.join(HERE, 'out/parcel-pele.json'), chart, m);

  P.text('MCP at the mail desk  ·  VI', 12.5, 13.6, { face: 'serif-bold', size: 3.8 });
  P.text('The loose parcel', 11, 30, { size: 11.4 });
  P.italic('why a plugin from a link needs a look', 12.5, 39.4, { face: 'serif-bold', size: 4 });
  M.ladybug(P, 12, 47.5, 0.8, 0.1);

  // the rule card
  H.part(P, D.rrect(134, 7, 208, 44, 1.2), '#fbf5e2', { nib: 0.22, pressure: 0.4, passes: 1 });
  P.text('the rule', 138, 14.4, { face: 'serif-bold', size: 3.4 });
  P.italic('nothing unreviewed should run', 138, 21, { face: 'serif-bold', size: 3.1 });
  P.italic('on your computer', 138, 26, { face: 'serif-bold', size: 3.1 });
  P.ink([[138, 32.4], [148, 32.4]], { nib: 0.42, color: RED });
  P.text('the path TLC found', 150.4, 33.6, { face: 'serif-bold', size: 3.1 });
  P.italic('(3 steps)', 138, 40.2, { face: 'serif-bold', size: 2.9 });

  // two parcels at the top: reviewed and not
  M.parcel(P, 24, 80, 1.0, { w: 14, h: 10 });
  M.stampMark(P, 24, 60, ['reviewed'], -0.12, '#3f7a3a', 3.0);
  M.parcel(P, 190, 76, 0.95, { w: 14, h: 10, label: false });
  P.text('?', 190, 61, { face: 'serif-bold', size: 6.4, align: 'center', color: RED, slant: 0 });
  P.italic('no stamp', 190, 83.4, { face: 'serif-bold', size: 2.8, align: 'center' });

  M.note(P, 8, 196, 92, 14, ['In chat, hooks and agents are ignored. This', 'path needs Cowork or Claude Code.'], { size: 2.75, gap: 4.4 });
  H.magnifier(P, 118, 203, 5.2, 0.75);

  const broken = chart.nodes.find((n) => n.classes.includes('breaks'));
  const tint = (n) => (/from the directory|^added from the directory|^you look/.test(lab(n)) && !/link/.test(lab(n)) ? (/^you look/.test(lab(n)) ? '#f6ecd4' : '#dcebd5') : '#f6ecd4');
  TC.draw(P, chart, m, {
    style: 'soft', tagColor: tint, breakFill: '#f7cfc9', bugColor: RED, labelsBeside: true, stopShort: 1.8, bounds: { x0: 6, x1: 210 },
    avoid: [{ x0: 132, x1: 210, y0: 5, y1: 47 }, { x0: 6, x1: 44, y0: 52, y1: 90 }, { x0: 170, x1: 212, y0: 52, y1: 86 }, { x0: 4, x1: 212, y0: 194, y1: 214 }],
  });
  M.stampMark(P, 196, 203, ['rule', 'broken'], -0.2, RED, 3.2);
  const out = await P.finish(path.join(HERE, 'out/parcel.png'), { sizes: [['-x.jpg', 2048, 93], ['-preview.png', 1080]] });
  console.log(out);
}
main().catch((e) => { console.error(e); process.exit(1); });
