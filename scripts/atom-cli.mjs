#!/usr/bin/env node
/**
 * atom-cli.mjs — Atom Blog 本地构建工具
 *
 * 类似 Hexo / Hugo 的 CLI 工作流：
 *   atom new <title>   → 在 src/content/blog/ 创建新文章
 *   atom list          → 列出所有文章
 *   atom build         → 构建 + 推送 dist 到 Atom-blog 仓库
 *
 * 用法:
 *   node atom-cli.mjs new "我的文章"
 *   node atom-cli.mjs new "我的文章" -c "技术笔记" -t "Astro,Web"
 *   node atom-cli.mjs list
 *   node atom-cli.mjs build
 */

import { readdir, readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { basename, join, dirname, relative, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'src', 'content', 'blog');
const BLOG_REPO_DIR = join(ROOT, '..', 'Atom-blog');

const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

// ─── Helpers ──────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .replace(/^(\d)/, 'n$1');
}

function today() {
  return new Date().toISOString().split('T')[0];
}

async function readAllBlogPosts() {
  try {
    const entries = await readdir(CONTENT_DIR);
    const files = entries.filter((f) => f.endsWith('.md'));
    const posts = await Promise.all(
      files.map((file) => {
        const content = readFile(join(CONTENT_DIR, file), 'utf-8');
        return parseFrontmatterPromise(file, content);
      })
    );
    return posts;
  } catch (err) {
    console.error(`  ❌ 无法读取文章目录: ${err.message}`);
    process.exit(1);
  }
}

function parseFrontmatterPromise(file, contentPromise) {
  return contentPromise.then((content) => {
    const fm = parseFrontmatter(content);
    return { ...fm, file };
  });
}

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return {};
  const end = content.indexOf('---', 3);
  if (end === -1) return {};
  const raw = content.slice(3, end).trim();
  const fm = {};
  for (const line of raw.split('\n')) {
    const m = line.match(/^(\w[\w\-]*):\s*(.*)$/);
    if (m) {
      let v = m[2].trim();
      // 解析数组
      if (v.startsWith('[') && v.endsWith(']')) {
        v = v.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      }
      // 解析日期
      else if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        v = v;
      } else {
        v = v.replace(/^["']|["']$/g, '');
      }
      fm[m[1]] = v;
    }
  }
  return fm;
}

// ─── Commands ─────────────────────────────────────────────────

async function cmdNew(args) {
  const options = parseOptions(args);

  // 1. 获取标题
  let title = options._[0];
  if (!title) {
    title = await ask('📝 文章标题: ');
    if (!title) {
      console.log('  ❌ 标题不能为空');
      rl.close();
      return;
    }
  }

  // 2. 交互填写 frontmatter
  const pubDate = options.d || options.date || today();
  const category = options.c || options.category;
  const tagsStr = options.t || options.tags;
  const tags = tagsStr
    ? tagsStr.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const description = options.de || options.description;
  const heroImage = options.i || options.image;
  const reward = options.r || options.reward;
  const draft = options.D || options.draft;

  // 3. 生成 slug 和文件名
  const safeSlug = slugify(title);
  const fileName = `${safeSlug}.md`;
  const filePath = join(CONTENT_DIR, fileName);

  // 4. 检查冲突
  if (await fileExists(filePath)) {
    console.log(`  ⚠️  文件已存在: ${fileName}`);
    const overwrite = await ask('  是否覆盖? [y/N]: ');
    if (!overwrite.toLowerCase().startsWith('y')) {
      console.log('  ❌ 已取消');
      rl.close();
      return;
    }
  }

  // 5. 生成 frontmatter
  const desc = description || `这是一篇关于「${title}」的文章。`;
  const tagsLine = tags.length > 0 ? `tags: [${tags.join(', ')}]` : '';
  const fmLines = [
    '---',
    `title: ${title}`,
    `description: "${desc}"`,
    `pubDate: ${pubDate}`,
  ];
  if (category) fmLines.push(`category: ${category}`);
  if (tagsLine) fmLines.push(tagsLine);
  if (heroImage) fmLines.push(`heroImage: ${heroImage}`);
  fmLines.push('---', '');
  if (draft) fmLines.push('>( 本文是草稿，尚未发布 )\n');
  const fm = fmLines.join('\n');

  // 6. 写入文件
  await writeFile(filePath, fm, 'utf-8');
  const relativePath = relative(ROOT, filePath);

  console.log(`\n  ✅ 文章已创建`);
  console.log(`     📂 ${relativePath}`);
  console.log(`     📝 ${title}`);
  console.log(`     📅 ${pubDate}`);
  if (category) console.log(`     📁 ${category}`);
  if (tags.length) console.log(`     🏷️ ${tags.join(', ')}`);
  console.log(`\n  💡 编辑文章:  nano ${relativePath}`);
  console.log(`  💡 完成后:    atom build`);
  rl.close();
}

