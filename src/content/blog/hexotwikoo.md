---
title: Hexo 添加第三方评论模块 Twikoo
description: "Twikoo 是一个**简洁、自部署、支持多种部署方式**的评论系统。2021 年发布后迅速成为 Hexo 博客最主流的评论方案——它支持 Vercel / Cloudflare Workers / Docker 等多种部署方式，比早期的 Valine / Disqus 更适合国内用户（无广告 + 不追踪）。"
pubDate: 2025-07-14
category: 工作笔记
tags: [hexo, twikoo, 博客搭建]
---

## 前言

Twikoo 是一个**简洁、自部署、支持多种部署方式**的评论系统。2021 年发布后迅速成为 Hexo 博客最主流的评论方案——它支持 Vercel / Cloudflare Workers / Docker 等多种部署方式，比早期的 Valine / Disqus 更适合国内用户（无广告 + 不追踪）。

本文完整记录 Twikoo 在 Hexo matery 主题下的部署流程，**目标是用自己的 Vercel 域名 + MongoDB Atlas 数据库**，保证国内可访问。

## 一、为什么选 Twikoo

| 评论系统 | 部署难度 | 国内访问 | 反垃圾 | 评论导入 | UI 风格 |
|---------|---------|---------|--------|----------|---------|
| Twikoo | ⭐⭐ | ✅（自己部署）| ✅（Akismet + 关键词）| ✅ | 简洁现代 |
| Valine | ⭐⭐ | ✅ | ❌（垃圾评论多）| ✅ | 简洁 |
| Disqus | ⭐ | ❌（被墙）| ✅ | ✅ | 老派 |
| Gitalk | ⭐⭐ | ✅ | ❌（需 GitHub 登录）| ❌ | 极简 |
| Gitment | ⭐⭐ | ✅ | ❌ | ❌ | 极简 |

Twikoo 优势：
- **数据自主**：评论存你自己 MongoDB（不是第三方）
- **部署灵活**：Vercel / Cloudflare Workers / Docker / 自建服务器
- **反垃圾好**：内置 Akismet + 关键词 + 频率限制
- **邮件通知**：有新评论自动邮件通知博主
- **emoji 表情**：支持 GitHub 风格 emoji
- **无追踪**：不嵌 GA / 第三方广告

## 二、部署前置条件

需要 3 个账号（都是免费的）：

1. **MongoDB Atlas**（数据库）—— 免费 512 MB 够中小博客用
2. **Vercel**（函数计算）—— 免费额度对个人博客足够
3. **GitHub**（登录 Vercel 用 + Twikoo 源码）

⚠️ **重要提示**：Vercel 部署的环境需配合 **1.4.0 以上版本的 twikoo.js** 使用。1.4 以下版本会有兼容性 bug。

⚠️ **国内访问问题**：默认域名 `*.vercel.app` 在中国大陆访问速度较慢甚至无法访问。建议绑定自己的域名（如 `comment.yourdomain.com`）。

视频教程：<https://www.bilibili.com/video/BV1Fh411e7ZH>

## 三、申请 MongoDB Atlas

1. 注册 <https://twikoo.js.org/mongodb-atlas.html> 账号（推荐 GitHub 一键登录）
2. 创建免费集群（M0 Sandbox，512 MB / 永远免费）
3. **Database Access** → Add New Database User
 - 用户名：`twikoo`（自取）
 - 密码：随机生成（**复制保存**，后面要用）
 - 权限：`Read and write to any database`
4. **Network Access** → Add IP Address
 - 点 `Allow Access from Anywhere`（`0.0.0.0/0`）—— 否则 Vercel 函数无法连接
5. **Database** → Connect → Drivers
 - 选 Python，复制 `MONGODB_URI` 连接字符串
 - 格式：`mongodb+srv://twikoo:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
 - ⚠️ 把 `<password>` 替换成步骤 3 设的密码

## 四、部署 Twikoo 到 Vercel

### 1. 一键部署

点击按钮把 Twikoo 一键部署到 Vercel：

[![Deploy](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/twikoojs/twikoo/tree/main/src/server/vercel-min)

需要 GitHub 授权。

### 2. 配置环境变量

进入 `Settings - Environment Variables`，添加：

| 名称 | 值 |
|------|-----|
| `MONGODB_URI` | 步骤三拿到的连接字符串 |
| `TWIKOO_TITLE` | （可选）评论框标题，默认"Twikoo" |

环境变量配好后 **Save**。

### 3. 关闭 Vercel 部署保护

进入 `Settings - Deployment Protection`：

- `Vercel Authentication` → 选 **Disabled** → Save

⚠️ 不关会导致访问 Twikoo 评论 API 时要求输入 Vercel 密码，严重影响用户体验。

### 4. 触发重新部署

进入 `Deployments` 页：

- 在任意一项后面点 **更多（三个点）** → **Redeploy** → **Redeploy**

环境变量改完后必须重新部署才生效。

### 5. 获取环境 ID

进入 `Overview`：

- 点 **Domains** 下方的链接
- 如果配置正确，会看到 **"Twikoo 云函数运行正常"** 提示
- **Vercel Domains**（包含 `https://` 前缀，例如 `https://twikoo-xxx.vercel.app`）即为您的**环境 ID**

