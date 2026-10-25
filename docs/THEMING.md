# Atom Blog — 主题开发指南

> 想为 Atom 博客开发一个新主题？本文档解释主题结构、必需 token、选择器约定和发布流程。

## 项目状态说明（v2 以后）

Atom v2 起重新定位为**轻量化博客**：

- **默认只附带一个主题**：`atom-default`（位于 `src/themes/atom-default/`，自带 light + dark）
- **不内置多主题选择器 UI**：右上角只有简单的日/夜切换按钮
- **多主题基础设施保留**：你（第三方开发者）仍可开发新主题并发布

`npm run theme:create <id>` 脚手架会自动创建 `src/themes/<id>/` 目录，构建时会**自动被扫描加入**（无需修改任何其他文件）。

如果你想让用户能在 UI 切换多个主题，需自己扩展 `src/components/Header.astro`——本文档专注于"主题本身"如何开发，不涉及 UI 集成。

## 目录

- [主题结构](#主题结构)
- [必需 CSS Token](#必需-css-token)
- [可选 CSS Token](#可选-css-token)
- [选择器约定](#选择器约定)
- [模式机制](#模式机制)
- [manifest.json 字段](#manifestjson-字段)
- [创建你的第一个主题](#创建你的第一个主题)
- [测试主题](#测试主题)
- [发布到社区](#发布到社区)
- [最佳实践](#最佳实践)
- [FAQ](#faq)

---

## 主题结构

每个主题是一个独立的目录，位于 `src/themes/<theme-id>/`：

```
src/themes/atom-default/
├── manifest.json     # 主题元数据
├── light.css         # 浅色模式 token
└── dark.css          # 暗色模式 token (可选)
```

**规则**：

1. 目录名必须与 `manifest.json` 中的 `id` 字段一致
2. 文件名固定：`manifest.json`、`light.css`、`dark.css`（仅 `light` 可选）
3. 主题目录**只能**包含 CSS token；不要放组件、HTML 或 JS

---

## 必需 CSS Token

主题**必须**实现以下 token（否则布局/组件会渲染异常）：

### 背景 (5 个)

| Token | 用途 | 典型值 |
|-------|------|--------|
| `--bg-primary` | 页面主背景 | `#ffffff` / `#0a0a0f` |
| `--bg-secondary` | 卡片/次级背景 | `#f8f9fa` / `#1a1a25` |
| `--bg-card` | 卡片背景 | `#ffffff` / `#16161f` |
| `--bg-card-hover` | 卡片悬浮态 | `#f8f9fc` / `#1a1a25` |
| `--bg-inline-code` | 行内 code 背景 | 半透明主色 |

### 文本 (4 个)

| Token | 用途 |
|-------|------|
| `--text-primary` | 主要文本 |
| `--text-secondary` | 次要文本（描述、卡片副文）|
| `--text-muted` | 弱化文本（时间戳、辅助信息）|
| `--text-bright` | 强调文本（标题 hover、突出）|

### 边框 (3 个)

| Token | 用途 |
|-------|------|
| `--border-color` | 标准边框 |
| `--border-light` | 极淡边框（分隔线、辅助）|
| `--border-glow` | 强调边框（hover、激活态）|

### 主色 (5 个)

| Token | 用途 |
|-------|------|
| `--accent` | 主色（链接、按钮、icon）|
| `--accent-hover` | 主色 hover |
| `--accent-secondary` | 副主色（次级高亮）|
| `--accent-gradient` | 渐变（CTA、Logo）|
| `--accent-glow` | 主色阴影/光晕 |

### Tag & Category (8 个)

| Token | 用途 |
|-------|------|
| `--tag-bg`、`--tag-text`、`--tag-border`、`--tag-active-bg` | 标签样式 |
| `--cat-bg`、`--cat-text`、`--cat-border`、`--cat-active-bg` | 分类样式 |

### 语义色 (2 个)

| Token | 用途 |
|-------|------|
| `--success` | 成功状态 |
| `--warning` | 警告状态 |

### 阴影 (5 个)

| Token | 用途 |
|-------|------|
| `--shadow-sm` | 微阴影 |
| `--shadow` | 标准阴影 |
| `--shadow-md` | 中等阴影 |
| `--shadow-lg` | 大阴影 |
| `--shadow-glow` | 主题光晕阴影 |

### 语义表面 token（v3 新增，必需）

v3 起，组件层**不再写死任何颜色**——所有"结构性"的表面与刻度都通过下面这组 token 表达。
没有它们，导航栏底色、代码块底色、刻度尺颜色会退化成写死的值，第三方主题将无法正确着色。

| Token | 用途 | 典型值 |
|-------|------|--------|
| `--on-accent` | 强调色实心块上的文字色 | `#ffffff` / `#12161a` |
| `--header-bg` | 吸顶导航栏底色（半透明）| `rgba(236,237,239,.86)` |
| `--panel-bg` | 目录 / 面板类容器底色 | `#f4f5f6` |
| `--code-bg` | 代码块底色 | `#eff1f3` |
| `--grid-line` | 页面底纹网格线 | `rgba(0,0,0,.035)` |
| `--highlight` | 搜索命中高亮 | `rgba(accent,.16)` |
| `--ambient-glow` | 页面角落的暖光 | `rgba(accent,.05)` |
| `--rule-tick` | 刻度尺的短刻度线 | `rgba(0,0,0,.22)` |
| `--rule-tick-strong` | 刻度尺的长刻度线（主色）| `rgba(accent,.55)` |
| `--focus-ring` | 键盘焦点环颜色 | 与 `--accent` 同色 |
| `--glow-secondary` | 副色辉光（分类通道）| `rgba(accent-secondary,.09)` |

### 可选补充 token

- `--accent-glow-strong`（accent 光晕加强版）
- `--purple-glow`（副色辉光的旧别名，等价于 `--glow-secondary`）

---

## 可选 CSS Token

如果你想自定义可以额外定义（不影响功能但视觉更精致）：

| Token | 默认值 | 说明 |
|-------|--------|------|
| `--accent-glow-strong` | `rgba(accent, 0.15)` | 强光晕（用于 active 态）|

布局相关 token（**必须**留在 `_variables.css`，**不要**在主题里覆盖）：
- `--font-display` / `--font-sans` / `--font-mono`
- `--radius` / `--radius-lg` / `--radius-sm`
- `--max-width` / `--content-width` / `--header-height`
- `--rule-height` / `--rule-major` / `--rule-minor`（刻度尺几何）
- `--log-gutter`（日志列表序号槽宽度）

---

## 选择器约定

主题 CSS 必须使用以下**精确**选择器：

### 双模式主题（light + dark）

```css
/* light.css */
html[data-theme='<your-theme-id>'][data-mode='light'] {
  --bg-primary: #...;
  /* ... */
}

/* dark.css */
html[data-theme='<your-theme-id>'][data-mode='dark'] {
  --bg-primary: #...;
  /* ... */
}
```

### 单模式主题（仅 light）

```css
/* light.css */
html[data-theme='<your-theme-id>'] {
  /* 不依赖 data-mode */
}
```

---

## 模式机制

主题通过 `manifest.json` 的 `modes` 数组声明支持的模式：

```json
{
  "modes": ["light", "dark"]  // 双模式
}
// 或
{
  "modes": ["light"]          // 单模式（用户切换 dark 按钮无效）
}
```

**单模式主题的行为**：
- 模式切换按钮中 dark 选项会被自动禁用（推荐实现：`html.dark .theme-option[data-mode="dark"] { opacity: 0.4 }`）
- 但 Astro 不会自动禁用——主题作者可决定

---

## manifest.json 字段

```json
{
  "id": "your-theme-id",
  "name": "Display Name",
  "author": "Your Name",
  "version": "1.0.0",
  "description": "简短说明（主题选择器 tooltip）",
  "modes": ["light", "dark"],
  "preview": "/themes/your-theme-id/preview.png"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | URL 安全（小写、`[a-z0-9_-]{1,32}`） |
| `name` | string | ✅ | 用户可见名称 |
| `author` | string | ❌ | 主题作者署名 |
| `version` | semver | ❌ | 默认 `0.0.0` |
| `description` | string | ❌ | tooltip 文本 |
| `modes` | array | ✅ | `['light']` 或 `['light', 'dark']` |
| `preview` | path | ❌ | 预览图（相对 `public/`） |

**id 校验**：`^[a-z0-9][a-z0-9_-]{0,31}$`（防 XSS / 文件系统遍历，最多 32 字符）

---

## 创建你的第一个主题

示例：创建一个 `ocean` 主题（蓝色海洋风）：

```bash
mkdir -p src/themes/ocean
```

### 1. 写 manifest.json

```json
{
  "id": "ocean",
  "name": "Ocean",
  "author": "Your Name",
  "version": "1.0.0",
  "description": "海洋蓝主题 — 清爽冷静",
  "modes": ["light", "dark"]
}
```

### 2. 写 light.css

```css
html[data-theme='ocean'][data-mode='light'] {
  --bg-primary: #f0f8ff;
  --bg-secondary: #d6eaf7;
  --bg-card: #ffffff;
  --bg-card-hover: #f4faff;
  --bg-inline-code: rgba(30, 144, 255, 0.06);

  --text-primary: #0a2540;
  --text-secondary: #2c5282;
  --text-muted: #718096;
  --text-bright: #061a2e;

  --border-color: rgba(30, 144, 255, 0.18);
  --border-light: rgba(30, 144, 255, 0.08);
  --border-glow: rgba(30, 144, 255, 0.4);

  --accent: #1e90ff;
  --accent-hover: #1873cc;
  --accent-secondary: #00bcd4;
  --accent-gradient: linear-gradient(135deg, #1e90ff, #00bcd4);
  --accent-glow: rgba(30, 144, 255, 0.1);
  --accent-glow-strong: rgba(30, 144, 255, 0.2);
  --glow-secondary: rgba(0, 188, 212, 0.1);
  --purple-glow: rgba(0, 188, 212, 0.1); /* 旧别名，保留兼容 */

  --tag-bg: rgba(30, 144, 255, 0.08);
  --tag-text: #1e90ff;
  --tag-border: rgba(30, 144, 255, 0.2);
  --tag-active-bg: rgba(30, 144, 255, 0.15);

  --cat-bg: rgba(0, 188, 212, 0.08);
  --cat-text: #00838f;
  --cat-border: rgba(0, 188, 212, 0.2);
  --cat-active-bg: rgba(0, 188, 212, 0.15);

  --success: #10b981;
  --warning: #f59e0b;

  --shadow-sm: 0 1px 3px rgba(10, 37, 64, 0.06);
  --shadow: 0 2px 8px rgba(10, 37, 64, 0.08);
  --shadow-md: 0 4px 16px rgba(10, 37, 64, 0.1);
  --shadow-lg: 0 8px 30px rgba(10, 37, 64, 0.12);
  --shadow-glow: 0 4px 20px rgba(30, 144, 255, 0.12);

  /* 语义表面 token（v3 起必需） */
  --on-accent: #ffffff;
  --header-bg: rgba(240, 248, 255, 0.86);
  --panel-bg: #f4faff;
  --code-bg: #f0f6fc;
  --grid-line: rgba(10, 37, 64, 0.035);
  --highlight: rgba(30, 144, 255, 0.16);
  --ambient-glow: rgba(30, 144, 255, 0.05);
  --rule-tick: rgba(10, 37, 64, 0.22);
  --rule-tick-strong: rgba(30, 144, 255, 0.55);
  --focus-ring: #1e90ff;
}
```

### 3. 写 dark.css（可选）

类似但用深色背景。

### 4. 注册主题（零配置）

**无需修改任何文件** — `astro-plugins/theme-loader.mjs` 会在 `dev` / `build` 时自动扫描 `src/themes/<id>/` 并生成 `src/generated/themes.css`，然后 `src/styles/global.css` 自动 `@import` 进去。

只需 `npm run dev`（或 `npm run build`）即可生效，新主题立即出现在右上角菜单。

如果你不想手写脚手架：

```bash
npm run theme:create ocean             # 双模式模板
npm run theme:create ocean --no-dark   # 单模式模板
```

### 5. 测试

启动 `npm run dev` → 打开站点 → 点击右上角主题按钮 → 应看到 "Ocean" 选项

---

## 测试主题

### 单元测试

主题选择逻辑由 `src/utils/themes.ts` 提供：

```ts
import { isValidThemeId, isValidMode } from '../utils/themes';

isValidThemeId('ocean'); // true
isValidThemeId('../etc'); // false
isValidMode('dark'); // true
```

### 视觉测试

1. `npm run dev`
2. 浏览器打开 `http://localhost:4321`
3. 顶部右侧点击 🌙 按钮，验证默认 light ↔ dark 切换正常
4. 检查所有页面：首页 / 文章页 / 分类页 / 标签页 / 关于页 / 404
5. **主题切换效果验证**：主题 CSS token 应正确替换（背景色、文字色、主色等）
6. 移动端检查（汉堡菜单 + 主题切换按钮不溢出）

如果你想让主题在 UI 暴露选择（如 v1 时期的"主题下拉菜单"），需自己扩展 `src/components/Header.astro`——Atom 默认不提供下拉菜单（只提供日/夜切换按钮）。

### 构建验证

```bash
npm run build
# 验证 dist/ 输出包含你的主题 CSS
grep -c "data-theme=\"ocean\"" dist/index.html
```

---

## 发布到社区

未来可能建立官方主题市场。当前推荐发布方式：

1. **GitHub 仓库**：在自己的仓库维护 `src/themes/<your-theme>/`
2. **PR 合并到主仓库**：通过 Pull Request 贡献到 [zz3656/Atom](https://github.com/zz3656/Atom)
3. **个人博客**：在博客里分享你的主题，提供下载链接

发布时建议附上：
- 主题截图（light + dark）
- README 说明设计灵感
- 必需 token 是否全部实现
- 浏览器测试矩阵

---

## 最佳实践

### ✅ DO

- **遵循必需 token 列表**：保证组件渲染正常
- **保持视觉一致性**：light/dark 切换时同一元素颜色对比度合理（WCAG AA 4.5:1）
- **测试边界情况**：hover、focus、active、disabled 状态
- **提供双模式**：除非主题理念要求单模式（如 sepia）
- **使用语义命名**：颜色值用主色名而非 `#a1b2c3`

### ❌ DON'T

- **不要在主题 CSS 里写组件样式**：那是 `src/styles/_modules/` 的工作
- **不要覆盖布局 token**（`--max-width` 等）
- **不要修改字体**：使用 `--font-sans` 等共享变量
- **不要在主题里写 JS 或 HTML**：主题纯 CSS
- **不要使用 `!important`**

---

## FAQ

### Q: 主题 id 能否与现有主题重名？

A: 不能。`scanThemes()` 按 id 去重，重名会被警告跳过。

### Q: 我能加新 token 给组件用吗？

A: 可以，但**先**更新本文档的"必需 token"清单，并通知维护者纳入扫描。

### Q: 主题菜单能否自定义（图标、布局）？

A: Atom 默认**不提供主题选择 UI**（只有日/夜切换按钮）。如果你想让用户选择主题，需自己扩展 `src/components/Header.astro`—— `themes` 数组 + `data-theme` 属性切换的基础设施已就绪。

### Q: sepia 这种单模式主题怎么禁用 dark 切换？

A: 主题**不会自动禁用** dark 选项。如果你想让 sepia 用户不能切到 dark：

```css
html[data-theme='sepia'][data-mode='dark'] {
  /* 强制回退到 light */
  --bg-primary: /* same as light */;
}
```

或在 `manifest.json` 加 `"singleMode": true`（未来扩展）。

### Q: 主题在 IE11 浏览器能跑吗？

A: 现代 CSS Variables 在 IE11 不支持。Atom 默认放弃 IE11。

---

## 参考现有主题

仓库默认只附带一个主题：

- `src/themes/atom-default/` — 双模式、冷轧钢 + 黄铜指示灯

它同时也是**最完整的 token 参考实现**——复制这个目录改名，就是一个合规的新主题起点。
其余主题（Solarized、Sepia 等）放在独立仓库 `atom-themes/`，需要时单独安装。

### 版本要求

| 项目 | 版本 |
|---|---|
| Atom | v3（语义表面 token） |
| Astro | 7.x |
| `@astrojs/markdown-remark` | 7.x（Astro 7 的 **peer dependency**，需显式安装）|

> ⚠️ 主题只依赖 CSS 变量，**不需要**任何 JS 或构建步骤。但如果你要沿用本仓库的
> `markdown.processor: unified({...})` 配置，记得 `@astrojs/markdown-remark` 要装在
> `devDependencies` 里——Astro 7 不再把它作为传递依赖暴露出来。

---

<div align="center">

**[⬆ 返回顶部](#atom-blog--主题开发指南)** · **[📖 DEVELOP.md](../DEVELOP.md)** · **[📦 主仓库](https://github.com/zz3656/Atom)**

</div>