# automation

One message from your phone — *"add Mixkit and make a video"* — becomes:

1. a **ResourcesList** pull request with the tool researched, licensed-checked, tagged, logo'd and linked to related resources;
2. a **videoediting** pull request with a reel **storyboard + script** (no voice) for you to approve;
3. after you approve: the **scenes built** with HyperFrames, ready for you to render;
4. after you approve the render: the **title, description, hashtags, pinned comment and captions** for YouTube Shorts / Instagram Reels / TikTok;
5. a **`RUN.md`** for every video so you (and the AI) can see exactly what happened and improve the next run.

This README is for **you**. The agent's rules are in [`CLAUDE.md`](CLAUDE.md).

## The three repos

| Repo | What it is | This pipeline adds |
|---|---|---|
| [`resourceslist`](https://github.com/mrqurious/resourceslist) | the directory site (Astro, Cloudflare Workers) | `src/content/resources/<slug>.md` (+ tags) on branch `resource/<slug>` |
| [`videoediting`](https://github.com/mrqurious/videoediting) | HyperFrames video workspace | `videos/<slug>/` on branch `video/<slug>` |
| `automation` (this) | playbooks, templates, skills, run logs | `runs/<date>-<slug>/RUN.md` on branch `run/<slug>` |

## How to start a run

```
/tool-pipeline mixkit.co
```

Everything else is optional (`mode`, `angle`, `alternative to`, `destination`, `length`, `notes`): the full template and the answer shortcuts are in
[`system/questions.md`](system/questions.md) §A. The AI asks what it cannot decide in **one numbered message** with a ★ recommended answer for each; reply `go` to accept all, or `1b 3 skip 4`.

## What you do, and when

```
you: /tool-pipeline <tool>
  AI researches the whole site (about, pricing, license, templates…), asks ≤ 6 questions        ← you answer
  AI opens the ResourcesList PR, then the video storyboard+script PR                             ← ◆ you review/merge the RL PR (gate A)
                                                                                                 ← ◆ you reply "approved" (storyboard + script) (gate B)
  AI builds the scenes, runs the checks, hands you the render commands
  you render on the laptop, watch it                                                             ← ◆ you reply "approved" or "changes: scene 3 …" (gate C)
  AI writes the publish pack                                                                     ← ◆ you reply "approved" (gate D)
  you upload (checklist provided; upload automation comes later)
  AI fills the retro in RUN.md; you paste results after a week
```

Approve in chat or as a PR comment. Change requests work best as *one variable, an absolute target, "leave X alone"* (e.g. *"scene 3: hook text ends at 2.6 s, leave the pose alone"*).

## Where to look

| I want to… | Open |
|---|---|
| understand the whole flow, gates, what is allowed | [`system/pipeline.md`](system/pipeline.md) |
| know how the AI asks questions / what to type back | [`system/questions.md`](system/questions.md) |
| see how a tool gets researched (license, templates, logo) | [`system/research-playbook.md`](system/research-playbook.md) |
| see what the AI knows about each repo | [`system/repo-resourceslist.md`](system/repo-resourceslist.md), [`system/repo-videoediting.md`](system/repo-videoediting.md) |
| see videos and assets that already exist | [`system/video-projects.md`](system/video-projects.md), [`system/video-assets.md`](system/video-assets.md) |
| see how titles/hashtags/captions are made | [`system/publish-copy.md`](system/publish-copy.md) |
| write better video prompts | [`system/PROMPT-GUIDE.md`](system/PROMPT-GUIDE.md) |
| see what happened in one video | `runs/<date>-<slug>/RUN.md` |
| see mistakes already made | [`system/lessons.md`](system/lessons.md) |

## Decisions made for you (change them in `system/pipeline.md` if you disagree)

- **PRs, not direct commits.** Your two repos say "commit on main / never commit without instruction"; for pipeline runs you authorized branches + PRs, so the AI uses them. It never pushes `main`, merges, deploys or uploads.
- **Gate A (the RL PR) does not block the video**; it blocks the publish step, because the reel says "Found on ResourcesList" and the page must be live.
- **Silent drafts.** No voice-over until you ask (it spends quota). Voice lines are still written in the script.
- **RL PR stage default `in review`.** Merging an `in review` entry is safe (not listed). Say `publish` to flip it to `published` before merge.
- **No RL version bump / changelog** in the PR; that stays your release decision.
- **You render.** The video library link is a Windows junction that git does not carry; every video PR contains the exact commands.

## Helper scripts

`node scripts/rl-index.mjs --enums` · `--find <name>` · `--related <tags>` — what RL already has.
`node scripts/check-icon.mjs "<Name>"` — is the logo in Simple Icons?
`node scripts/lint-resource.mjs <file>` — quick schema check before the PR. Needs Node ≥ 22 and the RL repo next to this one (or `--repo`).

## One-time setup you may want

- Install the GitHub CLI (`winget install GitHub.cli`, then `gh auth login`) so PRs open directly; without it the AI pushes the branch and gives you a compare link.
- Paste the one-line exception into videoediting `CLAUDE.md` §7 (text in `system/repo-videoediting.md` §7) so that repo's rules match the pipeline.
- Make sure the Claude session you use from the phone has all three repos attached.
