---
name: video-storyboard
description: Plan a ResourcesList reel for one tool in the videoediting repo: verify the facts, ask the video questions in one batch, write BRIEF, frame, SCRIPT (3 hooks) and STORYBOARD (no voice, no scenes yet), and open a pull request for approval. Use for pipeline stage 4 or when asked to storyboard a video for a tool.
---

# video-storyboard — stage 4 (ends at gate B)

Read: `system/repo-videoediting.md` (read order, hard rules), `system/research-playbook.md` §9, `system/questions.md` §D, `system/video-projects.md`, `system/video-assets.md`.
Then, in the videoediting checkout: `CLAUDE.md`, `system/process.md`, `system/lessons.md`, `system/resource-reels.md`, `system/scenes.md`, `assets/resourceslist/README.md`.
Templates: `templates/SCRIPT.md`, `templates/STORYBOARD.md`, `templates/PR-video-storyboard.md`.

## Steps

1. **Checkout.** Fresh worktree/clone of `mrqurious/videoediting` off `origin/main`, branch `video/<slug>`. `videos/<slug>/` must not exist.
2. **Facts.** Re-verify today, on the tool's own pages, every fact the video will show (license line, pricing label, demo path). Reuse RUN.md § Facts, update the dates. Price in a hook → vendor
   pricing page + date, or no price. Paid tool with no alternative named → propose 2–3 free alternatives from RL first (`rl-index`), then the web.
3. **Questions Q2** (`questions.md` §D V1–V11), one batch, ★ defaults: format A–E, length, CTA by destination, hook, audio (default **silent**), look (default Clean Caption). No voice, no TTS, no
   music unless explicitly asked. Record answers in RUN.md.
4. **Create the project** in the owner's order (`CLAUDE.md` §4): inside `videos/`, `npx hyperframes init <slug> --non-interactive --skip-transcribe --resolution portrait` (never whisper).
   Then `BRIEF.md` (after init) → `frame.md` (copy `videos/second-draft/frame.md` unless another look was chosen) → `SCRIPT.md` → `STORYBOARD.md`.
   If `init` cannot run (offline/cloud), write the same files under `videos/<slug>/` and note it: stage 5 then moves the docs aside, runs `init`, and moves them back (init refuses a non-empty dir).
   **Do not** build scenes, create the junction, capture the site, or generate audio in this stage.
5. **Script + storyboard.** Three hook options with the fact each depends on, one recommended. One storyboard row per scene: time, section, voice line (written, not recorded), on-screen text,
   visual, scene file from `assets/scenes/` (or "custom"), host pose, transition preset, sfx. Every on-screen number traces to a `SCRIPT.md` row with a source. List the screenshots needed and who can capture them.
6. **PR.** Commit only the project's source docs (no renders/snapshots/caches), push, open the PR with `templates/PR-video-storyboard.md`. Update RUN.md § Video, status `storyboard-pr-open`,
   push the run branch.
7. **Stop.** Send the open questions (if any) and the gate-B message: reply `approved` (storyboard **and** script) or `changes: …`.

## Don'ts

Invent numbers, prices, licenses or logos · pick stock people (`stock-*`) for a published video (licence unverified) · bypass a bot check (ask for screenshots) · edit other videos, the library, or `.agents`/`.claude` skills ·
commit to `main` · merge.
