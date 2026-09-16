<div align="center">

  <svg width="72" height="72" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="margin-bottom:1rem">
    <circle cx="16" cy="16" r="14" fill="#6366f1"/>
    <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="#e0e7ff" stroke-width="1.5" transform="rotate(30 16 16)"/>
    <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="#e0e7ff" stroke-width="1.5" transform="rotate(-30 16 16)"/>
    <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="#e0e7ff" stroke-width="1.5" transform="rotate(90 16 16)"/>
    <circle cx="16" cy="16" r="2.5" fill="#fff"/>
  </svg>

# Atom

**一个用 Astro 构建的现代轻量级博客** — 像 Atom 一样强大，像钢铁一样可靠

> 灵感来自电影《铁甲钢拳》(Real Steel) 中的机器人 Atom — 小巧、精准、充满力量

[![Astro](https://img.shields.io/badge/Astro-4.x-ff5d01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[🌐 在线预览](https://zz3656.github.io/Atom) · [📝 写文章](#-写文章) · [🤖 CLI 工具](#-cli-本地构建工具) · [🚀 部署](#-部署到-github-pages) · [⚙️ 自定义](#%EF%B8%8F-自定义) · [🇬🇧 English](README_EN.md) · [📘 开发者指南](DEVELOP.md) · [🔄 Hexo 转换工具](scripts/README.md)

</div>

---

## ✨ 特性

| 特性 | 说明 |
|------|------|
| ⚡ **Astro 驱动** | 零 JS 输出，纯 HTML，加载极快 |
| 🎨 **双主题切换** | 日间明亮模式 + 夜间赛博朋克风格，一键切换，自动记忆 |
| 📱 **响应式设计** | 手机汉堡菜单、平板、桌面完美适配，iOS 安全区域支持 |
| 📝 **Markdown 写作** | 原生支持，Shiki 代码语法高亮 |
| 🤖 **CLI 工具** | `atom new` / `atom list` / `atom build` — 本地创建文章、一键构建推送 |
| 📁 **分类 + 标签** | 分类（单数）组织文章大类，标签（可多）标注细分主题 |
| 🚀 **GitHub Actions** | 推送代码自动构建部署 |
| 🔍 **SEO 友好** | 语义化 HTML、Open Graph / Twitter Card / JSON-LD 结构化数据、Sitemap、RSS 订阅 |
| 📦 **超小体积** | HTML 仅 ~3KB（单页） |
| 💯 **Lighthouse 满分** | 性能、无障碍、SEO 全 100 |

---

## 🖼️ 页面预览

### 首页
- Hero 区域：Atom 原子图标（紫色渐变轨道球体）+ 渐变大标题 + 背景光晕
- 卡片网格布局：展示标题、描述、日期、分类、标签
- 日间 / 夜间模式一键切换

### 移动端体验
- **汉堡菜单**：768px 断点自动折叠导航为抽屉式菜单，带 X 形切换动画
- **横向卡片转纵向**：文章列表在移动端自动切换为纵向卡片
- **安全区域适配**：支持 iPhone 刘海屏、底部横条等安全区域
- **触控优化**：禁用 iOS 触摸高亮、文本缩放、滚动回弹
- **字体自适应**：多断点（768px / 480px）渐进式字体缩放

### 文章页
- **居中渐变标题** → 描述 → 日期 / 更新日 → 分类 + 标签
- 阅读进度条
- 上一篇 / 下一篇导航（卡片式）

### 分类 & 标签页
- 📁 **分类列表**：紧凑标签云风格，分类名 + 文章数
- 📁 **分类详情**：列表展示该分类下所有文章
- 🏷️ **标签列表**：紧凑标签云风格，标签名 + 文章数
- 🏷️ **标签详情**：列表展示该标签下所有文章
- 所有页面标题统一为**渐变标题 + 底部发光装饰线**

### 关于页
- 统一渐变标题
- 内容居中，项目卡片网格

---

## 📁 项目结构

```
Atom/
├── scripts/
│   ├── atom-cli.mjs           # 🤖 CLI 本地构建工具
│   ├── convert-hexo.mjs       # Hexo → Atom 转换工具
│   ├── generate-rss.mjs       # RSS + Sitemap 生成脚本
│   └── README.md              # 脚本使用文档
├── public/
│   ├── favicon.svg            # 网站图标
│   ├── robots.txt             # 搜索引擎爬虫规则
│   └── medias/reward/         # 打赏二维码（可选）
├── src/
│   ├── components/            # Astro 组件
│   │   ├── Header.astro       # 导航栏 + 暗黑模式切换
│   │   ├── Footer.astro       # 页脚 + 社交链接
│   │   ├── PostCard.astro     # 文章卡片
│   │   └── FormattedDate.astro # 日期格式化组件
│   ├── content/
│   │   ├── config.ts          # 文章 Schema 校验
│   │   └── blog/              # 📝 Markdown 文章目录
│   ├── layouts/
│   │   ├── BaseLayout.astro   # 全局布局（head + nav + footer）
│   │   └── BlogPost.astro     # 文章布局（SEO + 进度条 + prev/next）
│   ├── pages/                 # 路由页面
│   │   ├── index.astro        # 首页
│   │   ├── about.astro        # 关于页
│   │   ├── 404.astro          # 404 页
│   │   ├── blog/              # 文章列表 & 详情
│   │   ├── categories/        # 分类列表
│   │   ├── category/          # 分类详情
│   │   ├── tags/              # 标签列表
│   │   └── tag/               # 标签详情
│   ├── styles/
│   │   └── global.css         # 全局样式 + CSS 变量
│   ├── consts.ts              # 站点配置
│   └── env.d.ts               # TypeScript 类型声明
├── astro.config.mjs           # Astro 配置
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🤖 CLI 本地构建工具

Atom 提供命令行工具 `atom-cli.mjs`，体验类似 Hexo / Hugo 的本地工作流。

### 目录结构要求

将 `Atom-blog`（上线仓库）放在 `Atom`（源码仓库）的**同级目录**：

```
parent/
├── Atom/              ← 源码仓库（在此运行 CLI）
│   ├── scripts/
│   │   └── atom-cli.mjs
│   └── src/
└── Atom-blog/         ← 上线仓库（生成 dist/）
    ├── src/
    └── dist/
```

### 命令速览

```bash
# 查看帮助
node scripts/atom-cli.mjs --help
```

| 命令 | 说明 |
|------|------|
| `new <标题>` | 创建新文章（交互式填写 frontmatter） |
| `new <标题> -c 分类` | 指定分类 |
| `new <标题> -t 标签1,标签2` | 指定标签 |
| `new <标题> -d 2026-01-01` | 指定发布日期 |
| `new <标题> -i /images/cover.jpg` | 指定封面图 |
| `new <标题> --draft` | 创建为草稿 |
| `list` | 列出所有文章 |
| `build` | 同步源文件 → 构建 → 推送上线 |

### 交互式创建

```bash
$ node scripts/atom-cli.mjs new "我的第一篇文章"
📝 文章标题: （从参数自动获取）
📁 分类（回车跳过）: 技术笔记
🏷️ 标签（逗号分隔，回车跳过）: Astro, Blog
📄 描述（每篇文章必填，简短概括文章内容，建议不超过 80 字）:
🖼️ 封面图路径（回车跳过）:

✅ 文章已创建
   📂 src/content/blog/my-first-article.md
   📝 我的第一篇文章
   📅 2026-09-15
   📁 技术笔记
   🏷️ Astro, Blog
```

### 非交互式创建（一行命令）

```bash
# 创建文章，不弹窗交互
node scripts/atom-cli.mjs new "Astro 完全指南" \
  -c "技术教程" \
  -t "Astro,Blog,教程" \
  -d 2026-09-15

# 创建草稿
node scripts/atom-cli.mjs new "草稿内容" --draft
```

### 一键构建推送

```bash
node scripts/atom-cli.mjs build
```

自动执行：
1. 同步 `src/` 下所有 `.astro` 源文件到 `Atom-blog/`
2. 在 `Atom-blog/` 执行 `npx astro build`
3. `git add -A && git commit && git push origin main`

### 与 Hexo / Hugo 对比

| Hexo | Hugo | Atom |
|------|------|------|
| `hexo new "标题"` | `hugo new content posts/标题.md` | `node atom-cli.mjs new "标题"` |
| `hexo generate` | `hugo` | `node atom-cli.mjs build` |
| `hexo deploy` | (手动) | `node atom-cli.mjs build`（内置推送） |
| `hexo server` | `hugo server` | `npm run dev` |

---

## 🚀 快速开始

### 前置要求

- Node.js >= 20.3
- npm >= 9.6

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
category: 技术笔记         # 每篇文章一个分类
tags: [JavaScript, Astro]  # 建议不超过 4 个标签，避免过长
heroImage: /images/cover.jpg  # 可选：封面图
updatedDate: 2026-09-14     # 可选：更新日期
reward: true                # 可选：显示打赏码
---

正文使用 Markdown 语法...
```

### Frontmatter 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | ✅ | 文章标题 |
| `description` | `string` | ✅ | 简短描述，显示在文章卡片（建议不超过 80 字，用户可自定义） |
| `pubDate` | `date` | ✅ | 发布日期 |
| `category` | `string` | ❌ | 分类名称（每篇文章只能一个） |
| `tags` | `string[]` | ❌ | 标签列表（建议不超过 4 个，每个标签不超过 6 个字符，过长/过多会导致卡片排版错乱） |
| `heroImage` | `string` | ❌ | 封面图片路径，放在 `public/` 下 |
| `updatedDate` | `date` | ❌ | 更新日期，显示在文章标题下方 |
| `reward` | `boolean` | ❌ | 是否在文末显示打赏码（默认关闭） |

### CSS 样式自定义

编辑 `src/styles/global.css`，移动端断点也已集成在同一个文件中：

```css
/* 768px 断点：汉堡菜单 + 纵向卡片 */
@media (max-width: 768px) {
  .nav-toggle { display: flex; }        /* 汉堡按钮显示 */
  .nav-links   { display: none; }        /* 导航隐藏 */
  .nav-links.open { display: flex; }     /* 打开时显示 */
}

/* 480px 断点：极小屏幕进一步缩放 */
@media (max-width: 480px) {
  .hero h1         { font-size: 1.6rem; }
  .post-card-title { font-size: 1.05rem; }
}
```

### 导航栏

导航栏在 `src/components/Header.astro` 中配置，修改 `navLinks` 数组即可增删导航项。

### 分类 vs 标签

| | **分类 (Category)** | **标签 (Tag)** |
|---|---|---|
| 数量 | 每篇文章**只能一个** | 每篇文章可以**多个** |
| 用途 | 组织文章的大类（如"技术笔记""生活随笔"） | 标注文章的细分主题（如"JavaScript""Astro"） |
| 展示 | 📁 分类列表页 + 分类详情页 | 🏷️ 标签列表页 + 标签详情页 |
| 关系 | **相互独立**，不互相影响 | |

---

## 🚀 部署到 GitHub Pages

### 自动部署（推荐）

项目已准备好 GitHub Actions 配置，只需：

1. **Fork 或推送** 到你的 GitHub 仓库
2. 将 `.github_disabled/` 重命名为 `.github/`：
   ```bash
   mv .github_disabled .github
   git add . && git commit -m "enable github actions" && git push
   ```
3. 进入 **Settings → Pages → Source → 选择 GitHub Actions**
4. 进入 **Settings → Actions → General → Workflow permissions → 选择 Read repository permissions and write permissions**
5. 推送代码到 `main` 分支 ✅

> 💡 **Fork 后注意**：GitHub Actions 会自动从仓库名推导 base 路径。如果仓库名为 `my-blog`，则部署到 `https://username.github.io/my-blog/`。如需自定义，在 `.github/workflows/deploy.yml` 中设置 `REPO_NAME` 环境变量。

> 💡 `.github_disabled/` 是因为 Token 权限限制无法推送 workflow 文件，手动启用即可。

Actions 会自动：`安装依赖 → 构建 → 部署`

### 自定义域名（可选）

1. 在 `public/` 下创建 `CNAME` 文件，写入你的域名
2. 在域名服务商处添加 CNAME 记录指向 `yourusername.github.io`

---

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

编辑 `astro.config.mjs`，根据你的部署平台修改：

**GitHub Pages（自动检测仓库名）：**

```javascript
// 设置环境变量即可，base 自动从 REPO_NAME 推导
REPO_NAME=your-repo-name  // 仓库名（如 Atom-blog）
```

**Cloudflare Pages / 自定义域名：**

```javascript
// 不设置 DEPLOY_TARGET=github，base 自动为空字符串 '/'
CF_DOMAIN='atom.inte8.top'  // 你的自定义域名
```

> ⚡ 如果默认值不满足需求，可以手动调整 `astro.config.mjs` 中的 `site` 和 `base` 字段。

```javascript
export default defineConfig({
  site: 'https://yourdomain.com',   // 你的网站域名
  base: '/',                        // 子路径仓库填 '/your-repo-name'
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
];
```

### 5. 页脚

编辑 `src/components/Footer.astro`：

```astro
<footer class="site-footer">
  <div class="footer-content">
    <p>© {year} <a href={SOCIAL_LINKS.github}>Atom Blog</a>. Powered by <a href="https://astro.build">Astro</a></p>
  </div>
</footer>
```

### 6. 打赏二维码

二维码图片放在 `public/medias/reward/` 目录下：

```
public/medias/reward/
├── wechat.png     # 微信赞赏码（140x140 像素）
└── alipay.png     # 支付宝收款码（140x140 像素）
```

在文章 frontmatter 中设置 `reward: true` 即可在文章末尾显示打赏码。

### 7. 样式主题

编辑 `src/styles/global.css`，所有颜色通过 CSS 变量控制：

**日间模式**（默认，`:root`）：
```css
:root {
  --bg-primary: #f0f2f5;     /* 页面背景 */
  --accent: #6366f1;         /* 主色调 */
  --accent-gradient: linear-gradient(135deg, #6366f1, #8b5cf6);
  --radius: 10px;            /* 圆角大小 */
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

**夜间模式**（`html.dark`）：
```css
html.dark {
  --bg-primary: #0a0a0f;
  --accent: #00e5ff;         /* 赛博朋克青 */
  --accent-gradient: linear-gradient(135deg, #00e5ff, #a78bfa);
}
```

### 8. 添加新页面

在 `src/pages/` 下新建 `.astro` 文件即可自动注册路由：

```
src/pages/about.astro        → /about
src/pages/links.astro        → /links
```

---

## 📊 静态博客方案对比

| 方案 | 构建输出 | JS 依赖 | 构建时间 | SEO / RSS / Sitemap | 学习成本 |
|------|---------|---------|---------|-----------|----------|
| **Atom（本项目）** | **~3 KB** | **0** | **~1s** | **RSS/Sitemap/JSON-LD 自动生成** | 极低 |
| Hexo + Matery | ~15 MB | 数十个库 | ~5s | 需插件 | 中 |
| Hugo | ~2 MB | 0 | ~0.5s | 需插件 | 中 |
| Jekyll | ~3 MB | 少量 | ~3s | 内置 | 中 |
| Eleventy | ~500 KB | 0 | ~2s | 需插件 | 中 |
| VitePress | ~2 MB | 需水合 | ~2s | 需插件 | 低（偏文档） |

### 本项目的优势

- **零依赖** — 全站无 JavaScript，纯 HTML + CSS，Lighthouse 满分
- **双主题** — 日间明亮模式 + 夜间赛博朋克风格，基于 CSS 变量一键切换
- **自动 SEO** — 每篇文章自动注入 Open Graph、Twitter Card、JSON-LD 结构化数据
- **极简构建** — 构建完成后自动执行 RSS/Sitemap 生成，零配置
- **1 秒构建** — 相比 Hexo 的 5s+，依然足够快
- **TypeScript 类型安全** — 文章内容通过 Astro Content Collections Schema 校验

### 局限性

- **无后端功能** — 无法支持评论系统（可通过 Cusdis / Disqus / Giscus 等第三方接入）
- **无服务端搜索** — 静态站点无法服务端搜索（可用 Algolia 等外部服务）
- **需手动编辑** — 无后台管理界面（可直接在 GitHub 编辑 Markdown）

---

## 💰 支持本项目

如果你喜欢 Atom 博客，欢迎扫码打赏，给了我加个 🥤 饮料！

| 微信 | 支付宝 |
|------|--------|
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
