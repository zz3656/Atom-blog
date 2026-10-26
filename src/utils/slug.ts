// Atom Blog — 内容路由 slug 工具
//
// 生成文章 URL / 搜索索引 / RSS / sitemap 时，slug 必须和 Astro 自己
// 产出的内容路由完全一致，否则链接会指向 404。

/**
 * Astro 7 的内容集合用 github-slugger 生成路由 id：
 *   1. 全部转小写
 *   2. 去掉标点与符号（字母、组合标记、十进制数字、连字符 -、下划线 _ 保留）
 *   3. 空格换成连字符
 *
 * 例：
 *   'DrawThings完全使用指南'        → 'drawthings完全使用指南'
 *   '千问3.6生成前后对比'            → '千问36生成前后对比'
 *   'RouterOS-v7入门到精通学习笔记'   → 'routeros-v7入门到精通学习笔记'
 *
 * postbuild 脚本以前直接拿文件名当 slug，于是 26 篇文章里有 12 篇的
 * 搜索结果与 RSS 链接指向了 404（大小写、标点跟 Astro 的真实路由对不上）。
 *
 * 这里的规则在真实语料上与 github-slugger 逐字一致；构建期还有一道闸门：
 * scripts/generate-rss.mjs 会拿 dist/blog/ 的真实路由反查，对不上就让构建失败。
 */

// 保留：字母、组合标记、十进制数字、连字符、下划线、空格
const NON_SLUG_CHARS = /[^\p{L}\p{M}\p{Nd}\-_ ]/gu;

/**
 * 把文章文件名（不含扩展名）转成 Astro 的内容路由 slug。
 */
export function astroSlug(fileNameWithoutExt: string): string {
  return String(fileNameWithoutExt)
    .toLowerCase()
    .replace(NON_SLUG_CHARS, '')
    .replace(/ /g, '-');
}
