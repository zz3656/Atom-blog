# TUI 重做说明 —— 因特吧全站终端化

> 基线：`1571201`（单主题化） · 分支：`feat/tui-redesign` · 日期：2026-10-25
> 目标：把「在原版式上刷极客色」换成**真正的终端界面** —— 页面结构、组件语义、样式层全部重写。

---

## 一、逐板块对照：原来是什么 → 现在是什么

| 板块 | 原来（PRECISION LOG 版式） | 现在（TUI 终端形态） |
| --- | --- | --- |
| **站点外壳** | 普通网页 + 顶部导航条，页面无容器感 | 整页包进 `.term-window` 终端窗口：左右 1px 硬边框、顶部标题栏、底部状态栏；零圆角、磷光发光 |
| **Header 标题栏** | 只有一行导航，站名 + Logo + "Precision Log" tagline | 两行：① 窗口标题栏（红绿灯 · `zz3656@node:~` · 实时站点数据 `25 POSTS · 08 CATS · 58 TAGS · build v1.2.0` · 日夜开关）② 命令行导航行 |
| **导航** | 居中圆角标签，激活项靠底部刻度线表示 | 命令式路径：`~/`（首页）`~/posts` `~/cats` `~/tags` `~/about`；当前项前缀换成 `>` 并高亮，hover 时前缀也换成 `>` 并带闪烁光标块 |
| **Hero** | 大号中文标题 + 黄铜原子图标 + 刻度尺 + 右侧独立 Telemetry 数据列 | 终端启动：ASCII 点阵「因特吧」字标 → 逐行显现的自检输出（kernel / articles / index / status）→ `~/yinteba $` 提示符 + 闪烁光标；原 Telemetry 数据列**合并进自检输出**，取消独立右列 |
| **CTA 按钮** | 「浏览文章 →」「关于此博客」 | 命令式：`$ ls ~/posts`、`$ cat README.md`（文案表指定） |
| **文章列表** | 日志行：刻度脊线 + 序号 + 标题 + 描述 + 标签 + 日期 + 分类徽标 | `ls -la` 输出行：`[01] -rw-r--r--  2026/09/25  14.2K  标题.md  [分类]`；次行是缩进续行（`↳` 摘要 + `#标签`）；hover 整行反色（终端 reverse video），左侧浮出 `>` 指示器 |
| **文章页刊头** | 杂志式刊头：eyebrow 分类徽标 + 大标题 + 刻度尺 + 描述 | 命令回显 + 文件元信息：`~/yinteba $ cat posts/<slug>.md`，下方 `size: 7.9K · lines: 197 · date: 2026/09/19 · cat: tutorial · read: 4 min`（全部真实数据） |
| **正文行号** | 无 | 左侧行号槽 `01 │`（CSS counter，零 JS），与正文行高对齐，窄屏收窄 |
| **正文首字下沉** | 有（杂志排版元素） | **移除** —— 终端没有首字下沉 |
| **引用块** | 圆角 + 左侧粗边 + 淡绿底 | 终端回显：2px 绿色竖条 + 每段 `>` 提示符前缀 |
| **代码块** | 顶部 2px 渐变细线 + 复制按钮浮在代码上 | 终端窗口：标题栏（`astro-blog-tutorial-01.ts` 文件名 + `TS` 语言标签 + 复制按钮），文件名由 `slug + 块序号 + 语言扩展名` 真实推导 |
| **行内代码** | 圆角淡绿底 | 磷光底 + 直角 |
| **TOC 目录** | 窄屏折叠面板 / 宽屏左侧刻度栏 | 命令树：`$ tree posts/<slug>`，条目用 `├─` / `└─` 表示层级，缩进表示层级深度，当前章节高亮 |
| **分类页** | 圆角卡片网格 + 计数徽标 | `~/yinteba $ ls ~/cats` + 目录列表：`drwxr-xr-x  8 cats  2026/09/25  技术教程  5 篇` |
| **标签页** | 圆角标签卡片网格 | `grep -h '^tags:' ~/posts/*.md | sort | uniq -c | sort -rn`；标签详情页是 `grep -rn "<tag>" ~/posts` 的真实命中行：`~/posts/linuxshell.md :6: tags: [linux, shell, 教程]` |
| **归档 / 文章列表页** | 「所有文章」标题 + 刻度尺 | `$ ls -la ~/posts` + `ls` 行；分页也是命令（`$ ls ~/posts/2 →`） |
| **搜索** | 放大镜图标 + 圆角输入框 + 圆角下拉卡片 | 终端输入：`grep ▍` 前缀 + 占位符 `-ri "关键词"`；结果下拉是命令输出，每条带路径 `~/posts/<slug>.md`；保留 ↑↓ 选择 / Enter 打开 / Esc 关闭 |
| **404** | 「404」大标题 + 拟人化吐槽文案 | `command not found`：`cat: /xxx: No such file or directory` + `yinteba: command not found: /xxx` + 建议命令（`$ ls ~/posts` / `$ ls ~/cats` / `$ cd ~`）；真实路径由 app.js 回填 |
| **About** | 编辑部排版：统一页头 + 数据卡片 + 主题卡 + 要点列表 | `~/yinteba $ cat README.md` + 终端面板（左侧强调边）+ `df -h` 风格数据条 + `#` 标记的规矩列表；**正文内容一字未删** |
| **Footer** | 品牌 + 链接 + 版权 + 版本徽标 + 技术栈署名 | 系统状态栏：左 `© 2026 因特吧 · TERMINAL SESSION · zz3656` ｜ 中 `build 1.2.0 · astro · static` ｜ 右 `github rss about Atom`；底部一行真实快捷键提示 `$ [↑↓] 切换搜索结果 · [Enter] 打开 · [Esc] 关闭` |
| **阅读进度条** | 顶部 2px 黄铜条 | 顶部 2px 磷光条（位置与配色随 token 走） |
| **背景** | 制图纸网格 + 左上角黄铜辉光 | 终端网格 + 顶部磷光扫描光带（CSS 渐变动画，reduced-motion 关闭）+ 极低强度 CRT 扫描线（0.03 alpha，不压正文） |
| **圆角** | 6px / 10px / 4px | 全站 0（`--radius*` 在骨架层统一为 0，主题层不再逐个覆盖） |

