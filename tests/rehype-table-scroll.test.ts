import { describe, it, expect } from 'vitest';
import rehypeTableScroll from '../astro-plugins/rehype-table-scroll.mjs';

// hast 节点的最小构造
type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const el = (tagName: string, children: HastNode[] = []): HastNode => ({
  type: 'element',
  tagName,
  properties: {},
  children,
});

const text = (value: string): HastNode => ({ type: 'text', value, properties: {}, children: [] });

describe('rehypeTableScroll', () => {
  it('wraps a table in a .table-scroll container', () => {
    const tree = { type: 'root', children: [el('table', [el('tbody')])] } as HastNode;

    rehypeTableScroll()(tree as never);

    expect(tree.children![0].tagName).toBe('div');
    expect(tree.children![0].properties?.className).toEqual(['table-scroll']);
  });

  it('keeps the table itself inside the wrapper', () => {
    const tree = { type: 'root', children: [el('table', [el('tbody')])] } as HastNode;

    rehypeTableScroll()(tree as never);

    const wrapper = tree.children![0];
    expect(wrapper.children).toHaveLength(1);
    expect(wrapper.children![0].tagName).toBe('table');
  });

  it('leaves non-table elements untouched', () => {
    const tree = {
      type: 'root',
      children: [el('p', [text('hello')]), el('pre'), el('img')],
    } as HastNode;

    rehypeTableScroll()(tree as never);

    expect(tree.children!.map((c) => c.tagName)).toEqual(['p', 'pre', 'img']);
  });

  it('wraps every table in the document', () => {
    const tree = {
      type: 'root',
      children: [el('p'), el('table'), el('p'), el('table')],
    } as HastNode;

    rehypeTableScroll()(tree as never);

    expect(tree.children!.map((c) => c.tagName)).toEqual(['p', 'div', 'p', 'div']);
    expect(tree.children![1].properties?.className).toEqual(['table-scroll']);
    expect(tree.children![3].properties?.className).toEqual(['table-scroll']);
  });

  it('does not lose sibling order', () => {
    const tree = {
      type: 'root',
      children: [el('h2'), el('table'), el('p'), el('table'), el('blockquote')],
    } as HastNode;

    rehypeTableScroll()(tree as never);

    expect(tree.children!.map((c) => c.tagName)).toEqual(['h2', 'div', 'p', 'div', 'blockquote']);
  });
});
