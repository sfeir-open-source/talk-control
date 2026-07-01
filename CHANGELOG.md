# Changelog

All notable changes to this project are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.5.0] — 2026-07-01

Major infrastructure overhaul. The application logic is unchanged; everything below the surface has been modernized.

### Added

- **TypeScript strict** — all `src/` (73 files) and `test/` (27 files) migrated from JavaScript; `tsconfig.json` with `strict: true`
- **Vite 5** as bundler and dev server, replacing webpack 5
- **Vitest 4** as test runner, replacing Mocha + Chai + Sinon; 196 unit/integration tests + 23 browser-mode tests (LitElement web components)
- **Playwright E2E suite** — 24 tests covering smoke, navigation, accessibility, and components
- **ESLint 9 flat config** (`eslint.config.mjs`), replacing ESLint 6 + `.eslintrc`
- **VitePress** for documentation, replacing VuePress
- **Express 5** (previously Express 4.17); fixes `router.all('*')` incompatibility on Node 22+
- **Native fetch** (Node 24 built-in), replacing `node-fetch`
- **Socket.IO 4** (previously Socket.IO 2)
- **CI workflow** (`develop.yml`) for Node 24: Vitest jsdom, Vitest browser, Playwright E2E, Vite build, TypeScript check, coverage, server smoke test
- Full migration documentation in `docs/migration/`

### Changed

- **Node.js requirement**: 14 → **24 LTS**
- **npm install** now requires `--legacy-peer-deps` (peer conflict between `@vitest/browser-playwright` and `@playwright/test` on the `playwright` package)
- Dev server port: `1234` (webpack-dev-server) → **3000** (Vite)
- Docs port: `8080` (VuePress) → **5173** (VitePress default)
- `npm run docs:dev` now runs VitePress instead of VuePress

### Removed

- webpack (`webpack.config.*.js` deleted)
- Babel (`babel.config.js`, `@babel/core`, `@babel/preset-env`, `@babel/node`, `@babel/register`, `babel-node` removed)
- Mocha, Chai, Sinon, nyc (replaced by Vitest + v8 coverage)
- `node-fetch` (replaced by native `fetch`)
- `@webcomponents/webcomponentsjs` polyfills (unnecessary on modern browsers + Node 24)
- `@granite-elements/granite-lit-bulma` and `lit-fontawesome` (replaced by direct Bulma CSS + SVG icons)
- `uws` (incompatible with Node 22+)
- ESLint 6 + `.eslintrc` + `.eslintignore`
- VuePress + `vuepress-jsdoc`

### Migration notes

The `@playwright/test` binary is nested at `node_modules/@playwright/test/node_modules/.bin/playwright` because `@vitest/browser-playwright` hoists a different `playwright` version to the top-level `node_modules/.bin/`. The `test:e2e` npm script handles this transparently.

---

## [0.4.1] — 2024 and earlier

Previous releases. See git history for details.
