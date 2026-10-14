---
run: 2026-10-14-fix-seed-stubs
slug: fix-seed-stubs
tool: "(batch — 12 pre-existing resource stubs)"
url: n/a
mode: resource-only
status: RL PR opened (gate A), awaiting owner review
started: 2026-10-14
updated: 2026-10-14
links:
  resourceslist_pr: "https://github.com/mrqurious/resourceslist/compare/main...resource/fix-seed-stubs?expand=1"
  videoediting_pr: ""
  run_pr: ""
  rl_page: ""
  video_folder: ""
  final_render: ""
---

# Run: fix-seed-stubs — replace Lorem-ipsum seed content on 12 draft resources

> Not a normal `/tool-pipeline` run (no single tool, no video). The owner asked me to audit ResourcesList for a Product Hunt / Indie Hackers / Hacker News launch (separate `launch/` folder in the RL repo, not tracked here), found that 12 of 49 resource files were seed stubs with Lorem-ipsum body text and placeholder frontmatter (`category: Design`, `pricing: Free`, `badge: Deal` on all 12, regardless of the real tool), and was then asked to research and fix them.

## Status board

| Stage | State | Link / note |
|---|---|---|
| 0 Intake | ✅ | owner: "do the research of this tools and fix the lorem ipsum like other tools and then tell me what remains" |
| 1 Research | ✅ | 11 of 12 — see Facts table |
| 3 RL PR (gate A, non-blocking) | ✅ opened | branch `resource/fix-seed-stubs`, no `gh` installed → compare link given |
| ◆ Gate A owner review | ☐ | awaiting |

## 1. Intake (owner's message, verbatim)

> "do one thing do the resurchof this tools and fix the lorel ipsum like other tools and then tell me what remains"

Preceded by a request to audit resourceslist.com for a PH/IH/HN launch, during which the 12 Lorem-ipsum stubs were found.

## 3. Research — facts

12 stubs found (`airtable`, `asana`, `bitwarden`, `blender`, `brave`, `calendly`, `coda`, `codepen`, `fontawesome`, `framer`, `iconfinder`, `iconmonster`). All originally: `stage: draft`, `category: Design`, `pricing: Free`, `badge: Deal`, Lorem-ipsum description + body. Fixed 11; left `iconfinder` as-is (see note below).

| Resource | Real category / pricing | Source | Date checked |
|---|---|---|---|
| Airtable | Productivity / Freemium | airtable.com/pricing (direct fetch) | 2026-10-14 |
| Asana | Productivity / Freemium | asana.com/pricing (direct fetch) | 2026-10-14 |
| Bitwarden | Personal / Freemium | bitwarden.com/pricing (direct fetch) | 2026-10-14 |
| Blender | Design / Free | blender.org/about (direct fetch) | 2026-10-14 |
| Brave | Personal / Free + Paid | brave.com homepage (direct fetch) | 2026-10-14 |
| Calendly | Productivity / Freemium | calendly.com/pricing (direct fetch) | 2026-10-14 |
| Coda | Productivity / Freemium | coda.io homepage (direct fetch) — now rebranded "Superhuman Docs" | 2026-10-14 |
| Codepen | Development / Freemium | codepen.io/pricing (direct fetch blocked HTTP 403 → web-search snippet of the same page) | 2026-10-14 ◐ |
| Fontawesome | Design / Free + Paid | fontawesome.com/plans gave no usable text → Wikipedia "Font Awesome" article for Pro pricing | 2026-10-14 ◐ |
| Framer | Design / Free + Paid | framer.com/pricing (direct fetch) | 2026-10-14 |
| **Iconfinder** | **not fixed — see below** | iconfinder.com and iconfinder.com/pricing both 301→ freepik.com/icons | 2026-10-14 |
| iconmonstr (was "Iconmonster") | Design / Free | iconmonstr.com (direct fetch, name + icon count) + a university-library research guide for the license summary (secondary, not the primary terms page) | 2026-10-14 ◐ |

◐ = second-hand/secondary source, flagged in that file's `remarks` for the owner to re-verify before flipping to `published`.

