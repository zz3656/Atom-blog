<div align="center">

# ⚙️ Atom

**A modern blog built with Astro** — Powerful like Atom, reliable like steel.

> Inspired by Atom, the box-off robot from *Real Steel* — compact, precise, full of power.

[![Astro](https://img.shields.io/badge/Astro-4.x-ff5d01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[🏠 Live Demo](https://zz3656.github.io/Atom) · [📝 Write Posts](#-write-posts) · [🚀 Deploy](#-deploy-to-github-pages) · [🇨🇳 中文版](README.md) · [📘 Dev Guide](DEVELOP.md)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⚡ **Astro-Powered** | Zero JavaScript output, pure HTML, blazing fast |
| 🌑 **Cyberpunk Theme** | Dark futuristic UI, neon glow, grid background |
| 📱 **Responsive** | Perfect on mobile, tablet, and desktop |
| 🎯 **Base Path Fix** | Supports GitHub Pages subpath deployment |
| 📝 **Markdown Writing** | Native support with code syntax highlighting |
| 🏷️ **Tag System** | Automatic tag display on article cards |
| 🚀 **GitHub Actions** | Automatic build and deploy on push |
| 🔍 **SEO Friendly** | Semantic HTML, Open Graph / Twitter Card / JSON-LD Structured Data, Sitemap, RSS Feed (📡 in nav bar and footer) |
| 📦 **Tiny Size** | ~3KB HTML per page |
| 💯 **Lighthouse 100** | Performance, Accessibility, SEO all perfect |

## 📸 Preview

### Homepage

- Hero section with Atom-style tech design
- Card-grid article layout
- Dark / light mode toggle

### Article Page

- Elegant typography for reading
- GitHub Dark code block highlighting
- Tags, dates, update timestamps

## 📁 Project Structure

```
Atom/
├── .github_disabled/            # GitHub Actions config (rename to .github/)
│   └── deploy.yml               # Auto-deploy workflow
├── public/
│   ├── favicon.svg              # Browser favicon
│   ├── logos/                   # Navbar logo files (.svg / .png / .webp)
│   └── robots.txt               # Search engine crawling rules
├── scripts/
│   └── generate-rss.mjs         # Post-build RSS + Sitemap generator
├── src/
│   ├── components/
│   │   ├── Header.astro         # Navbar + dark mode toggle
│   │   ├── Footer.astro         # Footer with social links
│   │   ├── PostCard.astro       # Article card component
│   │   └── FormattedDate.astro  # Date formatter
│   ├── content/
│   │   ├── config.ts            # Content schema (type-safe)
│   │   └── blog/                # 📝 Markdown blog posts live here
│   │       ├── hello-world.md
│   │       ├── astro-blog-tutorial.md
│   │       └── markdown-guide.md
│   ├── layouts/
│   │   ├── BaseLayout.astro     # Base layout (head + nav + footer)
│   │   └── BlogPost.astro       # Article detail layout
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   ├── about.astro          # About page
│   │   ├── 404.astro            # 404 page
│   │   └── blog/
│   │       ├── index.astro      # Article listing
│   │       └── [...slug].astro  # Article detail (dynamic route)
│   ├── styles/
│   │   └── global.css           # Global styles + dark mode variables
│   └── consts.ts                # Site config (title, author, links)
├── astro.config.mjs             # Astro configuration
├── package.json
├── tsconfig.json
├── README.md                    # This file (Chinese)
├── README_EN.md                 # This file (English)
└── DEVELOP.md                   # Developer guide
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.3
- npm >= 9.6

### 1. Clone the Project

```bash
git clone https://github.com/zz3656/Atom.git
cd Atom-blog
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
heroImage: /images/cover.jpg   # Optional
updatedDate: 2026-09-14        # Optional
reward: true                   # Optional: show reward QR codes
---

Body content using Markdown syntax. Supports:

- **Code blocks** (with syntax highlighting)
- Tables
- Blockquotes
- Task lists
- Images, links, etc.
```

### Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Post title |
| `description` | string | ✅ | Short description for article cards |
| `pubDate` | date | ✅ | Publication date |
| `tags` | string[] | ❌ | Tag list |
| `heroImage` | string | ❌ | Cover image path |
| `updatedDate` | date | ❌ | Last updated date |
| `reward` | boolean | ❌ | Show reward QR codes at post end (default: off) |

## 🐙 Deploy to GitHub Pages

### Auto Deploy (Recommended)

GitHub Actions configuration is included. Just:

1. **Push** to your own GitHub repository
2. Rename `.github_disabled/` to `.github/`:
   ```bash
   mv .github_disabled .github
   git add . && git commit -m "enable github actions" && git push
   ```
3. Go to **Settings → Pages → Source → select GitHub Actions**
4. Push code to `main` branch ✅

> 💡 `.github_disabled/` exists because token permissions prevent pushing workflow files. Rename manually to enable.

Actions will automatically: `Install deps → Build → Deploy`

### Custom Domain (Optional)

1. Create a `CNAME` file in `public/` with your domain
2. Add a CNAME record in your DNS provider pointing to `yourusername.github.io`

## ⚙️ Customize

### Site Info, Logo & Favicon

**All customization in a single file** — edit `src/consts.ts`:

```typescript
export const SITE_TITLE = 'Your Blog Name';     // Site title (SEO, OG, RSS, footer)
export const SITE_NAME = 'MyBlog';               // Name shown in navbar
export const SITE_DESCRIPTION = 'Your blog description';
export const AUTHOR = 'Your Name';

export const SITE_LOGO = '/logos/logo.svg';      // Navbar logo file path
export const SITE_FAVICON = '/favicon.svg';      // Browser favicon file path

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  twitter: '',
  email: '',
};
```

> 💡 **Logo and Favicon are independent**:
> 1. **Logo** (navbar): put in `public/logos/logo.svg` (supports .svg / .png / .webp), update `SITE_LOGO`
> 2. **Favicon** (browser tab): put in `public/favicon.svg`, update `SITE_FAVICON`
> No need to touch any component code!

### Deploy URL

Edit `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://yourusername.github.io',  // Your GitHub Pages URL
  base: '/Atom',                            // Repo name ('/' for root site)
});
```

### Theme Colors

Edit CSS variables in `src/styles/global.css`:

```css
:root {
  --accent: #6366f1;        /* Primary color */
  --accent-hover: #4f46e5;  /* Hover color */
  --radius: 12px;           /* Border radius */
  --font-sans: 'Inter', ...; /* Font family */
}
```

Dark mode colors are in `html.dark { ... }`.

### Adding Pages

Create new `.astro` files in `src/pages/` for automatic routing:

```
src/pages/about.astro      → /about
src/pages/links.astro      → /links
src/pages/blog/index.astro → /blog
```

## 🔧 Tech Stack

- **[Astro](https://astro.build)** — Static site generator
- **TypeScript** — Type safety
- **CSS Variables** — Theming system (no extra dependencies)
- **GitHub Actions** — CI/CD
- **GitHub Pages** — Hosting

## 📊 Comparison with Other Static Blog Solutions

| Solution | Output Size | JS Deps | Build Time | SEO / RSS / Sitemap | Learning Curve |
|----------|-------------|---------|------------|-----------|----------------|
| **Atom (This)** | **~3 KB** | **0** | **~1s** | **RSS/Sitemap/JSON-LD auto-generated, RSS in footer** | Minimal |
| Hexo + Matery | ~15 MB | Dozens of libs | ~5s | Needs plugin | Medium |
| Hugo | ~2 MB | 0 | ~0.5s | Needs plugin | Medium (Hugo syntax) |
| Jekyll | ~3 MB | Minimal | ~3s | Built-in | Medium (Ruby) |
| Eleventy | ~500 KB | 0 | ~2s | Needs plugin | Medium (Node) |
| VitePress | ~2 MB | Hydration | ~2s | Needs plugin | Low (docs-focused) |

### Advantages

- **Zero dependencies** — No JavaScript, pure HTML + CSS, Lighthouse 100
- **Auto SEO metadata — each post auto-injects Open Graph, Twitter Cards, JSON-LD structured data (BlogPosting Schema)
- **Minimal builds** — RSS / Sitemap generated post-build with zero config
- **1-second build** — Fast compared to Hexo's 5s+
- **TypeScript safety** — Content validated via Astro Content Collections Schema
- **Centered navbar** — Logo left, nav links centered, actions right
- **Dark mode** — CSS variable based, auto-remembers user preference

### Limitations

- **No backend** — Comments need third-party (Disqus, Cusdis)
- **No search** — Static sites can't do server-side search (use Algolia)
- **No live updates** — All data generated at build time
- **Manual editing** — No admin panel (edit via GitHub)

## 📄 License

[MIT](LICENSE) — Free to use, modify, and distribute.

---

<div align="center">

**If this project helps you, please give it a ⭐ Star!**

Made with ⚙️ by [ceasar](https://github.com/zz3656) · Powered by [Astro](https://astro.build)

</div>
