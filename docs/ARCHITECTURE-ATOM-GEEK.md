# 极客化博客主题 · 技术方案与接口契约 v1（`atom-geek`）

> **产出**：本文档 = 架构师交付物，交给「前端工程师」实现、「测试工程师」验收。
> **对应需求**：[`docs/REQUIREMENTS-ATOM-GEEK.md`](./REQUIREMENTS-ATOM-GEEK.md) v1（编号沿用其 `FN-xx` / `IA-xx` / `NFR-xx`）。
> **基线仓库**：`/Users/ceasar/Documents/GitHub/Atom-blog`，`main @ 69959a2`（工作区干净，核验时间 2026-10-25）。
> **本方案不含实现代码**：只给「改哪个文件、哪个函数/选择器、填什么值、验收怎么看」。

---

## ⚠️ 变更公告 CN-01（2026-10-25 晚 / 分支 `feat/sole-theme`）

**决策**：周杰伦拍板「客制化 = 每个页面板块彻底重写，不是换配色」，方向 A = TUI 终端形态，**放弃多主题并存**。

**因此本方案有 3 处结论作废**（下面给出勘误后的真值；本文其余部分仍然有效）：

| 原结论 | 位置 | 现状态 | 影响 |
|---|---|---|---|
| 「`atom-default` 保留不删，作为回退与对比基准」 | §0 / §5.3 / §7 / §8.3 | ❌ 作废。`atom-default` **已移出本站**（`git rm -r src/themes/atom-default`，分支 `feat/sole-theme`） | 本站变单主题站点；§5.3 行为矩阵中「回退到 `themes[0]` = atom-default」一行改为「回退到 `themes[0]` = atom-geek」；§7 的「禁止触碰 `atom-default/`」变为「已删除，文件保留在 git 历史 `1d6073b` + 本地 `~/Documents/GitHub/atom-themes/atom-default/`」 |
| 「L1 主题包 / L2 站点级增补 分层」 | §2 / §6 | ✅ **仍然成立，但定位变了** | 分层不再是为了「多主题并存」，而是为了**组件层与视觉层解耦**：本站只装 `atom-geek`，但 token 仍在主题包（L1）、选择器级差异仍在站点级文件（L2）——这让 `docs/THEMING.md` 的 token 契约继续有效，也让将来加主题时不必推倒重来 |
| 「L2 作用域锁 `html[data-theme='atom-geek']` 以免污染 `atom-default`」 | §6.1 | ✅ 铁律不变，**动机变了** | 动机从「不污染另一个主题」变成「主题包仍然只装 token，站点级文件可整份删除回退」 |

**连带改变的架构事实**（本次一并落地）：

1. **站点默认主题机制（§5.2）不变**，只是回退链的兜底值从硬编码 `'atom-default'` 改为 `DEFAULT_THEME_ID` 本身（`atom-default` 已不存在，硬编码它会指向一个不存在的 theme id）。
2. **排序规则通用化**：`src/utils/themes.ts` 与 `astro-plugins/theme-loader.mjs` 里「`atom-default` 固定首位」的特例删除，改为纯 id 字典序（两处必须同序）。站点默认主题由 `DEFAULT_THEME_ID` 决定，与排序无关。
3. **单主题站点的必然收益**：所有主题 CSS 会被 `global.css` 汇总 `@import` 并因 `inlineStylesheets:'always'` 内联进每页 HTML——删掉 `atom-default` 后，每页 HTML 直接少背约 6KB 原文（§8.3 的体积账因此改写为**净减少**）。
4. **验收口径**：不再是「与默认主题对比」（参照系已不存在），改为「**每个板块是否真的换了信息架构与交互形态**」+「作用域静态审计」（选择器必须锁 `data-theme='atom-geek'`、禁 `!important`、禁覆盖布局 token）。

**不变的部分**：§4 的 45 token 取值表与 WCAG 核验、§4.4 的 token→组件消费映射、§6.2 的 L2 规则清单、§8 的体积核算方法、§9 的风险框架——这些在 TUI 重做中继续作为配色与作用域的硬约束使用（暗色 `#00e88f` on `#05070a`、亮色 `#00794c` on `#f2f6f3`、青色分类通道，均已按 AA 核验）。

---

## 0. 方案摘要（一屏读完）

| # | 结论 |
|---|---|
| 分层 | **L1 主题包**（`src/themes/atom-geek/`）只放 token；**L2 站点级增补**（`src/styles/_theme-geek.css`）放"极客质感"，作用域锁定 `html[data-theme='atom-geek']` |
| 默认主题 | 在 `src/consts.ts` 增 `DEFAULT_THEME_ID = 'atom-geek'`，`BaseLayout.astro` 优先取它；**不改** theme-loader 排序、**不改** manifest schema、**不改** `themes.ts` 生成逻辑 |
| 契约边界 | 主题包保持 45 个 token 纯定义（0 组件选择器、0 `!important`）；L2 全部 CSS，**0 新增 JS、0 新增字体请求、0 新依赖** |
| 改动量 | 新增 4 个文件 + 修改 2 个文件（`src/consts.ts`、`src/layouts/BaseLayout.astro`）+ `global.css` 加 1 行 import；**不动** `src/pages/about.astro`、`src/styles/_modules/_about.css`。⚠️ CN-01 后：`atom-default/` 已移出本站 |
| 体积 | 主题包 ≈6.0KB（预算 16KB）；L2 ≈5.5KB 源码 ≈4KB 压缩（预算 8KB）。注意 `inlineStylesheets:'always'`——CSS 内联进每个 HTML，L2 成本 × 页面数 |
| 与需求的偏差 | **3 处**（亮色 `--accent`/`--text-muted`/`--success` 等 6 个 token 为满足 WCAG AA 做了改值；`theme-color` meta 暂不跟随主题；命令面板 P2 不做）→ 见 §3 的 D-04 / D-08 / D-09 |

---

## 1. 现状核实（文件级事实基线）

所有结论均来自实读代码，不是推测。

