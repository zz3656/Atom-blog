# AGENTS.md

Atom —— 一个用 Astro 构建的现代轻量级博客（「因特吧」，磷光终端 / TUI 视觉体系，方向 A = TUI），为 GitHub Pages / Cloudflare Pages 部署优化。

## Setup commands

- Node 版本：**>= 24**（`.nvmrc` = 24、`engines` = `>=24`，CI 用 `node-version: 24`；Astro 7.4 的底线是 22.23.4）。`setup-node` 里写 `node-version: 22` 会命中 runner 镜像缓存的 22.23.3，导致 `astro check` 直接报错退出——别改成 `22`
- Install deps: `npm install`
- Start dev:    `npm run dev`            # http://localhost:4321
- Build:        `npm run build`          # prebuild 生成搜索索引 → minify → astro build → postbuild（RSS + OG 卡片），产出 `dist/`
- Verify links: `npm run verify:links`   # 构建后：站内链接必须映射回 dist 真实产物（拦 `/Atom/Atom/` 双前缀）
- Verify index: `npm run verify:search`  # 构建后：搜索索引必须与 dist/blog/ 的文章页一一对应（分页目录除外）
- Test:         `npm test`               # Vitest（`npm run test:coverage` 带覆盖率）
- Lint:         `npm run lint`           # ESLint flat config
- Typecheck:    `npm run check`          # `astro check`（CI 里先跑这个再跑 lint）
- Format:       `npm run format`         # Prettier

## Project layout

- `src/` — Astro 应用：`pages/` 路由、`components/`、`layouts/`、`content/` 文章集合、`themes/`、`styles/`、`utils/`、`consts.ts` 站点配置
- `src/content/blog/` — Markdown 文章（frontmatter 见 `src/content.config.ts`）
- `src/themes/<id>/{light,dark}.css` — 主题，**只放 CSS token**，不放规则。本站是**单主题站点**：唯一主题 `atom-geek`（`src/themes/atom-geek/`）
- `src/styles/_modules/` — 共享 CSS 模块（布局/字体/刻度尺），**不含颜色**
- `src/styles/_theme-geek.css` — 站点级作用域增补（L2）：把上游组件层（`.site-header`/`.hero`/`.log-row`/`.section-*`）重新表述成磷光终端语法（直角化 / 等宽角色 / 终端标题栏 / CRT）。**每条规则必须以 `html[data-theme='atom-geek']` 开头**，禁 `!important`、不改 `--max-width`/`--content-width`；由 `global.css` 末尾 import
- `src/generated/` — 构建时生成的主题汇总入口（`themes.ts` 已被跟踪，但内容会被 build 重写，别手改）
- `src/assets/og/` — 社交卡片底板用的构建资产（等宽字体 + 许可），说明见 `src/assets/og/README.md`
- `public/` — 静态资源（`logos/`、`favicon.svg`、PWA 图标 `icon-192/512.png`+`apple-touch-icon.png`）；`public/og.jpg` 是社交卡片**底板**（不含文章计数，计数在构建期叠加）。`robots.txt` 与 `manifest.json` **不再是静态文件**，由 `src/pages/robots.txt.ts`、`src/pages/manifest.json.ts` 构建期生成（才跟得上部署 base）
- `astro-plugins/` — remark/rehype 与构建期插件（`rehype-table-scroll` 等）
- `scripts/` — 构建辅助与 CLI：`lib/blog-posts.mjs`（文章读取/搜索索引的唯一实现）、`generate-search-index.mjs`（prebuild）、`verify-build-links.mjs`、`verify-search-index.mjs`、`atom-cli.mjs`、`create-theme.mjs`、站点专属的 `generate-og.mjs` 与 `vectorize-icon.mjs`
- `tests/` — Vitest 单元测试，`*.test.ts`
- `docs/THEMING.md` — **主题作者契约**，改 token 必须同步改这里
- `.github/workflows/verify.yml` — 单条流水线：check → lint → test → build → 两道门禁 → 部署（部署是 `needs: verify` 的下游，复用构建产物）

## Code style

- TypeScript 严格模式（`astro/tsconfigs/strict`）
- Prettier：单引号、分号、`trailingComma: all`、printWidth 100（Markdown 120）、2 空格、LF
- ESLint flat config：`eslint.config.js`；`scripts/` 与 `astro-plugins/` 被 ignore（各自有独立风格）
- 提交前跑 `npm run check && npm run lint && npm test`

## Project rules (违反会被 review 打回)

