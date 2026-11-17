/**
 * 断言「发出去的搜索索引」与「实际构建出的文章页」一致。
 *
 * 用于 CI 与本地验收：索引缺文章 / 多文章都算失败，避免再出现
 * 「页面能打开但搜不到」的静默降级。
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const BLOG_DIR = join(DIST, 'blog');
const INDEX = join(DIST, '_assets', 'search-index.json');

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

if (!existsSync(INDEX)) fail(`找不到 ${INDEX}（prebuild 没有生成索引？）`);
if (!existsSync(BLOG_DIR)) fail(`找不到 ${BLOG_DIR}（astro build 没有产出文章页？）`);

const index = JSON.parse(readFileSync(INDEX, 'utf-8'));
const indexed = new Set(index.map((p) => p.slug));
const built = new Set(
  readdirSync(BLOG_DIR)
    .filter((name) => statSync(join(BLOG_DIR, name)).isDirectory())
    .map((name) => name),
);

const missing = [...built].filter((slug) => !indexed.has(slug)).sort();
const extra = [...indexed].filter((slug) => !built.has(slug)).sort();

if (missing.length || extra.length) {
  if (missing.length) console.error(`✗ 索引缺少文章：${missing.join(', ')}`);
  if (extra.length) console.error(`✗ 索引含不存在的文章：${extra.join(', ')}`);
  process.exit(1);
}

if (index.length === 0) fail('索引为空');

console.log(`✓ 搜索索引与构建产物一致（${index.length} 篇）`);
