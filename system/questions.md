# Questions — how you instruct the AI, and how the AI asks you

Two halves. **A** is for you (what to type, how to answer, how to approve). **B–E** is the AI's rulebook for asking: when, how,
and the question banks per stage, each with a recommended default. It extends videoediting `CLAUDE.md` §10 and
`system/PROMPT-GUIDE.md` (copied here) to the whole pipeline. Read together with `pipeline.md`.

---

## A. For you — instructing the AI

### A.1 Start a run (copy, fill what you know, delete the rest)

```
/tool-pipeline <tool name or URL>
mode: full                      # full | resource-only | video-only
angle: <free alternative to X | license explainer | list | just intro>   # optional
alternative to: <paid tool>     # optional; else the AI proposes 2-3 free ones
destination: <shorts | reels | tiktok | all>     # decides the CTA wording
length: <35-45s>                # optional
notes: <anything you saw while researching: a catch, a price, a feature to show>
```

Minimum that works: `/tool-pipeline mixkit.co`. Everything else is asked once, in one batch, or defaulted.
If you are not at a laptop you can still run it from a phone Claude session that has these three repos attached.

### A.2 Answering questions (works from a phone)

The AI sends numbered questions with a ★ recommended answer. Reply in one line:

| You type | Meaning |
|---|---|
| `go` | accept every ★ recommendation |
| `1b 2a 3 go` | pick b for Q1, a for Q2, ★ for Q3, ★ for the rest |
| `3: Canva Templates only` | free-text answer to Q3 |
| `skip 4` | do not do 4 (the AI notes it as left out) |
| `just build it` / `surprise me` | stop asking for the rest of this run; the AI decides and lists every assumption in the report |
| `ask me everything` | the AI stops defaulting and asks even the small ones |

Anything the AI is unsure about but cannot safely default (a license, a price, a logo, a bot-check page) it will always ask,
even after `just build it`.

### A.3 Approving

| Gate | What you review | You reply |
|---|---|---|
| A — RL PR | the resource file, the preview (`bun run dev` → `/rec/<slug>`), CI | merge it, or `changes: …` |
| B — storyboard + script | `STORYBOARD.md`, `SCRIPT.md` in the video PR (script approval is included) | `approved` or `changes: …` |
| C — render | your local draft render | `approved` or `changes: scene 3 …` |
| D — publish pack | `PUBLISH.md` (also pasted in chat) | `approved` or `changes: …` |

Say it in chat or as a PR comment; the AI reads both. `approved` means the whole gate. Partial: `approved except scene 4`.

### A.4 Writing a change request (so it lands first time)

From the HyperFrames prompt guide (videoediting `CLAUDE.md` §10.5):

- **One variable per edit, with an absolute target, and a "leave X alone" clause.** Good: *"scene 3: hook text ends at 2.6 s, leave
  the character pose and the transition alone."* Weak: *"make scene 3 faster."*
- Name the scene (the number from `STORYBOARD.md`) and the element.
- Use motion words the AI maps to values: smooth / snappy / bouncy / dramatic; calm / medium / high energy.
- Facts: *"change the license line to …"* with a source link. The AI never edits a fact from memory.
- "Make it shorter" → give seconds. "Make it bigger" → say 1.5× or a size.

### A.5 Things you can say at any time

`status` (RUN.md summary + what is blocking) · `pause` (finish the step, update RUN.md, stop) · `abandon` (mark the run abandoned,
keep the files) · `redo stage 4` · `why did you …` (the AI answers from RUN.md, it does not change anything — questions are not edits).

---

## B. For the AI — when to ask, when not to

1. **Score before you ask.** Read the owner's message, `RUN.md`, and the repos. Every fact you can read or fetch is not a question.
   Never re-ask what the message, `BRIEF.md`, `frame.md` or an earlier answer already settled.
2. **One batch per gate**, never a drip. ≤ 6 questions (hard max 8). Each: a short stem tied to something you found
   ("Mixkit has Video, Music and SFX pages → one resource or three?"), 2–4 concrete options, the ★ recommended option **first**
   with a one-clause reason, and the default that applies on `go`.
3. **Interactive session with `AskUserQuestion`:** use it for ≤ 4 questions (it takes 1–4). More → numbered text list.
   **Phone / away:** always the numbered text list (`A.2` shape).
4. **Always ask, even after "just build it":** a license you could not read · a price you would put on screen · a logo you could
   not source · a page behind a bot check (never bypass it) · anything that spends money or posts publicly · a tool that looks
   paid-only, abandoned, unsafe or adult · a conflict between what the owner said and what the site says.
5. **Safe defaults you may assume** (state them in one line, do not ask): RL `stage: in review` · `type`/`category`/`tags` from the
   closest existing sibling resources · format A · 35–45 s · 1080×1920 · Clean Caption look · silent draft (no voice) · CTA by destination
   (`process.md` §4) · three hook options, you recommend one.
6. **Never invent:** hex codes, logos, statistics, prices, quotes, license terms, asset paths. Missing → placeholder in brackets +
   a question.
7. **Interpret vague words** instead of asking the owner to learn the vocabulary (`CLAUDE.md` §10.4 table in videoediting).
8. **Honor the opt-outs:** `go`, `just build it`, `surprise me`, `skip N`. After an opt-out list every assumption in the stage report.
9. **Record every answer** in `RUN.md` § Decisions the moment it arrives: question, options, answer, `asked | defaulted`,
   timestamp. That table is how the owner finds out which questions were wasted (stage 8).
