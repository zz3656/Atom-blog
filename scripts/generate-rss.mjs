/**
 * 生成 RSS（dist/rss.xml）—— postbuild 阶段运行（此时 dist/ 已构建完成）。
 *
 * 文章清单与 frontmatter 解析统一走 scripts/lib/blog-posts.mjs。
 *
 * 规范要点（旧实现的四个毛病，均已修）：
 *   1. `<lastBuildDate>` 只能出现在 channel 层，不能放进 `<item>`（item 用 `<pubDate>`）
 *   2. `content:encoded` 里塞原始 Markdown，阅读器会原样显示 `##`/代码围栏
 *      → 改为从构建产物 dist/blog/<slug>/index.html 抽出渲染后的正文 HTML
 *   3. 缺 `<language>` 与 channel 级 `<lastBuildDate>`
 *   4. 正文含 `]]>` 会产出非法 XML → 拆开 CDATA
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadPosts } from './lib/blog-posts.mjs';

function escapeXml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
  return String(str).replace(/[&<>"']/g, (c) => map[c] || c);
}

/** CDATA 里出现 `]]>` 会终止区块，按规范拆成两个 CDATA */
function cdata(html) {
  return `<![CDATA[${String(html).replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

const distDir = join(process.cwd(), 'dist');

if (!existsSync(distDir)) {
  console.error('✗ 找不到 dist/ —— 本脚本是 postbuild 步骤，请先执行 `npm run build`。');
  process.exit(1);
}

const indexHtml = (() => {
  try {
    return readFileSync(join(distDir, 'index.html'), 'utf-8');
  } catch {
    return '';
  }
})();

// 站点 URL：优先环境变量，其次从首页 og:url 提取（已含 base）
const siteUrl = (() => {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  const m = indexHtml.match(/property="og:url"[^>]*content="([^"]+)"/);
  return m ? m[1] : 'https://zz3656.github.io';
})().replace(/\/$/, '');

// 站点标题 / 描述 / 语言：都从构建产物取，保证与页面一致
const siteTitle =
  process.env.SITE_TITLE ||
  indexHtml.match(/property="og:site_name"[^>]*content="([^"]+)"/)?.[1] ||
  'Atom Blog';
const siteDescription =
  indexHtml.match(/name="description"[^>]*content="([^"]+)"/)?.[1] || 'A modern, lightweight blog built with Astro';
const siteLang = indexHtml.match(/<html[^>]*lang="([^"]+)"/)?.[1] || 'zh-CN';

/**
 * 从构建好的文章页里取出正文 HTML（<div class="post-content">…</div>）。
 * 用简单的 div 配对扫描，不引入 XML/DOM 依赖。
 */
function extractArticleHtml(slug) {
  const file = join(distDir, 'blog', slug, 'index.html');
  if (!existsSync(file)) return '';
  const html = readFileSync(file, 'utf-8');
  const openTag = '<div class="post-content">';
  const start = html.indexOf(openTag);
  if (start === -1) return '';
  let i = start + openTag.length;
  let depth = 1;
  const openRe = /<div\b/gi;
  const closeRe = /<\/div>/gi;
  while (depth > 0 && i < html.length) {
    closeRe.lastIndex = i;
    openRe.lastIndex = i;
    const nextClose = closeRe.exec(html);
    if (!nextClose) break;
    openRe.lastIndex = i;
    const nextOpen = openRe.exec(html);
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth += 1;
      i = nextOpen.index + 4;
      continue;
    }
    depth -= 1;
    i = nextClose.index + 6;
    if (depth === 0) {
      return html.slice(start + openTag.length, nextClose.index).trim();
    }
  }
  return '';
}

/** 正文里的站内相对链接要补成绝对地址，否则阅读器里点不开 */
function absolutise(html) {
  return html
    .replace(/\s(src|href)="\/(?!\/)/g, (_m, attr) => ` ${attr}="${siteUrl}/`)
    .replace(/<script\b[\s\S]*?<\/script>/gi, '');
}

const posts = loadPosts();
const newest = posts.length ? new Date(Math.max(...posts.map((p) => p.pubDate.getTime()))) : new Date();

const items = posts
  .map((p) => {
    const url = `${siteUrl}/blog/${p.slug}/`;
    const articleHtml = absolutise(extractArticleHtml(p.slug));
    return [
      '    <item>',
      `      <title>${escapeXml(p.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${p.pubDate.toUTCString()}</pubDate>`,
      `      <description>${escapeXml(p.description)}</description>`,
      p.category ? `      <category>${escapeXml(p.category)}</category>` : '',
      p.tags && p.tags.length > 0
        ? `      <category>${p.tags.map(escapeXml).join('</category>\n      <category>')}</category>`
        : '',
      articleHtml ? `      <content:encoded>${cdata(articleHtml)}</content:encoded>` : '',
      '    </item>',
    ]
      .filter(Boolean)
      .join('\n');
  })
  .join('\n');

const rss = [
  '<?xml version="1.0" encoding="UTF-8" ?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
  '  <channel>',
  `    <title>${escapeXml(siteTitle)}</title>`,
  `    <description>${escapeXml(siteDescription)}</description>`,
  `    <link>${siteUrl}/</link>`,
  `    <language>${escapeXml(siteLang)}</language>`,
  `    <lastBuildDate>${newest.toUTCString()}</lastBuildDate>`,
  `    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />`,
  items,
  '  </channel>',
  '</rss>',
].join('\n');

writeFileSync(join(distDir, 'rss.xml'), rss, 'utf-8');
console.log(`RSS generated: dist/rss.xml (${posts.length} item(s), 正文为渲染后 HTML)`);
