import { defineConfig } from 'astro/config';

// 部署目标: DEPLOY_TARGET=github → GitHub Pages, DEPLOY_TARGET=cf → Cloudflare Pages
const isGitHubPages = process.env.DEPLOY_TARGET === 'github';

// 自定义域名 (Cloudflare Pages 优先)
const CUSTOM_DOMAIN = 'https://atom.inte8.top';
// GitHub 仓库名 (用于 GitHub Pages)
const REPO_NAME = 'Atom-blog';

const base = isGitHubPages ? `/${REPO_NAME}` : '/';
const site = isGitHubPages
  ? `${CUSTOM_DOMAIN.replace('atom.inte8.top', 'zz3656.github.io')}/${REPO_NAME}`
  : CUSTOM_DOMAIN;

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
