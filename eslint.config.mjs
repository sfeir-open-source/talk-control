import js from '@eslint/js';
import globals from 'globals';
import mochaPlugin from 'eslint-plugin-mocha';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        ignores: ['node_modules/', 'dist/', 'showcase/', 'docs-dist/', 'docs-sources/', '.claude/']
    },
    js.configs.recommended,
    mochaPlugin.configs.recommended,
    jsdocPlugin.configs['flat/recommended'],
    prettierConfig,
    {
        plugins: {
            prettier: prettierPlugin
        },
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.mocha
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
            'mocha/no-setup-in-describe': 'off',
            'mocha/max-top-level-suites': 'off',
            'prettier/prettier': ['error'],
            'jsdoc/tag-lines': 'off'
        }
    }
];
