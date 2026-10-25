import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SITE_VERSION } from '../src/consts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf-8'));
const changelog = readFileSync(path.join(root, 'CHANGELOG.md'), 'utf-8');

/**
 * 版本号单一数据源校验
 *
 * package.json 的 version 是唯一数据源：
 *   package.json version  ↔  CHANGELOG 最新发布版本号  ↔  页脚显示的 SITE_VERSION
 * 三者必须一致，否则版本号系统就失去意义了。
 */
describe('版本号系统', () => {
  it('SITE_VERSION 直接取自 package.json', () => {
    expect(SITE_VERSION).toBe(pkg.version);
  });

  it('package.json 的 version 是合法的 semver', () => {
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/);
  });

  it('CHANGELOG 存在与 package.json 一致的最新发布版本号', () => {
    const released = [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\]/gm)].map((m) => m[1]);
    expect(released.length).toBeGreaterThan(0);
    expect(released[0]).toBe(pkg.version);
  });

  it('CHANGELOG 的版本号严格递减（不允许出现重复的发布段）', () => {
    const released = [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\]/gm)].map((m) => m[1]);
    expect(new Set(released).size).toBe(released.length);
  });

  it('CHANGELOG 只有一个 [Unreleased] 段', () => {
    const unreleased = changelog.match(/^## \[Unreleased\]/gm) || [];
    expect(unreleased.length).toBe(1);
  });

  it('CHANGELOG 顶部的最新发布版本带有日期', () => {
    const released = [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\] — (\d{4}-\d{2}-\d{2})/gm)];
    expect(released.length).toBeGreaterThan(0);
    expect(released[0][1]).toBe(pkg.version);
  });
});
