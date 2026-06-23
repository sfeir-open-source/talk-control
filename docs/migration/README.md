# Migration TalkControl → Node 24 — Documentation

## Baseline (étape 0.0)

| Document | Contenu |
|---|---|
| [baseline-tests.log](baseline-tests.log) | Sortie brute `npm test` avant toute migration — état Node 22 |
| [coverage-baseline.md](coverage-baseline.md) | Couverture globale + fichiers non couverts |
| [golden-path.md](golden-path.md) | Scénarios de vérification manuelle (contrat comportemental) |
| [coverage-final.md](coverage-final.md) | Baseline post-filet de sécurité (étape 0.4) |

## Plan complet

| Étape | Statut | Branche | Résultat / Contenu |
|---|---|---|---|
| 0.0 Audit | ✅ Done | chore/step-00-0-audit | Baseline : 140/140 tests, 91.83% lignes |
| 0.1 Tests unitaires | ✅ Done | mergé update-node-20 | +39 tests → 179 passing |
| 0.2 Tests intégration | ✅ Done | mergé update-node-20 | +17 tests → 157 passing (supertest) |
| 0.3 E2E Playwright | ✅ Done | mergé update-node-20 | +24 tests Playwright (chromium) |
| 0.4 Coverage 70% | ✅ Done | mergé update-node-20 | c8 --all src/, seuils 70%/90%/60% |
| 1 CI Node 22+24 | ✅ Done | mergé update-node-20 | Fix OpenSSL 3 (md4→sha256), workflow matrix Node 22/24 |
| 2 Dépendances obsolètes | ✅ Done | chore/step-02-deps-upgrade | uws supprimé, socket.io 2→4, express 4.17→4.22, nodemon 1→3 |
| 3 Tooling qualité | ✅ Done | chore/step-03-tooling | prettier 1→3, eslint 6→8, husky 3→9 — 196/196 tests |
| 4 Webpack loaders | ✅ Done | chore/step-04-webpack-loaders | css-loader 7, mini-css-extract 2, html-webpack-plugin 5 |
| 5 Test infra | ✅ Done | chore/step-05-test-infra | chai 4→6, jsdom 15→29 — 196/196 tests |
| 6 Transpileur + UI | ✅ Done | chore/step-06-babel8-lit4 | Babel 7→8, lit-element 2→4, shim CSS compat |
| 7 Suppression Babel | ✅ Done | chore/step-07-remove-babel | tsx + tsconfig paths, mocha 8→11 — 196/196 tests |
| 8 Express 4 → 5 | ✅ Done | chore/step-08-express5 | Fix bloquant `router.all('*')` Node 22+, DEC-004 |
| 9 node-fetch → fetch natif | ✅ Done | update-node-20 | `fetch` global, `stub(globalThis, 'fetch')` — 196/196 tests, DEC-005 |
| 10 Polyfills webcomponents | ✅ Done | update-node-20 | Supprime 2 imports × 13 composants + package retiré, DEC-006 — 196/196 tests |
| **11 Vuepress → VitePress** | 🔜 Todo | — | Vuepress 1.x cassé sur Node 22+, DEC-007 |
| **12 ESLint 8 → 9** | 🔜 Todo | — | Flat config, DEC-008 |
| **13 DEC-001 : Bulma + FA** | 🔜 Todo | — | Import direct bulma, SVG icons FontAwesome |
| **14 Mocha → Vitest** | 🔜 Todo | — | Supprime make-stubbable.js, mocking natif ESM, DEC-003 |
| **15 Webpack → Vite** | 🔜 Todo | — | Build front + dev server unifié, DEC-003 |
| **16 JavaScript → TypeScript** | 🔜 Todo | — | Renommage .js → .ts progressif, DEC-003 |
| **17 Tests web components** | 🔜 Todo | — | Vitest browser mode sur LitElement, DEC-002 |
| **18 Merge final** | 🔜 Todo | — | update-node-20 → develop, tag v2.0.0 |

## Commandes de validation

```bash
# Tests unitaires + intégration
NODE_ENV=test npm test          # 196 passing

# E2E
npm run test:e2e

# Coverage
NODE_ENV=test npm run coverage
npm run coverage:check

# Build webpack
npm run build

# Serveur (tsx, Node 22+)
npm run smoke:server            # port 3001
```

## Findings critiques étape 0.0

1. **npm ci échoue** sur Node 22 (conflict vuepress webpack4 vs webpack5) — utiliser `--legacy-peer-deps`
2. **tc-server ne démarre pas** — `path-to-regexp` incompatible avec Express 4 sur Node 22 (`router.all('*')`)
3. **45 fichiers src/ sans spec** sur 65 total (~69% sans couverture)
4. **CI historique cible Node 10/12/14** — jamais testée sur Node 16+
