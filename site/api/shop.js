'use strict';
// Live demo data for the notebook's data-analysis chapter.
// /api/shop?table=orders|signups|ad_spend&days=90   (optional &end=YYYY-MM-DD)
// Returns CSV that ends today (UTC), so Google Sheets =IMPORTDATA(...) shows a new day each morning.
const { generate, toCsv, COLUMNS, toIso } = require('./_lib/shop');

module.exports = (req, res) => {
  const q = new URL(req.url, 'http://localhost').searchParams;
  const table = q.get('table') || 'orders';
  if (!COLUMNS[table]) {
    res.status(400).setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.send('table must be one of: ' + Object.keys(COLUMNS).join(', ') + '\n');
  }
  const days = Math.min(365, Math.max(1, parseInt(q.get('days') || '90', 10) || 90));
  const endParam = q.get('end');
  const end = /^\d{4}-\d{2}-\d{2}$/.test(endParam || '') ? endParam : toIso(Date.now());
  const data = generate(end, days, end); // 'now' for statuses is the end date, so an explicit end= reproduces a snapshot
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(toCsv(table, data[table]));
};
