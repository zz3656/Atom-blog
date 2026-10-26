// 用文章的 updatedDate 替换 sitemap 中博客文章的 lastmod
// 默认 sitemap 集成使用构建时间作为 lastmod，不准确

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { readdirSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { astroSlug } from '../src/utils/slug.ts';

const distDir = join(process.cwd(), 'dist');
const blogDir = join(process.cwd(), 'src', 'content', 'blog');

/**
 * 收集所有文章的 ISO 日期字符串（updatedDate 优先，回退到 pubDate）
 */
async function collectArticleDates() {
  if (!existsSync(blogDir)) return {};
  const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));
  const articles = {};
  for (const file of files) {
    const content = await readFile(join(blogDir, file), 'utf-8');
    // slug 走 astroSlug：文件名原样当 slug 用，跟 Astro 的真实路由对不上
    const slug = astroSlug(file.replace(/\.md$/, ''));
    const fmMatch = content.match(/^---([\s\S]*?)---/);
    if (!fmMatch) continue;
    const fm = fmMatch[1];
    const updatedMatch = fm.match(/^updatedDate:\s*(.+)$/m);
    const pubMatch = fm.match(/^pubDate:\s*(.+)$/m);
    const dateStr = updatedMatch ? updatedMatch[1].trim() : pubMatch ? pubMatch[1].trim() : null;
    if (dateStr) {
      articles[slug] = new Date(dateStr).toISOString();
    }
  }
  return articles;
}

/**
 * 为 sitemap 中每个 /blog/<slug>/ 插入 <lastmod>
 *
 * 匹配方式：先把 <loc> 里的百分号编码解码，再跟文章的 slug 比对。
 * 早先直接拿未编码的 slug 去拼正则，中文 slug 全部匹配不上，
 * 29 条 blog URL 里只有 9 条（纯 ASCII 的那些）能拿到 lastmod。
 */
function injectLastmod(content, articles) {
  let added = 0;
  const updated = content.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
    const locMatch = block.match(/<loc>([^<]*)<\/loc>/);
    if (!locMatch) return block;
    if (block.includes('<lastmod>')) return block;
    let decoded;
    try {
      decoded = decodeURIComponent(locMatch[1]);
    } catch {
      decoded = locMatch[1];
    }
    const slugMatch = decoded.match(/\/blog\/([^/]+)\/?$/);
    if (!slugMatch) return block;
    const isoDate = articles[slugMatch[1]];
    if (!isoDate) return block;
    added++;
    return block.replace('</url>', `<lastmod>${isoDate}</lastmod></url>`);
  });
  return { content: updated, added };
}

async function main() {
  // 1. 读取文章日期
  const articles = await collectArticleDates();
  console.log(`Loaded ${Object.keys(articles).length} article dates`);

  // 2. 读取 sitemap
  const sitemapPath = join(distDir, 'sitemap-0.xml');
  if (!existsSync(sitemapPath)) {
    console.log('No sitemap-0.xml found, skipping');
    return;
  }

  const content = readFileSync(sitemapPath, 'utf-8');
  const { content: newContent, added } = injectLastmod(content, articles);

  if (added > 0) {
    writeFileSync(sitemapPath, newContent, 'utf-8');
  }
  console.log(`Added ${added} lastmod entries to sitemap`);
}

main().catch((err) => {
  console.error('fix-sitemap failed:', err);
  process.exit(1);
});
