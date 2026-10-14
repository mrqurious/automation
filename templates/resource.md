---
stage: in review
type: Tool
title: <Brand name, ≤ 60 chars>
description: <One sentence, own words, what it is + who it is for, ≤ 160 chars>
url: https://<canonical-home>/
category: Design
pricing: Free
badge: ''
date: <YYYY-MM-DD>
tags:
  - <existing-tag-slug>
  - <existing-tag-slug>
relatedResources: []
similarResources: []
iconLib: '<simple-icons-slug>'
iconUrl: ''
iconSvg: ''
bgColor: '#ffffff'
fillColor: '#<brand-hex>'
remarks: >-
  Added by pipeline run <YYYY-MM-DD>-<slug>. Sources (read <YYYY-MM-DD>): home <url>; pricing <url>; license <url>.
  License line: <name> · commercial: <yes/no> · attribution: <required/not required> · limit: <one limit>.
  Logo: <Simple Icons vX / site SVG from <url>>. Unverified: <list or none>.
---

<Paragraph 1: what it is, who it is for. Own words. Mention license/pricing nuance if it matters (e.g. "open source under MIT, paid extras exist").>

<Paragraph 2 (optional): what it does beyond the pitch, taken from docs/pricing/features pages.>

**Key Features:**

- <concrete capability, found on docs/features pages>
- <concrete capability>
- <concrete capability>
- <optional 4th–6th>

<!--
Rules (delete this comment in the file):
- type / category / pricing / stage must be values from consts.ts (node scripts/rl-index.mjs --enums).
- Icon: ONE route (iconSvg wins over iconUrl over iconLib): iconLib = Simple Icons slug, iconSvg = sanitized site SVG starting with <svg,
  iconUrl = external image. See system/repo-resourceslist.md §6. Remove the lines you do not use (and bgColor/fillColor if no icon).
- relatedResources / similarResources: real slugs only, max 3 each; siblings (…-templates) go in relatedResources.
- Sibling resource for a section (e.g. <slug>-templates): type Template, its own url, own tags, relatedResources: [<slug>].
- No placeholder or lorem text; no copied marketing paragraphs.
-->
