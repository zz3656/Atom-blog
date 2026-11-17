/**
 * 生成 public/js/app.js（esbuild 直接从 src/scripts/app.js 出产，压缩 + 校验）。
 *
 * 为什么源文件在 src/scripts/：public/ 下的文件会被 Astro 原样复制、不经过构建，
 * 所以"开发源"留在 src/，"构建产物"落在 public/js/，这样反复构建不会基于压缩结果再压。
 *
 * 为什么不再 copyFileSync 再原地压：
 *   1. 多一次全量拷贝纯属浪费；
 *   2. 在会改写权限位的文件系统上（如 fnOS 卷），Node 的 copy_file_range 会产出
 *      不可读文件，导致 esbuild 立刻读不了——直接出产就没有这个问题。
 *
 * 失败必须让构建失败：以前只 console.warn，会把未压缩甚至半写坏的 JS 发上线。
 */
import { build } from 'esbuild';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src', 'scripts', 'app.js');
const DST = join(ROOT, 'public', 'js', 'app.js');

if (!existsSync(SRC)) {
  console.error(`✗ 找不到源脚本：${relative(ROOT, SRC)}`);
  process.exit(1);
}

mkdirSync(dirname(DST), { recursive: true });

const before = statSync(SRC).size;

try {
  await build({
    entryPoints: [SRC],
    outfile: DST,
    bundle: true,
    minify: true,
    target: 'es2020',
    legalComments: 'none',
    logLevel: 'silent',
  });
} catch (err) {
  console.error('✗ app.js 压缩失败，构建中止：', err.message);
  process.exit(1);
}

const after = statSync(DST).size;
const pct = (((before - after) / before) * 100).toFixed(1);
console.log(`Minified app.js: ${before} → ${after} bytes (${pct}% smaller)`);
