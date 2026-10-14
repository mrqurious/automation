# Video assets (videoediting `assets/`) — reference index

Snapshot **2026-10-14**, counted from the files. The catalogs inside videoediting are authoritative (`system/scenes.md`, `character.md`,
`presets.md`, `audio.md`, `assets/resourceslist/README.md`); this page only says what exists and which catalog to open. One copy of every
file: videos link the library (`videos/<name>/assets/library`), never copy it (`repo-videoediting.md` §4, §6).

| Folder | Count | What | Catalog / how to use |
|---|---|---|---|
| `assets/scenes/` | **21** pre-made 9:16 scenes (HTML) | see below | `system/scenes.md` — copy into the video, edit `data-slot`s, keep the motion |
| `assets/body/` | **21** full bodies, flat | 3 Mr. Curator (`body-1-open-arms`, `body-2-pointing`, `body-3-shrug`) · 9 `gesture-*` · 9 `stock-*` | `system/character.md` (use-when columns), `body-face-map.json` (head slot per body). Stock people: **licence unverified**, avoid in published videos |
| `assets/face/` | **9** face stickers | angry, bored, confused, disgusted, grin-up, happy, neutral, sad, surprised | attach rule in `character.md` §10; never re-cut |
| `assets/preset/` | **20** motion presets as HyperFrames HTML | 3 camera-shake · 4 motion (bounce, free-jumping-character, slide-in-down, slide-up) · 11 transitions (smooth slide ×5, smooth zoom in/out, clockwise 180, clockwise quarter rotation, shake down, shake zoom in) · 2 "ultimate" zoom in/out | `system/presets.md` — scene-to-scene moves |
| `assets/sfx/` | **67** sound effects (Mixkit) | camera, click, crowd, ding, whoosh, pop, impact… (file-name prefix = family) | `system/audio.md`: use-when, volume, hit time, license |
| `assets/music/` | **16** music beds (Mixkit) | calm, corporate, epic, funny, happy, hiphop, inspiring, lofi, tech, upbeat | `system/audio.md` |
| `assets/resourceslist/` | RL kit | `logo/` (mark svg, square mark svg) · `screenshots/` (home + all-resources, mobile and desktop) · brand tokens + site facts in `README.md` | `assets/resourceslist/README.md`; new RL screenshots for a tool are video-specific (`videos/<slug>/assets/site/`) |

## The 21 pre-made scenes (by section)

| Section | Scenes | Notes |
|---|---|---|
| Hooks (≤ 4 s) | `hook-price-shock` · `hook-stop-using` · `hook-license-risk` · `hook-count-audience` | price shock needs a **sourced** price; count-up number is the `COUNT` constant |
| Intros | `intro-logo-lockup` · `intro-found-on` · `intro-tagline-chips` | `intro-found-on` needs an RL tool-page screenshot (960×1650; set `y:-180`) |
| Character intros | `char-intro-approved` · `char-intro-point-up` · `char-intro-thumbs` · `char-intro-you` | Mr. Curator by pose |
| Catch / license | `catch-license-card` · `catch-heads-up` · `catch-pricing-label` | the four-part license line; keep values ≤ ~22 chars |
| Calls to action | `cta-link-in-bio` · `cta-link-in-comment` · `cta-pinned-comment` · `cta-visit-bookmark` | say the same words as the on-screen variant |
| Features | `feature-checklist` · `feature-big-number` | ≤ 4 words per item |
| Alternative | `alt-swap` | format B (paid → free) |

All are 1080×1920 in the "Clean Caption" look: ground `#FBFBFA`, ink `#101012`, blue `#3D63D8`, Inter 700/800 (local woff2 in the video).
ResourcesList brand: mark `#2563eb` in the SVG, UI blue `#3D63D8`; "Resources" ink + "List" blue + ".com" grey.

## Gaps worth knowing

- The character-pop **reference video is unanalyzed** (`LYWKtpwzN_o`, resource-reels §7), so host pop timing is the approved
  second-draft default (≈ 0.2 s entrances, half-figure rising from the bottom edge, host in about half the scenes, never covering the face).
- No voice assets: TTS is generated per video when asked (`repo-videoediting.md` §8).
- New reusable scene/asset ideas found during a run go in RUN.md § Lessons, then a PR in videoediting (new scenes →
  `videos/premade-scenes/scripts/build-scenes.mjs`; new RL assets → `assets/resourceslist/`).
