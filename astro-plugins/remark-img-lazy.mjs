// 给 Markdown 图片自动添加 loading / decoding
//
// 注意：**第一张图不能 lazy**。正文首图通常就是 LCP 元素，加 loading="lazy"
// 会让浏览器把它的加载推迟到布局之后，反而拖慢首屏。首图改为 eager + 高优先级。
//
// 作者显式写了的属性一律不覆盖。

import { visit } from 'unist-util-visit';

export default function remarkImgLazy() {
  return (tree) => {
    let index = 0;
    visit(tree, 'image', (node) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      const props = node.data.hProperties;
      const isFirst = index === 0;
      index += 1;

      if (!('loading' in props)) {
        props.loading = isFirst ? 'eager' : 'lazy';
      }
      if (!('decoding' in props)) {
        props.decoding = 'async';
      }
      if (isFirst && !('fetchpriority' in props)) {
        props.fetchpriority = 'high';
      }
    });
  };
}
