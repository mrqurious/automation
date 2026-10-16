#!/usr/bin/env node
// Merge a batch of research entries into backlog/resources.json and set the matching status in
// backlog/tools-list.json from each entry's verdict.
//   node scripts/backlog-merge.mjs <batch.json>
// batch.json = { "<tool-id>": { ...entry per the schema in resources.json... }, ... }
// verdict -> status: list / list-sibling -> researched · skip -> rejected · blocked / needs-owner -> blocked.
// Then run: node scripts/backlog-build.mjs. No dependencies, Node >= 22.

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const file = process.argv[2];
if (!file) { console.error('usage: node scripts/backlog-merge.mjs <batch.json>'); process.exit(2); }

const batch = JSON.parse(readFileSync(resolve(file), 'utf8'));
const resFile = join(root, 'backlog/resources.json');
const listFile = join(root, 'backlog/tools-list.json');
const res = JSON.parse(readFileSync(resFile, 'utf8'));
const list = JSON.parse(readFileSync(listFile, 'utf8'));
const ids = new Set(list.tools.map((t) => t.id));
const status = { list: 'researched', 'list-sibling': 'researched', skip: 'rejected', blocked: 'blocked', 'needs-owner': 'blocked' };

let n = 0;
for (const [id, e] of Object.entries(batch)) {
  if (!ids.has(id)) { console.error(`unknown tool id: ${id}`); process.exit(1); }
  if (!status[e.verdict]) { console.error(`${id}: bad verdict ${e.verdict}`); process.exit(1); }
  if (e.verdict !== 'list' && e.verdict !== 'list-sibling' && !e.verdictReason) { console.error(`${id}: verdictReason required`); process.exit(1); }
  if (e.verdict.startsWith('list') && !e.rl) { console.error(`${id}: rl block required`); process.exit(1); }
  res.resources[id] = e;
  n++;
}
for (const t of list.tools) {
  const e = batch[t.id];
  if (e) { t.status = status[e.verdict]; t.notes = e.verdictReason || t.notes; }
}
writeFileSync(resFile, JSON.stringify(res, null, 2) + '\n');
writeFileSync(listFile, JSON.stringify(list, null, 2) + '\n');
console.log(`merged ${n} entries`);
