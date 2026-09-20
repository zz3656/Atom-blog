---
title: Typora + PicGo-Core + GitHub 图床 完整配置指南
description: "Typora + PicGo-Core + GitHub 实现图片上传到 GitHub，使用 jsDelivr CDN 加速、rename-file 自动重命名"
pubDate: 2025-07-12
updatedDate: 2026-09-20
category: 技术笔记
tags: [typora, 文本编辑, picgo]
---

# Typora + PicGo-Core + GitHub 图床 完整配置指南

> **最后更新**: 2026-09-20  
> **图床仓库**: [zz3656/picgo](https://github.com/zz3656/picgo)  
> **访问地址**: `https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/...`

---

## 一、整体架构

```
Typora（编辑器）
   │
   ├─ 粘贴/拖入图片
   │
   ▼
PicGo-Core（命令行上传工具）
   │
   ├─ github-plus 插件
   ├─ rename-file 插件（自动重命名）
   │
   ▼
GitHub 仓库（zz3656/picgo）
   │
   ▼
jsDelivr CDN 加速访问
```

---

## 二、环境准备

### 2.1 安装 PicGo-Core

```bash
npm install picgo -g
```

安装完成后验证：

```bash
picgo -v
# 输出: 3.0.2（或更高版本）
```

### 2.2 安装插件

```bash
# GitHub 上传增强插件（比官方 GitHub 插件更好用）
picgo install github-plus

# 文件重命名插件（按日期+哈希自动命名）
picgo install rename-file
```

---

## 三、获取 GitHub Token

PicGo 需要 GitHub Token 才能将图片上传到你的仓库。

### 3.1 生成步骤

1. 访问 **https://github.com/settings/tokens**
2. 点击 **Generate new token (classic)**
3. 填写配置：

| 字段 | 推荐值 |
|------|--------|
| Note | `PicGo 图床`（备注用途） |
| Expiration | No expiration（永不过期） |
| Scopes | **勾选 `public_repo`**（公开仓库） |

4. 点击 **Generate token**
5. **立即复制 token**，格式如 `ghp_xxxxxxxxxxxxxxxxxxxx...`，只显示一次！

> ⚠️ **安全提醒**: Token 等同于密码，不要提交到 Git 仓库或分享给他人。`public_repo` 权限只允许操作公开仓库，安全性较高。

---

## 四、配置 PicGo

### 4.1 配置文件位置

```
~/.picgo/config.json
```

### 4.2 配置文件内容

```json
{
  "picBed": {
    "uploader": "githubPlus",
    "current": "githubPlus",
    "githubPlus": {
      "repo": "zz3656/picgo",
      "branch": "main",
      "path": "img",
      "customUrl": "https://cdn.jsdelivr.net/gh/zz3656/picgo@main",
      "token": "YOUR_GITHUB_TOKEN_HERE",
      "origin": "github"
    }
  },
  "picgoPlugins": {
    "picgo-plugin-github-plus": true,
    "picgo-plugin-rename-file": true
  },
  "picgo-plugin-rename-file": {
    "format": "{y}/{m}/{d}/{hash}-{origin}-{rand:6}"
  }
}
```

### 4.3 配置说明

| 配置项 | 说明 |
|--------|------|
| `repo` | 你的 GitHub 仓库名，格式 `用户名/仓库名` |
| `branch` | 默认分支名，通常是 `main` 或 `master` |
| `path` | 仓库内存放图片的子目录 |
| `customUrl` | CDN 访问地址，格式 `https://cdn.jsdelivr.net/gh/用户名/仓库名@分支名` |
| `token` | 上一步生成的 GitHub Token |
| `format` | 重命名规则：`年/月/日/哈希-原文件名-6位随机数` |

> ⚠️ 根据你自己的仓库信息修改 `repo`、`branch`、`customUrl` 中的用户名和仓库名。

### 4.4 测试上传

创建一张测试图片并上传：

```bash
echo "test" > /tmp/test-picgo.png
picgo upload /tmp/test-picgo.png
```

成功输出类似：

```
[PicGo SUCCESS]:
https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/2026/09/20/d8e8fca2dc0f896fd7cb4cb0031ba249-test-picgo-0473c7.png
```

---

## 五、Typora 配置

### 5.1 关键步骤

打开 **Typora** → **偏好设置** → **图像**：

| 设置项 | 值 |
|--------|-----|
| 上传服务 | **Custom Command** |
| 自定义命令 | `/Users/ceasar/.local/bin/picgo upload` |
| ✅ 上传时自动复制图片链接到剪贴板 | 勾选 |

### 5.2 为什么不能用 PicGo-Core？

> ❌ **PicGo-Core (command line)** 选项在 Typora 的 UI 中没有保存配置的入口，每次关闭设置就会重置。

> ✅ **Custom Command** 直接调用完整的 picgo 可执行文件路径，更加可靠。

### 5.3 为什么要用完整路径？

直接使用 `picgo upload` 会报错：

```
/bin/bash: picgo: command not found
```

因为 Typora 的 shell 环境中 `$PATH` 不包含 npm 全局安装路径。需要使用 **完整路径**：

```bash
/Users/ceasar/.local/bin/picgo upload
```

如果你的 npm 全局路径不同，可以用以下命令查看：

```bash
which picgo
# 输出你的 picgo 实际路径
```

### 5.4 验证上传

1. 在 Typora 中拖入一张测试图片
2. 点击 **验证图片上传**
3. 显示 **验证成功** 即表示配置正确

---

## 六、使用方式

配置完成后，在 Typora 中：

1. **粘贴图片**：从剪贴板粘贴图片，Typora 会自动上传
2. **拖入图片**：直接将图片拖入 Typora，右键图片选择 **上传**
3. 图片链接自动复制到剪贴板，方便在其他地方使用

### 上传后图片命名规则

重命名插件会自动按以下规则生成文件名：

```
img/年/月/日/哈希-原文件名-6位随机数.扩展名
```

示例：

```
img/2026/09/20/d8e8fca2dc0f896fd7cb4cb0031ba249-test-picgo-0473c7.png
```

---

## 七、常见问题

### Q1: 上传失败提示 token 无效

检查 `~/.picgo/config.json` 中的 token 是否正确，以及 GitHub Token 的权限是否包含 `public_repo`（公开仓库）或 `repo`（私有仓库）。

### Q2: 图片上传成功但访问不了

确认 `customUrl` 格式正确：

```
https://cdn.jsdelivr.net/gh/用户名/仓库名@分支名
```

注意分支名（`main` 或 `master`）必须和仓库一致。

### Q3: Typora 中 picgo command not found

使用完整路径而非命令名：

```bash
which picgo  # 先找到完整路径
# 然后在 Typora 中使用: /完整/picgo路径/upload
```

### Q4: 更换 Mac 后如何迁移

将 `~/.picgo/config.json` 文件备份到安全位置，在新机器上安装 PicGo-Core 和插件后，将配置文件放回 `~/.picgo/config.json` 即可。

### Q5: jsDelivr CDN 节点问题

jsDelivr 在国内访问可能不稳定。可以：

- 在浏览器地址后加 `?x-intl=reflectfast` 强制使用国内节点
- 或使用其他 CDN 加速服务（如使用 Vercel 部署镜像）

---

## 八、配置文件参考

### 完整 `~/.picgo/config.json` 参考

```json
{
  "picBed": {
    "uploader": "githubPlus",
    "current": "githubPlus",
    "githubPlus": {
      "repo": "zz3656/picgo",
      "branch": "main",
      "path": "img",
      "customUrl": "https://cdn.jsdelivr.net/gh/zz3656/picgo@main",
      "token": "YOUR_GITHUB_TOKEN_HERE",
      "origin": "github"
    }
  },
  "picgoPlugins": {
    "picgo-plugin-github-plus": true,
    "picgo-plugin-rename-file": true
  },
  "picgo-plugin-rename-file": {
    "format": "{y}/{m}/{d}/{hash}-{origin}-{rand:6}"
  }
}
```

### 批量上传命令

```bash
# 批量上传图片到图床
picgo upload 图片1.png 图片2.jpg 图片3.png
```

### 查看当前配置

```bash
cat ~/.picgo/config.json
```

---

## 九、其他推荐插件

| 插件 | 用途 | 安装命令 |
|------|------|---------|
| `picgo-plugin-rename-file` | 自动重命名（已安装） | `picgo install rename-file` |
| `picgo-plugin-watermark` | 图片添加水印 | `picgo install watermark` |

> ⚠️ watermark 插件安装时需要下载字体，建议使用代理。注意：部分版本中 watermark 插件可能与 rename-file 插件不兼容。

---

## 附录：关键文件路径

| 文件 | 路径 |
|------|------|
| PicGo 配置 | `~/.picgo/config.json` |
| PicGo 可执行文件 | `~/.local/bin/picgo` |
| npm 全局模块目录 | `~/.local/lib/node_modules/` |
