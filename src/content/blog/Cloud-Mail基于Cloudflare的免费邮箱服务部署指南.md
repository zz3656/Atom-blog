---
title: Cloud Mail 基于 Cloudflare 的免费邮箱服务部署指南
description: 只需要一个域名，就能搭建自己的邮箱平台，支持多用户、多邮箱、收发附件，部署在 Cloudflare Workers 上几乎零成本。
pubDate: 2026-05-05
category: 技术教程
tags: [Cloudflare, 邮箱服务, 教程]
heroImage: /images/0.jpg
---

# 📧 Cloud Mail：基于 Cloudflare 的免费邮箱服务部署指南

> 只需要一个域名，就能搭建自己的邮箱平台，支持多用户、多邮箱、收发附件，部署在 Cloudflare Workers 上几乎零成本。

---

## 一、项目简介

**Cloud Mail** 是一个开源的邮箱服务系统，部署在 Cloudflare Workers 上，核心特点：

- 💰 **低成本** — 基于 Cloudflare Workers，免费额度基本够用
- 📧 **邮件收发** — 接收邮件通过 Cloudflare Email Routing，发送邮件通过 Resend
- 📦 **附件支持** — 使用 R2 对象存储保存和下载附件
- 🛡️ **管理后台** — 用户管理、邮件管理、RBAC 权限控制
- 🔀 **多号模式** — 一个用户可以添加多个邮箱地址
- 🎨 **个性化** — 自定义网站标题、登录背景、透明度
- 🤖 **人机验证** — 集成 Turnstile 防止批量注册

**GitHub 仓库**：https://github.com/maillab/cloud-mail

**在线文档**：https://doc.skymail.ink/

---

## 二、前提条件

| 条件 | 说明 |
|------|------|
| 一个域名 | 已接入 Cloudflare（NS 托管） |
| Cloudflare 账号 | 免费账号即可 |
| （可选）GitHub 账号 | 用于 Fork 仓库和 Actions 部署 |

---

## 三、三种部署方式对比

| 方式 | 难度 | 自动更新 | 适合人群 |
|------|------|----------|----------|
| **界面部署** | ⭐ 最简单 | ✅ 同步后自动 | 新手推荐 |
| **Action 部署** | ⭐⭐ 中等 | ✅ 同步后自动 | 想全自动管理 |
| **命令部署** | ⭐⭐⭐ 较难 | ❌ 手动 | 开发者 |

下面分别介绍三种方式。

---

## 四、方式一：界面部署（推荐新手）

### Step 1：Fork 仓库

在 GitHub 上 Fork 项目仓库：

```
https://github.com/maillab/cloud-mail
```

### Step 2：创建 Worker 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **创建**
3. 选择 **连接到 Git**
4. 选择你 Fork 的 `cloud-mail` 仓库
5. **设置目录**为 `mail-worker`（重要！）
6. 点击 **保存并部署**

### Step 3：设置环境变量

在 Worker → **设置** → **变量和机密** 中添加：

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `domain` | ✅ | 邮箱域名，多域名用 JSON 数组 | `["inte8.top"]` |
| `admin` | ✅ | 管理员邮箱地址 | `admin@inte8.top` |
| `jwt_secret` | ✅ | JWT 密钥（随机字符串，不要特殊字符） | `mys3cr3tk3y2026` |
| `project_link` | ❌ | 是否显示项目链接 | `true` 或 `false` |

### Step 4：绑定数据库

1. 在 Cloudflare 控制台创建 **KV** 命名空间
2. 创建 **D1** 数据库
3. 回到 Worker → **设置** → **绑定**，添加：
   - **D1 绑定**：变量名 `db`（必须是这个名字）
   - **KV 绑定**：变量名 `kv`（必须是这个名字）

> ⚠️ 绑定变量名必须是 `db` 和 `kv`，不能改成其他名字，否则 Worker 无法运行。

### Step 5：设置自定义域名

在 Worker → **设置** → **域和路由** → **自定义域** 中绑定你的域名（如 `mail.inte8.top`）。

### Step 6：初始化数据库

浏览器访问以下地址初始化数据库：

```
https://你的Worker自定义域/api/init/你的jwt_secret
```

例如：

```
https://mail.inte8.top/api/init/mys3cr3tk3y2026
```

看到成功提示即可。

### Step 7：设置邮件路由（关键步骤）

这是让邮箱能收到邮件的核心配置。

