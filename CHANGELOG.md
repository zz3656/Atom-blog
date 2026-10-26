# Changelog

All notable changes to this project will be documented in this file.

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循[语义化版本](https://semver.org/lang/zh-CN/)。

**版本号的唯一数据源是 `package.json` 的 `version` 字段** —— 页脚显示的版本号从那里读取，
`tests/version.test.ts` 会校验它与本文件的最新发布版本号一致，两边不会漂移。

发布流程：改 `package.json` 的 `version` → 把下面 `[Unreleased]` 段改成 `[x.y.z] — 日期` → `git tag vx.y.z`。

---

## [1.6.2] — 2026-10-26

### 🐛 Fixed

- **canonical / og:url / sitemap / RSS 全部指向了错的域名**：Cloudflare Pages 的自定义域名是 `www.inte8.top`（裸域 `inte8.top` 指向同一份站点），但 `astro.config.mjs` 里 `CF_DOMAIN` 的默认值写的是 `atom.inte8.top` —— 结果三个域名下发的都是 `atom.inte8.top`，等于告诉搜索引擎「正版在另一个域名上」。现默认值改为 `www.inte8.top`，构建产物实测：canonical / og:url / og:image / RSS 频道地址 / sitemap 全 102 条**无一例外**指向 `https://www.inte8.top/`
  - GitHub Pages 那条部署不受影响：`DEPLOY_TARGET=github` 走的是仓库名推导的独立分支，仍以 `https://zz3656.github.io/Atom-blog/` 为准

### 📚 Documentation

- `README.md` 的环境变量说明同步更新：`CF_DOMAIN` 默认值改为 `www.inte8.top`

## [Unreleased]

<!-- 下一轮改动写在这里。发布时把这一段改成 [x.y.z] — YYYY-MM-DD，并同步 package.json -->

## [1.6.1] — 2026-10-26

### 📝 Content

- **新文章《Atom Geek：把博客做成一台终端机——一套客制化主题的设计与安装说明》**：把 atom-geek 主题的**设计想法**（终端语义当信息架构、磷光终端/磷光纸双模、零圆角辉光代替投影、等宽字体只管真实数据、只留两条语义色通道）与**使用说明**（45 个 token 的契约、为什么版式必须走 overlay 而非主题包、两条安装路径、硬性红线）一次写全，并附实测数据：合规自查（0 `!important` / 0 组件选择器 / 0 布局 token 覆盖 / light-dark token 完全对齐 45）、WCAG 对比度实测表、移动端 48 组判定 0 不合格
  - 后续订正了两处不实表述：主题的实际开发周期（当天做完，不是「跑了半年多」）、亮色底上的绿色对比度（`#00e88f` 实测 1.49:1，2.83:1 属于 `#00a86b`），并同步了 overlay 的真实文件数（46）与「样式层必须整份覆盖」的警告

### 🐛 Fixed

- **搜索结果与 RSS 链接大量指向 404（12 / 26 篇）**：postbuild 脚本把**文件名原样**当 slug 用，而 Astro 7 自己用 github-slugger 生成内容路由（转小写 + 去标点 + 空格转连字符）—— `DrawThings完全使用指南.md` 的真实路由是 `/blog/drawthings完全使用指南/`，脚本却生成了 `/blog/DrawThings完全使用指南/`。现已抽出 `src/utils/slug.ts` 的 `astroSlug()`，与 Astro 规则逐字对齐（真实语料 0 差异），搜索结果 / RSS 链接现为 **26 / 26 全部命中真实路由**
  - 修掉后搜索框里选一条结果按 Enter，会直接落到 `command not found` 的 404 页 —— 之前一直误以为是快捷键没实现
- **sitemap 的 `lastmod` 只覆盖 9 / 29 条 blog URL**：`fix-sitemap.mjs` 拿未编码的 slug 去拼正则，中文 slug 全部匹配不上。改为先把 `<loc>` 百分号解码再比对，现在 **26 篇文章全部带 `lastmod`**（剩下 3 条是列表页与分页页，本就不该有）
- **部署出去的搜索索引比源码旧一个版本**：postbuild 只写 `public/_assets/search-index.json`，而 Astro 在构建开始时就把 `public/` 拷进了 `dist/`。现在索引同时写入 `dist/_assets/` 与 `public/_assets/`，部署的那份永远是最新的
- **搜索快捷键在焦点离开输入框后全部失灵**：键盘监听原先挂在 `searchInput` / `.search-wrapper` 上，而 ↓ 会把焦点移到结果项、结果列表重渲染又会销毁被聚焦项。改挂 `document`，作用域仍由「结果面板是否展开」限定 —— 页脚那行 `[↑↓] 切换结果 · [Enter] 打开 · [Esc] 关闭` 现在是真的
- **弱网下第一次搜索被静默丢弃**：旧实现是 `setInterval` 轮询 + 3 秒清空窗口，而线上索引 fetch 实测可达 11.5 秒，窗口一过查询就没了。改成挂起式（`pendingQuery` + 索引到位后补跑），加载期显示「正在加载索引…」

### ✨ Changed

- **页脚改成两段式**：桌面端右侧块内两行（`github rss about Atom` 一行，构建信息 `build v1.6.1 · astro · static` 落在其正下方），窄屏整块左对齐

### 验收

- 构建期新增一道闸门：postbuild 会拿 `dist/blog/` 的真实路由反查每一篇文章的 slug（依据是文章页 JSON-LD 里的 `BlogPosting`），对不上就让**构建直接失败** —— 宁可构建红，也别上线一批 404 链接
- 新增 `tests/slug.test.ts`：固定期望表覆盖全部真实语料，并断言每篇文章算出的 slug 都能在 `dist/blog/` 里找到
- 浏览器实测（headless Chrome + CDP）：↓ 落焦第 1 项 / 第二次 ↓ 到第 2 项 / Esc 收起面板 / Enter 打开结果文章页，**4 / 4 全绿**（此前 v2 脚本用导航后读 `location.pathname` 的方式判定，执行上下文销毁时会读到 `'/'` 这样的假值，v3 改为跟踪 `frameNavigated` + 读标题判定 404）

## [1.6.0] — 2026-10-25

### ✨ Added

- **社交卡片计数改为构建期实时生成**：新增 `scripts/generate-og.mjs`（postbuild 阶段执行），统计 `src/content/blog/`（排除 `draft`）得到文章数 / 分类数 / 标签数，渲染成 `25 POSTS · 08 CATS · 58 TAGS` 叠加到卡片底板上 —— 文章增减后卡片数字自动跟随，不再像以前那样烤死在图片里
  - 计数行用 **sharp 的 `text` 选项**（底层 Pango）渲染，`fontfile` 指向仓库内自带的 JetBrains Mono → 字体被内嵌，**不依赖构建机装没装字体，也不依赖网络**，CI 与本地产出完全一致
  - 排版常数（dpi 80 / 墨迹右缘 1163 / 上缘 33）按底板标题栏的 13px JetBrains Mono 标定，计数行与标题栏 host 文本同基线、同字号
  - **优雅降级**：字体缺失 / sharp 不可用 / 渲染异常一律只打警告并保留底板，绝不中断构建（社交卡片是装饰，不是构建产物的前置条件）

### ✨ Changed

- **社交卡片底板重做**：`public/og.jpg` 现在是**不含计数**的底板（AI 生成的 CRT 背景氛围 + 终端窗口外壳 + logo + 站名/副标题/提示符），计数在构建期叠加
  - 顺带修掉一个隐藏问题：上一版卡片的等宽字其实**不是 JetBrains Mono**，而是无头 Chrome 拿不到 Google Fonts 后回落出来的系统字体 —— 现在底板把字体以 base64 内联进 HTML，计数行走 Pango 内嵌字体，两边同一款字体

### 📚 Documentation

- **第三方主题仓链接**：`docs/THEMING.md` 的「主题的去向」改写为远端真实状态（此前还写着 `zz3656/atom-themes` 未建仓的过时提示），新增「第三方主题仓」小节与「发布到社区」的参考样例；`README.md` 的主题特性行与「主题 / 换肤」章节加入指向 [zz3656/atom-geek](https://github.com/zz3656/atom-geek) / [zz3656/atom-themes](https://github.com/zz3656/atom-themes) 的链接
- 明确记录「两条安装路径不等价」：Atom 主题契约规定主题目录只能放 CSS token，复制 `atom-geek/` 只得到配色，TUI 版式必须靠覆盖组件层实现
- 新增 `src/assets/og/README.md` 记录社交卡片资产管线（底板 / 字体 / 构建期叠加 / 降级策略）；`AGENTS.md` 补充 `src/assets/og/` 目录说明与 sharp 依赖的降级约定

## [1.5.0] — 2026-10-25

### ✨ Changed

- **品牌标识重做**：导航栏 logo、favicon、Hero 图标统一改为终端提示符 `>_` 的磷光绿标记（替换旧版紫罗兰渐变原子）；笔画加大以保证 16px 下仍可辨认
- **PWA 图标**：新增 192 / 512 / maskable-512（由同一矢量渲染，512 图标仅 3KB）；`manifest.json` 名称改为「因特吧」，主题色 `#8a5407` → `#00e88f`，背景色 → `#05070a`
- **社交分享卡片**：`og:image` / `twitter:image` 不再拿 favicon 顶替，改为 1200×630 的 TUI 卡片 `/og.png` —— 终端标题栏、站名、提示符与光标，背景氛围由本地 Draw Things（Qwen-Image 2512 / SDXL Turbo）生成，文字与界面元素全部代码排版保证清晰

## [1.4.0] — 2026-10-25

### ✨ Changed

- **标签页 → 词频面板**：索引摘要（`tags: 58 unique · cats: 8 dirs · posts: 25 files`）+ 频次分布条 + 按频次分档（≥5 / 3–4 / 1–2 篇），档内标签为带篇数与热度条的 chip
- **分类页 → 目录树面板**：`├──` / `└──` 树线串起目录卡片，卡内含分类名、文章数、最新文章标题与日期、该分类标签（含 `+N` 溢出标记）
- 两个索引页改为带边框的独立面板形态，与文章列表页的平铺 `ls -la` 行明确区分
- 索引面板样式（`_index.css`）改为**页面级引入**（仅 /tags/ 与 /categories/ 各自 import），不再全局引入 —— CSS 全内联进每个 HTML，全局引入等于让所有页面为用不到的样式买单；改动后每页少背约 5.6KB CSS（首页 76,959B → 71,364B）

### 🐛 Fixed

- **移动端横向溢出**：`html/body` 的 `overflow-x: hidden` → `clip`。`hidden` 会让 html 变成滚动容器、页头 sticky 失效；`clip` 才能真正阻断 iOS Safari 上的横向平移
- **点阵字标**（22 行 × 73 列）改为按视口等比缩放（`font-size: min(clamp(...), (100vw - 3.5rem) / 43.8)`），去掉 `overflow-x: auto` —— 它是站内唯一真正能左右滑动的区域（320px 下 scrollWidth 294 > clientWidth 285）
- **触摸设备输入框字号提至 16px**（`@media (pointer: coarse)`）：iOS Safari 会对 <16px 的输入框在聚焦时自动放大整个页面，放大后用户就能左右平移看到超出范围的内容
- 搜索框改为可伸缩（`flex: 1 1 auto; min-width: 0`），聚焦时不再突然变宽顶破顶栏
- 另修四处实测溢出：`footer-status`（窄屏溢出 10px）、`dir-date`（日期列比内容窄 2px）、`nav.toc`（侧栏内部横向滚动区）、`about-topics`（320px 下两列只剩 61px，标签 chip 溢出卡片）
- 标签 chip 名称被挤成 `#...` 的问题（chip 改按内容定宽，热度条改固定轨道 + `calc()` 填充，避免百分比在按内容定宽的 flex 里循环依赖）

### 验收

320 / 360 / 375 / 390 / 412 / 430px 六个宽度 × 首页 / 文章列表 / 标签页 / 分类页，共 48 组：页面最大越界 0px、`.term-window` scrollWidth 等于 clientWidth、`scrollLeft` 回写恒为 0（含聚焦搜索框后复测），不合格 0 组。

## [1.3.0] — 2026-10-25

### ✨ Added

- **TUI 终端形态全站客制化** —— 组件层与视觉层全部重写，不是换皮
  - 站点外壳：整页包进 `.term-window` 终端窗口（1px 硬边框、标题栏、状态栏、零圆角）
  - Header 两行化：① 标题栏（红绿灯 · `zz3656@node:~` · 实时 `25 POSTS · 08 CATS · 58 TAGS` · build 版本 · 日夜开关）② 命令行（`~/ ~/posts ~/cats ~/tags ~/about`，当前项前缀 `>`，hover 前缀也换 `>` 并带闪烁光标）
  - Hero 终端启动：纯文本点阵「因特吧」字标（22 行 × 73 列）→ 逐行自检输出（kernel / articles / index / status）→ `~/yinteba $` 提示符与闪烁光标；原 Telemetry 右列并入自检输出
  - 文章列表：`ls -la ~/posts` 行式（`[01] -rw-r--r-- 日期 大小 标题.md [分类]`，hover 整行反色 + 浮出 `>`）
  - 文章页：`cat posts/x.md` 回显刊头 + 真实文件元信息（size / lines / date / cat / read）+ 行号槽 + 命令树目录（`├─` `└─`）+ 终端标题栏代码块（真实文件名 + 语言标签 + 复制按钮）
  - 归档 / 分类 / 标签：`ls ~/cats` 目录列表；标签页 `grep -rn "tag" ~/posts`，命中行号真实、大小写不敏感
  - 搜索：`grep` 终端输入 + 带路径的命令输出下拉
  - 404：`yinteba: command not found` + 建议命令
  - About：`cat README.md` + 终端面板 + `df -h` 数据条（正文内容一字未删）
  - 新增组件 `TerminalBoot` / `TerminalAscii` / `CommandHeader` / `GrepHit`，新增样式模块 `_terminal.css`
  - 实测：对比度暗色 5.26–13.91:1、亮色 4.60–12.92:1，全部 ≥ WCAG AA；390px 无横向溢出；`app.js` 压缩后 9,800B（gzip 3,790B）；无新增依赖
  - 已知折中：行号槽是块级序号而非渲染行号（零 JS 方案）；点阵字标为构建期栅格化固化结果，换字需重跑栅格化流程（流程见 `TerminalAscii.astro` 头注释）

### ♻️ Changed

- **单主题化**：`atom-default` 移出本站，站点只剩 `atom-geek` 一个设计。归档位置 `~/Documents/GitHub/atom-themes/atom-default/`（三个文件 sha 与 git 历史 `1d6073b` 逐一校验一致）；文件同时保留在本仓库 git 历史中，可随时取回
- **默认主题与扫描顺序解耦**：默认主题由 `src/consts.ts` 的 `DEFAULT_THEME_ID` 决定，与 `scanThemes()` 的扫描顺序无关；`scanThemes()` 与 `astro-plugins/theme-loader.mjs` 统一改为 id 字典序，两处保持同序
- 站点不再内联第二套主题的 CSS，首页 HTML 从 70,064B 降至 67,732B（`inlineStylesheets:'always'` 下每页都背这部分）
- 老访客 localStorage 里存过 `themeId=atom-default` 的：该 id 已不在清单 → 校验失败自动回退 `atom-geek`；**日/夜模式选择始终保留**

### 📝 Docs

- 文档事实核对：修正「零 JavaScript」等与实现不符的表述，统一为「无框架运行时 / 仅 ~8.7KB 原生 JS」
- `README_EN.md` 项目结构树重写为当前真实结构，并同步 Node/npm 版本要求、Frontmatter 字段表、部署流程
- `README.md` / `README_EN.md` / `DEVELOP.md` 项目结构树补齐 `tests/`、`.github/`、`src/scripts/app.js`、`src/generated/`、`src/content.config.ts`、`AGENTS.md`、`CHANGELOG.md`
- 体积数字与实测对齐：交互脚本 8.7KB、单页 HTML gzip 12–18KB、构建产物约 1.8MB

### 🐛 Fixed

- `scripts/convert-hexo.mjs` 输出目录仍指向改名前的 `Atom-blog/`，改为基于脚本自身位置解析的 `../src/content/blog/`
- 补齐 `LICENSE` 文件（README 双语均链接 MIT License，但文件此前不存在）
- **CI 修复**：Astro 7.4.2 要求 Node `>= 22.23.4`，而 workflow 写 `node-version: 22` 会命中 runner 镜像缓存的 22.23.3，`astro check` 直接失败。改为 `node-version: 24`，并把 `package.json` 的 `engines.node` 同步到 `>=22.23.4`
- Actions 版本升级到 Node 24 运行时：`checkout@v7`、`setup-node@v7`、`upload-artifact@v7`，消除 "Node.js 20 is deprecated" 警告

---

## [1.2.0] — 2026-10-25

### ✨ Added

- **极客主题 `atom-geek`** —— 成为站点默认主题，磷光绿 + 青双色通道
  - 主题包 `src/themes/atom-geek/{manifest.json,light.css,dark.css}`：45 个契约 token 全覆盖，0 组件选择器、0 `!important`、不覆盖任何布局 token
  - 暗色主形态 `#00e88f` on `#05070a`（12.43:1）；亮色主色按 WCAG AA 由 `#00a86b` 降为 `#00794c`（5.01:1）
  - 站点级增补 `src/styles/_theme-geek.css`（作用域锁 `html[data-theme='atom-geek']`）：直角化、等宽字体承担数据、终端标题栏、CRT 扫描线、命令行导航、Hero 与 404 终端化
  - 删除该文件即完整回退到纯 token 形态；不改动 `atom-default`，主题包可随时并存
- **默认主题可配置** —— `src/consts.ts` 新增 `DEFAULT_THEME_ID`；`BaseLayout.astro` 优先取站点配置，主题包缺失时自动回退清单首个（删主题不会导致构建失败），老访客本地的日/夜选择不受影响
- 主题设计文档：`docs/REQUIREMENTS-ATOM-GEEK.md`（需求说明与验收标准）、`docs/ARCHITECTURE-ATOM-GEEK.md`（技术方案与 token 契约）

### 🐛 Fixed

- `src/utils/themes.ts` 的主题排序不再依赖 `readdirSync` 的实现细节，改为显式排序，新增主题目录时顺序不再漂移（与 `astro-plugins/theme-loader.mjs` 保持一致）

### ⚠️ Known gaps

- `theme-color` meta 仍为 `atom-default` 色值（`BaseLayout.astro` 中硬编码），浏览器地址栏配色暂不跟随主题
- 5 个契约 token（`--accent-secondary` / `--accent-gradient` / `--accent-glow-strong` / `--glow-secondary` / `--purple-glow`）当前无组件消费，属契约完整性保留

## [1.1.0] — 2026-10-25

### ✨ Changed

- **Visual redesign — "PRECISION LOG / 精密日志"**
  - New identity: cold-rolled steel surfaces + a single brass indicator accent (replaces violet gradients / cyber cyan)
  - Signature element: a **ruler motif** — tick-marked measure rules (`.rule`) plus a vertical ruler spine beside every log entry
  - Typography: **Archivo** (variable, `wdth` axis) for display/body; **JetBrains Mono** reserved for real data only
  - Layout: asymmetric hero with a **real-data telemetry column** (posts / categories / tags / latest entry)
  - All article lists unified into a single "log row" treatment (`_postcards.css` → `_log.css`)
  - Article page: editorial masthead, brass drop cap, ruler rule, no more gradient titles
  - Theme toggle: emoji button → CSS-driven dual-position SVG switch
  - New logo / favicon: brass atom on a steel disc — **artwork generated by Draw Things on the local machine**, then traced to vector so the colours land exactly on the design-system tokens
- **The article prose column is now dead-centre at every viewport width**
  - The TOC no longer lives *inside* the 740px article block; it is a caliper rail in the outer gutter (≥1280px) or a collapsible bar above the prose (<1280px)
  - The desktop rail draws no panel fill — it is a column of ticks, so the left gutter stops pulling the page's visual weight off the prose
  - The TOC `<details>` now starts closed and only auto-expands on wide screens, where it is a side rail rather than an inline block
- **Design-token architecture** — 12 new semantic surface tokens (`--on-accent`, `--header-bg`, `--panel-bg`, `--code-bg`, `--grid-line`, `--highlight`, `--ambient-glow`, `--rule-tick`, `--rule-tick-strong`, `--focus-ring`, `--glow-secondary`); all hardcoded colors removed from component CSS so third-party themes actually render correctly
- **Astro 7.3.3 → 7.4.2**, plus `@astrojs/markdown-remark` added as an explicit devDependency (it is a **peer dependency** in Astro 7)
- Markdown pipeline migrated from the deprecated `markdown.remarkPlugins` to `markdown.processor: unified({ ... })` — deprecation warnings gone
- `src/consts.ts` — new `HERO_EYEBROW` / `HERO_EYEBROW_SUB` for the hero eyebrow; `SITE_DESCRIPTION` rewritten
- Project renamed `Atom-blog` → `Atom` (directory, package name, docs, URLs, code references); all `from app.*` imports → root-level imports
- Simplified multi-theme system: the project ships with only `atom-default`; other themes moved to a separate repo (`atom-themes/`)
- Theme picker UI replaced with a simple light/dark toggle button
- Header dropdown menu (`.theme-picker`/`.theme-menu`) removed; click directly toggles mode — Header code −50 lines, app.js theme code −135 → ~30 lines, `_header.css` −106 lines (net −498 lines, +58/−556)
- Footer rewritten: `🐙 GitHub` (user-customizable via `SOCIAL_LINKS.github`) + `© 2026 Atom` (hardcoded framework brand → `REPO_URL`)
- `canonical` URL link added to all pages
- Coverage config: removed the exclude of `date.ts`/`path.ts`/`collection.ts`; `collection.ts` now has dedicated `tests/collection.test.ts`
- `minify-app-js.mjs`: removed the redundant `public/<base>/` copy branch (it was creating unused `dist/Atom/` files)
- **Performance**: search/theme JS extracted to `public/js/search.js` (~5KB external file); the search index loads lazily on first focus/keystroke
- **Refactor**: `path.ts` unified with a single `withBase()` helper (removed redundant `blogSlug`, `blogPath`, `pageUrl`)
- **Refactor**: centralized `getPublishedPosts()` in `utils/collection.ts`
- **Refactor**: all `<img>` tags have explicit `width`/`height` to prevent CLS
- **Refactor**: TypeScript strict mode + `npm run check` (0 errors, 0 warnings)
- **README**: documented the `featuredImage` and `draft` fields
- Docs refreshed: README / README_EN / DEVELOP (new "Design System" section) / THEMING.md, and all three built-in articles rewritten for the new stack

### 🐛 Fixed

- **The article body sat visibly right of centre** — between 1100–1279px the TOC was a left column *inside* the 740px article block, squeezing the prose to 508px and shifting it 116px off-centre. The TOC now only ever lives in the outer gutter: the prose stays 740px and dead-centre at every width
- **The floating TOC read as a heavy block** — the desktop rail (≥1280px) dropped its opaque panel fill and turned into a column of caliper ticks, so the left gutter stops pulling the page's visual weight away from the prose
- **The TOC ate the top of every narrow-screen article** — the `<details>` now starts closed and only auto-expands on wide screens
- **320px horizontal overflow** — the nav row no longer exceeds the viewport (new ≤400px breakpoint)
- **Long article titles broke the 320px layout** — the previous/next nav links are CSS Grid items whose default `min-width: auto` let a `nowrap` title stretch the track past the viewport; `.post-nav-link` now opts into shrinking and the label ellipsises
- **Wide tables broke the page on narrow screens** — new `astro-plugins/rehype-table-scroll.mjs` wraps every `<table>` in an `overflow-x: auto` container (table scrolls, page does not)
- **Sub-24px tap targets** — footer links, TOC summary/links and tag chips now meet WCAG 2.5.8
- Mobile nav ordering — a duplicate `margin-left` declaration was overriding `margin-left: auto`, misplacing the search/toggle row
- All color pairs now pass **WCAG AA** contrast on every surface (light + dark)
- RSS feed URL double-prefix bug fixed (online verified): `siteUrl + prefix` → `siteUrl.replace(/\/$/, '') + path`
- Search-result URL double-trailing-slash bug fixed
- Hero button href `/Atom//blog` (404) fixed → `/Atom/blog`
- Image-zoom overlay: alt supplied from the original `<img alt>` (not a blank placeholder)
- 404 page `og:url` no longer points at the non-existent `/404/` (uses `pageUrl={Astro.site}`)
- CSS import path in layouts
- Frontmatter date sorting in the blog listing

### ➕ Added

- **A version system** — `package.json` is the single source of truth, the footer renders the version, and `tests/version.test.ts` keeps the CHANGELOG and `package.json` from drifting apart
- `AGENTS.md` — agent-facing project definition (setup commands, project rules, testing and PR conventions)
- `astro-plugins/rehype-table-scroll.mjs` + `tests/rehype-table-scroll.test.ts`
- `src/styles/_modules/_log.css` — the log-list component (replaces `_postcards.css`)
- `formatDateISO()` in `src/utils/date.ts` — `YYYY/MM/DD` for tabular alignment
- Ruler primitives (`.rule`, `--rule-height`, `--rule-major`, `--rule-minor`) in `_variables.css`
- `scripts/vectorize-icon.mjs` — raster → vector tracer that maps a generated bitmap onto the design-system palette by hue (brass vs. neutral steel), so the icon pipeline is reproducible
- Brand icons regenerated from a local Draw Things run: `public/logos/logo.svg`, `public/favicon.svg`, and the inline mark in `src/components/HeroIcon.astro`
- DEVELOP.md gained a "Brand icons (the Draw Things pipeline)" section (bilingual) documenting both steps and the CLI commands
- `REPO_URL` in `src/consts.ts` for the Footer project source link (separate from `SOCIAL_LINKS.github`)
- `data-has-dark` attribute on theme options (single-mode theme support)
- Theme scaffold CLI: `npm run theme:create <id>` + `--no-dark` flag
- `data-theme` / `data-mode` dual-attribute theme system with build-time injection (FOUC-free)
- Build plugin `astro-plugins/theme-loader.mjs` (scans `src/themes/` at build)
- `docs/THEMING.md` — complete theme development guide
- Atom-style robot favicon (SVG)
- Dark mode toggle with user preference memory
- Reading progress bar on article pages
- Previous / Next article navigation
- 404 page with Atom theme design
- Reward (donation) QR code support
- Reading time estimation with Chinese + English word counting
- Related posts recommendation (based on tag overlap + category match)
- Back-to-top button with smooth scroll + reduced-motion support
- Search results keyboard navigation (Arrow keys + Enter + ESC)
- Sitemap `<lastmod>` based on article `updatedDate`/`pubDate`
- RSS full content via `<content:encoded>` (CDATA)
- npm shortcuts: `npm run new`, `npm run list`, `npm run test`, `npm run check`
- CI workflow for type check + tests + build verification
- Unit test infrastructure (Vitest) with 17 test cases
- `featuredImage` frontmatter field for SEO OG images
- `draft` frontmatter field — drafts are filtered from listings, RSS, and sitemap
- Theme FOUC prevention (script moved to `<head>`)
- Smooth theme switch transition with `prefers-reduced-motion` support
- `<HeroIcon />` Astro component (extracted from inline SVG)

### 🔒 Security

- RSS injection defense: `escapeXml()` on title/description in RSS items
- Image-zoom overlay uses the original `<img alt>` via `openZoom(src, alt)` (not blank)
- Search results now use the `DOM API` + `escapeHTML` to prevent XSS

### 🗑 Removed

- Dead code: `formatFullDate` (only used in tests), `isRoot()` (never called), `createCategoryFilter`, unused `redirect` schema field, unused `FormattedDate` import in `PostCard`
- `dist/Atom/js/app.js` (10KB unused file in production builds)
- Sepia & Solarized themes from `src/themes/` (moved to the `atom-themes/` standalone repo)
- `scripts/fix-links.mjs` (dead code — Astro 7 auto-fixes protocol-relative URLs)

---

## [1.0.0] — 2026-09-13

### Added

- ⚡ Astro-powered static blog
- 🌙 Dark mode (CSS variable based)
- 📱 Responsive design (mobile / tablet / desktop)
- 📝 Markdown writing with Shiki syntax highlighting (GitHub Dark)
- 🏷️ Tag system with auto-display on cards
- 🔍 SEO optimization: Open Graph, Twitter Cards, JSON-LD
- 📄 RSS feed (auto-generated post-build)
- 🗺️ Sitemap (auto-generated post-build)
- 🤖 robots.txt
- 📖 Article detail layout with prev/next nav
- 💰 Optional reward section with WeChat / Alipay QR codes
- 📁 Content Collections API (type-safe frontmatter)
- 📸 Hero image support per article
- 🕐 Article update date display
- 🚀 GitHub Actions deploy workflow
- 🎨 Atom (Real Steel) themed favicon
- 📊 6 pages: home, blog list, 3 sample posts, about, 404
- 📦 ~50 KB total output
- 💯 Lighthouse 100 on all metrics
- 📄 Bilingual docs (README zh/en, DEVELOP.md)

### Tech Stack

- Astro 4.x
- TypeScript
- Shiki (code highlighting)
- CSS Variables (theming)
- GitHub Pages + Actions (deployment)

---

<div align="center">

**Made with ⚙️ by [Atom Blog](https://github.com/zz3656/Atom) · Powered by [Astro](https://astro.build)**

</div>