| 能力 | 证据 | 结论 |
|---|---|---|
| 主题包结构契约 | `docs/THEMING.md:33-50` | 目录**只能**含 `manifest.json` + `light.css` + `dark.css`，内容只能是通过 `html[data-theme='x'][data-mode='y']` 定义的 CSS 变量 |
| 必需 token 清单 | `docs/THEMING.md:52-139` | 43 个必需 + 2 个可选 = 45 个 |
| 主题自动注册 | `astro-plugins/theme-loader.mjs:31-80,101-131` | 构建时扫描 `src/themes/*/`，生成 `src/generated/themes.{ts,css}`；**新增主题零配置** |
| 主题排序 | `astro-plugins/theme-loader.mjs:73-78` | 基线：`atom-default` 固定第 1 位。⚠️ CN-01 后改为纯 id 字典序（无 per-id 特例） |
| 默认主题解析 | `src/layouts/BaseLayout.astro:32-34` | 基线：`defaultThemeId = themeIds[0] \|\| 'atom-default'`。⚠️ CN-01 后为 `DEFAULT_THEME_ID` 优先 + `themes[0] \|\| DEFAULT_THEME_ID` |
| 运行时应用主题 | `src/layouts/BaseLayout.astro:97-113` | 内联同步脚本：读 `localStorage.themeId` → 无效则用 `defaultThemeId`；再写 `data-theme` / `data-mode` |
| 模式（明暗）机制 | `src/scripts/app.js:76-121` | 只写 `localStorage.themeMode` / `themeModeAuto`；**从不写 `themeId`** → 当前 UI 无主题切换入口 |
| 共享布局 token | `src/styles/_modules/_variables.css:9-44` | `--radius*`、`--font-*`、`--max-width`、`--rule-*` 定义在 `:root`，**主题不得覆盖**（`docs/THEMING.md:151-156`） |
| 站点"极客"结构已存在 | `_background.css`（网格 `body::before` + 角落辉光 `body::after`）、`_variables.css:47-63`（`.rule` 刻度尺）、`_log.css:18-26`（日志脊线） | **换色 + 换字体角色 + 加质感**，不要重画 UI |
| CSS 内联策略 | `astro.config.mjs:39` | `inlineStylesheets: 'always'` → 所有 CSS 进 HTML，无独立缓存文件 |
| 现有主题包体积 | `src/themes/atom-default/*` | light 2914B + dark 2580B + manifest 258B = 5752B |
| 现有单测约束 | `tests/themes.test.ts:73-76` | 基线：**断言 `themes[0].id === 'atom-default'`** → 改排序会破测试。⚠️ CN-01 后该断言已改为「唯一主题 atom-geek」+「按 id 字典序」的通用规则断言 |
| 目录扫描顺序 | 实测 `readdirSync` 在本机 APFS 返回字典序 | 基线成立但属**隐式依赖**（见 D-03）。⚠️ CN-01 后排序已显式化，不再依赖此事实 |
| 工作区状态 | `git status --porcelain` | 仅 `?? IDEA.md`、`?? docs/REQUIREMENTS-ATOM-GEEK.md`；about 页改动**已在 69959a2 提交**，OUT-06 降级为"仍不要改动 about 相关文件" |

---

## 2. 分层架构

```
┌─ L0 站点配置（构建期常量）───────────────────────────────┐
│ src/consts.ts: DEFAULT_THEME_ID = 'atom-geek'            │
│   └→ src/layouts/BaseLayout.astro 解析 defaultThemeId   │
└──────────────────────────────────────────────────────────┘
┌─ L1 主题包（可分发、零依赖、纯 token）───────────────────┐
│ src/themes/atom-geek/manifest.json                       │
│ src/themes/atom-geek/light.css   ← 45 token × light     │
│ src/themes/atom-geek/dark.css    ← 45 token × dark      │
│   ↓ theme-loader.mjs 自动扫描                             │
│ src/generated/themes.{ts,css}（gitignore，自动生成）      │
└──────────────────────────────────────────────────────────┘
┌─ L2 站点级作用域增补（不进主题包，仅本站在用）───────────┐
│ src/styles/_theme-geek.css                               │
│   作用域前缀：html[data-theme='atom-geek']               │
│   内容：直角化 / 等宽角色 / 终端标题栏 / 命令行导航 /      │
│         CRT 叠层 / 404 空态 / 快捷键提示条                │
│   引入点：src/styles/global.css 末尾（最后一个 @import） │
└──────────────────────────────────────────────────────────┘
```

**为什么必须分两层**（这是本次方案的骨架，不是风格偏好）：

- `docs/THEMING.md` 是**全站公共契约**，也是第三方主题的准入依据。主题包一旦写组件样式或 `!important`，等于让第三方主题无法在本站共存 → 破坏的是站点生态，不是这一套主题。
- "直角化 / 等宽角色 / 扫描线 / 终端标题栏"**在 token 体系里不可表达**：它们是「用哪个字体变量」「border-radius 取什么值」的**选择器级**决策。
- 所以：token 归主题包（可复用、可分发），选择器级差异归站点（可随时删、零副作用）。删掉 `_theme-geek.css` 一个文件，站点立即回到纯 token 形态——这是**回退成本最低**的结构。

---

## 3. 设计决策