**Iconfinder — left as `stage: draft`, not fixed.** `iconfinder.com/` and `iconfinder.com/pricing` both 301-redirect to `freepik.com/icons` — the brand no longer looks like an independent product (Freepik appears to have absorbed it). Writing a normal listing would mean describing a site that doesn't function as its own destination anymore, which the pipeline's "never invent" rule says not to paper over. Left a `remarks` note in the file and a `[placeholder]` description, with a question for the owner baked in: relist as "Freepik Icons" under a new slug, or drop it from the directory?

Also corrected a brand-name error while in there: the stub was titled "Iconmonster"; the real product is **iconmonstr**.

## 4. ResourcesList

- Files: `src/content/resources/{airtable,asana,bitwarden,blender,brave,calendly,coda,codepen,fontawesome,framer,iconmonster}.md` fully rewritten (real description, category, pricing, tags, **Key Features** list, `remarks` with sources/dates). `iconfinder.md` given a `remarks` note + `[placeholder]` description only.
- All 12 moved `stage: draft` → `in review` (RL PR default per `system/pipeline.md`), except `iconfinder.md` which stays `draft` pending the owner's call above.
- Dropped the `badge: Deal` field from all 12 — there's no matching entry in `src/content/deals/` for any of them, so the badge was fabricated seed data, not a real deal.
- Bitwarden's tag list was trimmed from 7 to 5 (dropped `android`/`ios`) to clear `lint-resource.mjs`'s "more than 6 tags" warning.
- Icons: `iconLib` kept/confirmed via `check-icon.mjs` for Airtable, Asana, Bitwarden, Blender, Brave, Calendly, Coda, Font Awesome, Framer (all exact Simple Icons matches, fill colors recorded in frontmatter). No Simple Icons match for CodePen or iconmonstr — used Google's favicon service (`google.com/s2/favicons?domain=...`) for `iconUrl`, the same pattern already used by other published RL entries (e.g. Framer's old `iconUrl`), not an invented asset.
- Checks run from the worktree (`D:\production\resourceslist-worktrees\fix-seed-stubs`):
  - `node scripts/lint-resource.mjs` on each of the 12 → 0 errors, 0 warnings (2 expected same-host warnings on `framer.md` vs. its own marketplace sub-listings)
  - `bun run check:content` → 49 resources, 0 errors, 0 warnings
  - `bun run check` (astro check) → 0 errors, 0 warnings (9 pre-existing unrelated hints)
  - `bun run build` → succeeded
- PR: branch `resource/fix-seed-stubs` pushed to `origin`. No `gh` CLI on this machine → compare link: https://github.com/mrqurious/resourceslist/compare/main...resource/fix-seed-stubs?expand=1

## 9. Assumptions, placeholders, costs

- Assumed (not asked): category mapping for each tool (e.g. Bitwarden/Brave → Personal, CodePen → Development) — reasonable editorial calls, not facts; flagged here in case the owner wants different buckets.
- Assumed (not asked): pricing-enum mapping (Freemium vs. Free + Paid) follows the nearest precedent already in the catalog (Notion/Canva-style apps → Freemium; website-builder/icon-library-style products with a separate paid product → Free + Paid) — no hard rule exists in the schema docs, this is a judgment call.
- Placeholders left: `iconfinder.md` description is `[placeholder]`, pending the owner's relist-vs-drop decision.
- Money/quotas spent: none.

## What remains (for the owner)

1. **Review and merge/request-changes on the RL PR** (link above) — 11 resources fixed, `in review`.
2. **Decide on Iconfinder**: relist as "Freepik Icons" (new slug) or drop the stub entirely.
3. Two entries have secondary-sourced pricing (CodePen, Font Awesome) and one has a secondary-sourced license summary (iconmonstr) — each flagged in its own `remarks`; worth a quick manual re-check against the primary page before flipping those three to `published`.
4. Everything else noted in the earlier launch audit (`D:\production\resourceslist\launch\LAUNCH.md`) still stands — this run only fixed the Lorem-ipsum content gap, items 2–4 there (OG image, Deals stub, stale social link) are untouched.
