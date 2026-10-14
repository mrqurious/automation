#!/usr/bin/env node
// Is the tool's logo available in Simple Icons (the `iconLib` route)?
//
//   node scripts/check-icon.mjs "Mixkit"
//   node scripts/check-icon.mjs figma --json
//
// Uses simple-icons from the RL checkout (node_modules, run `bun install` there first).
// Exit code: 0 exact match, 1 only fuzzy candidates, 2 nothing found, 3 simple-icons unavailable.
// Not found => fall back to the site's own SVG (`iconSvg`), then ask the user (system/repo-resourceslist.md §6).
import { readIconAliases, resolveRepo, simpleIconsData } from './lib/rl.mjs';

const argv = process.argv;
const query = argv.slice(2).find((a) => !a.startsWith('--') && a !== argv[argv.indexOf('--repo') + 1]);
if (!query) { console.error('usage: check-icon.mjs <tool name or slug> [--repo path] [--json]'); process.exit(3); }
const json = argv.includes('--json');
const repo = resolveRepo(argv);

let data = simpleIconsData(repo);
let source = 'local node_modules';
if (!data) {
	try {
		const res = await fetch('https://cdn.jsdelivr.net/npm/simple-icons@16/data/simple-icons.json');
		data = await res.json();
		source = 'jsdelivr simple-icons@16 (RL node_modules missing: run bun install there to be exact)';
	} catch {
		console.error('simple-icons not installed in the RL repo and the CDN is unreachable. Run `bun install` in the RL repo.');
		process.exit(3);
	}
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const aliases = readIconAliases(repo);
const q = norm(query);
const slugOf = (e) => e.slug ?? norm(e.title);
const aliasSlug = aliases[query.toLowerCase()];

let exact = data.find((e) => slugOf(e) === (aliasSlug ?? query.toLowerCase())) ?? data.find((e) => slugOf(e) === q) ?? data.find((e) => norm(e.title) === q);
if (!exact) exact = data.find((e) => (e.aliases?.aka ?? []).some((a) => norm(a) === q));
const fuzzy = exact ? [] : data.filter((e) => norm(e.title).includes(q) || q.includes(norm(e.title)) || slugOf(e).includes(q)).slice(0, 8);

const result = exact
	? { found: true, source, iconLib: slugOf(exact), title: exact.title, hex: exact.hex, fillColor: `#${exact.hex}`, guidelines: exact.guidelines ?? null, license: exact.license ?? null, note: 'Set iconLib to this slug and fillColor to this hex. bgColor: check contrast (white glyph on a light card needs a dark bgColor).' }
	: { found: false, source, candidates: fuzzy.map((e) => ({ iconLib: slugOf(e), title: e.title, hex: e.hex })), note: 'No exact Simple Icons match. Use the site SVG (iconSvg) or ask the user.' };

if (json) console.log(JSON.stringify(result, null, 2));
else if (result.found) console.log(`FOUND  iconLib: ${result.iconLib}  (${result.title})  fillColor: ${result.fillColor}\n${result.note}${result.guidelines ? `\nBrand guidelines: ${result.guidelines}` : ''}`);
else console.log(`NOT FOUND "${query}" in Simple Icons.${fuzzy.length ? '\nClosest: ' + result.candidates.map((c) => `${c.iconLib} (${c.title})`).join(', ') : ''}\n${result.note}`);
process.exit(exact ? 0 : fuzzy.length ? 1 : 2);
