#!/usr/bin/env node
'use strict';
// Writes the three Kite & Co files as a fixed snapshot (so every learner gets the same data).
//   node demo-data/make-demo-data.js [end-date=2026-11-04] [days=90]
const fs = require('fs');
const path = require('path');
const { generate, toCsv, addDays } = require('../site/api/_lib/shop');

const end = process.argv[2] || '2026-11-04';
const days = parseInt(process.argv[3] || '90', 10);
const outDir = path.join(__dirname, '..', 'site', 'demo-data');
fs.mkdirSync(outDir, { recursive: true });

const data = generate(end, days, end);
for (const table of Object.keys(data)) {
  fs.writeFileSync(path.join(outDir, table + '.csv'), toCsv(table, data[table]));
  console.log(table.padEnd(9), String(data[table].length).padStart(5), 'rows');
}
console.log(`from ${addDays(end, -(days - 1))} to ${end}`);
