import { describe, it, expect } from 'vitest';
import { isValidThemeId, isValidMode, scanThemes } from '../src/utils/themes';

describe('isValidThemeId', () => {
  it('accepts lowercase letters and digits', () => {
    expect(isValidThemeId('ocean')).toBe(true);
    expect(isValidThemeId('dark2')).toBe(true);
  });

  it('accepts hyphens and underscores', () => {
    expect(isValidThemeId('sepia-paper')).toBe(true);
    expect(isValidThemeId('sepia_paper')).toBe(true);
    expect(isValidThemeId('atom-default')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isValidThemeId('')).toBe(false);
  });

  it('rejects ids starting with hyphen or underscore', () => {
    expect(isValidThemeId('-ocean')).toBe(false);
    expect(isValidThemeId('_ocean')).toBe(false);
  });

  it('rejects uppercase letters', () => {
    expect(isValidThemeId('Ocean')).toBe(false);
    expect(isValidThemeId('ATOM')).toBe(false);
  });

  it('rejects path traversal attempts', () => {
    expect(isValidThemeId('../etc')).toBe(false);
    expect(isValidThemeId('foo/bar')).toBe(false);
    expect(isValidThemeId('foo\\bar')).toBe(false);
  });

  it('rejects ids longer than 32 characters', () => {
    expect(isValidThemeId('a'.repeat(33))).toBe(false);
    expect(isValidThemeId('a'.repeat(32))).toBe(true);
  });

  it('rejects special characters', () => {
    expect(isValidThemeId('foo bar')).toBe(false);
    expect(isValidThemeId('foo;bar')).toBe(false);
    expect(isValidThemeId('<script>')).toBe(false);
  });
});

describe('isValidMode', () => {
  it('accepts light and dark', () => {
    expect(isValidMode('light')).toBe(true);
    expect(isValidMode('dark')).toBe(true);
  });

  it('rejects other values', () => {
    expect(isValidMode('')).toBe(false);
    expect(isValidMode('auto')).toBe(false);
    expect(isValidMode('LIGHT')).toBe(false);
  });
});

describe('scanThemes', () => {
  it('至少扫描到一个可用主题', () => {
    const themes = scanThemes();
    expect(themes.length).toBeGreaterThanOrEqual(1);
  });

  it('每个主题的 id 都合法，且清单不含重复 id', () => {
    const themes = scanThemes();
    const ids = themes.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(isValidThemeId(id)).toBe(true);
  });

  it('排序稳定：声明 default 的置顶，其余按 id 字典序（不写死某个 id）', () => {
    const themes = scanThemes();
    const expected = [...themes].sort((a, b) => {
      const ad = a.default ? 1 : 0;
      const bd = b.default ? 1 : 0;
      if (ad !== bd) return bd - ad;
      return a.id.localeCompare(b.id);
    });
    expect(themes.map((t) => t.id)).toEqual(expected.map((t) => t.id));
  });

  it('every scanned theme has required fields', () => {
    const themes = scanThemes();
    for (const t of themes) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(Array.isArray(t.modes)).toBe(true);
      expect(t.modes.length).toBeGreaterThan(0);
      // 所有 modes 都必须通过 isValidMode
      for (const m of t.modes) {
        expect(isValidMode(m)).toBe(true);
      }
      // id 必须通过 isValidThemeId
      expect(isValidThemeId(t.id)).toBe(true);
    }
  });

  it('至少有一个主题同时支持 light 与 dark', () => {
    const themes = scanThemes();
    const dual = themes.filter((t) => t.modes.includes('light') && t.modes.includes('dark'));
    expect(dual.length).toBeGreaterThanOrEqual(1);
  });
});
