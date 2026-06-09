# Migration TalkControl → Node 24 — Documentation

## Plan complet

→ [plan.md](plan.md) *(référencer le plan de migration existant dans le repo)*

## Baseline (étape 0.0)

| Document | Contenu |
|---|---|
| [baseline-tests.log](baseline-tests.log) | Sortie brute `npm test` avant toute migration — état Node 22 |
| [coverage-baseline.md](coverage-baseline.md) | Couverture globale + fichiers non couverts |
| [golden-path.md](golden-path.md) | Scénarios de vérification manuelle (contrat comportemental) |
| coverage-final.md | *(à créer en étape 0.4)* Baseline post-filet de sécurité |

## État de la migration

| Étape | Statut | Branche |
|---|---|---|
| 0.0 Audit | ✅ Done | chore/step-00-0-audit |
| 0.1 Tests unitaires critiques | ⏳ TODO | chore/step-00-1-unit-tests-critical |
| 0.2 Tests intégration | ⏳ TODO | chore/step-00-2-integration-tests |
| 0.3 E2E Playwright | ⏳ TODO | chore/step-00-3-e2e-playwright |
| 0.4 Coverage push 70% | ⏳ TODO | chore/step-00-4-coverage-push |
| 1 CI Node 22+24 | ⏳ TODO | chore/step-01-node-runtime |
| ... | ... | ... |

## Findings critiques étape 0.0

1. **npm ci échoue** sur Node 22 (conflict vuepress webpack4 vs webpack5) — utiliser `--legacy-peer-deps`
2. **0/20 tests s'exécutent** — incompatibilité ESM Node 22 (`module-alias/register` sans `.js` + aliases `@server/*`)
3. **tc-server ne démarre pas** — `path-to-regexp` incompatible avec Express 4 sur Node 22 (`app.all('*')`)
4. **45 fichiers src/ sans spec** sur 65 fichiers total (~69% sans couverture)
5. **CI historique cible Node 10/12/14** — jamais testée sur Node 16+
