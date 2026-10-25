#!/usr/bin/env node
/**
 * convert-hexo.mjs
 *
 * 将 Hexo 源文件 (zz3656.github.io/source/_posts/*.md) 转换为 Astro 格式
 * 输出到 Atom/src/content/blog/
 *
 * 转换规则（依据 hexo-theme-matery 官方 Front-matter 文档）：
 *   https://github.com/blinkfox/hexo-theme-matery
 *
 *   1. 提取 Hexo 官方 frontmatter 字段：
 *      title, date, categories, tags → 映射到 Astro 格式
 *      description 为空时 → 用正文第一段自动生成（matery 的 summary 字段）
 *   2. 来源可能有两种图片字段：
 *      img: /source/images/xxx.jpg  (matery 官方 img 字段)
 *      cover: /medias/featureimages/X.jpg (matery 的 cover 字段)
 *      top_img: (常见但不在官方文档中) → 统一映射为 heroImage
 *   3. 丢弃 matery 主题专用字段（不在 Astro 中使用）:
 *      top, hide, password, toc, mathjax, keywords, reprintPolicy,
 *      coverImg, author, swiper_index, top_group_index, background,
 *      updated, comments, toc_number, toc_style_simple, copyright 系列,
 *      highlight_shrink, aside, ai, _img, on, mg
 *   4. 正文开头与 title 重复的 H1 行 → 删除
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { basename, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HEXO_POSTS_DIR = join(__dirname, '../../zz3656.github.io/source/_posts');
// 基于脚本自身位置解析，仓库改名（Atom-blog → Atom）后依然指向本仓库的文章目录
const ATOM_BLOG_DIR = join(__dirname, '../src/content/blog');

// ─── Hexo frontmatter 解析 ────────────────────────────────────
function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('---', 3);
  if (end === -1) return null;

  const raw = content.slice(3, end).trim();
  const body = content.slice(end + 3).trim();
  const fields = {};

  let key = null;
  let buf = '';
  const lines = raw.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // YAML list item
    if (/^  *- /.test(line) || /^- /.test(line)) {
      if (key) {
        const item = line.replace(/^  *- |^- /, '').trim();
        if (!Array.isArray(fields[key])) fields[key] = [];
        fields[key].push(item);
      }
      continue;
    }

    // Save previous field
    if (key !== null) {
      const trimmed = buf.trim();
      if (trimmed) {
        fields[key] = trimmed;
      }
    }

    // New key — support inline array: tags: [a, b, c]
    const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)/);
    if (m) {
      key = m[1];
      const val = m[2].trim();
      // Inline array [...]
      if (val.startsWith('[') && val.endsWith(']')) {
        const inner = val.slice(1, -1);
        fields[key] = inner
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        key = null; // consumed
      } else {
        buf = val || '';
      }
    } else {
      buf = '';
    }
  }

  // Last field
  if (key !== null) {
    const trimmed = buf.trim();
    if (trimmed) fields[key] = trimmed;
  }

  return { fields, body };
}

// ─── 从正文提取 description ────────────────────────────────────
function extractDescription(body) {
  const lines = body.split('\n');
  let sentences = [];

  let inBlockquote = true; // start collecting blockquote lines
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (/^#{1,6}\s/.test(t)) continue;
    // Skip image links at top
    if (/^!\[.*\]\(/.test(t)) continue;
    // Skip image links in list format
    if (/^<img /i.test(t)) continue;
    // blockquote lines at top
    if (t.startsWith('> ') || t.startsWith('>')) {
      const text = t.replace(/^>\s?/, '').trim();
      if (text && text !== '---') {
        sentences.push(text);
      }
      continue;
    }
    // First non-heading non-blank non-image non-quote line
    if (t === '---') break; // stop at content separator
    sentences.push(t);
    break;
  }

  let desc = sentences.join(' ');
  if (desc.length > 160) desc = desc.slice(0, 157) + '...';
  return desc || '暂无描述';
}

// ─── 清理正文 ──────────────────────────────────────────────────
function cleanBody(body, title) {
  const lines = body.split('\n');
  const result = [];
  let i = 0;

  // Skip leading blank lines
  while (i < lines.length && !lines[i].trim()) i++;

  // Check if first non-blank line is H1 duplicating title
  if (i < lines.length) {
    const h1Match = lines[i].match(/^#\s+(.+)$/);
    if (h1Match) {
      const h1Text = h1Match[1].trim().replace(/\s+/g, ' ');
      if (h1Text === title.replace(/\s+/g, ' ')) {
        i++;
        // Skip blank lines after the H1
        while (i < lines.length && !lines[i].trim()) i++;
      }
    }
  }

  // Collect rest
  for (; i < lines.length; i++) {
    result.push(lines[i]);
  }

  return result.join('\n').replace(/^\n+|\n+$/g, '');
}

// ─── YAML 安全字符串格式化 ─────────────────────────────────
// 如果值包含特殊 YAML 字符（*: & ! > | ' " # , ? % - [ ] { } @ ` *），
// 必须用双引号包裹，并对内部双引号做转义
function yamlSafe(val) {
  const s = String(val).trim();
  // 不需要引号的情况：纯数字、true/false/null、空值
  if (!s || /^(true|false|null|yes|no|on|off)\s*$/i.test(s)) return s;
  if (/^\d+(\.\d+)?$/.test(s)) return `"${s}"`;
  // 需要引号的情况
  if (/[*:&!>'"#?,\[\]{}@`|\n\r]/.test(s) || s.startsWith(' ') || s.endsWith(' ')) {
    return `"${s.replace(/"/g, '\\"')}"`;
  }
  return s;
}

// ─── 构建 Astro frontmatter ────────────────────────────────────
function buildAstroFrontmatter(fields, body) {
  const lines = [];

  // title (required)
  if (fields.title) lines.push(`title: ${yamlSafe(fields.title)}`);

  // description
  let desc = fields.description || '';
  if (!desc) desc = extractDescription(body);
  lines.push(`description: ${yamlSafe(desc)}`);

  // pubDate
  if (fields.date) {
    const m = String(fields.date).match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) lines.push(`pubDate: ${m[1]}`);
  }

  // category
  if (fields.categories) {
    let cat;
    if (Array.isArray(fields.categories)) {
      cat = (fields.categories[0] || '').trim();
    } else {
      cat = String(fields.categories).trim();
    }
    if (cat) lines.push(`category: ${cat}`);
  }

  // tags
  if (fields.tags) {
    let tags;
    if (Array.isArray(fields.tags)) {
      tags = fields.tags.map((t) => String(t).trim()).filter(Boolean);
    } else {
      tags = [String(fields.tags).trim()];
    }
    if (tags.length) lines.push(`tags: [${tags.join(', ')}]`);
  }

  // heroImage (cover / top_img)
  let img = fields.cover || fields.top_img || fields.heroImage || '';
  if (img) {
    img = String(img).replace(/^\/medias\/featureimages\//, '/images/');
    lines.push(`heroImage: ${img}`);
  }

  return lines.join('\n');
}

// ─── 主流程 ────────────────────────────────────────────────────
async function convert() {
  const files = await readdir(HEXO_POSTS_DIR);
  const mdFiles = files.filter((f) => f.endsWith('.md'));

  console.log(`找到 ${mdFiles.length} 篇 Hexo 文章，开始转换...\n`);

  await mkdir(ATOM_BLOG_DIR, { recursive: true });

  let ok = 0,
    skip = 0;

  for (const file of mdFiles) {
    const inPath = join(HEXO_POSTS_DIR, file);
    const content = await readFile(inPath, 'utf-8');

    const parsed = parseFrontmatter(content);
    if (!parsed || !parsed.fields.title) {
      console.warn(`⚠️  跳过: ${file}`);
      skip++;
      continue;
    }

    const fm = buildAstroFrontmatter(parsed.fields, parsed.body);
    const clean = cleanBody(parsed.body, parsed.fields.title);
    const out = `---\n${fm}\n---\n\n${clean}\n`;

    await writeFile(join(ATOM_BLOG_DIR, file), out, 'utf-8');
    console.log(`✅ ${file}`);
    ok++;
  }

  console.log(`\n========== 转换完成 ==========`);
  console.log(`成功: ${ok} 篇  |  跳过: ${skip} 篇`);
  console.log(`输出: ${ATOM_BLOG_DIR}`);
}

convert().catch((err) => {
  console.error(err);
  process.exit(1);
});
