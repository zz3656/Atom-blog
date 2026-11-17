// Atom Blog — 路径工具函数
// 统一管理 base 路径处理，避免每个文件重复计算

const base = import.meta.env.BASE_URL;

/**
 * 给路径加 base 前缀（纯函数，便于单测两种部署形态）。
 * 根路径部署（base 为 '/' 或 ''）原样返回，否则拼上 base（去掉尾部斜杠避免双斜杠）。
 */
export function joinBase(basePath: string, path: string): string {
  if (basePath === '/' || basePath === '') return path;
  return `${basePath.replace(/\/$/, '')}${path}`;
}

function withBase(path: string): string {
  return joinBase(base, path);
}

/**
 * 去掉 pathname 上的 base 前缀，得到站点内的逻辑路径（总是以 / 开头）。
 *
 * 为什么需要：子路径部署时 `Astro.url.pathname` 是 `/Atom/blog/`，
 * 直接和 `/blog` 比较永远不相等——导航高亮会整体失效（只在这种部署下复现）。
 */
export function stripBase(pathname: string): string {
  if (base === '/' || base === '') return pathname;
  const normalizedBase = base.replace(/\/$/, '');
  if (pathname === normalizedBase) return '/';
  if (pathname.startsWith(`${normalizedBase}/`)) return pathname.slice(normalizedBase.length);
  return pathname;
}

/**
 * 文章 URL（带尾斜杠，符合 Astro 默认静态路由）
 */
export function blogPostUrl(slug: string): string {
  return withBase(`/blog/${slug}/`);
}

/**
 * 文章列表/分页 URL
 */
export function blogListUrl(): string {
  return withBase('/blog/');
}

/**
 * 分类详情页 URL
 */
export function getCategoryUrl(category: string): string {
  return withBase(`/category/${encodeURIComponent(category)}/`);
}

/**
 * 标签详情页 URL
 */
export function getTagUrl(tag: string): string {
  // 标签可能含中文/空格/#，必须转义，否则链接会碎或被当成 fragment
  return withBase(`/tag/${encodeURIComponent(tag)}/`);
}

/**
 * 分类列表页 URL
 */
export function categoriesUrl(): string {
  return withBase('/categories/');
}

/**
 * 标签列表页 URL
 */
export function tagsUrl(): string {
  return withBase('/tags/');
}

/**
 * 首页 URL。站点用 trailingSlash: 'always'，所以这里也带尾斜杠，
 * 避免每次点击吃一次 301（且 canonical 与实际路由保持一致）。
 */
export function rootPath(): string {
  return withBase('/');
}

/**
 * 关于页 URL
 */
export function aboutUrl(): string {
  return withBase('/about/');
}

/**
 * RSS 订阅 URL
 */
export function rssUrl(): string {
  return withBase('/rss.xml');
}

/**
 * 任意静态资源路径（始终在 base 前缀下）
 */
export function baseAssetsPath(path: string): string {
  return withBase(path);
}

/**
 * 站点绝对 URL（origin + base + path），用于 JSON-LD / manifest / OG 这些
 * 必须是完整地址、且要跟随子路径部署的场景。
 *
 * 注意：不能用 `Astro.url.origin + path`——origin 不含 base，
 * 在 GitHub Pages（base=/Atom）下会指向域名根而 404。
 */
export function absoluteUrl(path: string): string {
  if (!path) return '';
  // 已经是完整地址（外链封面图等）就原样返回
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(path)) return path;
  const site = String(import.meta.env.SITE || '');
  const origin = site ? new URL(site).origin : '';
  return `${origin}${withBase(path.startsWith('/') ? path : `/${path}`)}`;
}
