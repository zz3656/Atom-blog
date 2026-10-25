// Atom Blog — 站点配置
// 灵感来自电影《铁甲钢拳》(Real Steel) 中的机器人 Atom
//
// ★ 客制化指南 ★
// 只需修改此处，即可全局更新站点信息、Logo、Favicon、首页 Hero 区域 等

// 版本号从 package.json 读取 —— 单一数据源，不要在这里手写。
// package.json version ↔ CHANGELOG 最新版本号 ↔ 页脚显示，三者由
// tests/version.test.ts 保证一致。
import pkg from '../package.json';

export const SITE_TITLE = '因特吧'; // 站点标题（SEO 标题、OG 标签、RSS 名称等）
export const SITE_NAME = '因特吧'; // 导航栏显示的名称（短名称，可用于 Logo 替换后仅显示文字）
export const SITE_DESCRIPTION =
  '因特网里的一间小吧——聊网络、Linux、AI、折腾，以及在数字世界里踩过的每一个坑。基于 Astro 构建，零 JavaScript，Lighthouse 满分。';
export const AUTHOR = 'zz3656';

/** 站点版本号（显示在页脚）。数据源：package.json 的 version 字段。 */
export const SITE_VERSION = pkg.version;

// 首页 Hero 区域文案（可完全客制化，不依赖任何外部数据）
// - HERO_TITLE       → 首页 Hero 大标题中的文本部分（图标 + 文本）。可包含 HTML 标签
// - HERO_DESCRIPTION → 首页 Hero 描述段落
// - HERO_EYEBROW     → Hero 标题上方的小写标签（等宽字体）
// - HERO_EYEBROW_SUB → 标签右侧的补充说明
// - HERO_ACTIONS     → 首页 Hero 下方的 CTA 按钮列表，按顺序渲染；留空数组则不渲染按钮区
//   · label  : 按钮文案
//   · href   : 按钮跳转地址（以 / 开头的站内路径会自动加 base 前缀）
//   · variant: 'primary' | 'secondary'，决定按钮样式（默认 'primary'）
//   · hide   : true 则跳过该按钮（可选）
export const HERO_TITLE = '因特吧';
export const HERO_DESCRIPTION =
  '因特网里的一间小吧——聊网络、Linux、AI、折腾，以及在数字世界里踩过的每一个坑。';
export const HERO_EYEBROW = 'PRECISION LOG';
export const HERO_EYEBROW_SUB = '个人技术日志';
export const HERO_ACTIONS: Array<{
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
  hide?: boolean;
}> = [
  { label: '浏览文章 →', href: '/blog', variant: 'primary' },
  { label: '关于此博客', href: '/about', variant: 'secondary' },
];

// Logo 与 Favicon（三个独立文件）
// - Logo      → 导航栏左侧图标。放入 public/logos/logo.svg（或 .png / .webp），修改 SITE_LOGO 即可
// - Favicon   → 浏览器标签页图标。放入 public/favicon.svg，修改 SITE_FAVICON 即可
// - Hero Icon → 首页 Hero 区域"Atom 博客"前面的图标。
//               留空 '' 则使用内置的 Atom 原子 SVG（默认）；
//               如需替换，放入 public/heroes/hero.svg（或 .png / .webp），修改 SITE_HERO_ICON 即可
//
// 图形来源：内置标识由本机 Draw Things 生成原图，再描摹成矢量，颜色对齐设计系统 token。
// 完整流水线见 DEVELOP.md「品牌图标（Draw Things 流水线）」。
export const SITE_LOGO = '/logos/logo.svg'; // Logo 文件路径（对应 public/logos/logo.svg）
export const SITE_FAVICON = '/favicon.svg'; // Favicon 文件路径（对应 public/favicon.svg）
export const SITE_HERO_ICON = '/heroes/hero.svg'; // 首页 Hero 图标路径；留空则使用内置 Atom 原子 SVG

// 项目源代码仓库（Footer 的 🐙 GitHub 与 "站点标题" 链接使用）
export const REPO_URL = 'https://github.com/zz3656/Atom';

// 个人社交链接（与项目仓库区分开）
export const SOCIAL_LINKS = {
  github: 'https://github.com/zz3656', // 个人 GitHub
  twitter: '',
  email: '',
};

// 分页配置（首页与文章列表共用）
export const POSTS_PER_PAGE = 12;

/**
 * 站点默认主题 ID（构建期常量）。
 *
 * 「哪个主题是站点默认」属于站点配置，不是主题包属性 ——
 * 所以它住在 consts.ts，而不是 manifest.json 里。
 * 主题包被移除 / 未注册时，BaseLayout.astro 会自动回退到清单首个可用主题
 * （通常是 atom-default），因此删掉 src/themes/<id>/ 不会让站点构建失败。
 */
export const DEFAULT_THEME_ID = 'atom-geek';
