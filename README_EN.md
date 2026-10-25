<div align="center">

  <svg width="72" height="72" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="margin-bottom:1rem">
<defs><radialGradient id="logoDisc" cx="34%" cy="26%" r="84%">
        <stop offset="0%" stop-color="#454f59"/>
        <stop offset="55%" stop-color="#252c33"/>
        <stop offset="100%" stop-color="#14181c"/>
      </radialGradient><linearGradient id="logoBrass" x1="10%" x2="90%" y1="4%" y2="98%">
        <stop offset="0%" stop-color="#f7d488"/>
        <stop offset="50%" stop-color="#e2a93a"/>
        <stop offset="100%" stop-color="#a66b11"/>
      </linearGradient></defs>
      <path fill="url(#logoDisc)" fill-rule="evenodd" d="M14.36.75h3.28l2.53.5 2.27.76 3.27 2.01 2.27 2.27 1.51 2.27 1.76 5.55-.25 5.31-.76 2.52-2.26 3.77-4.04 3.53-2 1-3.77 1.01h-4.31l-1.19-.5h-1.09l-1.52-.51-3.52-2.01-2.77-2.77-1.01-1.52-1.26-2.77-.75-3.28.25-5.31 1.01-3.02 2.01-3.27 2.27-2.27 2.27-1.51 3.27-1.26 2.5-.5zM15.64 14l-1.37 1.04-.27.82.26 1.08.85.81 1.83-.01L18 16.42l-.52-1.88-.81-.54z"/>
      <path fill="url(#logoBrass)" fill-rule="evenodd" d="m15.61 5.5 1.08.01 1.29 1.03 1.08 2.7 2.05-.49h1.81l1.04.52.54.84-.26 2.83-1.99 2.92 1.99 3.2.25 2.63-1.03 1.29-.79.27-3.63-.48-.81 2.44-1.56 1.29-1.36-.01-1.54-1.28-.83-2.45-3.36.49-1.04-.27-1.04-1.34.51-3.08 1.74-2.42-2-3.47-.25-2.31.51-1.05 1.35-.56 3.58.49 1.33-2.95 1.31-.79zM9.64 9.75l-1.12.79-.02.88 1.01 2.27 1.1 1.31 1.63-1.31.51-3.11-1.83-.83zM21.39 17l-1.63 1.56-.26 3.08 2.08.61 1.38-.27.53-.54.01-1.08-.77-1.82L21.42 17zm.5-7.25-2.39.86.26 2.83 1.6 1.56 1.62-2.04.52-1.32-.02-1.1-.54-.53-1.02-.26zM10.64 17l-1.13 1.31-1.01 2.27.27 1.13 1.06.54h.84l1.83-.83-.26-2.86L10.67 17zm5.25 4.25L14 22.36l.51 1.83 1.1 1.31.83-.01.54-.53L18 22.89l-.29-.87-1.79-.77zm.25-14.75-1.37 1.04L14 9.36l.29.62 1.54.77L18 9.89l-.76-2.33-1.07-1.06zm2.25 13-1.14.86.04.37 1.07.52.39-1.36-.33-.39zM13.64 11l-.28 1.75 1.39-1.08-.04-.4-1.04-.27zm4.5 0-.89.61.86.64.39-.11v-1.06l-.33-.08zm-4.5 8.75L13.58 21l1.17-.36-1.08-.89z"/>
      <path fill="url(#logoBrass)" fill-rule="evenodd" d="m15.86 13.25 1.85.52.79 1.31-.26 2.36-1.57 1.06-2.11-.26-1.06-1.32.27-2.38 1.02-1.02 1.04-.27zm.28-1-1.85 1.02-1.02 1.02-.27.82.26 2.83 2.35 1.81 1.08-.26 1.77-1.26.54-1.09-.26-3.08-2.57-1.81z"/>
  </svg>

# ⚙️ Atom

**A modern blog built with Astro** — Powerful like Atom, reliable like steel.

> Inspired by Atom, the box-off robot from _Real Steel_ — compact, precise, full of power.

