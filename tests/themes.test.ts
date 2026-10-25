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
    expect(isValidThemeId('atom-geek')).toBe(true);
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
  it('returns at least the atom-geek built-in theme', () => {
    const themes = scanThemes();
    expect(themes.length).toBeGreaterThanOrEqual(1);
  });

  it('contains atom-geek', () => {
    const themes = scanThemes();
    const ids = themes.map((t) => t.id);
    expect(ids).toContain('atom-geek');
  });

  it('lists the sole shipped theme atom-geek', () => {
    const themes = scanThemes();
    expect(themes.map((t) => t.id)).toEqual(['atom-geek']);
  });

  it('sorts themes by id lexicographically (generic rule, no per-id special case)', () => {
    const themes = scanThemes();
    const ids = themes.map((t) => t.id);
    expect(ids).toEqual([...ids].sort((a, b) => a.localeCompare(b)));
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

  it('atom-geek supports both light and dark', () => {
    const themes = scanThemes();
    const def = themes.find((t) => t.id === 'atom-geek');
    expect(def?.modes).toEqual(expect.arrayContaining(['light', 'dark']));
  });
});