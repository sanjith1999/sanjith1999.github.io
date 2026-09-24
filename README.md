# sanjith1999.github.io

Personal site — write-ups, and contract work. Static, built by GitHub Pages from Markdown.

**Live:** https://sanjith1999.github.io

## Adding an idea

One file:

```bash
touch _ideas/my-idea.md
```

```markdown
---
title: My Project
summary: One line that appears in the listing.
date: 2026-09-20
cover: /assets/images/my-project/cover.jpeg
cover_alt: Description for screen readers
cover_caption: Shown under the cover image.
tags: [fpga, dsp]
repo: https://github.com/sanjith1999/my-project
article: https://medium.com/...   # optional: link back to an original post
link: https://example.com        # optional: a live demo
math: true    # only loads KaTeX where it is needed
toc: true     # table of contents built from the ## headings
---

Write the body in Markdown.
```

Put its images in `assets/images/my-project/`, commit, push. GitHub rebuilds the site.
Nothing else needs editing — the home page and `/ideas/` pick it up automatically,
sorted by `date`.

### Figures

```liquid
{% include figure.html src="/assets/images/my-project/plot.png"
                       alt="Measured step response"
                       caption="Step response after tuning."
                       wide=true %}
```

`wide=true` lets the figure break out of the text measure on large screens.

### Maths

KaTeX, loaded only on pages with `math: true` in the front matter.
Use `$$...$$` for both inline and display — inline stays on one line, display goes on its
own lines:

```markdown
The error is $$e(t) = r(t) - y(t)$$.

$$
u(t) = K_p e(t) + K_i \int_0^t e(\tau)\,d\tau
$$
```

A single `$x$` is *not* maths — that is deliberate, so prices and shell variables survive.

### Code

Fenced blocks with a language. Highlighting is done at build time by Rouge; no JavaScript
is involved.

## Layout

```text
_config.yml       site settings
_data/social.yml  footer links, edited in one place
_includes/        head, header, footer, figure, icon, idea-card
_layouts/         default → page | idea
_ideas/           one Markdown file per idea
assets/css/       main.css — the only stylesheet
assets/js/        main.js — nav toggle and hero tagline, both optional
plan/             roadmap.md and history.md
index.html  ideas.html  work.md  about.md  404.html
```

## Local preview (optional)

The site does not need to be built locally — GitHub does it on push. To preview anyway:

```bash
sudo apt install ruby-dev build-essential   # once; needed for native gems
bundle install
bundle exec jekyll serve                    # http://localhost:4000
```

## Design notes

- One stylesheet, custom properties, light and dark via `prefers-color-scheme`.
- No framework, no build step, no database, no analytics.
- JavaScript is enhancement only: every page works without it.
- Decisions and their reasoning are in [`plan/roadmap.md`](plan/roadmap.md); the running
  log is in [`plan/history.md`](plan/history.md).
