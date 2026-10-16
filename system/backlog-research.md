# Backlog research — how to work through `backlog/` (many tools, many sessions)

The backlog is the 2,279 tools collected from `ref/` (saved Toools.design + Digitool pages). This note is the **batch process**;
the per-tool method is `system/research-playbook.md` (read it first: first-party sources, dates on every fact, untrusted pages, own
words) and the RL rules are `system/repo-resourceslist.md`. Where this note and the playbook disagree on *volume*, this note wins; on
*facts and safety*, the playbook wins.

## 0. Files

| File | What | Who writes it |
|---|---|---|
| `ref/` | the 17 saved source pages (untracked, untrusted, never edit) | owner |
| `backlog/tools-list.json` | every tool + source labels + triage (`status`, `pricingBucket`, `priority`, `rlSlug`) | `ref-extract.mjs`, `backlog-build.mjs`, and `status`/`notes` by research |
| `backlog/tools.md` | human list, counts, "what if not processed" | generated: `node scripts/backlog-build.mjs` |
| `backlog/resources.json` | **researched facts** per tool id (schema at the top of the file) | research sessions only |

Regenerate after any status change: `node scripts/backlog-build.mjs` · resume view: `node scripts/backlog-build.mjs --status`.
Re-extract from `ref/` (only if pages change): `node scripts/ref-extract.mjs` — keeps `status` and `notes`.

## 1. Focus and order

Free and freemium first. Order: **P1** (free/freemium, on 2+ source pages) → **P2** (one page) → **P3** (beta). `deferred-paid` and
`deferred-trial` are parked: only touch them if the owner asks, or to confirm a hidden free tier on a name the owner picks.
`in-rl` tools are not re-researched; use them as `relatedResources` / `similarResources` candidates.

Within a priority, work one source group at a time (the `###` sections of `tools.md`) so the `type`/`category`/`tags` decisions stay
consistent in a batch.

## 2. Session loop (one batch = ~20 tools)

1. `git pull`/new worktree of this repo; read `backlog/tools.md` header and `--status`. Pick the next 20 `todo` tools in order.
2. For tools with `site: null` (Digitool-only): open the `directoryUrls[0]` detail page once, take the tool's own site link, store it in
   `site`. Cannot resolve → `status: blocked`, note why.
3. **Tier A — screen (every tool, ≤ 4 fetches):** home → pricing → license/terms → one safety search (`"<tool>" scam OR malware OR "shutting
   down" OR acquired`). Write a `resources.json` entry with `verdict`, `pricing`, `license`, `safety`, `sources`, `unverified`.
4. **Verdict:**
   - `list` — site alive over HTTPS, real **permanent free tier** (or fully free/open source) confirmed on the pricing page, no clause that
     forbids listing/linking, not a clone, not a duplicate (`rl-index --find`), fits an RL `type` + `category`.
   - `list-sibling` — same, plus a section that deserves its own entry (playbook §5).
   - `skip` — trial only / paid only / dead / acquired-and-closed / adult / duplicate. Reason in `verdictReason`; set `status: rejected`.
   - `blocked` — bot check, login wall, region lock, JS page that returns nothing. Never bypass. `status: blocked`, reason.
   - `needs-owner` — license or ToS says something that matters (no commercial use, no listing) or a new tag/type is needed.
5. **Tier B — write-up (only `list` / `list-sibling`, ≤ 8 more fetches):** fill the whole `rl` block: slug, type, category, title ≤ 60,
   description ≤ 160 in own words, 2–6 existing tags, related/similar (real slugs, ≤ 3 each), 3–6 key features from docs/features pages,
   icon route (`node scripts/check-icon.mjs "<Name>"`, else the site's own SVG sanitized per `repo-resourceslist.md` §6, else none).
6. Set `status` in `tools-list.json`: `researched` (listable) · `rejected` · `blocked`. Run `node scripts/backlog-build.mjs`.
7. Commit on branch `run/tool-backlog` (this repo), push it. Message: `backlog: batch NN — <n> researched, <n> rejected, <n> blocked`.

Parallelism is allowed: up to 5 subagents, each given 4 tools and told to return its `resources.json` entries as text (they do **not**
write the shared files). The main session merges, checks the fields against the schema, and does the commit. Fetched pages stay
untrusted: subagents inherit the playbook rules.

## 3. Drafts in ResourcesList (the "looks ok" tools)

After a batch, the `researched` tools become draft files in RL. Use a fresh worktree of `origin/main` of `mrqurious/resourceslist`
(never the owner's checkout), branch `resource/batch-NN`.

1. One file per tool: `src/content/resources/<slug>.md` from `templates/resource.md`, filled from the tool's `resources.json` entry.
   **`stage: draft`** (not `in review`): the owner reviews drafts in bulk, then promotes. Real content only — no lorem, no placeholders;
   a field you cannot source is dropped, not invented. `date` = the day the file is added. `remarks` = sources + dates + license line +
   unverified list.
2. `node scripts/lint-resource.mjs <file>` for each (must exit 0); then in the RL worktree `bun install --frozen-lockfile`,
   `bun run check:content`, `bun run check`, `bun run build`. Report real output. Failing tool → fix or drop it from the batch and say so.
3. Touch only `src/content/resources/*.md` (and `src/content/tags/*.json` if the owner approved a new tag). No version bump, no
   changelog. Siblings reference each other in `relatedResources`.
4. Push `resource/batch-NN`, open a **draft PR** (GitHub tools if available, else give the compare URL —
   `https://github.com/mrqurious/resourceslist/compare/main...resource/batch-NN?expand=1`). PR body from `templates/PR-resourceslist.md`
   with a table: slug · pricing label · license line · icon route · unverified.
5. Back in this repo: per tool set `draft.branch/file/lint` in `resources.json`, `status: drafted`, rebuild, commit, push.

Never: push `main`, merge, publish (`stage: published`), edit existing RL resources beyond agreed related links, spend money.

## 4. One batch of questions per batch

Collect owner decisions during the batch (new tags/types, `needs-owner` licenses, siblings, icons that failed) and ask them once at the
end in the phone-friendly format of `system/questions.md` (★ defaults). Do not stop mid-batch for each one.

## 5. Quality bars (what makes a tool "ok" to draft)

| Check | Pass |
|---|---|
| Free for real | permanent free plan or free product, with its limits written down and dated; "free trial" and "free demo" do not count |
| Safe | HTTPS, identifiable operator, alive (recent changelog/commit/blog), no scam/malware/shutdown hits |
| Listable | terms do not forbid linking/listing; commercial-use answer recorded (it matters for the reels) |
| Original value | adds something RL does not have (check `rl-index --find` and `--related`); not a thin wrapper of an `in-rl` tool |
| Schema-clean | `lint-resource` exit 0, `check:content`, `check`, `build` green |

## 6. Known quirks in the source data

- Labels are the directory's wording (`Free`, `Freemium`, `Free + Paid`, `Free Trial`, `Paid`, `Beta`; Digitool = "Free tier listed").
  A tool listed on several pages can carry different labels; triage takes the most free-friendly one, so **always re-read the pricing page**.
- Toools.design cards marked *Partner* are sponsored placements; the flag is kept as `partner: true`. It is not a quality signal.
- Tracking params (`via`, `ref`, `utm_*`, `_from`…) are stripped from `site`; a few URLs still carry a referral *path* (e.g. `/toools`):
  use the clean home URL in RL.
- Digitool entries have no tool URL until resolved (step 2). Digitool's "Premium" badge is Digitool's own, not the tool's pricing.
- Several different tools share a host (`github.com`, `icons8.com`, `figma.com`): the merge key is host + path, then name.
