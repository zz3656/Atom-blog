---
title: Atom 博客的技术架构解析
description: 从 Astro 7.4 内容集合、主题 Token 体系、构建流水线到 GitHub Pages 自动部署，完整拆解 Atom 博客是怎么从 Markdown 文件变成可访问的静态网站。
pubDate: 2026-09-19
category: tutorial
tags: [Astro, 架构, GitHub Pages, 部署, 设计系统]
---

如果你对 Atom 博客**背后的技术栈**感兴趣——它为什么能做到无框架运行时、构建产物体积小、部署到 GitHub Pages 完全免费——这篇文章会拆开五个层面：**Astro 内容集合**、**主题 Token 体系**、**Markdown 渲染管线**、**构建流水线**、**GitHub Pages 自动部署**。

## 一、为什么选 Astro

Astro 是一个现代静态站点生成器，与 Atom 的轻量化定位非常契合：

- **框架默认零 JS** —— Astro 本身不注入运行时，页面输出纯 HTML；本站只额外挂一份 `defer` 加载的交互脚本
- **内容优先** —— 原生支持 Markdown / MDX 内容集合，内置类型检查
- **构建快速** —— 基于 Vite，开发体验流畅
- **部署友好** —— 输出纯静态文件，GitHub Pages / Cloudflare Pages / Vercel 都能跑

整个 Atom 博客的**生产依赖只有 1 个**（`astro`），构建产物约 1.8MB（其中 384KB 是打赏二维码），单页 HTML gzip 后 12–18KB。

当前版本是 **Astro 7.4.2**。

## 二、内容集合（Content Collections）

Astro 的内容集合提供**类型安全的 Markdown 管理**。在 `src/content.config.ts` 定义 schema：

```ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    featuredImage: z.string().optional(), // SEO 专用封面图（优先于 heroImage 用于 OG）
    category: z.string().default(''),
    tags: z.array(z.string()).default([]),
    reward: z.boolean().optional(), // 是否在文末显示打赏码
    draft: z.boolean().optional(), // 草稿（构建时过滤）
  }),
});

export const collections = { blog };
```

文章必须严格遵守 schema，否则**构建时立即报错**——这比运行时发现要好得多。

## 三、主题系统：一切颜色都是 Token

Atom 的视觉完全由 CSS 变量驱动，组件层**不写死任何颜色**。这一点比看起来重要——早期版本的组件 CSS 里散落着 `rgba(99, 102, 241, 0.12)` 这样的字面量，结果第三方主题在暗色模式下会渲染出紫罗兰网格和霓虹青按钮，主题系统形同虚设。

现在的做法是两层 Token：

**第一层：语义色**（主题作者定义，见 `src/themes/atom-default/light.css`）

```css
html[data-theme='atom-default'][data-mode='light'] {
  --bg-primary: #ecedef;
  --text-primary: #171a1d;
  --accent: #8a5407;
  --accent-secondary: #1c6b85;
  --border-color: #d4d8dc;
  --shadow-md: 0 4px 14px rgba(23, 26, 29, 0.08);
  /* ... */
}
```

**第二层：语义表面**（组件层唯一依赖的抽象，v3 新增）

```css
  --on-accent: #ffffff;        /* 强调色实心块上的文字 */
  --header-bg: rgba(236, 237, 239, 0.86);
  --panel-bg: #f4f5f6;         /* 目录 / 面板容器 */
  --code-bg: #eff1f3;
  --grid-line: rgba(23, 26, 29, 0.035);
  --rule-tick: rgba(23, 26, 29, 0.22);      /* 刻度尺短线 */
  --rule-tick-strong: rgba(138, 84, 7, 0.55); /* 刻度尺长线 */
  --focus-ring: #8a5407;
```

组件只写 `background: var(--panel-bg)`，主题只改 Token。**新增一个主题 = 新建一个目录**，构建时 `theme-loader` 插件自动扫描 `src/themes/` 并生成 CSS 入口，零配置接入。

