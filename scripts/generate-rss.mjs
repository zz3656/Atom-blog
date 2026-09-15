import { readFileSync, writeFileSync } from 'fs';
import { readdirSync } from 'fs';
import { join } from 'path';

function escapeXml(str) {
  var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
  return String(str).replace(/[&<>"']/g, function(c) { return map[c] || c; });
}

function parseFrontmatter(content) {
  var parts = content.split('---');
  if (parts.length < 3) return {};
  var fm = {};
  var lines = parts[1].split('\n');
  for (var i = 0; i < lines.length; i++) {
    var match = lines[i].match(/^(\w+):\s*(.+)$/);
    if (match) {
      var val = match[2].trim();
      if (val.indexOf('[') === 0 && val.lastIndexOf(']') === val.length - 1) {
        val = val.slice(1, -1).split(',').map(function(s) { return s.trim().replace(/^["']|["']$/g, ''); });
      } else if (val[0] === '"' && val[val.length - 1] === '"') {
        val = val.slice(1, -1);
      }
      fm[match[1]] = val;
    }
  }
  return fm;
}

var siteUrl = 'https://zz3656.github.io';
var repoName = 'Atom';
var prefix = repoName ? '/' + repoName : '';

// --- Generate RSS ---
var blogDir = 'src/content/blog';
var files = readdirSync(blogDir).filter(function(f) { return f.endsWith('.md'); });
var posts = files.map(function(f) {
  var content = readFileSync(join(blogDir, f), 'utf-8');
  var fm = parseFrontmatter(content);
  return {
    title: fm.title || '',
    description: fm.description || '',
    pubDate: new Date(fm.pubDate),
    updatedDate: fm.updatedDate ? new Date(fm.updatedDate) : null,
    slug: f.replace('.md', ''),
  };
}).sort(function(a, b) { return b.pubDate - a.pubDate; });

var items = posts.map(function(p) {
  var url = siteUrl + prefix + '/blog/' + p.slug + '/';
  var lastBuild = p.updatedDate ? '\n      <lastBuildDate>' + p.updatedDate.toUTCString() + '</lastBuildDate>' : '';
  return [
    '    <item>',
    '      <title>' + escapeXml(p.title) + '</title>',
    '      <link>' + url + '</link>',
    '      <guid>' + url + '</guid>',
    '      <pubDate>' + p.pubDate.toUTCString() + '</pubDate>',
    lastBuild,
    '      <description>' + escapeXml(p.description) + '</description>',
    '    </item>',
  ].join('\n');
}).join('\n');

var rss = [
  '<?xml version="1.0" encoding="UTF-8" ?>',
  '<rss version="2.0" xmlns:Atom="http://www.w3.org/2005/Atom">',
  '  <channel>',
  '    <title>Atom Blog</title>',
  '    <description>A modern, lightweight blog built with Astro</description>',
  '    <link>' + siteUrl + prefix + '/</link>',
  '    <Atom:link href="' + siteUrl + prefix + '/rss.xml" rel="self" type="application/rss+xml" />',
  items,
  '  </channel>',
  '</rss>',
].join('\n');

writeFileSync('dist/rss.xml', rss, 'utf-8');
console.log('RSS generated: dist/rss.xml');

// --- Generate Sitemap ---
var sitemapItems = [
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  '  <url><loc>' + siteUrl + prefix + '/</loc><priority>1.0</priority></url>',
  '  <url><loc>' + siteUrl + prefix + '/blog/</loc><priority>0.8</priority></url>',
  '  <url><loc>' + siteUrl + prefix + '/about/</loc><priority>0.7</priority></url>',
  '  <url><loc>' + siteUrl + prefix + '/404.html</loc><priority>0.1</priority></url>',
];

posts.forEach(function(p) {
  var url = siteUrl + prefix + '/blog/' + p.slug + '/';
  var lastmod = p.updatedDate ? p.updatedDate.toISOString().slice(0, 10) : p.pubDate.toISOString().slice(0, 10);
  sitemapItems.push('  <url><loc>' + url + '</loc><lastmod>' + lastmod + '</lastmod><priority>0.6</priority></url>');
});

sitemapItems.push('</urlset>');

writeFileSync('dist/sitemap.xml', sitemapItems.join('\n'), 'utf-8');
console.log('Sitemap generated: dist/sitemap.xml');
