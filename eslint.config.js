import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // 禁止 console，但允许 console.error
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      // 禁止显式使用 any 类型
      '@typescript-eslint/no-explicit-any': 'warn',
      // 建议显式声明函数返回类型
      '@typescript-eslint/explicit-function-return-type': 'off',
      // 禁止未使用的变量 - 禁用此规则以避免配置问题
      // '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // React Hooks 规则 - 只保留基本规则
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
])
