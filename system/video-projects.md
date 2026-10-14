# Video projects already made (videoediting `videos/`) — reference index

Snapshot **2026-10-14**, read from each project's `BRIEF.md`. Use it to pick the nearest example to copy from. Keep this table current:
when a pipeline run finishes, add a row (stage 8 retro). All are 1080×1920 unless noted; renders live in the gitignored root `renders/`.

| Project | What it is | Format · length | Audio | Look | Build route | Status | Copy it when |
|---|---|---|---|---|---|---|---|
| `videos/mixdesign` | DrawKit (free illustrations), single tool | A · 37.8 s | silent; big words + a floor caption under every scene | BlockFrame flare + one pink accent (`frame.md`) | **one `scripts/build.mjs` = whole video** (9 template scenes, host) | draft rendered (`renders/mixdesign-draft.mp4`), awaiting owner's changes | **default start for a new single-tool reel** |
| `videos/testing` | Excalidraw + Mixkit + theSVG mini-list; tests the pre-made scenes | C · 49.8 s | silent, no caption track | Clean Caption (pre-made scenes' look) | pre-made scenes via `scripts/build.mjs`; `intro-found-on` ×3 with RL tool-page shots | draft rendered, awaiting review | list reels (2–5 tools); example of `BRIEF.md` with decisions + open items |
| `videos/second-draft` | Unsplash tool intro | A · ~38 s | **TTS voice-over** + word-by-word blue caption highlight | Clean Caption (`frame.md` is the base for pre-made scenes) | custom scenes + presets; `scripts/tts.mjs`; host in 5 of 8 scenes | draft v4 | when voice and captions are requested; best `STORYBOARD.md` and `CAPTIONS-SCRIPT.md` examples |
| `videos/firstdraft` | "meet the host" product-launch style video | 60 s | none | BlockFrame (uses Inter because resourceslist.com does) | custom (`product-launch-video` workflow) | first draft; audio variants in `renders/` | a bespoke look; the "meet the host" angle |
| `videos/premade-scenes` | review reel playing all 21 pre-made scenes with labels | 81 s | none | Clean Caption | `scripts/build-scenes.mjs` **generates `assets/scenes/*.html` and `system/scenes.md`** | reference | seeing a scene before using it; changing/adding a scene (edit here, rerun) |
| `videos/template` | reference build of presets + characters | **16:9**, ~6.6 min | — | — | `general-video` | internal reference, not published | learning how a preset or face swap behaves |

Renders on disk (2026-10-14): `firstdraft-draft`, `firstdraft-with-audio`, `firstdraft-with-music-sfx`, `mixdesign-draft`,
`second-draft-draft` (+ `-v2…-v4`), `template_2026-10-04_18-02-28`. Whether any of them was uploaded is not recorded in the repo.

## What a finished video folder contains (the pattern the pipeline reproduces)

`BRIEF.md` (frontmatter: `name`, `angle`, `aspect`, `length`, `audio`, `style`, `cta`, `status`; then Intent / Decisions / Facts used / Open /
Rebuild) · `frame.md` · `STORYBOARD.md` · `SCRIPT.md` or `CAPTIONS-SCRIPT.md` (fact table with sources + script) · `index.html` ·
`compositions/scenes/*.html` · `assets/{site,fonts,library→workspace assets}` · `scripts/build.mjs` · generated `AGENTS.md`/`CLAUDE.md`/
`hyperframes.json`/`meta.json`/`package.json`. Never committed: `renders/`, `snapshots/`, `.hyperframes/`, `capture/` scratch.

## Facts already verified for earlier tools (do not trust blindly; re-verify before reuse)

`videoediting/system/resource-reels.md` §6b: Excalidraw (MIT), Mixkit (Free License; **license text itself not read**), theSVG (code MIT;
icons per-icon licenses), checked 2026-10-11. DrawKit and Unsplash facts are in their projects' `BRIEF.md`/scripts.

## Add a row when…

a run ships a video: `| videos/<slug> | <tool + angle> | <format · length> | <audio> | <look> | <route> | <status> | <copy when> |` plus the RUN.md
link (`runs/<date>-<slug>/RUN.md`).
