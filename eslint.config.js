// eslint.config.js — ESLint 9 平面配置（monorepo 根，覆盖 packages/apps/e2e）
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      'playwright-report',
      'test-results',
      '.superpowers',
      '.playwright-mcp',
      'docs',
      'processon_files',
      'gui-test-screenshots',
      'scripts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // v7 新增的编译器级规则：现存 6 处模式待按 React 新规范重构，先降为警告不阻塞 CI
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      // 项目约束：生产代码禁止 console（错误统一走 UI 反馈或抛出）
      'no-console': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    // 测试与配置文件放宽：允许 any 断言 mock 与访问未导出成员
    files: ['**/__tests__/**', '**/*.test.{ts,tsx}', '**/*.config.{js,ts}', 'e2e/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': 'off',
    },
  },
)
