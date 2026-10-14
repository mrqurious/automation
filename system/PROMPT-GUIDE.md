<!-- Copied verbatim from videoediting/system/PROMPT-GUIDE.md on 2026-10-14 so this repo has its own reference. The videoediting copy is the source: re-copy when it changes. How the pipeline uses it: system/questions.md section B. -->

# HyperFrames Prompt Guide — compiled reference

Source: https://hyperframes.heygen.com/prompting (all 30 pages: overview, Levels 1–7, appendix) plus `/workflows`.
Compiled 2026-10-02. Used by `CLAUDE.md` §10 to (a) coach the user's prompt, (b) ask for missing details, (c) suggest
upgrades. If this conflicts with a loaded skill (`/hyperframes`, `/hyperframes-core`…), the skill wins on mechanics;
this file wins on *what to ask and suggest*.

---

## 1. Prompt shapes

- **Cold start** — describe from scratch: duration, aspect, mood/style, key elements.
- **Warm start** — give source material (URL, doc, CSV, transcript, PR, footage) and let the agent synthesize.
  Warm starts give richer, more grounded videos (real copy instead of invented copy). **Prefer suggesting a warm start
  when the user has any source material.**
- Interview before building: route → workflow must-haves → two meta-questions (**storyboard yes/no**,
  **automation vs companion**). Everything confirmed goes to `BRIEF.md`. User can skip with
  "just build it — don't ask me anything".
- Always route with a slash command (`/hyperframes` at minimum). Don't over-specify resolution/fps: defaults are
  1920×1080 @ 30fps.

## 2. Anatomy of a one-shot prompt (six parts)

| # | Part | Rule |
|---|------|------|
| 1 | **Route** | slash command that loads the workflow |
| 2 | **Spec** | duration + resolution up front |
| 3 | **Beats** | timestamped sections: `Beat 1 (0-4s): …` |
| 4 | **Copy** | exact on-screen text **in quotes**, `/` for line breaks (unquoted text gets paraphrased) |
| 5 | **Technique** | named registry blocks/components to adapt |
| 6 | **Negatives** | specific exclusions ("no narration, no image or media files"; "no audio at all" for silence) |

**Beat formula (five slots):** element · motion · layout · style · timing.
Rewrite rules: never "holds motionless" → "settles into gentle ambient idle (breathing scale, slow drift)";
beats must cover the full duration; resolve same-timestamp collisions ("fades out fully by 4.2s; at 4.2s READY stamps in");
write "counts up to $4.2M" not "from $0".

**Specification dial:** mood words ("warm minimal logo sting") → style tokens (hex, named textures, type directions)
→ full visual spec (every element's shape/color/position/timing). More density = less drift, never a worse result.
Always pin: 3D ("Three.js via the adapter") and sequencing overlaps.

**High-fidelity spec fields:** dimensions/duration, layers back→front, element positions, exact-second timing, hex+opacity,
typography, easing, motion curves, audio present/absent. Density contract per frame: one focal element at display scale,
≥2 supporting on staggered cues, persistent chrome, asymmetric ~60/40 composition, display type ≈ 1/10 frame width,
3 depth layers. Specs can't carry organic illustration, painterly texture or photo/live-action (supply files instead).

## 3. Per-workflow checklist — what the prompt must contain

| Workflow | Must be known (ask if missing) |
|---|---|
| `/product-launch-video` | source (URL / pasted script / brand name) · duration (`~45s`) · aspect/destination · structure (hook → N feature beats → CTA end card) · voice gender + tone (or none) · BGM type + dB ceiling (or none) · **if no URL:** brand hex colors + logo path · tour vs sales-pitch |
| `/faceless-explainer` | source text/topic · `~` duration · aspect · angle (concept / how-to / listicle / story) · audience level · takeaway · "one idea per scene" · palette hex + ground/accent · voice · captions style · script verbatim vs restructure |
| `/pr-to-video` | PR URL / `owner/repo#N` / "this PR" · `~` duration · angle (changelog / feature-reveal / fix / refactor) · code block type (`code-diff` / `code-morph` / `code-typing`) · max hunks (2–4) · audience · narration (TTS vs silent kinetic captions) · end card (version + repo URL) |
| `/embedded-captions` | source clip path · identity (`anchor`, editorial, cream, loud, neon, ink, ordnance, terminal, stomp, neonsign…) · aspect · embed policy (one peak word per beat) · single speaker? (split multi-speaker first) |
| `/talking-head-recut` | source clip path · canvas (16:9 / 9:16 / 4:5) · style · layout (split / stack / PiP / overlay) · which cards (title, lower-third, data callout, pull-quote) and their copy · footage stays untouched |
| `/music-to-video` | duration · resolution · audio source (file / video / mood brief to generate) · section in musical language ("verse into the hook", never timestamps) · assets (photos/clips or none) · cut density/triggers (per bar, on downbeats, phrase changes) · end card · "No TTS" |
| `/slideshow` | slide count · claim-style headlines · fragment reveals · hotspot/branching · speaker notes · live present (`hyperframes present`) vs exported video (→ `/music-to-video`). Confirm the deck route if not asked explicitly |
| `/motion-graphics` | duration (≤ ~10s, max ~30s) · resolution · beats with seconds · exact text/numbers · registry blocks · motion adjectives · output (MP4 vs transparent WebM) · palette. Asks ≤1 question |
| `/general-video` | longer / multi-scene / mixed inputs · design system · journey/arc · camera behavior · copy · technique · variables · voice + negatives |
| `/remotion-to-hyperframes` | exact `.tsx` path · duration/fps/dimensions · `TRANSLATION_NOTES.md` · SSIM diff. Only for real ports |
| `/figma` | Figma link · tokens first, then components |

**Routing by input:** URL/brief → product launch · notes/article/topic → faceless explainer · talking-head clip →
captions or recut · PR link → pr-to-video · single message/number/quote/logo → motion graphics · music + photos →
music-to-video · outline/deck → slideshow · mixed/unclear → general-video · Remotion source → port.

**Duration rule:** whenever narration or a script drives length, say `~45-second` (never hard `45s`); ~130 words/min
(30s ≈ 65–70 words). Hard times only for silent / beat-synced pieces.

## 4. Vocabulary that changes output

- **Motion feel → easing:** smooth=power2.out · snappy=power4.out · bouncy=back.out · springy=elastic.out ·
  dramatic=expo.out · dreamy=sine.inOut. Timing: fast 0.2s, medium 0.4s (professional), slow 0.6s (luxury), very slow 1–2s (cinematic).
- **Camera:** slow push-in (4–8% scale) · pull back · pan · drone orbit (Three.js) · crane up/down · whip to · parallax.
- **Depth:** near-lens bokeh · 2–3 depth planes · out-of-focus background · shallow DOF. Occlusion beats blur.
- **Pacing:** punchy cuts (1.5–4s/idea) · cinematic holds (with ambient idle) · beat-synced · breathing room.
- **Caption tone:** Hype (heavy, scale-pop, 72–96px) · Corporate (clean sans, fade+slide, 56–72) · Tutorial (mono, typewriter,
  48–64) · Storytelling (serif, slow fade, 44–56) · Social (rounded, bounce, 56–80).
- **Transition energy:** Calm (blur crossfade / cross-warp) · Medium (push / whip-pan) · High (zoom-through / glitch / ridged-burn).
- **Audio-reactive:** bass→scale, treble→glow, amplitude→opacity, mids→shape (text 3–6%, backgrounds 10–30%).
- **Marker highlights:** highlight · circle · burst · scribble · sketchout.
- **Render quality words:** draft · standard (default) · high/final.

## 5. Premium motion (Level 3) — rules to suggest

1. Nothing fully stops (1–2% breathing, slow drift) — frozen final frames = "cheap motion" tell.
2. Camera is an actor — one continuous move beats cuts.
3. Overlapping action — stagger offsets shorter than the animation; stagger what's *happening*, not what's present.
4. Compound properties only when they tell one story (slide-up + fade = arriving). Ease out for entrances, in for exits, in-out for moves.
5. Overshoot transforms, **never data values**.
6. Depth planes at different rates; one blurred foreground element that actually crosses content.
7. Match pacing to genre.
8. Seeded randomness only (mulberry32); two-frame holds on frame index.
- Avoid the "slideshow problem": scenes independent + uniform energy. Fix with something crossing each boundary + varied energy
  (one **spectacle beat** per video, one designated breather) + dwell-and-sweep camera (rest 1.5–2.5s while the world keeps ticking).
- Every motion must answer "what does this movement mean?"; four decorative moves lose to one motivated move.

**Transitions:** shader (WebGL: `cross-warp-morph`, `thermal-distortion`, `whip-pan`, `cinematic-zoom`, `ridged-burn`,
`glitch`, `chromatic-radial-split`, `light-leak`, `gravitational-lens`, `ripple-waves`, `swirl-vortex`, `flash-through-white`,
`sdf-iris`) for hero moments; CSS (`transitions-blur/dissolve/push/cover/scale/destruction/light/mechanical/grid/distortion/3d/radial`)
for the routine 60–70%. One primary + 1–2 accents; durations calm 0.5–0.8s / medium 0.3–0.5 / high 0.15–0.3.
Never "fade out then fade in", never a different transition at every seam, never invented names.

## 6. Level 4 capabilities (name the block, don't describe the effect)

- **Code:** `code-typing` 5s · `code-diff` 6s · `code-highlight` 5s · `code-scroll` 6s · `code-morph` 7s ·
  `code-3d-extrude` 8s · `code-shader-dissolve` 7s · `code-particle-assemble` 8s. Quote code literally in fenced blocks;
  typing needs a terminal hold ("holds on the blinking cursor"); name the highlight line; name the theme (monokai, visual studio dark, apple terminal homebrew, ocean).
- **Data:** `data-chart` (inline/CSV) or "hand-draw, no chart library" (say who overtakes whom, when). `apple-money-count`
  for odometer count-ups (fixed digit columns; say the target format). Maps: `us-map` (choropleth) · `us-map-bubble` ·
  `us-map-flow` (arcs) · `us-map-hex` · `spain-map` · `world-map` · `nyc-paris-flight` (journey). Name the *encoding*.
  Never fabricate data; no live fetches — count to a fixed value or a render-time variable.
- **Overlays:** lower thirds — `lt-clean-bar`, `lt-soft-pill`, `lt-bold-block`, `lt-color-block`, `lt-accent-underline`,
  `lt-kicker-name`, `lt-mask-reveal`, `lt-side-rule`, `lt-dark-card` (busy footage), `lt-stack-bars`, `lower-third-bild`,
  `news-ticker`. Social: `x-post`, `reddit-post`, `spotify-card`, `macos-notification`, `instagram-follow`, `tiktok-follow`,
  `yt-lower-third`. Need: start time + duration, quoted copy, "on a track above the footage", accent hex, transparent WebM if for an NLE. No `linkedin-post`; no live scraping.
- **Captions (composed videos, not MP4 talking heads):** hype `caption-kinetic-slam/highlight/particle-burst/emoji-pop` ·
  clean `caption-clip-wipe/weight-shift` · editorial `caption-editorial-emphasis/gradient-fill` · neon `caption-neon-glow/neon-accent` ·
  tech `caption-glitch-rgb/matrix-decode` · karaoke `caption-pill-karaoke` · textured `caption-texture/texture-mask-text` ·
  3D `caption-parallax-layers`; plus `caption-blend-difference`, `morph-text`. One style per section; emphasize keywords only.
- **Generated artwork:** code for UI/type/geometry/charts/pixel/3D; image generation for characters, painterly or sculptural hero art.
  Hybrid: generate static layer, animate movers in code. Solid magenta background → `ffmpeg colorkey` (not AI bg removal) for flat art; add "minimal, lots of negative space". Account/cost → ask first.
- **Color grading** (pipeline order fixed: adjust→wheels→curves→hueCurves→secondaries→lut→details→effects): source must contain what the effect removes
  (hue-key needs a distinct hue, two-ink needs tonal range, kuwahara needs edges). VHS ≠ CRT ≠ camcorder — don't stack. Pixelate=redaction, dither=display failure, bloom=sensor overwhelm.
- **VFX / liquid glass:** `vfx-iphone-device` (describe device **and** screen content), `ios26-liquid-glass`, `macos-tahoe-liquid-glass`,
  `liquid-glass-notification`, `liquid-glass-widgets`, `vfx-shatter`, `vfx-portal`, `vfx-magnetic`, `vfx-liquid-background`, `vfx-text-cursor`;
  polish: `grain-overlay`, `vignette`, `shimmer-sweep`, `parallax-zoom`, `parallax-unzoom`, `grid-pixelate-wipe`. Canvas blocks need a Chrome flag
  in Studio preview (render is unaffected). Name the exact simulation, not "make it explode".
- **Runtimes:** GSAP default (don't name it). Three.js "via the adapter" for real depth/lighting/camera orbit (not CSS 3D). Lottie only for supplied
  `.json/.lottie` files. Shader transitions for 2–3 deliberate handoffs. Determinism: no wall clock, no network, no unseeded random.

## 7. Voice and sound (Level 5)

- **TTS:** specify gender + tone + pace ("warm, unhurried female"). Provider order: HeyGen Starfish → ElevenLabs → local Kokoro
  (product demo `af_heart`/`af_nova`, tutorial `am_adam`/`bf_emma`, marketing `af_sky`/`am_michael`). Gemini TTS needs credentials.
  **Ask before using any account/credentialed provider.** (Workspace rule: never local whisper — see CLAUDE.md §7.)
- **Music:** always mood **+ loudness** ("subtle, ducked ~12 dB under the voice"). **SFX:** cue to moments ("whoosh on each transition", "soft click at 0:04").
- Voiceover is the timing master; visuals land on spoken cues; narration never waits for visuals.
- "No narration" ≠ silence; say **"no audio at all"** for true silence.
- Supplied files: explicit paths (`assets/logo.svg`, not "my logo"). `remove-background` model is people-only — flag non-human subjects.
- **Mixing:** describe symptoms ("narration sounds muffled", "hum under the interview"), not filters. Carve music against voice (don't duck the whole track),
  check loudness before EQ, group narration clips, use envelopes for fades. No true de-esser / noise reducer / match-EQ. Judge with an audio-only render.

## 8. Scale (Level 6)

- **Design system:** supply a source of truth — `frame.md`, assets by path (prefer SVG logo), site URL (avoid SPA homepages; try blog/press/docs),
  or Figma (tokens first). Pin palette + type, delegate framing. Don't say "premium / on-brand". Series: shared `frame.md`, vary only headline/stat.
  Web-scale details (1px borders, 0.06 shadows) vanish at H.264 — scale for video.
- **Variables & templating:** declare upfront with types (string, number[min/max/step/unit], color, boolean, enum, font, image-URL).
  Batch: "one video per CSV row → `renders/{name}.mp4`", `--strict-variables`. Not variable: dimensions, total duration, fps, format. Verify by rendering twice and diffing.
- **Storyboards:** fix message, arc, audience, mood once; a direction block (two-color discipline, VO-paced reveals, one breather, banned clichés);
  per-frame type/persuasion/beat/focal/roles; plant a **callback motif** early and pay it off later. Produces `STORYBOARD.md` + `storyboard.html`.
- **Editing existing videos:** one change per render, absolute values ("intro duration = 3s; leave its animation alone"), name the element, quote text,
  path for swaps, freeze clauses. Verb→attribute: move=`data-start`, restack=`data-track-index`+z-index, trim=`data-duration`, media offset=`data-media-start`, volume=`data-volume`.
- **Iterating:** one variable per edit; absolute targets (not "2x finer"); build minimal then layer one element type at a time; strip then re-layer when stuck;
  lint/check pass ≠ good — watch the render.
- **Recreating a reference:** transcribe motion (duration, camera path, element timings, overlaps, blur layers, sampled hex) → ~75% first render →
  iterate with absolute targets → distill values into a clean prompt (80–90%). Last ~10% is the text-only ceiling.
- **Rendering:** draft → standard (default, visually lossless 1080p) → high/final only on a locked cut. MP4 default. Transparent only for overlays
  (MOV ProRes 4444 for NLEs, WebM VP9 for browsers, PNG sequence for compositing). 4K = ~4× time, 3–5× size, only if the surface needs it; 60fps rarely;
  HDR = MP4 only, not with 4K, not on Lambda. Cloud (Lambda / HeyGen Cloud / Cloud Run) only for long/4K/batch — needs credentials → ask first.
- **Remotion port:** only with real source; exact path; keep duration/fps/dimensions; `TRANSLATION_NOTES.md`; SSIM diff; never "approximate" state-driven (`useState`) or UI-kit code.

## 9. Capstone lessons (Level 7)

Long `/general-video` prompts succeed on **connective tissue**: (1) design system from `frame.md`; (2) a *cinematography contract* — one continuous camera,
dwell-and-sweep (1.5–2.5s), "arrive, don't cut", "no slideshow tells"; (3) persistent spine elements that carry across regions; (4) region-by-region journey with seconds;
(5) quoted copy; (6) named techniques; (7) variables for re-skinning (`ground`, `ink`); (8) voice + negatives. Builds without an explicit camera contract failed even when technically correct.

## 10. Rules & anti-patterns (appendix)

Technical: register every timeline on `window.__timelines`; footage-with-sound keeps `data-has-audio="true"` unmuted, music/VO on `<audio>`;
no `Math.random()`; build timelines synchronously (no async/fetch); timed elements need `class="clip"` + `data-start`/`data-duration`/`data-track-index`;
entrance animation for every scene; transitions between scenes; `gsap.set` for hidden state, explicit `opacity: 1` in `fromTo`; no CSS `translate(-50%,-50%)` on GSAP-moved elements;
no multi-value CSS `stroke-dasharray` on animated SVG.

Prompting anti-patterns → fixes:
| Don't | Do |
|---|---|
| React/Vue components | composition HTML |
| over-specify resolution/fps | defaults 1920×1080 @ 30fps |
| skip `/hyperframes` | always route via slash command |
| paste raw error logs | run `npm run check` first |
| assume asset paths | explicit paths |
| override a workflow's designed look | let the preset carry it, or go freeform |
| hard-timed verbatim scripts | `~60-second` |
| "make it on-brand / premium" | hex codes, `frame.md`, assets by path |
| "add some transitions" / "add a voice" / "add music" | name energy + primary transition / tone+pace / mood + dB |
| relative edits ("shorter", "2x finer") | absolute values |
| many changes per round | one variable per edit |
| render high/4K before reviewing | draft → approve → final |
