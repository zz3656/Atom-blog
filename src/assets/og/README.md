# 社交分享卡片（og.jpg）资产说明

社交卡片分**底板**和**计数行**两部分：底板是静态资产，计数行在构建期实时叠加。

## 文件分工

| 文件 | 角色 | 何时生成 |
|---|---|---|
| `public/og.jpg` | **卡片底板**（1200×630）：AI 生成的 CRT 背景氛围 + 终端窗口外壳 + logo + 站名/副标题/提示符等静态文案。**不含文章计数** | 手工资产，提交进仓库 |
| `src/assets/og/fonts/JetBrainsMono-Regular.woff` | 计数行的等宽字体（JetBrains Mono，OFL-1.1，许可见同目录 `OFL.txt`） | 手工资产，提交进仓库 |
| `dist/og.jpg` | **最终产物**：底板 + 实时计数（`25 POSTS · 08 CATS · 58 TAGS`） | 每次 `npm run build` 由 `scripts/generate-og.mjs` 生成 |

`og:image` / `twitter:image` 指向站点根的 `/og.jpg`，构建后即 `dist/og.jpg`。

## 为什么计数要构建期生成

计数如果烤进图片里，文章一多就会失真（曾经卡在 `25 POSTS` 不动）。
`scripts/generate-og.mjs` 在 `postbuild` 阶段统计 `src/content/blog/`（排除 `draft`），
把文章数 / 分类数 / 标签数实时叠加到底板上——站点数字从此和内容集合同步，不会漂移。

## 计数行的渲染方式

- 用 **sharp 的 `text` 选项**（底层走 Pango）渲染，`fontfile` 直接指向仓库内的字体文件
  → 字体被内嵌，**不依赖构建机装没装字体，也不依赖网络**。CI 与本地出图一致。
- 用 **Pango markup**（`<span foreground="#00e88f">`）指定磷光绿，不用在组件层写死颜色。
- 排版常数（`DPI` / `INK_RIGHT` / `INK_TOP`）在脚本顶部，标定依据是底板标题栏的
  13px JetBrains Mono：渲染出的墨迹高度 11px、墨迹上沿与底板 host 文本对齐（同基线）、
  墨迹右沿钉在 x=1163（标题栏内容盒右缘 1166 减去右侧字距）。

## 失败策略

社交卡片是装饰，不是构建产物的前置条件。脚本在字体缺失、sharp 不可用、
渲染异常等任何情况下都只打警告并**保留底板**，绝不中断构建。

## 重新生成底板

底板是用无头 Chrome 渲染 HTML 截图得到的（背景氛围由本机 Draw Things 生成，
界面元素与文字全部代码排版）。要改底板设计时：

1. 用 Draw Things 生成新的背景氛围图；
2. 用 Chrome 渲染卡片 HTML（**JetBrains Mono 以 base64 内联为 `@font-face`**——
   不内联的话无头 Chrome 拿不到 Google Fonts，会回落成系统等宽体）；
3. 标题栏右侧**不要写计数**，留空给构建期叠加；
4. 输出 1200×630 JPEG 覆盖 `public/og.jpg`，并同步复核脚本里的排版常数。

> 历史坑：第一版卡片的等宽字其实不是 JetBrains Mono，而是无头 Chrome 回落出来的系统字体。
> 现在底板把字体内联进 HTML，计数行走 Pango 内嵌字体，两边都是同一款字体。
