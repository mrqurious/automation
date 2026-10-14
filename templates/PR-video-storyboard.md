## Video: <Title> reel — storyboard + script (gate B)

Pipeline run `<YYYY-MM-DD>-<slug>` · run log: <link> · RL entry: <RL PR link> (page `resourceslist.com/rec/<slug>` — live? <yes/no>)

### What is in this PR
`videos/<slug>/`: `BRIEF.md`, `frame.md`, `SCRIPT.md` (facts + 3 hooks + script), `STORYBOARD.md`. **No scenes built yet. No voice / TTS. No renders.**

### Summary
Format <A–E> · <length> · 1080×1920 · look: <Clean Caption/…> · audio: silent draft · CTA: <variant> (for <destination>) · hook picked: <1/2/3 — shape>.

| # | Time | Section | On-screen | Scene | Host |
|---|---|---|---|---|---|
| (paste the STORYBOARD.md table, short columns) |

### Facts on screen — all sourced in `SCRIPT.md`
License line: **<name · commercial · attribution · limit>** (source <url>, read <date>, ✔/◐/✖). Price in hook: <none | $x, source <url>>.

### Reply to continue
`approved` = storyboard **and** script, I then build the scenes. Or `changes: scene 3 — <variable> → <absolute target>; leave <x> alone`.
Open questions: <numbered list, each with ★ default>

---
<!-- Added when scenes are built (stage 5) -->
### Scenes built (stage 5)
`npm run check`: <0 errors, N warnings (list)> · snapshots reviewed: <scenes> · scenes used: <list> · screenshots: <source> · placeholders left: <list>

### Render hand-off (your laptop, Git Bash, from `D:\production\videoediting`)
The library junction is not tracked by git, so create it once per checkout.
```bash
git fetch origin && git switch video/<slug>
cmd //c "mklink /J videos\<slug>\assets\library assets"
cd videos/<slug> && npm run check && npm run render && cd ../..
mv videos/<slug>/renders/*.mp4 renders/<slug>-draft.mp4 && rmdir videos/<slug>/renders
```
Watch `renders/<slug>-draft.mp4`, then reply `approved` or `changes: …`. (If `npm run check` wants dependencies: `npm install` in `videos/<slug>/`.)
