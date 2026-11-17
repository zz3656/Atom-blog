import { describe, expect, it } from 'vitest';
import remarkImgLazy from '../astro-plugins/remark-img-lazy.mjs';

/** 极简 mdast 树：只关心 image 节点的 data.hProperties */
function treeOf(...alt: string[]) {
  return {
    type: 'root',
    children: alt.map((a) => ({ type: 'image', url: `/i/${a}.jpg`, alt: a })),
  } as never;
}

const props = (node: { data?: { hProperties?: Record<string, string> } }) =>
  node.data?.hProperties ?? {};

describe('remark-img-lazy', () => {
  it('第一张图 eager + fetchpriority=high（它通常是 LCP 元素）', () => {
    const tree = treeOf('first', 'second') as unknown as { children: never[] };
    remarkImgLazy()(tree);
    const [first, second] = tree.children as unknown as { data: { hProperties: Record<string, string> } }[];
    expect(first.data.hProperties.loading).toBe('eager');
    expect(first.data.hProperties.fetchpriority).toBe('high');
    expect(second.data.hProperties.loading).toBe('lazy');
    expect(second.data.hProperties.fetchpriority).toBeUndefined();
  });

  it('不覆盖作者显式写的属性', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'image',
          url: '/x.jpg',
          alt: '',
          data: { hProperties: { loading: 'lazy', fetchpriority: 'low' } },
        },
      ],
    } as never;
    remarkImgLazy()(tree);
    const node = (tree as unknown as { children: { data: { hProperties: Record<string, string> } }[] })
      .children[0];
    expect(node.data.hProperties.loading).toBe('lazy');
    expect(node.data.hProperties.fetchpriority).toBe('low');
    expect(node.data.hProperties.decoding).toBe('async');
  });

  it('给每张图补 decoding=async', () => {
    const tree = treeOf('a', 'b', 'c') as unknown as { children: { data?: { hProperties?: Record<string, string> } }[] };
    remarkImgLazy()(tree);
    for (const node of tree.children) expect(props(node).decoding).toBe('async');
  });
});
