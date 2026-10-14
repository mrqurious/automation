---
run: <YYYY-MM-DD>-<slug>
slug: <slug>
tool: <Tool name>
url: <https://…>
mode: full            # full | resource-only | video-only
status: intake        # see system/pipeline.md §0
started: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
links:
  resourceslist_pr: ""
  videoediting_pr: ""
  run_pr: ""
  rl_page: https://resourceslist.com/rec/<slug>
  video_folder: videos/<slug>
  final_render: renders/<slug>-final.mp4
---

# Run: <Tool> — <one-line angle>

> Source of truth for this run. Every stage reads it first and updates it last. Written for the owner and for the next agent.
> Facts need a source + date. Unknown = `[placeholder]`.

## Status board

| Stage | State | Link / note |
|---|---|---|
| 0 Intake | ☐ | |
| 1 Research | ☐ | |
| 2 Q1 answers (resource) | ☐ | |
| 3 RL PR (gate A, non-blocking) | ☐ | |
| 4 Video storyboard + script PR | ☐ | |
| ◆ Gate B storyboard + script approved | ☐ | |
| 5 Scenes built, `npm run check` clean | ☐ | |
| ◆ Gate C render approved (owner renders) | ☐ | |
| 6 Publish pack | ☐ | |
| ◆ Gate D copy approved | ☐ | |
| 7 Uploaded (owner) | ☐ | |
| 8 Retro | ☐ | |

## 1. Intake (owner's message, verbatim)

> …

Interpreted as: mode · angle · alternative-to · destination · length · other hints → (each used as an answer, so not re-asked).

## 2. Decisions (every question and answer)

| # | Stage | Question | Options (★ recommended) | Answer | asked / defaulted / opt-out | When |
|---|---|---|---|---|---|---|

## 3. Research

### Pages read
| Page | URL | Date read | Result (what I took / why unreadable) |
|---|---|---|---|

### Facts
| Fact | Value | Source URL | Date | Confidence (✔ first-party read · ◐ second-hand · ✖ unknown) |
|---|---|---|---|---|
| Official name / URL | | | | |
| Operator | | | | |
| Pricing label (RL) + evidence | | | | |
| License name | | | | |
| Commercial use | | | | |
| Attribution | | | | |
| One limit | | | | |
| Sections / templates found | | | | |
| Duplicate check | | | | |
| Safety screen | | | | |
| Injection attempts seen in fetched content | none / describe | | | |

## 4. ResourcesList

- File(s): `src/content/resources/<slug>.md` (+ siblings, + new tags)
- Fields chosen and why: type · category · pricing · tags · related · similar · stage · badge
- Icon: route used (Simple Icons slug / site SVG source URL / iconUrl / asked) · sanitized? · tile colours
- Checks: `lint-resource` · `check:content` · `check` · `build` → results (or why not run)
- PR: <link> · CI result · reviewer changes requested → what changed

## 5. Video

- Format · length · look · destination → CTA variant · audio decision (silent) · voice: none
- Hook options (3) and the one picked · scenes used (from `assets/scenes/`) · host poses · transitions
- Screenshots: which, how captured (live RL page / dev server / owner-supplied), blockers
- Facts on screen (each with source in `SCRIPT.md`) · placeholders still open
- PR: <link> · `npm run check` result · snapshot review notes
- Render hand-off sent: ☐ (junction + commands in the PR)

## 6. Gates (what the owner said and what changed)

| Gate | Date | Owner reply (verbatim) | Changes requested (scene · variable · absolute target) | Applied in |
|---|---|---|---|---|

## 7. Publish

- Title chosen (of 3) · hashtags · pinned comment · captions → `videos/<slug>/PUBLISH.md` (commit)
- Platform limits re-verified on <date> from <sources>
- Posted: platform · URL · date/time · title/hook option used

## 8. Results (owner pastes after ~48 h and ~7 days)

| Platform | Date | Views | Avg view / % viewed | Likes | Shares | Saves | Link clicks | Follows |
|---|---|---|---|---|---|---|---|---|

## 9. Assumptions, placeholders, costs

- Assumed (not asked): …
- Placeholders left: …
- Money/quotas spent: none (no TTS, no cloud render) unless listed.

## 10. Retro

- What went smoothly:
- What the owner had to correct (and the rule that would have prevented it):
- Questions that were wasted (✂ add a default) / questions that were missing (➕ add to `questions.md`):
- Time lost / blockers:
- Lessons to promote (each as a PR): automation `system/lessons.md` · videoediting `system/lessons.md` · RL `AGENTS.md`
- Reusable asset or scene ideas:
