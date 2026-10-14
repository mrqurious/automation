---
name: video-build
description: After the owner approves the storyboard and script, build the reel's scenes in the videoediting repo with HyperFrames from the pre-made scenes (silent draft), run the checks, review snapshots, push to the same PR, and hand off the render steps. Also applies change requests after a render review. Use for pipeline stage 5 and gate C iterations.
---

# video-build — stage 5 (ends at gate C)

Precondition: gate B passed (owner said `approved`). Otherwise stop and ask. Read `system/repo-videoediting.md` (§3–§6), and in videoediting `CLAUDE.md` §5/§11/§12, `system/lessons.md`,
`system/scenes.md`, `system/presets.md`; for host scenes `system/character.md`; for sound only if asked `system/audio.md`. Load the HyperFrames skills the repo says to (`/hyperframes`, `/hyperframes-core`;
`/hyperframes-animation` for custom motion).

## Steps (process.md §5 steps 4–7)

1. **Checkout/resume** branch `video/<slug>`; if `init` was deferred, do it now (docs aside → init → docs back). `mkdir -p assets/fonts assets/site compositions/scenes` **before** the library link.
2. **Library link.** Windows: `cmd //c "mklink /J videos\<slug>\assets\library assets"` from the workspace root. Linux: relative symlink; if checks/snapshots cannot resolve it, copy only the used files (say so).
   Copy `inter-700/800.woff2` from `videos/premade-scenes/assets/fonts/` into `assets/fonts/`. Never commit the link (`.gitignore` covers it).
3. **Screenshots.** RL tool page: live `https://resourceslist.com/rec/<slug>/` if the RL PR is merged and deployed; else the RL dev server of the `resource/<slug>` branch (`bun run dev`, shoot
   `http://localhost:4321/rec/<slug>`, then stop the server). Recipe and crop: `process.md` §5 step 5 (headless Chrome 500 px wide, scale 1.92, crop 960×1650). Tool-site shots: headless Chrome or the
   owner's files; never bypass a bot check. Shots go to `assets/site/` (moved from `capture/`, which is pruned).
4. **Build.** Start from `videos/mixdesign/scripts/build.mjs` (one script = whole video): copy each pre-made scene, fill the slots (throw if a slot is missing), rename ids on reuse, write `index.html`. Custom
   demo/what-it-is scenes follow the `second-draft` pattern. Transitions from `system/presets.md`. Silent: big on-screen words, no caption track unless the storyboard says so. Every storyboard row → one scene.
5. **Check.** `npm run check` after every edit: **zero errors**, review warnings, mark intentional overflow with the allow-overflow attribute (never silence real errors). `npx hyperframes snapshot` and **look**
   at every changed scene (lint passing ≠ right); delete `snapshots/` afterwards. Facts on screen must equal `SCRIPT.md`.
6. **Commit and push** to `video/<slug>` (source files only; no renders, snapshots, capture scratch). Update the PR description with "Scenes built" + the **render hand-off** block from
   `templates/PR-video-storyboard.md`. RUN.md: § Video, status `awaiting-render`; push the run branch.
7. **Stop.** Tell the owner exactly what to run to render and what to reply (`approved` / `changes: scene N — variable → absolute target; leave X alone`).

## Change requests (gate C loop)

Apply one variable per edit with the owner's absolute target; leave everything else; re-check; re-snapshot only changed scenes; push; log each request in RUN.md § Gates. Voice, music purchases, cloud render,
`npm run publish`: only on an explicit new instruction. When the owner approves, set `render-approved` and hand over to `publish-pack`.
