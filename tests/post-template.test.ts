import { describe, expect, it } from 'vitest';
import { composeFrontmatter, yamlScalar } from '../scripts/lib/post-template.mjs';

/** 取出 frontmatter 区块（不含收尾 --- 与其后的正文） */
function frontmatterLines(md: string): string[] {
  const lines = md.split('\n');
  expect(lines[0]).toBe('---');
  const end = lines.indexOf('---', 1);
  expect(end).toBeGreaterThan(0);
  return lines.slice(1, end);
}

describe('composeFrontmatter', () => {
  it('draft / reward 写在 frontmatter 里，而不是落进正文', () => {
    const md = composeFrontmatter({
      title: '草稿标题',
      description: '描述',
      pubDate: '2026-11-16',
      reward: true,
      draft: true,
    });
    const fields = frontmatterLines(md);
    expect(fields).toContain('draft: true');
    expect(fields).toContain('reward: true');
    // 收尾 --- 之后不应再出现任何字段
    const body = md.split('\n').slice(md.split('\n').indexOf('---', 1) + 1);
    expect(body.join('\n').trim()).toBe('');
  });

  it('未开启时不写 draft / reward', () => {
    const fields = frontmatterLines(composeFrontmatter({ title: '普通文章' }));
    expect(fields.some((l) => l.startsWith('draft:'))).toBe(false);
    expect(fields.some((l) => l.startsWith('reward:'))).toBe(false);
  });

  it('可选字段按需出现', () => {
    const md = composeFrontmatter({
      title: '带分类与标签',
      category: '技术',
      tags: ['Astro', 'Web'],
      heroImage: '/medias/hero.jpg',
    });
    const fields = frontmatterLines(md);
    expect(fields).toContain('category: 技术');
    expect(fields).toContain('tags: [Astro, Web]');
    expect(fields).toContain('heroImage: /medias/hero.jpg');
  });

  it('含冒号或引号的标题会被安全引用', () => {
    const fields = frontmatterLines(composeFrontmatter({ title: '重构: 从 0 到 1' }));
    expect(fields).toContain('title: "重构: 从 0 到 1"');
  });
});

describe('yamlScalar', () => {
  it('普通值不加引号', () => {
    expect(yamlScalar('普通标题')).toBe('普通标题');
  });
  it('特殊字符加引号', () => {
    expect(yamlScalar('a: b')).toBe('"a: b"');
    expect(yamlScalar('- 列表开头')).toBe('"- 列表开头"');
  });
});
