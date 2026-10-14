# The videoediting repo — what the pipeline needs to know

`mrqurious/videoediting` · local `D:\production\videoediting` · default branch `main` · a **HyperFrames** workspace: a video is HTML +
CSS + GSAP, rendered to MP4 by headless Chrome + FFmpeg. Snapshot of this note: **2026-10-14**. The repo's own files are the source
of truth: **`CLAUDE.md`** (rulebook), **`system/process.md`** (the procedure, "main file"), `system/lessons.md`,
`system/resource-reels.md`, `system/scenes.md`, `system/audio.md`, `system/character.md`, `system/presets.md`, `system/PROMPT-GUIDE.md`,
`assets/resourceslist/README.md`. This note tells you which to read when and where the pipeline changes their defaults. Do not
duplicate their content here.

## 1. Shape of the repo

The root is a **workspace**, not a project (no `index.html` / `package.json`). **One video = one folder `videos/<kebab-name>/`.**

```
videoediting/
├─ CLAUDE.md  README.md  notes (raw transcripts)  skills-lock.json
├─ system/        process.md  resource-reels.md  scenes.md  presets.md  character.md  audio.md  lessons.md  PROMPT-GUIDE.md  scripts/  source/
├─ assets/        body/ face/ preset/ scenes/ sfx/ music/ resourceslist/     ← shared library, one copy, never duplicated
├─ videos/        <name>/  BRIEF.md frame.md STORYBOARD.md SCRIPT/CAPTIONS-SCRIPT.md index.html compositions/ assets/ scripts/ …
├─ renders/       every rendered MP4 (gitignored)
├─ ref/           research PDFs (record only)
└─ .agents/skills  .claude/skills     ← the installed HyperFrames skills (identical copies): do not edit
```

## 2. Read order for a pipeline run

1. `CLAUDE.md` (all; §3 frame.md, §4 new-video, §5 contract, §10 prompt coaching, §12 shared assets).
2. `system/process.md` — formats A–E, sections, CTA variants, **ask-when-needed**, the 12-step procedure (§5), file map (§0).
3. `system/lessons.md` — mistakes already made (asset layout, junction order, fonts, GSAP traps, face placement…).
4. `system/resource-reels.md` — hook bank, license line, `SCRIPT.md` template, checked facts.
5. `system/scenes.md` + `assets/resourceslist/README.md` when planning scenes; `audio.md` only if sound is asked; `character.md` only for host scenes.
6. A finished example: `videos/mixdesign` (lightest) or `videos/second-draft` (fullest). HyperFrames skill docs (`/hyperframes-core`,
   `npx hyperframes docs <topic>`) only when writing custom compositions.

## 3. The procedure and where the pipeline changes it

`process.md` §5 is the owner's procedure (intake → curate facts → **propose** → create project → stage assets → build → check → draft
render → final → wrap up → commit → report). The pipeline maps onto it:

| process.md step | Pipeline stage | Change |
|---|---|---|
| 1 Intake, 2 Curate facts, 3 Propose, 4 Create project | **4** | `BRIEF.md`, `frame.md`, `SCRIPT.md`, `STORYBOARD.md` only; stop for gate B. **No voice, no TTS.** |
| 5 Stage assets, 6 Build, 7 Check | **5** | after gate B; silent draft |
| 8 Draft render → approval, 9 Final render | gate C | **the owner renders locally** |
| 10 Wrap up | 5/8 | update `BRIEF.md`; new reusable scenes/assets noted |
| 11 Commit: "on `main`, no branches, never push" | all | **overridden**: branch `video/<slug>` + push + PR (`pipeline.md` §1) |
| 12 Report | every stage | + RUN.md update |

Formats (A single tool · B free alternative · C mini list · D license explainer · E site tour), sections (Hook → Intro → Character intro →
What it is → Demo → Features → Catch/license → CTA) and CTA variants are in `process.md` §2–§4; ask the owner only what §1 of that file
says to ask (`questions.md` §D mirrors it).

## 4. Hard rules to carry into every build (from `CLAUDE.md`, `lessons.md`)

- **Never `whisper`/local transcription;** always `hyperframes init … --skip-transcribe`. Captions/word timing need a transcript or SRT from the owner.
- **No duplicates:** the library is linked, never copied (`videos/<name>/assets/library` junction → workspace `assets/`); site screenshots
  are *moved* from `capture/` into `assets/site/`; `capture/`, `snapshots/` are scratch (prune before finishing).
