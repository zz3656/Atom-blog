// Atom Blog — Theme manifest utilities
// 扫描 src/themes/ 目录，构建类型安全的主题清单。

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// __dirname = src/utils/  → themes/ 是 ../themes/
const THEMES_DIR = join(__dirname, '..', 'themes');

export interface ThemeManifest {
  /** 主题 ID（小写、URL 安全）。也是 localStorage 的 key */
  id: string;
  /** 显示名称（用户可见） */
  name: string;
  /** 作者署名 */
  author: string;
  /** semver */
  version: string;
  /** 简介（用于主题选择器 tooltip） */
  description: string;
  /** 支持的模式：单模式 ['light'] / 双模式 ['light', 'dark'] */
  modes: ('light' | 'dark')[];
  /** 预览图（public 下的相对路径，可空） */
  preview: string;
}

/**
 * 扫描 src/themes/ 读取每个子目录的 manifest.json。
 * 跳过无效主题（无 manifest 或 manifest 字段不全）。
 */
export function scanThemes(): ThemeManifest[] {
  if (!existsSync(THEMES_DIR)) return [];
  const entries = readdirSync(THEMES_DIR).filter((name) => {
    const fullPath = join(THEMES_DIR, name);
    return statSync(fullPath).isDirectory();
  });
  const themes: ThemeManifest[] = [];
  for (const entry of entries) {
    const manifestPath = join(THEMES_DIR, entry, 'manifest.json');
    if (!existsSync(manifestPath)) continue;
    try {
      const raw = readFileSync(manifestPath, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<ThemeManifest>;
      // 必填字段校验
      if (
        !parsed.id ||
        !parsed.name ||
        !parsed.modes ||
        !Array.isArray(parsed.modes) ||
        parsed.modes.length === 0
      ) {
        console.warn(`[themes] Skipping "${entry}": invalid manifest (missing id/name/modes)`);
        continue;
      }
      themes.push({
        id: parsed.id,
        name: parsed.name,
        author: parsed.author ?? 'unknown',
        version: parsed.version ?? '0.0.0',
        description: parsed.description ?? '',
        modes: parsed.modes.filter((m) => m === 'light' || m === 'dark'),
        preview: parsed.preview ?? '',
      });
    } catch (err) {
      console.warn(`[themes] Failed to parse ${manifestPath}:`, (err as Error).message);
    }
  }
  // 排序：按 id 字典序（通用规则，不对任何具体主题 id 做特例）。
  // 显式化而非依赖 readdirSync 的实现细节 —— 新增主题目录时，
  // 顺序不因文件系统行为变化而漂移（与 astro-plugins/theme-loader.mjs 保持一致）。
  //
  // 注意：站点默认主题由 src/consts.ts 的 DEFAULT_THEME_ID 决定，与这里的排序无关。
  // 排序只保证「两处扫描产出同一顺序」（测试与构建一致）。
  themes.sort((a, b) => a.id.localeCompare(b.id));
  return themes;
}

/**
 * 路径安全：所有主题 ID 必须匹配此正则。
 * 防止 XSS 或文件系统遍历。
 */
const SAFE_ID = /^[a-z0-9][a-z0-9_-]{0,31}$/;
export function isValidThemeId(id: string): boolean {
  return SAFE_ID.test(id);
}

/**
 * 路径安全：mode 只能是 'light' 或 'dark'。
 */
export function isValidMode(mode: string): mode is 'light' | 'dark' {
  return mode === 'light' || mode === 'dark';
}
