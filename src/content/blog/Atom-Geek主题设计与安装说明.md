---
title: Atom Geek：把博客做成一台终端机——一套客制化主题的设计与安装说明
description: 不是换个配色，而是把终端语义当成信息架构。这篇讲清 atom-geek 主题的设计想法、45 个 token 的契约、为什么版式必须走 overlay 而不是主题包，以及两条安装路径怎么走。附实测合规数据。
pubDate: 2026-10-26
category: 技术笔记
tags: [Atom, 客制化, 主题, TUI, CSS, 设计系统]
---

给 Atom 博客做的这套主题，叫 **atom-geek**。它是 2026-10-25 一口气做完并上线的（从 v1.2.0 的主题包，到 v1.3.0 的全站 TUI 改造，再到现在的 v1.6.0），这篇把「想法」和「说明」一次讲完——顺带把设计过程中实测出来的数据也摊开给你看。

> 一句话版本：**把博客做成一台终端机**，而不是把博客涂成绿色。

---

## 一、先说清楚这不是什么

一开始最容易走偏的路，是把它当成「给默认主题换一套配色」：保留原来的圆角卡片、原来的字号层级、原来的列表样式，只把颜色换成磷光绿。

这条路做出来的东西，**一眼就是绿的，但完全不是终端**。原因很直接——终端的辨识度不来自颜色，来自**结构**：

- 文字是左对齐的等宽流，不是居中大标题配副标题
- 窗口有标题栏、有状态点、有边框，不是浮在页面上的圆角卡片
- 列表项有权限位、有行号、有时间戳，不是「日期 + 标题 + 摘要」三段式
- 代码块有窗口栏和复制按钮，不是灰底一行字

**颜色只是这套结构的最后一道漆。** 所以这套主题真正的设计对象是组件层，而 Atom 的主题契约恰好不让主题碰组件层——这个矛盾怎么解，是这篇文章后半段的核心。

---

## 二、设计想法：五件事

### 1. 终端语义当信息架构

我给每个终端概念找了一个站点上的对应物，让隐喻贯穿全站而不是停在表面：

| 终端概念 | 站点对应 |
|---|---|
| `status bar` | 顶部两行 Header：站名 / 路径 / 状态指示点 |
| 启动序列 | 首页 Hero 的终端启动输出 + ASCII 装饰 |
| `ls -la` | 文章列表：序号、权限位式排布、日期、文件名式标题 |
| `cat` | 文章页：正文按行输出，左侧行号槽（gutter） |
| `grep` | 搜索结果高亮命中词 |
| 目录树 | 标签页 / 分类页的词频面板与目录树面板 |
| `command not found` | 404 页 |
| 终端标题栏 | 代码块的窗口栏与复制按钮 |

关键在于**一致性**：文章列表是 `ls`，文章页就是 `cat`，搜索就是 `grep`，走错了就 404。用户不用学，一次点击就懂。

### 2. 双模：磷光终端 / 磷光纸

- **暗色 = 主形态**：近黑蓝底 `#05070a` + 磷光绿 `#00e88f`，像一台老式终端机，状态点常亮。
- **亮色 = 磷光纸**：浅纸面 `#f2f6f3` + 深磷光绿墨水 `#00794c`，像一张泛着绿意的工程绘图纸，长时间阅读不刺眼。

亮色主色**不是**鲜亮的 `#00e88f`。因为 `--accent` 同时是正文链接色，小字号文本需要 4.5:1 —— 鲜亮磷光绿在纸面上只有 1.49:1，哪怕降到中间调 `#00a86b` 也才 2.83:1，所以最终取 `#00794c`（5.01:1）。**暗色保留鲜亮磷光绿（12.43:1），亮色降饱和**，这是两个模式最本质的差异。

### 3. 零圆角，辉光代替投影

终端没有圆角。所有圆角归零，层次靠 1px 硬边框 + 辉光（`--shadow-glow` / `--accent-glow`）而不是柔和投影制造。

### 4. 等宽字体只管真实数据

JetBrains Mono **只用于真实的数据与机器输出**：日期、计数、序号、路径、状态、快捷键、命令。正文与标题保持无衬线（Archivo + 中文无衬线）——中文长文用等宽会显著降低阅读体验。

这条规则看着琐碎，但它是「像不像终端」的分水岭：等宽字一旦沾上正文，整页立刻变成代码编辑器截图。

### 5. 全站只有两条语义色通道

- **标签 = 绿色描边**（`--tag-*`）
- **分类 = 青色**（`--cat-*`）

多色打架是个人站点的常见病。砍到两条之后，任何一个彩色元素都能立刻回答「这是什么」。

---

## 三、能力天花板：为什么版式不能靠 token

Atom 的主题契约规定得很清楚：**主题目录只能放 CSS 变量**。这意味着：

| 你想要的 | token 能不能表达 |
|---|---|
| 换个主色 | ✅ `--accent` |
| 圆角归零 | ❌ 主题禁止覆盖 `--radius*` |
| 正文改用等宽 | ❌ 主题禁止覆盖 `--font-*` |
| 窄一点 / 宽一点 | ❌ 禁止覆盖 `--max-width` / `--content-width` |
| 终端窗口外壳 | ❌ 主题里不许写组件样式 |
| 标题栏代码块 | ❌ 同上 |
| CRT 扫描线质感 | ❌ 同上 |

