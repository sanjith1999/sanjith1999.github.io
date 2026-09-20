# Roadmap — sanjith1999.github.io

A personal portfolio and writing site, rebuilt to be simple enough to maintain alone.

Status: live at https://sanjith1999.github.io — Phases 0–5 done. Phase 6 is optional.
Last updated: 2026-09-20

---

## 1. Why rebuild

The existing site (`../Portfolio`) is a Next.js 16 + MUI + MongoDB application: 52 source
files, a database, JWT cookie auth, an admin area, and a custom block editor — all of it in
service of publishing text and images. Every change means running a dev server, and the site
cannot render without a live MongoDB connection.

The content is static. It should be served statically.

### What we are deliberately dropping

| Dropped | Replaced by |
| --- | --- |
| MongoDB + Mongoose models | Markdown files in the repo |
| JWT auth, login/signup/users pages | GitHub account access to the repo |
| Admin area + block editor | A text editor |
| 12 MUI theme objects | One CSS file, light + dark |
| Next.js, React, Zustand, framer-motion, axios | Jekyll (server-side, at push time) |
| `/api/*` route handlers | None needed |

### What we keep

- The content itself: About, the project write-ups (MicroMouse, PID, …), contact links.
- The section structure: intro → about → work → contact.
- Rich project pages: headings, prose, figures with captions, equations, code.

---

## 2. Principles

1. **Adding a project is adding one Markdown file.** If it ever takes more than that, the
   design is wrong.
2. **No build step on this machine.** GitHub Pages builds Jekyll on push. Local preview is
   optional, never required.
3. **No runtime dependencies.** No database, no API, no auth. The site is files.
4. **Plain CSS, one stylesheet.** No framework, no preprocessor, no utility classes.
5. **Content and presentation stay separate.** Markdown holds words; layouts hold structure;
   one stylesheet holds looks.
6. **Readable at 320px and on paper.** Mobile-first, semantic HTML.

---

## 3. Stack

- **Generator:** Jekyll (GitHub Pages native — no Actions workflow, no Node toolchain).
- **Content:** Markdown with YAML front matter.
- **Styling:** one hand-written CSS file with custom properties, light + dark via
  `prefers-color-scheme`.
- **Math:** KaTeX, loaded from CDN only on pages whose front matter sets `math: true`.
- **Code:** Rouge, Jekyll's built-in highlighter. Server-side, zero JS.
- **JavaScript:** only for the mobile nav toggle and the hero tagline. Everything works
  without it.

---

## 4. Design direction

A fresh, minimal, typographic design — not a clone of the old MUI look.

- **Layout:** single centred column, ~68ch measure for prose, wider for figures.
- **Type:** one serif or humanist sans for body at ~18px/1.7; system stack fallback.
  Generous whitespace does the work that borders and shadows did before.
- **Colour:** near-monochrome — ink on off-white, inverted for dark mode — plus a single
  accent used only for links and the active nav item. Defined once as CSS custom properties
  on `:root`, redefined under `prefers-color-scheme: dark`.
- **Chrome:** minimal. No cards with drop shadows; the project list is a typographic list
  with title, one-line summary, and date. No theme switcher.
- **Motion:** none beyond the hero tagline, and that respects
  `prefers-reduced-motion: reduce`.

---

## 5. Site structure

```text
GitBlog/
├── _config.yml              # site metadata, collections, build settings
├── Gemfile                  # github-pages gem (local preview only)
├── .gitignore
├── README.md                # how to add a project
├── plan/
│   ├── roadmap.md           # this file
│   └── history.md           # development log
├── _layouts/
│   ├── default.html         # <head>, header, footer, skip link
│   ├── page.html            # static pages
│   └── project.html         # project write-up + generated table of contents
├── _includes/
│   ├── head.html            # meta, Open Graph, conditional KaTeX
│   ├── header.html          # site nav
│   ├── footer.html          # copyright + social links
│   ├── icon.html            # inline SVG icons
│   ├── figure.html          # image + caption, used from Markdown
│   └── project-card.html    # one row of a project listing
├── _projects/               # a collection — one .md per project
│   ├── micromouse.md
│   └── pid-controller.md
├── _data/
│   └── social.yml           # links, edited in one place
├── assets/
│   ├── favicon.svg
│   ├── css/main.css         # the only stylesheet
│   ├── js/main.js           # nav toggle + hero tagline, both optional
│   └── images/
│       ├── profile.jpeg
│       ├── micromouse/…     # one folder per project
│       └── pid-controller/…
├── index.html               # home: intro, about, recent work, contact
├── projects.html            # full project listing
├── about.md
├── contact.md
└── 404.html
```

