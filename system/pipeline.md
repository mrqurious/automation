# Pipeline — tool idea → ResourcesList entry → reel → publish pack

The main file. It says what happens, in what order, who acts, and where it stops for the owner. Detail lives in the
files this one points to; rules for the agent are in `CLAUDE.md`.

**The idea.** The owner is away from the laptop, researching on a phone, and finds a useful tool (example: Mixkit).
One message starts a run. The agent researches the tool, asks a few questions, adds it to **ResourcesList** (RL) as a
pull request, then plans a **reel** for it in the **videoediting** repo (storyboard + script, no voice), stops for
approval, builds the scenes, and finally writes the title / description / hashtags / pinned comment / captions. Every
run leaves a `RUN.md` so the owner and the next agent can see what actually happened and improve the process.

```
 0 Intake ─ 1 Research ─ 2 Questions Q1 ─ 3 RL pull request ───────────────┐ (not blocking)
                                   │                                         │
                                   └─ 4 Video: research + storyboard + script PR
                                                │
                                           ◆ GATE B  you approve storyboard + script
                                                │
                                      5 Scenes built (silent), checks pass
                                                │
                                      you render locally ─ ◆ GATE C  you approve the render
                                                │
                                      6 Publish pack ─ ◆ GATE D  you approve the copy
                                                │
                                      7 Upload (later) ─ 8 Retro
 ◆ GATE A = RL PR review/merge. It does not block stage 4/5, it blocks stage 6 (the reel says "Found on ResourcesList").
```

## 0. Modes and state

| Mode | When | Stages |
|---|---|---|
| **full** (default) | new tool, wants listing + reel | 0–8 |
| **resource-only** | "just add it to RL" | 0–3 (+8) |
| **video-only** | tool already in RL (`scripts/rl-index.mjs --find` hits) | 0, 4–8 (stage 1 becomes a re-verify of the facts) |

Ask which mode only when the message does not make it obvious.

**State lives in `RUN.md`** (`runs/<date>-<slug>/RUN.md`, template `templates/RUN.md`). Every stage starts by reading it and
ends by updating it, so a dead or paused session resumes from the file, not from memory. `status` in its frontmatter is one of:
`intake` · `research` · `awaiting-answers-1` · `rl-pr-open` · `awaiting-answers-2` · `storyboard-pr-open` (= gate B) ·
`scenes-built` · `awaiting-render` (= gate C) · `render-approved` · `publish-pack-ready` (= gate D) · `ready-to-upload` ·
`uploaded` · `retro-done` · `blocked` · `abandoned`.

**Slug** = the RL filename without `.md` (kebab-case of the tool name: `mixkit`, `excalidraw`, `google-fonts`). It is also the
video folder name and the branch suffix. Run id = `<YYYY-MM-DD>-<slug>`.

## 1. Branches, PRs and what is authorized

| Repo | Branch | PR | Contains |
|---|---|---|---|
| `resourceslist` | `resource/<slug>` | "Add resource: <Title>" | resource `.md` (+ templates sibling, + new tag JSONs) |
| `videoediting` | `video/<slug>` | "Video: <Title> reel — storyboard" → later "— scenes" (same PR) | `videos/<slug>/` (BRIEF, frame, SCRIPT, STORYBOARD, then scenes, PUBLISH.md) |
| `automation` | `run/<slug>` | "Run: <Title>" (status board) | `runs/<date>-<slug>/RUN.md` (+ later lessons) |

