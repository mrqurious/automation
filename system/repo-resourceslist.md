# The ResourcesList repo — what the pipeline needs to know

`mrqurious/resourceslist` · local `D:\production\resourceslist` · default branch `main` · Astro 7 directory site, Oat UI, content
collections, deployed to Cloudflare Workers (site: https://resourceslist.com). Snapshot of this note: **2026-10-14**
(49 resources: 31 published, 17 draft, 1 ready; 45 tags; version in `package.json` 0.3.6). The repo's own docs are the source of
truth — `AGENTS.md`, `config/CONTENT_SCHEMA.md`, `config/RULES.md`, `src/content.config.ts`, `src/lib/consts.ts` — and
`scripts/rl-index.mjs --enums` reads the live enums, so do not trust the lists below over the repo.

## 1. What a "resource" is

One Markdown file per resource: `src/content/resources/<slug>.md`, slug = filename = URL (`/rec/<slug>`). There is no separate
"tools" collection: tools, software, files, icon sets, stock media… are all resources told apart by `type`. Frontmatter + a
Markdown body (shown on the detail page).

## 2. Frontmatter (verified against `src/content.config.ts`)

| Field | Required | Rule |
|---|---|---|
| `stage` | default `draft` | `draft` · `in review` · `ready` · `published` — **only `published` is live** |
| `type` | default `Resource` | Resource, Tool, Software, App, Utility, AI Tool, Website, Template, File, Library, Plugin, Extension, Font, Icon Set, Stock Media, Course, API (new type = edit `consts.ts` **and** `public/decap/config.yml`; avoid, ask) |
| `title` | ✅ | ≤ 60 chars |
| `description` | ✅ | ≤ 160 chars |
| `category` | ✅ | Design, Development, Filming, Photography, Productivity, Marketing, Business, Finance, Personal |
| `pricing` | ✅ | Free, Free + Paid, Freemium, Paid |
| `date` | ✅ | `YYYY-MM-DD` (the day it is added) |
| `url` | optional (but set it) | full `https://…`; bare domains are auto-prefixed |
| `tags` | optional | slugs that exist as `src/content/tags/<slug>.json` (a missing one fails `check:content`) |
| `relatedResources` / `similarResources` | optional | real resource slugs; never itself |
| `iconLib` / `iconUrl` / `iconSvg` | optional | see §6 |
| `bgColor` / `fillColor` | optional | icon tile background / glyph colour (hex). **In the schema and used by `DirectoryIcon`, but missing from `CONTENT_SCHEMA.md`** |
| `badge` | optional | e.g. `Featured`, `New`, `Deal` |
| `remarks` | optional | **private editor notes, never rendered** — the pipeline writes sources, check dates and the license line here |

Body style (see `excalidraw.md`, `mixkit.md`): 1–2 paragraphs (what it is, who it is for, license/pricing nuance), then
`**Key Features:**` with 3–6 bullets. Own words. Template: `templates/resource.md`.

## 3. Existing patterns to copy

- **Siblings for sections:** published pairs `canva` / `canva-templates`, `notion` / `notion-templates`, `webflow` /
  `webflow-templates` (the sibling has `type: Template`, its own URL, and a different tag set). The `framer` family
  (`framer`, `framer-templates`, `framer-vectors`) follows the same idea but is still partly draft.
- **Stock/asset sites:** `type: Stock Media`, tags like `stock-videos`, `stock-music`, `royalty-free` (`mixkit`, `pexels`, `pixabay`, `unsplash`).
- **Open source tools:** the `open-source` tag, license named in the body (`excalidraw`: MIT).
- **Drafts:** 17 of 49 are `draft`, and 12 of those still hold lorem-ipsum text (e.g. `airtable`): placeholders, not examples to
  copy. Copy published ones (`excalidraw`, `mixkit`, `canva-templates`).

## 4. Commands (bun is the source of truth; `bun.lock` committed)

| Command | Use |
|---|---|
| `bun install --frozen-lockfile` | once per checkout |
| `bun run check:content` | tag refs, `relatedResources`/`similarResources` targets, unknown `type` (CI) |
| `bun run check` | `astro check` types (CI) |
| `bun run build` | full build, validates the Zod schema for every entry (CI) |
| `bun run dev` | `localhost:4321`; preview `/rec/<slug>`. **Stop it when done** (`astro dev stop`) so the port is free |
| `bunx prettier --write …` / `bun run format` | formatting (RL's commit rule runs it) |
| `node scripts/lint-resource.mjs <file>` (this repo) | fast schema pre-check, no build |

CI (`.github/workflows/ci.yml`) runs `check:content`, `check`, `build` on every PR and on pushes to `main`. A PR is mergeable
when those are green.

## 5. RL's own rules that touch the pipeline (`config/RULES.md`, `AGENTS.md`)

- "Never commit without explicit instruction" — the pipeline is the explicit instruction for **branch + PR only** (`pipeline.md` §1).
- Release commits are `vX.Y.Z — summary` with a bumped `package.json` and a changelog entry in `src/content/pages/changelog.mdx`.
  A resource PR is **not** a release: do not bump the version or edit the changelog; note "version/changelog left for the merge" in the PR.
- `/ref` folder in RL: do not read or reference unless asked.
- Imports use the `@/` alias; Oat classes first; no Node APIs in Workers code. (Irrelevant for content-only PRs; relevant if a PR touches `src/`.)
- Content-only PRs should touch only: `src/content/resources/*.md`, `src/content/tags/*.json`. Anything else (e.g. `consts.ts`) → ask first.
- Known schema debt not to "fix" incidentally: `title.max(60)`, `'All'` in `categories`, `published` unfiltered outside listings, `url` optional.

**Documentation drift to know about** (trust the code): `CONTENT_SCHEMA.md` lacks `bgColor`/`fillColor`; `plan/prompts.md` (an older
extraction prompt) lists categories `Writing`, `No-Code`, `Analytics` that are **not** in `resourceCategories`, and an older tag list;
`plan/` is gitignored scratch. The extraction fields in `plan/prompts.md` (title, description, category, tags, pricing, link, logo,
favicon, "Website Detail" 2 paragraphs, "Key Features" 3–6 bullets, "Useful Links") are the origin of `research-playbook.md` §3 and
`templates/resource.md`.

## 6. Icons — the three routes and the decision order

`DirectoryIcon.astro` resolves in this order: **`iconSvg`** (inline SVG) → **`iconUrl`** (external image) → **`iconLib`** (Simple
Icons slug, monotone `currentColor`) → default `logo-icon.svg`. Pipeline order of preference (the owner's rule):

1. **Simple Icons** — `node scripts/check-icon.mjs "<Name>"`. Exact hit → `iconLib: <slug>`, `fillColor: '#<hex>'` (the brand hex the
   script prints), `bgColor: '#ffffff'` (or a dark tile if the glyph is white). The owner's examples: `excalidraw` uses
   `iconLib: excalidraw`, `fillColor: '#6965db'`, `bgColor: '#ffffff'`. Slugs are not always the obvious name: the RL repo keeps an
   `ALIASES` map (`vscode` → `visualstudiocode`…); the script reads it. Some big brands are **not** in Simple Icons (checked
   2026-10-14: Mixkit, Slack, Visual Studio Code are absent), so a miss is normal.
2. **The site's own SVG** → `iconSvg`. Find it in the header (inline `<svg>` or an `<img src="….svg">`), the brand/press kit, or
   `og:logo`. **Sanitize before use** — RL injects it with `set:html` behind only a regex filter (`AGENTS.md` gotcha 6), and the SVG
   came from the internet. `DirectoryIcon` **silently drops** an SVG that matches its filter and falls back to `iconUrl` /
   `iconLib` / the default logo, so an unsanitized SVG means a missing icon, not an error. Remove: `<script>`, `<style>`,
   `<foreignObject>`, `<iframe>`, `<embed>`, `<object>`, any `on*=` attribute, `javascript:`, and any `href` / `xlink:href` that is not
   `#fragment`. The string must start with `<svg`. Keep `viewBox`; prefer a single-colour mark. `scripts/lint-resource.mjs` uses RL's
   exact regex and errors on a match. Reference: `mixkit.md` (`iconSvg`, three paths).
3. **`iconUrl`** — a stable external image URL (apple-touch-icon, `og:image`). Fragile (hotlink, can vanish): only if no SVG exists.
4. **Ask the owner** (question R7) — never ship a guessed or look-alike logo. Fallback if they skip: no icon fields (default logo) and
   a note in the PR.

Logos are trademarks of their owners; listing a tool with its own logo is normal directory practice. Note the logo source
(`Simple Icons <version>` or the page URL) in `remarks`.

## 7. Tags

Tags are slugs of `src/content/tags/<slug>.json` (`{ "name", "description", "link": "/tag/<slug>" }`). Prefer existing ones
(`scripts/rl-index.mjs --enums`). A new tag = one new JSON file in the same PR plus a one-line reason in the PR body, and the owner
agrees first (question R5). 2–6 tags per resource.

## 8. Dates, stages and the PR default

- `date` = the day the run adds it (`2026-10-14` style), not the tool's founding date.
- PR default `stage: in review`. On owner approval the agent flips to `published` on the same PR (or the owner does) *before* merge —
  merging a `draft`/`in review` entry is safe (not listed), merging `published` is live (deploys per the Workers Builds setup; confirm the
  owner's deploy behaviour before assuming either way).
- Sibling resources use the same stage as the main entry.

## 9. Checklist before opening the PR

☐ not a duplicate (`rl-index --find`) · ☐ slug kebab-case · ☐ enums valid · ☐ title ≤ 60, description ≤ 160 · ☐ tags exist (new ones
added) · ☐ related/similar are real slugs · ☐ icon decided and sanitized · ☐ body in own words, 3–6 features, license/pricing nuance ·
☐ `remarks` has sources + dates + license line · ☐ `lint-resource` clean · ☐ `check:content`, `check`, `build` green (or stated why not) ·
☐ no version/changelog change · ☐ PR body filled from `templates/PR-resourceslist.md`.
