# Eunomia

Independent bilingual (EN/TR) publication on law, politics and society. Next.js App Router, deployed on Vercel (framework preset: Next.js).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Publishing a piece

Each piece is a folder under `content/essays/` or `content/research/`. The folder name is the URL slug; each language is its own file:

```
content/essays/why-eunomia/en.mdx   →  /essays/why-eunomia
content/essays/why-eunomia/tr.mdx   →  /tr/essays/why-eunomia
```

A piece may exist in one language only. Frontmatter:

```yaml
---
title: "Why Eunomia"
dek: "One-sentence summary shown under the title and in lists."
date: 2026-09-26
author: "The Editors"
tags: ["Public life", "Institutions"]
draft: true   # optional: visible in `npm run dev`, hidden in production
---
```

Body is Markdown/MDX. `## Headings` build the table of contents; footnotes (`text[^1]` … `[^1]: Source`) appear as margin notes on wide screens and as "Sources & notes" at the end.

Extra frontmatter: `topic` (`public-life`, `institutions`, `justice` or `democracy`), `sample: true` for demo pieces (hidden everywhere when `SITE.showSamples` is `false`), and for research `abstract` plus a `findings` list.

Components available inside MDX:

```mdx
The <Term id="dissent">dissenting opinion</Term> …   (definitions live in lib/glossary.ts)

<Timeline>
<Event year="1803" title="Marbury v. Madison">One-line description.</Event>
</Timeline>
```

## Where things live

- `lib/i18n.tsx` — all interface copy in both languages
- `lib/site.ts` — site URL, editor name, public contact email for pitches
- `components/` — page sections; `components/motion/` — smooth scroll, page transitions, cursor and scroll effects (GSAP + Lenis)
- `app/(en)` and `app/(tr)` — two root layouts so each language gets the right `<html lang>`

Motion respects `prefers-reduced-motion`: effects, smooth scrolling, the preloader and page transitions are all disabled for those visitors.
