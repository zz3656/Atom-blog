import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf-8');

/** 抓取 CSS / 模板里定义的 `--token:` 名字 */
function definedTokens(css: string): Set<string> {
  return new Set([...css.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map((m) => m[1]));
}

describe('主题 token 契约（主题 ↔ 文档 ↔ 脚手架 三方一致）', () => {
  const light = definedTokens(read('src/themes/atom-geek/light.css'));
  const dark = definedTokens(read('src/themes/atom-geek/dark.css'));
  const docTokens = new Set(
    [...read('docs/THEMING.md').matchAll(/`(--[\w-]+)`/g)].map((m) => m[1]),
  );
  const scaffold = definedTokens(read('scripts/create-theme.mjs'));

  it('light 与 dark 定义的 token 集合完全相同', () => {
    expect([...light].sort()).toEqual([...dark].sort());
  });

  it('主题里定义的每个 token 都在 docs/THEMING.md 有记录', () => {
    const missing = [...light].filter((t) => !docTokens.has(t)).sort();
    expect(missing).toEqual([]);
  });

  it('主题里定义的每个 token 都能由 scripts/create-theme.mjs 生成', () => {
    const missing = [...light].filter((t) => !scaffold.has(t)).sort();
    expect(missing).toEqual([]);
  });

  it('灯箱与成功态不再依赖字面色值（回归守卫）', () => {
    const post = read('src/styles/_modules/_post.css');
    expect(post).not.toMatch(/#fff\b/i);
    expect(post).not.toMatch(/rgba\(\s*0,\s*0,\s*0,\s*0\.9/);
    expect(post).toContain('var(--overlay-bg)');
    expect(post).toContain('var(--on-overlay)');
    expect(post).toContain('var(--on-success)');
  });
});