---

## 二、改动文件清单（45 个文件，相对 `1571201`）

### 新增（5）
| 文件 | 作用 |
| --- | --- |
| `src/components/TerminalAscii.astro` | 「因特吧」点阵字符画（22 行 × 73 列，纯文本，`#` + 空格） |
| `src/components/TerminalBoot.astro` | 终端启动自检输出（数值全部来自真实内容集合） |
| `src/components/CommandHeader.astro` | 命令回显式页头（列表页统一标题区） |
| `src/components/GrepHit.astro` | grep 命中行（文件路径 : 行号 : 命中内容） |
| `src/styles/_modules/_terminal.css` | TUI 原语：命令页头 / ls 目录行 / grep 命中行 / command not found |

### 删除（3）
`src/components/HeroIcon.astro`（TUI 版改用字符画，图片标识下线）、
`src/components/FormattedDate.astro`（全站无人引用）、
`src/styles/_modules/_log.css`（旧日志脊线列表，被 `_ls.css` 取代）

### 改写
- **布局层**：`src/layouts/BaseLayout.astro`（终端窗口外壳）、`src/layouts/BlogPost.astro`（cat 输出 + 行号槽 + 文件元信息）
- **组件层**：`Header.astro`（标题栏 + 命令行 + grep 搜索）、`Footer.astro`（系统状态栏）、`PostCard.astro`（ls 行）、`TableOfContents.astro`（命令树）
- **页面层**：`index.astro`、`about.astro`、`404.astro`、`blog/{index,[...page],[...slug]}.astro`、`categories/index.astro`、`category/[...category].astro`、`tags/index.astro`、`tag/[...tag].astro`
- **样式层**：`global.css`（模块顺序重排）、`_modules/{_variables,_reset,_background,_scrollbar,_header,_search,_hero,_buttons,_sections,_ls,_tags,_pages,_post,_post-extras,_toc,_pagination,_progress,_about,_footer,_layout,_responsive}.css`、`_theme-geek.css`
- **脚本**：`src/scripts/app.js`（+18 行：搜索结果路径行、代码块文件名推导、404 真实路径回填）
- **常量**：`src/consts.ts`（文案表 5 项 + TUI 身份常量 `TUI_USER/TUI_HOST/TUI_CWD/TUI_PROMPT/TUI_NAV`）

