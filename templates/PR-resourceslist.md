## Add resource: <Title>

Pipeline run `<YYYY-MM-DD>-<slug>` · run log: <link to automation run PR / RUN.md>

### What
`src/content/resources/<slug>.md` (+ <siblings> + <new tags>). Stage in this PR: `<in review|ready|published>`.

| Field | Value | Why |
|---|---|---|
| type | | closest sibling: |
| category | | |
| pricing | | pricing page says: |
| tags | | existing / **new** (reason) |
| related | | |
| similar | | |
| badge | | |

### License / terms (from the tool's own pages, read <date>)
**<License name> · commercial: <yes/no> · attribution: <…> · limit: <…>** — source: <url>. Confidence: ✔ / ◐ / ✖. <Anything the owner should decide, e.g. a restriction.>

### Icon
Route: <Simple Icons `slug` + `#hex` | site SVG from <url>, sanitized | iconUrl | none (asked)>. Passed RL's SVG filter: <yes/n.a.>.

### Checks
- [ ] `node scripts/lint-resource.mjs` (automation repo): <result>
- [ ] `bun run check:content`: <result>
- [ ] `bun run check`: <result>
- [ ] `bun run build`: <result>
- CI: <link>

### Preview
`bun install --frozen-lockfile && bun run dev` → http://localhost:4321/rec/<slug> (stop the dev server afterwards: `astro dev stop`, see RL `AGENTS.md`).

### For the owner to decide
- [ ] stage: set to `published` before merging? (merging `published` makes it live; deploy follows your Workers Builds setup)
- [ ] version bump / changelog entry — **not done** here (RULES.md: left for the merge commit)
- [ ] <open questions, unverified claims>

Not touched: any other resource, `consts.ts`, the changelog, `package.json`.