[![Astro](https://img.shields.io/badge/Astro-7.4-ff5d01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[🏠 Live Demo](https://zz3656.github.io/Atom) · [📝 Write Posts](#-write-posts) · [🚀 Deploy](#-deploy-to-github-pages) · [🇨🇳 中文版](README.md) · [📘 Dev Guide](DEVELOP.md)

</div>

---

## ✨ Features

| Feature                 | Description                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ⚡ **Astro-Powered**    | Static HTML + ~8.7KB minified interaction script (defer-loaded, no first-paint blocking), blazing fast             |
| 🎨 **Theme System**     | Default theme (cold steel + brass indicator) with one-click light/dark toggle; CSS Token system for custom themes    |
| 📱 **Responsive**       | Perfect on mobile / tablet / desktop, iOS safe-area support                                                      |
| 📝 **Markdown Writing** | Native support with Shiki code syntax highlighting                                                                |
| 🤖 **CLI Tools**        | `npm run new` / `npm run list` / `npm run theme:create <id>` — create articles, generate themes                  |
| 📁 **Category + Tags**  | Categories (one per article) + tags (multiple per article)                                                        |
| 🚀 **Dual Deploy**      | GitHub Actions auto-build, supports GitHub Pages / Cloudflare Pages                                              |
| 🔍 **SEO Friendly**     | Semantic HTML, Open Graph / Twitter Card / JSON-LD, canonical URL, Sitemap, RSS                                |
| 📦 **Tiny Size**        | Homepage HTML ~14KB gzipped (CSS inline, no extra request); single post ~18KB gzipped                            |
| 💯 **Lighthouse-Ready** | Built-in semantics for 100/100 scores: canonical, OG/Twitter, JSON-LD, sitemap, RSS, a11y skip-link              |
| 🎚️ **Token Design System** | 12 semantic surface tokens drive every color; components hardcode zero colors, third-party themes plug in with zero config |
| 📐 **Ruler Visual Language** | Tick-marked rules run through the site; every log entry is a tick on a vertical ruler spine                        |

## 📸 Preview

### Homepage

- Asymmetric hero: eyebrow label → display title → ruler rule → summary → CTAs, with a live telemetry column (posts / categories / tags / latest entry, all computed from real content)
- Article list rendered as log rows on a vertical ruler spine — index, title, date, category, tags
- Dark / light mode toggle (dual-position SVG switch)

### Article Page

- Editorial masthead: category chip → date → reading time → title → ruler rule → summary
- Brass drop cap on the opening paragraph
- GitHub Dark code block highlighting + one-click copy
- Table of contents, tags, prev/next navigation

## 📁 Project Structure

```
Atom/
├── .github/                     # GitHub config (CI + deploy already enabled)
│   ├── dependabot.yml           # Dependency update bot
│   └── workflows/
│       ├── test.yml             # CI: lint → test → build
│       └── deploy.yml           # GitHub Pages / Cloudflare Pages deploy
├── astro-plugins/               # Build-time remark / rehype plugins
│   ├── theme-loader.mjs         # Scans src/themes/, generates the CSS entry
│   ├── remark-img-lazy.mjs      # Auto-add loading="lazy" to Markdown images
│   └── rehype-table-scroll.mjs  # Wraps wide tables in a scroll container
├── public/                      # Static assets (copied verbatim to dist/)
│   ├── favicon.svg              # Browser tab icon
│   ├── manifest.json            # PWA config
│   ├── robots.txt               # Search engine crawling rules
│   ├── opensearch.xml           # Browser search plugin
│   ├── logos/logo.svg           # Navbar logo
│   ├── js/app.js                # Minified interaction script (generated at build)
│   ├── _assets/search-index.json # Search index (generated at build)
│   └── medias/reward/           # Reward QR codes (optional)
├── scripts/                     # Build helpers & CLIs
│   ├── atom-cli.mjs             # Local CLI (npm run new / npm run list)
│   ├── create-theme.mjs         # Theme scaffold (npm run theme:create <id>)
│   ├── generate-rss.mjs         # RSS feed + search index
│   ├── fix-sitemap.mjs          # Sitemap lastmod fix
│   ├── minify-app-js.mjs        # app.js minify + sub-path compatibility
│   ├── vectorize-icon.mjs       # Raster → vector (brand icon pipeline)
│   └── convert-hexo.mjs         # Hexo migration tool (optional)
├── src/
│   ├── themes/                  # Theme directory (default: atom-default)
│   │   └── atom-default/        # Built-in theme: light.css + dark.css + manifest.json
│   ├── components/              # Astro components
│   │   ├── Header.astro         # Navbar + light/dark toggle
│   │   ├── Footer.astro         # Footer + social links + version badge
│   │   ├── PostCard.astro       # Log row (index / title / date / category / tags)
│   │   ├── TableOfContents.astro # TOC (left ruler rail ≥1280px / collapsible bar below)
│   │   ├── HeroIcon.astro       # Homepage hero icon
│   │   └── FormattedDate.astro  # Date formatter
│   ├── layouts/                 # Layout templates
│   │   ├── BaseLayout.astro     # Base layout (head, nav, footer, inline theme script)
│   │   └── BlogPost.astro       # Article layout (TOC, prev/next, reward, JSON-LD)
│   ├── pages/                   # Route pages
│   │   ├── index.astro          # / → Homepage
│   │   ├── about.astro          # /about
│   │   ├── 404.astro            # /404
│   │   ├── blog/                # Article list & detail
│   │   ├── categories/          # Category index
│   │   ├── category/            # Category detail
│   │   ├── tags/                # Tag index
│   │   └── tag/                 # Tag detail
│   ├── content/                 # 📝 Markdown articles
│   │   └── blog/                # One .md per article
│   ├── styles/                  # Style modules
│   │   ├── global.css           # Main entry (@imports every module)
│   │   └── _modules/            # 21 CSS modules (layout / type / ruler)
│   ├── scripts/app.js           # Interaction script source (minified at build)
│   ├── utils/                   # Utilities (path / date / blog / themes / collection / markdown-strip)
│   ├── generated/               # Build-generated theme entry (do not edit by hand)
│   ├── consts.ts                # Site config (SITE_TITLE / REPO_URL / HERO_* etc.)
│   ├── content.config.ts        # Content collection schema (type-safe)
│   └── env.d.ts
├── tests/                       # Unit tests (Vitest)
├── docs/THEMING.md              # Theme authoring guide
├── astro.config.mjs             # Astro config (base auto-detect + unified markdown pipeline)
├── vitest.config.ts             # Test config
├── eslint.config.js             # ESLint config
├── package.json
├── tsconfig.json
├── AGENTS.md                    # Agent-facing project definition
├── CHANGELOG.md                 # Changelog
├── DEVELOP.md                   # Developer guide
├── README.md                    # This file (Chinese)
└── README_EN.md                 # This file (English)
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 22.23.4 (hard requirement of Astro 7.4; 24 LTS recommended)
- npm >= 10.8

### 1. Clone the Project

```bash
git clone https://github.com/zz3656/Atom.git
cd Atom
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Local Development

```bash
npm run dev
```

Open **http://localhost:4321**. Hot reload on file changes.

### 4. Build & Preview

```bash
npm run build    # Build to dist/
npm run preview  # Preview built site locally
```

## 📝 Write Posts

Create a `.md` file in `src/content/blog/`:

```markdown
---
title: Your Post Title
description: A short description shown on article cards
pubDate: 2026-09-13
tags: [tag1, tag2]
heroImage: /images/cover.jpg # Optional
updatedDate: 2026-09-14 # Optional
reward: true # Optional: show reward QR codes
---

Body content using Markdown syntax. Supports:

- **Code blocks** (with syntax highlighting)
- Tables
- Blockquotes
- Task lists
- Images, links, etc.
```

### Frontmatter Fields

| Field          | Type     | Required | Description                                                   |
| -------------- | -------- | -------- | ------------------------------------------------------------- |
| `title`        | string   | ✅       | Post title                                                    |
| `description`  | string   | ✅       | Short description for article cards                           |
| `pubDate`      | date     | ✅       | Publication date                                              |
| `category`     | string   | ❌       | Category (one per article)                                    |
| `tags`         | string[] | ❌       | Tag list                                                      |
| `heroImage`    | string   | ❌       | Cover image path (placed under `public/`)                     |
| `featuredImage`| string   | ❌       | SEO-only cover (OG / Twitter Card), takes precedence over `heroImage`. 1200×630 recommended |
| `updatedDate`  | date     | ❌       | Last updated date (also used as the sitemap `lastmod`)        |
| `reward`       | boolean  | ❌       | Show reward QR codes at post end (default: off)               |
| `draft`        | boolean  | ❌       | Draft marker — excluded from list, RSS and the search index   |

## 🐙 Deploy to GitHub Pages

### Auto Deploy (Recommended)

GitHub Actions is already configured. Just:

1. **Push** to your own GitHub repository
2. Go to **Settings → Pages → Source → select GitHub Actions**
3. Go to **Settings → Actions → General → Workflow permissions → Read and write**
4. Push code to `main` branch ✅

> 💡 **Sub-path repositories**: if the repo is named `my-blog`, it deploys to `https://username.github.io/my-blog/`.

> 💡 **Cloudflare Pages**: set `DEPLOY_TARGET=cf` in Secrets, plus `CF_PAGES_TOKEN`, `CF_ACCOUNT_ID` and `CF_PROJECT_NAME`.

Actions will automatically: `Install deps → Build → Deploy`

CI is separate from deployment — `.github/workflows/test.yml` runs `lint → test → build` on every push and pull request.

### Custom Domain (Optional)

1. Create a `CNAME` file in `public/` with your domain
2. Add a CNAME record in your DNS provider pointing to `yourusername.github.io`

## ⚙️ Customize

### Site Info, Logo & Favicon / Homepage Hero

**All customization in a single file** — edit `src/consts.ts`:

```typescript
export const SITE_TITLE = 'Your Blog Name'; // Site title (SEO, OG, RSS, footer)
export const SITE_NAME = 'MyBlog'; // Name shown in navbar
export const SITE_DESCRIPTION = 'Your blog description';
export const AUTHOR = 'Your Name';

export const SITE_LOGO = '/logos/logo.svg'; // Navbar logo file path
export const SITE_FAVICON = '/favicon.svg'; // Browser favicon file path

// Homepage Hero section (icon + title + description + buttons) is fully customizable
export const SITE_HERO_ICON = ''; // Empty -> use built-in Atom SVG
export const HERO_TITLE = 'MyBlog'; // Hero headline (HTML allowed, e.g. <em>)
export const HERO_DESCRIPTION = 'A modern, lightweight blog built with Astro.';
export const HERO_ACTIONS = [
  { label: 'Start reading →', href: '/blog', variant: 'primary' },
  { label: 'About', href: '/about', variant: 'secondary' },
];

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  twitter: '',
  email: '',
};
```

> 💡 **Logo, Favicon, and Hero icon are independent**:
>
> 1. **Logo** (navbar): put in `public/logos/logo.svg` (supports .svg / .png / .webp), update `SITE_LOGO`
> 2. **Favicon** (browser tab): put in `public/favicon.svg`, update `SITE_FAVICON`
> 3. **Hero icon** (in front of the homepage headline): leave `SITE_HERO_ICON` empty to use the built-in Atom SVG, or drop your own at `public/heroes/hero.svg` (supports .svg / .png / .webp)
> 4. **Hero text / buttons**: edit `HERO_TITLE` / `HERO_DESCRIPTION` / `HERO_ACTIONS` directly. Buttons can be added/removed freely; `variant: 'primary' | 'secondary'` controls style, `hide: true` skips rendering
>    No need to touch any component code!

### Deploy URL

Edit `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://yourusername.github.io', // Your GitHub Pages URL
  base: '/Atom', // Repo name ('/' for root site)
});
```

### Theme Colors

The default theme is **cold-rolled steel + a brass indicator lamp** — a galvanized-gray surface by day, gunmetal by night, with brass as the single accent. Edit the variables in `src/themes/atom-default/light.css` and `dark.css`:

```css
html[data-theme='atom-default'][data-mode='light'] {
  --bg-primary: #ecedef;       /* Page background */
  --bg-card: #ffffff;          /* Card surface */
  --text-primary: #171a1d;     /* Body text */
  --accent: #8a5407;           /* Accent (links, buttons, ticks) */
  --accent-secondary: #1c6b85; /* Secondary (categories) */
}
```

> ⚠️ Components only read **semantic surface tokens** (`--on-accent`, `--header-bg`, `--panel-bg`, `--code-bg`, `--rule-tick`, `--focus-ring`, …). Never hardcode a color in component CSS — that is what breaks third-party themes. The full contract lives in **[docs/THEMING.md](./docs/THEMING.md)**.

Build your own theme with the scaffold — it emits every required token:

```bash
npm run theme:create ocean             # light + dark
npm run theme:create ocean --no-dark   # single mode
```

Drop the folder into `src/themes/<id>/` and it is picked up at build time. Zero config.

### Adding Pages

Create new `.astro` files in `src/pages/` for automatic routing:

```
src/pages/about.astro      → /about
src/pages/links.astro      → /links
src/pages/blog/index.astro → /blog
```

## 🔧 Tech Stack

- **[Astro](https://astro.build) 7.4** — Static site generator
- **TypeScript 6** — Type safety
- **CSS Variables** — Theming system (no extra dependencies)
- **Archivo + JetBrains Mono** — Archivo for display/body (variable, `wdth` axis), JetBrains Mono for data only
- **Shiki** — Syntax highlighting, dual light/dark themes
- **GitHub Actions** — CI/CD
- **GitHub Pages** — Hosting

## 📊 Comparison with Other Static Blog Solutions

| Solution        | Output Size | JS Deps        | Build Time | SEO / RSS / Sitemap                                   | Learning Curve       |
| --------------- | ----------- | -------------- | ---------- | ----------------------------------------------------- | -------------------- |
| **Atom (This)** | **~14 KB gz** | **8.7KB vanilla** | **~1s** | **RSS/Sitemap/JSON-LD auto-generated, RSS in footer** | Minimal              |
| Hexo + Matery   | ~15 MB      | Dozens of libs | ~5s        | Needs plugin                                          | Medium               |
| Hugo            | ~2 MB       | 0              | ~0.5s      | Needs plugin                                          | Medium (Hugo syntax) |
| Jekyll          | ~3 MB       | Minimal        | ~3s        | Built-in                                              | Medium (Ruby)        |
| Eleventy        | ~500 KB     | 0              | ~2s        | Needs plugin                                          | Medium (Node)        |
| VitePress       | ~2 MB       | Hydration      | ~2s        | Needs plugin                                          | Low (docs-focused)   |

### Advantages

- **Zero third-party dependencies** — No frontend framework; the only JavaScript is ~8.7KB of vanilla code for search, the theme toggle and the TOC. Lighthouse 100
- **Auto SEO metadata** — each post auto-injects Open Graph, Twitter Cards, JSON-LD structured data (BlogPosting Schema)
- **Minimal builds** — RSS / Sitemap generated post-build with zero config
- **1-second build** — Fast compared to Hexo's 5s+
- **TypeScript safety** — Content validated via Astro Content Collections Schema
- **Token-driven design system** — 12 semantic surface tokens; components contain zero hardcoded colors
- **Ruler visual language** — Tick-marked rules run through the site; the log list sits on a vertical ruler spine
- **Built-in client search** — Static index generated post-build, ~8.7KB of interaction JS in total
- **Zero horizontal overflow** — Verified from 320px up; wide tables scroll inside their own container
- **Centered navbar** — Logo left, nav links centered, actions right
- **Dark mode** — CSS variable based, auto-remembers user preference

### Limitations

- **No backend** — Comments need third-party (Disqus, Cusdis)
- **Client-side search only** — The index is built at compile time; no server-side ranking
- **No live updates** — All data generated at build time
- **Manual editing** — No admin panel (edit via GitHub)

## 📄 License

[MIT](LICENSE) — Free to use, modify, and distribute.

---

<div align="center">

**If this project helps you, please give it a ⭐ Star!**

Made with ⚙️ by [ceasar](https://github.com/zz3656) · Powered by [Astro](https://astro.build)

</div>
