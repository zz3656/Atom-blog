---
title: 定制你的 Atom 博客 — 上线后第一步该改什么
description: 拿到 Atom 模板后的最小可行动清单：站点信息、文章内容、Logo/Favicon、主题 Token、关于页面，以及每项该改哪些文件。
pubDate: 2026-09-18
category: guide
tags: [Atom, 入门, 客制化]
---

恭喜，Atom 博客已经在你的仓库里跑起来了！但**默认内容是你的第一步作业**——把它替换成你自己的东西之前，发布上线会显得很样板。本指南把"该改哪些文件"列成清单，按优先级排好。

> 💡 完成大约 10 分钟的修改就能让博客看起来是你的，而不是"Astro Demo"。

## 一、站点基本信息（必改）

**文件**：`src/consts.ts`

打开后只看一个文件，全站导航、Footer、SEO meta、RSS 名称都会跟着变：

```typescript
export const SITE_TITLE = '你的博客名';        // 浏览器标签、SEO 标题、OG 标签、RSS 名称
export const SITE_NAME = 'MyBlog';             // 导航栏显示的短名称
export const SITE_DESCRIPTION = '你的博客描述'; // meta description、OG、Twitter Card
export const AUTHOR = '你的名字';               // meta author 标签

export const SITE_LOGO = '/logos/logo.svg';     // 导航栏 Logo 路径
export const SITE_FAVICON = '/favicon.svg';     // 浏览器标签图标

// 首页 Hero 区域（图标 + 标题 + 描述 + 按钮）也可在同一个文件里客制化
export const SITE_HERO_ICON = '';              // 留空使用内置 Atom 原子 SVG；替换则放入 public/heroes/hero.svg
export const HERO_TITLE = 'MyBlog';            // 首页大标题文本（支持 HTML 标签，如 <em>）
export const HERO_DESCRIPTION = '你的博客一句话介绍';
export const HERO_EYEBROW = 'PRECISION LOG';  // Hero 标题上方的小写标签
export const HERO_EYEBROW_SUB = '个人技术日志'; // 标签右侧的补充说明
export const HERO_ACTIONS = [
  { label: '开始阅读 →', href: '/blog', variant: 'primary' },
  { label: '关于此站', href: '/about', variant: 'secondary' },
];

export const REPO_URL = 'https://github.com/你的用户名/你的仓库';
// ↑ Footer 的 "Atom" 链接指向这里（项目源代码仓库）

export const SOCIAL_LINKS = {
  github: 'https://github.com/你的用户名',
  twitter: '',                                  // 不填就不显示
  email: '',                                    // 不填就不显示
};

export const POSTS_PER_PAGE = 10;               // 首页 / 文章列表每页显示几篇
```

**字段说明**：

| 字段 | 出现在哪里 |
|---|---|
| `SITE_TITLE` | 浏览器标题、SEO、OG、Twitter Card、RSS |
| `SITE_NAME` | 导航栏 Logo 旁的短名 |
| `SITE_DESCRIPTION` | meta description、社交分享卡片 |
| `SITE_LOGO` / `SITE_FAVICON` | 导航栏 / 浏览器标签页 |
| `SITE_HERO_ICON` / `HERO_TITLE` / `HERO_DESCRIPTION` / `HERO_ACTIONS` | 首页 Hero 区域（标题前的图标、大标题、CTA 按钮） |
| `HERO_EYEBROW` / `HERO_EYEBROW_SUB` | 首页 Hero 标题上方的小标签（等宽字体） |
| `SOCIAL_LINKS.github` | Footer 的 GitHub 链接（可改成项目仓库或个人主页）|
| `REPO_URL` | Footer 的 "Atom" 链接，指向你的源代码仓库 |

## 二、替换示例文章（必改）

**位置**：`src/content/blog/`

仓库默认附带 3 篇示例文章。建议至少删掉或替换成你自己的内容：

```bash
# 删除示例文章
rm src/content/blog/welcome.md
rm src/content/blog/astro-blog-tutorial.md

# 保留 markdown-guide.md（学习 Markdown 语法用，删了也能从 GitHub 找到）

# 或者用 CLI 交互式创建
npm run new
```

**创建第一篇文章的最小 Frontmatter**：

```markdown
---
title: 我的第一篇文章
description: 简短描述（建议 50-150 字，用于 SEO 摘要和卡片预览）
pubDate: 2026-09-20
category: 随笔
tags: [标签1, 标签2]
draft: false                # true 表示草稿，构建时被过滤掉
---

正文内容...
```

完整字段说明见 [Markdown 写作完全指南](/blog/markdown-guide/)。

## 三、Logo、Favicon 和 Hero 图标（推荐改）

替换三个图片文件即可，**不需要改任何组件代码**：

| 文件 | 用途 | 推荐尺寸 |
|---|---|---|
| `public/logos/logo.svg` | 导航栏左侧图标 | 32×32 矢量 |
| `public/favicon.svg` | 浏览器标签页图标 | 任意，矢量自适应 |
| `public/heroes/hero.svg` | 首页 Hero 大标题前的图标（可选） | 36×36 矢量 |

