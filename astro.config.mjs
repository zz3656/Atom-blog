import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkImgLazy from './astro-plugins/remark-img-lazy.mjs';
import rehypeTableScroll from './astro-plugins/rehype-table-scroll.mjs';
import themeLoader from './astro-plugins/theme-loader.mjs';
import { loadPosts } from './scripts/lib/blog-posts.mjs';

// 部署目标自动检测:
//   DEPLOY_TARGET=github → GitHub Pages（站点在 /<repo>/ 子路径下）
//   DEPLOY_TARGET=cf     → Cloudflare Pages / 自定义域名（根路径，无前缀）
//   不设置                → 若有 PAGES_ENV 则按 GitHub Pages 处理
const isGitHubPages = process.env.DEPLOY_TARGET === 'github' || process.env.PAGES_ENV === 'true';

const repoName = process.env.REPO_NAME || 'Atom';
const githubUser = process.env.GITHUB_USER || 'zz3656';
const cfDomain = process.env.CF_DOMAIN || 'atom.inte8.top';

// base 与 site 各管一件事，不要互相包含：
//   site 只写 origin（不含子路径），base 单独给子路径。
// 历史坑：site 里也拼了 `/<repo>`，加上 sitemap 内部 `new URL(base, site)`
// 就变成 /Atom//Atom/ 双前缀——只改一边才不出错，太脆。
const base = isGitHubPages ? `/${repoName}` : '';
const site = isGitHubPages ? `https://${githubUser}.github.io` : `https://${cfDomain}`;

if (!process.env.GITHUB_USER && isGitHubPages) {
  console.warn(
    '[astro.config] 未设置 GITHUB_USER，canonical / sitemap / OG 将指向默认维护者的域名；' +
      'fork 后请在 CI 里传入 GITHUB_USER（GitHub Actions 会自动提供 github.repository_owner）。',
  );
}
if (!process.env.CF_DOMAIN && !isGitHubPages) {
  console.warn(
    '[astro.config] 未设置 CF_DOMAIN，站点地址回落到默认域名；' +
      '自定义域名部署请设置 CF_DOMAIN=https://your.domain。',
  );
}

// sitemap 的 lastmod：文章页用 updatedDate ?? pubDate，其余页面用最新文章日期。
// 之前是靠 postbuild 正则往 XML 里插 <lastmod>（还插在 <changefreq> 之后，顺序不合 XSD），
// 现在直接交给集成序列化，顺带把那支脆弱的脚本删掉。
const posts = loadPosts();
const postLastmod = new Map(
  posts.map((p) => [`/blog/${p.slug}/`, (p.updatedDate ?? p.pubDate).toISOString()]),
);
const newestPostDate = posts.length
  ? new Date(Math.max(...posts.map((p) => p.pubDate.getTime()))).toISOString()
  : new Date().toISOString();

function lastmodFor(url) {
  const pathname = new URL(url).pathname;
  const relativePath =
    base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
  return postLastmod.get(relativePath) ?? postLastmod.get(`${relativePath}/`) ?? newestPostDate;
}

export default defineConfig({
  integrations: [
    sitemap({
      changefreq: 'weekly',
      // 404 页面不该进 sitemap
      filter: (page) => !page.includes('/404'),
      serialize: (item) => ({ ...item, lastmod: lastmodFor(item.url) }),
    }),
  ],
  site,
  base,
  // 统一带尾斜杠：内链（path.ts）、canonical、sitemap 三者口径一致，少一次 301
  trailingSlash: 'always',
  // HTML 压缩优化
  build: {
    compressHTML: true,
    // 项目所有 CSS 都内联到 HTML，省一次 HTTP 请求（适合博客这种小项目）
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [themeLoader()],
    // 说明：CSS 已由 build.inlineStylesheets:'always' 全量内联进 HTML，
    // 因此不再设置 vite.build.cssCodeSplit（两者互相抵消，纯属噪音）。
  },

  markdown: {
    // Astro 5+ 的写法：统一走 unified() 处理器
    // （旧的 markdown.remarkPlugins 顶层写法已废弃）
    processor: unified({
      remarkPlugins: [remarkImgLazy],
      rehypePlugins: [rehypeTableScroll],
    }),
    shikiConfig: {
      // Shiki 输出两套颜色，CSS 变量 --shiki-dark 控制切换（见 src/styles/_modules/_post.css）
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
