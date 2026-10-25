#!/usr/bin/env node
/**
 * Atom Blog — 主题脚手架
 *
 * 用法:
 *   node scripts/create-theme.mjs <theme-id> [--name "Display Name"] [--author "Author"] [--description "..."] [--no-dark]
 *
 * 示例:
 *   node scripts/create-theme.mjs ocean
 *   node scripts/create-theme.mjs ocean --name "Ocean" --author "Alice" --description "海洋蓝主题" --no-dark
 *
 * 行为:
 *   1. 校验 theme-id 合法性（仅 [a-z0-9_-]，最长 32 字符）
 *   2. 校验目录不存在（防止覆盖）
 *   3. 生成 src/themes/<id>/{manifest.json, light.css, dark.css}
 *   4. dark.css 默认生成；若传 --no-dark 则只生成 light.css 并把 modes 改为 ["light"]
 *   5. CSS 模板包含全部必需 token（与 docs/THEMING.md 一致）
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const THEMES_DIR = join(ROOT, 'src', 'themes');

const SAFE_ID = /^[a-z0-9][a-z0-9_-]{0,31}$/;
const COLORS = {
  indigo: '#6366f1',
  cyan: '#00e5ff',
  emerald: '#10b981',
  rose: '#f43f5e',
  amber: '#f59e0b',
  violet: '#8b5cf6',
  sky: '#0ea5e9',
};

function parseArgs(argv) {
  const out = { _: [], noDark: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--no-dark') out.noDark = true;
    else if (a === '--name') out.name = argv[++i];
    else if (a === '--author') out.author = argv[++i];
    else if (a === '--description') out.description = argv[++i];
    else if (a === '--accent') out.accent = argv[++i];
    else if (a === '--help' || a === '-h') out.help = true;
    else out._.push(a);
  }
  return out;
}

function help() {
  console.log(`Atom Blog — 主题脚手架

用法:
  node scripts/create-theme.mjs <theme-id> [options]

选项:
  --name <string>        主题显示名（默认: <theme-id>）
  --author <string>       作者（默认: unknown）
  --description <string>  简介（默认: 自动生成）
  --accent <hex>           主色 HEX（默认: #6366f1）
  --no-dark                只生成 light 模式（单模式主题）

theme-id 规则:
  仅允许 [a-z0-9_-]，首字符必须为字母或数字，最长 32 字符
`);
}

function pickReadableTextColor(bgHex) {
  // 简单亮度判断，返回黑/白文字色
  const hex = bgHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1a1d23' : '#ffffff';
}

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function generateLightCss(themeId, accent) {
  return `/* ${themeId} Theme — Light Mode
 * 在此自定义浅色模式的 CSS token。
 * 完整 token 清单与规则见 docs/THEMING.md。
 *
 * 选择器约定: html[data-theme="${themeId}"][data-mode="light"]
 */

html[data-theme='${themeId}'][data-mode='light'] {
  /* Backgrounds */
  --bg-primary: #f0f2f5;
  --bg-secondary: #e8eaed;
  --bg-card: #ffffff;
  --bg-card-hover: #f8f9fc;
  --bg-inline-code: ${hexToRgba(accent, 0.06)};

  /* Text colors */
  --text-primary: #1a1d23;
  --text-secondary: #4a5568;
  --text-muted: #718096;
  --text-bright: #1a202c;

  /* Borders */
  --border-color: ${hexToRgba(accent, 0.12)};
  --border-light: ${hexToRgba(accent, 0.06)};
  --border-glow: ${hexToRgba(accent, 0.25)};

  /* Accent colors */
  --accent: ${accent};
  --accent-hover: ${accent};
  --accent-secondary: ${accent};
  --accent-gradient: linear-gradient(135deg, ${accent}, ${accent});
  --accent-glow: ${hexToRgba(accent, 0.08)};
  --accent-glow-strong: ${hexToRgba(accent, 0.15)};
  --glow-secondary: ${hexToRgba(accent, 0.06)};
  --purple-glow: ${hexToRgba(accent, 0.06)}; /* 旧别名，保留兼容 */

  /* Tags */
  --tag-bg: ${hexToRgba(accent, 0.06)};
  --tag-text: ${accent};
  --tag-border: ${hexToRgba(accent, 0.15)};
  --tag-active-bg: ${hexToRgba(accent, 0.12)};

  /* Categories */
  --cat-bg: ${hexToRgba(accent, 0.06)};
  --cat-text: ${accent};
  --cat-border: ${hexToRgba(accent, 0.15)};
  --cat-active-bg: ${hexToRgba(accent, 0.12)};

  /* Semantic colors */
  --success: #10b981;
  --warning: #f59e0b;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.08);
  --shadow-glow: 0 4px 20px ${hexToRgba(accent, 0.08)}, 0 1px 3px rgba(0, 0, 0, 0.04);

  /* 语义表面 token（必需，详见 docs/THEMING.md） */
  --on-accent: ${pickReadableTextColor(accent)};
  --header-bg: rgba(240, 242, 245, 0.86);
  --panel-bg: #f4f6f8;
  --code-bg: #eff1f3;
  --grid-line: rgba(26, 29, 35, 0.035);
  --highlight: ${hexToRgba(accent, 0.16)};
  --ambient-glow: ${hexToRgba(accent, 0.05)};
  --rule-tick: rgba(26, 29, 35, 0.22);
  --rule-tick-strong: ${hexToRgba(accent, 0.55)};
  --focus-ring: ${accent};
}
`;
}

function generateDarkCss(themeId, accent) {
  return `/* ${themeId} Theme — Dark Mode
 * 在此自定义深色模式的 CSS token。
 * 完整 token 清单与规则见 docs/THEMING.md。
 *
 * 选择器约定: html[data-theme="${themeId}"][data-mode="dark"]
 */