完整的 Token 契约见 [`docs/THEMING.md`](https://github.com/zz3656/Atom/blob/main/docs/THEMING.md)。

## 四、Markdown 渲染管线

Astro 7 把 Markdown 处理器的配置收敛到 `markdown.processor`。Atom 走 `unified()`，因为需要 remark / rehype 两级插件：

```js
// astro.config.mjs
import { unified } from '@astrojs/markdown-remark';
import remarkImgLazy from './astro-plugins/remark-img-lazy.mjs';
import rehypeTableScroll from './astro-plugins/rehype-table-scroll.mjs';

export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkImgLazy],
      rehypePlugins: [rehypeTableScroll],
    }),
  },
});
```

> ⚠️ `markdown.remarkPlugins` 顶层写法在 Astro 7 已废弃，会打印警告迁移提示。`@astrojs/markdown-remark` 在 Astro 7 中是 **peer dependency**，需要在 `devDependencies` 里显式安装。

两个插件各解决一件事：

- **`remark-img-lazy`** —— 给 Markdown 图片自动补 `loading="lazy"` 与 `decoding="async"`，但**不覆盖**作者显式写过的值。
- **`rehype-table-scroll`** —— 把 `<table>` 包进 `<div class="table-scroll">`。宽表格在 320px 窄屏上原本会把整页撑出横向滚动条；包一层 `overflow-x: auto` 之后，表格自己横向滑动，页面纹丝不动。

## 五、构建流水线

`npm run build` 的实际流程（按顺序）：

```
1. minify-app-js  (src/scripts/app.js → public/js/app.js，经 esbuild 压缩)
2. astro build:
   - theme-loader 扫描 src/themes/ → src/generated/themes.css + themes.ts
   - Markdown → HTML（含 remark / rehype 插件）
   - 生成静态文件到 dist/
3. postbuild:
   - generate-rss.mjs   (生成 RSS Feed + 搜索索引)
   - fix-sitemap.mjs    (用真实 updatedDate 替换构建时间)
```

`theme-loader.mjs` 这个 Astro 插件是关键——它**构建时**扫描 `src/themes/` 目录，自动生成主题清单和 CSS 入口。

交互脚本只有一份：压缩后约 **8.7KB**（原始 18.3KB，gzip 后 3.4KB），负责主题切换、汉堡菜单、搜索、回到顶部、代码复制、图片放大、阅读进度和目录高亮。

## 六、GitHub Actions 自动部署

`.github/workflows/deploy.yml` 配置：

```yaml
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24        # Astro 7.4 要求 Node >= 22.23.4
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          DEPLOY_TARGET: github    # 触发 base='/repo-name' 子路径模式
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    environment:
      name: github-pages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

`astro.config.mjs` 检测 `DEPLOY_TARGET=github` 环境变量，自动设置 `base='/Atom'`，所有 HTML 中的链接自动加前缀。

## 七、子路径部署怎么处理

GitHub Pages 把 `dist/` 整个目录服务在 `https://<user>.github.io/Atom/` 下，**不是根目录**。于是 `/js/app.js` 这类绝对路径会 404。

Atom 的做法是**不让任何一处硬编码路径**。`src/utils/path.ts` 统一封装：

```ts
const base = import.meta.env.BASE_URL;

export function withBase(path: string) {
  return base === '/' || base === '' ? path : `${base}${path}`;
}

export function blogPostUrl(slug: string) {
  return withBase(`/blog/${slug}/`);
}

export function baseAssetsPath(path: string) {
  return withBase(path);
}
```

所有组件通过 `baseAssetsPath()` / `blogPostUrl()` 取路径，`base` 变了链接自动跟着变。静态资源同理——`<script src={baseAssetsPath('/js/app.js')}>` 在子路径部署下会解析成 `/Atom/js/app.js`，而 `public/js/app.js` 恰好被复制到 `dist/js/app.js`，路径吻合。

这比早期"预复制一份到 `public/<base>/js/`"的做法更干净：少一份冗余产物，也不用维护 base 相关的构建分支。

## 八、进一步学习

- 📖 [Astro 官方文档](https://docs.astro.build)
- 📖 [Content Collections 指南](https://docs.astro.build/en/guides/content-collections/)
- 📖 [Markdown 处理插件](https://docs.astro.build/en/guides/markdown-content/)
- 📖 [GitHub Pages 部署](https://docs.astro.build/en/guides/deploy/github/)
- 📖 [Markdown 语法参考](https://commonmark.org/)
- 🎨 [Atom 博客](https://zz3656.github.io/Atom) — 上面所有理念的实际应用
