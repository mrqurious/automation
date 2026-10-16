#!/usr/bin/env node
// Triage backlog/tools-list.json and regenerate backlog/tools.md.
//   node scripts/backlog-build.mjs            triage + rewrite tools-list.json + tools.md
//   node scripts/backlog-build.mjs --status   print counts only (resume view for a new session)
//
// Auto statuses (recomputed every run): todo · in-rl · deferred-paid · deferred-trial
// Researcher statuses (never overwritten): researching · researched · drafted · rejected · blocked
// Facts about a tool live in backlog/resources.json, not here. No dependencies, Node >= 22.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const listFile = join(root, 'backlog/tools-list.json');
const resFile = join(root, 'backlog/resources.json');
const mdFile = join(root, 'backlog/tools.md');
const statusOnly = process.argv.includes('--status');

const data = JSON.parse(readFileSync(listFile, 'utf8'));
const resources = existsSync(resFile) ? JSON.parse(readFileSync(resFile, 'utf8')).resources || {} : {};

// What RL already has (url host + slug).
let rl = [];
try {
  const out = execFileSync('node', [join(root, 'scripts/rl-index.mjs'), '--json'], { encoding: 'utf8' }).replace(/^﻿/, '');
  rl = JSON.parse(out);
} catch (e) { console.error('warning: rl-index unavailable, in-rl check skipped:', e.message.split('\n')[0]); }
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return null; } };
const hp = (u) => { try { const x = new URL(u); return x.hostname.replace(/^www\./, '') + x.pathname.replace(/\/+$/, ''); } catch { return null; } };
const rlPaths = new Map(rl.map((r) => [hp(r.url), r.slug]).filter(([h]) => h));
const rlSlugs = new Set(rl.map((r) => r.slug));

const AUTO = new Set(['todo', 'in-rl', 'deferred-paid', 'deferred-trial']);
const rank = { free: 0, freemium: 1, beta: 2, trial: 3, paid: 4 };
function bucketOf(labels) {
  const b = labels.map((l) => {
    if (/^Free$/i.test(l)) return 'free';
    if (/Freemium|Free \+ Paid|Free tier/i.test(l)) return 'freemium';
    if (/Beta/i.test(l)) return 'beta';
    if (/Free Trial/i.test(l)) return 'trial';
    if (/^Paid$/i.test(l)) return 'paid';
    return 'beta';
  });
  return b.sort((x, y) => rank[x] - rank[y])[0] || 'beta';
}

for (const t of data.tools) {
  t.pricingBucket = bucketOf(t.pricingLabels);
  // match on host+path (not host alone: github.com / figma.com host many tools) or an identical slug
  t.rlSlug = (t.site && rlPaths.get(hp(t.site))) || (rlSlugs.has(t.id) ? t.id : null);
  const queueable = t.pricingBucket === 'free' || t.pricingBucket === 'freemium' || t.pricingBucket === 'beta';
  t.priority = !queueable ? null : t.pricingBucket === 'beta' ? 'P3' : t.sources.length > 1 ? 'P1' : 'P2';
  if (AUTO.has(t.status)) {
    t.status = t.rlSlug ? 'in-rl'
      : t.pricingBucket === 'paid' ? 'deferred-paid'
      : t.pricingBucket === 'trial' ? 'deferred-trial'
      : 'todo';
  }
  t.hasResearch = Boolean(resources[t.id]);
}

const count = (f) => data.tools.filter(f).length;
const byStatus = {};
for (const t of data.tools) byStatus[t.status] = (byStatus[t.status] || 0) + 1;
const byPri = {};
for (const t of data.tools.filter((t) => t.status === 'todo')) byPri[t.priority] = (byPri[t.priority] || 0) + 1;

if (statusOnly) {
  console.log('total', data.tools.length);
  console.log('status', byStatus);
  console.log('todo by priority', byPri);
  console.log('with research in resources.json', count((t) => t.hasResearch));
  process.exit(0);
}

data.generated = new Date().toISOString().slice(0, 10);
data.triage = { byStatus, todoByPriority: byPri };
writeFileSync(listFile, JSON.stringify(data, null, 2) + '\n');

// ---------- tools.md ----------
const esc = (s) => String(s).replace(/\|/g, '\\|');
const pageName = (p) => p.replace(/\s*\|\s*(TOOOLS\.design|Toools\.design|Digitool)\s*$/i, '').trim();
const hostOrDir = (t) => (t.site ? host(t.site) : 'via Digitool');
const seen = (t) => t.sources.map((s) => pageName(s.page)).filter((v, i, a) => a.indexOf(v) === i);
const row = (t, extra) => `| ${esc(t.name)} | ${esc(hostOrDir(t))} | ${esc(t.pricingLabels.join(' / '))} | ${t.sources.length} | ${t.priority ?? '—'} |${extra ? ' ' + esc(extra(t)) + ' |' : ''}`;
const L = [];
const push = (...s) => L.push(...s);

