---
title: Pi Agent 详细使用指南：从安装到自部署
description: Pi 是 earendil-works 出品的极简终端编程 agent，本文是 npm 安装、多家模型认证、交互模式、扩展/技能/提示模板、SDK/RPC 集成、容器化沙箱的完整实战手册。
pubDate: 2026-09-03
category: 工作笔记
tags: [AI, 编程, AI-Agent]
---

## 前言

[Pi](https://github.com/earendil-works/pi) 是一个**可自扩展**的终端编程 agent。它本身只做四件事：调用 LLM、循环工具、维护会话、渲染 TUI。其它全部（自定义工具、技能、提示模板、主题、子 agent、计划模式）都交给扩展和包去补——`pi` 本身刻意保持"小核心"。

跟其它 coding agent 相比，Pi 走的是**先做减法再加扩展**的路子：默认不内置 sub agent、不内置 plan mode、不内置权限系统，所有这些都能用 TypeScript 扩展或第三方 pi package 自行接入。本文以 `pi-coding-agent@0.84.4` 为基础写就，覆盖：

- 安装与卸载（npm / curl / pnpm / Bun）
- 认证（订阅登录 + API key + 多家厂商）
- 交互模式与会话管理（分支、压缩、恢复）
- 自定义：扩展、技能、提示模板、主题、Pi 包
- SDK / RPC 模式（嵌入其它应用）
- 容器化沙箱（Gondolin / Docker / OpenShell）
- tmux、iTerm2、Kitty 终端适配

## 一、安装

### 1.1 npm 全局安装（推荐）

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

`--ignore-scripts` 是 Pi 的官方推荐做法：依赖的 lifecycle 脚本对正常安装无意义，显式禁用是为了供应链安全（详见下文"供应链加固"）。

### 1.2 macOS / Linux 一键安装

```bash
curl -fsSL https://pi.dev/install.sh | sh
```

背后也是 npm 全局安装，行为和上面一致。

### 1.3 卸载

按你安装时用的包管理器：

```bash
# npm / curl 安装的
npm uninstall -g @earendil-works/pi-coding-agent

# pnpm
pnpm remove -g @earendil-works/pi-coding-agent

# Yarn
yarn global remove @earendil-works/pi-coding-agent

# Bun
bun uninstall -g @earendil-works/pi-coding-agent
```

⚠️ 卸载只删包，**不**删配置。`~/.pi/agent/`（settings / auth / sessions / 安装的 pi packages）会留下。重装后立即可用。

### 1.4 验证

```bash
pi --version
# @earendil-works/pi-coding-agent/0.84.4 linux-x64
```

## 二、认证

Pi 支持两条路：**订阅型 OAuth**（走 `/login`，按月费平台计费）和 **API key**（按 token 计费）。

### 2.1 订阅登录（推荐日常开发）

进入交互模式后输入：

```text
/login
```

内置支持的订阅：

- **ChatGPT Plus / Pro**（Codex 后端，OpenAI 官方认可的第三方 CLI 路径：[codex-for-oss](https://developers.openai.com/community/codex-for-oss)）
- **Claude Pro / Max**（走 Anthropic 账号；订阅之外的"Extra Usage"按 token 计费，不挤占套餐）
- **GitHub Copilot**
- **xAI**（Grok / X 订阅）
- **OpenRouter**（OAuth 一次性颁发 API key，从 OpenRouter 余额扣）
- **Radius**

退出登录：`/logout`。token 存在 `~/.pi/agent/auth.json`，过期自动刷新；OpenRouter 是非过期 API key。

### 2.2 API key

启动前设环境变量即可，Pi 自动识别：

```bash
# Anthropic
export ANTHROPIC_API_KEY=sk-ant-...

# OpenAI
export OPENAI_API_KEY=sk-...

# Google Gemini
export GEMINI_API_KEY=...

# Mistral
export MISTRAL_API_KEY=...

# Groq
export GROQ_API_KEY=...

# Cerebras
export CEREBRAS_API_KEY=...

# OpenRouter（也可走 API key 模式）
export OPENROUTER_API_KEY=...

# xAI
export XAI_API_KEY=...

# GitHub Copilot（GitHub personal access token）
export COPILOT_GITHUB_TOKEN=ghp_...
```

或者写到 `~/.pi/agent/auth.json`，格式与 OAuth 文件相同（多 key 共存）。

### 2.3 自定义 / 本地模型

Ollama / LM Studio / vLLM 这种本机服务，写一份 `~/.pi/agent/models.json`：

```json
{
  "providers": {
    "ollama": {
      "baseUrl": "http://localhost:11434/v1",
      "api": "openai-completions",
      "apiKey": "ollama",
      "models": [
        { "id": "llama3.1:8b" },
        { "id": "qwen2.5-coder:7b" }
      ]
    }
  }
}
```

`apiKey` 字段 Ollama 会忽略，但 Pi 在选模型时仍要求"已认证"，所以保留一个占位字符串即可。要进 `/model` 选择列表前，`/login` 给这个 provider 随便保存一个 key，或选模型时传 `--api-key`。

OpenAI 兼容服务不支持 `developer` role（推理模型用的）时，加：

```json
{
  "providers": {
    "vllm": {
      "baseUrl": "http://localhost:8000/v1",
      "api": "openai-completions",
      "apiKey": "vllm",
      "compat": { "supportsDeveloperRole": false },
      "models": [{ "id": "Qwen/Qwen2.5-Coder-32B-Instruct" }]
    }
  }
}
```

`models.json` 优先级高于内置目录，可以**覆盖内置厂商**——比如把 Anthropic 的 baseUrl 指向内部代理、把某些 Anthropic 模型隐藏掉。详见 `docs/models.md`。

### 2.4 模型选择

```text
/model                 # 打开选择器，Ctrl+S 记为启动默认
/model claude-opus-4   # 直接切
```

支持模糊匹配，能直接写 `provider/id`（比如 `anthropic/claude-opus-4-1-20250805`）或带思考档：`anthropic/claude-opus-4-1-20250805:high`。

### 2.5 思考档

```text
/thinking               # 档位选择器，off / minimal / low / medium / high / xhigh / max
/thinking high
```

按 Ctrl+S 把档位写入启动默认。当前档位会反映在编辑器边框颜色和会话环境变量 `PI_REASONING_LEVEL` 里。

## 三、交互模式

四块布局：

- **启动区**：快捷键、加载的 context files、提示模板、技能、扩展
- **消息区**：用户消息、assistant 响应、工具调用、扩展 UI
- **编辑器**：你输入的地方；边框颜色表示当前思考档
- **状态栏**：cwd、会话名、token / 缓存 / 费用 / 上下文使用 / 当前模型

### 3.1 编辑器特性

| 功能 | 操作 |
|------|------|
| 文件引用 | 输入 `@` 模糊搜项目文件 |
| 路径补全 | 按 Tab |
| 多行输入 | `Shift+Enter`（Windows Terminal 用 `Ctrl+Enter`） |
| 复制回复 | `Ctrl+X` 在 `/tree` 里复制选中的消息；否则复制最后一条 assistant 消息；或者在 `fullscreenCopyOnSelect: false` 时复制选中的屏幕内容 |
| 粘贴图片 | `Ctrl+V`、Windows `Alt+V`、或拖到终端 |
| 执行 shell 命令 | `!command` 跑命令并把输出喂给模型 |
| 隐藏的 shell 命令 | `!!command` 跑命令但不喂给模型 |
| 外部编辑器 | `Ctrl+G` 调用 `externalEditor` / `$VISUAL` / `$EDITOR` / Notepad / `nano` |

### 3.2 斜杠命令

`/` 触发补全。常用：

| 命令 | 说明 |
|------|------|
| `/login` `/logout` | 管理 OAuth / API key |
| `/llama` | 下载 / 加载 / 卸载 llama.cpp 路由模型 |
| `/model` | 切换模型，Ctrl+S 记默认 |
| `/thinking` | 切思考档 |
| `/scoped-models` | 启用 / 禁用 Ctrl+P 循环的模型 |
| `/settings` | 主题 / 消息投递 / 传输等 |
| `/resume` | 续接旧会话 |
| `/new` | 新会话 |
| `/name <名字>` | 给当前会话起名 |
| `/session` | 看会话文件 / ID / 消息数 / token / 费用 |
| `/tree` | 在当前会话树上跳到任意点继续 |
| `/trust` | 保存项目信任决策 |
| `/fork` | 从历史用户消息 fork 出新会话 |
| `/clone` | 把当前活跃分支复制为新会话 |
| `/compact [prompt]` | 手动压缩上下文，可附指令 |
| `/copy` | 复制最后一条 assistant 回复 |
| `/export` | 导出当前会话 |
| `/reload` | 热重载所有扩展 |
| `/skill:<name>` | 强制加载指定技能 |
| `/update` | 升级 Pi 本身 |
| `/share` | 上传会话到 Hugging Face |

### 3.3 关键快捷键

| 快捷键 | 行为 |
|--------|------|
| `Enter` | 提交 |
| `Shift+Enter` / `Ctrl+Enter` | 换行（Win Terminal） |
| `Ctrl+C` | 中断当前生成 |
| `Ctrl+D` | 退出（在 `/resume` 中是删除条目） |
| `Ctrl+G` | 外部编辑器 |
| `Ctrl+L` | 清屏（保留 buffer） |
| `Ctrl+P` | 在 `scoped-models` 里循环 |
| `Ctrl+R` | 反向历史搜索 |
| `Ctrl+S` | 在 `/model`、`/thinking` 里保存默认 |
| `Ctrl+T` | 切换思考档 |
| `Ctrl+V` | 粘贴图片 |
| `Ctrl+X` | 复制回复 |
| `Ctrl+?` | 快捷键帮助

完整可定制的列表见 `docs/keybindings.md`。

### 3.4 消息队列

开始一次生成后还能继续往队列里塞消息：

- 在生成中按 `Enter` → 当前消息排队，等下一次轮
- 想立即插队？把光标移到队首条目上按 `Esc` 立即接管
- 按 `Ctrl+Backspace` 清队列

队列变化会通过 `queue_update` 事件广播（RPC / SDK 模式可订阅）。

## 四、会话：分支与压缩

会话默认存 `~/.pi/agent/sessions/`，按 cwd 分目录，文件名形如 `--path-to-project--/<timestamp>_<uuid>.jsonl`。

### 4.1 命令行入口

```bash
pi                    # 默认在当前目录开新会话
pi -c                 # 续接最近一次会话
pi -r                 # 弹出会话浏览器
pi --no-session       # 不落盘的临时会话
pi --name "重构登录"  # 启动时给会话命名
pi --session <id>     # 用 partial session ID 续
pi --fork <id>        # 从旧会话 fork 出新的
```

### 4.2 树状结构与分支

会话是 JSONL，条目通过 `id` / `parentId` 形成树——`/tree` 进入后可以跳到任意节点继续，原来的分支仍然存在；`/fork` 在某个用户消息处分叉；`/clone` 把当前活跃分支复制一份。

### 4.3 压缩（Compaction）

上下文快爆的时候 Pi 会自动压缩；手动触发：

```text
/compact
/compact 只保留关键决策和未完成的 TODO
```

`compaction_start` / `compaction_end` 是独立事件，方便做日志 / 监控。详细机制见 `docs/compaction.md`。

## 五、自定义：扩展 / 技能 / 提示模板 / 主题

Pi 把"如何让自己合手"完全交给用户。最常见的四种自定义。

### 5.1 扩展（Extensions）

TypeScript 模块，订阅生命周期、注册工具 / 命令 / 自定义 UI。Pi 自动从以下位置发现：

- 全局：`~/.pi/agent/extensions/`
- 项目：`.pi/extensions/`

快速调试用 `pi -e ./path.ts`；自动发现的位置可以用 `/reload` 热重载。

最小示例（注册一个自定义工具）：

```typescript
// ~/.pi/agent/extensions/word-count.ts
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "word_count",
    description: "Count words in a file",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "File path" }
      },
      required: ["path"]
    },
    async execute(_toolCallId, params, _ctx) {
      const fs = await import("fs/promises");
      const text = await fs.readFile(params.path, "utf8");
      const n = text.trim().split(/\s+/).filter(Boolean).length;
      return {
        content: [{ type: "text", text: `${n} words` }],
        details: { count: n }
      };
    }
  });
}
```

可做的事比工具多得多——权限闸门（拦截 `rm -rf` / `sudo`）、Git checkpoint（每个 turn stash、分支错误就回滚）、路径保护（禁止写 `.env` / `node_modules/`）、自定义压缩策略、conversation summary、TUI 自定义组件（`ctx.ui.custom()`）。完整 API 见 `docs/extensions.md`。

### 5.2 技能（Skills）

按 [Agent Skills spec](https://agentskills.io/specification) 的标准化格式：每个技能是一个目录，根下放 `SKILL.md`（frontmatter + 自然语言说明），自由附 `scripts/`、`references/`、`assets/`。

```markdown
---
name: pdf-extract
description: 从 PDF 中提取文字与表格，保留版式。文件类型 .pdf 时调用。
---

# pdf-extract

## Setup
第一次用之前：
```bash
pip install pdfplumber
```

## Usage
```bash
python scripts/extract.py <input.pdf> > out.txt
```
```

Pi 会把技能描述以 XML 形式放进系统提示，**渐进披露**：描述常驻上下文，完整 SKILL.md 在需要时用 `read` 工具加载。强制加载：`/skill:pdf-extract`。位置：

- 全局：`~/.pi/agent/skills/` `~/.agents/skills/`
- 项目：`.pi/skills/`、`.agents/skills/`（信任项目后才加载）

复用 Claude Code / Codex 的技能：在 settings.json 里加：

```json
{
  "skills": ["~/.claude/skills", "~/.codex/skills"]
}
```

### 5.3 提示模板（Prompt Templates）

Markdown 文件，文件名（去掉 `.md`）就是命令名：

```markdown
<!-- ~/.pi/agent/prompts/review.md -->
---
description: Review staged git changes
---

Review the staged changes (`git diff --cached`). Focus on:
- Bugs and logic errors
- Security issues
- Error handling gaps
```

输入 `/review` 展开。带参数的话用 `argument-hint`：

```markdown
---
description: Review PRs from URLs with structured issue and code analysis
argument-hint: <pr-url>
---
```

`<angle>` 必填，`[square]` 可选。禁用自动发现：`--no-prompt-templates`。

### 5.4 主题（Themes）

JSON 文件，定义颜色 token。

```json
{
  "name": "my-theme",
  "colors": {
    "background": "#1a1b26",
    "foreground": "#c0caf5",
    "accent": "#7aa2f7",
    "muted": "#565f89"
  }
}
```

选择主题：`/settings` 或 `settings.json` 里 `"theme": "my-theme"`。首次启动 Pi 会根据终端背景色选 dark / light。临时跑：`pi --use-theme light`。跟随终端外观：`pi --use-theme light/dark`（亮色终端用 light、暗色用 dark）。完整字段见 `docs/themes.md`。

### 5.5 Pi 包：把上面这些打包发布

当你想把自己的扩展 / 技能 / 模板 / 主题组合发出去（团队 / 社区），打成 npm 或 git 仓库：

```json
// package.json
{
  "name": "@myorg/pi-workflow",
  "pi": {
    "extensions": ["./dist/index.js"],
    "skills": ["./skills"],
    "prompts": ["./prompts"],
    "themes": ["./themes"]
  }
}
```

安装：

```bash
pi install npm:@myorg/pi-workflow@1.0.0
pi install git:github.com/myorg/repo@v1
pi install https://github.com/myorg/repo
pi install /absolute/path/to/package
pi install ./relative/path

pi list              # 看已装的包
pi remove npm:@myorg/pi-workflow
pi update --all      # 更新 pi 和所有包
```

⚠️ **安全警告**：Pi 包**享有完整系统权限**。扩展跑任意代码、技能能指示模型跑任意可执行文件——安装第三方前先 review 源码。

## 六、SDK / RPC：嵌入到自己的应用

Pi 提供 SDK（Node.js / TypeScript 直接调用）和 RPC 模式（stdin/stdout JSON 协议）。

### 6.1 SDK

```bash
npm install @earendil-works/pi-coding-agent
```

```typescript
import {
  createAgentSession,
  ModelRuntime,
  SessionManager
} from "@earendil-works/pi-coding-agent";

const modelRuntime = await ModelRuntime.create();
const { session } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
  modelRuntime
});

session.subscribe((event) => {
  if (event.type === "message_update" &&
      event.assistantMessageEvent.type === "text_delta") {
    process.stdout.write(event.assistantMessageEvent.delta);
  }
});

await session.prompt("What files are in the current directory?");
```

典型用法：自定义 web / 桌面 / 移动 UI、把 agent 嵌入 IDE / 聊天机器人、自动化流水线、构建 spawn sub-agent 的工具、测试 agent 行为。完整例子见 `examples/sdk/`，API 见 `docs/sdk.md`。

### 6.2 RPC 模式

```bash
pi --mode rpc [options]
```

常用选项：`--provider`、`--model <pattern>`（支持 `provider/id`、可附 `:<thinking>`）、`--name` / `-n`、`--no-session`、`--session-dir <path>`。

协议：

- 命令：JSON 对象，**逐行**写到 stdin
- 响应：JSON 对象，`type: "response"` 表示成功 / 失败
- 事件：agent event **逐行** JSON 写到 stdout

每个命令可带 `id` 用于关联，`bash_execution_update` 事件会带它执行的命令 id。完整协议 / 命令集见 `docs/rpc.md`。

### 6.3 JSON Event Stream

```bash
pi --mode json "Your prompt"
```

所有 session event 以 JSON Lines 写到 stdout，便于集成到其它工具或自定义 UI。事件类型严格按 `JsonAgentSessionEvent` 定义（streaming 消息更新不带 cumulative snapshot）。完整见 `docs/json.md`。

## 七、容器化与沙箱

Pi **默认以启动它的用户 / 进程权限运行**——没有内置权限系统。需要边界的时候，三种模式：

| 模式 | 隔离什么 | 适合 | 备注 |
|------|---------|------|------|
| **Gondolin** 扩展 | 把内置工具 + `!` 命令路由进本地 Linux micro-VM | 想让 `pi` 跑在主机、工具跑在 VM | `pi` 与 provider auth 留在主机 |
| **Plain Docker** | 整个 `pi` 进程进本地容器 | 简单本地隔离 | provider API key 也得进容器 |
| **OpenShell** | 整个 `pi` 进程进策略化沙箱 | 本地或远程托管沙箱 | 需要 OpenShell gateway |

### 7.1 Gondolin

把 `pi` 留在主机、所有内置工具路由进 Gondolin VM（一个 Linux micro-VM）。

```bash
cp -R packages/coding-agent/examples/extensions/gondolin ~/.pi/agent/extensions/gondolin
cd ~/.pi/agent/extensions/gondolin
npm install --ignore-scripts

cd /path/to/project
pi -e ~/.pi/agent/extensions/gondolin
```

VM 把主机 cwd 挂在 `/workspace`，覆盖 `read` / `write` / `edit` / `bash` / `grep` / `find` / `ls`；`!` 命令也走 VM；`/workspace` 下的写会回写到主机。要求 Node.js ≥ 23.6（`@earendil-works/gondolin`）+ QEMU。

### 7.2 Plain Docker

`Dockerfile.pi`：

```dockerfile
FROM node:24-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends bash ca-certificates git ripgrep \
  && rm -rf /var/lib/apt/lists/*
RUN npm install -g --ignore-scripts @earendil-works/pi-coding-agent

WORKDIR /workspace
ENTRYPOINT ["pi"]
```

```bash
docker build -t pi-sandbox -f Dockerfile.pi .

docker run --rm -it \
  -e ANTHROPIC_API_KEY \
  -v "$PWD:/workspace" \
  -v pi-agent-home:/root/.pi/agent \
  pi-sandbox
```

`-v "$PWD:/workspace"` 把当前目录挂进容器、`/workspace` 下的操作直接反映到主机文件。用 named volume 而不是宿主机的 `~/.pi/agent`，避免把宿主 auth 暴露给容器。

### 7.3 OpenShell

走 [NVIDIA OpenShell](https://docs.nvidia.com/openshell/about/overview) gateway（本地 Docker / Podman / VM / 远程 K8s）做策略化沙箱——文件系统、进程、网络、凭证、推理都能控制。

```bash
openshell gateway add <gateway-url> --name <name>
openshell gateway select <name>
openshell sandbox create --name pi-sandbox --from pi -- pi
```

Gateway 是远程时项目文件不会从主机 bind mount——进沙箱内克隆仓库，或用 `openshell sandbox upload / download` 传文件。配置好推理路由后，沙箱内代码可以走 `https://inference.local`（gateway 注入上游凭证），Pi 配上对应 OpenAI / Anthropic 兼容端点即可。

## 八、终端与 tmux

Pi 用 [Kitty keyboard protocol](https://sw.kovidgoyal.net/kitty/keyboard-protocol/) 拿准确的 modifier key 信息。绝大多数现代终端默认就支持。

### 8.1 终端适配

| 终端 | 状态 |
|------|------|
| Kitty | 开箱即用 |
| iTerm2 普通 TUI 模式 | 开箱即用 |
| iTerm2 全屏 TUI 模式 | 鼠标滚轮会被 iTerm2 拦截，PI 自动切换为发送 mouse-wheel 报告，但加速滚动可能丢 delta |

能力检测失败时（终端代理 / 多路复用器后面），手动覆盖：

```bash
export PI_HYPERLINKS=1                 # OSC 8 超链接
export PI_IMAGE_PROTOCOL=kitty         # 内嵌图片（kitty / iterm2 / none / auto）
export PI_TRUE_COLOR=1                 # 真彩色
```

或在 `settings.json`：

```json
{
  "terminal": {
    "hyperlinks": true,
    "images": "kitty",
    "trueColor": true
  }
}
```

### 8.2 tmux

tmux 默认会把 modifier 信息从某些键上剥掉——`Shift+Enter` 和 `Ctrl+Enter` 通常被压成普通 `Enter`。修：

```tmux
set -g extended-keys on
set -g extended-keys-format csi-u
```

然后重启 tmux：

```bash
tmux kill-server
tmux
```

`csi-u` 是最稳的格式（需要 tmux 3.5+）。

### 8.3 Shell 别名

Pi 用 `bash -c` 跑命令，**默认不展开别名**。要让别名生效，写到 `~/.pi/agent/settings.json`：

```json
{
  "shellCommandPrefix": "shopt -s expand_aliases\neval \"$(grep '^alias ' ~/.zshrc)\""
}
```

把 `~/.zshrc` 换成实际 rc 文件路径。

## 九、Settings 与配置

两层：

| 位置 | 范围 |
|------|------|
| `~/.pi/agent/settings.json` | 全局 |
| `.pi/settings.json` | 项目（信任项目后才生效） |

项目覆盖全局。`/settings` 改常用项；要保存启动模型默认，`/model` 里 Ctrl+S；要保存启动思考档，`/thinking` 里 Ctrl+S。

### 9.1 项目信任

交互模式启动时，遇到项目本地设置 / 资源 / 项目级 `.agents/skills` 且 `~/.pi/agent/trust.json` 没记录，会先问一句。`/trust` 永久记录。

非交互模式（`-p`、`--mode json`、`--mode rpc`）不会问，取全局 `defaultProjectTrust`：

- `"ask"`：默认，忽略项目本地资源
- `"always"`：始终信任
- `"never"`：永不加载

单次覆盖：`--approve` / `-a`、`--no-approve` / `-na`。

### 9.2 环境变量

Pi 用三种环境变量：

1. **进程配置**：`PI_OFFLINE` 等
2. **进程标记**：`AI_AGENT=pi`（通用）、`PI_CODING_AGENT=true`（Pi 专属）——子进程可以判断是不是从 Pi 启动
3. **Shell 工具上下文**：bash / powershell 工具跑的子命令会收到

```text
PI_SESSION_ID         # 当前会话 ID
PI_SESSION_FILE       # 当前会话 JSONL 绝对路径（临时会话不设）
PI_PROVIDER           # 当前模型 provider
PI_MODEL              # 当前模型 ID
PI_REASONING_LEVEL    # 当前思考档：off/minimal/low/medium/high/xhigh/max
```

provider API key 类的环境变量（`ANTHROPIC_API_KEY` 等）单独在 `docs/providers.md` 里。

## 十、安全模型与供应链加固

### 10.1 默认权限

Pi **不内置权限系统**——默认继承启动它的用户 / 进程的权限。任何带"自动执行 shell 命令、读写文件"的 agent 都该被这样对待：信任边界是**用户 / 操作系统层**，不是 Pi 本身。需要边界时走容器化（第七节）。

### 10.2 供应链加固

Pi 把 npm 依赖当作"被 review 的代码"：

- 直接外部依赖**锁精确版本**；内部 workspace 包走范围版本
- `.npmrc` 强制 `save-exact=true` + `min-release-age=2`，避免当天发布被默认采用
- `package-lock.json` 是单一真相；pre-commit 阻止意外提交 lockfile，除非设 `PI_ALLOW_LOCKFILE_CHANGE=1`
- `npm run check` 验证：精确版本、原生 TS import 兼容性、coding-agent shrinkwrap
- 发布 CLI 含 `packages/coding-agent/npm-shrinkwrap.json`（从根 lockfile 生成），为 npm 用户锁传递依赖
- 发布前的烟测：`npm run release:local` 在仓库外构建 + 打包 + 隔离安装 npm 和 Bun
- 本地发布安装、文档化 npm 安装、`pi update --self` 都带 `--ignore-scripts`
- CI：`npm ci --ignore-scripts`；定期 `npm audit --omit=dev` + `npm audit signatures --omit=dev`
- shrinkwrap 生成对 lifecycle 脚本有显式 allowlist，新依赖的 lifecycle 脚本必须先 review

## 十一、常见问题

**Q：能跑非交互模式吗？**
能。`pi -p "Your prompt"` 直接走一次；`--mode json` 给 JSON Lines 输出；`--mode rpc` 走 stdin/stdout JSON 协议嵌入。

**Q：会话数据存哪？**
`~/.pi/agent/sessions/<sanitized-cwd>/<timestamp>_<uuid>.jsonl`。删除：删文件；或 `/resume` 选中按 `Ctrl+D`（能用 `trash` CLI 就走 trash）。

**Q：怎么用本地模型？**
Ollama / LM Studio / vLLM 走第二节的 `~/.pi/agent/models.json`；llama.cpp 走 `/llama` 命令直接下载 / 加载 / 卸载模型。

**Q：上下文快爆了怎么办？**
手动 `/compact [prompt]`；或让 Pi 自动压（默认行为）。压缩是事件可订阅的。

**Q：能在 Claude Code / Codex 项目里复用技能吗？**
可以。settings.json 里 `"skills": ["~/.claude/skills", "~/.codex/skills"]` 即可。

**Q：怎么升级？**
`/update` 或命令行 `pi update`；带上包：`pi update --all`。

**Q：能跟 vLLM pods / Slack bot 之类的服务集成吗？**
[vLLM pods 示例](https://github.com/davidondrej/pi-agent) 里有完整集成；Slack bot 见 [`earendil-works/pi-chat`](https://github.com/earendil-works/pi-chat)。

**Q：Pi 跟 Claude Code / Codex / Hermes 怎么选？**
- Claude Code / Codex：开箱即用、Anthropic / OpenAI 优化最深，扩展能力相对受限
- Pi：极简核心 + 完整扩展点，**任意** provider / 任意自定义工作流，适合愿意自己写扩展的工程团队
- 取决于你更想要"立刻能跑"还是"完全可控"

## 十二、参考资料

- [Pi 官网](https://pi.dev)
- [GitHub: earendil-works/pi](https://github.com/earendil-works/pi)
- [文档索引](https://pi.dev/docs/latest)（也可让 `pi` 自己解释自己）
- 完整 package 列表：
  - [`@earendil-works/pi-coding-agent`](https://www.npmjs.com/package/@earendil-works/pi-coding-agent) — 交互式 coding agent CLI
  - [`@earendil-works/pi-agent-core`](https://github.com/earendil-works/pi) — agent 运行时（工具调用 + 状态管理）
  - [`@earendil-works/pi-ai`](https://github.com/earendil-works/pi) — 多 provider 统一 LLM API
  - [`@earendil-works/pi-tui`](https://github.com/earendil-works/pi) — 终端 UI 库（差分渲染）
  - [`@earendil-works/pi-telemetry`](https://github.com/earendil-works/pi) — 与厂商无关的 telemetry 契约
- Pi RFCs：<https://rfc.earendil.com/keyword/pi/>
- Slack / 聊天自动化：[earendil-works/pi-chat](https://github.com/earendil-works/pi-chat)
- Gondolin VM：<https://github.com/earendil-works/gondolin>
- Agent Skills 规范：<https://agentskills.io/specification>

> 本文基于 `pi-coding-agent@0.84.4`。Pi 仍在快速迭代，建议每次升级后跑 `/update --all`，重大变更前看 GitHub Releases。