| ID | 决策 | 理由 | 影响范围 | 被否方案 & 否决理由 |
|---|---|---|---|---|
| **D-01** | 极客质感走 L2 站点级文件，不进主题包 | THEMING.md 禁止主题包写组件样式/覆盖布局 token；且第三方主题生态依赖该契约 | 新增 `src/styles/_theme-geek.css`；`global.css` 加 1 行 | ❌ 把质感塞进主题包 → 破坏公共契约、第三方主题不可用、且主题包体积爆炸 |
| **D-02** | 默认主题用**站点级常量** `DEFAULT_THEME_ID`（`src/consts.ts`） | ① "哪个主题是站点默认"是**站点配置**，不是主题包属性；② 不碰 theme-loader 排序 → `tests/themes.test.ts:73-76` 不破；③ 不扩 manifest schema → 契约面零增长 | `src/consts.ts` +1 行；`BaseLayout.astro:5,32-34` 改 2 行 | ❌ A. manifest 加 `"default": true` → 要改 loader + utils + THEMING.md 三处、扩 schema，且语义上把"站点默认"塞进"包元数据"；❌ B. 改 loader 排序让 `themes[0]` 变 geek → 直接破 `tests/themes.test.ts` |
| **D-03** | `src/utils/themes.ts` 的排序**显式化**（可选但建议） | 现测试依赖 `readdirSync` 字典序这一**隐式事实**；新增主题目录一旦破坏顺序，红灯在测试而非构建 | `src/utils/themes.ts:70-71` 加 3 行排序 | ❌ 不动 → 把稳定性押在文件系统实现细节上 |
| **D-04** | 直角化**不覆盖 `--radius*` token**，改为在 L2 逐选择器写 `border-radius: 0` | 需求 §4.3/§4.4 明令"不得修改全局 `--radius*`"；且覆盖 token 会连带影响 `atom-default`（共享 `:root` 作用域下需额外限定，易漏） | `_theme-geek.css`，38 个圆角点（清单见 §6.2） | ❌ `html[data-theme='atom-geek'] { --radius: 0 }` → 违反需求红线；且 `:root` 与 `html[data-theme]` 的覆盖关系一旦写错，atom-default 观感一起塌 |
| **D-05** | 等宽字体**不新增字体**、不改 `--font-*`，只在 L2 对"数据元素"显式声明 `var(--font-mono)` | 站点已加载 JetBrains Mono（`BaseLayout.astro:91-95`），复用零成本；改 token 会波及其他排版 | `_theme-geek.css`，新增 6 个选择器 + `tabular-nums` | ❌ 引入新等宽字体 → 违反 FN-06（不新增字体请求）与 OUT-07 |
| **D-06** | CRT 叠层用 `html[data-theme='atom-geek']::after`（`position:fixed; z-index:-1`），**不复用** `body::before/::after` | `body::before`=网格、`body::after`=环境辉光，已被占用且 FN-08 要求保留；`html::after` 在负 z-index 栈中**先于** body 的两个伪元素绘制 → 天然形成"画布底 → 扫描线 → 网格 → 辉光 → 正文"的正确层序，且只覆盖背景不遮正文 | `_theme-geek.css` 1 个规则 | ❌ 改 `_background.css` → 影响 `atom-default` 观感（违反 OUT-05 精神）；❌ 改 `body::after` → 吞掉环境辉光 |
| **D-07** | 终端标题栏用**伪元素画状态点**，不改 DOM、不加 JS | `.code-wrapper` 由 `app.js:304-336` 运行时创建，CSS 可直接作用于它；状态点用 `radial-gradient` 一次画 3 点 | `_theme-geek.css` 2 个规则 | ❌ 改 `Header.astro`/`app.js` 写语言名 → app.js 体积增长，破 FN-06；语言名列为可选增强（§6.2 注） |
| **D-08** | `theme-color` meta **本次不动**（记为已知差距） | `BaseLayout.astro:48-49` 硬编码了 `atom-default` 的两个色值；改它属于**站点级**问题而非主题问题，且 FN-25 要求"主题不注入 head 内容" | 无改动 | ❌ 主题包里塞 meta → 主题包禁止 HTML；❌ 改 `app.js` 同步 meta → 破 FN-06（app.js 无增长） |
| **D-09** | 快捷键**只做静态提示条**，不新增键盘监听；命令面板（P2）不做 | FN-20 原文即"仅提示，不含命令面板"；静态条零 JS。搜索/复制/返回顶部等既有快捷键已在 `app.js` 实现，提示条如实展示它们 | `_theme-geek.css` + `Footer.astro` 或 `Header.astro` 一处结构 | ❌ 自研命令面板 → 需新增 JS + 焦点陷阱 + 无障碍，工作量与风险远超 P2 定位 |
| **D-10** | 服务端给 `<html>` 补默认属性（**可选 P1 加固**） | 现在 `<html lang="zh-CN">` 无 `data-theme`，无 JS 时**所有主题色都不生效**（既存问题，非本次引入）。补 `data-theme="atom-geek" data-mode="light"` 后：无 JS 也能看到磷光纸形态；内联脚本仍在 head 同步覆盖，无 FOUC | `BaseLayout.astro:38` 改 1 行 | ❌ 不做 → 无 JS 用户继续看到无色页面 |

---

## 4. L1 主题包规格

### 4.1 `manifest.json` 契约

`docs/THEMING.md:211-236` 定义了字段，**不新增字段**：

```json
{
  "id": "atom-geek",
  "name": "Atom Geek",
  "author": "zz3656",
  "version": "1.0.0",
  "description": "极客主题：暗色磷光绿 + 亮色磷光纸，等宽承担数据",
  "modes": ["light", "dark"],
  "preview": ""
}
```

- `id` 必须匹配 `^[a-z0-9][a-z0-9_-]{0,31}$`（`theme-loader.mjs:26`）→ `atom-geek` ✅
- `modes` 必须与实际存在的 `light.css` / `dark.css` 一致（`theme-loader.mjs:51-58` 会按文件存在性过滤）
- `preview` 留空（P2 才需要预览图；留空不会触发任何校验失败）

### 4.2 完整 token 取值表（45 项 × 双模式）

选择器严格按契约：
`html[data-theme='atom-geek'][data-mode='light']` / `[data-mode='dark']`。
**每个 token 只写在这一个选择器块内**，块内不含任何其他选择器、不含 `!important`、不含注释以外的规则。

| # | Token | dark（磷光绿，主形态） | light（磷光纸） | 备注 |
|---|---|---|---|---|
| 背景 | `--bg-primary` | `#05070a` | `#f2f6f3` | 近黑蓝底 / 浅纸面 |
| | `--bg-secondary` | `#0a0f13` | `#e6ece8` | |
| | `--bg-card` | `#0c1317` | `#f8fbf9` | |
| | `--bg-card-hover` | `#111b20` | `#eef4f0` | |
| | `--bg-inline-code` | `rgba(0,232,143,.09)` | `rgba(0,121,76,.08)` | |
| 文字 | `--text-primary` | `#c7d4d1` | `#16302a` | |
| | `--text-secondary` | `#8b9a97` | `#3d5a52` | |
| | `--text-muted` | `#748682` ⬆ | `#5a726a` ⬆ | **改值**，见 §4.3 |
| | `--text-bright` | `#e9fff6` | `#0a1f19` | |
| 边框 | `--border-color` | `rgba(0,232,143,.20)` | `rgba(0,121,76,.20)` | |
| | `--border-light` | `rgba(0,232,143,.09)` | `rgba(0,121,76,.10)` | 发丝分隔 |
| | `--border-glow` | `rgba(0,232,143,.55)` | `rgba(0,121,76,.45)` | 悬浮/激活态边框 |
| 强调 | `--accent` | `#00e88f` | `#00794c` ⬆ | **改值**，见 §4.3 |
| | `--accent-hover` | `#4bffb6` | `#00613f` ⬆ | **改值** |
| | `--accent-secondary` | `#22d3ee` | `#0a5c72` ⬆ | **改值**（分类通道） |
| | `--accent-gradient` | `linear-gradient(135deg,#00e88f,#22d3ee)` | `linear-gradient(135deg,#00794c,#0a5c72)` | |
| | `--accent-glow` | `rgba(0,232,143,.14)` | `rgba(0,121,76,.12)` | |
| | `--accent-glow-strong` | `rgba(0,232,143,.26)` | `rgba(0,121,76,.22)` | 可选 token |
| | `--glow-secondary` | `rgba(34,211,238,.12)` | `rgba(10,92,114,.12)` | |
| | `--purple-glow` | `rgba(34,211,238,.12)` | `rgba(10,92,114,.12)` | 旧别名，保留兼容 |
| 标签 | `--tag-bg` | `transparent` | `transparent` | |
| | `--tag-text` | `#5ee9b0` | `#00794c` | |
| | `--tag-border` | `rgba(0,232,143,.28)` | `rgba(0,121,76,.28)` | |
| | `--tag-active-bg` | `rgba(0,232,143,.14)` | `rgba(0,121,76,.14)` | |
| 分类 | `--cat-bg` | `rgba(34,211,238,.10)` | `rgba(10,92,114,.10)` | |
| | `--cat-text` | `#67e8f9` | `#0a5c72` ⬆ | **改值** |
| | `--cat-border` | `rgba(34,211,238,.30)` | `rgba(10,92,114,.30)` | |
| | `--cat-active-bg` | `rgba(34,211,238,.18)` | `rgba(10,92,114,.16)` | |
| 语义 | `--success` | `#3ddc97` | `#0d7340` ⬆ | **改值** |
| | `--warning` | `#ffb454` | `#b45309` | |
| 阴影 | `--shadow-sm` | `0 1px 2px rgba(0,0,0,.50)` | `0 1px 2px rgba(10,40,30,.06)` | |
| | `--shadow` | `0 1px 3px rgba(0,0,0,.55)` | `0 1px 3px rgba(10,40,30,.08)` | |
| | `--shadow-md` | `0 6px 18px rgba(0,0,0,.60)` | `0 6px 18px rgba(10,40,30,.10)` | |
| | `--shadow-lg` | `0 14px 38px rgba(0,0,0,.70)` | `0 14px 38px rgba(10,40,30,.12)` | |
| | `--shadow-glow` | `0 0 0 1px rgba(0,232,143,.30), 0 0 22px rgba(0,232,143,.18)` | `0 0 0 1px rgba(0,121,76,.22), 0 0 18px rgba(0,121,76,.12)` | 辉光代替投影 |
| 语义表面 | `--on-accent` | `#04140d` | `#ffffff` | |
| | `--header-bg` | `rgba(5,7,10,.82)` | `rgba(242,246,243,.88)` | 吸顶栏半透明 |
| | `--panel-bg` | `#081014` | `#eaf1ed` | TOC / 面板底 |
| | `--code-bg` | `#05090b` | `#e8efea` | 代码块底 |
| | `--grid-line` | `rgba(0,232,143,.045)` | `rgba(0,121,76,.05)` | 页面底纹网格线 |
| | `--highlight` | `rgba(0,232,143,.20)` | `rgba(0,121,76,.16)` | 搜索命中高亮 |
| | `--ambient-glow` | `rgba(0,232,143,.06)` | `rgba(0,121,76,.05)` | 角落环境光 |
| | `--rule-tick` | `rgba(0,232,143,.18)` | `rgba(0,121,76,.20)` | 短刻度 |
| | `--rule-tick-strong` | `rgba(0,232,143,.62)` | `rgba(0,121,76,.50)` | 长刻度 |
| | `--focus-ring` | `#00e88f` | `#00794c` ⬆ | **改值** |
| | `--glow-secondary` | 见「强调」组 | 见「强调」组 | v3 语义表面 11 项之一 |