也可以是 PNG/WebP（对应 `SITE_*` 后缀改一下就行）。Hero 图标留空 `SITE_HERO_ICON = ''` 则用内置的 Atom 原子 SVG。

> 💡 **本仓库的图标就是这么来的**：内置标识由本机 [Draw Things](https://drawthings.ai) 生成原图，再用 `scripts/vectorize-icon.mjs` 描成矢量——形状来自模型，颜色强制对齐设计系统 token，所以黄铜永远是 `--accent` 的那个精确值，16px 缩略图也不会糊。完整命令见 `DEVELOP.md` 的「品牌图标（Draw Things 流水线）」一节。

Hero 区域的**标题文案**、**描述段落**、**CTA 按钮**也都可以直接在 `src/consts.ts` 里的 `HERO_TITLE` / `HERO_DESCRIPTION` / `HERO_ACTIONS` 配置：

```typescript
export const HERO_TITLE = 'MyBlog';                              // 标题（可含 <em>）
export const HERO_DESCRIPTION = '一个简洁、快速、优雅的现代博客。';
export const HERO_ACTIONS = [
  { label: 'GitHub', href: 'https://github.com/yourname', variant: 'secondary' },
  { label: '开始阅读 →', href: '/blog', variant: 'primary' },
];
```

按钮可任意增删；`variant: 'primary' | 'secondary'` 控制样式，`hide: true` 跳过该按钮。

## 四、主题配色（推荐改）

**文件**：`src/themes/atom-default/light.css` 和 `dark.css`

默认主题是**冷轧钢 + 黄铜指示灯**配色：日间镀锌灰底、夜间枪铁灰底，强调色是一盏黄铜色。改颜色只需要动这两个文件里的变量：

```css
html[data-theme='atom-default'][data-mode='light'] {
  --bg-primary: #ecedef;      /* 页面底色 */
  --bg-card: #ffffff;         /* 卡片底色 */
  --text-primary: #171a1d;    /* 正文 */
  --accent: #8a5407;          /* 强调色（链接、按钮、刻度） */
  --accent-secondary: #1c6b85; /* 次强调色（分类） */
  --rule-tick-strong: rgba(138, 84, 7, 0.55); /* 刻度尺长线 */
}
```

> ⚠️ 改配色时注意：组件层**只认**语义表面 token（`--on-accent`、`--header-bg`、`--panel-bg`、`--code-bg`、`--rule-tick`、`--focus-ring` 等）。不要在主题里写组件选择器，也不要在组件 CSS 里写死颜色——那样第三方主题会失效。完整契约见 [`docs/THEMING.md`](https://github.com/zz3656/Atom/blob/main/docs/THEMING.md)。

想从头做一个主题？用脚手架：

```bash
npm run theme:create ocean             # 双模式
npm run theme:create ocean --no-dark   # 单模式
```

建好目录就自动接入，零配置。

## 五、关于页面（推荐改）

**文件**：`src/pages/about.astro`

默认是个简单的占位页。改成你的自我介绍 + 站点说明，访客会更信任你的内容。

## 六、部署到生产（最后一步）

代码改完后，提交并推送，CI 自动部署到 GitHub Pages：

```bash
git add -A
git commit -m "feat: 定制站点信息"
git push origin main
```

GitHub Actions 会自动跑 `npm run build` 并部署。几分钟后访问你的 `https://<用户名>.github.io/<仓库名>/` 就能看到效果。

**首次部署配置**：进入 GitHub 仓库的 Settings → Pages → Source 选 **GitHub Actions**，并把 Workflow permissions 设为 **Read and write permissions**。

## 完整清单速查

| 优先级 | 改什么 | 文件 |
|---|---|---|
| ⭐ 必改 | 站点信息 | `src/consts.ts` |
| ⭐ 必改 | 示例文章 | `src/content/blog/*.md` |
| ⭐ 推荐 | Logo + Favicon + Hero 图标 | `public/logos/logo.svg`, `public/favicon.svg`, `public/heroes/hero.svg`（可选）|
| ⭐ 推荐 | 首页 Hero 文案与按钮 | `HERO_TITLE` / `HERO_DESCRIPTION` / `HERO_ACTIONS` 在 `src/consts.ts` |
| ⭐ 推荐 | 主题配色 | `src/themes/atom-default/light.css` + `dark.css` |
| 推荐 | 关于页面 | `src/pages/about.astro` |
| 可选 | 新主题 | `src/themes/` + 主题脚手架 `npm run theme:create <id>` |
| 可选 | 社交链接 | `SOCIAL_LINKS` 在 `src/consts.ts` |

## 下一步

- 📚 [Markdown 写作完全指南](/blog/markdown-guide/)——所有可用语法
- 🏗️ [Atom 博客的技术架构解析](/blog/astro-blog-tutorial/)——想了解为什么这样设计
- 📖 [README](https://github.com/zz3656/Atom)——部署、CLI、主题开发文档