**Authorized by the owner (2026-10-14 brief):** create branches, commit, push, and open pull requests in all three repos, as
part of a pipeline run. This is a deliberate, scoped override of two standing rules: videoediting `CLAUDE.md` §7 ("commit on
`main`, never push") and RL `config/RULES.md` ("never commit without explicit instruction"). The override covers branches and PRs
only.

**Never, without a fresh explicit instruction in the same conversation:** push to `main`/`master`, force-push, merge a PR,
deploy (`wrangler deploy`), publish/upload a video, publish a render link (`npm run publish`), use a paid or credentialed
service (TTS, cloud render, AI presenter), bump RL `version` or edit its changelog, or edit existing published resources
beyond the agreed related-links.

PR creation tool order: `gh` if installed (it is **not** on the owner's laptop as of 2026-10-14) → GitHub MCP tools if the
session has them → otherwise push the branch and give the compare link
`https://github.com/mrqurious/<repo>/compare/main...<branch>?expand=1`.
Commit trailer: the one the session's attribution reminder asks for. Keep one topic per commit.

## 2. Stages

### Stage 0 — Intake (agent, no questions unless blocked)

1. Parse the owner's message: tool name and/or URL, plus any hints (angle, "alternative to X", destination, format, length, CTA,
   voice). Hints become answers: do not ask again what the message already says (`questions.md` §B).
2. Read `config/repos.json`; make sure each repo is reachable (`git ls-remote`). Get a clean checkout of each repo you will touch:
   locally a `git worktree` off `origin/main`; in a cloud session a fresh clone. **Never edit the owner's working copy.**
3. Duplicate check: `node scripts/rl-index.mjs --find <name-or-domain>`. Hit → switch to video-only or ask (update vs skip).
4. Create `runs/<date>-<slug>/RUN.md` from the template, paste the owner's message verbatim into § Intake, branch `run/<slug>`.

### Stage 1 — Research (agent) → `research-playbook.md`

Find the official site, then read **the whole site that matters**: home, about, pricing, license / terms / legal, FAQ,
browse/categories, templates or marketplace pages, docs, GitHub. Collect the RL fields (logo, title, URL, description) and the
four-part license line (license name · commercial use · attribution · one limit), each with a source URL and the date read.
Output: RUN.md § Research + § Facts. Anything unverified stays a bracketed placeholder.

### Stage 2 — Questions Q1 (owner) → `questions.md` §C

Batch the open resource decisions into **one message** (≤ 6 questions, recommended answer first, "reply `go` to accept all
recommended"). Typical: type, category, pricing label, tags (existing vs new), **split into sibling resources?** (when the site
has a templates / marketplace section), related + similar picks, icon route, stage for the PR. Record every answer (and whether
it was a default) in RUN.md § Decisions.

### Stage 3 — ResourcesList PR (agent) → `repo-resourceslist.md`, skill `resource-research`

1. Branch `resource/<slug>` off `origin/main` in the RL checkout.
2. Write `src/content/resources/<slug>.md` from `templates/resource.md` (own words, schema limits, license summary in
   `remarks`). Sibling resources, new tag JSONs and approved related-links in the same PR.
3. Icon: `node scripts/check-icon.mjs "<Name>"` → Simple Icons (`iconLib` + `fillColor`) → else the site's own SVG
   (`iconSvg`, sanitized) → else **ask**.
4. `node scripts/lint-resource.mjs <file>` then in the RL repo `bun run check:content && bun run check && bun run build`
   (the same three steps CI runs). If the environment cannot run them, say so in the PR; CI will.
5. Commit, push, open the PR with `templates/PR-resourceslist.md` (summary, fields, license notes, icon decision, checks, how to
   preview). Do **not** bump `package.json` version or the changelog.
6. Update RUN.md (§ RL resource, links) and continue to stage 4 without waiting (gate A is reviewed in parallel).

### Stage 4 — Video: research, storyboard, script (agent) → `repo-videoediting.md`, skill `video-storyboard`

Follow `videoediting/system/process.md` §5 steps 1–4 exactly (it is the owner's procedure), with these pipeline rules:

- **No voice-over, no TTS, no music purchase.** Voice lines are still written in `SCRIPT.md` so voice can be added later; the draft is
  silent (on-screen words carry it, like `videos/testing` and `videos/mixdesign`). Voice is an explicit later request.
- Questions Q2 (`questions.md` §D) in one batch: format A–E, length, audience, destination → CTA variant, hook pick, alternative
  tools for a paid tool, sourced price, music/SFX yes/no, look. Defaults: format A, 35–45 s, Clean Caption, silent.
- Facts table in `SCRIPT.md` re-verified **today** from the tool's own pages; the license line is the "catch" scene.
- Write `BRIEF.md`, `frame.md`, `SCRIPT.md` (3 hook options), `STORYBOARD.md` (one row per scene: time, section, voice line,
  on-screen text, visual, scene file or custom, host pose, transition preset, sfx — `templates/STORYBOARD.md`).
- Open the PR with `templates/PR-video-storyboard.md`. Stop at **gate B**.

### ◆ Gate B — storyboard + script approval

The owner replies `approved` (storyboard **and** script) or `changes: …`. Changes follow the one-variable, absolute-target rule
(`questions.md` §A.4, from videoediting `CLAUDE.md` §10.5). Re-push, re-ask only about what changed.

### Stage 5 — Scenes (agent) → skill `video-build`

After gate B: build the video from pre-made scenes (`assets/scenes/`), presets and the RL kit, per `process.md` §5 steps 5–7 and
`CLAUDE.md` §5/§11. `npm run check` must have **zero errors**; look at a snapshot of every changed scene; delete snapshots.
No renders are committed (`/renders` is gitignored). Push to the same branch, update the PR with the **render hand-off**
(the owner's laptop needs the library junction, which git does not carry: see `repo-videoediting.md` §6).
Set `status: awaiting-render`.

### ◆ Gate C — render approval

The owner renders locally (draft → `renders/<slug>-draft.mp4`), watches it, replies `approved` or `changes: scene 3 …`.
Iterate (stage 5 again) until approved; final render `<slug>-final.mp4` by the owner. Capture every change request in RUN.md
§ Gates — they are the training data for the next run.

### Stage 6 — Publish pack (agent) → `publish-copy.md`, skill `publish-pack`

Preconditions: gate C passed, RL PR merged and the page live (`https://resourceslist.com/rec/<slug>` returns 200; if not, say so and
write the CTA anyway but flag "link not live"). Output `videos/<slug>/PUBLISH.md` (template `templates/PUBLISH.md`):
3 title options, description, hashtags, pinned comment, caption per platform (YouTube Shorts, Instagram Reels, TikTok),
cover text, alt text, first-comment, link placement. Re-verify platform limits by web search at this step (they change).
Stop at **gate D**.

### Stage 7 — Upload (later; guidance only today)

Not automated. The agent gives a per-platform checklist and the final files; uploading with the owner's accounts always needs a
fresh go-ahead. Candidate automation later (verify current API terms first): YouTube Data API, Instagram Graph API (Reels),
TikTok Content Posting API. See `publish-copy.md` §8.

### Stage 8 — Retro (agent + owner)

When the video is posted (or the run is abandoned): fill RUN.md § Retro — what the owner changed at each gate, questions that
were unnecessary or missing, time lost, results after ~7 days if the owner pastes them. Promote real lessons: universal →
`system/lessons.md` here; video-specific → videoediting `system/lessons.md`; RL-specific → RL `AGENTS.md` gotchas (each via PR,
never silently). Set `status: retro-done`; the run PR can be merged.

## 3. Away-mode protocol (the owner is on a phone)

- Answer in short blocks: what happened, what is next, what is needed. No walls of text.
- Every stop ends with a **numbered question list** the owner can answer in one line (`1b 2 go 3 skip`). Never ask question by
  question across five messages.
- A stop always names the exact reply that continues the run.
- Long jobs (build, check, snapshot) run without asking; only genuine owner decisions stop the run.
- If the session may die, the last act is updating RUN.md and pushing the run branch.

## 4. Where things can run

| Step | Laptop (Windows) | Cloud / Linux session |
|---|---|---|
| Research, RL file, lint, `bun run check:content/check/build` | yes | yes (`bun install` first) |
| PR creation | push + compare link (no `gh`) | GitHub tools or `gh` |
| Storyboard / script / publish copy | yes | yes |
| `hyperframes init`, `npm run check`, snapshots | yes | yes if npm + headless Chrome are available |
| Library junction (`mklink /J`) | yes | Windows-only; on Linux use a symlink, untested with preview/render — else copy only the files used and say so |
| Screenshots of the tool's site | headless Chrome (`chrome.exe`) | headless Chromium if present, else ask the owner |
| Render (`npm run render`) | **the owner does this** | not expected |

## 5. Stop-and-ask list (do not guess)

Site blocks automation (bot check) · license unreadable or forbids commercial use / redistribution / listing · tool is paid-only
(RL's reels focus on free tools — ask) · tool looks abandoned, unsafe or adult · a price or claim has no source · no logo route
works · CI fails for a reason you cannot fix · a push or PR is refused · anything that would spend money or publish.
Write the blocker into RUN.md, set `status: blocked`, and ask.
