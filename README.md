<div align="center">

  <svg width="72" height="72" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="margin-bottom:1rem">
    <circle cx="16" cy="16" r="14" fill="#6366f1"/>
    <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="#e0e7ff" stroke-width="1.5" transform="rotate(30 16 16)"/>
    <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="#e0e7ff" stroke-width=1.5" transform="rotate(-30 16 16)"/>
    <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="#e0e7ff" stroke-width="1.5" transform="rotate(90 16 16)"/>
    <circle cx="16" cy="16" r="2.5" fill="#fff"/>
  </svg>

# Atom

**A lightweight, zero-dependency static blog built with Astro** — compact, precise, full of power.

Inspired by Atom, the boxing robot from *Real Steel*.

[![Astro](https://img.shields.io/badge/Astro-4.x-ff5d01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[🌐 Live Demo](https://zz3656.github.io/Atom-blog) · [🇬🇧 English](README_EN.md) · [📘 Developer Guide](DEVELOP.md) · [🔄 Hexo Migration](scripts/README.md)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⚡ **Astro 4.x** | Zero JS output by default, Content Collections with type safety |
| 🎨 **Dual Themes** | Light mode + Cyberpunk dark mode, toggled with one click, auto-persisted |
| 📱 **Responsive** | Perfect on mobile, tablet, and desktop |
| 📝 **Markdown** | Native writing experience with Shiki syntax highlighting |
| 🤖 **CLI Tool** | `atom new` / `atom list` / `atom build` — create, list, and deploy locally |
| 📁 **Categories & Tags** | Independent organization system |
| 🚀 **Auto Deploy** | GitHub Actions builds and deploys on every push to `main` |
| 🔍 **SEO Ready** | Open Graph, Twitter Cards, JSON-LD, Sitemap, RSS — all automatic |
| 📦 **Tiny** | ~3 KB HTML per page |
| 💯 **Lighthouse 100** | Performance, Accessibility, Best Practices, SEO |

---

## 🖼️ Preview

### Homepage

- Hero section with Atom atom-icon (purple gradient orbital spheres)
- Card grid layout showing title, description, date, category, tags
- Day/night mode toggle

### Article Page

- Centered gradient title → description → date → category → tags
- Reading progress bar
- GitHub Dark syntax highlighting for code blocks
- Previous / Next article navigation

### Categories & Tags

- 📁 **Category page**: Compact card grid with name, article count
- 📁 **Category detail**: List view of articles in a category
- 🏷️ **Tag page**: Compact card grid with name, article count
- 🏷️ **Tag detail**: List view of articles with a tag
- All content centered with unified header style

---

## 📁 Project Structure

```
Atom/
├── scripts/
│   ├── atom-cli.mjs           # 🤖 CLI local build tool
│   ├── convert-hexo.mjs       # Hexo → Atom converter
│   ├── generate-rss.mjs       # RSS + Sitemap generator
│   └── README.md              # Script documentation
├── public/
│   ├── favicon.svg            # Site favicon
│   ├── robots.txt             # Crawler rules
│   └── medias/reward/         # Reward QR codes (optional)
├── src/
│   ├── components/            # Astro components
│   │   ├── Header.astro       # Navbar + theme toggle
│   │   ├── Footer.astro       # Footer + social links
│   │   ├── PostCard.astro     # Article card
│   │   └── FormattedDate.astro # Date formatter
│   ├── content/
│   │   ├── config.ts          # Content schema
│   │   └── blog/              # 📝 Markdown articles
│   ├── layouts/
│   │   ├── BaseLayout.astro   # Global layout (head, nav, footer)
│   │   └── BlogPost.astro     # Article layout (prev/next, reward)
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── about.astro        # About page
│   │   ├── 404.astro          # 404 page
│   │   ├── blog/
│   │   │   ├── index.astro    # Article listing
│   │   │   └── [...slug].astro # Article detail
│   │   ├── categories/
│   │   │   └── index.astro    # Category listing
│   │   ├── category/
│   │   │   └── [...category].astro # Category detail
│   │   ├── tags/
│   │   │   └── index.astro    # Tag listing
│   │   └── tag/
│   │       └── [...tag].astro # Tag detail
│   ├── styles/
│   │   └── global.css         # Global styles + CSS variables
│   ├── consts.ts              # Site configuration
│   └── env.d.ts               # TypeScript declarations
├── astro.config.mjs           # Astro config
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.3
- npm >= 9.6

### 1. Clone & Install

```bash
git clone https://github.com/zz3656/Atom.git
cd Atom
npm install
```

### 2. Local Development

```bash
npm run dev
```

Open **http://localhost:4321**

### 3. Build

```bash
npm run build    # Build to dist/
npm run preview  # Preview locally
```

---

## 🤖 CLI — Local Build Tool

Atom provides a command-line tool for a local workflow similar to Hexo / Hugo.

### Setup

Place `Atom-blog` (the deployment repo) as a sibling of `Atom` (the source repo):

```
parent/
├── Atom/              ← Source repo (where you run CLI)
│   ├── scripts/
│   │   └── atom-cli.mjs
│   └── src/
└── Atom-blog/         ← Deployment repo (generates dist/)
```

### Commands

```
node scripts/atom-cli.mjs --help
```

| Command | Description |
|---------|-------------|
| `new <title>` | Create article (interactive frontmatter prompt) |
| `new <title> -c <cat>` | Set category |
| `new <title> -t <tag1,tag2>` | Set tags |
| `new <title> -d YYYY-MM-DD` | Set publish date |
| `new <title> -i /images/cover.jpg` | Set hero image |
| `new <title> --draft` | Create as draft |
| `list` | List all articles |
| `build` | Sync → Build → Push to Atom-blog |

### Interactive Mode

```bash
$ node scripts/atom-cli.mjs new "My First Post"
📝 文章标题: （auto-filled from argument）
📁 分类（回车跳过）: 技术笔记
🏷️ 标签（逗号分隔，回车跳过）: Astro,Blog
📄 描述（回车自动生成）:
🖼️ 封面图路径（回车跳过）:

✅ 文章已创建
   📂 src/content/blog/my-first-post.md
   📝 My First Post
   📅 2026-09-15
   📁 技术笔记
   🏷️ Astro, Blog
```

### Non-Interactive (CI / Scripts)

```bash
# One-liner creation
node scripts/atom-cli.mjs new "Astro 101" \
  -c "技术教程" \
  -t "Astro,教程" \
  -d 2026-09-15

# Build and deploy
node scripts/atom-cli.mjs build
```

The `build` command automatically:
1. Syncs all `src/` files to `Atom-blog/`
2. Runs `npx astro build` in `Atom-blog/`
3. Commits and pushes to `main`

### Comparison with Hexo / Hugo

| Hexo | Hugo | Atom |
|------|------|------|
| `hexo new "title"` | `hugo new content posts/title.md` | `node atom-cli.mjs new "title"` |
| `hexo generate` | `hugo` | `node atom-cli.mjs build` |
| `hexo deploy` | (manual) | `node atom-cli.mjs build` (auto-deploy) |
| `hexo server` | `hugo server` | `npm run dev` |

---

## 📝 Writing Articles

Create a `.md` file in `src/content/blog/`:

```markdown
---
title: Article Title
description: Short description for card preview
pubDate: 2026-01-01
category: Category Name
tags: [Tag1, Tag2]
heroImage: /images/cover.jpg
updatedDate: 2026-01-02
reward: true
---

Article content in Markdown...
```

### Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | ✅ | Article title |
| `description` | `string` | ✅ | Card preview text |
| `pubDate` | `date` | ✅ | Publish date |
| `category` | `string` | ❌ | Single category name |
| `tags` | `string[]` | ❌ | Multiple tags |
| `heroImage` | `string` | ❌ | Cover image path (`public/` relative) |
| `updatedDate` | `date` | ❌ | Last updated date |
| `reward` | `boolean` | ❌ | Show reward QR codes |

---

## 🚀 Deploy to GitHub Pages

### Automatic Deploy (Recommended)

1. Rename `.github_disabled/` → `.github/`:
   ```bash
   mv .github_disabled .github
   git add . && git commit -m "enable github actions" && git push
   ```
2. Go to **Settings → Pages → Source → GitHub Actions**
3. Push to `main` ✅

Actions will auto-run: install → build → deploy

### Custom Domain

1. Create `public/CNAME` with your domain
2. Add CNAME record pointing to `yourusername.github.io`

---

## ⚙️ Customization

### Site Info

Edit `src/consts.ts`:

```typescript
export const SITE_TITLE = 'My Blog';
export const SITE_DESCRIPTION = 'My personal blog';
export const AUTHOR = 'Your Name';
export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  twitter: '',
  email: '',
};
```

### Deployment Address

Edit `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/your-repo-name',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
```

### Navigation

Edit `src/components/Header.astro`, modify the `navLinks` array:

```typescript
const navLinks = [
  { href: base, label: 'Home', active: currentPage === '' },
  { href: base + '/blog', label: 'Blog', active: currentPage.startsWith('blog') },
  { href: base + '/categories', label: 'Categories', active: currentPage === 'categories' },
  { href: base + '/tags', label: 'Tags', active: currentPage === 'tags' },
  { href: base + '/about', label: 'About', active: currentPage === 'about' },
];
```

### Colors

Edit `src/styles/global.css`:

```css
:root {
  --bg-primary: #f0f2f5;
  --accent: #6366f1;
  --accent-gradient: linear-gradient(135deg, #6366f1, #8b5cf6);
  --radius: 10px;
}

html.dark {
  --bg-primary: #0a0a0f;
  --accent: #00e5ff;
  --accent-gradient: linear-gradient(135deg, #00e5ff, #a78bfa);
}
```

### Adding Pages

Create `.astro` files in `src/pages/` for automatic routing:

```
src/pages/about.astro        → /about
src/pages/links.astro        → /links
```

---

## 🏗️ Architecture

### 0 JS by Default

Atom outputs pure HTML + CSS. No JavaScript is sent to the browser — the only client-side code is the theme toggle and search input, both under 1 KB.

### SEO Metadata (Auto-Injected)

Every article automatically includes:
- **Open Graph** — for social sharing cards
- **Twitter Card** — for Twitter shares
- **JSON-LD** — structured data for Google (BlogPosting schema)
- **Sitemap** — auto-generated on build
- **RSS Feed** — auto-generated on build

### Reward QR Codes

Place images in `public/medias/reward/`:

```
public/medias/reward/
├── wechat.png     # WeChat reward (140×140)
└── alipay.png     # Alipay reward (140×140)
```

Enable per-article with `reward: true` in frontmatter.

---

## 📊 Comparison

| Solution | Output Size | JS Dep | Build Time | SEO/RSS/Sitemap | Learning Curve |
|----------|------------|--------|------------|-----------------|----------------|
| **Atom** | **~3 KB** | **0** | **~1s** | **Auto RSS/Sitemap/JSON-LD** | Very Low |
| Hexo + Matery | ~15 MB | Many libs | ~5s | Plugin required | Medium |
| Hugo | ~2 MB | 0 | ~0.5s | Plugin required | Medium |
| Jekyll | ~3 MB | Few | ~3s | Built-in | Medium |
| Eleventy | ~500 KB | 0 | ~2s | Plugin required | Medium |
| VitePress | ~2 MB | Hydrated | ~2s | Plugin required | Low (docs-focused) |

---

## 💰 Support

If you like Atom Blog, consider supporting with a scan:

| WeChat | Alipay |
|--------|--------|
| <img src="https://zz3656.github.io/Atom-blog/medias/reward/wechat.png" width="140" alt="WeChat reward" /> | <img src="https://zz3656.github.io/Atom-blog/medias/reward/alipay.png" width="140" alt="Alipay reward" /> |

Every bit of support encourages open source ❤️

---

## 📄 License

[MIT](LICENSE) — Free to use, modify, distribute.

---

<div align="center">

**Made with ⚙️ by [Atom Blog](https://github.com/zz3656/Atom) · Powered by [Astro](https://astro.build)**

</div>
