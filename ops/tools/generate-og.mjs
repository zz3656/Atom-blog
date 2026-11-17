/**
 * generate-og.mjs — 构建期生成社交分享卡片（dist/og.jpg）
 *
 * 为什么需要它？
 *   卡片上那行 `25 POSTS · 08 CATS · 58 TAGS` 如果烤进图片里，文章一多就会失真。
 *   本脚本在 postbuild 阶段统计内容集合，把**实时计数**叠加到卡片底板上。
 *
 * 分工：
 *   public/og.jpg                      卡片底板（背景 + 界面元素 + 静态文案，**不含计数**）
 *   src/assets/og/fonts/JetBrainsMono-Regular.woff
 *                                       计数行用的等宽字体（JetBrains Mono，OFL-1.1，许可见同目录 OFL.txt）
 *   dist/og.jpg                        最终产物：底板 + 实时计数
 *
 * 渲染方式：
 *   sharp 的 `text` 选项走 Pango，`fontfile` 指向仓库内的字体文件 → 字体被内嵌，
 *   **不依赖构建机装没装字体，也不依赖网络**。CI 与本地出图一致。
 *
 * 失败策略：
 *   任何一步出错都只打警告并原样保留底板（dist/og.jpg = 底板），
 *   绝不中断构建 —— 社交卡片是装饰，不是构建产物的前置条件。
 *
 * 依赖：sharp（未列入 package.json，是 Astro 的 optionalDependency，npm ci 会装）
 */
import { readFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const ROOT = process.cwd();
const PLATE = join(ROOT, 'public/og.jpg');
const FONT = join(ROOT, 'src/assets/og/fonts/JetBrainsMono-Regular.woff');
const OUT = join(ROOT, 'dist/og.jpg');
const BLOG_DIR = join(ROOT, 'src/content/blog');

// --- 排版标定常数（底板标题栏：13px JetBrains Mono）------------------------------
// DPI 80 → 墨迹高度 11px，与底板 host 文本（Chrome 渲染的同一字体同一字号）一致
const DPI = 80;
// 计数行墨迹右边界。标题栏内容盒右缘在 x=1166（frame 内缩 18 + padding 16），
// 减去字体的右侧边距后落在 1163
const INK_RIGHT = 1163;
// 计数行墨迹上边界，与底板 host 文本墨迹上沿（y=33）对齐 = 同一基线
const INK_TOP = 33;

function warn(msg) {
  console.warn(`[og] ${msg}`);
}

/**
 * 极简 frontmatter 解析（与 scripts/generate-rss.mjs 同款规则）
 * 只取本脚本需要的字段：category / tags / draft
 */
function parseFrontmatter(content) {
  const parts = content.split('---');
  if (parts.length < 3) return {};
  const fm = {};
  for (const line of parts[1].split('\n')) {
    const m = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    // 去掉行尾注释（draft: false   # 草稿，构建时过滤）
    val = val.replace(/\s+#.*$/, '').trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    fm[key] = val;
  }
  return fm;
}

function collectMarkdown(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...collectMarkdown(full));
    else if (name.endsWith('.md') || name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

/** 统计已发布文章数、分类数、标签数 */
function collectStats() {
  const posts = collectMarkdown(BLOG_DIR);
  const cats = new Set();
  const tags = new Set();
  let published = 0;
  for (const file of posts) {
    const fm = parseFrontmatter(readFileSync(file, 'utf-8'));
    if (fm.draft === true || fm.draft === 'true') continue;
    published++;
    if (fm.category && typeof fm.category === 'string') cats.add(fm.category);
    if (Array.isArray(fm.tags)) {
      for (const t of fm.tags) if (t) tags.add(t);
    }
  }
  return { posts: published, cats: cats.size, tags: tags.size };
}

/** 终端风格：两位补零 */
const pad2 = (n) => String(n).padStart(2, '0');

/** Pango markup 里 < > & 需要转义 */
function escapeMarkup(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** 量 PNG 的不透明像素包围盒（sharp 的 text 输出会裁到墨迹，但仍实测一次） */
async function measureInk(buf, sharp) {
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let minX = Infinity;
  let maxX = -1;
  let minY = Infinity;
  let maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] > 40) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { minX, maxX, minY, maxY };
}

async function main() {
  if (!existsSync(PLATE)) {
    warn(`底板缺失，跳过：${PLATE}`);
    return;
  }
  if (!existsSync(FONT)) {
    warn(`字体缺失，跳过：${FONT}`);
    return;
  }
  if (!existsSync(join(ROOT, 'dist'))) {
    try {
      mkdirSync(join(ROOT, 'dist'), { recursive: true });
    } catch {
      warn('构建产物目录缺失，跳过');
      return;
    }
  }

  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    warn('sharp 不可用（Astro 的 optionalDependency），跳过计数叠加，保留底板');
    return;
  }

  const { posts, cats, tags } = collectStats();
  const text = `${pad2(posts)} POSTS · ${pad2(cats)} CATS · ${pad2(tags)} TAGS`;

  const layer = await sharp({
    text: {
      text: `<span foreground="#00e88f">${escapeMarkup(text)}</span>`,
      font: 'JetBrainsMono',
      fontfile: FONT,
      dpi: DPI,
      rgba: true,
    },
  })
    .png()
    .toBuffer();

  const ink = await measureInk(layer, sharp);
  if (!ink) {
    warn('计数行渲染为空，保留底板');
    return;
  }

  const left = INK_RIGHT - ink.maxX;
  const top = INK_TOP - ink.minY;

  await sharp(PLATE)
    .composite([{ input: layer, left, top }])
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .toFile(OUT);

  console.log(
    `[og] ${text} → ${OUT.replace(ROOT + '/', '')}（底板 ${pad2(posts)} 计数行已叠加）`,
  );
}

try {
  await main();
} catch (err) {
  warn(`生成失败，保留底板：${err && err.message ? err.message : err}`);
}
