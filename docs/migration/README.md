# Migration TalkControl → Node 24 — Documentation

## Plan complet

→ [plan.md](plan.md) *(référencer le plan de migration existant dans le repo)*

## Baseline (étape 0.0)

| Document | Contenu |
|---|---|
| [baseline-tests.log](baseline-tests.log) | Sortie brute `npm test` avant toute migration — état Node 22 |
| [coverage-baseline.md](coverage-baseline.md) | Couverture globale + fichiers non couverts |
| [golden-path.md](golden-path.md) | Scénarios de vérification manuelle (contrat comportemental) |
| [coverage-final.md](coverage-final.md) | Baseline post-filet de sécurité (étape 0.4) |

## État de la migration

| Étape | Statut | Branche | Résultat |
|---|---|---|---|
| 0.0 Audit | ✅ Done | chore/step-00-0-audit | Baseline : 140/140 tests, 91.83% lignes |
| 0.1 Tests unitaires critiques | ✅ Done | mergé dans update-node-20 | +39 tests → 179 passing |
| 0.2 Tests intégration | ✅ Done | mergé dans update-node-20 | +17 tests → 157 passing (supertest) |
| 0.3 E2E Playwright | ✅ Done | mergé dans update-node-20 | +24 tests Playwright (chromium) |
| 0.4 Coverage push 70% | ✅ Done | mergé dans update-node-20 | c8 --all src/ (excl. browser), 70%/90%/60% |
| 1 CI Node 22+24 | ✅ Done | mergé dans update-node-20 | Fix OpenSSL 3 (md4→sha256 webpack), workflow matrix Node 22/24 |
| 2 Dépendances obsolètes | ✅ Done | chore/step-02-deps-upgrade | uws supprimé, socket.io 2→4, express 4.17→4.22, nodemon 1→3, patches sûrs |
| 3 Tooling qualité | ✅ Done | chore/step-03-tooling | prettier 1→3, eslint 6→8, husky 3→9, @babel/eslint-parser — 196/196 tests |
| 4 Webpack loaders | 🔜 Todo | — | css-loader 4→7, mini-css-extract-plugin 0.11→2 |
| 5 Test infra | 🔜 Todo | — | chai 4→6, jsdom 15→29 |
| 6 Transpileur + UI | 🔜 Todo | — | babel 7→8, lit-element 2→4 |

## Commandes de validation

```bash
# Lancer tous les tests
NODE_ENV=test npm test          # 196 passing (unit + integration)
npm run test:e2e                 # 24 passing (Playwright chromium)

# Coverage avec seuils (étape 0.4)
NODE_ENV=test npm run coverage   # rapport c8 (70% stmts/lines, 90% branches, 60% funcs)
npm run coverage:check           # vérifie les seuils seuls

# Valider le pipeline CI complet en local
bash scripts/validate-ci.sh     # 5/5 jobs : tests, build, smoke serveur, E2E

# Lancer l'app (Node 20 requis)
nvm use 20 && npm start          # http://localhost:3000
```

## Findings critiques étape 0.0

1. **npm ci échoue** sur Node 22 (conflict vuepress webpack4 vs webpack5) — utiliser `--legacy-peer-deps`
2. **0/20 tests s'exécutent** — incompatibilité ESM Node 22 (`module-alias/register` sans `.js` + aliases `@server/*`)
3. **tc-server ne démarre pas** — `path-to-regexp` incompatible avec Express 4 sur Node 22 (`app.all('*')`)
4. **45 fichiers src/ sans spec** sur 65 fichiers total (~69% sans couverture)
5. **CI historique cible Node 10/12/14** — jamais testée sur Node 16+