> ⬆ = 相对需求文档 §4.2 的取值做了**改值**，原因见 §4.3。其余 39 项与需求一致。

### 4.3 对比度核验（WCAG 2.1 AA）——为什么改了 6 个 token

需求 §4.2 给的亮色取值**有 6 处未达 AA**。以下为实测值（sRGB 相对亮度公式，alpha 背景按源-over 合成后计算）：

**未达标项（需求原值 → 实测 → 处置）**

| Token | 场景 | 需求原值 | 实测 | 要求 | 处置 |
|---|---|---|---|---|---|
| `--text-muted` (light) | on `#f2f6f3` | `#6b857d` | **3.65** | ≥4.5 | → `#5a726a`（**4.75**） |
| `--text-muted` (dark) | on `#05070a` | `#5d6c6a` | **3.67** | ≥4.5 | → `#748682`（**5.26**） |
| `--accent` (light) | on `#f2f6f3` | `#00a86b` | **2.83** | ≥4.5 | → `#00794c`（**5.01**） |
| `--accent-hover` (light) | on `#f2f6f3` | `#008c5a` | **3.93** | ≥4.5 | → `#00613f`（**6.92**） |
| `--on-accent` (light) | on `--accent` | `#ffffff` | **3.08** | ≥4.5 | 随 `--accent` 修正后 **5.47** ✅ |
| `--success` (light) | on `#f2f6f3` | `#128a4f` | **4.03** | ≥4.5 | → `#0d7340`（**5.43**） |
| `--cat-text` (light) | on `--cat-bg` 合成 | `#0e7490` | **4.30** | ≥4.5 | → `#0a5c72`（**6.34**） |
| `--focus-ring` (light) | on `#f2f6f3` | `#00a86b` | **2.83** | ≥3.0（非文本） | → `#00794c`（**5.01**） |

**修正后全量复核（全部 PASS）**

| 模式 | 取样点 | 比值 |
|---|---|---|
| dark | text-primary / text-secondary / text-muted / text-bright on bg-primary | 13.22 / 6.88 / 5.26 / 19.30 |
| dark | accent on bg-primary / bg-card；accent-hover on bg-primary | 12.43 / 11.54 / 15.63 |
| dark | on-accent on accent；cat-text on bg-primary / cat-bg | 11.65 / 13.91 / 12.18 |
| dark | tag-text on bg-primary / bg-card；success；warning | 13.21 / 12.27 / 11.41 / 11.44 |
| dark | focus-ring on bg-primary（非文本 ≥3） | 12.43 |
| light | text-primary / text-secondary / text-muted / text-bright on bg-primary | 12.92 / 6.92 / 4.75 / 15.74 |
| light | accent on bg-primary / bg-card；accent-hover | 5.01 / 5.25 / 6.92 |
| light | on-accent on accent；cat-text on bg-primary / cat-bg | 5.47 / 6.91 / 6.34 |
| light | tag-text；success；warning；focus-ring（非文本） | 5.01 / 5.43 / 4.60 / 5.01 |

**取舍说明**：亮色主色从"鲜亮磷光绿 `#00a86b`"降为"深磷光绿 `#00794c`"，牺牲了鲜亮度换取 AA。原因是 `--accent` 是**链接色**（`_reset.css`/`_post.css` 中正文链接用它），小字号文本需 4.5:1。暗色主形态不受影响（`#00e88f` = 12.43:1），鲜亮感保留在暗色——这与需求"深色为主基调"的定位一致。

### 4.4 token → 组件消费映射表

来源：对 `src/styles/_modules/*.css` + `src/components/*.astro` + `src/pages/**/*.astro` 全量 `var(--*)` 扫描。