⚠️ **重要**：环境 ID 不是 Vercel 整个项目 URL，只是 Twikoo 服务部署后分配的子域名。

## 五、Hexo 集成

### 1. 安装 Twikoo JS

```bash
cd your-hexo-blog
npm install hexo-twikoo --save
```

或 yarn：

```bash
yarn add hexo-twikoo
```

### 2. 配置 `_config.yml`

在 Hexo 站点根目录的 `_config.yml` 添加：

```yaml
twikoo:
  envId: https://twikoo-xxx.vercel.app   # 步骤 5 拿到的环境 ID
  region:                                 # 可选，默认 ap-shanghai
  visitor: true                           # 是否显示访问量
  option:
    lang: zh-CN                           # 评论 UI 语言
```

### 3. 主题模板集成

如果你的主题（如 matery）没有内置 Twikoo 支持，需要手动在 `themes/your-theme/layout/post.ejs` 或 `themes/your-theme/layout/_partial/comments.ejs` 添加：

```html
<div id="twikoo"></div>
<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.41/dist/twikoo.all.min.js"></script>
<script>
twikoo.init({
  envId: '<%- theme.twikoo.envId %>',
  el: '#twikoo',
  region: '<%- theme.twikoo.region || "ap-shanghai" %>',
  lang: '<%- theme.twikoo.option.lang || "zh-CN" %>'
})
</script>
```

⚠️ **检查主题是否自带 Twikoo 配置**：matery 主题默认支持多种评论系统（Disqus / Gitalk / Valine 等），但**默认不带 Twikoo**——需要自己改模板或装第三方插件。

### 4. 反垃圾配置

Twikoo 反垃圾机制有 3 层（默认开启）：

1. **Akismet**：基于第三方服务的反垃圾
2. **关键词过滤**：后台 → 设置 → 关键词过滤
3. **频率限制**：同一 IP 短时间内不能发太多

要开启 Akismet，在 Twikoo 后台 → 设置 → 反垃圾垃圾里填：

```
AKISMET_KEY=your-akismet-key
```

Akismet key 在 <https://akismet.com> 免费申请。

### 5. 邮件通知

Twikoo 支持新评论邮件通知。后台 → 设置 → 邮件通知：

```
SMTP_SERVICE=Gmail
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # 不是邮箱密码, 是 Gmail App Password
SENDER_EMAIL=your-email@gmail.com
SENDER_NAME=Your Blog
RECEIVER_EMAIL=your-notification@email.com
```

⚠️ **Gmail 必须用 App Password**，不能用邮箱登录密码（两步验证后必须用 app password）。

## 六、绑定自有域名（解决国内访问）

Vercel 默认 `*.vercel.app` 在中国大陆访问速度慢。绑定自有域名：

### 1. Vercel 添加域名

`Settings - Domains` → 输入 `comment.yourdomain.com` → Add。

### 2. 域名 DNS 添加 CNAME

在你的域名服务商（Cloudflare / 阿里云 / DNSPod）添加：

```
comment.yourdomain.com  CNAME  cname.vercel-dns.com
```

### 3. 等待生效

DNS 解析通常 5-30 分钟生效。完成后 `https://comment.yourdomain.com` 就是 Twikoo 服务地址。

更新 Hexo 配置：

```yaml
twikoo:
  envId: https://comment.yourdomain.com
```

## 七、Cloudflare Workers 部署（备选）

Vercel 在国内有时会抽风。**Cloudflare Workers 部署** 国内访问更稳：

```bash
# 安装 wrangler（Cloudflare CLI）
npm install -g wrangler

# 登录
wrangler login

# 克隆 Twikoo 源码
git clone https://github.com/twikoojs/twikoo.git
cd twikoo

# 部署
cd src/server/cloudflare
wrangler kv:namespace create TWIKOO_KV
wrangler secret put MONGODB_URI
wrangler deploy
```

部署成功后 Cloudflare Workers URL 类似 `https://twikoo.your-worker.workers.dev`，`your-worker` 是你设的 worker 名。

## 八、常见问题

### Q: 评论提交后页面卡住？

99% 是环境变量没配 / MongoDB 连不上。在 Twikoo 后台 → 日志 查看错误。

### Q: 部署后访问 "Twikoo 云函数运行正常" 但评论不显示？

- 检查 Hexo 配置 `envId` 是否正确
- 浏览器控制台查看是否有 CORS 错误（部署保护没关）

### Q: 国内访问太慢？

必须绑定自有域名 + Cloudflare 代理（橙云）。`*.vercel.app` 国内访问是无解的。

### Q: 想换数据库（不想用 MongoDB Atlas）？

Twikoo 1.5+ 还支持 SQLite（Cloudflare D1）和 PostgreSQL（Supabase / Neon）。详见 Twikoo 官方文档。

## 九、完结

Twikoo 是 2026 年 Hexo 博客最值得用的评论系统——**自托管、数据自主、反垃圾好**。部署流程虽多，但大部分是**一次性配置**，之后就不用管。

三件事记住：
1. **Vercel Authentication 必须 Disabled**
2. **MongoDB Network Access 必须 0.0.0.0/0**
3. **国内访问必须绑定自有域名 + 走 Cloudflare**
