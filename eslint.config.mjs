import js from '@eslint/js';
import globals from 'globals';
import vitestPlugin from '@vitest/eslint-plugin';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        ignores: ['node_modules/', 'dist/', 'showcase/', 'docs-dist/', 'docs-sources/', '.claude/']
    },
    js.configs.recommended,
    jsdocPlugin.configs['flat/recommended'],
    prettierConfig,
    {
        plugins: {
            prettier: prettierPlugin
        },
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser
            },
            sourceType: 'module',
            ecmaVersion: 2022
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
            indent: ['error', 4, { SwitchCase: 1 }],
            'linebreak-style': ['error', 'unix'],
            quotes: ['error', 'single', 'avoid-escape'],
            semi: ['error', 'always'],
            'prettier/prettier': ['error'],
            'jsdoc/tag-lines': 'off'
        }
    },
    {
        files: ['test/**/*.spec.js'],
        plugins: { vitest: vitestPlugin },
        rules: {
            ...vitestPlugin.configs.recommended.rules
        },
        languageOptions: {
            globals: {
                ...vitestPlugin.environments.env.globals
            }
        }
    }
];
