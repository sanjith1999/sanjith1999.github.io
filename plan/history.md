# Development log

Newest entries at the top. One entry per working session or completed phase — what changed,
why, and anything a future reader would otherwise have to rediscover.

Format:

```
## YYYY-MM-DD — short title
**Phase:** n — name · **Status:** done | in progress | blocked
What changed, why, and what it means for the next step.
```

---

## 2026-09-20 — Typography: JetBrains Mono
**Phase:** post-launch · **Status:** done

Headings and all interface chrome — nav, site name, section labels, tags, captions,
meta lines, table of contents, code — are now JetBrains Mono, the face Sanjith uses in
kitty (`~/.config/kitty/custom.conf`, `JetBrainsMono Nerd Font Mono`, 13pt).

- **The unpatched font, not the Nerd Font build.** The Nerd patch adds Powerline and
  Devicon glyphs that only a terminal uses, at several megabytes. Google Fonts serves the
  same letterforms at roughly 30 KB per weight.
- **Running prose stays proportional.** Monospace fits ~30% fewer words per line and
  flattens the italic/bold hierarchy, which tells over a 1,500-word write-up.
- **Typeface roles are now tokens** — `--body`, `--heading`, `--ui`. Setting `--body` to
  `var(--mono)` turns the whole site full-terminal in one line, so the decision stays
  cheap to revisit.
- Display sizes came down (`--step-4` 2.9rem → 2.5rem) and tracking tightened, since mono
  runs wide at large sizes.

This is a deliberate exception to the roadmap's "no web fonts unless one is clearly worth
it": one family, one stylesheet request, preconnected, `display=swap`, and the fallback
stack is the system monospace.

---

## 2026-09-20 — Live on GitHub Pages
**Phase:** 5 — Deploy · **Status:** done

The site is live at **https://sanjith1999.github.io**.

### Repository and access

The repo is `sanjith1999/sanjith1999.github.io`, owned by the **sanjith1999** account.
The SSH key on this machine belongs to a *different* account, **sanjith-1021**, which was
added as a collaborator. The first push failed with `Permission ... denied to
sanjith-1021` because the collaborator invitation had not been accepted yet; accepting it
fixed it. Worth remembering: read access worked throughout (the repo is public), only
writes were blocked, so `git ls-remote` succeeding proves nothing about push rights.

Commits are authored as `Sanjith Shanmugathashan <shansanjithofficial@gmail.com>`, not
the global git identity on this machine (a work address).

### Commit convention

From now on commit subjects carry a **`WIP001:`** prefix, until the site reaches a
significant change, at which point the number is bumped rather than dropped.

### Verified on the live site

All eleven published URLs return 200 with the right content types — the four pages, both
projects, the stylesheet, the script, the favicon, an image and the 404. Then, in the
rendered HTML:

- **Maths:** 3 display and 15 inline expressions emitted as `\[ \]` / `\( \)`, with no
  leftover `$$` anywhere. KaTeX's CSS and auto-render are present on the project page and
  **absent from the home page**, which is the conditional loading working as intended.
- **Table of contents:** all five headings extracted with correct ids and clean text,
  including the section containing the C code block that broke the earlier implementation.
- **Code:** one Rouge-highlighted block. **Figures:** caption rendered.
- **Listings:** both projects on `/projects/` and on the home page.
- **Navigation:** `aria-current="page"` lands on the right item per page.

### Not yet verified

Rendered *appearance* — KaTeX output, dark mode, and the mobile breakpoint — has only
been checked in markup, not in a browser. Worth a look on a phone and with the system
theme flipped.

**Next:** replace the `TODO(sanjith)` prose in both project write-ups with the real
numbers and results. After that, Phase 6 items are optional: tag filtering, an RSS feed,
a sitemap, or a `_posts/` blog collection.

---

## 2026-09-20 — Phases 1–4: the site is built
**Phase:** 1–4 · **Status:** done

Built the whole site: config, layouts, includes, stylesheet, pages, and the two migrated
project write-ups. It has never been run through Jekyll locally (see *Verification*), but
every part that could be checked offline has been.

### Deviations from the roadmap, and why

- **About and Contact are separate pages** (`/about/`, `/contact/`) instead of home-page
  sections only. The home page keeps a short version of each and links onward. A brief
  home page fits the minimal direction better than one long scroll. Roadmap inventory
  updated.
- **`assets/js/main.js`, not `nav.js`** — it carries both the nav toggle and the hero
  tagline, so the name should not claim otherwise. Both are enhancements; the pages are
  complete without the file.
