'use strict';
// Mail-desk props for the "MCP at the mail desk" plates. Units are mm. Built on the helpers in shop.js.
const D = require('../tools/lib/draw');
const Lt = require('../tools/lib/letter');
const H = require('./shop');
const { at, part } = H;

const K = {
  kraft: '#d9b983', kraftLight: '#e8cfa2', kraftDeep: '#a98351', tape: '#efe0b0', red: '#c9473e', redDeep: '#a33a33', blue: '#4f7fae', sky: '#c9dfec',
  green: '#6f9a5c', mint: '#c3e0cf', brass: '#dcb65c', brassDeep: '#b08a3a', steel: '#bcc5ca', steelDeep: '#8f9aa1', paper: '#fbf7ee', wood: '#c99b6b',
  woodDeep: '#9c7148', blush: '#f2b9c2', lilac: '#cdbde4', ink: '#1d1a1e',
};
const RED = '#b8352f';

function parcel(P, cx, by, s, o = {}) {
  const T = at(cx, by, s), w = o.w ?? 15, h = o.h ?? 10, d = 3.2, a = w / 2;
  part(P, T([[-a, -h], [a, -h], [a, 0], [-a, 0]]), o.color || K.kraft, { nib: 0.24 });
  part(P, T([[-a, -h], [-a + d, -h - d], [a + d, -h - d], [a, -h]]), K.kraftLight, { nib: 0.22, passes: 1, pressure: 0.55 });
  part(P, T([[a, -h], [a + d, -h - d], [a + d, -d], [a, 0]]), K.kraftDeep, { nib: 0.22, passes: 1, pressure: 0.6 });
  const tx = o.tapeAt ?? 0;
  part(P, T([[tx - 1.3, -h], [tx + 1.3, -h], [tx + 1.3, 0], [tx - 1.3, 0]]), K.tape, { nib: 0.14, passes: 1, pressure: 0.55 });
  part(P, T([[tx - 1.3, -h], [tx - 1.3 + d, -h - d], [tx + 1.3 + d, -h - d], [tx + 1.3, -h]]), K.tape, { nib: 0.14, passes: 1, pressure: 0.5 });
  if (o.label !== false) {
    const lab = T([[tx + 2.6, -h + 2], [tx + 2.6 + w * 0.34, -h + 2], [tx + 2.6 + w * 0.34, -h + 5.6], [tx + 2.6, -h + 5.6]]);
    part(P, lab, K.paper, { nib: 0.14, passes: 1, pressure: 0.35 });
    P.ink(T([[tx + 3.4, -h + 3.2], [tx + 2.6 + w * 0.34 - 0.8, -h + 3.2]]), { nib: 0.1 });
    P.ink(T([[tx + 3.4, -h + 4.5], [tx + 2.6 + w * 0.2, -h + 4.5]]), { nib: 0.1 });
  }
}

function envelope(P, cx, cy, s, o = {}) {
  const a = o.rot ?? 0, T = at(cx, cy, s, a), w = o.w ?? 18, h = o.h ?? 11.5;
  const body = T([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]);
  part(P, body, o.color || K.paper, { nib: 0.24, passes: 1, pressure: o.tint ? 0.6 : 0.3 });
  P.ink(T([[-w / 2, -h / 2], [0, 1.2], [w / 2, -h / 2]]), { nib: 0.16 });
  if (o.lines !== false) {
    P.ink(T([[-w / 2 + 2.2, h / 2 - 2.2], [-w / 2 + 6.4, h / 2 - 2.2]]), { nib: 0.1 });
  }
  if (o.stamp !== false) part(P, T(D.rrect(w / 2 - 4.6, -h / 2 + 1.1, w / 2 - 1.2, -h / 2 + 4.6, 0.3)), o.stamp || K.blue, { nib: 0.14, passes: 1 });
  if (o.seal) { const c = T(D.ell(0, 1.4, 1.9, 1.9)); part(P, c, K.red, { nib: 0.18 }); }
}

function padlock(P, cx, by, s, o = {}) {
  const T = at(cx, by, s), open = !!o.open, col = o.color || K.brass;
  const lift = open ? -3.2 : 0;
  P.ink(T(D.curve([[-3.4, -8.6], [-3.4, -13 + lift], [-1.6, -15.6 + lift], [0, -16 + lift], [1.6, -15.6 + lift], [3.4, -13 + lift], [3.4, open ? -13 : -8.6]], false, 0.3)), { nib: 0.62, color: K.steelDeep });
  P.ink(T(D.curve([[-3.4, -8.6], [-3.4, -13 + lift], [-1.6, -15.6 + lift], [0, -16 + lift], [1.6, -15.6 + lift], [3.4, -13 + lift], [3.4, open ? -13 : -8.6]], false, 0.3)), { nib: 0.12 });
  part(P, T(D.rrect(-5.6, -9, 5.6, 0, 1.4)), col, { nib: 0.26, shade: T([[1.6, -10], [6.4, -10], [6.4, 1], [1.6, 1]]), hatch: 80, pitch: 0.6 });
  P.dot(...T([[0, -5.4]])[0], 0.9 * s, K.ink);
  P.ink(T([[0, -5.4], [0, -2.8]]), { nib: 0.2 });
}

