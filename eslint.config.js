import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
    {ignores: ['dist', 'node_modules']},
    {
      extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
      ],
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      settings: {
        react: {version: 'detect'},
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      plugins: {
        react,
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        'import': importPlugin,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        ...react.configs.recommended.rules,
        'react-refresh/only-export-components': [
          'warn',
          {allowConstantExport: true},
        ],
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-unused-vars': 'error',

        // Import правила
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index'
            ],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true
            },
          },
        ],
        'import/no-cycle': 'error',
        'import/no-duplicates': 'error',
        'import/no-unused-modules': 'warn',
      },
    },
)
