# AGENTS.md

Atom —— 一个用 Astro 构建的现代轻量级博客（「因特吧」，磷光终端 / TUI 视觉体系，方向 A = TUI），为 GitHub Pages / Cloudflare Pages 部署优化。

## Setup commands

- Node 版本：**>= 22.23.4**（Astro 7.4 的硬性要求，CI 用 `node-version: 24`）。`setup-node` 里写 `node-version: 22` 会命中 runner 镜像缓存的 22.23.3，导致 `astro check` 直接报错退出——别改成 `22`
- Install deps: `npm install`
- Start dev:    `npm run dev`            # http://localhost:4321
- Build:        `npm run build`          # 含 minify + RSS + sitemap 后处理，产出 `dist/`
- Test:         `npm test`               # Vitest（`npm run test:coverage` 带覆盖率）
- Lint:         `npm run lint`           # ESLint flat config
- Typecheck:    `npm run check`          # `astro check`（CI 里先跑这个再跑 lint）
- Format:       `npm run format`         # Prettier

## Project layout

- `src/` — Astro 应用：`pages/` 路由、`components/`、`layouts/`、`content/` 文章集合、`themes/`、`styles/`、`utils/`、`consts.ts` 站点配置
- `src/content/blog/` — Markdown 文章（frontmatter 见 `src/content.config.ts`）
- `src/themes/<id>/{light,dark}.css` — 主题，**只放 CSS token**，不放规则。本站是**单主题站点**：唯一主题 `atom-geek`（`src/themes/atom-geek/`）
- `src/styles/_modules/` — 21 个共享 CSS 模块（布局/字体/刻度尺），**不含颜色**
- `src/styles/_theme-geek.css` — 站点级作用域增补（L2）：直角化 / 等宽角色 / 终端标题栏 / CRT。**每条规则必须以 `html[data-theme='atom-geek']` 开头**，禁 `!important`、禁覆盖布局 token
- `src/generated/` — 构建时生成的主题汇总入口（`themes.ts` 已被跟踪，但内容会被 build 重写，别手改）
- `src/assets/og/` — 社交卡片底板用的构建资产（等宽字体 + 许可），说明见 `src/assets/og/README.md`
- `public/` — 静态资源（`logos/`、`favicon.svg`、`manifest.json`）；`public/og.jpg` 是社交卡片**底板**（不含文章计数，计数在构建期叠加）
- `astro-plugins/` — remark/rehype 与构建期插件（`rehype-table-scroll` 等）
- `scripts/` — 构建辅助与 CLI（`atom-cli.mjs`、`create-theme.mjs`、`vectorize-icon.mjs`、`generate-og.mjs`）
- `tests/` — Vitest 单元测试，`*.test.ts`
- `docs/THEMING.md` — **主题作者契约**，改 token 必须同步改这里
- `.github/workflows/` — `test.yml`（lint → test → build 三段依赖）、`deploy.yml`

## Code style

- TypeScript 严格模式（`astro/tsconfigs/strict`）
- Prettier：单引号、分号、`trailingComma: all`、printWidth 100（Markdown 120）、2 空格、LF
- ESLint flat config：`eslint.config.js`；`scripts/` 与 `astro-plugins/` 被 ignore（各自有独立风格）
- 提交前跑 `npm run check && npm run lint && npm test`

## Project rules (违反会被 review 打回)

