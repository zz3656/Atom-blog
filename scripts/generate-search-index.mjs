/**
 * 生成站内搜索索引 → public/_assets/search-index.json
 *
 * 必须跑在 `astro build` **之前**（package.json 的 prebuild）：
 * Astro 只在 build 期间复制一次 public/，postbuild 再写 public/ 就永远进不了 dist/。
 * 历史 bug：索引在 postbuild 生成，导致新文章要等到「下一次构建」才能被搜到。
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildSearchIndex, loadPosts } from './lib/blog-posts.mjs';

const OUT_DIR = join(process.cwd(), 'public', '_assets');
const OUT_FILE = join(OUT_DIR, 'search-index.json');

const posts = loadPosts();
const index = buildSearchIndex(posts);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(index), 'utf-8');

console.log(`Search index generated: ${index.length} post(s) → public/_assets/search-index.json`);
