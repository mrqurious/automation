# Publish copy — title, description, hashtags, pinned comment, captions (stage 6)

Output per video: `videos/<slug>/PUBLISH.md` (template `templates/PUBLISH.md`), pasted into chat for gate D. Goal: copy that sounds
like the reel, front-loads the hook, carries the license line (the ResourcesList difference), and sends people to
**resourceslist.com/rec/<slug>**. Nothing here is uploaded by the agent.

## 1. Platform limits — conservative values, re-verify at stage 6

Checked by web search on **2026-10-14**; every source was a third-party tool/blog, none official, and they **disagree**. So the doc uses the
safe end and stage 6 must re-search (`WebSearch`, standard) and prefer YouTube / Meta / TikTok help pages if found.

| | YouTube Shorts | Instagram Reels | TikTok |
|---|---|---|---|
| Title / first line | title ≤ 100 chars hard; **write ≤ 60**, the hook in the first ~40 (feed tiles truncate there) | no title; caption's first line is the hook (only ~55–125 chars show before "more", sources differ) | no title; first ~80–100 chars show before "more" |
| Caption / description | description ≤ 5,000; first ~3 lines visible | caption ≤ 2,200 | caption ≤ 2,200 (some sources say 4,000 in-app) |
| Hashtags | first 3 in the description show above the title; use **3** (sources range 3–15; "too many may be ignored") | max 30 reported; use **3–5** | no official cap found; use **3–5** |
| Clickable link | yes in description and pinned comment | **no** in caption/comments: "link in bio" | **no** in caption: "link in bio" / profile link |
| Pinned comment | yes | yes (pin from the owner's account) | yes |
| Tags field (YouTube only) | ≤ 500 chars total, minimal ranking weight: a few keywords, not a priority | – | – |

`#shorts` is described as optional by some sources and required by others: include it as one of the 3 YouTube hashtags only if the owner's channel
habit does (question P2).

## 2. The copy formulas (from `videoediting/system/resource-reels.md` §5 and the niche pattern)

- **Title:** a one-tool reel **leads with the hook**, not a count. A list reel uses *number + promise word + object + year*
  ("5 Free [Object] You Should Know (2026)"). Promise words: Free · Useful · Amazing · Better than · Wish You Knew Sooner. Put the tool name and
  "free" within the first 40 characters when it is true. Never claim "free" unless `RUN.md` § Facts says the license/pricing supports it
  (the license line has caveats; keep the caveat in the description).
- **Description (YouTube):** line 1 = the hook restated with the tool name + "free" keyword; line 2 = the link
  (`https://resourceslist.com/rec/<slug>`); then 2–3 lines: what it is, the **license line** (name · commercial use · attribution · one limit), the
  source URL of the license page; then the CTA; then hashtags. Facts only from `SCRIPT.md`.
- **Caption (Reels / TikTok):** hook line → one benefit → the license catch in a short sentence → CTA matching the video's CTA scene
  ("Link in bio") → 3–5 hashtags. No raw URLs (not clickable).
- **Pinned comment:** the tool's link (YouTube) or the RL link, plus one line that adds value: the license catch, or a question that invites replies
  ("Which free [thing] do you use?"). One pinned comment, written to be posted by the owner; matches the CTA variant `cta-pinned-comment`.
- **Hashtags:** 1 brand/niche (`#resourceslist`), 1 tool (`#mixkit`), 1–3 topic (`#freestockfootage`, `#videoediting`, `#freetools`). No unrelated trending
  tags, no banned/spammy ones. Same set across platforms where the limit allows, trimmed to the platform's recommended count.
- **Cover / thumbnail text:** ≤ 4 words from the hook; high contrast; inside the safe area of 9:16.
- **Alt text / accessibility:** one sentence of what the video shows (Instagram alt text field).
- **First comment (Instagram, optional):** extra hashtags go here only if the owner wants a cleaner caption.

## 3. Light SEO (what is worth doing for a 9:16 reel)

1. **Search-intent phrases** gathered in stage 4 (`research-playbook.md` §9.7): "<tool> free", "<tool> commercial use", "free alternative to <paid>". Use one in
   the title, one in the first description line, one as a hashtag. Do not stuff.
2. **Spoken/on-screen words match the metadata** — platforms read captions and on-screen text; the hook line in the video and the title should
   share the key words (the storyboard's on-screen text is the source).
3. **Consistency:** same tool name spelling everywhere (as the brand writes it).
4. **Link hygiene:** one RL link; `https://`; no tracking params; the RL page must be live (gate A merged).
5. **Don't promise what the video does not show**: no "100% free forever", no "no strings".
6. **Disclosure:** if any link is an affiliate link or the tool is sponsored, say so (platform rules + law). Default: no affiliate links.
7. Keep a record of what you shipped in RUN.md § Publish so results can be compared (§6).

## 4. Safety / claims checklist for the copy

☐ every fact in the copy appears in RUN.md § Facts with a ✔ source · ☐ license line identical to the on-screen catch · ☐ no price without a dated source ·
☐ tool/logo names spelled as the brand writes them · ☐ no copyrighted lyrics/quotes · ☐ no medical/financial promises · ☐ link is the RL page (200 OK).

## 5. The publish pack structure

See `templates/PUBLISH.md`. Always include: 3 title options (A recommended), description, hashtags per platform, pinned comment, captions per platform,
cover text, alt text, link placement instructions, posting checklist, "what I could not verify".

## 6. After posting (feeds stage 8)

Ask the owner to paste, after ~48 h and ~7 days: views, average view duration / % viewed, likes, shares, saves, link clicks, follows from the video.
Store them in RUN.md § Results with the posting date/time and which title/hook option was used. Over several runs this shows which hook shapes
and CTA variants work; summarize patterns in `system/lessons.md`.

## 7. Posting checklist (owner does this)

YouTube Studio: upload → title/description from the pack → Shorts ≤ 3 min, 9:16 → visibility → publish → pin the comment. Instagram: Reel → cover →
caption → alt text → share → pin comment. TikTok: upload → caption → cover → settings (comments on, no duet if not wanted) → post → pin comment.
Keep the final MP4 name `renders/<slug>-final.mp4` and note upload URLs in RUN.md.

## 8. Upload automation — later, not built

Ideas to evaluate when the owner asks (check each API's **current** terms and audit requirements first; as of writing the usual caveats are
that unaudited/unverified apps may be limited to private posting and that Instagram needs a professional account and a public video URL):
YouTube Data API `videos.insert` · Instagram Graph API (Reels publishing) · TikTok Content Posting API. Any of these needs OAuth with the
owner's accounts and therefore the owner's explicit go-ahead; never store tokens in these repos (`.env` is gitignored but still not a place for
unrequested secrets). Interim: the pack + checklist above.
