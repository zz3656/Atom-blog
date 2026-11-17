import { describe, expect, it } from 'vitest';
import { buildSearchIndex, parseFrontmatter } from '../scripts/lib/blog-posts.mjs';

describe('parseFrontmatter', () => {
  it('解析单行字段与内联数组', () => {
    const fm = parseFrontmatter(
      ['---', 'title: 标题', 'category: 技术', 'tags: [astro, 博客]', '---', '', '正文'].join('\n'),
    );
    expect(fm.title).toBe('标题');
    expect(fm.category).toBe('技术');
    expect(fm.tags).toEqual(['astro', '博客']);
  });

  it('去掉包裹引号', () => {
    const fm = parseFrontmatter(['---', 'description: "带,逗号的描述"', '---', ''].join('\n'));
    expect(fm.description).toBe('带,逗号的描述');
  });

  it('没有 frontmatter 时返回空对象', () => {
    expect(parseFrontmatter('# 只有正文\n')).toEqual({});
  });
});

describe('buildSearchIndex', () => {
  const posts = [
    {
      slug: 'hello',
      title: 'Hello Atom',
      description: '简介 Text',
      pubDate: new Date('2026-01-02T03:04:05Z'),
      category: 'Tech',
      tags: ['Astro', 'Blog'],
      content: '## 小标题\n\n正文 **加粗** 内容',
    },
  ];

  it('把标题、描述与纯文本正文合并成小写可搜索字段', () => {
    const [entry] = buildSearchIndex(posts);
    expect(entry.slug).toBe('hello');
    expect(entry.pubDate).toBe('2026-01-02T03:04:05.000Z');
    // 大写与小写都能命中，说明已统一小写
    expect(entry.content).toContain('hello atom');
    expect(entry.content).toContain('正文');
    // Markdown 标记应被剥离
    expect(entry.content).not.toContain('##');
    expect(entry.content).not.toContain('**');
  });

  it('分类与标签统一小写', () => {
    const [entry] = buildSearchIndex(posts);
    expect(entry.categories).toBe('tech');
    expect(entry.tags).toEqual(['astro', 'blog']);
  });
});

describe('parseFrontmatter 块状 YAML', () => {
  it('支持 tags 写成多行列表', () => {
    const fm = parseFrontmatter(
      ['---', 'title: 块状', 'tags:', '  - astro', '  - "中文标签"', 'category: 技术', '---', ''].join(
        '\n',
      ),
    );
    expect(fm.tags).toEqual(['astro', '中文标签']);
    expect(fm.category).toBe('技术');
  });
});
