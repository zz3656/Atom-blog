import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://zz3656.github.io/Atom-blog',
  base: '/Atom-blog',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
