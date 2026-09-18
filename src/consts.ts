// Atom Blog — 站点配置
// 灵感来自电影《铁甲钢拳》(Real Steel) 中的机器人 Atom
//
// ★ 客制化指南 ★
// 只需修改此处，即可全局更新站点信息、Logo、Favicon 等

export const SITE_TITLE = 'Atom Blog';           // 站点标题（SEO 标题、OG 标签、RSS 名称等）
export const SITE_NAME = 'Atom';                 // 导航栏显示的名称（短名称，可用于 Logo 替换后仅显示文字）
export const SITE_DESCRIPTION = 'A modern, lightweight blog built with Astro — clean, fast, elegant';
export const AUTHOR = 'zz3656';

// Logo 与 Favicon（两个独立文件）
// - Logo   → 导航栏左侧图标。放入 public/logos/logo.svg（或 .png / .webp），修改 SITE_LOGO 即可
// - Favicon → 浏览器标签页图标。放入 public/favicon.svg，修改 SITE_FAVICON 即可
export const SITE_LOGO = '/logos/logo.svg';       // Logo 文件路径（对应 public/logos/logo.svg）
export const SITE_FAVICON = '/favicon.svg';       // Favicon 文件路径（对应 public/favicon.svg）

export const SOCIAL_LINKS = {
  github: 'https://github.com/zz3656',
  twitter: '',
  email: '',
};
