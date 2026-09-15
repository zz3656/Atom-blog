---
title: 利用 Git 命令上传项目到 GitHub 指定仓库
description: Git 是目前最主流的分布式版本控制系统，GitHub 是全球最大的代码托管平台。本教程记录如何用 Git 命令把本地项目上传到 GitHub 指定的远程仓库。
pubDate: 2020-02-23
category: 工作笔记
tags: [Git, Github, 教程]
---

## 前言

Git 是目前最主流的分布式版本控制系统，GitHub 是全球最大的代码托管平台。本教程记录如何用 Git 命令把本地项目上传到 GitHub 指定的远程仓库。

**注意**：GitHub 在 2020 年 10 月之后创建的新仓库，默认分支从 `master` 改为 `main`。本文命令以 `main` 为准——如果你在用老仓库还是 `master`，把下面命令里的 `main` 换成 `master` 即可。

## 一、第一次推送新项目

### 步骤 1：初始化本地仓库

进入项目根目录：

```bash
cd /path/to/your/project

# 初始化 Git 仓库
git init
```

这会在当前目录生成一个 `.git` 子目录，Git 用它来跟踪所有版本历史。

### 步骤 2：添加文件到暂存区

```bash
# 添加所有文件（包括未追踪的）
git add .

# 或者只添加特定文件
git add filename.py
```

⚠️ **`git add .` 会把 .gitignore 之外的所有文件加入**。如果有不想上传的（比如 `node_modules/`、`.env`、`*.log`），先在项目根目录建 `.gitignore` 文件列出它们，再 `git add .`。

### 步骤 3：提交到本地仓库

```bash
git commit -m "首次提交：项目初始化"
```

`-m` 后是提交说明。建议用有意义的 commit message（不要写"update"或"fix"这种含糊词）。推荐规范：

```
<类型>: <简短描述>

<可选详细说明>

类型常见值：feat（新功能）、fix（修复）、docs（文档）、refactor（重构）
```

### 步骤 4：在 GitHub 创建远程仓库

1. 登录 → 右上角 **+** → **New repository**
2. 填写仓库名（建议跟本地项目目录同名）
3. **Description**（可选）：项目简介
4. **公开 / 私有**：按需选择
5. ⚠️ **不要**勾选 "Add a README file"——如果你已经在本地有 README，勾了会冲突
6. ⚠️ **不要**勾选 "Add .gitignore"——同上
7. **不要**勾选 "Choose a license"——除非你有特定 license 偏好
8. 点 **Create repository**

创建后 GitHub 会给一个仓库 URL，类似：
- HTTPS: `https://github.com/yourname/yourrepo.git`
- SSH: `git@github.com:yourname/yourrepo.git`

### 步骤 5：关联远程仓库

```bash
git remote add origin https://github.com/yourname/yourrepo.git
```

`origin` 是远程仓库的默认别名，可以改成别的名字（但没必要）。

### 步骤 6：拉取远程（首次推送建议）

```bash
git pull origin main --rebase
```

⚠️ **重要**：GitHub 自动创建的 README / / .gitignore / LICENSE 会跟本地冲突。先 pull 把远程文件拉下来再 push，否则会报 "non-fast-forward" 错误。

`--rebase` 把本地提交"接"到远程 HEAD 后面，保持线性历史（不像 `merge` 会产生合并提交）。

### 步骤 7：推送到远程

```bash
git push -u origin main
```

- `-u`：把 `origin main` 设为默认上游（upstream），以后直接 `git push` 就够了
- `main`：分支名（老仓库是 `master`）

## 二、日常推送流程

首次推送后，日常修改推送流程简化成 3 步：

```bash
# 1. 查看改了哪些文件
git status

# 2. 添加并提交
git add <files>
git commit -m "feat: 添加用户登录功能"

# 3. 推送
git push
```

`git status` 一定先看——避免误提交调试代码、临时文件。

## 三、常见错误与解决

### 错误 1：`non-fast-forward`

```
! [rejected] main -> main (non-fast-forward)
```

**原因**：远程有本地没有的 commit（最常见：GitHub 自动生成的 README）。

**解决**：

```bash
git pull origin main --rebase
git push origin main
```

### 错误 2：`Permission denied (publickey)`

SSH 推送时认证失败。

**解决**：

```bash
# 1. 检查是否已配置 SSH key
cat ~/.ssh/id_rsa.pub

# 2. 如果没有，生成
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 3. 把公钥复制到 GitHub: Settings -> SSH and GPG keys -> New SSH key
cat ~/.ssh/id_rsa.pub
# 把输出粘贴到 GitHub

# 4. 测试连接
ssh -T git@github.com
# 应该看到: Hi username! You've successfully authenticated...
```

### 错误 3：`fatal: refusing to merge unrelated histories`

本地仓库和远程是两个独立的 git 历史（`git init` 在两边都跑过）。

**解决**：

```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

### 错误 4：推送后 GitHub 页面看不到文件

99% 是 **分支不对**。`git push origin main` 推到 main 分支，但你的 GitHub Pages 默认可能看 `gh-pages` 分支。

```bash
# 查看本地所有分支
git branch -a

# 切换默认推送分支
git push -u origin <branch>
```

## 四、进阶：SSH vs HTTPS

GitHub 推送有 HTTPS 和 SSH 两种方式：

| 方式 | 优点 | 缺点 |
|------|------|------|
| HTTPS | 不需要配置 SSH key | 每次 push 要输用户名密码（或 token） |
| SSH | 一次配置，永久免密 | 需要上传公钥到 GitHub |

**2026 年推荐**：HTTPS +  GitHub Personal Access Token（PAT）—— GitHub 已经不支持密码直接推送了。

**设置 PAT 流程**：

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. 选 `repo` 权限
5. 生成后**复制保存**（页面关闭后看不到）
6. 本地 git 第一次 push 时，密码框填这个 token（不是 GitHub 密码）

或者用 GitHub CLI（`gh auth login`）自动管理认证。

## 五、完整命令速查

```bash
# 初始化 + 推送（新项目）
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/user/repo.git
git pull origin main --rebase
git push -u origin main

# 日常推送
git status
git add <files>
git commit -m "message"
git push
```

## 六、完结

Git 上传的核心是 **add → commit → push 三步循环**。`git pull --rebase` 是解决 90% 推送冲突的万能命令。

记住：**commit message 写清楚**，比写代码还重要——3 个月后回看，只有 commit log 能告诉你当时为什么这么改。
