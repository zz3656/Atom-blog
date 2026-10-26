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

# Atom

**一个用 Astro 构建的现代轻量级博客** — 像 Atom 一样强大，像钢铁一样可靠

> 灵感来自电影《铁甲钢拳》(Real Steel) 中的机器人 Atom — 小巧、精准、充满力量

[![Astro](https://img.shields.io/badge/Astro-7.4-ff5d01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[🌐 在线预览](https://zz3656.github.io/Atom) · [📝 写文章](#-写文章) · [🤖 CLI 工具](#-cli-与-npm-scripts) · [🚀 部署](#-部署到-github-pages) · [⚙️ 自定义](#-自定义) · [🇬🇧 English](README_EN.md) · [📘 开发者指南](DEVELOP.md) · [🔄 Hexo 转换工具](scripts/README.md)

</div>

---

## ✨ 特性

| 特性                   | 说明                                                                           |
| ---------------------- | ------------------------------------------------------------------------------ |
| ⚡ **Astro 驱动**      | 静态 HTML + ~8.7KB minified 交互脚本（defer 加载，首屏渲染零阻塞），加载极快             |
| 🎨 **主题系统**         | 单主题站点：唯一主题 `atom-geek`（暗色磷光绿 + 亮色磷光纸），一键切换深/浅色；CSS Token 体系让开发者可拓展自定义主题；本主题另以[独立第三方主题仓](https://github.com/zz3656/atom-geek)发布          |
| 📱 **响应式设计**      | 手机汉堡菜单、平板、桌面完美适配，iOS 安全区域支持                             |
| 📝 **Markdown 写作**   | 原生支持，Shiki 代码语法高亮                                                   |
| 🤖 **CLI 工具**        | `npm run new` / `npm run list` / `npm run theme:create <id>` — 本地创建文章、生成主题       |
| 📁 **分类 + 标签**     | 分类（单数）组织文章大类，标签（可多）标注细分主题                             |
| 🚀 **双平台部署**      | GitHub Actions 自动构建，支持 GitHub Pages / Cloudflare Pages                  |
| 🔍 **SEO 友好**        | 语义化 HTML、Open Graph / Twitter Card / JSON-LD 结构化数据、Sitemap、RSS 订阅 |
| 📦 **超小体积**        | 首页 HTML ~14KB gzipped（CSS 内联，无额外请求）；单篇文章 ~18KB gzipped             |
| 💯 **Lighthouse 满分** | 在简洁页面上可达到 100/100（性能/无障碍/SEO）；内置配置：语义化 HTML、canonical、OG、Twitter Card、JSON-LD、sitemap、RSS、a11y skip-link |
| 🎚️ **Token 化设计系统** | 组件层零硬编码颜色，12 组语义表面 token 驱动全部配色，第三方主题零配置接入 |
| 📐 **刻度尺视觉语言** | 横竖刻度线贯穿全站，日志列表配标尺脊线，让"按时间排列的日志"成为可读的视觉结构 |

---

## 🖼️ 页面预览

### 首页

- Hero 区域：Atom 原子图标（冷轧钢圆盘 + 黄铜三轨道）+ 渐变大标题 + 背景光晕
- 日志行列表：竖向刻度脊线上依次排列序号、标题、日期、分类、标签
- 右上角主题切换按钮：一键深/浅色；首次访问跟随系统设置，之后记忆用户选择

### 导航栏

- 左侧：自定义 SVG Logo + 站点名称
- 居中：导航链接（首页、文章、分类、标签、关于）
- 右侧：搜索框 + 暗黑模式切换按钮
- 页脚包含 RSS 订阅链接

### 移动端体验

- **汉堡菜单**：768px 断点自动折叠导航为抽屉式菜单，带 X 形切换动画
- **日志行转纵向**：文章列表在 600px 以下改为「标题 → 日期 → 摘要 → 分类」纵向堆叠
- **零横向溢出**：320px 起全站无横向滚动条；宽表格由 rehype 插件包裹为可横向滑动容器
- **安全区域适配**：支持 iPhone 刘海屏、底部横条等安全区域
- **触控优化**：禁用 iOS 触摸高亮、文本缩放、滚动回弹；主要可点击元素热区 ≥ 24px（WCAG 2.5.8）
- **字体自适应**：多断点（1024px / 768px / 600px / 480px / 400px）渐进式字体缩放

### 文章页

- **刊头式排版**：分类 / 日期 / 阅读时长（等宽）→ 标题 → 刻度尺 → 描述 → 标签，正文首字下沉
- 阅读进度条
- 上一篇 / 下一篇导航（卡片式）

### 分类 & 标签页

- 📁 **分类列表**：紧凑标签云风格，分类名 + 文章数
- 📁 **分类详情**：列表展示该分类下所有文章
- 🏷️ **标签列表**：紧凑标签云风格，标签名 + 文章数
- 🏷️ **标签详情**：列表展示该标签下所有文章
- 所有页面标题统一为 **eyebrow 标签 + 大标题 + 刻度尺分隔线**

### 关于页

- 统一的 eyebrow + 标题 + 刻度尺
- 内容居中，项目卡片网格

---

## 📁 项目结构

```
Atom/
├── .github/                    # GitHub 配置（CI 与部署均已启用）
│   ├── dependabot.yml          # 依赖更新机器人
│   └── workflows/
│       ├── test.yml            # CI：lint → test → build
│       └── deploy.yml          # GitHub Pages / Cloudflare Pages 部署
├── scripts/
│   ├── atom-cli.mjs           # 🤖 本地 CLI（创建/列出文章）
│   ├── create-theme.mjs       # 🎨 主题脚手架（npm run theme:create <id>）
│   ├── generate-rss.mjs       # RSS Feed + 搜索索引生成
│   ├── fix-sitemap.mjs        # sitemap lastmod 修正
│   ├── minify-app-js.mjs      # app.js 压缩 + 子路径兼容
│   ├── vectorize-icon.mjs     # 位图 → 矢量（图标流水线）
│   └── convert-hexo.mjs       # Hexo 迁移工具（可选用）
├── astro-plugins/
│   ├── theme-loader.mjs       # 构建时扫描 src/themes/
│   ├── remark-img-lazy.mjs    # Markdown 图片懒加载
│   └── rehype-table-scroll.mjs # 宽表格包可横向滚动容器
├── public/
│   ├── favicon.svg            # 浏览器标签页图标
│   ├── manifest.json          # PWA 支持
│   ├── robots.txt             # 搜索引擎爬虫规则
│   ├── opensearch.xml         # 浏览器搜索插件
│   ├── logos/logo.svg         # 导航栏 Logo
│   ├── js/app.js              # 压缩后的交互脚本（构建时生成）
│   ├── _assets/               # 搜索索引（构建时生成）
│   └── medias/reward/         # 打赏二维码（可选）
├── src/
│   ├── themes/                # 🎨 主题目录（唯一主题 atom-geek）
│   ├── components/            # Astro 组件
│   │   ├── Header.astro       # 导航栏
│   │   ├── Footer.astro       # 页脚
│   │   ├── PostCard.astro     # 日志行（文章列表项）
│   │   ├── TableOfContents.astro # 文章目录（≥1280px 左侧刻度栏 / <1280px 顶部折叠条）
│   │   ├── HeroIcon.astro     # 首页 Hero 图标
│   │   └── FormattedDate.astro # 日期格式化组件
│   ├── utils/                 # 工具函数（path/date/blog/themes/collection/markdown-strip）
│   ├── styles/                # 样式模块
│   │   ├── global.css         # 主入口
│   │   └── _modules/          # 21 个 CSS 模块
│   ├── scripts/app.js         # 交互脚本源码（构建时压缩）
│   ├── generated/             # 构建期生成的主题入口（勿手改）
│   ├── content/               # 📝 Markdown 文章
│   │   └── blog/              # 文章目录（每篇一个 .md）
│   ├── layouts/               # 布局模板（BaseLayout / BlogPost）
│   ├── pages/                 # 路由页面
│   ├── consts.ts              # 站点配置（SITE_TITLE / REPO_URL / HERO_* 等）
│   ├── content.config.ts      # 内容集合 Schema（类型安全）
│   └── env.d.ts
├── tests/                     # 单元测试（Vitest）
├── docs/THEMING.md            # 主题开发指南
├── astro.config.mjs           # Astro 配置（base 自动检测 + 统一 Markdown 管线）
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

---

## 🤖 CLI 与 npm scripts

Atom 提供 npm scripts 与一个轻量 CLI (`scripts/atom-cli.mjs`)，体验类似 Hexo / Hugo 的本地工作流。
注意：CLI 只负责**创建/列出文章**；构建与部署由 GitHub Actions 自动完成。

### npm scripts

```bash
npm run dev             # 开发服务器（http://localhost:4321）
npm run build           # 生产构建（产物 dist/）
npm run preview         # 预览构建产物
npm test                # 运行单元测试
npm run check           # TypeScript 类型检查
npm run lint            # ESLint 检查
npm run format          # Prettier 格式化

# 内容管理
npm run new             # 交互式创建新文章
npm run list            # 列出所有文章

# 主题开发
npm run theme:create <id>  # 一键生成主题脚手架
```

### atom-cli.mjs（交互式创建）

除了上面的 npm scripts，还有一个 `scripts/atom-cli.mjs` 提供交互式创建文章体验：

| 命令                              | 说明                                 |
| --------------------------------- | ------------------------------------ |
| `new <标题>`                      | 创建新文章（交互式填写 frontmatter） |
| `new <标题> -c 分类`              | 指定分类                             |
| `new <标题> -t 标签1,标签2`       | 指定标签                             |
| `new <标题> -d 2026-01-01`        | 指定发布日期                         |
| `new <标题> -i /images/cover.jpg` | 指定封面图                           |
| `new <标题> --draft`              | 创建为草稿                           |
| `list`                            | 列出所有文章                         |

```bash
# 交互式（推荐新手）
$ npm run new

# 或一行命令
node scripts/atom-cli.mjs new "Astro 完全指南" \
  -c "技术教程" \
  -t "Astro,Blog,教程" \
  -d 2026-09-20

# 列出所有文章
npm run list
```

**注**：构建与部署由 GitHub Actions 自动完成（推送 main 分支即触发），不需要 `atom build` 之类的命令。

### 与 Hexo / Hugo 对比

| Hexo              | Hugo                             | Atom                                  |
| ----------------- | -------------------------------- | ------------------------------------- |
| `hexo new "标题"` | `hugo new content posts/标题.md` | `npm run new`（交互式）              |
| `hexo server`     | `hugo server`                    | `npm run dev`                         |
| `hexo generate && hexo deploy` | `hugo && rsync`        | `git push`（GitHub Actions 自动构建） |

---

## 🚀 快速开始

### 前置要求

- Node.js >= 22.23.4（Astro 7.4 的硬性要求；推荐 24 LTS）
- npm >= 10.8

### 1. 克隆项目

```bash
git clone https://github.com/zz3656/Atom.git
cd Atom
npm install
```

### 2. 本地开发

```bash
npm run dev
```

打开 **http://localhost:4321** 查看效果，修改文件实时热更新。

### 3. 构建预览

```bash
npm run build    # 构建到 dist/
npm run preview  # 本地预览构建结果
```

---

## 📝 写文章

在 `src/content/blog/` 下创建 `.md` 文件：

```markdown
---
title: 文章标题
description: 简短描述（显示在文章卡片上，建议不超过 80 字）
pubDate: 2026-09-13
category: 技术笔记 # 每篇文章一个分类
tags: [JavaScript, Astro] # 建议不超过 4 个标签，避免过长
heroImage: /images/cover.jpg # 可选：文章头部封面图
featuredImage: /images/og.jpg # 可选：SEO 专用封面图（OG / Twitter Card，1200x630）
updatedDate: 2026-09-14 # 可选：更新日期
reward: true # 可选：显示打赏码
draft: false # 可选：草稿标记（true 时不发布）
---

正文使用 Markdown 语法...
```

### Frontmatter 字段

| 字段            | 类型       | 必填 | 说明                                                                                    |
| --------------- | ---------- | ---- | --------------------------------------------------------------------------------------- |
| `title`         | `string`   | ✅   | 文章标题                                                                                |
| `description`   | `string`   | ✅   | 简短描述，显示在文章卡片（建议不超过 80 字，用户可自定义）                              |
| `pubDate`       | `date`     | ✅   | 发布日期                                                                                |
| `category`      | `string`   | ❌   | 分类名称（每篇文章只能一个）                                                            |
| `tags`          | `string[]` | ❌   | 标签列表（建议不超过 4 个，每个标签不超过 6 个字符，过长/过多会导致卡片排版错乱）       |
| `heroImage`     | `string`   | ❌   | 文章头部封面图，放在 `public/` 下                                                       |
| `featuredImage` | `string`   | ❌   | SEO 专用封面图（OG / Twitter Card）。优先于 `heroImage` 用于社交分享。尺寸建议 1200×630 |
| `updatedDate`   | `date`     | ❌   | 更新日期，显示在文章标题下方。同时作为 sitemap 的 lastmod                               |
| `reward`        | `boolean`  | ❌   | 是否在文末显示打赏码（默认关闭）                                                        |
| `draft`         | `boolean`  | ❌   | 草稿标记。`true` 时文章不会出现在列表、RSS、搜索索引中                                  |

### 样式自定义

CSS 已按功能拆分为 21 个模块（`src/styles/_modules/`），编辑对应的 `.css` 文件即可：

- `_variables.css` — 共享 token（字体栈 / 圆角 / 刻度尺几何）
- `_header.css` — 导航栏样式
- `_log.css` — 文章列表（日志行 + 竖向刻度脊线）
- `_post.css` — 文章正文排版
- `_responsive.css` — 响应式断点（1024px / 768px / 600px / 480px / 400px）

所有样式通过 `src/styles/global.css` 入口文件统一导入。

### 导航栏

导航栏在 `src/components/Header.astro` 中配置，修改 `navLinks` 数组即可增删导航项。

### 分类 vs 标签

|      | **分类 (Category)**                      | **标签 (Tag)**                              |
| ---- | ---------------------------------------- | ------------------------------------------- |
| 数量 | 每篇文章**只能一个**                     | 每篇文章可以**多个**                        |
| 用途 | 组织文章的大类（如"技术笔记""生活随笔"） | 标注文章的细分主题（如"JavaScript""Astro"） |
| 展示 | 📁 分类列表页 + 分类详情页               | 🏷️ 标签列表页 + 标签详情页                  |
| 关系 | **相互独立**，不互相影响                 |                                             |

---

## 🚀 部署到 GitHub Pages

### 自动部署（推荐）

项目已配置 GitHub Actions，推送 `main` 分支即可自动构建部署：

1. **推送代码** 到你的 GitHub 仓库
2. 进入 **Settings → Pages → Source → 选择 GitHub Actions**
3. 进入 **Settings → Actions → General → Workflow permissions → 选择 Read and write**
4. 推送代码到 `main` 分支 ✅

> 💡 **子路径仓库**：如果仓库名为 `my-blog`，则自动部署到 `https://username.github.io/my-blog/`。

> 💡 **Cloudflare Pages**：将 Secrets 中设置 `DEPLOY_TARGET=cf`，并配置 `CF_PAGES_TOKEN`、`CF_ACCOUNT_ID`、`CF_PROJECT_NAME`。

Actions 会自动：`安装依赖 → 构建 → 部署`

### 自定义域名（可选）

1. 在 `public/` 下创建 `CNAME` 文件，写入你的域名
2. 在域名服务商处添加 CNAME 记录指向 `yourusername.github.io`

---

## ⚙️ 自定义

### 1. 站点基本信息 / Logo / Favicon / 首页 Hero

**所有站点客制化只需编辑 `src/consts.ts` 一个文件**：

```typescript
export const SITE_TITLE = '我的博客'; // 站点标题（SEO、OG、RSS、页脚等）
export const SITE_NAME = 'MyBlog'; // 导航栏显示的名称
export const SITE_DESCRIPTION = '我的个人博客'; // 站点描述（meta/og/twitter）
export const AUTHOR = '张三'; // 作者名（meta author 标签）

export const SITE_LOGO = '/logos/logo.svg'; // 导航栏 Logo 路径（对应 public/logos/logo.svg）
export const SITE_FAVICON = '/favicon.svg'; // 浏览器 Favicon 路径

// 首页 Hero 区域完全可客制化（图标 + 标题 + 描述 + 按钮）
export const SITE_HERO_ICON = ''; // 留空则使用内置 Atom 原子 SVG
export const HERO_TITLE = 'MyBlog'; // Hero 标题文本（可含 HTML 标签，如 <em>）
export const HERO_DESCRIPTION = '一个简洁、快速、优雅的现代博客。';
export const HERO_ACTIONS = [
  { label: '开始阅读 →', href: '/blog', variant: 'primary' },
  { label: '关于此站', href: '/about', variant: 'secondary' },
];

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  twitter: '',
  email: '',
};
```

> 💡 **替换 Logo、Favicon、Hero 图标各独立**：
>
> 1. **Logo**（导航栏）：放入 `public/logos/logo.svg`（支持 .svg / .png / .webp），修改 `SITE_LOGO`
> 2. **Favicon**（浏览器标签页）：放入 `public/favicon.svg`，修改 `SITE_FAVICON`
> 3. **Hero 图标**（首页大标题前）：留空 `''` 走内置 SVG；如需替换，放入 `public/heroes/hero.svg`（支持 .svg / .png / .webp），修改 `SITE_HERO_ICON`
> 4. **Hero 文案 / 按钮**：直接编辑 `HERO_TITLE` / `HERO_DESCRIPTION` / `HERO_ACTIONS`；按钮可任意增删，`variant: 'primary' | 'secondary'` 控制样式，`hide: true` 跳过渲染
> 5. 不需要再修改任何组件代码！

### 2. 替换示例文章

仓库默认附带 3 篇示例文章（`src/content/blog/`），介绍项目功能与 Markdown / Astro 用法：

| 文件 | 用途 |
|---|---|
| `welcome.md` | 首次部署的欢迎页，可删除或替换 |
| `markdown-guide.md` | Markdown 语法参考，建议保留作为写作帮助 |
| `astro-blog-tutorial.md` | Atom 技术架构解析（不是 Astro 入门教程），可作为示例或删除 |

替换为你的内容：

```bash
# 删除示例
rm src/content/blog/welcome.md src/content/blog/astro-blog-tutorial.md

# 或用 CLI 交互式创建
npm run new
```

**前必读：** 每篇文章必须有完整的 frontmatter（`title` / `description` / `pubDate` / `category` / `tags`），否则构建失败。详见下方「📝 写文章」章节。

### 3. 部署平台

Atom 支持 **GitHub Pages** 和 **Cloudflare Pages** 两种部署方式，通过环境变量自动适配。

#### GitHub Pages（推荐）

通过 GitHub Actions 自动构建部署，只需：

1. 推送代码到 GitHub 仓库
2. 进入 **Settings → Pages → Source** 选择 **GitHub Actions**
3. 进入 **Settings → Actions → General** 设置 Workflow permissions 为 **Read and write permissions**
4. 推送代码到 `main` 分支 ✅

#### Cloudflare Pages（推荐用于国内访问）

**方式一：通过 GitHub 仓库绑定**

1. Cloudflare Dashboard → Pages → **Create a project** → **Git**
2. 连接 GitHub 仓库
3. 配置构建设置：

| 设置项                     | 值                     |
| -------------------------- | ---------------------- |
| **Framework preset**       | Astro                  |
| **Build command**          | `npm run build`        |
| **Build output directory** | `dist`                 |
| **Environment variables**  | `DEPLOY_TARGET` = `cf` |

4. 点击 **Save and Deploy**

**方式二：wrangler CLI 本地推送**

```bash
# 安装 wrangler
npm install -d wrangler

# Cloudflare Pages 模式构建
DEPLOY_TARGET=cf npm run build

# 本地部署
npx wrangler pages deploy dist
```

> 💡 **环境变量说明**：
>
> - `DEPLOY_TARGET=github` — GitHub Pages 模式（需要 `REPO_NAME`）
> - `DEPLOY_TARGET=cf` — Cloudflare Pages 模式（需要 `CF_DOMAIN`）
> - 不设置 — 自动检测，优先 GitHub Pages
> - `REPO_NAME` — GitHub Pages 子路径（默认 `Atom`，从 `${{ github.event.repository.name }}` 自动推导）
> - `CF_DOMAIN` — Cloudflare 自定义域名（默认 `www.inte8.top`，即对外主域名；裸域 `inte8.top` 指向同一份站点）

> ⚡ 如果默认值不满足需求，可以手动调整 `astro.config.mjs` 中的 `site` 和 `base` 字段。

```javascript
export default defineConfig({
  site: 'https://yourdomain.com', // 你的网站域名
  base: '/', // 子路径仓库填 '/your-repo-name'
  markdown: {
    shikiConfig: {
      // 自动根据暗色模式切换主题
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
```

### 3. 导航栏

导航栏项在 `src/components/Header.astro` 中配置，修改 `navLinks` 数组即可增删导航项。

布局：Logo + 站点名称在左侧，导航链接居中，搜索和主题切换在右侧。页脚已包含 RSS 订阅链接。

### 4. 页脚

Footer 展示三类信息：①用户可定制的社交链接；②自动生成的 RSS / 关于链接；③硬编码的框架品牌。

```astro
<footer class="site-footer">
  <div class="footer-content">
    <div class="footer-links">
      {/* 用户可定制：consts.ts 的 SOCIAL_LINKS.github */}
      <a href={SOCIAL_LINKS.github} title="作者 GitHub">🐙 GitHub</a>
      {/* 自动生成 */}
      <a href={rssUrl()}>📡 RSS</a>
      <a href={aboutUrl()}>👤 关于</a>
    </div>
    <p>
      © {year}
      {/* 硬编码框架品牌：与用户站点名(SITE_NAME)解耦，指向 REPO_URL */}
      <a href={REPO_URL}>{FRAMEWORK_NAME}</a>
      . Powered by <a href="https://astro.build">Astro</a>
    </p>
  </div>
</footer>
```

配置详见 `src/consts.ts`：

| 字段 | 用途 | 用户客制化？ |
|---|---|---|
| `SOCIAL_LINKS.github` | Footer 🐙 GitHub 链接 | ✅ 用户可改 |
| `REPO_URL` | 底部 "Atom" 链接，指向项目源代码仓库 | ✅ 用户必改 |
| `FRAMEWORK_NAME` | 底部 "Atom" 文字 | ❌ 硬编码框架品牌 |

### 5. 打赏二维码

二维码图片放在 `public/medias/reward/` 目录下：

```
public/medias/reward/
├── wechat.png     # 微信赞赏码（140x140 像素）
└── alipay.png     # 支付宝收款码（140x140 像素）
```

在文章 frontmatter 中设置 `reward: true` 即可在文章末尾显示打赏码。

### 6. 主题 / 换肤

因特吧自带一套精心调校的主题：**磷光终端**（暗色近黑底 `#05070a` + 磷光绿 `#00e88f`，亮色磷光纸 `#f2f6f3` + 深磷光绿 `#00794c`，青色作分类通道）。

右上角一键切换深色 / 浅色模式，**首次访问跟随系统设置**，之后记忆用户选择。

站点颜色全部通过 CSS 变量控制；布局/字体等变量位于 `src/styles/_modules/_variables.css`。

**拓展自定义主题**（主题系统基础设施已就绪）：

```bash
# 一键生成主题脚手架（含 manifest + 全部必需 token）
npm run theme:create ocean

# 单模式主题（不需要 dark）
npm run theme:create ocean --no-dark
```

然后编辑 `src/themes/ocean/light.css`（及 dark.css）。**本站只安装 atom-geek 一个主题**（单主题站点）；生成的第三方主题存放在 `src/themes/<id>/`，构建时自动被扫描加入。

如需在 UI 暴露主题选择菜单，开发者可自行扩展 `src/components/Header.astro`——基础设施（themes 数组 + data-theme 属性切换）已就绪。

完整开发指南（必需 token 列表、选择器约定、最佳实践）见 **[docs/THEMING.md](./docs/THEMING.md)**。

> 📦 **这套主题已作为独立第三方主题发布** → [zz3656/atom-geek](https://github.com/zz3656/atom-geek)（含 TUI 组件层 overlay、演示图与完整文档）。另有纯主题包仓库 [zz3656/atom-themes](https://github.com/zz3656/atom-themes)（sepia / solarized）。

### 7. 添加新页面

在 `src/pages/` 下新建 `.astro` 文件即可自动注册路由：

```
src/pages/about.astro        → /about
src/pages/links.astro        → /links
```

---

## 📊 静态博客方案对比

| 方案               | 构建输出  | JS 依赖  | 构建时间 | SEO / RSS / Sitemap              | 学习成本     |
| ------------------ | --------- | -------- | -------- | -------------------------------- | ------------ |
| **Atom（本项目）** | **~14 KB gz** | **8.7KB 原生** | **~1.5s**  | **RSS/Sitemap/JSON-LD 自动生成** | 极低         |
| Hexo + Matery      | ~15 MB    | 数十个库 | ~5s      | 需插件                           | 中           |
| Hugo               | ~2 MB     | 0        | ~0.5s    | 需插件                           | 中           |
| Jekyll             | ~3 MB     | 少量     | ~3s      | 内置                             | 中           |
| Eleventy           | ~500 KB   | 0        | ~2s      | 需插件                           | 中           |
| VitePress          | ~2 MB     | 需水合   | ~2s      | 需插件                           | 低（偏文档） |

### 本项目的优势

- **零第三方依赖** — 无前端框架；唯一的 JavaScript 是 ~8.7KB 原生脚本（搜索 / 主题切换 / 目录），Lighthouse 满分
- **一键日/夜切换** — 默认主题（日间镀锌钢 + 夜间枪铁），首次访问跟随系统设置，之后记忆用户选择；开发者可通过 `npm run theme:create` 拓展主题
- **自动 SEO** — 每篇文章自动注入 Open Graph、Twitter Card、JSON-LD 结构化数据
- **极简构建** — 构建完成后自动执行 RSS/Sitemap 生成，零配置
- **1 秒构建** — 相比 Hexo 的 5s+，依然足够快
- **TypeScript 类型安全** — 文章内容通过 Astro Content Collections Schema 校验
- **Token 化设计系统** — 12 组语义表面 token 驱动全部配色，组件层零硬编码颜色
- **刻度尺视觉语言** — 横竖刻度线贯穿全站，日志列表落在竖向刻度脊线上
- **内置客户端搜索** — 静态索引于构建期生成，交互 JS 总量约 8.7KB
- **零横向溢出** — 320px 起全站无横向滚动条；宽表格在自身容器内滚动
- **居中导航栏** — Logo 左、导航链接居中、操作区右

### 局限性

- **无后端功能** — 无法支持评论系统（可通过 Cusdis / Disqus / Giscus 等第三方接入）
- **无服务端搜索** — 静态站点无法服务端搜索（可用 Algolia 等外部服务）
- **需手动编辑** — 无后台管理界面（可直接在 GitHub 编辑 Markdown）

---

## 💰 支持本项目

如果你喜欢 Atom 博客，欢迎扫码打赏，给了我加个 🥤 饮料！

| 微信                                                                                                                          | 支付宝                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://raw.githubusercontent.com/zz3656/Atom/main/public/medias/reward/wechat.png" width="140" alt="微信赞赏码" /> | <img src="https://raw.githubusercontent.com/zz3656/Atom/main/public/medias/reward/alipay.png" width="140" alt="支付宝收款码" /> |

每一分支持都是对开源项目的最大鼓励 ❤️

---

## 📄 License

[MIT](LICENSE) — 自由使用、修改、分发。

---

<div align="center">

**如果这个项目对你有帮助，给个 ⭐ Star 吧！**

Made with ❤️ by [Atom Blog](https://github.com/zz3656/Atom) · Powered by [Astro](https://astro.build)

</div>