| Token 族 | 消费模块（文件） | 代表选择器 | 引用数 | 在极客主题下的可见度 |
|---|---|---|---|---|
| `--accent` | `_reset.css` `_post.css` `_buttons.css` `_header.css` `_log.css` `_sections.css` `_tags.css` `_toc.css` `_search.css` `_pagination.css` `_pages.css` `_post-extras.css` `_footer.css` `_hero.css` `_layout.css` `_responsive.css` `_scrollbar.css` `_about.css` | `.nav-link.active`、`.btn`、`.toc-link.active`、`.log-row a:hover`、`.progress-fill` | **77** | ★★★★★ 主交互色，改值影响面最大 |
| `--border-color` | `_post.css` `_pages.css` `_post-extras.css` `_header.css` `_search.css` `_toc.css` `_buttons.css` `_pagination.css` `_responsive.css` `_scrollbar.css` `_about.css` | `.post-content` 边框、`.tag-card`、`.search-input` | 35 | ★★★★☆ |
| `--font-mono` | `_pages.css` `_sections.css` `_log.css` `_post.css` `_hero.css` `_toc.css` `_tags.css` `_header.css` `_pagination.css` `_footer.css` `_about.css` | `.log-index` `.log-date` `.section-count` `.telemetry-row dd` `.post-meta` `.tag` | 32 | ★★★★☆ 等宽角色的底座 |
| `--text-muted` | 全站辅助文本 | `.log-date` `.footer-*` `.section-count` | 26 | ★★★★☆ **本次改值，务必用 §4.2 的值** |
| `--text-bright` | 标题 | `.log-title` `.section-title` `.post-header h1` | 20 | ★★★★☆ |
| `--text-secondary` | 摘要/副文 | `.log-desc` `.post-description` | 18 | ★★★☆☆ |
| `--accent-glow` | `_buttons.css` `_search.css` `_post.css` `_header.css` `_log.css` `_toc.css` `_pagination.css` `_post-extras.css` `_footer.css` | 悬浮辉光 | 15 | ★★★★☆ 极客主题的层次主要来源 |
| `--bg-card` | `_post.css` `_post-extras.css` `_search.css` `_pages.css` `_header.css` `_about.css` | 卡片面 | 13 | ★★★★☆ |
| `--on-accent` | `_buttons.css` `_pagination.css` `_pages.css` `_layout.css` `_post.css` | 实心块上的文字 | 8 | ★★★☆☆ **亮色随 `--accent` 修正** |
| `--rule-tick` / `--rule-tick-strong` | `_variables.css`(`.rule`) `_footer.css` `_log.css` `_toc.css` `_post.css` | 刻度尺、日志脊线 | 5 / 3 | ★★★★★ **站点签名元素** |
| `--header-bg` / `--panel-bg` / `--code-bg` | `_header.css` / `_toc.css` / `_post.css` | 吸顶栏、TOC 面板、代码块 | 1 / 1 / 1 | ★★★★☆ |
| `--grid-line` / `--ambient-glow` | `_background.css` | `body::before` / `body::after` | 2 / 1 | ★★★★★ **FN-08 的落点** |
| `--highlight` / `--focus-ring` | `_reset.css` / `_search.css` | `mark` 命中、`:focus-visible` | 2 / 1 | ★★★★☆ |
| `--success` / `--warning` | `_post.css` `_footer.css` | 打赏/提示语义色 | 3 / 1 | ★★☆☆☆ |
| `--cat-*`（4 项） | `_tags.css` `_pages.css` | `.post-category-tag`、分类卡 | 各 1 | ★★★☆☆ 分类通道 |
| `--tag-*`（4 项） | `_tags.css` | `.tag` | 各 1 | ★★★☆☆ |
| `--bg-secondary` / `--bg-card-hover` / `--bg-inline-code` | `_post-extras.css` `_post.css` `_search.css` `_about.css` | 次级面、悬浮态、行内 code | 6 / 2 / 2 | ★★★☆☆ |
| `--shadow-sm` / `--shadow` / `--shadow-md` / `--shadow-lg` / `--shadow-glow` | `_post.css` `_about.css` `_search.css` `_layout.css` `_responsive.css` | 投影 | 0 / 1 / 4 / 1 / 1 | ★★☆☆☆ 极客主题下投影让位给辉光 |
| `--accent-secondary` | **无模块消费** | — | **0** | ☆ 仅契约完整性 + 未来第三方主题 |
| `--accent-gradient` | **无模块消费** | — | **0** | ☆ 同上 |
| `--accent-glow-strong` | **无模块消费** | — | **0** | ☆ 同上 |
| `--glow-secondary` / `--purple-glow` | **无模块消费** | — | **0** | ☆ 同上 |

> **结论**：45 个 token 中，**5 个当前无任何组件消费**。它们是"契约完整性 token"——必须实现（FN-03）但不影响本站视觉。前端实现时不要因为"没人用"而漏写，也不要试图给它们找消费者。

---

## 5. 默认主题生效机制（FN-05）

### 5.1 现状链路

```
构建: theme-loader.mjs 扫描 → themes.ts = [atom-geek]（⚠️ CN-01 后按 id 字典序）
                                        ↓
渲染: BaseLayout.astro:32-34  defaultThemeId = DEFAULT_THEME_ID（缺失时回退 themes[0]）
                                        ↓
运行时: BaseLayout.astro:97-113 内联脚本
        id = localStorage.themeId
        if (!id || themeIds 不含 id) id = defaultThemeId
        html[data-theme]=id ; html[data-mode]=mode
```

### 5.2 方案（D-02）

只改**一处解析逻辑**，把"默认主题"从"清单第 1 个"改成"站点配置的常量，缺失时回退清单第 1 个"。

**改动 1 — `src/consts.ts`**（文件末尾追加）

```ts
/** 站点默认主题 ID（构建期常量）。
 *  主题包被移除/未注册时自动回退到清单首个可用主题（见 BaseLayout.astro）。 */
export const DEFAULT_THEME_ID = 'atom-geek';
```

**改动 2 — `src/layouts/BaseLayout.astro`**

- 第 5 行现有 import 扩展：`import { SITE_TITLE, ..., DEFAULT_THEME_ID } from '../consts';`
- 第 32-34 行替换：

```ts
const themeIds = themes.map((t) => t.id);
// 默认主题：优先站点配置 DEFAULT_THEME_ID；未注册时回退清单首个
const defaultThemeId = themeIds.includes(DEFAULT_THEME_ID)
  ? DEFAULT_THEME_ID
  : themeIds[0] || DEFAULT_THEME_ID;
```

> **勘误（CN-01）**：原写法末位兜底是硬编码 `'atom-default'`。`atom-default` 已移出本站后，硬编码它会指向一个不存在的 theme id，兜底值必须改为 `DEFAULT_THEME_ID` 本身。

**内联脚本 `BaseLayout.astro:97-113` 不需要任何改动** —— 它的逻辑已经是"localStorage 有效值优先，否则用 defaultThemeId"，天然满足"老访客的选择不被覆盖"。

### 5.3 行为矩阵