**「直角化」「等宽字体角色重分配」「终端标题栏」这些不是 token 能表达的东西**——它们是「用哪个字体变量」「border-radius 取什么值」的**选择器级决策**。换句话说：token 体系的天花板就在那里，撞到了就得换层。

---

## 四、于是分成两包

这是整套设计里最重要的一个决定：**把「可分发的 token」和「必须替换组件层的版式」拆成两条安装路径**。

|  | `atom-geek/`（主题包） | `overlay/`（组件层覆盖包） |
|---|---|---|
| 装上后得到什么 | **只有配色**（磷光绿 / 磷光纸双模） | **完整 TUI 版式** |
| 契约位置 | `src/themes/atom-geek/` | 覆盖站点的 `src/components/` `src/layouts/` `src/pages/` `src/styles/` `src/scripts/` |
| Atom 官方支持 | ✅ 官方机制，零配置自动注册 | ⚠️ 非官方机制：直接替换组件层文件 |
| 能否独立生效 | ✅ 可以，复制过去就完事 | ❌ 不能，必须先装主题包 |

**结论先说在前面：只复制 `atom-geek/` 目录，你拿到的是一套很好看的配色，但不是 TUI。** 完整的终端形态必须叠加 overlay。

这么分有三个理由：

1. **契约边界**：`docs/THEMING.md` 是全站公共契约，也是第三方主题的准入依据。主题包一旦写组件样式，第三方主题就无法在本站共存——破坏的是站点生态，不是这一套主题。
2. **能力天花板**：上面那张表已经说明，版式差异在 token 体系里不可表达。
3. **回退成本最低**：token 归主题包（可复用、可分发），选择器级差异归 overlay（可整份删除、零残留）。**删掉 overlay 不会让站点崩，只会退回普通版式。**

overlay 一共 28 个文件：

```
overlay/
├── components/   9 个   TerminalBoot / TerminalAscii / CommandHeader / GrepHit / IndexSummary …
├── layouts/      2 个   BaseLayout / BlogPost
├── pages/       10 个   首页 / 文章页 / 标签页 / 分类页 / 404 / about …
├── styles/       5 个   _terminal.css / _ls.css / _index.css / _theme-geek.css / global.css
└── scripts/      1 个   app.js
```

---

## 五、主题包契约：45 个 token

完整契约见上游 `docs/THEMING.md`。分类与数量如下（43 必需 + 2 可选 = 45）：

| 类别 | 数量 | Token |
|---|---|---|
| 背景 | 5 | `--bg-primary` `--bg-secondary` `--bg-card` `--bg-card-hover` `--bg-inline-code` |
| 文本 | 4 | `--text-primary` `--text-secondary` `--text-muted` `--text-bright` |
| 边框 | 3 | `--border-color` `--border-light` `--border-glow` |
| 主色 | 5 | `--accent` `--accent-hover` `--accent-secondary` `--accent-gradient` `--accent-glow` |
| 标签 | 4 | `--tag-bg` `--tag-text` `--tag-border` `--tag-active-bg` |
| 分类 | 4 | `--cat-bg` `--cat-text` `--cat-border` `--cat-active-bg` |
| 语义色 | 2 | `--success` `--warning` |
| 阴影 | 5 | `--shadow-sm` `--shadow` `--shadow-md` `--shadow-lg` `--shadow-glow` |
| v3 语义表面 | 11 | `--on-accent` `--header-bg` `--panel-bg` `--code-bg` `--grid-line` `--highlight` `--ambient-glow` `--rule-tick` `--rule-tick-strong` `--focus-ring` `--glow-secondary` |
| 可选 | 2 | `--accent-glow-strong` `--purple-glow`（旧别名，保留兼容） |

选择器写法：

```css
/* light.css */
html[data-theme='atom-geek'][data-mode='light'] { /* ... */ }

/* dark.css */
html[data-theme='atom-geek'][data-mode='dark'] { /* ... */ }
```

### 合规自查（实测，非声明）

拿脚本把两个主题文件重新扫了一遍，结果：

| 检查项 | light.css | dark.css |
|---|---|---|
| token 数量 | 45 | 45 |
| `!important` | **0** | **0** |
| 组件选择器（非 `html[data-theme=…]` 顶层规则） | **0** | **0** |
| 覆盖布局 token（`--font-*` `--radius*` `--max-width` 等 13 项） | **0** | **0** |
| 规则块总数 | 1 | 1 |

light / dark 的 token 集合**完全对齐**（并集 45，单边差集为空）——不存在「某个模式少定义一个变量」这种经典坑。

---

## 六、无障碍：对比度实测

正文文本类 token 对两种底色（页面底 `--bg-primary`、卡片底 `--bg-card`）实测比值，alpha 按 source-over 合成后计算：

