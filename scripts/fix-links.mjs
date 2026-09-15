// Fix Astro's protocol-relative URL bug.
// When base='', Astro compiles href="/xxx" as href="//xxx" (protocol-relative).
// We need to restore them to href="/xxx" for root-hosted sites.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const distDir = './dist';
let fixed = 0;

function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  // href="//xxx" where xxx starts with a path segment (letter/digit + /) -> href="/xxx"
  // Also handles //blog/... //tag/... //category/... //2/... //3/... etc.
  content = content.replace(/href="\/\/([a-zA-Z0-9_\/\u4e00-\u9fff-]+)/g, (match, path) => {
    // Skip if it looks like a real protocol-relative domain (e.g. //example.com)
    if (path.match(/^[a-zA-Z0-9_-]+\.[a-zA-Z]{2,}/)) {
      return match; // keep as-is
    }
    fixed++;
    return `href="/${path}"`;
  });
  writeFileSync(filePath, content, 'utf-8');
}

function walk(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (entry !== '_astro' && entry !== '_assets') {
        walk(fullPath);
      }
    } else if (entry === 'index.html') {
      fixFile(fullPath);
    }
  }
}

walk(distDir);
console.log(`Fixed ${fixed} protocol-relative links.`);
