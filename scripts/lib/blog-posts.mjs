/**
 * 共享的 Markdown 文章读取：frontmatter 解析、草稿过滤、搜索索引构建。
 *
 * 为什么单独抽一层：搜索索引、RSS、sitemap 以前各自把 src/content/blog/*.md
 * 读一遍、各自写一套 frontmatter 正则。规则一旦漂移，就会出现
 * 「页面渲染出来了，但搜索索引 / RSS 里没有这篇」的静默缺漏。
 *
 * 解析范围保持与历史实现一致（只认单行 `key: value` 与内联数组 `[a, b]`），
 * 目的是先把「谁读内容」统一起来；块状 YAML 列表的支持留待后续单独改并补测试。
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { markdownToPlainText, stripFrontmatter } from '../../src/utils/markdown-strip.ts';
import { astroSlug } from '../../src/utils/slug.ts';

export const BLOG_DIR = 'src/content/blog';

/**
 * 极简 frontmatter 解析：只认单行 key: value 与内联数组。
 * @param {string} content
 * @returns {Record<string, string | string[]>}
 */
export function parseFrontmatter(content) {
  const parts = String(content).split('---');
  if (parts.length < 3) return {};
  const fm = {};
  const lines = parts[1].split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!match) continue;
    let val = match[2].trim();
    // 块状列表：
    //   tags:
    //     - a
    //     - b
    if (val === '') {
      const list = [];
      while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) {
        list.push(lines[i + 1].replace(/^\s*-\s+/, '').replace(/^["']|["']$/g, '').trim());
        i += 1;
      }
      if (list.length > 0) {
        fm[match[1]] = list;
        continue;
      }
    }
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    fm[match[1]] = val;
  }
  return fm;
}

/**
 * @typedef {object} BlogPost
 * @property {string} title
 * @property {string} description
 * @property {Date} pubDate
 * @property {Date|null} [updatedDate]
 * @property {string} slug
 * @property {string} category
 * @property {string[]} tags
 * @property {boolean} [draft]
 * @property {string} content
 */

/**
 * 读取全部已发布文章，按发布日期倒序。
 * @param {string} [blogDir] 文章目录（相对项目根）
 * @returns {BlogPost[]}
 */
export function loadPosts(blogDir = BLOG_DIR) {
  const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));
  return files
    .map((f) => {
      const fullContent = readFileSync(join(blogDir, f), 'utf-8');
      const fm = parseFrontmatter(fullContent);
      return {
        title: fm.title || '',
        description: fm.description || '',
        pubDate: new Date(fm.pubDate),
        updatedDate: fm.updatedDate ? new Date(fm.updatedDate) : null,
        // slug 必须与 Astro 的内容路由逐字一致（github-slugger 规则），
        // 文件名原样当 slug 会让中文/大驼峰文章的索引与 RSS 指向 404
        slug: astroSlug(f.replace(/\.md$/, '')),
        category: fm.category || '',
        tags: fm.tags || [],
        draft: fm.draft === true || fm.draft === 'true',
        content: stripFrontmatter(fullContent),
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => b.pubDate - a.pubDate);
}

/**
 * 构建站内搜索索引（客户端只做子串匹配，因此预先把可搜索文本拼好并小写）。
 * @param {BlogPost[]} posts
 * @returns {Array<{slug: string, title: string, description: string, pubDate: string, content: string, categories: string, tags: string[]}>}
 */
export function buildSearchIndex(posts) {
  return posts.map((p) => {
    const bodyText = markdownToPlainText(p.content || '');
    return {
      slug: p.slug,
      title: p.title,
      description: p.description || '',
      pubDate: p.pubDate.toISOString(),
      content: `${p.title} ${p.description} ${bodyText}`.toLowerCase(),
      categories: (p.category || '').toLowerCase(),
      tags: (p.tags || []).map((t) => String(t).toLowerCase()),
    };
  });
}