- **组件层不得写死任何颜色**——只用语义 token（`--accent`、`--bg-primary`、`--rule-tick` …）。主题目录只放 token；组件 CSS 写死颜色会让换主题时渲染出错的配色
- **站点默认主题由 `src/consts.ts` 的 `DEFAULT_THEME_ID` 决定**——不是 manifest 字段，也不是扫描顺序；主题扫描顺序按 id 字典序（通用规则，无 per-id 特例）
- **文章目录永远不挤压正文宽度**——正文列固定 `--content-width`(740px) 居中，TOC 只能待在两侧空白区（≥1280px 左侧刻度栏 / <1280px 顶部折叠条）。曾因在 1100–1279px 把 TOC 塞进文章块当左列，正文被压到 508px 且右移 116px
- 新增/修改 token 时，`scripts/create-theme.mjs` 脚手架和 `docs/THEMING.md` 必须同步
- JetBrains Mono **只用于真实数据**（日期、计数、序号、刻度、代码）；中文界面一律无衬线
- 分类 = 青色通道（`--cat-*`），标签 = 绿色描边（`--tag-*`）；全站只保留两条语义色通道
- **版本号只有一个数据源**——只改 `package.json` 的 `version`。`src/consts.ts` 的 `SITE_VERSION` 从那里 import，页脚显示它；`tests/version.test.ts` 会校验它与 `CHANGELOG.md` 最新版本号一致。发版流程见 DEVELOP.md「版本号与发布流程」
- `@astrojs/markdown-remark` 在 Astro 7 里是 **peer dependency**，必须显式留在 `devDependencies`
- Markdown 管线走 `astro.config.mjs` 的 `markdown.processor: unified({ ... })`（旧的 `markdown.remarkPlugins` 顶层写法已废弃）
- 链接要走 `src/utils/path.ts` 的 `withBase`，不要手写 base 前缀
- **文章 slug 必须走 `src/utils/slug.ts` 的 `astroSlug()`**——Astro 7 用 github-slugger 生成内容路由（转小写 + 去标点 + 空格转连字符），文件名原样当 slug 用会跟真实路由对不上。`DrawThings完全使用指南.md` 的路由是 `/blog/drawthings完全使用指南/`，不是 `/blog/DrawThings完全使用指南/`。曾因此让 12 / 26 篇文章的搜索结果与 RSS 链接全部指向 404；postbuild 现在会用 `dist/blog/` 的真实路由反查校验，对不上就让构建失败

## Testing instructions

- 单元测试：Vitest，跑 `npm test`；新增行为在 `tests/` 下加 `*.test.ts`
- `npm run format:check` **有既存基线噪音**（Markdown 里刻意对齐的表格与行尾注释不合 Prettier）——只格式化自己动过的文件，别全量 `--write`
- 改了 markdown 处理器后，`.astro/data-store.json` 缓存**不会**自动失效：必须 `rm .astro/data-store.json` 再重启 dev server
- 窄屏验证用 iframe 量 `scrollWidth`（macOS headless Chrome 的 `--window-size` 在 <500px 时不可靠）

## PR & commit conventions

- **推 `main` 即部署**——`deploy.yml` 在 `push` 到 `main` 时触发部署；`test.yml` 同时跑在 push 与 PR 上。本仓库历史以直推 `main` 为主
- 需要 review 时从 `main` 切分支、开 PR（`gh pr create`）再合入 `main`
- Commit message：conventional commits（`feat:` / `fix:` / `docs:` / `refactor:`）
- 发版时打 annotated tag（`git tag -a v1.1.0 -m "..."`）并 `git push --tags`

## Security

- 不要提交密钥。注意 **`.env` 目前不在 `.gitignore` 里**——本地建 `.env` 前先自己加进 ignore，CI 侧密钥一律走 GitHub Actions secrets
- `scripts/vectorize-icon.mjs` 依赖 `sharp`，而 `sharp` **未列入 `package.json`**（只是 Astro 的传递依赖）——需要时临时 `npm i -D sharp`，用完卸掉
- `scripts/generate-og.mjs`（构建期叠加社交卡片计数）同样依赖 `sharp`。`sharp` 在 lockfile 里是 Astro 的 **optionalDependency**，`npm ci` 会装上；但它随时可能消失，所以脚本必须**优雅降级**：字体缺失 / sharp 不可用 / 渲染异常都只打警告并保留底板，绝不中断构建
