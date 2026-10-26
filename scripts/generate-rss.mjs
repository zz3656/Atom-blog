import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { markdownToPlainText, stripFrontmatter } from '../src/utils/markdown-strip.ts';
import { astroSlug } from '../src/utils/slug.ts';

function escapeXml(str) {
  var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
  return String(str).replace(/[&<>"']/g, function (c) {
    return map[c] || c;
  });
}

function parseFrontmatter(content) {
  var parts = content.split('---');
  if (parts.length < 3) return {};
  var fm = {};
  var lines = parts[1].split('\n');
  for (var i = 0; i < lines.length; i++) {
    var match = lines[i].match(/^(\w[\w\-]*):\s*(.*)$/);
    if (match) {
      var val = match[2].trim();
      if (val.indexOf('[') === 0 && val.lastIndexOf(']') === val.length - 1) {
        val = val
          .slice(1, -1)
          .split(',')
          .map(function (s) {
            return s.trim().replace(/^["']|["']$/g, '');
          })
          .filter(function (s) {
            return s;
          });
      } else if (val[0] === '"' && val[val.length - 1] === '"') {
        val = val.slice(1, -1);
      }
      fm[match[1]] = val;
    }
  }
  return fm;
}

// 自动从 dist/_astro/ 目录获取 base 路径（Astro 构建产物）
var distDir = join(process.cwd(), 'dist');
var astroFiles = readdirSync(distDir).filter(function (f) {
  return f.startsWith('_astro');
});
var base = '/';
if (astroFiles.length > 0) {
  // 通过 dist/index.html 提取 base 路径
  try {
    var indexHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');
    var hrefMatch = indexHtml.match(/href="\/([^\/"']*\/_astro)/);
    if (hrefMatch) {
      base = '/' + hrefMatch[1].replace('/_astro', '');
    }
  } catch (e) {
    // fallback to /
  }
}

// 自动从 dist/index.html 提取站点 URL（与 astro.config.mjs 保持一致）
var siteUrl = process.env.SITE_URL;
if (!siteUrl) {
  try {
    var indexHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');
    var ogMatch = indexHtml.match(/property="og:url"[^>]*content="([^"]+)"/);
    if (ogMatch) {
      siteUrl = ogMatch[1];
    }
  } catch (e) {
    // fallback to default
  }
}
if (!siteUrl) siteUrl = 'https://zz3656.github.io';
// 重要: siteUrl 已包含 base (从 og:url 提取的完整 URL)，不要再叠加 prefix。
// 之前的 bug: siteUrl + prefix 导致 /Atom//Atom/ 双前缀。
var sitePath = new URL(siteUrl).pathname.replace(/\/$/, '');

// --- Generate RSS + Search Index ---
var blogDir = 'src/content/blog';
var files = readdirSync(blogDir).filter(function (f) {
  return f.endsWith('.md');
});
var posts = files
  .map(function (f) {
    var fullContent = readFileSync(join(blogDir, f), 'utf-8');
    var fm = parseFrontmatter(fullContent);
    // 提取正文（复用 src/utils/markdown-strip.ts 的实现）
    var body = stripFrontmatter(fullContent);
    return {
      title: fm.title || '',
      description: fm.description || '',
      pubDate: new Date(fm.pubDate),
      updatedDate: fm.updatedDate ? new Date(fm.updatedDate) : null,
      // slug 必须走 astroSlug：文件名原样当 slug 用会跟 Astro 的真实路由对不上
      // （'DrawThings完全使用指南' 的路由其实是 'drawthings完全使用指南'）
      slug: astroSlug(f.replace(/\.md$/, '')),
      file: f,
      category: fm.category || '',
      tags: fm.tags || [],
      draft: fm.draft === true || fm.draft === 'true',
      content: body,
    };
  })
  .filter(function (p) {
    return !p.draft;
  })
  .sort(function (a, b) {
    return b.pubDate - a.pubDate;
  });

var items = posts
  .map(function (p) {
    var url = siteUrl.replace(/\/$/, '') + '/blog/' + p.slug + '/';
    var lastBuild = p.updatedDate
      ? '\n      <lastBuildDate>' + p.updatedDate.toUTCString() + '</lastBuildDate>'
      : '';
    // 为 RSS 阅读器提供全文（包装在 CDATA 中避免 XML 转义问题）
    var fullContent = p.content
      ? '\n      <content:encoded><![CDATA[' + p.content + ']]></content:encoded>'
      : '';
    return [
      '    <item>',
      '      <title>' + escapeXml(p.title) + '</title>',
      '      <link>' + url + '</link>',
      '      <guid>' + url + '</guid>',
      '      <pubDate>' + p.pubDate.toUTCString() + '</pubDate>',
      lastBuild,
      '      <description>' + escapeXml(p.description) + '</description>',
      p.category ? '      <category>' + escapeXml(p.category) + '</category>' : '',
      p.tags && p.tags.length > 0
        ? '      <category>' +
          p.tags.map(escapeXml).join('</category>\n      <category>') +
          '</category>'
        : '',
      fullContent,
      '    </item>',
    ]
      .filter(Boolean)
      .join('\n');
  })
  .join('\n');

var rss = [
  '<?xml version="1.0" encoding="UTF-8" ?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
  '  <channel>',
  '    <title>' + (process.env.SITE_TITLE || 'Atom Blog') + '</title>',
  '    <description>' +
    escapeXml(process.env.SITE_DESCRIPTION || 'A modern, lightweight blog built with Astro') +
    '</description>',
  '    <link>' + siteUrl.replace(/\/$/, '') + '/</link>',
  '    <atom:link href="' + siteUrl.replace(/\/$/, '') + '/rss.xml" rel="self" type="application/rss+xml" />',
  items,
  '  </channel>',
  '</rss>',
].join('\n');

writeFileSync('dist/rss.xml', rss, 'utf-8');
console.log('RSS generated: dist/rss.xml');

// --- Generate Search Index ---
// 从正文提取纯文本用于搜索（去除 Markdown 标记，函数从 src/utils/markdown-strip.ts 共享）
var searchIndex = posts.map(function (p) {
  var bodyText = markdownToPlainText(p.content || '');
  return {
    slug: p.slug,
    title: p.title,
    description: p.description || '',
    pubDate: p.pubDate.toISOString(),
    content: (p.title + ' ' + p.description + ' ' + bodyText).toLowerCase(),
    categories: (p.category || '').toLowerCase(),
    tags: (p.tags || []).map(function (t) {
      return t.toLowerCase();
    }),
  };
});

/**
 * 校验：算出来的 slug 必须对应构建产物里真实存在的文章路由。
 *
 * 依据是 dist/blog/<slug>/index.html 里的 BlogPosting 结构化数据——
 * 分页页（/blog/2/、/blog/3/）是 og:type=website，不会被误认成文章。
 * 对不上就直接让构建失败：宁可构建红，也别上线一批 404 链接。
 */
function verifyRoutesAgainstBuild(posts) {
  var blogDist = join(distDir, 'blog');
  if (!existsSync(blogDist)) {
    console.warn('未找到 dist/blog，跳过路由校验');
    return;
  }
  var postRoutes = new Set();
  var entries = readdirSync(blogDist, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    if (!entries[i].isDirectory()) continue;
    var page = join(blogDist, entries[i].name, 'index.html');
    if (!existsSync(page)) continue;
    if (readFileSync(page, 'utf-8').indexOf('"@type":"BlogPosting"') !== -1) {
      postRoutes.add(entries[i].name);
    }
  }
  var problems = [];
  var claimed = new Set();
  for (var j = 0; j < posts.length; j++) {
    if (postRoutes.has(posts[j].slug)) {
      claimed.add(posts[j].slug);
    } else {
      problems.push(
        '  ✗ ' + posts[j].slug + '（源文件 ' + posts[j].file + '）在 dist/blog/ 里没有对应的文章页',
      );
    }
  }
  postRoutes.forEach(function (route) {
    if (!claimed.has(route)) {
      problems.push('  ✗ 路由 ' + route + ' 没有出现在搜索索引里');
    }
  });
  if (problems.length > 0) {
    throw new Error('文章 slug 与构建路由不一致：\n' + problems.join('\n'));
  }
  console.log('路由校验通过：' + postRoutes.size + ' 篇文章的 slug 与 dist/blog/ 完全一致');
}

verifyRoutesAgainstBuild(posts);

// 索引要同时写进两处：
//   dist/_assets/  —— 真正被部署的那份
//   public/_assets/ —— 提交进仓库、供 dev server 使用的那份
// 以前只写 public/，而 Astro 在构建开始时就把 public/ 拷进了 dist/，
// postbuild 阶段再写 public/ 只会让线上的索引比源码旧一个版本。
var indexJson = JSON.stringify(searchIndex);
var publicAssetsDir = join(process.cwd(), 'public', '_assets');
var distAssetsDir = join(distDir, '_assets');
if (!existsSync(publicAssetsDir)) {
  mkdirSync(publicAssetsDir, { recursive: true });
}
if (!existsSync(distAssetsDir)) {
  mkdirSync(distAssetsDir, { recursive: true });
}
writeFileSync(join(distAssetsDir, 'search-index.json'), indexJson);
writeFileSync(join(publicAssetsDir, 'search-index.json'), indexJson);
console.log(
  'Search index generated: dist/_assets/search-index.json + public/_assets/search-index.json (' +
    searchIndex.length +
    ' posts)',
);
