// Shared helpers for the ResourcesList (RL) scripts. No dependencies, Node >= 22.
// The RL repo stays the source of truth: enums are READ from its src/lib/consts.ts,
// never copied here, so these scripts cannot drift from the schema.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const automationRoot = resolve(here, '..', '..');

/** Pick the RL checkout: --repo PATH, RL_REPO env, config/repos.json local path, ../resourceslist. */
export function resolveRepo(argv = process.argv) {
	const i = argv.indexOf('--repo');
	const candidates = [];
	if (i !== -1 && argv[i + 1]) candidates.push(argv[i + 1]);
	if (process.env.RL_REPO) candidates.push(process.env.RL_REPO);
	try {
		const cfg = JSON.parse(readFileSync(join(automationRoot, 'config', 'repos.json'), 'utf8'));
		if (cfg.resourceslist?.local) candidates.push(cfg.resourceslist.local);
	} catch {}
	candidates.push(resolve(automationRoot, '..', 'resourceslist'));
	candidates.push(resolve(automationRoot, '..', '..', '..', 'resourceslist')); // when run from .claude/worktrees/<n>
	for (const c of candidates) {
		if (existsSync(join(c, 'src', 'content', 'resources'))) return resolve(c);
	}
	throw new Error(
		'ResourcesList repo not found. Pass --repo <path> or set RL_REPO. Tried:\n  ' + candidates.join('\n  '),
	);
}

function unquote(v) {
	v = v.trim();
	if (v.length >= 2 && v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1).replace(/''/g, "'");
	if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) {
		try { return JSON.parse(v); } catch { return v.slice(1, -1); }
	}
	return v;
}

function parseInlineList(v) {
	const inner = v.trim().slice(1, -1).trim();
	if (!inner) return [];
	return inner.split(',').map((s) => unquote(s)).filter(Boolean);
}

function refName(item) {
	// `- slug`, `- 'slug'`, `- resource: path/slug.md`, `- tag: path/slug.json`
	const m = item.match(/^(?:resource|tag):\s*(.+)$/);
	const raw = unquote(m ? m[1] : item);
	return raw.split('/').pop().replace(/\.[^.]+$/, '');
}

/** Parse the YAML subset used by RL frontmatter (scalars, folded/literal blocks, flat lists). */
export function parseFrontmatter(text) {
	const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!m) return { data: null, body: text };
	const lines = m[1].split(/\r?\n/);
	const data = {};
	for (let i = 0; i < lines.length; ) {
		const km = lines[i].match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
		if (!km) { i++; continue; }
		const [, key, rest] = km;
		i++;
		const cont = [];
		while (i < lines.length && (lines[i] === '' || /^\s/.test(lines[i]))) cont.push(lines[i++]);
		const trimmed = cont.map((l) => l.trim());
		if (rest === '') {
			const items = trimmed.filter((l) => l.startsWith('- ')).map((l) => refName(l.slice(2)));
			const hasKeyedItems = trimmed.some((l) => /^-\s+\w+:/.test(l));
			data[key] = items.length || hasKeyedItems ? items : '';
		} else if (/^[>|][+-]?$/.test(rest)) {
			data[key] = rest.startsWith('|') ? trimmed.join('\n').trim() : trimmed.filter(Boolean).join(' ').trim();
		} else if (rest.startsWith('[')) {
			data[key] = parseInlineList(rest);
		} else {
			data[key] = unquote([rest, ...trimmed.filter(Boolean)].join(' ').trim());
		}
	}
	return { data, body: m[2] };
}

/** Read the enum arrays from the RL repo's consts.ts. */
export function readEnums(repo) {
	const src = readFileSync(join(repo, 'src', 'lib', 'consts.ts'), 'utf8');
	const grab = (name) => {
		const m = src.match(new RegExp(`export const ${name}\\b[^=]*=\\s*\\[([\\s\\S]*?)\\]\\s*as const`));
		if (!m) throw new Error(`consts.ts: could not find ${name}`);
		return [...m[1].matchAll(/'([^']*)'/g)].map((x) => x[1]);
	};
	return {
		categories: grab('resourceCategories'),
		types: grab('resourceTypes'),
		pricings: grab('pricings'),
		stages: grab('stages'),
	};
}

export function listTags(repo) {
	const dir = join(repo, 'src', 'content', 'tags');
	return readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => {
		const slug = f.slice(0, -5);
		let name = slug;
		try { name = JSON.parse(readFileSync(join(dir, f), 'utf8')).name ?? slug; } catch {}
		return { slug, name };
	});
}

export function listResources(repo) {
	const dir = join(repo, 'src', 'content', 'resources');
	return readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
		const { data } = parseFrontmatter(readFileSync(join(dir, f), 'utf8'));
		return { slug: f.slice(0, -3), ...(data ?? {}) };
	});
}

export function hostOf(url) {
	try { return new URL(/^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`).hostname.replace(/^www\./, ''); }
	catch { return ''; }
}

export function simpleIconsData(repo) {
	const p = join(repo, 'node_modules', 'simple-icons', 'data', 'simple-icons.json');
	if (!existsSync(p)) return null;
	return JSON.parse(readFileSync(p, 'utf8'));
}

/** The ALIASES map from src/lib/directory-icons.ts (shorthand -> real simple-icons slug). */
export function readIconAliases(repo) {
	try {
		const src = readFileSync(join(repo, 'src', 'lib', 'directory-icons.ts'), 'utf8');
		const block = src.match(/const ALIASES[^=]*=\s*\{([\s\S]*?)\};/)?.[1] ?? '';
		return Object.fromEntries([...block.matchAll(/'?([\w-]+)'?\s*:\s*'([\w-]+)'/g)].map((m) => [m[1], m[2]]));
	} catch {
		return {};
	}
}
