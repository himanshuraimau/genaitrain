'use strict';
const path = require('path');
const { plate } = require('../tools/lib/storybook');
const { layOut, mapper, saveShapes } = require('../tools/lib/layout');
const TC = require('../tools/lib/tagchart');
const D = require('../tools/lib/draw');
const Lt = require('../tools/lib/letter');
const H = require('./shop');
const M = require('./mail');
const { K } = M;

const FAST = process.argv.includes('--fast');
const HERE = path.join(__dirname, '..');

async function main() {
  const L = await layOut(path.join(HERE, 'mcp/keys/layout.mmd'), { face: 'Kevin Serif Bold', svgOut: path.join(HERE, 'out/keys-layout.svg') });
  const P = plate({ id: 'keys', w: 216, h: 216, ppm: FAST ? 5 : 10, seed: 'mcp-keys-1', paper: 'hotpress' });
  const all = L.clusters.find((c) => c.id === 'all');
  const m = mapper({ x: all.x, y: all.y, w: all.w, h: all.h }, { x: 12, y: 68, w: 192, h: 86 });
  saveShapes(path.join(HERE, 'out/keys-pele.json'), L, m);
  const box = (c) => [m.X(c.x), m.Y(c.y), m.X(c.x + c.w), m.Y(c.y + c.h), m.Y(c.headY)];
  for (const c of L.clusters) console.log('cluster', c.id, c.label[0].text, box(c).map((v) => Math.round(v)).join(','));
  for (const n of L.nodes) console.log(n.lines.map((q) => q.text).join(' '), [m.X(n.cx - n.w / 2), m.Y(n.cy - n.h / 2), m.X(n.cx + n.w / 2), m.Y(n.cy + n.h / 2)].map((v) => Math.round(v)).join(','));

  P.text('MCP at the mail desk  ·  III', 12.5, 13.6, { face: 'serif-bold', size: 3.8 });
  P.text('Three keys', 11, 30, { size: 15 });
  P.italic('who controls what, all at the same time', 12.5, 39.6, { face: 'serif-bold', size: 4.2 });

  // the frame: "at the same time"
  const [ax0, ay0, ax1, ay1, ahead] = box(all);
  P.outline([D.rrect(ax0, ay0, ax1, ay1, 2)], { nib: 0.3 });
  P.outline([D.rrect(ax0 + 1, ay0 + 1, ax1 - 1, ay1 - 1, 1.6)], { nib: 0.12 });
  P.italic('at the same time', (ax0 + ax1) / 2, (ay0 + ahead) / 2 + 1.5, { face: 'serif-bold', size: 4.2, align: 'center' });
  P.ink([[ax0 + 1, ahead], [ax1 - 1, ahead]], { nib: 0.14 });
  const tint = { r0: '#f6e6b4', r1: '#d6e6f2', r2: '#f6d6d2' }, deep = { r0: '#a3802c', r1: '#3f6f97', r2: '#a3434b' }, keyCol = { r0: K.brass, r1: K.blue, r2: K.red };
  for (const c of L.clusters.filter((q) => q !== all)) {
    const [x0, y0, x1, y1, hy] = box(c), card = D.rrect(x0, y0, x1, y1, 1.6);
    P.paper([card]); P.colour([card], tint[c.id], { pressure: 0.42, passes: 1 });
    P.colour([D.rrect(x0, y0, x1, hy, 1.6)], tint[c.id], { pressure: 0.7, passes: 1 });
    P.outline([card], { nib: 0.24 }); P.ink([[x0, hy], [x1, hy]], { nib: 0.14 });
    P.text(c.label[0].text, (x0 + x1) / 2, (y0 + hy) / 2 + 1.8, { face: 'serif-bold', size: 4.4, align: 'center' });
    M.key(P, (x0 + x1) / 2 - 8, 59, 1.15, 0.12, keyCol[c.id]);
  }
  for (const d of L.dividers) { const p = m.P(d[0]), q = m.P(d[d.length - 1]); for (let y = p[1] + 2; y < q[1] - 2; y += 2.6) P.ink([[p[0], y], [p[0], y + 1.2]], { nib: 0.14 }); }

  // the back-room door with three locks
  const dx0 = 78, dx1 = 138, dy0 = 168, dy1 = 209;
  const arch = []; const acx = (dx0 + dx1) / 2, arx = (dx1 - dx0) / 2, ary = 14;
  for (let i = 0; i <= 24; i++) { const a = Math.PI + (i / 24) * Math.PI; arch.push([acx + Math.cos(a) * arx, dy0 + ary + Math.sin(a) * ary]); }
  const door = [[dx0, dy1], ...arch, [dx1, dy1]];
  H.part(P, door, K.wood, { nib: 0.3, shade: [[dx1 - 14, dy0], [dx1 + 1, dy0], [dx1 + 1, dy1], [dx1 - 14, dy1]], hatch: 80, pitch: 0.6 });
  for (const x of [dx0 + 15, dx0 + 30, dx0 + 45]) P.ink([[x, dy0 + 6], [x, dy1 - 0.6]], { nib: 0.14 });
  H.part(P, D.rrect(88, 157.6, 128, 165.6, 1), K.paper, { nib: 0.24, pressure: 0.4, passes: 1 });
  P.text('the tools are inside', 108, 163.4, { face: 'serif-bold', size: 3.1, align: 'center' });
  P.ink([[100, 165.6], [100, 168.4]], { nib: 0.14 }); P.ink([[116, 165.6], [116, 168.4]], { nib: 0.14 });
  [[92, K.brass], [108, K.blue], [124, K.red]].forEach(([x, c]) => M.padlock(P, x, 197, 0.78, { color: c }));
  P.ink([[dx0 - 6, 209.4], [dx1 + 6, 209.4]], { nib: 0.24 });

  M.note(P, 8, 163, 56, 19, ['All three keys must be', 'turned before any tool', 'in the chat will work.'], { size: 2.9, gap: 4.9 });
  M.note(P, 152, 163, 56, 19, ['On Pro or Max you hold', 'the first key yourself.', 'On Team: the Owner does.'], { size: 2.9, gap: 4.9, color: '#d9ecd9' });
  M.parcel(P, 30, 209, 1.0); M.parcel(P, 48, 209, 0.8, { w: 12, h: 12, label: false });
  M.mailbox(P, 196, 209, 0.8);

  TC.draw(P, L, m, {
    style: 'soft', tagColor: (n) => (m.X(n.cx) < 75 ? '#f1dca0' : m.X(n.cx) < 135 ? '#c4dbe9' : '#f0c6c1'),
    labelsBeside: true, stopShort: 2, bounds: { x0: 8, x1: 208 }, textScale: 1.1, labelScale: 1.05,
    avoid: [{ x0: 4, x1: 212, y0: 48, y1: 76 }, { x0: 4, x1: 212, y0: 154, y1: 214 }, ...L.clusters.filter((q) => q !== all).flatMap((c) => { const [x0, y0, x1, y1, hy] = box(c); return [{ x0, x1, y0: y0 - 2, y1: hy + 0.6 }, { x0: x0 - 1.4, x1: x0 + 1.4, y0, y1 }, { x0: x1 - 1.4, x1: x1 + 1.4, y0, y1 }]; })],
  });
  const out = await P.finish(path.join(HERE, 'out/keys.png'), { sizes: [['-x.jpg', 2048, 93], ['-preview.png', 1080]] });
  console.log(out);
}
main().catch((e) => { console.error(e); process.exit(1); });
