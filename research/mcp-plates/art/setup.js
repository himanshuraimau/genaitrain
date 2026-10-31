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
  const L = await layOut(path.join(HERE, 'mcp/setup/layout.mmd'), { face: 'Kevin Serif Bold', svgOut: path.join(HERE, 'out/setup-layout.svg') });
  const P = plate({ id: 'setup', w: 216, h: 216, ppm: FAST ? 5 : 10, seed: 'mcp-setup-1', paper: 'hotpress' });
  const m = mapper(contentBox(L), { x: 40, y: 48, w: 150, h: 160 });
  saveShapes(path.join(HERE, 'out/setup-pele.json'), L, m);
  for (const n of L.nodes) console.log(n.lines.map((q) => q.text).join(' '), [m.X(n.cx - n.w / 2), m.Y(n.cy - n.h / 2), m.X(n.cx + n.w / 2), m.Y(n.cy + n.h / 2)].map((v) => Math.round(v)).join(','));
  for (const c of L.clusters) console.log('cluster', c.label[0].text, [m.X(c.x), m.Y(c.y), m.X(c.x + c.w), m.Y(c.y + c.h), m.Y(c.headY)].map((v) => Math.round(v)).join(','));

  P.text('MCP at the mail desk  ·  II', 12.5, 13.6, { face: 'serif-bold', size: 3.8 });
  P.text('Address to working', 11, 30, { size: 13 });
  P.italic('adding a connector, and what can go wrong', 12.5, 39.6, { face: 'serif-bold', size: 4.2 });

  // parent state drawn as a post-office window
  const sg = L.clusters.find((c) => c.label[0].text === 'signed in');
  const wx0 = m.X(sg.x), wy0 = m.Y(sg.y), wx1 = m.X(sg.x + sg.w), wy1 = m.Y(sg.y + sg.h), wh = m.Y(sg.headY);
  const outer = D.rrect(wx0 - 1.6, wy0 - 1.6, wx1 + 1.6, wy1 + 1.6, 2.4), band = D.rrect(wx0 - 1.6, wy0 - 1.6, wx1 + 1.6, wh + 0.8, 2.4), glass = D.rrect(wx0 + 0.6, wh + 1.4, wx1 - 0.6, wy1 - 0.6, 1.4);
  P.paper([outer]); P.colour([outer], '#cfe0ea', { pressure: 0.5, passes: 1, cut: [glass] }); P.colour([glass], '#eef5f6', { pressure: 0.3, passes: 1 });
  P.colour([band], K.blue, { pressure: 0.7, passes: 2 });
  P.outline([outer], { nib: 0.34 }); P.outline([glass], { nib: 0.16 });
  P.text('signed in', (wx0 + wx1) / 2, (wy0 + wh) / 2 + 1.5, { face: 'serif-bold', size: 4.2, align: 'center', color: '#fbf7ee' });
  for (let x = wx0 + 5; x < wx1 - 3; x += 5.6) P.ink([[x, wy1 + 0.2], [x, wy1 + 2.6]], { nib: 0.14 });
  // props around the frame
  M.note(P, 8, 52, 46, 26, ['Change a connector\'s', 'details? Remove it', 'and add it again.', '(Claude Help)'], { size: 2.75, gap: 4.6 });
  M.note(P, 134, 50, 74, 21, ['Sign-in ran out? Reconnect it', 'in Customize > Connectors,', 'then switch it on in the chat.'], { size: 2.75, gap: 4.7, color: '#f8d9d4' });
  M.mailbox(P, 26, 207, 1.25);
  M.parcel(P, 188, 207, 0.9); M.parcel(P, 206, 207, 0.62, { w: 12, h: 12, label: false });
  M.envelope(P, 30, 104, 1.1, { rot: -0.1, seal: true, stamp: K.green });
  M.padlock(P, 195, 130, 0.9, { open: true, color: K.steel });
  M.key(P, 186, 148, 0.9, 0.4, K.brass);
  const nodeBoxes = L.nodes.map((n) => ({ x0: m.X(n.cx - n.w / 2), x1: m.X(n.cx + n.w / 2), y0: m.Y(n.cy - n.h / 2), y1: m.Y(n.cy + n.h / 2) }));

  TC.draw(P, L, m, {
    style: 'soft', tagColor: (n) => (/expired/.test(n.lines.map((q) => q.text).join(' ')) ? '#f4c9c4' : /on in this chat/.test(n.lines.map((q) => q.text).join(' ')) ? '#cfe5c9' : '#f6ecd4'),
    labelsBeside: true, stopShort: 2.2, bounds: { x0: 4, x1: 212 },
    avoid: [{ x0: wx0 - 3, x1: wx1 + 3, y0: wy0 - 3, y1: wh + 1.5 }, { x0: wx0 - 3, x1: wx0 + 3, y0: wy0, y1: wy1 + 4 }, { x0: wx1 - 3, x1: wx1 + 3, y0: wy0, y1: wy1 + 4 }, { x0: wx0 - 3, x1: wx1 + 3, y0: wy1 - 3, y1: wy1 + 4 },
      { x0: 4, x1: 58, y0: 48, y1: 86 }, { x0: 130, x1: 210, y0: 46, y1: 74 }, { x0: 4, x1: 62, y0: 176, y1: 214 }, { x0: 184, x1: 212, y0: 186, y1: 214 }],
  });
  const out = await P.finish(path.join(HERE, 'out/setup.png'), { sizes: [['-x.jpg', 2048, 93], ['-preview.png', 1080]] });
  console.log(out);
}
main().catch((e) => { console.error(e); process.exit(1); });
