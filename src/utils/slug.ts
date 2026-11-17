// Atom Blog — 内容路由 slug 工具（项目级）
//
// Astro 7 的内容集合用 github-slugger 生成路由 id：
//   1. 全部转小写
//   2. 去掉标点与符号（字母、组合标记、十进制数字、连字符 -、下划线 _ 保留）
//   3. 空格换成连字符
//
// 搜索索引 / RSS / sitemap 里的 slug 必须与 Astro 的真实路由逐字一致，否则
// 「页面能打开但搜不到 / RSS 链接 404」。文件名原样当 slug 用就会错：
//   'DrawThings完全使用指南' → 'drawthings完全使用指南'
//   '千问3.6生成前后对比'   → '千问36生成前后对比'

// 保留：字母、组合标记、十进制数字、连字符、下划线、空格
const NON_SLUG_CHARS = /[^\p{L}\p{M}\p{Nd}\-_ ]/gu;

/** 把文章文件名（不含扩展名）转成 Astro 的内容路由 slug。 */
export function astroSlug(fileNameWithoutExt: string): string {
  return String(fileNameWithoutExt)
    .toLowerCase()
    .replace(NON_SLUG_CHARS, '')
    .replace(/ /g, '-');
}