| 访客状态 | `localStorage.themeId` | `localStorage.themeMode` | 结果 |
|---|---|---|---|
| 新访客（无存储） | 无 | 无 | `atom-geek` + 跟随系统明暗 ✅ FN-05 |
| 老访客（只存过模式） | 无（UI 从不写此键） | `light`/`dark` | `atom-geek` + **保留原模式** ✅ 不覆盖老访客选择 |
| 老访客（历史存过 `atom-default`） | `atom-default` | 任意 | ⚠️ **勘误（CN-01）**：`atom-default` 已不在清单内 → 内联脚本校验失败 → 回退 `atom-geek`（模式仍保留）。这是单主题化的**必然行为变化**：老访客的「主题选择」不再可保留，但「日/夜选择」始终保留 |
| 非法/过期主题 ID | `xxx` | 任意 | 回退 `atom-geek` ✅（内联脚本 `themeIds.indexOf(id) === -1`） |
| `atom-geek` 主题目录被删除 | 无 | 任意 | 清单为空 → 兜底 `DEFAULT_THEME_ID`（主题 CSS 缺失，页面退化为无主题态）⚠️ 勘误（CN-01）：原写「回退 `themes[0]` = atom-default」已不成立 |
| 手动设 `themeId='atom-default'` | `atom-default` | 任意 | 同上，回退 `atom-geek` ✅ |

### 5.4 被否方案

- ❌ **改 `theme-loader.mjs` 排序**（让 geek 排第 1）→ `tests/themes.test.ts:73-76` 直接失败；且把"站点默认"塞进"包排序"语义混乱。
- ❌ **manifest 加 `"default": true`** → 需同时改 `theme-loader.mjs`、`src/utils/themes.ts`、`docs/THEMING.md` 三处，契约面扩大但收益为零。
- ❌ **改 `localStorage` 迁移逻辑**（给老访客批量写 `themeId='atom-geek'`）→ 侵入用户数据、且与"不覆盖老访客选择"冲突。

---

## 6. L2 站点级增补

### 6.1 落点与引入

**文件**：`src/styles/_theme-geek.css`（新增，**放在 `src/styles/` 根下，不进 `_modules/`**）
—— `_modules/` 是跨主题共享的组件层，把主题专属规则塞进去会污染共享层；独立文件 = 可整份删除、零残留。

**引入**：`src/styles/global.css` 末尾追加（最后一个 `@import`）：

```css
/* 22. Theme-scoped augmentations（站点级；作用域锁定单个主题，可整份删除） */
@import './_theme-geek.css';
```

**作用域铁律**：文件中**每一条规则**都必须以 `html[data-theme='atom-geek']` 开头（或其后代选择器）。不得出现无作用域规则、不得使用 `!important`、不得修改任何 `--radius*`/`--font-*`/`--max-width`/`--content-width`/`--rule-*`/`--log-gutter` token。

**顺序**：放在最后是为了在同特异性时稳赢通用模块；`html[data-theme='atom-geek'] .x` 特异性 (0,2,1) 已高于通用 `.x` (0,1,0)，属双保险。

### 6.2 规则清单（按需求编号）

**① 直角化（D-04 / FN-13）** — 38 个圆角点，全部置 `border-radius: 0`（徽标类保留 ≤2px）：

| 分组 | 选择器 | 源文件 |
|---|---|---|
| 正文/代码 | `.post-content pre` `.post-content code` `.post-content img` `.post-content .table-scroll` `.post-content blockquote` `.hero-image` `.code-copy-btn` `.image-zoom-overlay .image-zoom-img` | `_post.css:223,214,250,300,203,99,353,410` |
| TOC | `.toc` `.toc-link` | `_toc.css:27,141` |
| 搜索 | `.search-input` `.search-results` | `_search.css:27,63` |
| 按钮/导航 | `.btn` `.theme-toggle` `.nav-toggle` `.skip-link` `.back-to-top` | `_buttons.css:12`、`_header.css:148`、`_responsive.css:72`、`_layout.css:110,63` |
| 列表/分页 | `.tag-card` `.tag-card-count` `.view-all a` `.page-btn` `.page-link` | `_pages.css:75,109,163`、`_pagination.css:21,53` |
| 文章周边 | `.post-reward` `.reward-item img` `.post-nav a` `.post-nav-link` `.related-posts` `.related-link` | `_post-extras.css:8,37,69,95,139,166` |
| 标签 | `.tag` `.post-category-tag` | `_tags.css:13,37` |
| 页脚 | `.footer-links a` `.footer-version` `.footer-bottom a` | `_footer.css:97,142,160` |
| 全局 | `img` | `_reset.css:79` |
| 关于页 | `.about-stats` `.project-card` `.topic-card` `.skill-tag` | `_about.css:81,127,198,246` ⚠️ 见下方注 |

> ⚠️ `_about.css` 有你（周杰伦）的改动已提交在 `69959a2`。**不修改该文件**，只在 L2 里用作用域覆盖其圆角。实现时需目视核对 about 页是否有新增的圆角元素需要补进清单。

**保留圆角**（不得直角化）：`.footer-built::before`（圆点 50%）、`.image-zoom-close`（圆形关闭钮 50%）、`.search-result-title mark`（≤2px）、`:focus-visible`（2px）、`.hamburger-line`（1px）、`.theme-toggle .theme-icon`（3px，固定值非 token）。

> 清单总数核对：`grep -h "border-radius" src/styles/_modules/*.css | grep -c "var(--radius"` = **38**，与上表逐条对应，无遗漏、无重复。

**② 等宽角色（D-05 / FN-14）** — 站点已有 31 处等宽用法（`.log-index` `.log-date` `.section-count` `.telemetry-row dd` `.post-meta` `.tag` `.toc-title` `.page-link` `.post-eyebrow` …），**L2 只需补 6 处 + 统一数字等宽**：

| 新增等宽选择器 | 理由 |
|---|---|
| `.nav-link` | 命令行导航 `~/blog` 形态（FN-17） |
| `.search-input` | 终端输入框 |
| `.code-copy-btn` | 复制按钮（当前 `--font-sans`） |
| `.hero-eyebrow-mark` `.post-eyebrow-mark` `.post-eyebrow-sep` | 提示符与分隔符 |

并对数据类元素统一加 `font-variant-numeric: tabular-nums;` + `letter-spacing: .04–.08em`（覆盖 `.log-index` `.log-date` `.section-count` `.telemetry-row dd` `.post-meta` `.tag-card-count` `.about-stat dd`）。

**③ 终端标题栏（FN-15 / D-07）** — 纯 CSS 伪元素，零 DOM 改动：

- 页头：`.site-header` 顶部加 1px 状态条，`::before` 用 `radial-gradient` 一次画 3 个状态点（绿/黄/红），`::after` 画等宽标题文本。**注意** `.site-header` 是吸顶元素（`_header.css`），状态点必须 `position:absolute; top:0; right:0` 且 `pointer-events:none`，不遮挡导航与移动端汉堡菜单。
- 代码块：`.code-wrapper`（运行时由 `app.js:304-336` 创建）加 `::before` 状态点条；`.code-copy-btn` 已有右侧操作位。
- **可选增强（不做）**：在标题栏显示语言名需读 `pre` 的 class → CSS 做不到，需在 `app.js` 写 `data-lang`（+1 行 JS，破 FN-06）→ **本次不做**。

