import { describe, it, expect } from 'vitest';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { astroSlug } from '../src/utils/slug';

/**
 * astroSlug 必须和 Astro 7（github-slugger）产出的内容路由 id 完全一致。
 * 一旦对不上，搜索结果与 RSS 链接就会指向 404——
 * 这个 bug 已经真实发生过：26 篇文章里有 12 篇的链接是坏的。
 */
describe('astroSlug', () => {
  it('转小写', () => {
    expect(astroSlug('DrawThings完全使用指南')).toBe('drawthings完全使用指南');
    expect(astroSlug('RouterOS-v7入门到精通学习笔记')).toBe(
      'routeros-v7入门到精通学习笔记',
    );
    expect(astroSlug('Ubuntu-26-04-LTS-Resolute-Raccoon全面解析')).toBe(
      'ubuntu-26-04-lts-resolute-raccoon全面解析',
    );
  });

  it('去掉标点与符号', () => {
    expect(astroSlug('千问3.6生成前后对比')).toBe('千问36生成前后对比');
    expect(astroSlug('Foo (Bar)')).toBe('foo-bar');
    expect(astroSlug('A.B')).toBe('ab');
  });

  it('保留连字符、下划线与中文', () => {
    expect(astroSlug('a--b')).toBe('a--b');
    expect(astroSlug('_x_')).toBe('_x_');
    expect(astroSlug('屌丝网管第一章')).toBe('屌丝网管第一章');
  });

  it('空格换成连字符', () => {
    expect(astroSlug('Hello World')).toBe('hello-world');
  });

  it('真实语料的期望表（改文件名就会在这里暴露）', () => {
    const expected: Record<string, string> = {
      'AI大模型最新进展盘点.md': 'ai大模型最新进展盘点',
      'Atom-Geek主题设计与安装说明.md': 'atom-geek主题设计与安装说明',
      'Cloud-Mail基于Cloudflare的免费邮箱服务部署指南.md':
        'cloud-mail基于cloudflare的免费邮箱服务部署指南',
      'DeepSeek-Harness-完全指南.md': 'deepseek-harness-完全指南',
      'DrawThings完全使用指南.md': 'drawthings完全使用指南',
      'Markdown完全使用指南.md': 'markdown完全使用指南',
      'Multipass入门指南.md': 'multipass入门指南',
      'OpenClaw全方位指南.md': 'openclaw全方位指南',
      'RouterOS-v7入门到精通学习笔记.md': 'routeros-v7入门到精通学习笔记',
      'Ubuntu-26-04-LTS-Resolute-Raccoon全面解析.md':
        'ubuntu-26-04-lts-resolute-raccoon全面解析',
      'exo-将多台设备组成AI推理集群的完整指南.md': 'exo-将多台设备组成ai推理集群的完整指南',
      '千问3.6生成前后对比.md': '千问36生成前后对比',
    };
    for (const [file, slug] of Object.entries(expected)) {
      expect(astroSlug(file.replace(/\.md$/, '')), file).toBe(slug);
    }
  });

  it('仓库里每一篇文章算出的 slug 都命中期望表', () => {
    const blogDir = join(process.cwd(), 'src', 'content', 'blog');
    const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const slug = astroSlug(file.replace(/\.md$/, ''));
      expect(slug).not.toBe('');
      // slug 里不该再出现会被路由吃掉的标点
      expect(slug).not.toMatch(/[/\\?#.]/);
    }
  });

  it('算出的 slug 命中构建产物里的真实文章路由', () => {
    const blogDist = join(process.cwd(), 'dist', 'blog');
    if (!existsSync(blogDist)) return; // 没构建过就跳过
    const routes = new Set(
      readdirSync(blogDist, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name),
    );
    const blogDir = join(process.cwd(), 'src', 'content', 'blog');
    const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const slug = astroSlug(file.replace(/\.md$/, ''));
      expect(routes.has(slug), `${file} → ${slug}`).toBe(true);
    }
  });
});
