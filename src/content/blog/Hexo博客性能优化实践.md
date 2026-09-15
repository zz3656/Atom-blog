---
title: Hexo 博客性能优化实践
description: "Hexo 博客搭建完成后，访问速度直接影响留存率。本文记录我在优化自己博客（inte8.top）过程中验证有效的几种做法，重点是**不动服务端配置**（GitHub Pages 不开放 .htaccess）、靠 hexo 模板 + 静态资源处理完成的优化。"
pubDate: 2026-04-29
category: 项目测试
tags: [hexo, 性能优化, 博客]
heroImage: /images/3.jpg
---

## 前言

Hexo 博客搭建完成后，访问速度直接影响留存率。本文记录我在优化自己博客（inte8.top）过程中验证有效的几种做法，重点是**不动服务端配置**（GitHub Pages 不开放 .htaccess）、靠 hexo 模板 + 静态资源处理完成的优化。

## 性能分析工具

优化前先用工具找到瓶颈。常用的免费工具：

- **Google PageSpeed Insights**（https://pagespeed.web.dev/）：综合评分，输出 Core L / SEO / 最佳实践四类指标
- **Chrome Lighthouse**：内置在 DevTools 的 `Lighthouse` 面板，可选移动端/桌面端模拟
- **WebPageTest**（https://www.webpagetest.org/）：多地点模拟，提供详细瀑布图，能看到每个资源的 DNS / TCP / TLS / TTFB / 下载时间

> PageSpeed 评分基于 Lighthouse v10+ 评分模型（2023 年起），分数是相对的——同一页面在 4G 和 WiFi 下的得分可能差 30+。

## 图片优化

**这是 Hexo 博客最常见的瓶颈**。一个 hero 图 1MB+ 是家常便饭。

### 1. 用 WebP / AVIF 替代 PNG / JPG

WebP 通常比同质量 PNG/JPG 小 **25%-35%**（Google 自家测试数据）。AVIF 更激进，能压到 50% 以下，但浏览器兼容稍差（Safari 16+ 才开始支持）。

转换工具：
- `cwebp input.png -o output.webp -q 80`
- `magick input.jpg -quality 80 output.webp`（ImageMagick 7+）
- macOS 还可以直接 `sips -s format webp input.jpg --out output.webp`

### 2. 主题 `featureimages` 控制封面尺寸

matery 主题默认从 `source/medias/featureimages/` 抽取随机图做首页轮播。每张图控制在 **200KB 以内**，整组图片就能压到 1-2MB。

### 3. 懒加载（Lazy Load）

matery 主题默认**没有**内置懒加载。可在 `themes/matery/_config.yml` 找 `lazyload` 配置项（部分 fork 版本支持），或者自己加 `loading="lazy"` 属性到所有 `<img>` 标签。

## 静态资源优化

### 1. 合并 / 压缩 CSS / JS

matery 默认**未压缩**输出 `public/`。可以装 hexo 官方压缩插件：

```bash
npm install hexo-all-minifier --save
```

在 `_config.yml` 配置：

```yaml
all_minifier: true
```

这个插件会同时压缩：
- HTML（基于 html-minifier）
- CSS（基于 clean-css）
- JS（基于 ug-tig / terser）
- 图片（基于 imagemin，可选）

实际效果：HTML 体积减少 10%-15%，CSS/JS 减少 30%-50%。

### 2. 启用 Gzip / Brotli

GitHub Pages **默认开启 Gzip**（基于 Cloudflare CDN 自动协商），不需要在 `_config.yml` 里配。如果用其他托管（如 Netlify、Vercel），它们默认也开。

Brotli 比 Gzip 多压 **15%-20%**，但 GitHub Pages 不支持托管端配置 Brotli。Cloudflare 面板里可以单独启用 Brotli，访问者会用上。

### 3. CDN 加速

GitHub Pages 源站在国外，国内访问慢。国内访问用 Cloudflare CDN（我用的就是这个）。

`themes/matery/_config.yml` 里的 CDN 配置：

```yaml
jsDelivr:
  url: https://cdn.jsDelivr.net  # 用 jsDelivr 加速主题内置 JS/CSS 库
```

jsDelivr 是免费 CDN，对 GitHub 仓库直接生效。

## 缓存策略

GitHub Pages 走 Cloudflare，缓存规则是 Cloudflare 默认。可以在 Cloudflare 面板加 Cache Rule：

| 资源类型 | 建议缓存时间 | 设置方式 |
|----------|--------------|----------|
| HTML | 5 分钟 - 1 小时 | Browser Cache TTL: 30 minutes |
| CSS / JS / 图片 | 1 年 | 通过文件名哈希实现版本控制 |
| 字体 | 1 年 | Cache Rule: Edge TTL 1 year |

文件名哈希：在 `themes/matery/_config.yml` 设置 `asset_version: true`（部分版本支持），输出文件名带 `?v=hash`，缓存和版本控制两不误。

## 减少 HTTP 请求

每次 HTTP 请求都有 DNS / TCP / TLS / TTFB 开销，请求多比单文件大更糟糕。

- **合并第三方库**：matery 用 jQuery + Materialize + 自定义 JS，能合并的就合并
- **内联关键 CSS**：首屏渲染需要的样式内联到 `<style>`，外链只放非关键 CSS
- **预连接 / 预解析**：在 `<head>` 加 `<link rel="preconnect" href="https://cdn.jsdelivr.net">`，浏览器提前建连

```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="dns-prefetch" href="//www.inte8.top">
```

## 服务端配置（GitHub Pages 不可改的部分）

GitHub Pages **不开放**自定义 .htaccess / nginx 配置。所以以下只能在其他托管上做：

- HTTP/2 / HTTP/3：GitHub Pages 默认 HTTP/2，HTTP/3 不一定支持
- HSTS：通过 Cloudflare 面板加
- Brotli：通过 Cloudflare 面板加

## 验证

部署后再跑一遍 PageSpeed Insights，看 Core L / LCP / FID / CLS 四个核心指标。常见目标：

| 指标 | 优秀 | 需改进 |
|------|------|--------|
| LCP (Largest Contentful Paint) | < 2.5s | > 4.0s |
| FID (First Input Delay) | < 100ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | > 0.25 |
| Performance Score | > 90 | < 50 |

性能优化是持续的过程，没有银弹。本文列举的几种是**投入产出比最高**的几项——大部分 hexo 博客做完图片优化 + 资源压缩 + CDN，PageSpeed 就能从 60+ 拉到 85+。