| 模式 | 对 `--bg-primary` | 对 `--bg-card` | 判定 |
|---|---|---|---|
| 暗色（磷光终端） | **5.26 – 19.30 : 1** | 4.88 – 17.93 : 1 | 全部 ≥ 4.5 ✅ |
| 亮色（磷光纸） | **4.60 – 15.74 : 1** | 4.82 – 16.48 : 1 | 全部 ≥ 4.5 ✅ |

几个关键采样点：

| Token | 暗色 | 亮色 |
|---|---|---|
| `--text-primary` | 13.22 | 12.92 |
| `--text-muted` | 5.26 | 4.75 |
| `--accent`（正文链接色） | 12.43 | 5.01 |
| `--cat-text` | 13.91 | 6.91 |
| `--warning` | 11.44 | 4.60 |

`--focus-ring` 作为非文本焦点指示按 ≥ 3:1 判定：暗色 12.43、亮色 5.01。

最紧的两处都是**亮色**：`--text-muted` 4.75、`--warning` 4.60——都还在 AA 线以上，但余量已经不大。**亮色主色必须降饱和成 `#00794c`，就是为了守住 `--accent` 那 5.01。**

---

## 七、移动端：48 组判定，0 不合格

横向溢出是这类「硬边框 + 大字标 + 行号槽」版式最容易翻车的地方，所以没有靠肉眼看图，而是写了脚本按**三重判据**扫：

1. `.term-window` 的 `scrollWidth` vs `clientWidth`
2. 页面所有元素 `getBoundingClientRect().right` 的最大值 vs 视口宽
3. **实际写 `scrollLeft` 再回读**（最可靠的一条）

覆盖 4 个页面（首页 / 文章列表 / 标签页 / 分类页）× 6 个宽度（320 / 360 / 375 / 390 / 412 / 430）× 焦点前后 2 态 = **48 组判定，不合格 0 组**。

> 顺便记一个坑：修溢出时我把 `html/body` 的 `overflow-x` 从 `hidden` 改成了 `clip`。但 `hidden` 会让 `html` 变成滚动容器、**毁掉 `position: sticky`**，所以必须用 `clip`；而 `clip` 又会让 `documentElement.scrollWidth` 的读数失真——**验收时不能看 scrollWidth，要看 max-right-edge + scrollLeft 回写**。这就是上面第三条判据存在的原因。

---

## 八、安装

### 路径 A｜只要配色（主题包，零配置）

```bash
# 1. 复制主题包到你的 Atom 站点
cp -r atom-geek/ /path/to/your-atom-blog/src/themes/

# 2. 构建时 theme-loader 会自动扫描 src/themes/ 并注册
cd /path/to/your-atom-blog && npm run dev
```

然后在 `src/consts.ts` 里设为默认主题：

```ts
export const DEFAULT_THEME_ID = 'atom-geek';
```

目录名必须与 `manifest.json` 的 `id` 一致，`id` 需匹配 `^[a-z0-9][a-z0-9_-]{0,31}$`。

### 路径 B｜完整 TUI（主题包 + 组件层覆盖）

先执行路径 A，再按 `overlay/README.md` 的「文件对照表」覆盖组件层：

```bash
# 假设你的站点在 ~/blog，本仓库在 ~/atom-geek
cp -r ~/atom-geek/atom-geek ~/blog/src/themes/
# 再按 overlay/README.md 覆盖 components / layouts / pages / styles / scripts
```

**回退**：overlay 里每个文件都有上游对应物，回退即恢复原文件。

### 硬性红线

- ❌ 主题里覆盖布局 token（`--font-*` `--radius*` `--max-width` `--content-width` `--header-height` `--rule-*` `--log-gutter`）
- ❌ 写 `!important`
- ❌ 在主题里写组件样式 / JS / HTML
- ✅ 目录名 = manifest id

---

## 九、去哪儿看

| 仓库 | 内容 |
|---|---|
| [zz3656/atom-geek](https://github.com/zz3656/atom-geek) | **本主题**：主题包 + overlay 覆盖包 + 逐文件对照表 + 演示图 |
| [zz3656/atom-themes](https://github.com/zz3656/atom-themes) | 其它第三方主题（sepia / solarized） |
| [zz3656/Atom](https://github.com/zz3656/Atom) | 上游框架仓与主题开发指南 `docs/THEMING.md` |

在线演示：<https://www.inte8.top/>（GitHub Pages 镜像 <https://zz3656.github.io/Atom-blog/>）

---

## 结语

回头看，这套主题真正教我的是一件事：**当 token 体系撞到天花板时，正确的做法不是去破坏契约，而是把「可分发的」和「不可分发的」拆成两包，让每部分都待在自己该待的层里。**

主题包是可复用的资产——45 个 token，一份 CSS，一行 `DEFAULT_THEME_ID` 就能换上。overlay 是不可分发的实现细节——它替换组件层，跟着上游版本走。**分开之后，主题能被别人拿去用，实现却不会被当成规范。**

如果你也在给自己的 Atom 站点做客制化：先去读 `docs/THEMING.md`，然后照着这两条路径走一遍，你会发现自己想做的那些「不是配色」的改动，其实早就有地方放了。
