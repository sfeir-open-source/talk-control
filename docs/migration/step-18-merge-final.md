# Étape 18 — Merge final : update-node-20 → develop (v2.0.0)

## Objectif

Intégrer toutes les étapes 0–17 de la migration Node 24 + TypeScript dans la branche `develop`. Tagguer la version `v2.0.0` pour marquer la rupture majeure.

## Résumé des changements

### Bump de version
- `package.json` : `"version": "0.4.1"` → `"version": "2.0.0"`
- Justification : migration majeure (Node 24 LTS + TypeScript strict + Vite + Vitest)

### Correction du script `test:e2e`
- Problème : `node_modules/.bin/playwright` pointait vers `playwright@1.61.1` (installé pour `@vitest/browser-playwright`) et non vers `@playwright/test@1.61.0`, causant une erreur « Playwright Test did not expect test.describe() to be called here »
- Fix : le script utilise désormais le binaire interne à `@playwright/test` :
  ```
  node_modules/@playwright/test/node_modules/.bin/playwright test --config playwright.config.cjs
  ```

### Mise à jour des GitHub Actions workflows
- **Supprimés** (obsolètes, référencent Node 10–14 et webpack) :
  - `develop.yml` — Node 10/12/14, webpack
  - `master.yml` — Node 10/12/14, webpack
  - `push.yml` — rapport webpack stats (packtracker, token révoqué)
  - `v0.3.yml` — branche v0.3 archivée
- **Créé** : `develop.yml` (v2) — CI complet Node 24 pour la branche `develop` :
  - Vitest jsdom (196/196)
  - Vitest browser mode (23/23)
  - Playwright E2E (24/24)
  - Coverage (c8 --all, seuils 70%/90%/60%)
  - Vite build
  - TypeScript strict (`tsc --noEmit`)
  - Server smoke test (Express 5 + Node 24)

### Merge
- Merge `--no-ff` de `chore/step-18-merge-final` → `develop`
- Tag annoté `v2.0.0`

## Validation finale

| Check | Résultat |
|---|---|
| `npx tsc --noEmit` | ✅ 0 erreur |
| `npm run lint` | ✅ 0 erreur, 5 warnings JSDoc non bloquants |
| `npm test` | ✅ 196/196 Vitest jsdom |
| `npm run test:components` | ✅ 23/23 Vitest browser |
| `npm run test:e2e` | ✅ 24/24 Playwright E2E |
| `npm run build` | ✅ dist/ généré (537ms) |

## Stack finale

| Outil | Avant (v0.4.1) | Après (v2.0.0) |
|---|---|---|
| Node.js | 14.x | 24 LTS |
| TypeScript | non | strict: true |
| Bundler | webpack 5 | Vite 5.4 |
| Framework test | Mocha + Chai + Sinon | Vitest 4.1.9 |
| Linter | ESLint 6 | ESLint 9 flat config |
| Docs | VuePress | VitePress |
| Fetch | node-fetch | fetch natif Node 24 |

## Étapes de la migration (0–17)

Voir [README.md](README.md) pour le plan complet.
