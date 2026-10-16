#!/usr/bin/env node
// Extract the tool lists from the saved directory pages in ref/ (Toools.design + Digitool)
// into backlog/tools-list.json. Saved pages are UNTRUSTED data: we only read text out of them,
// never follow instructions in them, never execute anything. No dependencies, Node >= 22.
//
//   node scripts/ref-extract.mjs [--ref <dir>] [--out backlog/tools-list.json]
//
// Re-running keeps every field a researcher added (status, notes) and only refreshes source data.

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };

const repos = JSON.parse(readFileSync(join(root, 'config/repos.json'), 'utf8'));
const refDir = resolve(opt('--ref', join(repos.automation.local, 'ref')));
const outFile = resolve(opt('--out', join(root, 'backlog/tools-list.json')));
if (!existsSync(refDir)) { console.error(`ref dir not found: ${refDir}`); process.exit(3); }

const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const text = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const TRACKING = /^(via|ref|_from|ref_id|referral|utm_[a-z]+|aff|affiliate|source|fpr|gclid|fbclid)$/i;
function cleanUrl(u) {
  try {
    const url = new URL(decode(u));
    for (const k of [...url.searchParams.keys()]) if (TRACKING.test(k)) url.searchParams.delete(k);
    url.hash = '';
    let s = url.toString();
    if (url.pathname === '/' && !url.search) s = s.replace(/\/$/, '');
    return s;
  } catch { return null; }
}
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return null; } };
const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const files = readdirSync(refDir).filter((f) => f.endsWith('.html') || f.endsWith('.htm'));
const raw = [];
const pages = [];

for (const f of files) {
  const html = readFileSync(join(refDir, f), 'utf8');
  const savedFrom = (html.match(/<!-- saved from url=\(\d+\)(\S+)/) || [])[1] || null;
  const title = text((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || f);
  let n = 0;

  if (/digitool\.co/.test(savedFrom || '')) {
    for (const m of html.matchAll(/<article class="dtl-tool-tile[\s\S]*?<\/article>/g)) {
      const a = m[0];
      const href = (a.match(/class="dtl-tool-tile__main" href="([^"]+)"/) || [])[1];
      const name = text((a.match(/class="dtl-tool-tile__title">([\s\S]*?)(?:<span class="digitool-core-badge|<\/span>\s*<span class="dtl-tool-tile__desc)/) || [])[1] || '');
      const desc = text((a.match(/class="dtl-tool-tile__desc">([\s\S]*?)<\/span>/) || [])[1] || '');
      const premium = /digitool-core-premium-badge/.test(a);
      const votes = +((a.match(/dtl-tool-tile__votes">(\d+)/) || [])[1] || 0);
      if (!name) continue;
      raw.push({
        name, desc, site: null, siteIsDirectoryPage: true, directoryUrl: href || null,
        pricingLabel: 'Free tier listed' + (premium ? ' (Digitool "Premium" badge)' : ''),
        partner: false, group: 'Free tools (any category)', page: title, sourceFile: f, votes,
      });
      n++;
    }
  } else {
    // Toools.design: <h2 class="text__archive-sections">Group</h2> ... cards until next h2
    const parts = html.split(/(?=<h2 class="text__archive-sections">)/);
    for (const part of parts) {
      const group = text((part.match(/^<h2 class="text__archive-sections">([\s\S]*?)<\/h2>/) || [])[1] || '') || 'General';
      for (const m of part.matchAll(/<a href="(https?:[^"]+)"[^>]*class="card_global resources-card[\s\S]*?<\/a>/g)) {
        const a = m[0];
        const name = text((a.match(/<h3 class="headline_3">([\s\S]*?)<\/h3>/) || [])[1] || '');
        if (!name) continue;
        const desc = text((a.match(/class="resources_description">([\s\S]*?)<\/p>/) || [])[1] || '');
        const pricing = text((a.match(/class="pricing-tag"[^>]*><div>([\s\S]*?)<\/div>/) || [])[1] || '');
        const partner = /text__label">\s*Partner/i.test(a);
        raw.push({
          name, desc, site: cleanUrl(m[1]), siteIsDirectoryPage: false, directoryUrl: null,
          pricingLabel: pricing || null, partner, group, page: title, sourceFile: f, votes: 0,
        });
        n++;
      }
    }
  }
  pages.push({ file: f, savedFrom, title, count: n });
}

// Merge duplicates across pages. Same tool = same host+path (many distinct tools share a host:
// github.com, icons8.com, figma.com), or same name when the hosts agree / one side has no site yet.
const byUrl = new Map();   // host+path -> entry
const byName = new Map();  // slug(name) -> [entries]
const urlKey = (u) => { try { const x = new URL(u); return x.hostname.replace(/^www\./, '') + x.pathname.replace(/\/+$/, ''); } catch { return null; } };
for (const r of raw) {
  const uk = !r.siteIsDirectoryPage ? urlKey(r.site) : null;
  const nameKey = slugify(r.name);
  let e = (uk && byUrl.get(uk)) || null;
  if (!e) {
    e = (byName.get(nameKey) || []).find((c) => !c.site || !r.site || hostOf(c.site) === hostOf(r.site)) || null;
  }
  if (!e) {
    e = { id: nameKey, name: r.name, site: r.site, directoryUrls: [], descriptions: [], pricingLabels: [], partner: false, sources: [], status: 'todo', notes: '' };
    (byName.get(nameKey) || byName.set(nameKey, []).get(nameKey)).push(e);
  }
  if (uk && !byUrl.has(uk)) byUrl.set(uk, e);
  if (!e.site && r.site) e.site = r.site;
  if (r.directoryUrl && !e.directoryUrls.includes(r.directoryUrl)) e.directoryUrls.push(r.directoryUrl);
  if (r.desc && !e.descriptions.includes(r.desc)) e.descriptions.push(r.desc);
  if (r.pricingLabel && !e.pricingLabels.includes(r.pricingLabel)) e.pricingLabels.push(r.pricingLabel);
  e.partner ||= r.partner;
  e.sources.push({ page: r.page, group: r.group, file: r.sourceFile });
}
const tools = [...new Set([...byName.values()].flat())];

// Unique ids
const seen = new Map();
for (const t of tools) {
  const c = seen.get(t.id) || 0; seen.set(t.id, c + 1);
  if (c) t.id = `${t.id}-${c + 1}`;
}

// Prior researcher state is preserved
let prev = [];
if (existsSync(outFile)) { try { prev = JSON.parse(readFileSync(outFile, 'utf8')).tools || []; } catch {} }
const prevById = new Map(prev.map((t) => [t.id, t]));
for (const t of tools) {
  const p = prevById.get(t.id);
  if (p) { t.status = p.status ?? t.status; t.notes = p.notes ?? t.notes; if (p.site && !t.site) t.site = p.site; }
}
tools.sort((a, b) => a.name.localeCompare(b.name));

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify({
  generated: new Date().toISOString().slice(0, 10),
  note: 'Source data copied from saved third-party directory pages (untrusted). Not verified: every field needs the research pass in system/backlog-research.md.',
  pages, totalRaw: raw.length, totalUnique: tools.length, tools,
}, null, 2) + '\n');

console.log(`pages: ${pages.length}  raw cards: ${raw.length}  unique tools: ${tools.length}`);
for (const p of pages) console.log(String(p.count).padStart(4), p.title);