async function cmdList(_args) {
  console.log('\n📚 所有文章\n' + '─'.repeat(60));

  const posts = await readAllBlogPosts();
  if (posts.length === 0) {
    console.log('  暂无文章');
    rl.close();
    return;
  }

  // 按发布日期降序
  posts.sort((a, b) => (b.pubDate || '').localeCompare(a.pubDate || ''));

  posts.forEach((p, i) => {
    const status = p.description?.includes('尚未发布') ? ' 📌' : '';
    console.log(`  ${String(i + 1).padStart(3, ' ')}. ${p.title}`);
    console.log(`       📅 ${p.pubDate || '-'}  📁 ${p.category || '未分类'}  🏷️ ${p.tags?.length ? p.tags.join(', ') : '-'}`);
    console.log(`       📂 ${p.file}`);
  });

  console.log(`\n  共 ${posts.length} 篇文章\n`);
  rl.close();
}

async function cmdBuild(_args) {
  console.log('\n🔨 构建 Atom Blog...\n');

  // 1. 检查 Atom-blog 目录是否存在
  if (!await dirExists(BLOG_REPO_DIR)) {
    console.error('  ❌ 未找到 Atom-blog 目录');
    console.error(`     预期路径: ${BLOG_REPO_DIR}`);
    console.error('     请将 Atom-blog (上线仓库) 放在 Atom (源码仓库) 的父目录下');
    rl.close();
    return;
  }

  // 2. 检查 Atom-blog 是否是 git 仓库
  if (!await dirExists(join(BLOG_REPO_DIR, '.git'))) {
    console.error('  ❌ Atom-blog 不是 git 仓库');
    rl.close();
    return;
  }

  // 3. 同步 src/ 文件
  console.log('  📦 同步源文件...');
  await syncSourceToBlogRepo();

  // 4. 在 Atom-blog 目录构建
  console.log('  🏗️  执行构建...');
  try {
    execSync(`cd "${BLOG_REPO_DIR}" && npx astro build`, { stdio: 'inherit', cwd: ROOT });
  } catch (err) {
    console.error('  ❌ 构建失败');
    rl.close();
    return;
  }

  // 5. 提交 + 推送
  console.log('  🚀 推送到 Atom-blog...');
  try {
    execSync(`cd "${BLOG_REPO_DIR}" && git add -A && git commit -m "Auto build: $(date +%Y-%m-%d\\ %H:%M)" && git push origin main`, {
      stdio: 'inherit',
      cwd: ROOT,
    });
  } catch (err) {
    console.error('  ⚠️  推送失败，请手动提交');
    console.error(`     cd "${BLOG_REPO_DIR}" && git add -A && git push origin main`);
    rl.close();
    return;
  }

  console.log('\n  ✅ 完成！博客已更新');
  rl.close();
}

// ─── File sync ────────────────────────────────────────────────