function key(P, x, y, s, a, color) {
  const T = at(x, y, s, a);
  const bow = T(D.ell(0, 0, 3.4, 3.4));
  part(P, bow, color || K.brass, { nib: 0.24 });
  const hole = T(D.ell(0, 0, 1.3, 1.3)); P.paper([hole]); P.outline([hole], { nib: 0.14 });
  part(P, T(D.rrect(3.2, -0.8, 14.5, 0.8, 0.4)), K.steel, { nib: 0.2, passes: 1, pressure: 0.6 });
  part(P, T([[10.2, 0.8], [10.2, 3.4], [11.8, 3.4], [11.8, 0.8]]), K.steel, { nib: 0.18, passes: 1 });
  part(P, T([[12.6, 0.8], [12.6, 2.6], [14.5, 2.6], [14.5, 0.8]]), K.steel, { nib: 0.18, passes: 1 });
}

function stampTool(P, cx, by, s) {
  const T = at(cx, by, s);
  part(P, T(D.rrect(-7, -4.2, 7, 0, 0.6)), K.woodDeep, { nib: 0.26, shade: T([[2, -5], [8, -5], [8, 1], [2, 1]]), hatch: 80, pitch: 0.6 });
  part(P, T([[-6.6, -0.9], [6.6, -0.9], [6.6, 0], [-6.6, 0]]), K.red, { nib: 0.12, passes: 1, pressure: 0.9 });
  part(P, T([[-1.4, -4.2], [1.4, -4.2], [1.4, -11], [-1.4, -11]]), K.wood, { nib: 0.22, passes: 1 });
  part(P, T(D.rrect(-4.8, -14, 4.8, -10.6, 1.4)), K.wood, { nib: 0.26, shade: T([[1.4, -15], [6, -15], [6, -10], [1.4, -10]]), hatch: 78, pitch: 0.55 });
}

function askBubble(P, cx, by, s) {
  const T = at(cx, by, s);
  const bub = T(D.curve([[-7, -14], [-6, -17], [0, -18.4], [6, -17], [7, -14], [6, -9.4], [1, -8.6], [-2.4, -4], [-2.6, -8.8], [-6, -9.6]], true, 0.4));
  part(P, bub, '#fff0a6', { nib: 0.26, shade: T([[2, -19], [8, -19], [8, -4], [2, -4]]), hatch: 78, pitch: 0.6 });
  Lt.write(P.S, '?', cx, by - 10.4 * s, { face: 'serif-bold', size: 6.2 * s, align: 'center', color: K.red, slant: 0 });
}

function inkPad(P, cx, by, s) {
  const T = at(cx, by, s);
  part(P, T(D.rrect(-8, -3.4, 8, 0, 0.8)), K.steelDeep, { nib: 0.22, passes: 1 });
  part(P, T(D.rrect(-7, -4.6, 7, -2.8, 0.6)), K.red, { nib: 0.16, passes: 1 });
}

function stampMark(P, cx, cy, lines, rot, color = RED, size = 3.4) {
  const w = Math.max(...lines.map((t) => Lt.measure(t, 'serif-bold', size))) + 6, h = lines.length * size * 1.35 + size;
  const outer = D.tf(D.rrect(-w / 2, -h / 2, w / 2, h / 2, 1.2), { x: cx, y: cy, rot }), inner = D.tf(D.rrect(-w / 2 + 1, -h / 2 + 1, w / 2 - 1, h / 2 - 1, 0.8), { x: cx, y: cy, rot });
  P.outline([outer], { nib: 0.5, color }); P.outline([inner], { nib: 0.18, color });
  lines.forEach((t, i) => Lt.write(P.S, t, cx + Math.sin(rot) * (i - (lines.length - 1) / 2) * -size * 1.35, cy + Math.cos(rot) * (i - (lines.length - 1) / 2) * size * 1.35 + size * 0.35, { face: 'serif-bold', size, align: 'center', color, slant: 0 }));
}

function mailbox(P, cx, by, s, o = {}) {
  const T = at(cx, by, s);
  part(P, T(D.rrect(-1.6, -14, 1.6, 0, 0.4)), K.woodDeep, { nib: 0.22, passes: 1 });
  const box = T(D.curve([[-9, -14], [-9, -24], [-5, -28], [0, -28.6], [5, -28], [9, -24], [9, -14]], true, 0.4));
  part(P, box, o.color || K.blue, { nib: 0.28, shade: T([[2.4, -30], [10, -30], [10, -13], [2.4, -13]]), hatch: 78, pitch: 0.6 });
  part(P, T(D.rrect(-5.4, -22.6, 5.4, -18.2, 0.8)), '#26333f', { nib: 0.2, passes: 1, pressure: 0.9 });
  const fl = o.flag === false ? [[9, -22], [9, -26]] : [[9, -14], [9, -30], [14, -30], [14, -27]];
  part(P, T([[9.6, -16], [11.6, -16], [11.6, -30], [15, -30], [15, -26.4], [9.6, -26.4]]), K.red, { nib: 0.2, passes: 1 });
}