10. **A stop ends with the exact continue-reply** ("reply `go` or edit the numbers").

### Message shape (use `templates/QUESTIONS.md`; the example is an illustration, Mixkit is already in RL)

```
Mixkit — I read home, about, license, pricing, video/music/sfx pages. Need 5 answers (reply `go` for ★):
1. One resource or split? ★a) One "Mixkit" (Stock Media) b) Mixkit + "Mixkit Templates" (Template) c) three: video/music/sfx
2. Pricing label — ★a) Free  b) Free + Paid        (everything on site is free; no paid tier found)
3. Category — ★a) Filming  b) Design               (closest sibling Pexels is Photography; Mixkit's focus is video)
4. Tags — ★a) existing: stock-videos, stock-music, stock-sfx, royalty-free  b) + new tag "video-template"
5. Logo — ★a) site SVG (not in Simple Icons)  b) you send one
Also found: license page says <one line>. Concern? (reply `ok` or tell me)
```

---

## C. Question bank — resource stage (Q1)

| # | Ask when | Options (★ first) | Source of the ★ |
|---|---|---|---|
| R1 | the site has distinct sections (templates / marketplace / vectors / music…) | ★ one resource · main + a sibling per section (RL pattern: `canva`+`canva-templates`, `notion`+`notion-templates`, `webflow`+`webflow-templates`) · only the section the owner mentioned | existing siblings in RL; how different the sections are |
| R2 | always | `type` from `resourceTypes` (Tool, Stock Media, Template, Icon Set, Library, …) | closest existing resource of the same kind |
| R3 | always | `category` (9 allowed) | same |
| R4 | pricing is unclear | `Free` / `Free + Paid` / `Freemium` / `Paid` with what the pricing page says | pricing page |
| R5 | always | existing tags (list the 3–5 best) · propose new tag (name + one-line description + why no existing tag fits) | `scripts/rl-index.mjs --enums`; new tag = new `tags/<slug>.json` in the PR |
| R6 | always | `relatedResources` = same ecosystem / sibling sections / what people use with it (max 3) · `similarResources` = alternatives (max 3) · add a back-link on the 1–2 closest existing resources? (default no: it touches published files) | `scripts/rl-index.mjs --related <tags>` |
| R7 | logo is not an exact Simple Icons hit | ★ site's own SVG (`iconSvg`, sanitized) · you send a file/URL · skip (default logo) | `scripts/check-icon.mjs` |
| R8 | always | `stage` in the PR: ★ `in review` · `ready` · `published` · and `badge` (none · New · Deal · Featured) | RL stages; `published` = live on merge |
| R9 | the license / terms look restrictive | continue and say so in `remarks` + body · add a caution line · do not list | the license text |
| R10 | the owner's hint and the site disagree (e.g. "free" but there is a paid tier) | which label to use | pricing page |

Do **not** ask: slug, title casing, description wording, date, file layout, `url`, key-feature bullets — decide and show them in the PR.

## D. Question bank — video stage (Q2)

| # | Ask when | Options (★ first) |
|---|---|---|
| V1 | always | **format**: ★ A single tool · B free alternative (if a paid rival exists) · C mini list · D license explainer · E site tour (`process.md` §2) |
| V2 | always | **length**: ★ 35–45 s · 30 s · up to 60 s |
| V3 | the tool replaces a paid one and the owner gave none | 2–3 real free alternatives from RL first, then the web, one line each · or the owner's own |
| V4 | a price would go in the hook | the price + dated source URL, or drop the price |
| V5 | always | **destination → CTA**: Shorts → ★ pinned comment · Reels/TikTok → link in bio / link in comments · all → bio (`process.md` §4) |
| V6 | always | **hook**: show 3 variants from the hook bank (`resource-reels.md` §4), ★ one |
| V7 | the license/catch is thin or unread | open the page by hand? · use the FAQ wording with a "verify" flag · switch to a pricing catch |
| V8 | always | **audio**: ★ none (silent draft) · music bed (suggest a track from `system/audio.md`) · SFX only · both. Voice is **never** assumed — spending needs your explicit go |
| V9 | the tool's site blocks automation | you send screenshots · skip the screenshot scenes and use text-only scenes |
| V10 | always (often defaulted) | **look**: ★ Clean Caption (`videos/second-draft/frame.md`) · BlockFrame (mixdesign) · pick presets |
| V11 | format C/D | which 2–4 tools (default: the tool + closest RL siblings) |

## E. Question bank — publish stage (Q3) and upload

| # | Ask when | Options (★ first) |
|---|---|---|
| P1 | always | platforms: ★ Shorts + Reels + TikTok · subset |
| P2 | first run only, then remembered | channel / handle names for credits and tags, link-in-bio target |
| P3 | always | title style: ★ hook-led (one-tool reel) · count + promise + year (lists) — three options shown |
| P4 | always | pinned-comment style: ★ link + license line · question to drive comments · both |
| P5 | the RL page is not live yet | wait for the merge · write now and flag "link not live" |
| P6 | upload stage | does the owner want a checklist only (default) or API automation set up later |

## F. Anti-patterns (what the owner should never have to endure)

Five messages of one question each · asking for a hex code that is in `frame.md` · asking "which category?" without a recommendation ·
asking permission for something already authorized in `pipeline.md` §1 · re-asking after the owner said `just build it` for
things that are safely defaultable · asking in a vague way ("any preferences?") · quietly guessing a license.