---

## 三、自检截图

目录：`/Users/ceasar/Documents/GitHub/Atom-blog/.tui-shots/`（未纳入 git，build 后可重拍）

| 文件 | 内容 |
| --- | --- |
| `home-dark.png` | 首页（暗色）—— 终端外壳、点阵字标、自检输出、ls 列表 |
| `home-light.png` | 首页（亮色）—— 磷光纸模式 |
| `post.png` | 文章页 —— 命令回显刊头、行号槽、命令树目录、代码块标题栏 |
| `404.png` | 404 —— command not found + 建议命令 |
| `cats.png` | 分类页 —— `ls ~/cats` 目录列表 |
| `about.png` | About 页 —— `cat README.md` + 数据条 + 终端面板 |
| `tag.png` | 标签页 —— `grep -rn` 命中行 |
| `search-dropdown.png` | 搜索下拉 —— grep 结果带路径 |
| `mobile-home.png` / `mobile-post.png` | 390×844 真设备视口（CDP 模拟） |

复现方式（本地）：

```bash
npm run build && npm run preview      # http://localhost:4321
# 无头截图（明暗两种）
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,1400 --virtual-time-budget=6000 \
  --screenshot=home.png http://localhost:4321/
```

---

## 四、性能与可访问性实测数据

### 体积（基线 `1571201` → 本分支实测）

| 指标 | 基线 | 现在 | 变化 |
| --- | --- | --- | --- |
| CSS 源码总量（src/styles） | 78,518 B / 23 文件 | 76,524 B / 24 文件 | **−1,994 B**（新增 CSS 预算 ≤14 KB，净为负） |
| 每页内联 CSS | 51,352 B | 49,243 B | **−2,109 B** |
| 单页 HTML：首页 | 67,732 B | 70,693 B | +2,961 B（点阵字标 1.5 KB + 终端结构） |
| 单页 HTML：文章页 | 94,621 B | 94,829 B | +208 B |
| 单页 HTML：About | 63,952 B | 63,242 B | −710 B |
| 单页 HTML：404 | 58,889 B | 58,347 B | −542 B |
| JS（压缩后 `public/js/app.js`） | 8,883 B | 9,800 B | +917 B（预算 ≤12 KB ✓） |
| JS（gzip） | 3,397 B | 3,790 B | +393 B |

### 对比度（WCAG 2.1，正文均为 token 计算）

| 语义 | 暗色 | 亮色 |
| --- | --- | --- |
| 正文 text-primary / bg | 13.22:1 (AAA) | 12.92:1 (AAA) |
| 次级 text-secondary | 6.88:1 (AA) | 6.92:1 (AA) |
| 弱化 text-muted | 5.26:1 (AA) | 4.75:1 (AA) |
| 强调色 accent | 12.43:1 (AAA) | 5.01:1 (AA) |
| 分类 cat-text | 13.91:1 (AAA) | 6.91:1 (AA) |
| 成功 / 警告 | 11.41 / 11.44 (AAA) | 5.43 / 4.60 (AA) |

**全部 ≥ 4.5:1（AA）**，正文与数据均达标。

### 交互与可访问性