push(
  '# Tool backlog — every tool collected from `ref/`',
  '',
  `Generated ${data.generated} by \`scripts/backlog-build.mjs\` from \`backlog/tools-list.json\` (extracted by \`scripts/ref-extract.mjs\`). **Do not hand-edit the tables**; change status via the JSON or the research process (\`system/backlog-research.md\`), then rebuild.`,
  '',
  `**Source:** ${data.pages.length} saved directory pages in \`ref/\` (Toools.design lists + Digitool "Free Tools"), ${data.totalRaw} cards → **${data.totalUnique} unique tools** after merging duplicates across pages.`,
  `**Nothing here is verified yet.** Names, descriptions and pricing labels are the directory's own words (third-party, untrusted). Facts only count after the research pass writes them, with source + date, to \`backlog/resources.json\`.`,
  '**Focus:** free and freemium. Paid-only and trial-only tools are parked, not deleted.',
  '',
  '## Where things stand',
  '',
  '| Status | Count | Meaning |',
  '|---|---:|---|',
  `| \`todo\` | ${byStatus.todo || 0} | in the research queue (free / freemium / beta) |`,
  `| \`in-rl\` | ${byStatus['in-rl'] || 0} | already in ResourcesList (matched by site or slug) — skip, maybe use for related/similar links |`,
  `| \`deferred-paid\` | ${byStatus['deferred-paid'] || 0} | labelled **Paid** only — parked |`,
  `| \`deferred-trial\` | ${byStatus['deferred-trial'] || 0} | labelled **Free Trial** only — parked until a real free tier is confirmed |`,
  `| \`researching\` / \`researched\` / \`drafted\` / \`rejected\` / \`blocked\` | ${['researching', 'researched', 'drafted', 'rejected', 'blocked'].map((s) => byStatus[s] || 0).join(' / ')} | set by research sessions |`,
  '',
  `Queue by priority: **P1** ${byPri.P1 || 0} (free/freemium, listed on 2+ pages) · **P2** ${byPri.P2 || 0} (free/freemium, 1 page) · **P3** ${byPri.P3 || 0} (beta).`,
  '',
  '## What happens if a tool is not processed (and why)',
  '',
  '| Bucket | If not processed | Why it is handled this way |',
  '|---|---|---|',
  '| `todo` P1 | Stays out of ResourcesList; no reel input; the directory keeps its current 49 resources. Nothing breaks. | Listed on several curated pages = proven interest, best return on research time. Do first. |',
  '| `todo` P2 | Same. These are simply later in the line. | Free/freemium but seen on one list only; research after P1 or when a niche is wanted. |',
  '| `todo` P3 (beta) | Same. Risk if listed too early: tool changes pricing or shuts down. | Beta pricing is unstable; list only after confirming a real free tier and that it is alive. |',
  '| `in-rl` | Nothing lost: it is already listed. Not re-researched, so its entry may stay thin or lorem-ipsum draft. | Avoids duplicates (RL rule). Use as a **related/similar** candidate for new entries. |',
  '| `deferred-paid` | Never listed. Free-tool viewers are not served paid products, so nothing is lost for the current focus. | Owner focus is free and freemium. A "Paid" label can hide a free tier, so spot-check P-worthy names if the queue empties. |',
  '| `deferred-trial` | Never listed. A trial is time-limited, not a free tier, so listing it as Free/Freemium would be wrong. | Confirm on the pricing page; promote to `todo` only if a permanent free plan exists. |',
  '| no site URL (Digitool-only) | Cannot be researched until the real site is resolved from the Digitool detail page. | Digitool links point to its own page, not the tool site. |',
  '',
  'Cost of leaving the **whole backlog** unprocessed: ResourcesList does not grow and the tool-to-video pipeline has no pre-vetted candidates; the owner has to pick tools one by one.',
  ''
);

const groups = [['todo', 'Research queue'], ['in-rl', 'Already in ResourcesList'], ['deferred-trial', 'Parked: Free Trial only'], ['deferred-paid', 'Parked: Paid only']];
const reason = {
  'in-rl': (t) => `already in RL as \`${t.rlSlug}\``,
  'deferred-trial': () => 'trial is not a free tier; verify pricing page before promoting',
  'deferred-paid': () => 'paid-only; outside free/freemium focus',
};

const done = data.tools.filter((t) => !['todo', ...groups.map((g) => g[0])].includes(t.status));
if (done.length) {
  push('## In progress / finished', '', '| Tool | Site | Pricing label | Pages | Pri | Status |', '|---|---|---|---:|---|---|');
  for (const t of done) push(row(t, (x) => x.status));
  push('');
}

for (const [status, title] of groups) {
  const list = data.tools.filter((t) => t.status === status);
  if (!list.length) continue;
  push(`## ${title} (${list.length})`, '');
  if (status === 'todo') {
    const pages = new Map();
    for (const t of list) { const p = pageName(t.sources[0].page); (pages.get(p) || pages.set(p, []).get(p)).push(t); }
    for (const [p, ts] of [...pages].sort((a, b) => a[0].localeCompare(b[0]))) {
      ts.sort((a, b) => (a.priority || 'Z').localeCompare(b.priority || 'Z') || a.name.localeCompare(b.name));
      push(`### ${p} (${ts.length})`, '', '| Tool | Site | Pricing label | Pages | Pri |', '|---|---|---|---:|---|');
      for (const t of ts) push(row(t));
      push('');
    }
  } else {
    push('| Tool | Site | Pricing label | Pages | Pri | Reason |', '|---|---|---|---:|---|---|');
    for (const t of list) push(row(t, reason[status]));
    push('');
  }
}

writeFileSync(mdFile, L.join('\n') + '\n');
console.log('total', data.tools.length, '| status', byStatus, '| todo by priority', byPri);
console.log('wrote backlog/tools-list.json, backlog/tools.md');
