# Lessons — pipeline-level

Mistakes and fixes about the **pipeline itself** (orchestration, questions, gates, cross-repo handoffs). Video-building lessons stay in
`videoediting/system/lessons.md`; resource/schema lessons in RL's `AGENTS.md`. Each entry: what went wrong · why · what to do instead · which run found it.
Promoted from `RUN.md` § Retro by PR.

## Seeded at creation (2026-10-14, from reading the repos — not from a run yet)

### The library junction is not in git
- **What would go wrong:** the owner switches to `video/<slug>` on the laptop and `npm run render` fails or renders without characters/scenes, because `videos/*/assets/library` is gitignored.
- **Do instead:** every video PR carries the `mklink /J` + render commands (`templates/PR-video-storyboard.md`).

### Unsanitized SVG logos disappear silently
- **What would go wrong:** an `iconSvg` copied from a site contains an `href`, `<style>` or `on*` attribute; RL's `DirectoryIcon` drops it with no error and the card shows the default logo.
- **Do instead:** `scripts/lint-resource.mjs` uses RL's exact filter; run it before the PR.

### Schema docs lag the code
- **What would go wrong:** following `CONTENT_SCHEMA.md` / `plan/prompts.md` misses `bgColor`/`fillColor` and offers categories that are not in `resourceCategories`.
- **Do instead:** read enums from `src/lib/consts.ts` (`rl-index --enums`), the Zod schema from `src/content.config.ts`.

### The reel says "Found on ResourcesList" before the page exists
- **What would go wrong:** the video or the pinned comment links to `/rec/<slug>` while the RL PR is unmerged → 404.
- **Do instead:** gate A blocks stage 6; stage 6 checks the URL returns 200 and flags otherwise; stage 5 screenshots come from the live page or the RL dev server of the PR branch.

### Platform limits are conflicting folklore
- **What would go wrong:** hard-coding "30 hashtags" or "2,200 characters" from memory; sources disagree and none checked was official.
- **Do instead:** conservative defaults + re-verify at stage 6 (`publish-copy.md` §1).

### Standing rules disagree with the pipeline
- **What would go wrong:** videoediting says "never push", RL says "never commit without instruction"; an agent follows one and breaks the flow, or ignores both and overreaches.
- **Do instead:** `pipeline.md` §1 and `CLAUDE.md` §2.3 define exactly what is authorized (branches/PRs only).

## Add new entries below (newest first)