**④ 命令行导航（FN-17）** — `.nav-link` 的文本前加 `~/` 前缀属**内容层改动**（Q-05 未拍板前不动 HTML）。v1 纯 CSS 方案：`.nav-link::before { content: '~/'; opacity:.45 }` 属装饰性前缀，**若 Chief 判定 Q-05 为"文案硬编码不可动"，则整条 FN-17 降级为仅等宽字体 + 激活态高亮**，见 §10。

**⑤ CRT 叠层（FN-16 / D-06）** — `html[data-theme='atom-geek']::after`：

```
position: fixed; inset: 0; z-index: -1; pointer-events: none;
background: repeating-linear-gradient(0deg, rgba(0,0,0,.028) 0 1px, transparent 1px 3px);
```
层序天然为：画布底 → 扫描线 → 网格(`body::before`) → 环境辉光(`body::after`) → 正文，**只覆背景不遮正文**。
降级：`prefers-reduced-motion: reduce` 或 `forced-colors: active` → `display:none`（整体移除）。

**⑥ 404 空态（FN-19）** — `src/pages/404.astro` 已有结构，L2 只做外观（等宽错误码、终端边框、提示符）。**不改 404.astro 的 HTML**（若需加提示符文案同样受 Q-05 约束）。

**⑦ 快捷键提示条（FN-20 / D-09）** — 静态条，如实展示**已存在**的快捷键（`app.js` 实际实现）：`/` 或输入框聚焦→搜索、`Esc`→关闭搜索结果/图片浮层、`↑↓`→搜索结果导航、`Enter`→打开、`Ctrl/⌘+K` ❌ **不存在，不要写**。位置建议 `Footer.astro` 顶部一条细带；移动端隐藏。**零新增 JS**。

**⑧ 焦点环（FN-11）** — `_reset.css:79` 的 `:focus-visible` 已用 `--focus-ring`；L2 只需加粗到 2px + 2px offset（`outline-offset:2px`），**不加 `!important`**。

### 6.3 降级路径

| 媒体查询 | 处置 |
|---|---|
| `prefers-reduced-motion: reduce` | CRT 叠层 `display:none`；所有 `animation`/`transition` 归零（`animation: none; transition: none`）；`.rule--draw` 的 `ruleDraw` 动画（`_variables.css:66-75`）保持原样（它是 clip-path 揭示，非持续动效，reduced-motion 下仍可保留，但需确认） |
| `forced-colors: active` | 关闭 CRT 与辉光（`box-shadow: none`），保留边框与焦点环 |
| `prefers-contrast: more` | 边框 alpha 上调（`--border-color` 已在 token 层，可由 L2 覆盖为不透明） |

### 6.4 零 JS 承诺（L1+L2 合计）

| 约束 | 本方案的达成方式 |
|---|---|
| 不新增 JS 文件/请求 | L2 纯 CSS；不碰 `src/scripts/app.js` |
| `app.js` 体积不增长 | 不改 `app.js`（连 `data-lang` 那 1 行也不加） |
| 不新增字体请求 | 复用已加载的 JetBrains Mono（`BaseLayout.astro:91-95`） |
| 不新增依赖 | 只用 CSS 自有属性；`package.json` 不动 |

---

## 7. 目录结构与改动清单

```
src/
├── consts.ts                          ← 改：+1 行 DEFAULT_THEME_ID
├── layouts/
│   └── BaseLayout.astro               ← 改：+1 import、2 行默认主题解析
├── styles/
│   ├── global.css                     ← 改：末尾 +2 行（1 条 @import + 注释）
│   ├── _theme-geek.css                ← 新增：L2 全部规则（作用域锁定 atom-geek）
│   └── _modules/                      ← 不动（含 _about.css）
├── themes/
│   ├── (atom-default 已移出本站，CN-01)
│   └── atom-geek/                     ← 新增：3 个文件
│       ├── manifest.json
│       ├── light.css
│       └── dark.css
├── utils/themes.ts                    ← 改（可选，D-03）：显式排序 3 行
├── generated/                         ← 自动生成（.gitignore），不手改
└── pages/、components/                 ← 不动

docs/
├── ARCHITECTURE-ATOM-GEEK.md          ← 新增（本文件）
├── REQUIREMENTS-ATOM-GEEK.md          ← 产品分析产出，不动
└── THEMING.md                         ← 可选：补一段"L2 站点级增补"约定说明
```

**禁止触碰**：`src/pages/about.astro`、`src/styles/_modules/_about.css`、`src/scripts/app.js`、`src/generated/**`、`package.json`。

⚠️ CN-01：`src/themes/atom-default/` 已删除（文件保留在 git 历史 `1d6073b` 与本地 `~/Documents/GitHub/atom-themes/atom-default/`）。

---

## 8. 体积核算

### 8.1 主题包（L1）

| 文件 | 预估 | 说明 |
|---|---|---|
| `manifest.json` | ≈300B | 7 个字段 |
| `light.css` | ≈3.0KB | 45 个 token + 注释 |
| `dark.css` | ≈2.8KB | 45 个 token + 注释 |
| **合计** | **≈6.1KB** | 预算 16KB，**余量 62%**（对照 `atom-default` 实测 5.75KB） |

### 8.2 L2 CSS

| 规则组 | 预估 |
|---|---|
| 直角化 38 点（合并为 8 条组合规则） | ≈1.1KB |
| 等宽角色 6 条 + tabular-nums | ≈0.6KB |
| 终端标题栏（页头 + 代码块） | ≈0.9KB |
| 命令行导航前缀 + 激活标记 | ≈0.4KB |
| CRT 叠层 + 降级 | ≈0.5KB |
| 404 空态 / 快捷键条 / 焦点环 | ≈1.0KB |
| 注释与格式 | ≈1.0KB |
| **源码合计** | **≈5.5KB**（预算 8KB） |
| **压缩后（gzip）** | **≈4.0KB** |

### 8.3 全站影响 ⚠️

`astro.config.mjs:39` 设了 `inlineStylesheets: 'always'` → **没有独立 CSS 文件**，所有 CSS 内联进每个页面的 HTML：

- 每页 HTML 增量：L1 主题 CSS（两个模式全量内联 ≈5.8KB 源码 ≈1.5KB 压缩）+ L2（≈4KB 压缩）≈ **+5.5KB/page（压缩后）**
- 10 个路由全覆盖 → 全站 HTML 总量增加约 55KB（压缩后），**对 LCP 的影响在预算内**（内联 CSS 无额外请求，且 CSS 提前到 `<head>`，不产生 FOUC）
- 现有全站 CSS 约 65KB 源码 → 增量约 +8.5%，在 NFR 预算内

### 8.4 性能预算影响（对照需求 §9）

| 指标 | 目标 | 本方案影响 |
|---|---|---|
| LCP | ≤2.5s | CSS 内联，无新增请求；扫描线是 `position:fixed` 合成层，不触发布局 → 中性 |
| CLS | ≤0.1 | 扫描线 `position:fixed` 不参与布局；CRT 用渐变不改变盒模型 → 中性 |
| INP | ≤200ms | 零新增 JS → 中性 |
| 主题引入 JS | 0KB | **0KB ✅** |
| 主题包体积 | ≤16KB | ≈6.1KB ✅ |
| L2 CSS 增量 | ≤8KB | ≈5.5KB 源码 / ≈4KB 压缩 ✅ |