- **键盘**：搜索 ↑↓ / Enter / Esc、抽屉菜单、代码复制、目录跳转、skip-link 全部保留（`app.js` 既有逻辑未动，只做增量）
- **语义**：`.sr-only` 承载被字符画/路径替代的真实文本（导航中文标签、站点名、grep 前缀）；装饰元素一律 `aria-hidden`
- **动效降级**：`prefers-reduced-motion` 下自检逐行显现、字标打字机、光标闪烁、扫描光带全部关闭；自检行基础态为可见（`opacity: 1` + `animation-fill-mode: both`），避免降级后内容消失
- **强制颜色模式**：CRT 扫描线与扫描光带在 `forced-colors: active` 下移除
- **对比度增强**：`prefers-contrast: more` 下边框提到不透明
- **字体纪律**：JetBrains Mono 只承担真实数据（日期 / 计数 / 序号 / 路径 / 命令 / 代码 / 刻度），中文正文与界面文字走无衬线
- **`!important` 存量说明**：本次新增/改写的规则**零 `!important`**。全仓仅剩 6 处、全部是原实现继承且技术上必需：① `_post.css` 3 处 —— 压过 Shiki 写在 `style` 属性里的内联色值（内联样式优先级最高，只能用 `!important` 覆盖）；② `_layout.css` 3 处 —— 全局 `prefers-reduced-motion` 降级块（`transition/animation/scroll-behavior` 一律关掉，是兜底安全网）。
- **组件层色值纪律**：`src/components/`、`src/layouts/`、`src/pages/` 内无任何硬编码色值（唯一例外是 `<meta name="theme-color">`，它必须写字面值且已与 atom-geek 的明暗 token 对齐，以及 noscript 提示条的行内样式）

---

## 五、发现并修掉的原版式遗留问题

| # | 问题 | 处理 |
| --- | --- | --- |
| 1 | 上一版「极客化」只是给默认版式换配色 + 贴终端图，结构仍是杂志/仪表风 | 组件层整体重写，版式语言换成终端 |
| 2 | `--radius` 仍是 6/10/4px，靠主题层逐个组件覆盖圆角，漏一个就是一个圆角 | 骨架层 `--radius*` 直接为 0，主题层删掉整段覆盖 |
| 3 | 首字下沉是杂志排版元素，与终端语义冲突 | 移除 |
| 4 | 上一版 Hero 用了黄铜原子图标（图片），与「零图片标识」的终端取向冲突 | 换成纯文本点阵字标，不依赖任何图片/字体文件 |
| 5 | 点阵字标最初用 `█` 方块字形：JetBrains Mono 缺该字形时回退字体宽度不一致，字标会被拉歪 | 改用 `#` + 空格，任何等宽字体下点阵不错位 |
| 6 | 上一版 About 页正文里写着「PRECISION LOG 设计语言：冷轧钢底色 + 黄铜指示灯」，站点已改版，文案过期 | 更新为终端形态描述，其余正文一字未动 |
| 7 | About 页数据条用中文标签（文章/分类/标签），与全站命令语义不统一 | 标签改为 `articles / categories / tags / words / updated` |
| 8 | grep 命中行号用大小写敏感匹配，标签写作 `Linux`、正文写作 `linux` 时行号恒为 0 | 改为大小写不敏感匹配；正文确实没出现该词时只显示路径、不编造行号 |
| 9 | 代码块标题栏只有语言名，没有文件名 | app.js 用 `slug + 块序号 + 语言扩展名` 推导真实文件名 |
| 10 | 上一版快捷键提示条宣称了 app.js 里并不存在的键位 | 只保留真实实现的 ↑↓ / Enter / Esc |
| 11 | 窄屏下自检输出若依赖动画显现，降级模式下会整段不可见 | 基础态改为可见 + `fill-mode: both` |
| 12 | 终端外壳的窗口边框在 ≤768px 仍占位 | 窄屏去掉左右边框 |

---

## 六、遗留与后续建议（不在本次范围内）

1. **行号槽是块级序号**：当前用 CSS counter 按「块」编号（与正文首行对齐），不是按渲染行编号。要做到真实行号需在 JS 里用 `Range.getClientRects()` 逐行测量，代价与复杂度都更高，故保留零 JS 方案。
2. **无主题选择器**：站点仍是单主题（只有 atom-geek），日夜开关保留；如未来要恢复多主题，需要在 `src/themes/` 下增加 token 包即可，组件层不再需要改动。
3. **搜索索引仍是懒加载 JSON**：首屏不请求，聚焦搜索框时才拉 `_assets/search-index.json`；数据量上去后需要换成分页接口。
4. **点阵字标不可换字**：字标是构建期栅格化结果固化在组件里，若要改字需重新走一次「Chrome 栅格化 → 导出」流程（流程说明写在 `TerminalAscii.astro` 头部注释里）。