### Page inventory

| URL | Source | Contents |
| --- | --- | --- |
| `/` | `index.html` | Intro + tagline, short About, three most recent projects, contact |
| `/projects/` | `projects.html` | Every project, newest first |
| `/projects/<slug>/` | `_projects/<slug>.md` | Full write-up |
| `/about/` | `about.md` | The longer version |
| `/contact/` | `contact.md` | How to reach me |
| `/404.html` | `404.html` | Not-found page |

About and Contact became their own pages rather than home-page sections only: the home
page keeps short versions of both, and the nav points at the full pages. A short home
page suits the minimal direction better than one long scroll.

### Project front matter

Every file in `_projects/` carries the same shape:

```yaml
---
title: MicroMouse
summary: An autonomous maze-solving robot — hardware, control, and navigation.
date: 2024-03-18
cover: /assets/images/micromouse/mouse.jpeg
tags: [robotics, embedded, control]
repo: https://github.com/sanjith1999/micromouse
math: true          # loads KaTeX on this page only
toc: true           # renders a table of contents from the h2s
---
```

`tags` are recorded from day one and displayed on the project page, but filtering the
listing by tag is deferred (see Phase 6) — writing the field now costs nothing and avoids a
migration later.

---

## 6. Phases

Each phase ends with something viewable. Log every completed phase in `history.md`.

### Phase 0 — Planning ✅
Read the existing app, choose the stack, write this roadmap and `history.md`.

### Phase 1 — Skeleton that builds ✅
`_config.yml`, `Gemfile`, `.gitignore`, `default.html`, a placeholder `index.md`.
**Done when:** `bundle exec jekyll serve` renders an unstyled home page locally.

### Phase 2 — Design system ✅
`assets/css/main.css`: custom properties, type scale, spacing scale, light/dark, base
element styles, the layout container. Header and footer includes.
**Done when:** the home page looks finished at 320px, 768px and 1280px, in both colour
schemes.

### Phase 3 — Home page ✅
Intro with tagline, About prose, contact block, social links from `_data/social.yml`.
Content carried over from the old site, re-edited rather than copy-pasted.
**Done when:** `/` is complete and needs no placeholder text.

### Phase 4 — Projects ✅
The `_projects` collection, `project.html` layout, `projects.md` listing, the recent-three
list on the home page, the `figure.html` include, KaTeX wiring, Rouge styling.
**Done when:** MicroMouse and PID are migrated from the old site, with their images, and
read well on a phone.

### Phase 5 — Deploy ✅
Create the `sanjith1999.github.io` repo, push, enable Pages, verify the live build. Add
`README.md` documenting the one-file-per-project workflow.
**Done when:** the site is live at `https://sanjith1999.github.io` and a new commit
redeploys it.

### Phase 6 — Later, only if wanted ← next
Tag filtering on the listing · RSS feed · sitemap and richer SEO tags · a `_posts/` blog
collection alongside projects · custom domain · an "uses/now" page.

---

## 7. Content migration

Source projects live in `../Portfolio` as MongoDB documents; their images are already in
the repo at `Portfolio/public/images/`.

- **Images** copy directly into `assets/images/<project>/`.
- **Text** is re-typed as Markdown rather than exported. The old block JSON carries editor
  artefacts (`&nbsp;`, zero-width characters, `ql-editor` wrappers) that are not worth
  untangling, and the write-ups deserve an edit pass anyway.
- Two projects are known to have image sets: `microMouse/` (8 images) and `pid/` (1).
  Anything else still only in the database must be copied out of the running app before the
  old site is retired.

**The old Portfolio repo stays untouched** until the new site is live and the content has
been confirmed migrated.

---

## 8. Authoring workflow, once live

1. Create `_projects/my-thing.md`, fill in the front matter, write the Markdown.
2. Drop figures in `assets/images/my-thing/`.
3. Commit and push.

GitHub builds and deploys. No server, no login, no editor.

---

## 9. Constraints and standards

- **Accessibility:** semantic landmarks, a skip link, visible focus rings, alt text on every
  image, AA contrast in both schemes, full keyboard navigation.
- **Performance:** no web fonts unless one is clearly worth it; KaTeX only where declared;
  images resized before committing (target < 300 KB each).
- **Browser support:** current Chrome, Firefox, Safari and Edge. No polyfills.
- **No analytics or third-party trackers.**