async function syncSourceToBlogRepo() {
  const syncFiles = [
    'src/layouts/BaseLayout.astro',
    'src/layouts/BlogPost.astro',
    'src/components/Header.astro',
    'src/components/Footer.astro',
    'src/components/PostCard.astro',
    'src/components/FormattedDate.astro',
    'src/styles/global.css',
    'src/consts.ts',
    'src/content/config.ts',
    'src/env.d.ts',
    'src/pages/index.astro',
    'src/pages/about.astro',
    'src/pages/404.astro',
    'src/pages/blog/index.astro',
    'src/pages/blog/[...slug].astro',
    'src/pages/categories/index.astro',
    'src/pages/category/[...category].astro',
    'src/pages/tags/index.astro',
    'src/pages/tag/[...tag].astro',
    'src/pages/[...page].astro',
  ];

  for (const rel of syncFiles) {
    const src = join(ROOT, rel);
    const dst = join(BLOG_REPO_DIR, rel);
    if (await fileExists(src)) {
      const dstDir = dirname(dst);
      await mkdir(dstDir, { recursive: true });
      await copyFile(src, dst);
    }
  }

  // 同步 .astro 文件（自动发现新页面）
  const pagesDir = join(ROOT, 'src', 'pages');
  if (await dirExists(pagesDir)) {
    const pageFiles = await findFilesRecursively(pagesDir);
    for (const pageFile of pageFiles) {
      const rel = relative(ROOT, pageFile);
      const dst = join(BLOG_REPO_DIR, rel);
      await mkdir(dirname(dst), { recursive: true });
      await copyFile(pageFile, dst);
    }
  }

  // 同步文章 .md 文件
  const blogDir = join(ROOT, 'src', 'content', 'blog');
  if (await dirExists(blogDir)) {
    const entries = await readdir(blogDir);
    for (const entry of entries) {
      if (entry.endsWith('.md')) {
        const src = join(blogDir, entry);
        const dst = join(BLOG_REPO_DIR, 'src', 'content', 'blog', entry);
        await copyFile(src, dst);
      }
    }
  }
}

// ─── Options parser ───────────────────────────────────────────

function parseOptions(args) {
  const opts = { _: [], d: null, date: null, c: null, category: null, t: null, tags: null, de: null, description: null, i: null, image: null, r: null, reward: null, D: null, draft: null };
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg === '-d' || arg === '--date') { opts.date = args[++i]; i++; }
    else if (arg === '-c' || arg === '--category') { opts.category = args[++i]; i++; }
    else if (arg === '-t' || arg === '--tags') { opts.tags = args[++i]; i++; }
    else if (arg === '-de' || arg === '--description') { opts.description = args[++i]; i++; }
    else if (arg === '-i' || arg === '--image') { opts.image = args[++i]; i++; }
    else if (arg === '-r' || arg === '--reward') { opts.reward = args[++i]; i++; }
    else if (arg === '-D' || arg === '--draft') { opts.draft = true; i++; }
    else { opts._.push(arg); i++; }
  }
  return opts;
}

// ─── File utils ───────────────────────────────────────────────

async function fileExists(path) {
  try { await readFile(path, 'utf-8'); return true; } catch { return false; }
}

async function dirExists(path) {
  try {
    const stat = await (await import('node:fs/promises')).stat(path);
    return stat.isDirectory();
  } catch { return false; }
}

async function findFilesRecursively(dir) {
  const fs = await import('node:fs/promises');
  const files = [];
  const entries = await fs.readdir(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      files.push(...await findFilesRecursively(fullPath));
    } else if (entry.endsWith('.astro')) {
      files.push(fullPath);
    }
  }
  return files;
}

// ─── Entry point ──────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === '--help' || cmd === '-h') {
    printUsage();
    return;
  }

  switch (cmd) {
    case 'new':
      await cmdNew(args.slice(1));
      break;
    case 'list':
      await cmdList(args.slice(1));
      break;
    case 'build':
      await cmdBuild(args.slice(1));
      break;
    default:
      console.log(`  ❌ 未知命令: ${cmd}`);
      console.log('  💡 运行 atom --help 查看用法\n');
      printUsage();
      break;
  }
}

function printUsage() {
  console.log(`
🤖 Atom Blog CLI — 本地构建工具

  用法:
    node atom-cli.mjs <command> [args]

  命令:
    new <标题>              创建新文章（交互式填写 frontmatter）
    new <标题> -c <分类>    指定分类
    new <标题> -t <标签>    指定标签（逗号分隔）
    new <标题> -d 日期      指定发布日期
    new <标题> -i <图片>    指定封面图
    new <标题> --draft      创建为草稿

    list                    列出所有文章

    build                   同步源文件 → 构建 → 推送

    help                    显示帮助信息

  示例:
    node atom-cli.mjs new "Astro 指南"
    node atom-cli.mjs new "Astro 指南" -c "技术教程" -t "Astro,Web"
    node atom-cli.mjs list
    node atom-cli.mjs build
`);
}

main().catch((err) => {
  console.error('❌ 错误:', err.message);
  process.exit(1);
});
