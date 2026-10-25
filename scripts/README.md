# Hexo (matery) → Atom 博客转换工具

## 概述

本脚本将 Hexo 博客源文章转换为 Astro (Atom 博客) 格式。

- **源目录**: `../../zz3656.github.io/source/_posts/`（Hexo 文章）
- **目标目录**: `../src/content/blog/`（本仓库的 Astro Content Collections）
- **主题**: [hexo-theme-matery](https://github.com/blinkfox/hexo-theme-matery)

## 使用方法

```bash
# 在 Atom 仓库目录下运行
node scripts/convert-hexo.mjs
```

## 转换规则（核心规律）

### 1. Hexo matery 官方 Front-matter 字段参考

依据 [hexo-theme-matery 官方文档](https://github.com/blinkfox/hexo-theme-matery#post-front-matter)：

| 官方字段        | 类型        | 说明                                    |
| --------------- | ----------- | --------------------------------------- |
| `title`         | string      | 文章标题（推荐必填）                    |
| `date`          | datetime    | 发布时间，格式如 `2018-09-07 09:25:00`  |
| `author`        | string      | 文章作者（默认使用站点配置）            |
| `img`           | string      | 文章封面图，如 `/source/images/xxx.jpg` |
| `top`           | boolean     | 是否推荐为首页置顶文章                  |
| `hide`          | boolean     | 是否不在首页显示                        |
| `cover`         | boolean     | 是否加入首页轮播封面                    |
| `coverImg`      | string      | 首页轮播封面图路径                      |
| `password`      | string      | 文章阅读密码（SHA256 加密）             |
| `toc`           | boolean     | 是否开启目录                            |
| `mathjax`       | boolean     | 是否启用数学公式                        |
| `summary`       | string      | 文章摘要（自定义，为空时自动截取）      |
| `categories`    | string/list | 文章分类（建议每篇只有一个）            |
| `tags`          | list        | 文章标签（可有多个）                    |
| `keywords`      | string      | SEO 关键词（默认使用标题）              |
| `reprintPolicy` | string      | 转载协议（cc_by 等）                    |

### 2. Frontmatter 字段映射（实际使用）

| Hexo 字段    | Astro 字段    | 转换规则                                                                                                      |
| ------------ | ------------- | ------------------------------------------------------------------------------------------------------------- |
| `title`      | `title`       | ✅ 直接保留                                                                                                   |
| `date`       | `pubDate`     | `2025-07-14 05:23:30` → `2025-07-14`（只取日期）                                                              |
| `summary`    | `description` | 如果 source 有 summary 字段则直接用；否则自动提取正文                                                         |
| `categories` | `category`    | 单值字符串直接映射；YAML 列表取**第一个值**                                                                   |
| `tags`       | `tags`        | YAML 列表 `- tag` → inline `[tag1, tag2]`；也支持 `tags: [a, b]` 内联格式                                     |
| `img`        | `heroImage`   | 如果 source 有 img 字段则映射为 heroImage                                                                     |
| `cover`      | `heroImage`   | 如果 source 有 cover 字段（值为图片路径）则映射为 heroImage；路径规范化 `/medias/featureimages/` → `/images/` |

### 3. 图片字段的三种来源

matery 主题有多种图片字段，实际使用中的优先级和映射规则：

| 字段名     | 官方定义    | 实际出现在哪些文章中   | 映射为 Astro 的 |
| ---------- | ----------- | ---------------------- | --------------- |
| `img`      | ✅ 官方字段 | 0 篇                   | `heroImage`     |
| `cover`    | ✅ 官方字段 | 4 篇（有图片路径值的） | `heroImage`     |
| `coverImg` | ✅ 官方字段 | 0 篇                   | —               |
| `top_img`  | ❌ 非官方   | 23 篇（几乎每篇都有）  | `heroImage`     |

> 脚本中三种图片字段（img / cover / top_img）统一映射为 Astro 的 `heroImage`。

### 4. 自动提取规则

- **summary/description 为空时**：自动从正文提取第一段有意义的文本（跳过空行、H1/H2 标题、图片链接 `![...]`、引用块 `> `、内容分隔线 `---`），截断至 160 字符
- **categories 为列表时**：取第一个值（matery 官方建议每篇文章只有一个分类）
- **tags 支持两种 YAML 格式**：
  - 列表格式：`tags:\n  - tag1\n  - tag2`
  - 内联格式：`tags: [tag1, tag2]`

### 5. 丢弃的字段

以下字段属于 Hexo matery 主题专用功能，**不在 Astro 博客中使用**，全部丢弃：

```
top                      → 首页推荐功能（不需要）
hide                     → 首页隐藏（不需要）
password                 → 文章密码保护（不需要）
toc                      → 目录（Astro 自己处理）
toc_number               → 目录编号（不需要）
toc_style_simple         → 目录样式（不需要）
mathjax                  → 数学公式（不需要）
keywords                 → SEO 关键词（description 已覆盖）
reprintPolicy            → 转载协议（不需要）
author                   → 作者（站点级统一）
cover                    → 首页轮播（不需要，除非有 coverImg）
coverImg                 → 轮播封面图（不需要）
swiper_index             → 非官方字段
top_group_index          → 非官方字段
background               → 非官方字段
updated                  → 更新日期（不需要）
comments                 → 非官方字段
copyright                → 版权信息系列（不需要）
  copyright_author
  copyright_author_href
  copyright_url
  copyright_info
highlight_shrink         → 非官方字段
aside                    → 侧边栏（不需要）
ai                       → 非官方字段
_img                     → 非官方字段
on                       → 非官方字段
mg                       → 非官方字段
```

### 6. Astro 输出格式

每个文件的 frontmatter 严格按以下顺序和格式：

```markdown
---
title: 文章标题
description: 文章描述（summary 或自动提取）
pubDate: 2025-07-14
category: 分类名称 # 可选
tags: [tag1, tag2] # 可选
heroImage: /images/xxx.jpg # 可选
---

正文内容...
```

## 注意事项

1. **某些文章的 categories 字段为空**（如 `pvesetupistoreos.md`、`routeros.md`、`vpsikuai.md`），这类文章转换后不会有 `category` 字段，需要手动补充
2. **图片链接**可能仍然指向原始 CDN 路径（如 `cdn.jsdelivr.net/gh/zz3656/picgo@main/...`），如需本地化需要额外处理
3. **`top` 字段**被丢弃：matery 的推荐/置顶功能在 Astro 中不适用
4. **`keywords` 字段**被丢弃：Astro 博客使用 `description` 作为 SEO 描述，不需要单独的 keywords
5. **H1 标题**只在正文开头与 frontmatter `title` **完全匹配**时删除
6. 转换脚本是**幂等的**：可以反复运行，覆盖已有输出
7. 已存在的 `welcome.md` 目标文件不会被删除

## 手动补充 Category

转换后缺少 category 的 3 篇文章，建议手动编辑：

- `pvesetupistoreos.md` → 建议加 `category: 操作系统`
- `routeros.md` → 建议加 `category: 网络技术`
- `vpsikuai.md` → 建议加 `category: 网络技术`

## 技术细节

- 纯 Node.js 实现（`node:fs/promises`），不依赖任何第三方模块
- 自定义 YAML frontmatter 解析器，同时支持列表格式 `tags:\n  - x` 和内联格式 `tags: [x]`
- 处理 UTF-8 编码文件（支持中文文件名）
- 转换规则完全基于 [hexo-theme-matery 官方 Front-matter 文档](https://github.com/blinkfox/hexo-theme-matery#post-front-matter)
