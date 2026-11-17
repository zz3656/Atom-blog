/**
 * PWA manifest —— 构建期生成，而不是 public/ 里的静态文件。
 *
 * 原因：静态文件里的 "/" 不吃 base，GitHub Pages（base=/Atom）下
 * start_url 与图标会指向域名根 → 装不上 PWA。
 * 这里用 absoluteUrl() 统一拼 origin + base，颜色则从主题 manifest 取，
 * 避免组件/配置层再写死一份色值。
 */
import type { APIRoute } from 'astro';
import {
  DEFAULT_THEME_COLORS,
  SITE_DESCRIPTION,
  SITE_FAVICON,
  SITE_NAME,
  SITE_TITLE,
} from '../consts';
import { themes } from '../generated/themes';
import { absoluteUrl } from '../utils/path';

export const prerender = true;

export const GET: APIRoute = () => {
  const theme = themes[0];
  const light = theme?.themeColor?.light ?? DEFAULT_THEME_COLORS.light;

  const manifest = {
    name: SITE_TITLE,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: 'zh-CN',
    start_url: absoluteUrl('/'),
    scope: absoluteUrl('/'),
    display: 'standalone',
    background_color: light,
    // PWA 只接受单值：用亮色主题的底色，与 <meta name="theme-color"> 的 light 分支一致
    theme_color: light,
    icons: [
      // Android/Chrome 装 PWA 只认 PNG（SVG 图标不会被用作启动图标）
      { src: absoluteUrl('/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: absoluteUrl('/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: absoluteUrl('/icon-512.png'),
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: absoluteUrl(SITE_FAVICON),
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
