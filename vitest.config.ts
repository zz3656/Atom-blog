import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.{ts,js}'],
    environment: 'node',
    // 客户端脚本测试用 `// @vitest-environment jsdom` 在文件顶部声明
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/utils/**'],
      // 覆盖率从"装饰品"变成门禁：低于阈值 CI 直接红。
      // 阈值按当前实测（lines 84.5 / stmts 79.8 / branch 65.3 / funcs 91.9）留出余量设定，
      // 后续加代码请补测试，而不是往下调阈值。
      thresholds: {
        statements: 75,
        branches: 62,
        functions: 85,
        lines: 80,
      },
      // 不再 exclude：所有 utils 都应被覆盖。collection.ts 之前被排除导致
      // getPublishedPosts 等核心函数 0 覆盖；path.ts 的子路径场景测试缺失
      // 导致 P0-16（首页按钮 /Atom//blog 双斜杠）漏检。
    },
  },
});
