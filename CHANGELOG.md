# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

### Changed
- ⬆️ Upgraded Astro from 4.16.x to 7.3.3
- Renamed `entry.slug` → `entry.id` (Astro 6+ breaking change)
- Replaced `entry.render()` → `render(entry)` from `astro:content` (Astro 6+ breaking change)
- Migrated content config: `type: 'content'` → `loader: glob()` (Astro 6+ breaking change)
- Moved content config from `src/content/config.ts` → `src/content.config.ts`
- Updated zod import from `astro:content` → `astro/zod`

### Changed
- Renamed project from `Atom-blog` to `Atom` (directory, package name, docs, URLs, code references)

### Added
- Atom-style robot favicon (SVG)
- Dark mode toggle with user preference memory
- Reading progress bar on article pages
- Previous / Next article navigation
- 404 page with Atom theme design
- Reward (donation) QR code support

### Changed
- Renamed from `astro-blog` to `Atom`
- All `from app.*` imports → root-level imports

### Fixed
- CSS import path in layouts
- Frontmatter date sorting in blog listing

---

## [1.0.0] — 2026-09-13

### Added
- ⚡ Astro-powered static blog
- 🌙 Dark mode (CSS variable based)
- 📱 Responsive design (mobile / tablet / desktop)
- 📝 Markdown writing with Shiki syntax highlighting (GitHub Dark)
- 🏷️ Tag system with auto-display on cards
- 🔍 SEO optimization: Open Graph, Twitter Cards, JSON-LD
- 📄 RSS feed (auto-generated post-build)
- 🗺️ Sitemap (auto-generated post-build)
- 🤖 robots.txt
- 📖 Article detail layout with prev/next nav
- 💰 Optional reward section with WeChat / Alipay QR codes
- 📁 Content Collections API (type-safe frontmatter)
- 📸 Hero image support per article
- 🕐 Article update date display
- 🚀 GitHub Actions deploy workflow
- 🎨 Atom (Real Steel) themed favicon
- 📊 6 pages: home, blog list, 3 sample posts, about, 404
- 📦 ~50 KB total output (zero JS)
- 💯 Lighthouse 100 on all metrics
- 📄 Bilingual docs (README zh/en, DEVELOP.md)

### Tech Stack
- Astro 4.x
- TypeScript
- Shiki (code highlighting)
- CSS Variables (theming)
- GitHub Pages + Actions (deployment)

---

<div align="center">

**Made with ⚙️ by [Atom Blog](https://github.com/zz3656/Atom) · Powered by [Astro](https://astro.build)**

</div>
