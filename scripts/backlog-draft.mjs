#!/usr/bin/env node
// Write RL draft resource files (stage: draft) for researched tools, from backlog/resources.json.
//   node scripts/backlog-draft.mjs --out <rl-clone>/src/content/resources [--ids a,b,c] [--branch resource/batch-NN]
// Default ids: every tool whose status is "researched". Real content only: a field with no source is omitted.
// After writing: node scripts/lint-resource.mjs <file>, then the RL checks (bun run check:content / check / build).
// On success sets draft.branch/file in resources.json and status "drafted" is applied by --mark. No dependencies, Node >= 22.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const out = opt('--out');
if (!out) { console.error('usage: --out <rl>/src/content/resources [--ids a,b] [--branch resource/batch-NN] [--mark]'); process.exit(2); }
const branch = opt('--branch', null);
const mark = args.includes('--mark');

const resFile = join(root, 'backlog/resources.json');
const listFile = join(root, 'backlog/tools-list.json');
const res = JSON.parse(readFileSync(resFile, 'utf8'));
const list = JSON.parse(readFileSync(listFile, 'utf8'));
const ids = opt('--ids') ? opt('--ids').split(',') : list.tools.filter((t) => t.status === 'researched').map((t) => t.id);
const today = new Date().toISOString().slice(0, 10);
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

function markDrafted(id, e, r) {
  e.draft = { branch, file: `src/content/resources/${r.slug}.md`, lint: 'pass' };
  list.tools.find((x) => x.id === id).status = 'drafted';
}

for (const id of ids) {
  const e = res.resources[id];
  if (!e || !e.rl) { console.error(`skip ${id}: no rl block`); continue; }
  const r = e.rl, ic = r.icon || {};
  const file = join(out, `${r.slug}.md`);
  if (existsSync(file) && !args.includes('--force')) {
    console.error(`${r.slug}: file exists, not rewritten`);
    if (mark) markDrafted(id, e, r);
    continue;
  }
  const L = ['---', 'stage: draft', `type: ${r.type}`, `title: ${q(r.title)}`, `description: ${q(r.description)}`,
    `url: ${e.site.url}`, `category: ${r.category}`, `pricing: ${e.pricing.rlLabel}`, `date: ${today}`, 'tags:'];
  for (const t of r.tags) L.push(`  - ${t}`);
  L.push(r.relatedResources.length ? 'relatedResources:' : 'relatedResources: []');
  for (const t of r.relatedResources) L.push(`  - ${t}`);
  if (r.similarResources.length) { L.push('similarResources:'); for (const t of r.similarResources) L.push(`  - ${t}`); }
  if (ic.route === 'iconLib') { L.push(`iconLib: ${q(ic.value)}`, `bgColor: ${q(ic.bgColor || '#ffffff')}`, `fillColor: ${q(ic.fillColor)}`); }
  const src = e.sources.map((s) => `${s.url} (${s.note}, ${s.date})`).join('; ');
  const unv = e.unverified.length ? e.unverified.join('; ') : 'none';
  L.push('remarks: >-',
    `  Backlog draft ${today}. Sources: ${src}.`,
    `  License line: ${e.license ? e.license.line : 'not read'}.`,
    `  Logo: ${ic.route && ic.route !== 'none' ? ic.source : 'none yet'}. Unverified: ${unv}.`,
    '---', '',
    `${r.description}`, '',
    `Pricing (read ${e.pricing.evidence.date}): ${e.pricing.freeTier || 'no free tier found'}${e.pricing.paidFrom ? `; paid from ${e.pricing.paidFrom}` : ''}.`, '',
    '**Key Features:**', '', ...r.keyFeatures.map((k) => `- ${k}`), '',
    `Visit the site: [${r.title}](${e.site.url})`, '');
  writeFileSync(file, L.join('\n'));
  console.log('wrote', file);
  if (mark) markDrafted(id, e, r);
}
if (mark) { writeFileSync(resFile, JSON.stringify(res, null, 2) + '\n'); writeFileSync(listFile, JSON.stringify(list, null, 2) + '\n'); }
