/**
 * 构建产物链接校验：把 dist 里每份 HTML 的站内链接映射回真实文件，缺一个就失败。
 *
 * 为什么需要它：base='/Atom' 时，靠 `withBase()` / `baseAssetsPath()` 拼路径很容易
 * 拼成 `/Atom/Atom/blog/` 这种双前缀——构建照样成功、CI 照样绿，问题要等人点开站点
 * 才发现（线上整站导航 404 就是这么来的）。这里用"链接对应文件是否存在"兜底。
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = join(process.cwd(), 'dist');

if (!existsSync(DIST)) {
  console.error('✗ 找不到 dist/ —— 请先 npm run build');
  process.exit(1);
}

/** 从首页 canonical 反推部署 base（根路径部署时为空串） */
function detectBase() {
  const html = readFileSync(join(DIST, 'index.html'), 'utf-8');
  const m = html.match(/rel="canonical" href="[a-z]+:\/\/[^/"]+(\/[^"]*)"/i);
  if (!m) return '';
  const path = m[1];
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkHtml(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** 站内路径 → dist 里应当存在的文件（先剥掉部署 base） */
function resolveTarget(urlPath, base) {
  const clean = urlPath.split('#')[0].split('?')[0];
  const decoded = decodeURIComponent(clean);
  const withoutBase = base && decoded.startsWith(`${base}/`) ? decoded.slice(base.length) : decoded;
  const rel = withoutBase.replace(/^\//, '');
  const candidates =
    rel === '' || withoutBase.endsWith('/') ? [join(DIST, rel, 'index.html')] : [join(DIST, rel)];
  return candidates.find((c) => existsSync(c));
}

const base = detectBase();
const files = walkHtml(DIST);
const missing = [];
const doubled = [];

for (const file of files) {
  const html = readFileSync(file, 'utf-8');
  const page = '/' + relative(DIST, file).split('\\').join('/');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const url = m[1];
    if (url.startsWith('//')) continue; // 协议相对，外链
    if (base && url.startsWith(`${base}${base}/`)) {
      doubled.push(`${page} → ${url}`);
      continue;
    }
    if (!resolveTarget(url, base)) missing.push(`${page} → ${url}`);
  }
}

const uniq = (arr) => [...new Set(arr)];
const dupes = uniq(doubled);
const gaps = uniq(missing);

if (dupes.length) {
  console.error(`✗ 检测到 base 重复拼接（${dupes.length} 处）：`);
  for (const d of dupes.slice(0, 10)) console.error('   ' + d);
}
if (gaps.length) {
  console.error(`✗ 站内链接指向不存在的产物（${gaps.length} 处）：`);
  for (const g of gaps.slice(0, 10)) console.error('   ' + g);
}
if (dupes.length || gaps.length) process.exit(1);

console.log(`✓ 链接校验通过：${files.length} 份 HTML，base='${base || '/'}'，站内链接全部命中产物`);
