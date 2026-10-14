#!/usr/bin/env node
// Index of what ResourcesList already has: use it to avoid duplicates and to pick
// real tags / relatedResources / similarResources slugs.
//
//   node scripts/rl-index.mjs                 table of every resource
//   node scripts/rl-index.mjs --enums         allowed category/type/pricing/stage values + all tag slugs
//   node scripts/rl-index.mjs --find mixkit   duplicate check by slug, title or URL host
//   node scripts/rl-index.mjs --related stock-videos,royalty-free   candidates sharing tags/category
//   add --json for machine output, --repo <path> to point at the RL checkout
import { hostOf, listResources, listTags, readEnums, resolveRepo } from './lib/rl.mjs';

const argv = process.argv;
const arg = (name) => { const i = argv.indexOf(name); return i !== -1 ? argv[i + 1] : undefined; };
const json = argv.includes('--json');
const repo = resolveRepo(argv);
const resources = listResources(repo);

if (argv.includes('--enums')) {
	const out = { ...readEnums(repo), tags: listTags(repo).map((t) => t.slug) };
	if (json) console.log(JSON.stringify(out, null, 2));
	else for (const [k, v] of Object.entries(out)) console.log(`${k} (${v.length}): ${v.join(', ')}`);
	process.exit(0);
}

const find = arg('--find');
if (find) {
	const q = find.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
	const hits = resources.filter(
		(r) =>
			r.slug.includes(q) ||
			String(r.title ?? '').toLowerCase().includes(q) ||
			hostOf(String(r.url ?? '')) === q ||
			(q.includes('.') && hostOf(String(r.url ?? '')).endsWith(q)),
	);
	if (json) console.log(JSON.stringify(hits, null, 2));
	else if (!hits.length) console.log(`No existing resource matches "${find}".`);
	else for (const r of hits) console.log(`DUPLICATE? ${r.slug}  [${r.stage}] ${r.type ?? 'Resource'} · ${r.category} · ${r.url}`);
	process.exit(hits.length ? 2 : 0);
}

const related = arg('--related');
if (related) {
	const want = new Set(related.split(',').map((s) => s.trim()).filter(Boolean));
	const scored = resources
		.map((r) => {
			const shared = (Array.isArray(r.tags) ? r.tags : []).filter((t) => want.has(t));
			return { slug: r.slug, title: r.title, type: r.type ?? 'Resource', category: r.category, stage: r.stage, shared, score: shared.length + (want.has(r.category?.toLowerCase()) ? 1 : 0) };
		})
		.filter((r) => r.score > 0)
		.sort((a, b) => b.score - a.score);
	if (json) console.log(JSON.stringify(scored, null, 2));
	else for (const r of scored) console.log(`${r.slug.padEnd(24)} ${String(r.stage).padEnd(10)} ${r.type.padEnd(12)} ${r.category.padEnd(12)} shared: ${r.shared.join(', ')}`);
	process.exit(0);
}

const rows = resources.map((r) => ({
	slug: r.slug, stage: r.stage ?? '', type: r.type ?? 'Resource', category: r.category ?? '', pricing: r.pricing ?? '',
	tags: Array.isArray(r.tags) ? r.tags : [], related: Array.isArray(r.relatedResources) ? r.relatedResources : [],
	similar: Array.isArray(r.similarResources) ? r.similarResources : [], url: r.url ?? '',
}));
if (json) console.log(JSON.stringify(rows, null, 2));
else {
	for (const r of rows) console.log(`${r.slug.padEnd(22)} ${r.stage.padEnd(10)} ${r.type.padEnd(12)} ${r.category.padEnd(12)} ${r.pricing.padEnd(12)} ${r.tags.join(',')}`);
	console.log(`\n${rows.length} resources in ${repo}`);
}