- **组件层不得写死任何颜色**——只用语义 token（`--accent`、`--bg-primary`、`--rule-tick` …）。主题目录只放 token；组件 CSS 写死颜色会让换主题时渲染出错的配色
- **单主题站点**：唯一主题 `atom-geek`，主题清单按 id 字典序（通用规则，无 per-id 特例），`DEFAULT_THEME_ID` 只是文档化常量，实际入口是清单第一个
- **文章目录永远不挤压正文宽度**——正文列固定 `--content-width`(740px) 居中，TOC 只能待在两侧空白区（≥1280px 左侧刻度栏 / <1280px 顶部折叠条）。曾因在 1100–1279px 把 TOC 塞进文章块当左列，正文被压到 508px 且右移 116px
- 主题 token 契约是 **47 个**（`src/themes/atom-geek/{light,dark}.css` 各 47 且集合完全相同）；新增/修改 token 时，`scripts/create-theme.mjs` 脚手架和 `docs/THEMING.md` 必须同步，`tests/theme-tokens.test.ts` 会三方比对
- JetBrains Mono **只用于真实数据**（日期、计数、序号、刻度、代码）；中文界面一律无衬线
- 分类 = 青色通道（`--cat-*`），标签 = 绿色描边（`--tag-*`）；全站只保留两条语义色通道
- **版本号只有一个数据源**——只改 `package.json` 的 `version`。`src/consts.ts` 的 `SITE_VERSION` 从那里 import，页脚显示它；`tests/version.test.ts` 会校验它与 `CHANGELOG.md` 最新版本号一致
- **版本号分两条线**：本仓 semver 是自己的发版史，上游 `zz3656/Atom` 的 semver 是模板契约，不要互相对齐；本仓用 `package.json` 的 `upstream` 字段 + `CHANGELOG.md` 顶行记录基础版本（当前 `1.1.5`）
- **搜索索引必须 prebuild 生成**——Astro 在构建开始时只拷贝一次 `public/`，postbuild 再写 `public/_assets/` 永远进不了 `dist/`
- `@astrojs/markdown-remark` 在 Astro 7 里是 **peer dependency**，必须显式留在 `devDependencies`
- Markdown 管线走 `astro.config.mjs` 的 `markdown.processor: unified({ ... })`（旧的 `markdown.remarkPlugins` 顶层写法已废弃）
- 链接要走 `src/utils/path.ts`（`blogPostUrl`/`baseAssetsPath`/`absoluteUrl`/`stripBase`），不要手写 base 前缀；JSON-LD、manifest、robots 这类必须是完整地址的走 `absoluteUrl()`
- **文章 slug 必须走 `src/utils/slug.ts` 的 `astroSlug()`**——Astro 7 用 github-slugger 生成内容路由（转小写 + 去标点 + 空格转连字符），文件名原样当 slug 用会跟真实路由对不上。`DrawThings完全使用指南.md` 的路由是 `/blog/drawthings完全使用指南/`，不是 `/blog/DrawThings完全使用指南/`。曾因此让 12 / 26 篇文章的搜索结果与 RSS 链接全部指向 404。`scripts/lib/blog-posts.mjs` 里的 `loadPosts()` 统一走 `astroSlug()`，并由 `npm run verify:search` 在 CI 里对 `dist/blog/` 的真实路由做一一比对，对不上就让构建失败

## Testing instructions

- 单元测试：Vitest，跑 `npm test`；新增行为在 `tests/` 下加 `*.test.ts`
- `npm run format:check` **有既存基线噪音**（Markdown 里刻意对齐的表格与行尾注释不合 Prettier）——只格式化自己动过的文件，别全量 `--write`
- 改了 markdown 处理器后，`.astro/data-store.json` 缓存**不会**自动失效：必须 `rm .astro/data-store.json` 再重启 dev server
- 窄屏验证用 iframe 量 `scrollWidth`（macOS headless Chrome 的 `--window-size` 在 <500px 时不可靠）

## PR & commit conventions

- **推 `main` 即部署**——`verify.yml` 在 push 到 `main` 时校验通过才发布到 GitHub Pages；Cloudflare Pages（`www.inte8.top`）走它自己的 Git 集成，同样吃 `main`。本仓库历史以直推 `main` 为主
- 需要 review 时从 `main` 切分支、开 PR（`gh pr create`）再合入 `main`
- Commit message：conventional commits（`feat:` / `fix:` / `docs:` / `refactor:`）
- 发版时打 annotated tag（`git tag -a v1.1.0 -m "..."`）并 `git push --tags`

## Security

- 不要提交密钥。`.gitignore` 已含 `.env` / `.env.*`（`!.env.example` 例外），CI 侧密钥一律走 GitHub Actions secrets
- `scripts/vectorize-icon.mjs` 与 `scripts/generate-og.mjs` 依赖 `sharp`；`sharp` 已显式列入 `devDependencies`（不再靠 Astro 的传递依赖赌运气）
- `scripts/generate-og.mjs`（构建期叠加社交卡片计数）同样依赖 `sharp`。`sharp` 在 lockfile 里是 Astro 的 **optionalDependency**，`npm ci` 会装上；但它随时可能消失，所以脚本必须**优雅降级**：字体缺失 / sharp 不可用 / 渲染异常都只打警告并保留底板，绝不中断构建
