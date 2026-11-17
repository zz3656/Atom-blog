/**
 * robots.txt —— 构建期生成，带上跟随 base 的 Sitemap 绝对地址。
 *
 * public/robots.txt 是静态文件，里面写不出 `/<base>/sitemap-index.xml`
 * （部署目标一变，路径就错），而且原来连 Sitemap 指令都没有。
 */
import type { APIRoute } from 'astro';
import { absoluteUrl } from '../utils/path';

export const prerender = true;

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${absoluteUrl('/sitemap-index.xml')}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
