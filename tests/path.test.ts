import { describe, it, expect } from 'vitest';
import {
  blogPostUrl,
  blogListUrl,
  getCategoryUrl,
  getTagUrl,
  categoriesUrl,
  tagsUrl,
  rootPath,
  aboutUrl,
  rssUrl,
  baseAssetsPath,
  joinBase,
  absoluteUrl,
  stripBase,
} from '../src/utils/path';

/**
 * Vitest 在 Node 下运行时 import.meta.env.BASE_URL 默认为 '/'，
 * 因此 path.ts 内部会走"根路径"分支。下面覆盖所有 helper 函数，
 * 确保根路径下行为正确。
 *
 * 对带子路径前缀（如 GitHub Pages /my-repo/）的场景，
 * 在 Astro 运行时由 import.meta.env.BASE_URL 提供，
 * 通过 `astro build --base '/my-repo'` 验证。
 */
describe('path helpers (root base)', () => {
  it('blogPostUrl adds trailing slash', () => {
    expect(blogPostUrl('hello-world')).toBe('/blog/hello-world/');
  });

  it('blogListUrl returns /blog/', () => {
    expect(blogListUrl()).toBe('/blog/');
  });

  it('getCategoryUrl encodes category name', () => {
    expect(getCategoryUrl('Tech')).toBe('/category/Tech/');
  });

  it('getTagUrl encodes tag name', () => {
    expect(getTagUrl('Astro')).toBe('/tag/Astro/');
  });

  it('categoriesUrl returns /categories/', () => {
    expect(categoriesUrl()).toBe('/categories/');
  });

  it('tagsUrl returns /tags/', () => {
    expect(tagsUrl()).toBe('/tags/');
  });

  it('rootPath returns the site root with trailing slash', () => {
    expect(rootPath()).toBe('/');
  });

  it('aboutUrl returns /about/', () => {
    expect(aboutUrl()).toBe('/about/');
  });

  it('rssUrl returns /rss.xml', () => {
    expect(rssUrl()).toBe('/rss.xml');
  });

  it('baseAssetsPath forwards arbitrary path', () => {
    expect(baseAssetsPath('/favicon.svg')).toBe('/favicon.svg');
    expect(baseAssetsPath('/js/app.js')).toBe('/js/app.js');
  });
});

describe('joinBase（子路径部署的核心逻辑）', () => {
  it('根路径部署时原样返回', () => {
    expect(joinBase('/', '/blog/')).toBe('/blog/');
    expect(joinBase('', '/blog/')).toBe('/blog/');
  });

  it('子路径部署时拼上前缀，且不会产生双斜杠', () => {
    expect(joinBase('/Atom', '/blog/')).toBe('/Atom/blog/');
    expect(joinBase('/Atom/', '/blog/')).toBe('/Atom/blog/');
    expect(joinBase('/a/b/', '/x')).toBe('/a/b/x');
  });
});

describe('absoluteUrl', () => {
  it('空值返回空串', () => {
    expect(absoluteUrl('')).toBe('');
  });

  it('已是完整地址的外链原样返回', () => {
    expect(absoluteUrl('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png');
    expect(absoluteUrl('//cdn.example.com/a.png')).toBe('//cdn.example.com/a.png');
  });

  it('站内路径补上 base（测试环境 SITE 为空，因此只剩 base 分支）', () => {
    expect(absoluteUrl('/medias/a.png')).toBe('/medias/a.png');
    expect(absoluteUrl('medias/a.png')).toBe('/medias/a.png');
  });
});

describe('stripBase（导航高亮判定）', () => {
  it('根路径部署时原样返回', () => {
    expect(stripBase('/blog/')).toBe('/blog/');
    expect(stripBase('/')).toBe('/');
  });
});
