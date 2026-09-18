import { defineConfig } from 'astro/config';

// 部署目标自动检测:
//   DEPLOY_TARGET=github → GitHub Pages（需要仓库名前缀）
//   DEPLOY_TARGET=cf    → Cloudflare Pages（根路径，无前缀）
//   不设置               → 自动检测：如果有 PAGES_ENV 则视为 GitHub Pages
const isGitHubPages = process.env.DEPLOY_TARGET === 'github' || 
                       process.env.PAGES_ENV === 'true';

// GitHub Pages 自动从仓库名推导 base 路径
// 例如: zz3656/Atom-blog → base='/Atom-blog'
const REPO_NAME = process.env.REPO_NAME || 'Atom';

// Cloudflare Pages 使用根路径
const base = isGitHubPages ? `/${REPO_NAME}` : '';

// site: 部署目标的实际域名
const site = isGitHubPages
  ? `https://${process.env.GITHUB_USER || 'zz3656'}.github.io/${REPO_NAME}`
  : `https://${process.env.CF_DOMAIN || 'atom.inte8.top'}`;

export default defineConfig({
  site,
  base,
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
