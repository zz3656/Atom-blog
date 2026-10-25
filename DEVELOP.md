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
- [设计系统](#设计系统)
- [主题定制](#主题定制)
- [高级功能](#高级功能)
- [版本号与发布流程](#版本号与发布流程)
- [部署指南](#部署指南)
- [常见问题](#常见问题)
- [Contributing](#contributing)

---

## 项目概览

### 中文

Atom 是一个**轻量级、无前端框架依赖**的静态博客，使用 [Astro](https://astro.build) 构建，专为 GitHub Pages 部署优化。项目灵感来自电影《铁甲钢拳》(Real Steel) 中的机器人 Atom — 小巧、精准、充满力量。

**核心设计理念：**

- **快** — 无框架运行时、无水合，仅 ~8.7KB 原生 JS，Lighthouse 满分
- **简** — 无后端、无数据库、无构建依赖
- **全** — SEO 开箱即用：RSS、Sitemap、JSON-LD、Open Graph

### English

Atom is a **lightweight, framework-free** static blog built with [Astro](https://astro.build), optimized for GitHub Pages deployment. Inspired by Atom, the boxing robot from _Real Steel_ — compact, precise, full of power.

**Core design philosophy:**

- **Fast** — No framework runtime, no hydration, only ~8.7KB of vanilla JS, Lighthouse 100
- **Simple** — No backend, no database, no build dependencies
- **Complete** — SEO out of the box: RSS, Sitemap, JSON-LD, Open Graph

---

## 技术选型

### 中文

| 层            | 技术                     | 原因                                       |
| ------------- | ------------------------ | ------------------------------------------ |
| 框架          | Astro 7.4                | 框架默认零 JS 输出（不注入运行时），Content Collections Schema |
| 语言          | TypeScript 6.x           | 类型安全，编辑器提示                       |
| 样式          | 原生 CSS + CSS Variables | 无框架依赖，21 个 CSS 模块按职责拆分        |
| 字体          | Archivo + JetBrains Mono | Archivo 承担标题/正文（含 wdth 宽度轴），Mono 只用于数据 |
| 代码高亮      | Shiki                    | 内置 Astro，支持 GitHub Dark 主题          |
| RSS / Sitemap | 自定义 postbuild 脚本    | 零 npm 依赖，构建后自动生成                |
| 部署          | GitHub Pages + Actions   | 免费、自动化                               |

### English

| Layer            | Technology                 | Reason                                     |
| ---------------- | -------------------------- | ------------------------------------------ |
| Framework        | Astro 7.4                  | Zero-JS by default (no runtime injected), Content Collections Schema |
| Language         | TypeScript 6.x             | Type safety, IDE hints                     |
| Styling          | Native CSS + CSS Variables | No framework dependency, 21 focused modules |
| Fonts            | Archivo + JetBrains Mono   | Archivo for display/body (wdth axis), Mono for data only |
| Syntax Highlight | Shiki                      | Built-in Astro, GitHub Dark theme support  |
| RSS / Sitemap    | Custom postbuild script    | Zero npm deps, auto-generated post-build   |
| Hosting          | GitHub Pages + Actions     | Free, automated                            |

---

## 快速上手

### 中文

```bash
# 1. 克隆
git clone https://github.com/zz3656/Atom.git
cd Atom

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
cd Atom

# 2. Install dependencies
npm install

# 3. Local dev (http://localhost:4321)
npm run dev

# 4. Build
npm run build

# 5. Preview the build
npm run preview

# 6. Type check + tests + build verification
npm run check   # TypeScript strict type check
npm run test    # Vitest unit tests
npm run build   # Full build with all post-processing
```

---

## 文件结构详解

### 中文

```
Atom/
├── .github/                   # GitHub 配置（CI 与部署均已启用）
│   ├── dependabot.yml         # 依赖更新机器人
│   └── workflows/
│       ├── test.yml           # CI：lint → test → build
│       └── deploy.yml         # GitHub Pages / Cloudflare Pages 部署
├── scripts/                   # 构建辅助脚本
│   ├── atom-cli.mjs           # 本地 CLI（创建/列出文章）
│   ├── create-theme.mjs       # 主题脚手架（npm run theme:create <id>）
│   ├── generate-rss.mjs       # RSS Feed + 搜索索引生成
│   ├── fix-sitemap.mjs        # sitemap lastmod 修正
│   ├── minify-app-js.mjs      # app.js 压缩 + 子路径兼容
│   ├── vectorize-icon.mjs     # 位图 → 矢量（Draw Things 图标流水线第二步）
│   └── convert-hexo.mjs       # Hexo 迁移工具（可选用）
├── astro-plugins/
│   ├── remark-img-lazy.mjs    # Markdown 图片自动加 lazy loading
│   ├── rehype-table-scroll.mjs # 宽表格包进可横向滚动的容器
│   └── theme-loader.mjs       # 构建时扫描 src/themes/，生成 CSS 入口
├── public/                    # 静态资源（原样复制到 dist/）
│   ├── favicon.svg            # 网站图标
│   ├── manifest.json          # PWA 配置
│   ├── robots.txt             # 搜索引擎爬虫规则
│   ├── opensearch.xml         # 浏览器搜索插件
│   ├── logos/logo.svg         # 导航栏 Logo
│   ├── js/app.js              # 压缩后的交互脚本（构建时生成）
│   ├── _assets/               # 搜索索引（构建时生成）
│   └── medias/reward/         # 打赏二维码（可选）
│       ├── wechat.png
│       └── alipay.png
├── src/
│   ├── themes/                # 主题目录（默认 atom-default）
│   │   └── atom-default/      # 自带主题：light + dark
│   ├── components/            # Astro 组件
│   │   ├── Header.astro       # 导航栏 + 日/夜间切换
│   │   ├── Footer.astro       # 页脚 + 社交链接
│   │   ├── PostCard.astro     # 日志行（序号 / 标题 / 日期 / 分类 / 标签）
│   │   ├── TableOfContents.astro # 文章目录（≥1280 左侧刻度栏 / <1280 顶部折叠条）
│   │   ├── HeroIcon.astro     # 首页 Hero 图标
│   │   └── FormattedDate.astro # 日期格式化组件
│   ├── layouts/               # 页面布局
│   │   ├── BaseLayout.astro   # 全局布局（head, nav, footer, 内联主题脚本）
│   │   └── BlogPost.astro     # 文章布局（含 TOC、prev/next、打赏、JSON-LD）
│   ├── pages/                 # 路由页面
│   │   ├── index.astro        # / → 首页
│   │   ├── about.astro        # /about → 关于页
│   │   ├── 404.astro          # /404 → 404 页
│   │   ├── blog/              # 文章列表 & 详情
│   │   ├── categories/        # 分类列表
│   │   ├── category/          # 分类详情
│   │   ├── tags/              # 标签列表
│   │   └── tag/               # 标签详情
│   ├── content/               # 📝 Markdown 文章
│   │   └── blog/              # 文章目录（每篇一个 .md）
│   ├── styles/                # 样式模块
│   │   ├── global.css         # 主入口（@import 所有模块）
│   │   └── _modules/          # 21 个 CSS 模块（按钮/导航/TOC/...）
│   ├── scripts/app.js         # 交互脚本源码（构建时压缩）
│   ├── generated/             # 构建期生成的主题入口（勿手改）
│   ├── utils/                 # 工具函数
│   │   ├── path.ts            # URL/base 路径处理
│   │   ├── blog.ts            # 文章数据工具
│   │   ├── date.ts            # 日期格式化
│   │   ├── collection.ts      # Content Collections 公共逻辑
│   │   ├── themes.ts          # 主题 manifest 校验
│   │   └── markdown-strip.ts  # Markdown → 纯文本（提取摘要/搜索）
│   ├── consts.ts              # 站点配置（SITE_TITLE / REPO_URL / SOCIAL_LINKS）
│   ├── content.config.ts      # 内容集合 Schema（类型安全）
│   └── env.d.ts
├── tests/                     # 单元测试（Vitest）
│   ├── app.behavior.test.ts   # 主题切换/搜索/复制 等交互
│   ├── app.dom.test.ts        # DOM 操作
│   ├── blog.test.ts           # 文章数据工具
│   ├── collection.test.ts     # getPublishedPosts
│   ├── date.test.ts           # 日期格式化
│   ├── path.test.ts           # URL 路径
│   ├── themes.test.ts         # 主题 manifest 校验
│   ├── rehype-table-scroll.test.ts # 表格滚动容器插件
│   └── version.test.ts        # 版本号与 CHANGELOG 一致性
├── docs/
│   └── THEMING.md             # 主题开发指南（第三方主题用）
├── astro.config.mjs           # Astro 配置（含 base 自动检测）
├── vitest.config.ts           # 测试配置
├── eslint.config.js           # ESLint 配置
├── package.json
├── tsconfig.json
├── AGENTS.md                  # AI Agent 项目定义
├── CHANGELOG.md               # 更新日志
├── DEVELOP.md                 # 开发者指南
├── README.md                  # 本文件（中文）
└── README_EN.md               # 本文件（英文）
```

### English

```
Atom/
├── .github/                   # GitHub config (CI + deploy both enabled)
│   ├── dependabot.yml         # Dependency update bot
│   └── workflows/
│       ├── test.yml           # CI: lint → test → build
│       └── deploy.yml         # GitHub Pages / Cloudflare Pages deploy
├── scripts/                   # Build helper scripts
│   ├── atom-cli.mjs           # Local CLI (create / list articles)
│   ├── create-theme.mjs       # Theme scaffold (npm run theme:create <id>)
│   ├── generate-rss.mjs       # RSS feed + search index
│   ├── fix-sitemap.mjs        # Sitemap lastmod fix
│   ├── minify-app-js.mjs      # app.js minify + sub-path compat
│   ├── vectorize-icon.mjs     # Raster → vector (step 2 of the Draw Things icon pipeline)
│   └── convert-hexo.mjs       # Hexo migration tool (optional)
├── astro-plugins/
│   ├── remark-img-lazy.mjs    # Auto-add loading=lazy to Markdown images
│   ├── rehype-table-scroll.mjs # Wrap wide tables in a scroll container
│   └── theme-loader.mjs       # Build-time scan src/themes/, generate CSS entry
├── public/                    # Static assets (copied to dist/)
│   ├── favicon.svg            # Site favicon
│   ├── manifest.json          # PWA config
│   ├── robots.txt             # Search engine crawler rules
│   ├── opensearch.xml         # Browser search plugin
│   ├── logos/logo.svg         # Navbar logo
│   ├── js/app.js              # Minified interaction script (generated at build)
│   ├── _assets/               # Search index (generated at build)
│   └── medias/reward/         # Reward QR codes (optional)
│       ├── wechat.png
│       └── alipay.png
├── src/
│   ├── themes/                # Themes directory (default: atom-default)
│   │   └── atom-default/      # Built-in theme: light + dark
│   ├── components/            # Astro components
│   │   ├── Header.astro       # Navbar + light/dark toggle
│   │   ├── Footer.astro       # Footer + social links
│   │   ├── PostCard.astro     # Log row (index / title / date / category / tags)
│   │   ├── TableOfContents.astro # Article TOC (caliper rail ≥1280 / collapsible bar <1280)
│   │   ├── HeroIcon.astro     # Homepage hero icon
│   │   └── FormattedDate.astro # Date formatter
│   ├── layouts/               # Page layouts
│   │   ├── BaseLayout.astro   # Global layout (head, nav, footer, inline theme script)
│   │   └── BlogPost.astro     # Article layout (TOC, prev/next, reward, JSON-LD)
│   ├── pages/                 # Route pages
│   │   ├── index.astro        # / → Homepage
│   │   ├── about.astro        # /about → About page
│   │   ├── 404.astro          # /404 → 404 page
│   │   ├── blog/              # Article list & detail
│   │   ├── categories/        # Category list
│   │   ├── category/          # Category detail
│   │   ├── tags/              # Tag list
│   │   └── tag/               # Tag detail
│   ├── content/               # 📝 Markdown articles
│   │   └── blog/              # One .md per article
│   ├── styles/                # Style modules
│   │   ├── global.css         # Main entry (@import all modules)
│   │   └── _modules/          # 21 CSS modules (buttons/nav/TOC/...)
│   ├── scripts/app.js         # Interaction script source (minified at build)
│   ├── generated/             # Build-generated theme entry (do not edit by hand)
│   ├── utils/                 # Utility functions
│   │   ├── path.ts            # URL / base path
│   │   ├── blog.ts            # Article data tools
│   │   ├── date.ts            # Date formatting
│   │   ├── collection.ts      # Content Collections helpers
│   │   ├── themes.ts          # Theme manifest validation
│   │   └── markdown-strip.ts  # Markdown → plain text (for search / summary)
│   ├── consts.ts              # Site config (SITE_TITLE / REPO_URL / SOCIAL_LINKS)
│   ├── content.config.ts      # Content collection schema (type-safe)
│   └── env.d.ts
├── tests/                     # Unit tests (Vitest)
│   ├── app.behavior.test.ts   # Theme toggle / search / copy interactions
│   ├── app.dom.test.ts        # DOM operations
│   ├── blog.test.ts           # Article data tools
│   ├── collection.test.ts     # getPublishedPosts
│   ├── date.test.ts           # Date formatting
│   ├── path.test.ts           # URL paths
│   ├── themes.test.ts         # Theme manifest validation
│   ├── rehype-table-scroll.test.ts # Table scroll wrapper plugin
│   └── version.test.ts        # Version / CHANGELOG consistency
├── docs/
│   └── THEMING.md             # Theme development guide (for third parties)
├── astro.config.mjs           # Astro config (auto-detect base)
├── vitest.config.ts           # Test config
├── eslint.config.js           # ESLint config
├── package.json
├── tsconfig.json
├── AGENTS.md                  # Agent-facing project definition
├── CHANGELOG.md               # Changelog
├── DEVELOP.md                 # Developer guide
├── README.md                  # This file (Chinese)
└── README_EN.md               # This file (English)
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

| 字段          | 类型       | 必填 | 说明                         |
| ------------- | ---------- | ---- | ---------------------------- |
| `title`       | `string`   | ✅   | 文章标题                     |
| `description` | `string`   | ✅   | 卡片描述（约 1-2 行）        |
| `pubDate`     | `date`     | ✅   | 发布日期                     |
| `tags`        | `string[]` | ❌   | 标签列表                     |
| `heroImage`   | `string`   | ❌   | 封面图片（相对于 `public/`） |
| `updatedDate` | `date`     | ❌   | 更新日期（可选）             |
| `reward`      | `boolean`  | ❌   | 显示打赏码（默认 `false`）   |

### 添加封面图片

将图片放入 `public/` 目录，在 frontmatter 中引用：

```markdown
heroImage: /images/cover.jpg
```

图片会自动复制到 `dist/`。

---

## 设计系统

### 中文

Atom 的视觉由**两层 Token**驱动。理解这个分层，是改样式 / 做主题的前提。

**第一层 · 语义色**（写在 `src/themes/<id>/{light,dark}.css`）

表面、文字、边框、主色、标签、分类、阴影、语义状态色。主题作者改这一层。

**第二层 · 语义表面**（v3 新增，组件层唯一依赖的抽象）

| Token | 组件层怎么用 |
|---|---|
| `--on-accent` | 强调色实心块上的文字色（按钮、返回顶部） |
| `--header-bg` | 吸顶导航栏底色 |
| `--panel-bg` | 目录 / 面板类容器底色 |
| `--code-bg` | 代码块底色 |
| `--grid-line` | 页面底纹网格线 |
| `--highlight` | 搜索命中高亮 |
| `--ambient-glow` | 页面角落暖光 |
| `--rule-tick` / `--rule-tick-strong` | 刻度尺的短刻度 / 长刻度 |
| `--focus-ring` | 键盘焦点环 |
| `--glow-secondary` | 副色辉光（分类通道） |

### 铁律：组件层不写死颜色

```css
/* ✅ 正确：只依赖 token */
.post-header .rule {
  background-image: repeating-linear-gradient(
    90deg,
    var(--rule-tick-strong) 0 1px,
    transparent 1px var(--rule-major)
  );
}

/* ❌ 错误：写死色值会让第三方主题失效 */
.post-header .rule {
  background-image: repeating-linear-gradient(90deg, #b9821f 0 1px, transparent 1px 64px);
}
```

早期版本的组件 CSS 里散落着紫罗兰 / 赛博青的字面量，结果第三方主题在暗色模式下会渲染出紫罗兰网格和霓虹青按钮。现在这条规则是硬性的。

### 排版约定

| 角色 | 字体 | 用在哪 |
|---|---|---|
| 标题 / 正文 | `Archivo`（可变字体，含 `wdth` 宽度轴） | 大标题用 `font-variation-settings: 'wdth' 112, 'wght' 800` 做宽字重标识感 |
| 数据 | `JetBrains Mono` | 日期、计数、序号、刻度、代码 |
| 中文 | 系统黑体（PingFang SC / 微软雅黑） | CJK 字符回落到 `--font-cjk` 栈 |

**等宽字体只用于"真实数据"**，不做装饰。中文界面上强行用等宽会掉字混排，因此导航、按钮、正文一律走无衬线。

### 刻度尺视觉语言

全站母题是一把**卡尺**：

- `.rule` —— 横向刻度尺，用两层 `repeating-linear-gradient` 叠出长短刻度；用于区块分隔、刊头下方、页脚顶缘
- `.log-list::before` + `.log-index::after` —— 竖向标尺脊线，每篇文章是一个刻度点，悬停时刻度伸长并点亮

### 品牌图标（Draw Things 流水线）

站点标识「黄铜原子」——冷钢圆盘上刻着三轨道黄铜原子。图形**由本机 Draw Things 生成**，再描成矢量：

| 步骤 | 工具 | 说明 |
|---|---|---|
| ① 出图 | `draw-things-cli` | 用本机 Draw Things（Z-Image Turbo / SDXL Turbo）生成 1024×1024 原图 |
| ② 描摹 | `scripts/vectorize-icon.mjs` | 位图 → 矢量，并把颜色**强制映射**到设计系统 token |
| ③ 落地 | `public/logos/logo.svg`、`public/favicon.svg`、`src/components/HeroIcon.astro` | 三处共用同一套路径（ID 不同，避免页内冲突） |

生成命令（`draw-things-cli` 是 Draw Things 官方 CLI，App 本体没有 headless 模式）：

```bash
brew install drawthingsai/draw-things/draw-things-cli

draw-things-cli generate \
  --model z_image_turbo_1.0_i8x.ckpt \
  --prompt "flat vector logo emblem. a brushed cold steel circular plate with a simple brass gold atomic symbol engraved in the center: exactly three thin elliptical orbits around one solid round nucleus. industrial precision badge, straight-on flat view, two colors only, brass gold and gunmetal gray, perfectly centered, no text" \
  --negative-prompt "text, letters, numbers, watermark, cluttered, ornate, purple, neon, 3d render, noisy, blurry" \
  --width 1024 --height 1024 --steps 8 --cfg 1.0 --seed 2001 \
  --output /tmp/atom.png
```

描摹命令：

```bash
node scripts/vectorize-icon.mjs /tmp/atom.png /tmp/logo.svg \
  --size 256 --hued --map 2c333a,f2b33d \
  --fills "url(#logoDisc),url(#logoBrass)" \
  --defs "<defs>…</defs>" \
  --crop --pad 12 --mask-down 2 --dilate 1 --chaikin 3 --eps 0.9 --vb 32
```

**为什么不让生成图直接当图标：**

1. 扩散模型无法保证命中精确的品牌色 —— 黄铜必须是 `--accent` 的那个值，不能是模型随手给的 `#d9b25a`
2. 位图在 32×32 的 favicon 上必然糊；矢量在 16px 仍然锐利
3. 描摹后形状来自生成图（真正的 AI 产出），颜色由设计系统说了算

`--hued` 用**色相**而不是亮度区分黄铜与钢灰，所以模型给金属打的明暗阴影不会让分类跑偏。`--mask-down` 把掩膜降采样以抹掉生成图的颗粒噪点，`--dilate` 把轨道加粗让小尺寸更清晰。

> `scripts/vectorize-icon.mjs` 依赖 `sharp`，而 `sharp` **未列入 `package.json`**（它只是 Astro 的传递依赖）。需要时临时 `npm i -D sharp`，用完再卸掉。

### 响应式断点

| 断点 | 变化 |
|---|---|
| ≥ 1280px | 文章目录变成左侧的**刻度栏**（悬浮在正文外的空白区，不占正文宽度） |
| ≤ 1279px | 文章目录收成正文上方的**折叠条**，默认收起；正文保持 740px 满宽居中 |
| ≤ 1024px | Hero 遥测列落到主栏下方并转网格 |
| ≤ 768px | 汉堡抽屉菜单；日志行改为纵向堆叠 |
| ≤ 600px | 日志行标题 / 日期 / 摘要 / 分类纵向排列 |
| ≤ 480px | 刻度槽收窄、标签隐藏、正文与标题再缩一档 |
| ≤ 400px | 导航压缩（搜索框 84px、开关格子 22px），保证 320px 无横向溢出 |

> **铁律：目录永远不挤压正文宽度。** 正文列固定 `--content-width`(740px) 居中，目录只能待在两侧空白区。
> 早期版本在 1100–1279px 把目录塞进 740px 的文章块里当左列，正文被压到 508px 且整体右移 116px —— 那是错的。
> 1280px 这个分界不是随手取的：目录宽 190px + 间距 28px 要占住文章左侧 218px，
> 文章左边缘 = `50% - 370px`，所以目录左边缘 = `50% - 588px ≥ 0` → 视口 ≥ 1176px 才放得下，取 1280px 留余量。
>
> 桌面端的目录**不画底色**：左侧那块 190px 区域一旦是实心色块，版面重心就左偏，
> 正文虽在几何中心却"看着偏右"。去掉底色后目录退成一列刻度，正文重新成为唯一视觉主体。

### English

Atom's visual system is driven by **two layers of tokens**. Understanding the split is a prerequisite for touching styles or building a theme.

**Layer 1 · Semantic colors** (defined in `src/themes/<id>/{light,dark}.css`)

Surfaces, text, borders, accent, tags, categories, shadows, semantic states. This is what theme authors edit.

**Layer 2 · Semantic surfaces** (added in v3 — the only abstraction components depend on)

| Token | How components use it |
|---|---|
| `--on-accent` | Text on a solid accent fill (buttons, back-to-top) |
| `--header-bg` | Sticky header background |
| `--panel-bg` | Panel-style containers (table of contents) |
| `--code-bg` | Code block surface |
| `--grid-line` | Page background grid line |
| `--highlight` | Search match highlight |
| `--ambient-glow` | Ambient corner glow |
| `--rule-tick` / `--rule-tick-strong` | Short / long ticks of the ruler rule |
| `--focus-ring` | Keyboard focus ring |
| `--glow-secondary` | Secondary (category) glow |

### Hard rule: never hardcode colors in components

```css
/* ✅ Correct: token-only */
.post-header .rule {
  background-image: repeating-linear-gradient(
    90deg,
    var(--rule-tick-strong) 0 1px,
    transparent 1px var(--rule-major)
  );
}

/* ❌ Wrong: a literal breaks every third-party theme */
.post-header .rule {
  background-image: repeating-linear-gradient(90deg, #b9821f 0 1px, transparent 1px 64px);
}
```

Earlier versions scattered violet / cyber-cyan literals through component CSS, which made third-party themes render violet grids and neon-cyan buttons in dark mode. That rule is now absolute.

### Typography roles

| Role | Face | Where |
|---|---|---|
| Headings / body | `Archivo` (variable, incl. `wdth` axis) | Display headings use `font-variation-settings: 'wdth' 112, 'wght' 800` for a wide, signage-like voice |
| Data | `JetBrains Mono` | Dates, counts, indices, ticks, code |
| CJK | System sans (PingFang SC / Microsoft YaHei) | CJK glyphs fall back to the `--font-cjk` stack |

**Mono is for real data only**, never decoration. Mixing mono into Chinese UI text produces uneven glyph metrics, so navigation, buttons and prose all stay sans.

### The ruler motif

The site-wide motif is a **caliper**:

- `.rule` — a horizontal rule built from two stacked `repeating-linear-gradient` layers; used for section dividers, under article mastheads, and along the footer edge
- `.log-list::before` + `.log-index::after` — a vertical spine beside the log; every article is a tick, and the hovered tick extends and lights up

### Brand icons (the Draw Things pipeline)

The site mark is the **brass atom** — three elliptical orbits engraved on a cold steel disc. The artwork is **generated by Draw Things on your own machine**, then traced into vectors:

| Step | Tool | What it does |
|---|---|---|
| ① Generate | `draw-things-cli` | Renders a 1024×1024 master image with Z-Image Turbo / SDXL Turbo |
| ② Trace | `scripts/vectorize-icon.mjs` | Raster → vector, with colours **forced** onto the design-system tokens |
| ③ Ship | `public/logos/logo.svg`, `public/favicon.svg`, `src/components/HeroIcon.astro` | All three share the same paths (different gradient IDs so they never collide on a page) |

```bash
brew install drawthingsai/draw-things/draw-things-cli

draw-things-cli generate \
  --model z_image_turbo_1.0_i8x.ckpt \
  --prompt "flat vector logo emblem. a brushed cold steel circular plate with a simple brass gold atomic symbol engraved in the center: exactly three thin elliptical orbits around one solid round nucleus. industrial precision badge, straight-on flat view, two colors only, brass gold and gunmetal gray, perfectly centered, no text" \
  --width 1024 --height 1024 --steps 8 --cfg 1.0 --seed 2001 \
  --output /tmp/atom.png

node scripts/vectorize-icon.mjs /tmp/atom.png /tmp/logo.svg \
  --size 256 --hued --map 2c333a,f2b33d \
  --fills "url(#logoDisc),url(#logoBrass)" --defs "<defs>…</defs>" \
  --crop --pad 12 --mask-down 2 --dilate 1 --chaikin 3 --eps 0.9 --vb 32
```

**Why not ship the generated bitmap directly?**

1. A diffusion model cannot hit an exact brand colour — brass has to be the `--accent` value, not whatever `#d9b25a` the model happened to pick.
2. A bitmap is always mushy at 32×32; vectors stay crisp at 16px.
3. After tracing, the *shape* still comes from the model while the *colour* comes from the design system.

`--hued` separates brass from steel by **hue** rather than brightness, so the metallic shading the model adds cannot throw the classification off. `--mask-down` area-averages the mask to erase the generation grain; `--dilate` fattens the orbits so they survive small sizes.

> `scripts/vectorize-icon.mjs` needs `sharp`, which is **not** in `package.json` (it only arrives as an Astro transitive dependency). Install it temporarily with `npm i -D sharp` and remove it afterwards.

### Responsive breakpoints

| Breakpoint | Change |
|---|---|
| ≥ 1280px | The article TOC becomes a **caliper rail** floating in the gutter beside the prose (never inside it) |
| ≤ 1279px | The TOC collapses into a bar above the prose, closed by default; the prose keeps its full 740px and stays centred |
| ≤ 1024px | Hero telemetry drops below the main column and becomes a grid |
| ≤ 768px | Hamburger drawer; log rows restack |
| ≤ 600px | Log rows stack title / date / summary / category |
| ≤ 480px | Narrower gutter, tags hidden, smaller body and headings |
| ≤ 400px | Compact nav (84px search, 22px toggle cells) so 320px has zero horizontal overflow |

> **Rule: the TOC must never squeeze the prose.** The prose column stays `--content-width` (740px) and centred; the TOC may only live in the outer gutters.
> An earlier version turned the TOC into a left column *inside* the 740px article block between 1100–1279px, which squeezed the prose to 508px and pushed it 116px right of centre. That was wrong.
> The 1280px cut-off is not arbitrary: a 190px rail plus 28px of gap needs 218px of the article's left gutter, and since the article's left edge is `50% - 370px`, the rail's left edge is `50% - 588px ≥ 0` → the viewport needs to be ≥ 1176px; 1280px leaves headroom.
>
> The desktop rail draws **no background**: a solid 190px block in the left gutter shifts the page's visual weight left, so the prose sits at the geometric centre but *looks* pushed right. Strip the panel and the TOC becomes a column of ticks, leaving the prose as the only visual subject again.

---

## 主题定制

### 中文

#### 修改主题配色（推荐）

编辑主题文件 `src/themes/atom-default/light.css` 和 `dark.css`，调整 CSS 变量：

```css
/* src/themes/atom-default/light.css */
html[data-theme='atom-default'][data-mode='light'] {
  --bg-primary: #ecedef;
  --bg-secondary: #e2e4e7;
  --text-primary: #171a1d;
  --accent: #8a5407;
  --accent-hover: #6d4005;
}
```

```css
/* src/themes/atom-default/dark.css */
html[data-theme='atom-default'][data-mode='dark'] {
  --bg-primary: #12161a;
  --text-primary: #d8dee3;
  --accent: #f2b33d;
  --accent-hover: #ffc95c;
}
```

> 亮色用**深黄铜**（`#8a5407`），暗色用**亮黄铜**（`#f2b33d`）——同一枚黄铜指示灯在不同光照下的两种读数。

**完整 token 列表**（background / text / border / accent / tag / category / semantic / shadow）见 [docs/THEMING.md](./docs/THEMING.md)。

如果只是想覆盖**整个主题**（换一套配色），可以新建自己的主题目录：
```bash
npm run theme:create ocean
# 编辑 src/themes/ocean/light.css + dark.css
```

#### 修改布局 token（圆角/字体/宽度）

编辑 `src/styles/_modules/_variables.css`（**不在主题 CSS 里**）：

```css
:root {
  --radius: 6px;
  --font-sans: 'Archivo', var(--font-cjk), system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', monospace;
}
```

#### 修改字体

全站只有三种字体"声音"，分工不要混用：

| Token | 用途 | 中文回落 |
| --- | --- | --- |
| `--font-display` | 标题 / 大号数字 | 系统黑体 |
| `--font-sans` | 正文与界面文字 | 系统黑体 |
| `--font-mono` | **仅真实数据**：日期、计数、序号、刻度、代码 | 等宽 |

```css
:root {
  --font-cjk: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei';
  --font-display: 'Archivo', var(--font-cjk), system-ui, sans-serif;
  --font-sans: 'Archivo', var(--font-cjk), system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', 'Fira Code', monospace;
}
```

> `Archivo` 是可变字体，带 `wdth` 宽度轴（`font-stretch`），标题的字宽变化是"精密仪表"感的来源。

#### 修改站点信息

编辑 `src/consts.ts`：

```typescript
export const SITE_TITLE = '你的博客名';        // SEO/OG/RSS 标题
export const SITE_NAME = 'MyBlog';              // 导航栏短名
export const SITE_DESCRIPTION = '你的博客描述'; // meta description
export const AUTHOR = '你的名字';

export const SITE_LOGO = '/logos/logo.svg';
export const SITE_FAVICON = '/favicon.svg';

// 首页 Hero 区域（图标 + 标题 + 描述 + 按钮）可完全客制化
export const SITE_HERO_ICON = '';               // 留空使用内置 Atom 原子 SVG
export const HERO_TITLE = 'MyBlog';             // Hero 标题文本（允许内嵌 HTML）
export const HERO_DESCRIPTION = '你的博客描述';
export const HERO_ACTIONS = [
  { label: '开始阅读 →', href: '/blog', variant: 'primary' },
  { label: '关于此站', href: '/about', variant: 'secondary' },
];

export const REPO_URL = 'https://github.com/你的用户名/你的仓库';
// ↑ Footer "Atom" 链接指向这里

export const SOCIAL_LINKS = {
  github: 'https://github.com/你的用户名', // 用户可定制（Footer 🐙）
  twitter: '',
  email: '',
};
```

### English

#### Change Theme Colors (recommended)

Edit theme files `src/themes/atom-default/light.css` and `dark.css`, adjust CSS variables:

```css
/* src/themes/atom-default/light.css */
html[data-theme='atom-default'][data-mode='light'] {
  --bg-primary: #ecedef;
  --bg-secondary: #e2e4e7;
  --text-primary: #171a1d;
  --accent: #8a5407;
  --accent-hover: #6d4005;
}
```

```css
/* src/themes/atom-default/dark.css */
html[data-theme='atom-default'][data-mode='dark'] {
  --bg-primary: #12161a;
  --text-primary: #d8dee3;
  --accent: #f2b33d;
  --accent-hover: #ffc95c;
}
```

> Light uses **dark brass** (`#8a5407`), dark uses **bright brass** (`#f2b33d`) — the same brass indicator lamp read under two different lighting conditions.

For the **full token list** (background / text / border / accent / tag / category / semantic / shadow), see [docs/THEMING.md](./docs/THEMING.md).

To replace the **entire theme** with a different palette, create your own theme directory:
```bash
npm run theme:create ocean
# Edit src/themes/ocean/light.css + dark.css
```

#### Change Layout Tokens (radius / fonts / width)

Edit `src/styles/_modules/_variables.css` (**not** in theme CSS):

```css
:root {
  --radius: 6px;
  --font-sans: 'Archivo', var(--font-cjk), system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', monospace;
}
```

#### Change Fonts

The site has exactly three font "voices". Do not mix their jobs:

| Token | Job | CJK fallback |
| --- | --- | --- |
| `--font-display` | Headings / large numerals | System sans |
| `--font-sans` | Body copy and UI text | System sans |
| `--font-mono` | **Real data only**: dates, counts, sequence numbers, scale ticks, code | Monospace |

```css
:root {
  --font-cjk: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei';
  --font-display: 'Archivo', var(--font-cjk), system-ui, sans-serif;
  --font-sans: 'Archivo', var(--font-cjk), system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', 'Fira Code', monospace;
}
```

> `Archivo` is a variable font with a `wdth` axis (`font-stretch`). The width changes in headings are where the "precision instrument" character comes from.

#### Change Site Info

Edit `src/consts.ts`:

```typescript
export const SITE_TITLE = 'Your Blog Name';  // SEO / OG / RSS title
export const SITE_NAME = 'MyBlog';           // Navbar short name
export const SITE_DESCRIPTION = '...';        // meta description
export const AUTHOR = 'Your Name';

export const SITE_LOGO = '/logos/logo.svg';
export const SITE_FAVICON = '/favicon.svg';

// Homepage Hero section (icon + title + description + buttons) is fully customizable
export const SITE_HERO_ICON = '';            // Empty -> use built-in Atom SVG
export const HERO_TITLE = 'MyBlog';          // Hero headline (HTML allowed)
export const HERO_DESCRIPTION = 'Your blog description';
export const HERO_ACTIONS = [
  { label: 'Start reading →', href: '/blog', variant: 'primary' },
  { label: 'About', href: '/about', variant: 'secondary' },
];

export const REPO_URL = 'https://github.com/yourname/yourrepo';
// ↑ Footer "Atom" link points here

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourname',     // User-customizable (Footer 🐙)
  twitter: '',
  email: '',
};
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

| Hexo (matery) 字段          | Astro 字段            | 转换规则                      |
| --------------------------- | --------------------- | ----------------------------- |
| `title`                     | `title`               | 直接保留                      |
| `date: 2025-07-14 05:23:30` | `pubDate: 2025-07-14` | 只取日期                      |
| `categories` (单值/列表)    | `category`            | 列表取第一个                  |
| `tags: [- x]`               | `tags: [x]`           | YAML → inline                 |
| `summary` / `description`   | `description`         | 自动提取正文第一段（160字符） |
| `img` / `cover` / `top_img` | `heroImage`           | 统一映射，路径规范化          |

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
var repoName = 'my-blog'; // 仓库名（根站点用空字符串）
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

## 版本号与发布流程

### 单一数据源

版本号**只写在 `package.json` 的 `version` 字段**一处：

```
package.json (version)  ──import──▶  src/consts.ts (SITE_VERSION)  ──▶  页脚显示
        │
        └── tests/version.test.ts 校验 ──▶  CHANGELOG.md 最新版本号
```

`src/consts.ts` 里不要手写版本号：

```typescript
import pkg from '../package.json';

export const SITE_VERSION = pkg.version; // 页脚显示的就是它
```

`tests/version.test.ts` 会校验三件事，任一不满足就红：

- `SITE_VERSION === package.json.version`
- `package.json.version` 是合法 semver
- `CHANGELOG.md` 最新发布版本号 === `package.json.version`（且版本号不重复、只有一个 `[Unreleased]` 段）

### 发一版

1. 把 `CHANGELOG.md` 里的 `[Unreleased]` 段改成 `[x.y.z] — YYYY-MM-DD`（保留新内容，补上小节标题）
2. 改 `package.json` 的 `version` 为 `x.y.z`
3. `npm run build && npm test && npm run lint && npm run check` 全绿
4. `git commit` + `git tag vx.y.z`
5. 推送：`git push && git push --tags`

> 第 2 步和第 1 步**必须同时做** —— 测试会盯着这两个地方的一致性。
> 页脚版本号是构建时从 `package.json` 读的，所以改完 version 重新构建即可，不用改任何组件。

### 版本号怎么定

遵循[语义化版本](https://semver.org/lang/zh-CN/)：

| 变更 | 版本位 |
|---|---|
| 修 bug、文档、样式微调 | patch（1.1.**1**） |
| 新功能、新 token、新组件 | minor（**1.**2.0） |
| 破坏性变更：删 token、改 DOM 结构、改配置字段名、主题不兼容 | major（**2**.0.0） |

历史版本号：

| 版本 | 日期 | 说明 |
|---|---|---|
| 1.1.0 | 2026-10-25 | 视觉重设计 "PRECISION LOG"、移动端适配、Astro 7.4 升级、DrawThings 品牌图标、版本号系统 |
| 1.0.0 | 2026-09-13 | 首个正式版 |

---

## 部署指南

### GitHub Pages（推荐）

1. **Settings → Pages → Source → GitHub Actions**
2. **Settings → Actions → General → Workflow permissions → Read and write**
3. 推送代码到 `main` 分支

> 💡 子路径仓库：仓库名为 `my-blog` 时自动部署到 `https://username.github.io/my-blog/`。

> 💡 Cloudflare Pages：在 Secrets 中设置 `DEPLOY_TARGET=cf`，并配置 `CF_PAGES_TOKEN`、`CF_ACCOUNT_ID`、`CF_PROJECT_NAME`。

CI（`.github/workflows/test.yml`）与部署相互独立，每次 push / PR 都会跑 `lint → test → build`。

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