1. Cloudflare Dashboard → **你的域名** → **Email** → **Email Routing**
2. 如果首次使用，点击 **Get started** 启用 Email Routing（会自动添加 MX 和 TXT 记录）
3. 进入 **Routing rules** 页面
4. 页面底部找到 **Catch-all address** 区域
5. 点击 **Edit**（编辑）
6. **Action** 选择 **Send to a Worker**（发送到 Worker）
7. **Destination** 下拉选择你的 `cloud-mail` Worker
8. 点击 **Save**

> 💡 Catch-all 的作用是将 `*@你的域名.com`（任意前缀）的邮件全部转发给 Worker 处理，这样每个用户注册的不同邮箱地址都能收到邮件。

**如果找不到 Catch-all 编辑入口**，替代方式：

1. 在 Email Routing 页面 → **Email Workers** tab
2. 找到你的 `cloud-mail` Worker
3. 点击 Worker 卡片上的 **route** 字段展开
4. 点 **Create route**（创建路由）
5. 路由地址填 `*@你的域名.com`（如 `*@inte8.top`）
6. Destination 选 cloud-mail Worker
7. 保存

### Step 8：注册管理员

浏览器访问你的自定义域名（如 `https://mail.inte8.top`），用 `admin@你的域名` 注册账号，登录即可 🎉

---

## 五、方式二：GitHub Actions 部署

适合想全自动化管理的用户，代码更新后自动重新部署。

### Step 1：创建 Cloudflare API 令牌

1. Cloudflare → **我的个人资料** → **API 令牌** → **创建令牌**
2. 选择 **Custom token** 或使用模板，确保有以下权限：
   - `Account - Workers Scripts - Edit`
   - `Account - D1 - Edit`
   - `Account - Workers KV Storage - Edit`
   - `Zone - Workers Routes - Edit`
3. 复制 **API 令牌**
4. 复制 **账户 ID**（在 Cloudflare 首页右侧栏）

### Step 2：Fork 仓库并配置 Secrets

Fork https://github.com/maillab/cloud-mail

在 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions** 中添加：

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `CLOUDFLARE_API_TOKEN` | ✅ | Cloudflare API 令牌 |
| `CLOUDFLARE_ACCOUNT_ID` | ✅ | Cloudflare 账户 ID |
| `CUSTOM_DOMAIN` | ✅ | 访问网站的域名，如 `mail.inte8.top` |
| `DOMAIN` | ✅ | 邮箱域名，如 `["inte8.top"]` |
| `ADMIN` | ✅ | 管理员邮箱，如 `admin@inte8.top` |
| `JWT_SECRET` | ✅ | JWT 密钥字符串 |
| `NAME` | ❌ | Worker 项目名，默认 `cloud-mail` |
| `D1_DATABASE_ID` | ❌ | 已有的 D1 数据库 ID |
| `KV_NAMESPACE_ID` | ❌ | 已有的 KV 命名空间 ID |
| `PROJECT_LINK` | ❌ | `true` 或 `false` |

### Step 3：运行工作流

1. 进入 GitHub 仓库 → **Actions** 页面
2. 选择部署工作流，点击 **Run workflow**
3. 等待运行完成

### Step 4：设置邮件路由

同界面部署的 Step 7（Email Routing → Catch-all → Send to Worker）

### Step 5：注册管理员

访问自定义域名，注册管理员账号 🎉

> 💡 后续更新只需同步 Fork 到最新代码，GitHub Action 自动重新部署。

---

## 六、方式三：命令行部署

适合开发者，完全本地控制。

### Step 1：克隆项目

```bash
git clone https://github.com/maillab/cloud-mail
cd cloud-mail/mail-worker
pnpm i
```

> 需要 Node.js v20+ 和 pnpm。

### Step 2：在 Cloudflare 创建资源

在 Cloudflare 控制台分别创建：
- **KV** 命名空间
- **D1** 数据库
- （可选）**R2** 存储桶（用于附件存储）

记录各自的 ID。

### Step 3：编辑 `wrangler.toml`

编辑 `mail-worker/wrangler.toml`：

```toml
[[d1_databases]]
binding = "db"              # 不可修改
database_name = "你的D1名字"
database_id = "你的D1数据库ID"

[[kv_namespaces]]
binding = "kv"              # 不可修改
id = "你的KV命名空间ID"

[[r2_buckets]]              # 可选，附件存储
binding = "r2"              # 不可修改
bucket_name = "你的R2桶名"

[assets]
binding = "assets"          # 不可修改
directory = "./dist"

[triggers]
crons = ["0 16 * * *"]     # 定时任务（UTC时间）

[vars]
orm_log = false
domain = ["inte8.top"]     # 邮箱域名
admin = "admin@inte8.top"  # 管理员邮箱
jwt_secret = "你的密钥字符串"
```

