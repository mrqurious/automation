# runs/

One folder per pipeline run: `runs/<YYYY-MM-DD>-<slug>/RUN.md` (template: `../templates/RUN.md`).

`RUN.md` is the record of what actually happened to one video: the owner's message, every question and answer, the sources read, the facts and their
confidence, the RL entry, the storyboard decisions, each gate's change requests, the publish copy, results after posting, and the retro. It is also the
resume point for a paused session (`status` in its frontmatter). Read a few of them before changing the process: the retro sections show which questions
were wasted and which rules were missing.

Rules: never delete a run; correct it with a dated note. No secrets, no tokens, no private account data. The status board PR is `run/<slug>`; merge it
after the retro.
