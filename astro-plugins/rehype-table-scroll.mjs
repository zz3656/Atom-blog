// 给 Markdown 表格包一层可横向滚动的容器
//
// 为什么需要：窄屏（< 400px）上内容较宽的表格会撑破页面，
// 造成整页横向滚动。包一层 overflow-x: auto 的 div 后，
// 表格自己横向滚动，页面保持不动。
//
// 副作用：表格的边框 / 圆角 / 外边距移到容器上，避免出现双层边框。

import { visit } from 'unist-util-visit';

export default function rehypeTableScroll() {
  return (tree) => {
    // 先收集、再替换 —— 避免遍历过程中修改 children 导致索引错位
    const targets = [];

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'table' && parent) {
        targets.push({ parent, index });
      }
    });

    for (const { parent, index } of targets) {
      const table = parent.children[index];
      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'] },
        children: [table],
      };
    }
  };
}