### Step 4：部署

```bash
pnpm run deploy
```

### Step 5：设置邮件路由 + 初始化数据库

同前两种方式的对应步骤。

---

## 七、可选增强功能

### 7.1 邮件发送（Resend）

> ⚠️ Cloudflare 封禁了 25 端口，不支持直接发件，需要用第三方服务。

1. 注册 [Resend](https://resend.com)，添加你的域名并完成 DNS 验证
2. 创建 API Key 并复制
3. 设置发送状态回调地址：`https://你的Worker域/api/webhooks`
4. 在 Cloud Mail 后台 → **系统设置** 中填入 Resend API Key

Resend 免费额度：每天 100 封，个人使用足够。

### 7.2 对象存储（R2）

默认附件用 KV 存储，可切换为 R2（免费 10GB）：

1. Cloudflare → **R2** → 创建存储桶
2. 设置自定义域名
3. Action 部署添加 Secret `R2_BUCKET_NAME`
4. 后台系统设置切换存储方式

### 7.3 人机验证（Turnstile）

防止机器人批量注册：

1. Cloudflare → **Turnstile** → 创建组件
2. 获取 Site Key 和 Secret Key
3. 后台系统设置填入

### 7.4 邮件转发到 Telegram

收到邮件时自动通知到 TG：

1. 找 @BotFather 创建 Bot，复制 Token
2. 给 Bot 发一条消息
3. 浏览器访问获取 chat_id：
   ```
   https://api.telegram.org/bot你的Token/getUpdates
   ```
4. 后台系统设置填入 Token 和 chat_id

### 7.5 LinuxDo 第三方登录

在 Worker 变量或 Action Secrets 中添加：

| 变量名 | 说明 |
|--------|------|
| `linuxdo_client_id` | LinuxDo Client ID |
| `linuxdo_client_secret` | LinuxDo Client Secret |
| `linuxdo_callback_url` | 回调地址：`https://你的域名/login` |
| `linuxdo_switch` | `true` 开启，`false` 关闭 |

---

## 八、项目更新

| 部署方式 | 更新方法 |
|----------|----------|
| **Action 部署** | 同步 Fork 代码到最新，Action 自动部署 |
| **界面部署** | 同步代码后 Worker 自动更新，但**需要重新绑定 D1 和 KV** |
| **命令部署** | `git pull` + `pnpm run deploy` |

> ⚠️ 所有更新后都要执行一次初始化地址来更新数据库结构（不会覆盖已有数据）：
> ```
> https://你的Worker域/api/init/你的jwt_secret
> ```

---

## 九、费用估算

| 资源 | Cloudflare 免费额度 | 超出价格 |
|------|---------------------|----------|
| Workers | 10 万次请求/天 | $0.50/百万次 |
| D1 数据库 | 5GB 存储 + 500 万读/天 | 按量计费 |
| KV 存储 | 10 万读/天 + 1GB | 按量计费 |
| R2 存储 | 10GB 存储 + 100 万写/月 | $0.015/GB/月 |
| Resend 发件 | 100 封/天（免费） | 按量计费 |

**个人使用基本零成本** 🎉

---

## 十、常见问题

**Q：Cloudflare 不支持发件怎么办？**

A：Cloudflare 封禁了 25 端口，发件只能走第三方。推荐 Resend（免费 100 封/天），在后台系统设置中配置 API Key 即可。

**Q：收不到邮件？**

A：检查以下几点：
1. 域名的 MX 记录是否正确指向 Cloudflare（Email Routing 启用后自动添加）
2. Catch-all 路由是否指向了你的 Worker
3. Worker 是否正常运行（检查 Dashboard 中的日志）

**Q：多域名怎么配置？**

A：`domain` 变量支持 JSON 数组：`["domain1.com", "domain2.com"]`，每个域名都需要在 Cloudflare 中配置 Email Routing。

**Q：D1 和 KV 的绑定名能改吗？**

A：不能。D1 必须绑定为 `db`，KV 必须绑定为 `kv`，这是代码中硬编码的。

---

*参考文档：[Cloud Mail 官方文档](https://doc.skymail.ink/) · [GitHub 仓库](https://github.com/maillab/cloud-mail)*
