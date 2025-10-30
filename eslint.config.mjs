// ──────────────────────────────────────────────────────────────
// 📘 ESLint Flat Config for Next.js 15 + TypeScript + Storybook
// ──────────────────────────────────────────────────────────────
//
// Compatible with:
//  - ESLint 9+
//  - Next.js 14/15+
//  - TypeScript 5+
//  - Prettier
//  - Storybook 8+
//

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import storybook from 'eslint-plugin-storybook';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // ───────────────
  // 1️⃣  Global Ignores
  // ───────────────
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'next-env.d.ts',
    ],
  },

  // ───────────────
  // 2️⃣  JavaScript / TypeScript base rules
  // ───────────────
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // ───────────────
  // 3️⃣  Next.js rules (replaces legacy "next/core-web-vitals")
  // ───────────────
  nextPlugin.configs.recommended,

  // ───────────────
  // 4️⃣  Storybook linting
  // ───────────────
  storybook.configs['flat/recommended'],

  // ───────────────
  // 5️⃣  Custom rules & Prettier integration
  // ───────────────
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'lf',
          singleQuote: true,
          semi: true,
          trailingComma: 'all',
          printWidth: 100,
          tabWidth: 2,
          bracketSpacing: true,
          arrowParens: 'always',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react-hooks/exhaustive-deps': 'warn',
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
