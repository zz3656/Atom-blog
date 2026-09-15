import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://zz3656.github.io/Atom',
  base: '/Atom',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
