'use strict';
// "Kite & Co": a made-up online stationery shop, used to teach data analysis.
// Everything is generated from the DATE, so the same date always gives the same rows
// and a new day adds new rows with no redeploy. All people and emails are fake.

const SEED = 'kiteco-v1';
const INSTAGRAM_PAUSED_FROM = '2026-10-06';
const INSTAGRAM_BACK_ON = '2026-11-12';
const SAVE20_FROM = '2026-09-10';
const SAVE20_TO = '2026-09-24';
const LAG_DAYS = 7; // orders follow signups by about a week

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rngFor(...parts) {
  let a = hash([SEED, ...parts].join('|'));
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (r, list) => list[Math.floor(r() * list.length)];
function weighted(r, items) { // items: [[value, weight], ...]
  const total = items.reduce((s, [, w]) => s + w, 0);
  let x = r() * total;
  for (const [v, w] of items) { x -= w; if (x <= 0) return v; }
  return items[items.length - 1][0];
}

const DAY = 86400000;
const toMs = (iso) => Date.parse(iso + 'T00:00:00Z');
const toIso = (ms) => new Date(ms).toISOString().slice(0, 10);
const addDays = (iso, n) => toIso(toMs(iso) + n * DAY);
const isWeekend = (iso) => [0, 6].includes(new Date(toMs(iso)).getUTCDay());

function instagramFactor(iso) {
  if (iso >= INSTAGRAM_PAUSED_FROM && iso < INSTAGRAM_BACK_ON) return 0.04; // a trickle of organic visits
  const sinceBack = (toMs(iso) - toMs(INSTAGRAM_BACK_ON)) / DAY;
  if (sinceBack >= 0 && sinceBack < 3) return [0.5, 0.8, 0.95][sinceBack];  // ramps back up
  return 1;
}

const CHANNELS = {
  google:     { visits: 520, conv: 0.040, spend: 9000 },
  instagram:  { visits: 300, conv: 0.035, spend: 6000 },
  newsletter: { visits: 180, conv: 0.060, spend: 0 },
  referral:   { visits: 90,  conv: 0.050, spend: 0 },
  direct:     { visits: 240, conv: 0.030, spend: 0 },
};

// One day of the web-analytics and ad-spend tables.
function webDay(iso) {
  const signups = [], ads = [];
  const wk = isWeekend(iso) ? 0.85 : 1;
  for (const [channel, c] of Object.entries(CHANNELS)) {
    const r = rngFor('web', iso, channel);
    const f = channel === 'instagram' ? instagramFactor(iso) : 1;
    const visits = Math.round(c.visits * f * wk * (0.88 + 0.24 * r()));
    const conv = c.conv * (0.9 + 0.2 * r());
    signups.push({ date: iso, channel, visits, signups: Math.round(visits * conv) });
    if (c.spend > 0) {
      const spend = Math.round(c.spend * (channel === 'instagram' ? (f >= 0.5 ? f : 0) : 1) * (0.92 + 0.16 * r()));
      const clicks = spend ? Math.round(visits * (0.8 + 0.2 * r())) : 0;
      ads.push({ date: iso, channel, spend_inr: spend, clicks });
    }
  }
  return { signups, ads };
}

const PRODUCTS = [
  ['Notebook A5 Dotted', 'Notebooks', 249, 5], ['Notebook A4 Ruled', 'Notebooks', 329, 4],
  ['Gel Pen Set (10)', 'Pens', 199, 6], ['Fountain Pen Classic', 'Pens', 899, 1.5],
  ['Highlighter Pastel (6)', 'Pens', 229, 3], ['Desk Planner 2027', 'Planners', 599, 2.5],
  ['Sticky Notes Pack', 'Paper', 149, 4], ['Washi Tape Set', 'Craft', 279, 2],
  ['Sketchbook A4', 'Art', 449, 2], ['Pencil Case Canvas', 'Accessories', 349, 2.5],
];
const CHANNEL_NAMES = {
  google: ['Google', 'google', 'Google Ads'], instagram: ['Instagram', 'insta', 'IG', 'instagram '],
  newsletter: ['Newsletter', 'email', 'Email newsletter'], referral: ['Referral', 'referral'],
  direct: ['Direct', '(direct)', 'direct'],
};
const COUNTRY_NAMES = {
  India: ['India', 'India', 'India', 'IN', 'india ', 'INDIA'], UAE: ['UAE', 'United Arab Emirates', 'AE'],
  Singapore: ['Singapore', 'SG'], 'United States': ['United States', 'US', 'USA'],
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n, w = 2) => String(n).padStart(w, '0');

function messyDate(r, iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const x = r();
  if (x < 0.80) return iso;                                  // 2026-10-06
  if (x < 0.92) return `${pad(d)}/${pad(m)}/${y}`;           // 06/10/2026 (day first)
  return `${d} ${MONTHS[m - 1]} ${y}`;                       // 6 Oct 2026
}
function messyStatus(r, status) {
  const x = r();
  return x < 0.8 ? status : x < 0.9 ? status.toLowerCase() : status.toUpperCase();
}

function ordersForDay(iso, lagSignups, todayIso) {
  const r = rngFor('orders', iso);
  const total = lagSignups.reduce((s, x) => s + x.signups, 0);
  const promo = iso >= SAVE20_FROM && iso <= SAVE20_TO;
  const wk = isWeekend(iso) ? 0.9 : 1;
  const expected = (14 + 0.22 * total) * wk * (promo ? 1.18 : 1);
  const n = Math.max(0, Math.round(expected * (0.85 + 0.3 * r())));
  const mix = lagSignups.map((x) => [x.channel, x.signups + 1]);
  const rows = [];
  for (let i = 0; i < n; i++) {
    const [name, category, price] = weighted(r, PRODUCTS.map((p) => [p, p[3]]));
    const channel = weighted(r, mix);
    const country = weighted(r, [['India', 90], ['UAE', 4], ['Singapore', 3], ['United States', 3]]);
    const qty = weighted(r, [[1, 70], [2, 22], [3, 8]]);
    const customer = 1000 + Math.floor(r() * 1800);
    let code = '';
    if (promo && r() < 0.5) code = 'SAVE20';
    else if (r() < 0.06) code = 'WELCOME10';
    const age = (toMs(todayIso) - toMs(iso)) / DAY;
    const status = weighted(r, [[age < 4 ? 'Shipped' : 'Delivered', 90], ['Cancelled', 5], ['Refunded', 5]]);
    rows.push({
      order_id: `KC-${iso.replace(/-/g, '')}-${pad(i + 1, 4)}`,
      order_date: messyDate(r, iso),
      customer_id: `C${customer}`,
      customer_email: `customer${customer}@example.com`,
      country: pick(r, COUNTRY_NAMES[country]),
      channel: pick(r, CHANNEL_NAMES[channel]),
      product: name,
      category: r() < 0.02 ? '' : category,
      quantity: qty,
      unit_price_inr: price,
      discount_code: code,
      status: messyStatus(r, status),
    });
  }
  // a little deliberate mess, decided by the date so it is the same every time
  const m = rngFor('mess', iso);
  if (rows.length && m() < 0.35) rows.push({ ...rows[Math.floor(m() * rows.length)] });            // exact duplicate
  if (rows.length && m() < 0.06) rows[Math.floor(m() * rows.length)].quantity = -1;                 // a return typed as -1
  if (rows.length && m() < 0.025) rows[Math.floor(m() * rows.length)].unit_price_inr *= 100;        // extra zeros
  if (m() < 0.035) rows.push({ order_id: `KC-${iso.replace(/-/g, '')}-TEST`, order_date: iso, customer_id: 'TEST',
    customer_email: 'test@example.com', country: 'India', channel: 'direct', product: 'Gel Pen Set (10)',
    category: 'Pens', quantity: 1, unit_price_inr: 1, discount_code: '', status: 'Delivered' });  // a test order
  return rows;
}

const COLUMNS = {
  orders: ['order_id', 'order_date', 'customer_id', 'customer_email', 'country', 'channel', 'product', 'category',
    'quantity', 'unit_price_inr', 'discount_code', 'status'],
  signups: ['date', 'channel', 'visits', 'signups'],
  ad_spend: ['date', 'channel', 'spend_inr', 'clicks'],
};

// endIso: last day to include. days: how many days back (inclusive).
function generate(endIso, days, todayIso = endIso) {
  const out = { orders: [], signups: [], ad_spend: [] };
  for (let k = days - 1; k >= 0; k--) {
    const iso = addDays(endIso, -k);
    const w = webDay(iso);
    out.signups.push(...w.signups);
    out.ad_spend.push(...w.ads);
    out.orders.push(...ordersForDay(iso, webDay(addDays(iso, -LAG_DAYS)).signups, todayIso));
  }
  return out;
}

function csvCell(v) {
  const s = v === undefined || v === null ? '' : String(v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function toCsv(table, rows) {
  const cols = COLUMNS[table];
  return [cols.join(','), ...rows.map((row) => cols.map((c) => csvCell(row[c])).join(','))].join('\n') + '\n';
}

module.exports = { generate, toCsv, COLUMNS, addDays, toIso, toMs };
