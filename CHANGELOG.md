# Changelog

All notable changes to this project will be documented in this file.

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循[语义化版本](https://semver.org/lang/zh-CN/)。

**版本号的唯一数据源是 `package.json` 的 `version` 字段** —— 页脚显示的版本号从那里读取，
`tests/version.test.ts` 会校验它与本文件的最新发布版本号一致，两边不会漂移。

发布流程：改 `package.json` 的 `version` → 把下面 `[Unreleased]` 段改成 `[x.y.z] — 日期` → `git tag -a vx.y.z -m "..."` → `git push main --tags`。

---

## [Unreleased]

<!-- 下一轮改动写在这里。发布时把这一段改成 [x.y.z] — YYYY-MM-DD，并同步 package.json -->

### ✨ Added — 主题包机制：主题自带规则与首页 Hero（装主题不改项目源码）

- **主题包可以携带 `overlay.css`**：该主题作用域下的规则（直角化 / 等宽数据位 / CRT / 焦点辉光），
  `theme-loader` 会自动 `@import` 进 `src/generated/themes.css`。规则必须 `html[data-theme='<id>']`
  前缀，禁 `!important`，不改版式宽度
- **主题包可以携带 `hero.astro`**：首页通过 `import.meta.glob('../themes/*/hero.astro')` 取当前主题的
  Hero，没有则回落项目内置 Hero。Hero 的数据（文章数 / 分类数 / 标签数 / 正文字节数 / 生成器）全部由
  页面以 props 传入
- **`manifest.json` 支持 `"default": true`**：排序置顶并被站点当作默认主题，装主题不必改
  `src/consts.ts`；主题清单仍按 id 字典序（无 per-id 特例）
- `theme-loader` 产出的清单新增 `default` / `overlay` / `hero` / `themeColor` 标志，`ThemeManifest` 同步
- **新增主题 `atom-geek`**：磷光终端 / 磷光纸双模（47 token）+ `overlay.css` + 终端启动 Hero
  （点阵字标 / 自检输出 / 闪烁光标），演示「一个目录装完，不改项目源码」

### ✨ Added — 站点元数据外置

- 新增 `site.config.json`（数据文件）：`domain` / `repo` / `githubUser`。`astro.config.mjs` 读它，
  环境变量优先；派生站点改这一个文件即可，不必再改构建配置

### 🐛 Fixed

- **搜索索引 / RSS 的 slug 与 Astro 真实路由对齐**：新增项目级 `src/utils/slug.ts`（github-slugger 规则：
  小写 + 去标点 + 空格转连字符），`scripts/lib/blog-posts.mjs` 统一使用；文件名含中文或大驼峰时，
  索引与 RSS 不再指向 404
- **`verify-search-index.mjs` 会把分页页当文章**：`/blog/2/`、`/blog/3/` 是 dist/blog 下的目录但不是文章，
  已排除；文章数超过一页的站点不再误报


### 📝 Docs

- 明确「两条版本线」：本仓 semver 是模板契约（主题 token / 脚本 CLI / 目录约定），派生站点有自己的发版史，
  不互相对齐。`DEVELOP.md` 新增「两条版本线：模板仓 vs 派生站点」小节（含 `upstream` 字段写法、
  升级时哪些文件不要覆盖、升级后必跑的校验）；`README.md` 同步摘要；历史版本表补齐 1.1.1–1.1.5
- `AGENTS.md` 补两条规则：链接不得重复包 `baseAssetsPath`（附 `npm run verify:links`）、版本号分线

---

## [1.1.5] — 2026-11-16

### 🐛 Fixed

- **线上整站 404（严重）**：`Header.astro` 的导航链接被 `baseAssetsPath()` 拼了两次 base
  ——`navLinks` 的值已经由 `path.ts` 的工具函数带上 `/Atom`，模板里又包了一层，
  于是所有导航变成 `/Atom/Atom/blog/`。构建与 CI 都不会报错，只有点开站点才发现。
  这次同时补了会拦住它的门：新增 `scripts/verify-build-links.mjs`，
  把 `dist` 里每份 HTML 的站内链接映射回真实产物，缺一个就失败，CI 已接入
  （实测：23 份 HTML、base=`/Atom`，全部命中）。

## [1.1.4] — 2026-11-16

### 🐛 Fixed

- **字体改为自托管**：移除 `fonts.googleapis.com` 外链。原来两个 `preconnect` + 一个阻塞渲染的
  样式表请求，大陆网络下会挂到超时，之后才回落到系统字体（还带字宽跳变）。
  现在 `@fontsource-variable/archivo`（手写 `@font-face`，只取 latin 的 `wdth` 轴文件）
  + `@fontsource/jetbrains-mono` 的 latin 400/500/700，实测首页 gzip 仍 14KB、文章页 18KB
- **对比度**：亮色主题 `--warning` 4.35:1 → 5.3:1；搜索结果命中文字改用 `--text-bright`
- **动效与溢出**：`html body *` 的全局颜色过渡收敛到 `body`（换主题不再整页重绘）；
  `overflow-x: hidden` → `clip`（hidden 会创建滚动容器，把真实横向溢出藏起来）
- **`site`/`base` 双前缀隐患**：`site` 只写 origin、`base` 单独给子路径——原来两者都含
  `/<repo>`，只改一边就会生成 `/Atom//Atom/`；fork 后缺 `GITHUB_USER`/`CF_DOMAIN` 会打印警告
- 删掉与 `inlineStylesheets:'always'` 互相抵消的 `cssCodeSplit`，以及无效的 dev-toolbar 预构建

### ✨ Changed

- **PWA 图标补 PNG**：192/512（含 maskable）与 `apple-touch-icon.png`——Android/Chrome
  不会拿 SVG 当启动图标；`<link rel="apple-touch-icon">` 走 base
- 新增 `draft-example.md`（`draft: true`）：把 `featuredImage` / `updatedDate` / `reward` /
  `draft` 四个可选项的写法固化成可运行的样例，且不会进构建
- 新增 `npm run preview:github`：本地按 GitHub Pages 子路径预览

### ♻️ Refactor

- 抽出 `PostList.astro` + `Pagination.astro` + `src/utils/pagination.ts`：
  `index.astro` / `blog/index.astro` / `blog/[...page].astro` 原先各抄一份列表与分页算术，
  序号列还在两个地方重复实现。首页也改用 `PostList`
- `PostCard` 的参数 `slug` 更名为 `href`（它一直传的是完整 URL，不是 slug）
- 新增 `tests/pagination.test.ts` 覆盖 0 / 11 / 12 / 13 篇与 `perPage=0` 的边界

### 📝 Docs

- **文档事实修正**：Cloudflare Pages 不再写成「配三个 secret 的 deploy.yml」（仓库只有
  GitHub Pages 的 workflow，CF 走其 Git 集成）；发版命令统一为 `git tag -a`；
  token 数 12 → 18 个语义表面 token（全站 47 个）；minify 脚本描述改成 esbuild 直出；
  修 README 章节编号重复；`THEMING.md` 三处虚构引用（主题选择里的 Ocean、`scanThemes()` 去重、
  官方 `atom-themes` 仓库）；`DEVELOP.md` 的 frontmatter 表补齐 `category`/`featuredImage`/`draft`
- `IDEA.md` 澄清定位：本仓是源码/模板仓，Pages 部署只是流水线自检产物，正式站是另一个仓库

## [1.1.3] — 2026-11-16

### 🐛 Fixed

- **灯箱可键盘使用**：原来只能鼠标点开，键盘/读屏用户完全用不了；现在图片可 Tab 聚焦、Enter/Space 打开，关闭后焦点归还给原图，Tab 不出遮罩
- **搜索可读性**：输入框 `type=search` + `role=combobox` + `aria-expanded/aria-controls`，结果容器 `role=listbox` + `aria-live`，结果项 `role=option`；结果项焦点态原来是 `outline:none` + 1.1:1 的背景色，键盘根本看不出选中项
- **桌面端幽灵按钮**：`.nav-toggle` 在 ≥769px 无任何样式却照常渲染，是个能 Tab 停住、按了没反应的控件 → 桌面端 `display:none`
- **控件描边对比度**：搜索框与主题开关用 `--border-color`，对页面底色只有 1.09–1.22:1（WCAG 1.4.11 需 3:1）→ 新增 `--control-border`
- **导航高亮在子路径部署下永远不亮**：`Header.astro` 用 `Astro.url.pathname` 直接比 `/blog`，而 GitHub Pages 下是 `/Atom/blog/` → 新增 `stripBase()` 后比较
- **RSS 四处不合规**：`<lastBuildDate>` 写进每个 `<item>`（只允许 channel 层）、`content:encoded` 塞原始 Markdown、缺 `<language>`、`]]>` 未转义；正文改为从构建产物抽取渲染后 HTML
- **sitemap lastmod**：删掉正则注入的 `scripts/fix-sitemap.mjs`（还插在 `<changefreq>` 之后，不合 XSD 顺序），改用集成 `serialize`，文章页用 `updatedDate ?? pubDate`、其余页面用最新文章日期
- **robots.txt 没有 Sitemap 指令**且静态文件写不出 base 前缀 → 改为构建期生成；**404** 加 `noindex`、去掉指向首页的 canonical
- **`og:image` 兜底是 SVG favicon**（微信/X/LinkedIn 都不解析）→ 新增 1200×630 的 `og-default.png`，补 `og:image:width/height/alt`
- **`SITE_TITLE` 不生效**：7 个页面标题硬编码「Atom Blog」，分页/分类/标签页 meta description 全站同一句 → 改为 `SITE_TITLE` 与逐页描述
- **正文首图被 lazy**（它通常就是 LCP 元素）→ 首图 `eager` + `fetchpriority=high`，其余仍 lazy
- 分类/标签 URL 未编码：`getTagUrl('入门')` 现输出 `/tag/%E5%85%A5%E9%97%A8/`
- frontmatter 块状 YAML 列表（`tags:` 后跟 `- a`）此前静默丢标签，现已支持

### ✨ Changed

- `trailingSlash: 'always'`：内链、canonical、sitemap 三处口径统一，导航少一次 301
- 打赏二维码 PNG（160KB+143KB）→ 280×280 webp（各 14KB），并加 `loading="lazy"`
- **移除 6 个全站零引用的 token**（`--accent-secondary`、`--accent-gradient`、`--accent-glow-strong`、`--glow-secondary`、`--purple-glow`、`--shadow-sm`），第三方主题的必填契约随之收窄

### 🧹 Chore & CI

- **一条流水线 `verify.yml`** 取代 test.yml + deploy.yml：部署是 `needs: verify` 的下游 job（测试红了不再发布），且复用 verify 的构建产物（原先 4 次 `npm ci`、2 次全量 build）
- 覆盖率从"装饰品"变成门禁：`vitest.config.ts` 加 thresholds（lines 80 / stmts 75 / branches 62 / funcs 85），当前实测 91.6 / 88 / 80.5 / 97.3
- 依赖与工具链：`sharp` 正式列入 devDependencies、`private: true`、`engines.node >= 24` + `.nvmrc`、新增 `clean` / `test:watch`
- 删掉零引用代码：`FormattedDate.astro`、`date.ts` 的 `formatDateCN`/`formatFullDate`、`path.ts` 的 `isRoot`、`_about.css` 里 78 行死选择器
- 测试 103 → 128（新增 CLI 模板、token 契约、图片 lazy、块状 YAML、路径编码、`absoluteUrl`/`joinBase`/`stripBase`）

## [1.1.2] — 2026-11-16

### 🐛 Fixed

- **站内搜索索引落后一次构建**：索引原先在 `postbuild` 写 `public/_assets/`，而 `astro build` 早已把 `public/` 复制进 `dist/`，导致新文章页面能打开、sitemap 有收录，但站内搜索搜不到它。改为 `prebuild` 生成，并新增 `scripts/verify-search-index.mjs`，在 CI 断言「索引 slug 集合 == `dist/blog` 目录集合」（原先只 `test -f`，旧索引也能过关）
- `atom new --draft` 的 `draft: true` 被写到 frontmatter 收尾 `---` **之后**（落进正文，草稿会直接发布）；`--reward` 从未写入文件。frontmatter 组装抽到 `scripts/lib/post-template.mjs` 并补测试
- `atom new` 写完文件后崩溃 `relative is not defined`（`node:path` 少 import 一个）
- **子路径部署（base=`/Atom`）下头图 404**：`BlogPost` 的 `<img>` 直接用 frontmatter 原值，JSON-LD 的 image/logo 用 `Astro.url.origin`（不含 base），与 `og:image` 给出两个不同 URL。统一走 `baseAssetsPath()` / 新增的 `absoluteUrl()`
- `public/manifest.json` 的 `start_url:"/"`、图标路径同样不吃 base → 改为构建期生成 `src/pages/manifest.json.ts`
- `_responsive.css` 断点顺序错乱（`400px` 排在 `480px` 之前），超窄屏的导航栏压缩规则被反覆盖
- noscript 提示条写死 `#fef3c7` 黄底，暗色模式下是一块刺眼白 → 迁到 `_modules/_layout.css` 的 `.noscript-note`，用 token 着色

### ✨ Changed

- **新增 7 个主题 token**：`--overlay-bg`、`--on-overlay`、`--overlay-control-bg`、`--overlay-control-bg-hover`、`--overlay-control-border`、`--on-success`、`--code-inset`。`_post.css` 里 8 处字面色值（灯箱遮罩、复制成功态、代码块内阴影）全部改用 token；`docs/THEMING.md` 与 `scripts/create-theme.mjs` 已同步
- 主题 manifest 新增可选 `themeColor{light,dark}`，`<meta name="theme-color">` 与 PWA 配色改为从主题读取，兜底值集中在 `src/consts.ts` 的 `DEFAULT_THEME_COLORS`
- 内置 Hero「黄铜原子」明确为**品牌资产**（颜色固定，不随主题），THEMING.md 里写明这是组件层不写死颜色的唯一例外
- 移除不可用的 OpenSearch 声明与 `public/opensearch.xml`：模板从未实现 `?q=` 搜索，静态 XML 里的 `"/"` 也不吃 base

### 🧹 Chore

- `.env` / `.env.*` 进 `.gitignore`（模板仓会被 fork，避免误提交密钥）
- `.astro/`、`src/generated/themes.ts` 不再入库——dev/build/`astro check` 会自动重建（已实测删除后 `astro check` 与全部测试仍绿）；`.prettierignore` 补 `src/generated`
- 新增 `tests/blog-posts.test.ts`、`tests/post-template.test.ts`、`tests/theme-tokens.test.ts`，用例数 103 → 118

## [1.1.1] — 2026-11-16

### 📝 Docs

- 文档事实核对：修正「零 JavaScript」等与实现不符的表述，统一为「无框架运行时 / 仅 ~8.7KB 原生 JS」
- `README_EN.md` 项目结构树重写为当前真实结构，并同步 Node/npm 版本要求、Frontmatter 字段表、部署流程
- `README.md` / `README_EN.md` / `DEVELOP.md` 项目结构树补齐 `tests/`、`.github/`、`src/scripts/app.js`、`src/generated/`、`src/content.config.ts`、`AGENTS.md`、`CHANGELOG.md`
- 体积数字与实测对齐：交互脚本 8.7KB、单页 HTML gzip 12–18KB、构建产物约 1.8MB
- `AGENTS.md` 补「本机（Linux / fnOS 卷）环境坑」：构建要在 `/tmp` 临时镜像里跑（该卷会让 Node 的 `copy_file_range` 产出不可读文件）、`astro check` 需 `ASTRO_TELEMETRY_DISABLED=1`、`node_modules` 必须本机 `npm ci`

### 🐛 Fixed

- `scripts/convert-hexo.mjs` 输出目录仍指向改名前的 `Atom-blog/`，改为基于脚本自身位置解析的 `../src/content/blog/`
- 补齐 `LICENSE` 文件（README 双语均链接 MIT License，但文件此前不存在）
- **CI 修复**：Astro 7.4.2 要求 Node `>= 22.23.4`，而 workflow 写 `node-version: 22` 会命中 runner 镜像缓存的 22.23.3，`astro check` 直接失败。改为 `node-version: 24`，并把 `package.json` 的 `engines.node` 同步到 `>=22.23.4`
- Actions 版本升级到 Node 24 运行时：`checkout@v7`、`setup-node@v7`、`upload-artifact@v7`，消除 "Node.js 20 is deprecated" 警告

---

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