- Fonts are **local woff2** in the video's `assets/fonts/` (Inter 700/800 for the Clean Caption look); no CDN fonts.
- Deterministic only: no `Date.now()`, `Math.random()`, network fetches at render time. GSAP loads from a CDN, so *renders* need internet.
- Never mix CSS `transform` and a GSAP tween on one element; animate `x/y/scale/rotation`, not CSS position properties.
- Every number, price, license term and logo on screen comes from `SCRIPT.md` facts with a source; otherwise a bracketed placeholder.
- `npm run check` has to be **zero errors**; lint passing ≠ looks right → look at `npx hyperframes snapshot` stills of every changed scene.
- Pre-made scenes are **copied** into the video and edited at their `data-slot`s; a scene used twice needs a new id (`scenes.md`).
- Never leave an MP4 under `videos/<name>/`; renders live in root `renders/` (gitignored) as `<slug>-draft.mp4` / `<slug>-final.mp4`.
- Don't touch other videos or `.agents/skills/**` / `.claude/skills/**`. Pin check: `npx hyperframes@latest upgrade --project . --check`.
- Outward-facing actions (`npm run publish`, cloud render, AI presenter, TTS with an account) need the owner's explicit go-ahead.

## 5. Three ways to build (pick the lightest that fits)

| Route | Use when | Example |
|---|---|---|
| Pre-made scenes via a `scripts/build.mjs` that copies each scene and fills slots | silent reel from `assets/scenes/` (hook / intro / character intro / catch / CTA / features) | `videos/testing` (3 tools, 49.8 s), `videos/mixdesign` (1 tool, 37.8 s; **one `build.mjs` = whole video**) |
| Pre-made scenes + custom demo scenes + TTS captions | voice and word-highlight captions wanted (later) | `videos/second-draft` (`scripts/tts.mjs`, clip lengths drive scene lengths) |
| Fully custom | a brand-new look | `videos/firstdraft` |

Default for the pipeline: the first route, copying `videos/mixdesign/scripts/build.mjs` as the starting point (`process.md` calls it the
lightest way).

## 6. The render hand-off (what the owner must do on the laptop)

The library junction is **not tracked by git** (`.gitignore`: `videos/*/assets/library/`), so a fresh checkout of `video/<slug>` has no
library. Put this block in every video PR (`templates/PR-video-storyboard.md` has it):

```bash
# Git Bash, from D:\production\videoediting
git fetch origin && git switch video/<slug>
cmd //c "mklink /J videos\<slug>\assets\library assets"       # once per checkout; needs videos/<slug>/assets/ to exist
cd videos/<slug> && npm run check && npm run render && cd ../..
mv videos/<slug>/renders/*.mp4 renders/<slug>-draft.mp4 && rmdir videos/<slug>/renders
```

If `npm run check` reports missing dependencies, run `npm install` in `videos/<slug>/` first. Preview: `npx hyperframes preview --background`
(stop with `--stop`). Never `npm run publish` without asking.

In a Linux/cloud session the agent cannot use `mklink`. Use a relative symlink (`ln -s ../../../assets videos/<slug>/assets/library`);
it is **untested** against preview/snapshot/render here, so if a check or snapshot cannot resolve `assets/library/…`, copy only the files the
video uses into its `assets/` and say so in the PR (the one case `CLAUDE.md` §12 allows copies).

## 7. Standing-rule conflict (decision recorded)

videoediting `CLAUDE.md` §7 and `process.md` §5 step 11 say: commit on `main`, no branches, never push, because the owner reviews
locally. The pipeline needs branches + PRs because the owner is away. **The owner's 2026-10-14 brief authorizes branches, pushes and
PRs for pipeline runs.** The agent does not edit those rules in the videoediting repo (not asked). Suggested one-line addition for the owner to
paste into `CLAUDE.md` §7 when ready:

> Exception — automation pipeline runs (`mrqurious/automation`): work on branch `video/<slug>`, push it and open a PR; never push `main`, never merge.

## 8. Audio and voice (not used until asked)

`assets/sfx/` (67 sounds) and `assets/music/` (16 tracks) are Mixkit files catalogued in `system/audio.md` (use-when, volume, hit time, license).
Voice: TTS via OpenRouter (`fish-audio/s2.1-pro-free:free`), key in the root `.env` (gitignored — never print or commit it); script
`videos/second-draft/scripts/tts.mjs`. The pipeline writes the voice lines into `SCRIPT.md` but renders silent drafts. Adding voice =
a separate, explicit request ("add voice, female, calm"), because it spends the owner's quota.

## 9. Known inconsistencies in the repo (as of 2026-10-14, not mine to fix silently)

- `README.md` tree mentions `videos/example-product-intro/`, `videos/hyperframes-billboard/` and a root `my-video/`; none exist in the working tree.
- `README.md` counts differ from the files: bodies on disk are 3 Mr. Curator + 9 gesture + 9 stock = 21 (README says 3/11/10); faces 9.
- `videos/testing` has no `STORYBOARD.md`; its plan is in `BRIEF.md`.
- `system/resource-reels.md` §7 is a placeholder until the character-pop reference video (`LYWKtpwzN_o`) is analyzed; poses come from `character.md`.
- Mixkit license text could not be read when `resource-reels.md` §6b was written (loads in a modal); the facts there are second-hand.
Report new ones in RUN.md § Lessons; propose fixes as PRs, not edits.
