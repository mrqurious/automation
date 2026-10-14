#!/usr/bin/env node
// Fast pre-PR lint for a ResourcesList resource file. Mirrors the Zod schema in the RL repo
// (src/content.config.ts) + `bun run check:content`, without needing a build.
// It does NOT replace them: the PR still runs `bun run check:content`, `bun run check`, `bun run build`.
//
//   node scripts/lint-resource.mjs <path/to/slug.md> [--repo <RL checkout>]
// Exit 1 on errors, 0 on clean/warnings only.
import { existsSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { hostOf, listResources, listTags, parseFrontmatter, readEnums, resolveRepo, simpleIconsData } from './lib/rl.mjs';

const argv = process.argv;
const file = argv.slice(2).find((a) => !a.startsWith('--') && a !== argv[argv.indexOf('--repo') + 1]);
if (!file || !existsSync(file)) { console.error('usage: lint-resource.mjs <file.md> [--repo path]'); process.exit(2); }

const repo = resolveRepo(argv);
const enums = readEnums(repo);
const tags = new Set(listTags(repo).map((t) => t.slug));
const others = listResources(repo);
const slug = basename(file, '.md');
const { data, body } = parseFrontmatter(readFileSync(file, 'utf8'));
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

if (!data) { console.error('error: missing frontmatter'); process.exit(1); }

// Leftover template placeholders (templates/resource.md uses <angle-bracket> slots). iconSvg legitimately contains tags.
for (const [k, v] of Object.entries(data)) {
	if (k === 'iconSvg') continue;
	const vals = Array.isArray(v) ? v : [v];
	if (vals.some((x) => /<[^<>\n]+>/.test(String(x)))) err(`${k} still contains a <placeholder> from the template`);
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) err(`filename "${slug}.md" must be kebab-case (it is the slug / URL)`);
for (const k of ['stage', 'title', 'description', 'category', 'pricing', 'date']) if (!data[k]) err(`missing required field: ${k}`);
if (data.stage && !enums.stages.includes(data.stage)) err(`stage "${data.stage}" not in [${enums.stages}]`);
if (data.type && !enums.types.includes(data.type)) err(`type "${data.type}" not in resourceTypes [${enums.types}]`);
if (data.category && !enums.categories.includes(data.category)) err(`category "${data.category}" not in [${enums.categories}]`);
if (data.pricing && !enums.pricings.includes(data.pricing)) err(`pricing "${data.pricing}" not in [${enums.pricings}]`);
if (data.title && data.title.length > 60) err(`title is ${data.title.length} chars (max 60)`);
if (data.description && data.description.length > 160) err(`description is ${data.description.length} chars (max 160)`);
if (data.description && data.description.length < 60) warn(`description is short (${data.description.length} chars); aim for 100-160`);
if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(String(data.date))) err(`date "${data.date}" must be YYYY-MM-DD`);
if (!data.url) warn('no url (the Visit button is hidden without it)');
else if (!/^https?:\/\//.test(data.url)) warn(`url "${data.url}" has no scheme; the schema adds https:// but write it in full`);

for (const t of Array.isArray(data.tags) ? data.tags : []) if (!tags.has(t)) err(`tag "${t}" has no src/content/tags/${t}.json (create it in the same PR, or pick an existing tag)`);
if (!Array.isArray(data.tags) || data.tags.length < 2) warn('fewer than 2 tags');
if (Array.isArray(data.tags) && data.tags.length > 6) warn('more than 6 tags');
const slugs = new Set(others.map((r) => r.slug));
for (const key of ['relatedResources', 'similarResources']) {
	for (const r of Array.isArray(data[key]) ? data[key] : []) {
		if (r === slug) err(`${key} lists itself`);
		else if (!slugs.has(r)) err(`${key} "${r}" does not exist in src/content/resources/`);
	}
}

// icon: at least one route; iconLib must resolve; iconSvg must be safe-looking
const hasIcon = data.iconLib || data.iconUrl || data.iconSvg;
if (!hasIcon) warn('no icon (iconLib / iconSvg / iconUrl): the card falls back to the default logo');
if (data.iconLib) {
	const si = simpleIconsData(repo);
	if (si && !si.some((e) => (e.slug ?? e.title.toLowerCase().replace(/[^a-z0-9]/g, '')) === String(data.iconLib).toLowerCase())) {
		warn(`iconLib "${data.iconLib}" not found in Simple Icons (may still work via ALIASES in directory-icons.ts; run scripts/check-icon.mjs)`);
	}
}
if (data.iconSvg) {
	// Same filter as RL's src/components/DirectoryIcon.astro: an SVG that fails it is silently dropped
	// at render (the card falls back to iconUrl / iconLib / the default logo), so treat it as an error.
	const UNSAFE_SVG = /<(?:script|style|foreignobject|iframe|embed|object)\b|\bon\w+\s*=|javascript:|(?:xlink:)?href\s*=(?!\s*["']?\s*#)/i;
	if (!data.iconSvg.trim().toLowerCase().startsWith('<svg')) err('iconSvg must start with <svg');
	if (UNSAFE_SVG.test(data.iconSvg)) err('iconSvg would be dropped by DirectoryIcon (script/style/foreignObject/iframe/embed/object, on*= handler, javascript:, or an href that is not #fragment): sanitize it');
	if (!/viewBox=/.test(data.iconSvg)) warn('iconSvg has no viewBox (it will not scale in the card)');
}
if (data.iconLib && data.iconSvg) warn('both iconLib and iconSvg set; iconSvg wins (DirectoryIcon resolution order)');

// duplicates
if (data.url) {
	const host = hostOf(String(data.url));
	const dup = others.filter((r) => r.slug !== slug && r.url && hostOf(String(r.url)) === host);
	for (const d of dup) warn(`same host as existing resource "${d.slug}" (${d.url}); fine only if this is a distinct section (e.g. Templates)`);
}
if (others.some((r) => r.slug === slug) && argv.includes('--new')) err(`slug "${slug}" already exists`);

// body
const text = body.trim();
if (!text) err('empty body');
else {
	if (!/\*\*Key Features\s*:?\*\*/i.test(text)) warn('body has no "**Key Features:**" list (house style)');
	if (/lorem ipsum|dolore sint/i.test(text)) err('body contains placeholder lorem text');
	if (/<(?:[A-Z][^<>\n]*|[a-z]+[^<>\n]*\s[^<>\n]*)>/.test(text.replace(/<!--[\s\S]*?-->/g, ''))) warn('body contains <angle-bracket> text: a template placeholder or raw HTML? check');
	if (/<!--/.test(text)) warn('body still contains an HTML comment (remove the template notes)');
	if ((text.match(/^- /gm) ?? []).length < 3) warn('fewer than 3 feature bullets');
}
if (data.remarks === undefined) warn('no remarks: put sources, check dates and the license summary there (never rendered)');

for (const w of warnings) console.warn(`warn   ${w}`);
for (const e of errors) console.error(`error  ${e}`);
console.log(`lint-resource: ${slug}.md — ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