function pigeonholes(P, x0, y0, x1, y1, rows, cols, o = {}) {
  const frame = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  part(P, frame, K.woodDeep, { nib: 0.3, pressure: 0.5 });
  const cw = (x1 - x0 - 2) / cols, ch = (y1 - y0 - 2) / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const cx0 = x0 + 1 + c * cw + 0.5, cy0 = y0 + 1 + r * ch + 0.5, cell = [[cx0, cy0], [cx0 + cw - 1, cy0], [cx0 + cw - 1, cy0 + ch - 1], [cx0, cy0 + ch - 1]];
    part(P, cell, '#efe2c4', { nib: 0.16, passes: 1, pressure: 0.35 });
    if ((o.fill || []).some(([fr, fc]) => fr === r && fc === c)) {
      const px = cx0 + cw / 2 - 0.5, py = cy0 + ch - 1;
      const T = at(px, py, 0.5);
      part(P, T([[-6, -2], [6, -2], [6, 0], [-6, 0]]), K.paper, { nib: 0.1, passes: 1, pressure: 0.3 });
      P.ink(T([[-6, -2], [0, -0.8], [6, -2]]), { nib: 0.08 });
    }
  }
}

function desk(P, x0, x1, y, h, o = {}) {
  const top = [[x0 - 1.5, y - 2.4], [x1 + 1.5, y - 2.4], [x1 + 1.5, y], [x0 - 1.5, y]];
  const front = [[x0, y], [x1, y], [x1, y + h], [x0, y + h]];
  part(P, front, o.front || '#e5d3b0', { shade: [[x0, y], [x1, y], [x1, y + 2.6], [x0, y + 2.6]], hatch: 0, pitch: 0.55 });
  for (let x = x0 + 7; x < x1 - 2; x += 10) P.ink([[x, y + 3.2], [x, y + h - 1.2]], { nib: 0.12 });
  part(P, top, K.wood, { shade: [[x0 - 2, y - 0.9], [x1 + 2, y - 0.9], [x1 + 2, y + 0.2], [x0 - 2, y + 0.2]], hatch: 0, pitch: 0.45 });
}

function note(P, x, y, w, h, lines, o = {}) {
  const poly = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  part(P, poly, o.color || '#fff0a6', { nib: 0.2, passes: 1, pressure: 0.6 });
  lines.forEach((t, i) => Lt.write(P.S, t, x + 2, y + 4.4 + i * (o.gap ?? 4.2), { face: 'serif-bold', size: o.size ?? 2.9, color: o.ink || K.ink, slant: 0 }));
}

function ladybug(P, x, y, s, a = 0) {
  const T = at(x, y, s, a);
  const body = T(D.ell(0, 0, 4, 3.2)), head = T(D.ell(-4.4, 0, 1.8, 1.7));
  for (const sd of [-1, 1]) for (const lx of [-1.6, 0.4, 2.2]) P.ink(T([[lx, sd * 2.8], [lx + 0.8, sd * 4.6]]), { nib: 0.14 });
  part(P, head, '#3d3436', { nib: 0.16 });
  part(P, body, '#d4453b', { nib: 0.2 });
  P.ink(T([[-4, 0], [4, 0]]), { nib: 0.14 });
  for (const [px, py] of [[-1.6, -1.6], [1.8, -1.4], [0.2, 1.8], [2.4, 1.4], [-2, 1.2]]) P.dot(...T([[px, py]])[0], 0.55, '#2f2a2c');
  for (const sd of [-1, 1]) P.curve(T([[-5.6, sd * 0.6], [-7, sd * 1.6], [-7.6, sd * 2.6]]), { nib: 0.1 });
}

function laptop(P, cx, by, s, o = {}) {
  const T = at(cx, by, s);
  part(P, T([[-9, -13], [9, -13], [9, -1.4], [-9, -1.4]]), K.steel, { nib: 0.24, passes: 1, pressure: 0.6 });
  part(P, T([[-7.6, -11.8], [7.6, -11.8], [7.6, -2.8], [-7.6, -2.8]]), o.screen || '#e8f1f5', { nib: 0.14, passes: 1, pressure: 0.5 });
  part(P, T([[-11, -1.4], [11, -1.4], [12, 0], [-12, 0]]), K.steelDeep, { nib: 0.2, passes: 1 });
  (o.lines || []).forEach((l, i) => P.ink(T([[-6, -9.6 + i * 2.2], [-6 + l, -9.6 + i * 2.2]]), { nib: 0.1 }));
}

function cloud(P, cx, cy, s) {
  const T = at(cx, cy, s);
  const c = T(D.curve([[-10, 3], [-12, -1], [-8, -4], [-5, -7], [0, -8], [5, -6.4], [9, -5], [12, -1], [10, 3]], true, 0.4));
  part(P, c, '#f4f8fa', { nib: 0.22, passes: 1, pressure: 0.5 });
}

module.exports = { K, RED, askBubble, parcel, envelope, padlock, key, stampTool, inkPad, stampMark, mailbox, pigeonholes, desk, note, ladybug, laptop, cloud };
