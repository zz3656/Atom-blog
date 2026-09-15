import { defineConfig } from 'astro/config';

// 自动从 GitHub 仓库名获取 base 路径
const repoName = 'Atom-blog';
const base = `/${repoName}`;

export default defineConfig({
  site: `https://zz3656.github.io/${repoName}`,
  base,
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
