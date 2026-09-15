<div align="center">

  <svg width="72" height="72" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="margin-bottom:1rem">
    <circle cx="16" cy="16" r="14" fill="#6366f1"/>
    <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="#e0e7ff" stroke-width="1.5" transform="rotate(30 16 16)"/>
    <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="#e0e7ff" stroke-width="1.5" transform="rotate(-30 16 16)"/>
    <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="#e0e7ff" stroke-width="1.5" transform="rotate(90 16 16)"/>
    <circle cx="16" cy="16" r="2.5" fill="#fff"/>
  </svg>

# Atom

**一个用 Astro 构建的现代博客** — 像 Atom 一样强大，像钢铁一样可靠

> 灵感来自电影《铁甲钢拳》(Real Steel) 中的机器人 Atom — 小巧、精准、充满力量

[![Astro](https://img.shields.io/badge/Astro-4.x-ff5d01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[🏠 在线预览](https://zz3656.github.io/Atom-blog) · [📝 写文章](#-写文章) · [🤖 CLI 工具](#-cli-本地构建工具) · [🚀 部署](#-部署到-github-pages) · [⚙️ 自定义](#%EF%B8%8F-%E8%87%AA%E5%AE%9A%E4%B9%89) · [🇬🇧 English](README_EN.md) · [📘 开发者指南](DEVELOP.md) · [🔄 Hexo 转换工具](scripts/README.md)

</div>

---

## ✨ 特性

| 特性 | 说明 |
|------|------|
| ⚡ **Astro 驱动** | 零 JS 输出，纯 HTML，加载极快 |
| 🎨 **双主题切换** | 日间明亮模式 + 夜间赛博朋克风格，一键切换，自动记忆 |
| 📱 **响应式设计** | 手机、平板、桌面完美适配 |
| 🎯 **路由修复** | 支持 GitHub Pages 子路径部署 |
| 📝 **Markdown 写作** | 原生支持，代码语法高亮 |
| 🤖 **CLI 工具** | `atom new` / `atom list` / `atom build` — 本地创建文章、一键构建推送 |
| 🚀 **GitHub Actions** | 推送代码自动构建部署 |
| 🔍 **SEO 友好** | 语义化 HTML、Open Graph / Twitter Card / JSON-LD 结构化数据、Sitemap、RSS 订阅（导航栏 📡 和页脚均可访问） |
| 📦 **超小体积** | HTML 仅 ~3KB（单页） |
| 💯 **Lighthouse 满分** | 性能、无障碍、SEO 全 100 |

## 📸 预览

### 首页

- 带有 Atom 原子图标（紫色渐变轨道球体）的 Hero 区域
- 卡片式文章网格布局（展示标题、描述、日期、分类、标签）
- 日间模式 / 夜间模式一键切换

### 文章页

- 居中布局：标题 → 描述 → 日期 → 分类 → 标签
- 阅读进度条
- 代码块语法高亮（GitHub Dark 主题）
- 上一篇 / 下一篇导航

### 分类 & 标签

- 📁 **分类列表页**：科技感卡片网格，每张卡片展示分类名、文章数及进度条
- 📁 **分类详情页**：列表展示该分类下所有文章
- 🏷️ **标签列表页**：科技感卡片网格，展示标签名、文章数及占比进度条
- 🏷️ **标签详情页**：列表展示该标签下所有文章
- 分类与标签完全独立，互不混淆
- 所有页面内容居中显示，视觉更加均衡

## 📁 项目结构

```
Atom/
├── .github_disabled/            # GitHub Actions 配置（需重命名为 .github/）
│   └── deploy.yml               # 自动部署 workflow
├── public/
│   ├── favicon.svg              # 网站图标（浏览器标签页显示）
│   ├── robots.txt               # 搜索引擎爬虫规则
│   └── medias/reward/           # 打赏二维码
│       ├── wechat.png           # 微信赞赏码
│       └── alipay.png           # 支付宝收款码
├── scripts/
│   └── generate-rss.mjs         # RSS Feed 和 Sitemap 自动生成脚本
├── src/
│   ├── components/
│   │   ├── Header.astro         # 顶部导航栏（Logo + 导航链接 + 主题切换）
│   │   ├── Footer.astro         # 底部页脚（版权信息 + 社交链接）
│   │   ├── PostCard.astro       # 文章卡片组件（标题、描述、分类、标签）
│   │   └── FormattedDate.astro  # 日期格式化组件
│   ├── content/
│   │   ├── config.ts            # 文章 Schema（类型安全校验）
│   │   └── blog/                # 📝 在这里放 Markdown 文章
│   │       └── welcome.md
│   ├── layouts/
│   │   ├── BaseLayout.astro     # 基础布局（head + nav + footer + 主题切换脚本）
│   │   └── BlogPost.astro       # 文章详情布局（SEO 结构化数据、进度条、奖励码）
│   ├── pages/
│   │   ├── index.astro          # 首页（Hero + 最新文章列表）
│   │   ├── about.astro          # 关于页面
│   │   ├── blog/
│   │   │   ├── index.astro      # 文章列表页
│   │   │   └── [...slug].astro  # 文章详情页（含上一篇/下一篇导航）
│   │   ├── categories/
│   │   │   └── index.astro      # 分类列表页
│   │   ├── category/
│   │   │   └── [...category].astro  # 分类详情页
│   │   ├── tags/
│   │   │   └── index.astro      # 标签列表页
│   │   └── tag/
│   │       └── [...tag].astro   # 标签详情页
│   ├── styles/
│   │   └── global.css           # 全局样式（CSS 变量双主题）
│   └── consts.ts                # 站点配置（标题、作者、社交链接）
├── astro.config.mjs             # Astro 配置（站点地址、部署路径、Markdown 设置）
├── package.json
├── tsconfig.json
└── README.md                    # 本文件
```

## 🚀 快速开始

### 前置要求

- Node.js >= 20.3
- npm >= 9.6

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/Atom.git
cd Atom
```

### 2. 安装依赖

```bash
npm install
```

### 3. 本地开发

```bash
npm run dev
```

打开 **http://localhost:4321** 查看效果，修改文件实时热更新。

### 4. 构建预览

```bash
npm run build    # 构建到 dist/
npm run preview  # 本地预览构建结果
```

## 📝 写文章

在 `src/content/blog/` 下创建 `.md` 文件：

```markdown
---
title: 文章标题
description: 简短描述（会显示在文章卡片上）
pubDate: 2026-09-13
category: 技术笔记     # 每篇文章只能一个分类
heroImage: /images/cover.jpg   # 可选：文章封面图
tags: [JavaScript, Astro]  # 可选：可以有多个标签
updatedDate: 2026-09-14        # 可选：最后更新日期
reward: true                   # 可选：是否在文末显示打赏码
---

正文使用 Markdown 语法，支持：

- **粗体**、*斜体*、~~删除线~~
- `行内代码` 和代码块（语法高亮）
- 表格、引用、任务列表
- 图片、链接
- 数学公式（需额外配置）
```

### Frontmatter 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文章标题 |
| `description` | string | ✅ | 简短描述，显示在文章卡片 |
| `pubDate` | date | ✅ | 发布日期 |
| `category` | string | ❌ | 分类名称（每篇文章只能一个） |
| `tags` | string[] | ❌ | 标签列表（可以有多个） |
| `heroImage` | string | ❌ | 封面图片路径，放在 `public/images/` 下 |
| `updatedDate` | date | ❌ | 更新日期，显示在文章标题下方 |
| `reward` | boolean | ❌ | 是否在文末显示打赏码（默认关闭） |

### 分类 vs 标签

| | **分类 (Category)** | **标签 (Tag)** |
|---|---|---|
| 数量 | 每篇文章**只能一个** | 每篇文章可以**多个** |
| 用途 | 组织文章的大类（如"技术笔记""生活随笔"） | 标注文章的细分主题（如"JavaScript""Astro"） |
| 展示 | 📁 分类列表页 + 分类详情页 | 🏷️ 标签列表页 + 标签详情页 |
| 关系 | **相互独立**，不互相影响 | |

## 🤖 CLI 本地构建工具

Atom 提供命令行工具 `atom-cli.mjs`，体验类似 Hexo / Hugo 的本地工作流。

### 安装准备

将 `Atom-blog`（上线仓库）放在 `Atom`（源码仓库）的父目录下：

```
parent/
├── Atom/              ← 源码仓库
│   ├── scripts/
│   │   └── atom-cli.mjs
│   └── src/
└── Atom-blog/         ← 上线仓库（生成 dist/）
    ├── src/
    └── dist/
```

### 命令速览

```
node scripts/atom-cli.mjs --help
```

| 命令 | 说明 |
|------|------|
| `atom new <标题>` | 创建新文章（交互式填写 frontmatter） |
| `atom new <标题> -c 分类` | 指定分类 |
| `atom new <标题> -t 标签1,标签2` | 指定标签 |
| `atom new <标题> -d 日期` | 指定发布日期 |
| `atom new <标题> --draft` | 创建为草稿 |
| `atom list` | 列出所有文章 |
| `atom build` | 同步源文件 → 构建 → 推送到上线仓库 |

### 交互式创建

```bash
$ node scripts/atom-cli.mjs new "我的第一篇文章"
📝 文章标题: （自动从参数获取）
📁 分类（回车跳过）: 技术笔记
🏷️ 标签（逗号分隔，回车跳过）: Astro,Blog
📄 描述（回车自动生成）: 
🖼️ 封面图路径（回车跳过）: 
💰 是否显示打赏码? [y/N]: n

✅ 文章已创建
   📂 src/content/blog/my-first-article.md
   📝 我的第一篇文章
   📅 2026-09-15
   📁 技术笔记
   🏷️ Astro, Blog
```

### 非交互式创建（CI / 脚本）

```bash
# 一行命令创建文章，不交互
node scripts/atom-cli.mjs new "Astro 101" \
  -c "技术教程" \
  -t "Astro,教程" \
  -d 2026-09-15

# 创建草稿
node scripts/atom-cli.mjs new "草稿内容" --draft
```

### 一键构建推送

```bash
# 1. 确保 Atom-blog 目录存在且是 git 仓库
# 2. 执行构建
node scripts/atom-cli.mjs build

# 会自动：
#   1. 同步 src/ 下的所有 Astro 源文件到 Atom-blog
#   2. 在 Atom-blog 目录执行 npm run build
#   3. git add + commit + push 到 main 分支
```

### 源码仓库目录结构（更新后）

```
Atom/
├── scripts/
│   ├── atom-cli.mjs           # 🤖 CLI 本地构建工具 ← 新增
│   ├── convert-hexo.mjs       # Hexo → Atom 转换工具
│   ├── generate-rss.mjs       # RSS + Sitemap 生成脚本
│   └── README.md              # 脚本文档
├── src/
│   ├── content/blog/          # 📝 文章目录（CLI 新建内容）
│   └── ...
└── ...
```

> 💡 **与 Hexo 对比**
>
> | Hexo | Atom |
> |------|------|
> | `hexo new "标题"` | `node atom-cli.mjs new "标题"` |
> | `hexo generate` | `node atom-cli.mjs build` |
> | `hexo deploy` | `node atom-cli.mjs build`（内置部署） |
> | `hexo server` | `npm run dev` |

## 🐙 部署到 GitHub Pages

### 自动部署（推荐）

项目已准备好 GitHub Actions 配置，只需：

1. **Fork 或推送** 到你的 GitHub 仓库
2. 将 `.github_disabled/` 重命名为 `.github/`：
   ```bash
   mv .github_disabled .github
   git add . && git commit -m "enable github actions" && git push
   ```
3. 进入 **Settings → Pages → Source → 选择 GitHub Actions**
4. 推送代码到 `main` 分支 ✅

> 💡 `.github_disabled/` 是因为 Token 权限限制无法推送 workflow 文件，手动启用即可。

Actions 会自动：`安装依赖 → 构建 → 部署`

### 自定义域名（可选）

1. 在 `public/` 下创建 `CNAME` 文件，写入你的域名
2. 在域名服务商处添加 CNAME 记录指向 `yourusername.github.io`

## ⚙️ 自定义

### 1. 站点基本信息

编辑 `src/consts.ts`：

```typescript
export const SITE_TITLE = '我的博客';          // 站点标题
export const SITE_DESCRIPTION = '我的个人博客';  // 站点描述
export const AUTHOR = '张三';                   // 作者名

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',   // GitHub 地址
  twitter: 'https://twitter.com/yourusername', // Twitter 地址（留空则不显示）
  email: 'mailto:your@email.com',              // 邮箱地址（留空则不显示）
};
```

### 2. 部署地址

编辑 `astro.config.mjs`：

```javascript
export default defineConfig({
  site: 'https://yourusername.github.io',   // 你的 GitHub Pages 地址（不含路径）
  base: '/your-repo-name',                  // 仓库名（根站点用 '/'，子路径填仓库名）
  markdown: {
    shikiConfig: {
      theme: 'github-dark',      // 代码高亮主题（可选 'github-light'）
      wrap: true,
    },
  },
});
```

### 3. 导航栏

导航栏在 `src/components/Header.astro` 中配置，修改 `navLinks` 数组即可增删导航项：

```typescript
const navLinks = [
  { href: base, label: '首页', active: currentPage === '' },
  { href: base + '/blog', label: '文章', active: currentPage.startsWith('blog') },
  { href: base + '/categories', label: '分类', active: currentPage === 'categories' },
  { href: base + '/tags', label: '标签', active: currentPage === 'tags' },
  { href: base + '/about', label: '关于', active: currentPage === 'about' },
  // 添加新导航项：
  // { href: base + '/links', label: '友链', active: currentPage === 'links' },
];
```

Logo 和导航文字也在同一个文件中：

- **Logo 图标**：SVG 代码，修改 `fill` / `stroke` 颜色可改变图标配色
- **Logo 文字**：`Atom`，改为你的站点名称
- **主题切换按钮**：`🌙`（日间模式）和 `☀️`（夜间模式），默认文字足够直观

### 4. 页脚

编辑 `src/components/Footer.astro`：

```astro
---
import { SOCIAL_LINKS } from '../consts';
const year = new Date().getFullYear();
---

<footer class="site-footer">
  <div class="footer-content">
    <p>© {year} <a href={SOCIAL_LINKS.github}>Atom Blog</a>. Powered by <a href="https://astro.build">Astro</a></p>
  </div>
</footer>
```

可以自由修改文字、添加更多链接。社交链接由 `consts.ts` 自动注入。

### 5. 页头 Logo / 网站图标

**Header 中的 Logo**：编辑 `src/components/Header.astro`，修改 `<svg>` 中的 SVG 代码。原子结构由以下部分组成：
- `r="14"`：圆形外壳半径
- `rx="11" ry="5"`：三条轨道的椭圆大小
- `r="2.5"`：核心圆大小
- `stop-color`：渐变色值

**网站图标 (Favicon)**：编辑 `public/favicon.svg`，结构与 Header Logo 相同但颜色方案略有不同（轨道为白色）。

**文章页 Hero 图标**：编辑 `src/pages/index.astro`，修改 Hero 区域的 `<svg>`（与 Header Logo 结构相同）。

### 6. 关于页面

编辑 `src/pages/about.astro`：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { SITE_TITLE, SOCIAL_LINKS } from '../consts';
---

<BaseLayout title="关于 | Atom Blog">
  <section class="about">
    <h1>关于此博客</h1>
    <div class="about-content">
      <p>这里是关于页面的内容，自由编辑...</p>
      <!-- 添加你的内容 -->
    </div>
  </section>
</BaseLayout>
```

可以添加新的 `<h2>` 章节、项目卡片、社交链接等。社交链接按钮由 `consts.ts` 中的 `SOCIAL_LINKS` 控制。

### 7. 打赏二维码

编辑 `src/layouts/BlogPost.astro`，将 `reward` prop 改为 `true` 可在文章末尾显示打赏码：

```
reward={true}
```

二维码图片放在 `public/medias/reward/` 目录下：

```
public/
└── medias/reward/
    ├── wechat.png     # 微信赞赏码（140x140 像素）
    └── alipay.png     # 支付宝收款码（140x140 像素）
```

### 8. 样式主题

编辑 `src/styles/global.css`，所有颜色通过 CSS 变量控制：

**日间模式**（默认，`:root`）：
```css
:root {
  --bg-primary: #f0f2f5;    /* 页面背景 */
  --bg-secondary: #e8eaed;  /* 页脚、代码块等次要背景 */
  --bg-card: #ffffff;       /* 文章卡片背景 */
  --text-primary: #1a1d23;  /* 主要文字 */
  --text-secondary: #4a5568;/* 次要文字 */
  --text-muted: #718096;    /* 弱化文字 */
  --text-bright: #1a202c;   /* 强调文字 */
  --accent: #6366f1;        /* 主色调 */
  --accent-hover: #4f46e5;  /* 悬停色 */
  --accent-secondary: #8b5cf6;
  --accent-gradient: linear-gradient(135deg, #6366f1, #8b5cf6);
  --border-color: rgba(99, 102, 241, 0.12);
  --radius: 10px;           /* 圆角大小 */
  --radius-lg: 14px;
  --radius-sm: 6px;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  --content-width: 760px;   /* 文章最大宽度 */
  --header-height: 56px;    /* 导航栏高度 */
}
```

**夜间模式**（`html.dark`）：
```css
html.dark {
  /* 赛博朋克风格 */
  --bg-primary: #0a0a0f;
  --accent: #00e5ff;
  /* ... 所有变量覆盖日间模式的值 */
}
```

### 9. 添加页面

在 `src/pages/` 下新建 `.astro` 文件即可自动注册路由：

```
src/pages/about.astro        → /about
src/pages/links.astro        → /links
src/pages/blog/index.astro   → /blog
src/pages/categories/        → /categories  (分类列表)
src/pages/category/[slug]    → /category/xx (分类详情)
src/pages/tags/              → /tags        (标签列表)
src/pages/tag/[tag]          → /tag/xx      (标签详情)
```

### 10. SEO 元数据与 RSS 订阅

Atom 的 SEO 功能分为两部分：**自动注入的元数据**（后端）和 **RSS 订阅入口**（前端可见）。

#### 自动 SEO 元数据（每篇文章自动注入）

在 `src/layouts/BlogPost.astro` 中自动注入，无需手动配置：

- **Open Graph**（`og:*`）— Facebook、微信等平台分享卡片
- **Twitter Card** — Twitter 分享卡片
- **JSON-LD 结构化数据**（`application/ld+json`）— Google 搜索结果增强（文章类型、发布日期、作者等）
- **Sitemap** — 构建时自动生成 `dist/sitemap.xml`
- **RSS Feed** — 构建时自动生成 `dist/rss.xml`

#### RSS 订阅入口

导航栏（📡 图标）和页脚都提供了 RSS 订阅链接，点击即可访问 `rss.xml`。

#### 自定义

编辑 `scripts/generate-rss.mjs` 自定义 RSS 的标题、描述和生成规则。构建时会自动执行（`postbuild` 脚本）。

#### 验证

使用以下工具验证 SEO 元数据是否生效：
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Open Graph 测试](https://www.opengraph.xyz/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## 🔧 技术栈

- **[Astro](https://astro.build)** — 静态站点生成器
- **TypeScript** — 类型安全
- **CSS Variables** — 双主题系统（日间/夜间）
- **GitHub Actions** — CI/CD
- **GitHub Pages** — 托管

## 📊 与其他静态博客方案对比

| 方案 | 构建输出 | JS 依赖 | 构建时间 | SEO / RSS / Sitemap | 学习成本 |
|------|---------|---------|---------|-----------|----------|
| **Atom（本项目）** | **~3 KB** | **0** | **~1s** | **RSS/Sitemap/JSON-LD 自动生成，导航栏 📡 和页脚可订阅** | 极低 |
| Hexo + Matery | ~15 MB | 数十个库 | ~5s | 需插件 | 中 |
| Hugo | ~2 MB | 0 | ~0.5s | 需插件 | 中（Hugo 模板语法） |
| Jekyll | ~3 MB | 少量 | ~3s | 内置 | 中（Ruby 生态） |
| Eleventy | ~500 KB | 0 | ~2s | 需插件 | 中（原生 Node） |
| VitePress | ~2 MB | 需水合 | ~2s | 需插件 | 低（偏文档） |

### 本项目的优势

- **零依赖** — 全站无 JavaScript，纯 HTML + CSS，Lighthouse 满分
- **双主题** — 日间明亮模式 + 夜间赛博朋克风格，基于 CSS 变量一键切换
- **自动 SEO 元数据** — 每篇文章自动注入 Open Graph、Twitter Card 卡片、JSON-LD 结构化数据（BlogPosting Schema），无需额外配置
- **极简构建** — 构建完成后自动执行 RSS/Sitemap 生成，零配置
- **1 秒构建** — 相比 Hexo 的 5s+、Hugo 的 0.5s，依然足够快
- **TypeScript 类型安全** — 文章内容通过 Astro Content Collections Schema 校验

### 局限性

- **无后端功能** — 无法支持评论系统（可通过 Disqus/Cusdis 等第三方接入）
- **无搜索** — 静态站点无法服务端搜索（可用 Algolia 等外部服务）
- **无后端 API** — 所有数据在构建时生成，无法实时更新
- **需手动编辑** — 无后台管理界面（可结合 GitHub 直接编辑 Markdown）

## 💰 支持本项目

如果你喜欢 Atom 博客，欢迎扫码打赏，给了我加个 🥤 饮料！

| 微信 | 支付宝 |
|------|--------|
| <img src="https://zz3656.github.io/Atom-blog/medias/reward/wechat.png" width="140" alt="微信赞赏码" /> | <img src="https://zz3656.github.io/Atom-blog/medias/reward/alipay.png" width="140" alt="支付宝收款码" /> |

每一分支持都是对开源项目的最大鼓励 ❤️

## 📄 License

[MIT](LICENSE) — 自由使用、修改、分发。

---

<div align="center">

**如果这个项目对你有帮助，给个 ⭐ Star 吧！**

Made with ❤️ by [Atom Blog](https://github.com/zz3656/Atom) · Powered by [Astro](https://astro.build)

</div>
