---
name: tool-pipeline
description: Run the full tool-to-video pipeline for one tool (e.g. "mixkit.co"): research it, add it to ResourcesList via PR, plan a reel in videoediting via PR, stop at approval gates, build scenes, write the publish copy, and keep a RUN.md. Use when the owner gives a tool name/URL to add and make a video for, says "run the pipeline", or resumes a run ("approved", "changes: …", "status").
---

# tool-pipeline — orchestrator

Source of truth: `system/pipeline.md` (stages, gates, authorization), `system/questions.md` (how to ask), `CLAUDE.md` (rules). Read those first
if you have not in this session, then `config/repos.json`.

## Start or resume

1. **Resume check.** Look in `runs/` for the slug. Exists → read its `RUN.md`, take `status` from the frontmatter, and continue from that stage; the owner's
   message (`approved`, `changes: …`, `go`, answers) is the reply to the last gate. Does not exist → stage 0.
2. **Stage 0 (new run).** Parse the message; pick mode (`full` / `resource-only` / `video-only`, ask only if unclear); duplicate check
   `node scripts/rl-index.mjs --find <name>`; create `runs/<YYYY-MM-DD>-<slug>/RUN.md` from `templates/RUN.md`; branch `run/<slug>`.
3. Hand each stage to its skill, in order, and **stop at each gate**:

| Stage | Skill |
|---|---|
| 1–3 research, questions Q1, RL PR | `resource-research` |
| 4 video research + storyboard + script PR (gate B) | `video-storyboard` |
| 5 scenes (after approval) | `video-build` |
| 6 publish pack | `publish-pack` |
| 7–8 upload guidance, retro | this skill (below) |

## Always

- Update `RUN.md` (status, decisions table, links) at the end of every stage and push the `run/<slug>` branch, so a dead session is resumable.
- Ask in **one batch** per gate with a ★ default (`templates/QUESTIONS.md`). Opt-outs (`go`, `just build it`, `skip N`) are honored except for the always-ask list
  in `questions.md` §B.4.
- Work only in fresh worktrees/clones of the repos; never edit the owner's working copy; never push `main`, never merge, never publish/upload, never spend
  money (voice/TTS/cloud). Branches and PRs are authorized (`pipeline.md` §1).
- PR creation: `gh` → GitHub MCP → push + compare URL. Say which you used.
- End each turn with: what happened, what is next, the exact reply that continues.

## Stage 7 — upload (guidance only)

When gate D passes: give the final file path, the per-platform checklist (`system/publish-copy.md` §7) and the pack. Do not upload. Ask the owner to paste the posted URLs
for RUN.md. Automation of uploads is a separate future request (`publish-copy.md` §8).

## Stage 8 — retro

After posting, or on `abandon`: fill RUN.md § Retro and § Results; add the video to `system/video-projects.md`; open PRs for lessons worth keeping
(automation `system/lessons.md`; videoediting `system/lessons.md`; RL `AGENTS.md`). Set `status: retro-done`, tell the owner the run PR can be merged.

## Quick commands the owner may send

`status` · `pause` · `abandon` · `redo stage N` · `why did you …` (answer from RUN.md, change nothing) — table in `questions.md` §A.5.