html[data-theme='${themeId}'][data-mode='dark'] {
  /* Backgrounds */
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-card: #16161f;
  --bg-card-hover: #1a1a25;
  --bg-inline-code: ${hexToRgba(accent, 0.06)};

  /* Text colors */
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-bright: #f8fafc;

  /* Borders */
  --border-color: ${hexToRgba(accent, 0.15)};
  --border-light: ${hexToRgba(accent, 0.08)};
  --border-glow: ${hexToRgba(accent, 0.4)};

  /* Accent colors */
  --accent: ${accent};
  --accent-hover: ${accent};
  --accent-secondary: ${accent};
  --accent-gradient: linear-gradient(135deg, ${accent}, ${accent});
  --accent-glow: ${hexToRgba(accent, 0.15)};
  --accent-glow-strong: ${hexToRgba(accent, 0.3)};
  --glow-secondary: ${hexToRgba(accent, 0.15)};
  --purple-glow: ${hexToRgba(accent, 0.15)}; /* 旧别名，保留兼容 */

  /* Tags */
  --tag-bg: ${hexToRgba(accent, 0.08)};
  --tag-text: ${accent};
  --tag-border: ${hexToRgba(accent, 0.2)};
  --tag-active-bg: ${hexToRgba(accent, 0.15)};

  /* Categories */
  --cat-bg: ${hexToRgba(accent, 0.08)};
  --cat-text: ${accent};
  --cat-border: ${hexToRgba(accent, 0.2)};
  --cat-active-bg: ${hexToRgba(accent, 0.15)};

  /* Semantic colors */
  --success: #10b981;
  --warning: #f59e0b;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.55);
  --shadow-glow: 0 0 20px ${hexToRgba(accent, 0.15)};

  /* 语义表面 token（必需，详见 docs/THEMING.md） */
  --on-accent: ${pickReadableTextColor(accent)};
  --header-bg: rgba(10, 10, 15, 0.86);
  --panel-bg: #1a1a25;
  --code-bg: #16161f;
  --grid-line: rgba(226, 232, 240, 0.028);
  --highlight: ${hexToRgba(accent, 0.22)};
  --ambient-glow: ${hexToRgba(accent, 0.05)};
  --rule-tick: rgba(226, 232, 240, 0.2);
  --rule-tick-strong: ${hexToRgba(accent, 0.6)};
  --focus-ring: ${accent};
}
`;
}

function generateManifest({ id, name, author, description, noDark }) {
  const modes = noDark ? ['light'] : ['light', 'dark'];
  return JSON.stringify(
    {
      id,
      name,
      author,
      version: '1.0.0',
      description,
      modes,
      preview: '',
    },
    null,
    2,
  );
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || args._.length === 0) {
    help();
    process.exit(args.help ? 0 : 1);
  }
  const id = args._[0];
  if (!SAFE_ID.test(id)) {
    console.error(`❌ 无效的 theme id: "${id}"`);
    console.error(`   必须匹配 ${SAFE_ID}`);
    console.error(`   仅允许小写字母、数字、下划线、连字符；首字符必须为字母或数字；最长 32 字符`);
    process.exit(1);
  }
  const themeDir = join(THEMES_DIR, id);
  if (existsSync(themeDir)) {
    console.error(`❌ 主题已存在: ${themeDir}`);
    console.error(`   如要覆盖请先手动删除目录。`);
    process.exit(1);
  }
  const name = args.name || id;
  const author = args.author || 'unknown';
  const description =
    args.description || `自定义主题 ${name}（使用 scripts/create-theme.mjs 生成）`;
  const accent = args.accent || COLORS.indigo;

  mkdirSync(themeDir, { recursive: true });
  writeFileSync(
    join(themeDir, 'manifest.json'),
    generateManifest({ id, name, author, description, noDark: args.noDark }) + '\n',
    'utf-8',
  );
  writeFileSync(join(themeDir, 'light.css'), generateLightCss(id, accent), 'utf-8');
  if (!args.noDark) {
    writeFileSync(join(themeDir, 'dark.css'), generateDarkCss(id, accent), 'utf-8');
  }

  console.log(`✅ 主题已生成: src/themes/${id}/`);
  console.log(
    `   ├── manifest.json    (id: ${id}, modes: ${args.noDark ? '["light"]' : '["light","dark"]'})`,
  );
  console.log(`   ├── light.css`);
  if (!args.noDark) console.log(`   └── dark.css`);
  console.log(``);
  console.log(`下一步:`);
  console.log(`  1. 编辑 src/themes/${id}/light.css 与 dark.css，自定义你的 token`);
  console.log(`  2. 运行 npm run dev — 主题会自动出现在右上角菜单中`);
  console.log(
    `  3. 无需修改 global.css：theme-loader 会在构建时自动把新主题加入 src/generated/themes.css`,
  );
}

main();