- **Two extra includes** not in the original tree: `icon.html` (inline SVG social icons,
  so no icon font or sprite is needed) and `project-card.html` (one listing row, shared
  by the home page and `/projects/`, so the two can never drift apart).

### Decisions worth remembering

- **Maths pipeline.** kramdown is left on its default `math_engine: mathjax`, which turns
  `$$...$$` into `\( \)` and `\[ \]`. KaTeX's auto-render is configured for exactly
  those two delimiters, and deliberately *not* for a single `$`, so prices and shell
  variables in prose are safe. KaTeX loads only on pages with `math: true`.
- **Table of contents in Liquid.** `project.html` splits the rendered content on
  `<h2 id="` rather than requiring a `{:toc}` marker in every Markdown file — one less
  thing to remember when writing.
- **Defaults order in `_config.yml`.** Later defaults win when several scopes match, so
  the site-wide `layout: page` must come *before* the `projects` collection default, or
  every project would render with the wrong layout. Commented in the file.
- **SRI on the KaTeX CDN tags.** Hashes were computed from the actual files, not quoted
  from memory — a wrong hash fails silently and takes all maths with it.

### Verification

Jekyll could not be installed here: `gem install jekyll` fails building the native
`http_parser.rb` extension because the Ruby headers are missing (`sudo apt install
ruby-dev build-essential` fixes it). This is a local convenience only — GitHub Pages
builds the site regardless. What was checked instead, using the kramdown, liquid and
rouge gems that did install:

- `_config.yml`, `_data/social.yml` and every front-matter block parse as YAML.
- Every layout, include and page parses under Liquid in strict mode.
- Both project bodies render through kramdown with GFM input: inline and display maths
  emit the `\( \)` / `\[ \]` KaTeX expects, headings get the auto-generated ids the
  table of contents depends on, and the C block comes out with Rouge token classes.
- The three KaTeX SRI hashes match the files served by jsDelivr.

Two real bugs were caught and fixed this way:

1. `pid-controller.md` had an unquoted `cover_caption` containing `": "`, which is invalid
   YAML and would have failed the build.
2. The table-of-contents Liquid used `split: '">' | last`, which picked up the *last*
   `">` anywhere in a section — so any section containing a code block produced garbage
   heading text. Now indexed with `[1]` instead. Confirmed correct against both projects.

### Content

Images were copied from the old repo (8 for MicroMouse, 1 for PID, plus the profile
photo, 828 KB in total). The write-ups were rebuilt as Markdown rather than exported from
MongoDB, as planned. **Both carry a `TODO(sanjith)` comment at the top:** the structure,
figures, equations and captions are real, but the specific numbers, part choices and
measured results need to come from your own notes — I had the images and filenames, not
the underlying data, and did not want to invent specifics.

**Next:** Phase 5 — create the `sanjith1999.github.io` repository, push, enable Pages, and
check the live build. Nothing has been pushed anywhere yet.

---

## 2026-09-20 — Planning
**Phase:** 0 — Planning · **Status:** done

Read through the existing `../Portfolio` app to decide what the new site needs to carry.
It is Next.js 16 + MUI + MongoDB with JWT auth, an admin area and a custom block editor —
52 source files and a live database in order to publish static text. The content model
(`src/types/project.ts`) is a block array: headings, paragraphs, lists, images, equations,
code, columns. All of it maps cleanly onto Markdown.

Decisions taken:

- **Jekyll**, because GitHub Pages builds it natively — no Actions workflow, no Node
  toolchain, and publishing is `git push`. Plain HTML was rejected as it makes each new
  project a hand-written page; Astro and Hugo were rejected for the extra toolchain.
- **Fresh minimal design**, not a clone of the MUI look. The 12 theme objects and the
  floating theme switcher are dropped entirely in favour of one stylesheet with light and
  dark.
- **`sanjith1999.github.io`** as a user site, so there is no `baseurl` to thread through
  every link.
- **KaTeX, Rouge code highlighting, and captioned figures** are required — the MicroMouse
  and PID write-ups need all three. Tag filtering is deferred, but the `tags` front-matter
  field is written from the start so no migration is needed to add it later.

Wrote `plan/roadmap.md` covering the rationale, principles, stack, design direction, file
layout, six phases, the content-migration plan, and the authoring workflow.

Noted for migration: project images already exist in the old repo at
`Portfolio/public/images/` — `microMouse/` (8 files) and `pid/` (1). Any other project
content lives only in MongoDB and must be copied out before the old site is retired.

**Next:** Phase 1 — `_config.yml`, `Gemfile`, `.gitignore`, `_layouts/default.html` and a
placeholder `index.md`, so the site builds.
