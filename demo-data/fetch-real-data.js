#!/usr/bin/env node
'use strict';
// Downloads two real, free, no-sign-up data sets into demo-data/out/ (git-ignored).
//   node demo-data/fetch-real-data.js [year=2025]
//  1. USGS earthquakes (magnitude 2.5+, past 30 days)      -> earthquakes_30d.csv
//  2. Formula 1 race results from OpenF1, joined with names -> f1_<year>_race_results.csv
// Run it yourself; the output is not republished on the site. Needs Node 18+.
// OpenF1 limits how fast you can call it, so this runs slowly (a few minutes) and caches each race, so you can re-run it if it stops.
const fs = require('fs');
const path = require('path');

const year = process.argv[2] || '2025';
const outDir = path.join(__dirname, 'out');
fs.mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cell = (v) => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const csv = (cols, rows) => [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n') + '\n';

async function getJson(url, tries = 7) {
  for (let i = 1; i <= tries; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'genai-notebook-demo-data' } });
    if (res.ok) return res.json();
    if (res.status === 429 || res.status >= 500) { await sleep(4000 * i); continue; }
    throw new Error(`${res.status} for ${url}`);
  }
  throw new Error('gave up on ' + url);
}

async function earthquakes() {
  const gj = await getJson('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson');
  const rows = gj.features.map((f) => ({
    time_utc: new Date(f.properties.time).toISOString(), place: f.properties.place, magnitude: f.properties.mag,
    depth_km: f.geometry.coordinates[2], latitude: f.geometry.coordinates[1], longitude: f.geometry.coordinates[0], type: f.properties.type,
  })).sort((a, b) => a.time_utc.localeCompare(b.time_utc));
  fs.writeFileSync(path.join(outDir, 'earthquakes_30d.csv'), csv(['time_utc', 'place', 'magnitude', 'depth_km', 'latitude', 'longitude', 'type'], rows));
  console.log('earthquakes_30d.csv', rows.length, 'rows');
}

async function f1() {
  const sessions = (await getJson(`https://api.openf1.org/v1/sessions?year=${year}&session_name=Race`))
    .filter((s) => !s.is_cancelled).sort((a, b) => a.date_start.localeCompare(b.date_start));
  const rows = [];
  let round = 0;
  for (const s of sessions) {
    round++;
    const cacheFile = path.join(outDir, `cache-f1-${s.session_key}.json`);
    let results, dr;
    if (fs.existsSync(cacheFile)) ({ results, dr } = JSON.parse(fs.readFileSync(cacheFile, 'utf8')));
    else {
      results = await getJson(`https://api.openf1.org/v1/session_result?session_key=${s.session_key}`);
      await sleep(1200);
      dr = await getJson(`https://api.openf1.org/v1/drivers?session_key=${s.session_key}`);
      fs.writeFileSync(cacheFile, JSON.stringify({ results, dr }));
      await sleep(1200);
    }
    const byNo = new Map(dr.map((d) => [d.driver_number, d]));
    for (const r of results) {
      const d = byNo.get(r.driver_number) || {};
      rows.push({ round, country: s.country_name, circuit: s.circuit_short_name, race_date: s.date_start.slice(0, 10),
        position: r.position, driver: d.full_name || '', team: d.team_name || '', points: r.points, laps: r.number_of_laps,
        dnf: r.dnf, dns: r.dns, dsq: r.dsq });
    }
    process.stdout.write(`\rF1 ${year}: race ${round}/${sessions.length}`);
  }
  console.log();
  const name = `f1_${year}_race_results.csv`;
  fs.writeFileSync(path.join(outDir, name), csv(['round', 'country', 'circuit', 'race_date', 'position', 'driver', 'team', 'points', 'laps', 'dnf', 'dns', 'dsq'], rows));
  console.log(name, rows.length, 'rows');
}

(async () => { await earthquakes(); await f1(); })().catch((e) => { console.error(e.message); process.exit(1); });
