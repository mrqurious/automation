---
name: publish-pack
description: After the render is approved, write the publish copy for one reel — 3 title options, description, hashtags, pinned comment, and captions for YouTube Shorts, Instagram Reels and TikTok — with light SEO and re-verified platform limits, saved as PUBLISH.md. Use for pipeline stage 6, or when the owner asks for title/description/hashtags/caption for a finished short.
---

# publish-pack — stage 6 (ends at gate D)

Read `system/publish-copy.md` (formulas, limits, SEO, checklists) and `system/questions.md` §E. Template: `templates/PUBLISH.md`. Inputs: `RUN.md` (§ Facts, search-intent phrases, CTA variant),
the approved `videos/<slug>/SCRIPT.md` and `STORYBOARD.md` (on-screen words), the final render name.

## Steps

1. **Preconditions.** Gate C passed. RL page live: fetch `https://resourceslist.com/rec/<slug>` (expect 200). Not live → write the pack anyway and flag "link not live: merge the RL PR first".
2. **Re-verify platform limits** with `WebSearch` (standard): title/caption lengths, hashtag counts, link behavior for YouTube Shorts, Instagram Reels, TikTok. Prefer official help pages; the 2026-10-14
   figures in `publish-copy.md` §1 were all third-party and disagreed. Use the conservative value where sources conflict; record the date and sources in the pack.
3. **Ask once (P1–P4, usually defaulted):** platforms, channel handle if unknown, title style, pinned-comment style. `go` accepts ★.
4. **Write `videos/<slug>/PUBLISH.md`** from the template: 3 titles (≤ 60 chars, hook in the first ~40, A recommended) · YouTube description (hook line, RL link, one-sentence what-it-is, the **license line identical
   to the on-screen catch** with its source, CTA, 3 hashtags) · hashtags per platform at the recommended counts · pinned comment · Reels and TikTok captions (no raw URLs; "link in bio") · cover text ·
   alt text · link placement · "could not verify".
5. **Claims check** (`publish-copy.md` §4): every fact traces to RUN.md § Facts with ✔; no price without a dated source; no "free forever"-style promises; brand spellings exact; no affiliate links unless the
   owner said so (then a disclosure line).
6. **Deliver.** Commit `PUBLISH.md` to `video/<slug>` and push; paste the pack into chat as copy-paste blocks; RUN.md § Publish, status `publish-pack-ready`, push the run branch.
7. **Stop.** Reply options: `approved` / `changes: …`. After approval give the posting checklist (`publish-copy.md` §7); do **not** upload. Ask the owner to paste posted URLs and, after ~48 h / ~7 days, the
   numbers for RUN.md § Results.
