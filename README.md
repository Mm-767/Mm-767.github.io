# Field Notes — a Pinterest-style Git blog

Astro + Tailwind CSS static blog. Write Markdown in `/posts`, push to GitHub, and it publishes automatically.

**Why Astro (vs Next.js):** Markdown/MDX is built in, builds are dramatically faster, and pages ship zero JavaScript by default — ideal for a content blog maintained by non-developers.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Writing a post

Two ways:

1. **Editor UI**: visit `/new` (there's also a permanent "Create Post" card on the home grid), fill in the form, click "Download post file" — it generates a correctly-formatted `.md` file. Move it into `/posts` and push. (This is a static site with no server, so the browser can't write the file for you — download-then-commit is the publish step.)
2. **By hand**: create a `.md` file in `/posts` (repo root). Filename becomes the URL slug.

```md
---
title: "My post title"
date: 2026-07-12
tags: ["japan", "coffee"]
thumbnail: "/images/my-photo.jpg"   # or any URL; put files in /public/images
description: "One-line summary shown in search."
draft: false                        # true hides the post
---

Your content in plain Markdown.
```

Commit and push to `main` — the included GitHub Action builds and deploys to GitHub Pages.

## Publishing (one-time setup)

1. Push this folder to a GitHub repository.
2. Repo Settings → Pages → Source: **GitHub Actions**.
3. For a project site (username.github.io/repo-name), set `site` and `base` in `astro.config.mjs`.

## Directory structure

```
posts/                  <- WRITE HERE (Markdown posts)
public/                 <- images, favicon
src/
  consts.ts             <- site title + description
  content.config.ts     <- frontmatter schema
  lib/posts.ts          <- sorting, tags, slugs
  components/           <- Header, MasonryGrid, PinCard, TagBadge
  layouts/BaseLayout.astro
  pages/
    index.astro         <- masonry home
    new.astro            <- editor (create + edit, via ?edit=<slug>)
    posts/[slug].astro   <- post detail: hero, floating ToC, code copy buttons, related posts
    posts/[slug].json.ts <- raw post JSON, used to prefill the editor when editing
    tags/                <- tag index + per-tag pages
    search.astro         <- client-side search
    search.json.ts       <- static search index
tailwind.config.ts      <- design tokens (colors, type, radius)
.github/workflows/      <- auto-deploy to GitHub Pages
```

## Design system notes

- Tokens live in `tailwind.config.ts` under the `pin-*` namespace (pin-red, pin-plum, pin-sand, ...).
- Masonry is CSS columns (`MasonryGrid.astro`): zero-JS, 1 → 2 → 3 → 4 columns responsive.
- Cards: white, 20px radius, no shadow, photography-first.
- Text is plum black `#211922`, never pure black; backgrounds are warm sand.
- Icons: `@lucide/astro` only — no emojis anywhere, per the design system policy.
- "Pin Sans" is proprietary and not bundled; the font stack falls back to system fonts. Substitute your own licensed font in `tailwind.config.ts` if desired.

## Images: uploads on a static site

This site builds fully static and deploys via GitHub Pages Actions — there's no server at runtime. The editor at `/new` behaves like Notion — paste/drop shows a skeleton, then the image is embedded inline automatically since there's nowhere to upload to. Broken image paths (e.g. from an imported `.md`) show a dashed placeholder you can drop a replacement image onto.
