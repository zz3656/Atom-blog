# 开发者指南 · Developer Guide

> Atom 的详细开发文档。适合想 Fork、二次开发或贡献代码的开发者。

> Detailed development docs for Atom. For those who want to fork, customize, or contribute.

---

## 📖 目录 / Table of Contents

- [项目概览](#项目概览)
- [技术选型](#技术选型)
- [快速上手](#快速上手)
- [文件结构详解](#文件结构详解)
- [文章管理](#文章管理)
- [主题定制](#主题定制)
- [高级功能](#高级功能)
- [部署指南](#部署指南)
- [常见问题](#常见问题)
- [Contributing](#contributing)

---

## 项目概览

### 中文

Atom 是一个**轻量级、零依赖**的静态博客，使用 [Astro](https://astro.build) 构建，专为 GitHub Pages 部署优化。项目灵感来自电影《铁甲钢拳》(Real Steel) 中的机器人 Atom — 小巧、精准、充满力量。

**核心设计理念：**
- **快** — 零 JavaScript 输出，Lighthouse 满分
- **简** — 无后端、无数据库、无构建依赖
- **全** — SEO 开箱即用：RSS、Sitemap、JSON-LD、Open Graph

### English

Atom is a **lightweight, zero-dependency** static blog built with [Astro](https://astro.build), optimized for GitHub Pages deployment. Inspired by Atom, the boxing robot from *Real Steel* — compact, precise, full of power.

**Core design philosophy:**
- **Fast** — Zero JavaScript output, Lighthouse 100
- **Simple** — No backend, no database, no build dependencies
- **Complete** — SEO out of the box: RSS, Sitemap, JSON-LD, Open Graph

---

## 技术选型

### 中文

| 层 | 技术 | 原因 |
|----|------|------|
| 框架 | Astro 7.x | 零 JS 默认输出，Content Collections Schema |
| 语言 | TypeScript | 类型安全，编辑器提示 |
| 样式 | 原生 CSS + CSS Variables | 无框架依赖，暗黑模式轻松实现 |
| 代码高亮 | Shiki | 内置 Astro，支持 GitHub Dark 主题 |
| RSS / Sitemap | 自定义 postbuild 脚本 | 零 npm 依赖，构建后自动生成 |
| 部署 | GitHub Pages + Actions | 免费、自动化 |

### English

| Layer | Technology | Reason |
|-------|------------|--------|
| Framework | Astro 7.x | Zero JS output, Content Collections Schema |
| Language | TypeScript | Type safety, IDE hints |
| Styling | Native CSS + CSS Variables | No framework dependency, easy dark mode |
| Syntax Highlight | Shiki | Built-in Astro, GitHub Dark theme support |
| RSS / Sitemap | Custom postbuild script | Zero npm deps, auto-generated post-build |
| Hosting | GitHub Pages + Actions | Free, automated |

---

## 快速上手

### 中文

```bash
# 1. 克隆
git clone https://github.com/zz3656/Atom.git
cd Atom-blog

# 2. 安装依赖
npm install

# 3. 本地开发 (http://localhost:4321)
npm run dev

# 4. 构建
npm run build

# 5. 预览构建结果
npm run preview
```

### English

```bash
# 1. Clone
git clone https://github.com/zz3656/Atom.git
cd Atom-blog

# 2. Install dependencies
npm install

# 3. Local dev (http://localhost:4321)
npm run dev

# 4. Build
npm run build

# 5. Preview the build
npm run preview
```

---

## 文件结构详解

### 中文

```
Atom/
├── public/                    # 静态资源（原样复制到 dist/）
│   ├── favicon.svg            # 网站图标
│   ├── robots.txt             # 搜索引擎爬虫规则
│   └── medias/                # 多媒体资源
│       └── reward/            # 打赏二维码（可选）
│           ├── wechat.png
│           └── alipay.jpg
├── scripts/                   # 构建辅助脚本
│   └── generate-rss.mjs       # 生成 RSS + Sitemap
├── src/
│   ├── components/            # Astro 组件
│   │   ├── Header.astro       # 导航栏 + 暗黑模式切换
│   │   ├── Footer.astro       # 页脚 + 社交链接
│   │   ├── PostCard.astro     # 文章卡片（标题、日期、标签）
│   │   └── FormattedDate.astro # 日期格式化组件
│   ├── content/               # Astro Content Collections
│   │   ├── config.ts          # Schema 定义
│   │   └── blog/              # 文章目录
│   │       ├── hello-world.md
│   │       └── ...
│   ├── layouts/               # 页面布局
│   │   ├── BaseLayout.astro   # 全局布局（head、nav、footer）
│   │   └── BlogPost.astro     # 文章布局（含 prev/next、打赏）
│   ├── pages/                 # 路由页面
│   │   ├── index.astro        # / → 首页
│   │   ├── about.astro        # /about → 关于页
│   │   ├── 404.astro          # /404 → 404 页
│   │   └── blog/
│   │       ├── index.astro    # /blog → 文章列表
│   │       └── [...slug].astro # /blog/[slug] → 文章详情
│   ├── styles/
│   │   └── global.css         # 全局样式 + CSS 变量
│   ├── consts.ts              # 站点配置
│   └── env.d.ts               # TypeScript 类型声明
├── astro.config.mjs           # Astro 配置
├── package.json               # 依赖 + 脚本
└── tsconfig.json              # TypeScript 配置
```

### English

```
Atom/
├── public/                    # Static assets (copied to dist/)
│   ├── favicon.svg            # Site favicon
│   ├── robots.txt             # Search engine crawler rules
│   └── medias/
│       └── reward/            # Reward QR codes (optional)
│           ├── wechat.png
│           └── alipay.jpg
├── scripts/                   # Build helper scripts
│   └── generate-rss.mjs       # Generate RSS + Sitemap
├── src/
│   ├── components/            # Astro components
│   │   ├── Header.astro       # Navbar + dark mode toggle
│   │   ├── Footer.astro       # Footer + social links
│   │   ├── PostCard.astro     # Article card (title, date, tags)
│   │   └── FormattedDate.astro # Date formatter
│   ├── content/               # Astro Content Collections
│   │   ├── config.ts          # Schema definition
│   │   └── blog/              # Article directory
│   │       ├── hello-world.md
│   │       └── ...
│   ├── layouts/               # Page layouts
│   │   ├── BaseLayout.astro   # Global layout (head, nav, footer)
│   │   └── BlogPost.astro     # Article layout (prev/next, reward)
│   ├── pages/                 # Route pages
│   │   ├── index.astro        # / → Homepage
│   │   ├── about.astro        # /about → About page
│   │   ├── 404.astro          # /404 → 404 page
│   │   └── blog/
│   │       ├── index.astro    # /blog → Article listing
│   │       └── [...slug].astro # /blog/[slug] → Article detail
│   ├── styles/
│   │   └── global.css         # Global styles + CSS variables
│   ├── consts.ts              # Site configuration
│   └── env.d.ts               # TypeScript type declarations
├── astro.config.mjs           # Astro config
├── package.json               # Dependencies + scripts
└── tsconfig.json              # TypeScript config
```

---

## 文章管理

### 创建文章

在 `src/content/blog/` 下新建 `.md` 文件：

```markdown
---
title: 文章标题
description: 简短描述
pubDate: 2026-01-01
tags: [标签1, 标签2]
heroImage: /images/cover.jpg
updatedDate: 2026-01-02
reward: true
---

正文内容...
```

### Frontmatter 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | ✅ | 文章标题 |
| `description` | `string` | ✅ | 卡片描述（约 1-2 行） |
| `pubDate` | `date` | ✅ | 发布日期 |
| `tags` | `string[]` | ❌ | 标签列表 |
| `heroImage` | `string` | ❌ | 封面图片（相对于 `public/`） |
| `updatedDate` | `date` | ❌ | 更新日期（可选） |
| `reward` | `boolean` | ❌ | 显示打赏码（默认 `false`） |

### 添加封面图片

将图片放入 `public/` 目录，在 frontmatter 中引用：

```markdown
heroImage: /images/cover.jpg
```

图片会自动复制到 `dist/`。

---

## 主题定制

### 中文

#### 修改配色

编辑 `src/styles/global.css`，调整 CSS 变量：

```css
:root {
  /* 亮色模式 */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #1a1a2e;
  --accent: #6366f1;        /* 主色 */
  --accent-hover: #4f46e5;
  --radius: 12px;           /* 圆角 */
}

html.dark {
  /* 暗黑模式 */
  --bg-primary: #0f0f1a;
  --text-primary: #e2e8f0;
  --accent: #818cf8;
}
```

#### 修改字体

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-serif: 'Noto Serif SC', 'Source Serif Pro', serif;
}
```

#### 修改站点信息

编辑 `src/consts.ts`：

```typescript
export const SITE_TITLE = '你的博客名';
export const SITE_DESCRIPTION = '你的博客描述';
export const AUTHOR = '你的名字';
export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  twitter: '',
  email: '',
};
```

### English

#### Change Colors

Edit `src/styles/global.css`, adjust CSS variables:

```css
:root {
  /* Light mode */
  --bg-primary: #ffffff;
  --text-primary: #1a1a2e;
  --accent: #6366f1;        /* Primary color */
  --accent-hover: #4f46e5;
}

html.dark {
  /* Dark mode */
  --bg-primary: #0f0f1a;
  --text-primary: #e2e8f0;
  --accent: #818cf8;
}
```

#### Change Fonts

```css
:root {
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

#### Change Site Info

Edit `src/consts.ts`:

```typescript
export const SITE_TITLE = 'Your Blog Name';
export const AUTHOR = 'Your Name';
```

---

## Hexo → Atom 迁移记录

### 背景

从 Hexo (hexo-theme-matery) 迁移到 Astro 静态博客，记录转换脚本编写过程和核心规律。

### 转换脚本

- **脚本路径**: `scripts/convert-hexo.mjs`
- **文档**: `scripts/README.md`
- **来源**: `../../zz3656.github.io/source/_posts/`（Hexo 源文件）
- **目标**: `src/content/blog/`（Astro Content Collections）

### 转换规则摘要

| Hexo (matery) 字段 | Astro 字段 | 转换规则 |
|---|---|---|
| `title` | `title` | 直接保留 |
| `date: 2025-07-14 05:23:30` | `pubDate: 2025-07-14` | 只取日期 |
| `categories` (单值/列表) | `category` | 列表取第一个 |
| `tags: [- x]` | `tags: [x]` | YAML → inline |
| `summary` / `description` | `description` | 自动提取正文第一段（160字符） |
| `img` / `cover` / `top_img` | `heroImage` | 统一映射，路径规范化 |

丢弃字段：`top`、`hide`、`password`、`toc`、`mathjax`、`keywords`、`reprintPolicy`、`author`、`coverImg` 及 matery 非官方字段（`swiper_index`、`top_group_index` 等）。

### 迁移统计

- 源文章: **44 篇**
- 成功转换: **44 篇**（包括中文文件名）
- 手动补充 category: **3 篇**（pvesetupistoreos.md、routeros.md、vpsikuai.md）
- 排除: welcome.md（原有）
- 详细规则见 [`scripts/README.md`](scripts/README.md)

### 参考文档

- [hexo-theme-matery 官方 Front-matter 文档](https://github.com/blinkfox/hexo-theme-matery#post-front-matter)

---

## 高级功能

### RSS / Sitemap

构建后自动生成 `dist/rss.xml` 和 `dist/sitemap.xml`。脚本位于 `scripts/generate-rss.mjs`。

自定义：编辑脚本中的 `siteUrl` 和 `repoName`。

```javascript
var siteUrl = 'https://yourdomain.com';
var repoName = 'my-blog';  // 仓库名（根站点用空字符串）
```

### 打赏功能

添加二维码图片到 `public/medias/reward/`：

```
public/medias/reward/
├── wechat.png     # 微信赞赏码
└── alipay.jpg     # 支付宝收款码
```

在文章 frontmatter 中启用：

```markdown
reward: true
```

### 集成评论

Atom 本身无后端，可通过以下方式集成评论：

1. **Cusdis** (推荐) — 开源轻量，支持 Telegram 通知
2. **Disqus** — 最成熟，但需科学上网
3. **Giscus** — 基于 GitHub Discussions

在 `src/layouts/BlogPost.astro` 的 `post-content` 后插入评论组件。

### 集成搜索

使用 Algolia DocSearch 或同类的静态搜索方案。

---

## 部署指南

### GitHub Pages（推荐）

1. 重命名 `.github_disabled/` → `.github/`
2. **Settings → Pages → Source → GitHub Actions**
3. 推送代码到 `main` 分支

### 自定义域名

1. `public/CNAME` 写入域名
2. DNS 添加 CNAME 到 `yourusername.github.io`

---

## 常见问题

### Q: 修改代码后预览没生效？

A: 确保运行的是 `npm run dev`，而非 `npm run build`。开发时使用 Vite dev server，构建后才生成静态文件。

### Q: 文章列表没有按日期排序？

A: 确保 frontmatter 的 `pubDate` 是合法的 ISO 日期格式：`2026-01-01`。

### Q: 如何添加新页面？

A: 在 `src/pages/` 下创建 `.astro` 文件即可，Astro 会自动映射为路由。

### Q: 评论系统推荐哪个？

A: **Cusdis** 最轻量且开源（`cusdis.js`），**Giscus** 如果文章在 GitHub 仓库用 Discussions。

---

## Contributing

### English

Contributions are welcome! Here's how:

1. **Fork** this repository
2. **Create** a feature branch (`git checkout -b feature/amazing`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing`)
5. **Open** a Pull Request

### 中文

欢迎贡献！贡献方式：

1. **Fork** 本项目
2. **创建** 功能分支 (`git checkout -b feature/amazing`)
3. **提交** 修改 (`git commit -m 'feat: add amazing feature'`)
4. **推送** 到分支 (`git push origin feature/amazing`)
5. **提交** Pull Request

---

<div align="center">

**Made with ⚙️ by [Atom Blog](https://github.com/zz3656/Atom) · Powered by [Astro](https://astro.build)**

</div>