---

## 9. 风险与取舍

| ID | 风险 | 等级 | 缓解措施 |
|---|---|---|---|
| R-01 | **亮色主色降饱和**，与需求"极客亮色"观感有落差 | 中 | 已与需求取值做偏差登记（§4.3）；暗色为主形态，鲜亮感保留；如用户坚持原值，可改用"仅链接加粗/加下划线"补偿（但需新样式规则） |
| R-02 | L2 38 点直角化清单可能漏项（尤其 about 页新元素） | 中 | 验收用"全站截图巡检 + 计算样式抽查 `border-radius`"；清单已按源文件行号固化，可逐条勾验 |
| R-03 | `html::after` 扫描线在部分浏览器/滚动场景表现不一致 | 低 | 降级路径已给；验收需覆盖首页 + 长文滚动页 + 移动端三种场景 |
| R-04 | `src/utils/themes.ts` 排序隐式依赖（测试断言 `themes[0]`） | 低 | D-03 显式化排序；即便不改，实测 APFS 字典序也保序 |
| R-05 | 内联 CSS 导致每页 HTML 增大 | 低 | 已核算（+5.5KB/page 压缩后）；未超 NFR 预算 |
| R-06 | `theme-color` 浏览器色条仍是 `atom-default` 色 | 低 | 记为已知差距（D-08）；如需修复，是独立的站点级小改，不阻塞本次 |
| R-07 | 终端标题栏状态点与移动端汉堡菜单重叠 | 低 | 状态点用 `position:absolute` + `pointer-events:none`，验收需过 600/480 断点 |
| R-08 | FN-17 命令行前缀属文案改动，可能被 Chief/用户否掉 | 低 | 已设计"纯 CSS 装饰前缀"与"仅等宽+高亮"两级降级，不阻塞其它项 |

---

## 10. 实施顺序（交给前端工程师）与验收锚点

**阶段 1 — L1 落地（无侵入，先行可验证）**
1. `npm run theme:create atom-geek --name "Atom Geek" --accent "#00e88f"`（脚手架会生成 3 个合规文件，模板已含全部 45 个 token）
2. 按 §4.2 全量替换 `light.css` / `dark.css` 的 token 取值（**不是打补丁，是整表对齐**，避免脚手架默认色残留）
3. 跑 `npm run build`，确认 `src/generated/themes.ts` 出现 `atom-geek` 且 `themes.css` 含 4 条 `@import`
4. 人工在浏览器把 `html[data-theme='atom-geek']` 临时打上，**只看 token 效果**（此阶段无直角/等宽/质感）
   → 验收锚点：FN-02 / FN-03 / FN-08 / FN-10 / FN-11 / FN-12 / FN-21 / FN-22

**阶段 2 — 默认主题机制**
5. `src/consts.ts` + `src/layouts/BaseLayout.astro` 按 §5.2 改（2 个文件，共 3 行）
6. 验收：`localStorage` 清空 → 首屏即极客；存 `themeMode` → 模式保留；存已失效的 `themeId` → 回退 atom-geek
   → 验收锚点：FN-04 / FN-05 第 1 条

**阶段 3 — L2 增补**
7. 新建 `src/styles/_theme-geek.css`，按 §6.2 逐组写；`global.css` 末尾加 import
8. 按 §6.2① 清单逐条直角化（38 点）
9. 验收锚点：FN-13 / FN-14 / FN-15 / FN-16 / FN-17 / FN-18 / FN-19 / FN-20 / FN-11（焦点环）

**阶段 4 — 收口**
10. `npm run build && npm run test && npm run check && npm run lint` 全绿
11. `git mv`/新增文件入库，**不提交**（提交与否由 Chief 决定）
    → 验收锚点：DoD 全部

**给测试工程师的三个硬锚点**（对应需求的 A–F 清单）：
- A. `src/generated/themes.ts` 存在 `atom-geek` 且 modes 含 light+dark；主题包 CSS 内**无组件选择器、无 `!important`**
- B. 10 路由 × 2 模式截图；⚠️ CN-01 后**不再有「与 atom-default 对比」**（参照系已移出）→ 改为「每个板块的信息架构与交互形态是否真的改变」+ 作用域静态审计
- C. 移除 `src/themes/atom-geek/` 后 `npm run build` 仍成功（空清单兜底 `DEFAULT_THEME_ID`，站点不崩）

---

## 11. 待拍板 / 待确认（架构侧需要回复）

| 编号 | 问题 | 架构侧意见 | 影响 |
|---|---|---|---|
| **Q-01** | 是否放行 L2 站点级作用域增补 | **建议放行**。不放行则 FN-13/14/15/16/17/18/19/20 共 8 条需求作废，主题退化为"换色" | 不放行 → 方案只保留 L1 + §5 默认主题机制 |
| **Q-02** | 主题生效方式 | ✅ 已定：单主题站点，`atom-geek` 为唯一主题且默认生效；`atom-default` 移出本站（CN-01）。**不引入主题选择器 UI**（不改 `Header.astro`） | 若日后要访客自选，需重新引入多主题 + 选择器 UI（独立需求） |
| **Q-03** | 主色方向 | **采用需求建议的磷光绿 + 青**（暗色 `#00e88f` + `#22d3ee`）。**但亮色已按 AA 降饱和**（§4.3），需用户确认接受 | 若用户坚持亮色原色 → 需改为"链接加下划线 + 加粗"补偿方案 |
| **Q-05** | 终端化文案是否允许改硬编码文案（`Precision Log`、导航标签） | 本方案 v1 **不动任何 HTML 文案**；FN-17 用 CSS 装饰前缀实现；若判定不可动，FN-17 降级为"等宽 + 激活高亮" | 影响 FN-17 / FN-18 / FN-19 的达成度 |
| **Q-06**（新增） | `theme-color` 浏览器色条是否跟随主题 | 建议**本次不做**，作为独立小改（改 `BaseLayout.astro:48-49` + 内联脚本，不增请求） | 影响"换肤即换站感"的完整度 |
| **Q-07**（新增） | 是否接受"无 JS 时无主题色"的既存问题 | 建议 D-10 顺手修（`BaseLayout.astro:38` 加 `data-theme`/`data-mode`，1 行） | 影响无 JS / 爬虫 / 社交卡片抓取的表现 |

---

<div align="center">

**[⬆ 返回顶部](#极客化博客主题--技术方案与接口契约-v1atom-geek)** · **[📋 需求说明 v1](./REQUIREMENTS-ATOM-GEEK.md)** · **[🎨 主题开发指南](./THEMING.md)**

</div>
