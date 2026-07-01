# Coverage baseline — 2026-06-09
# Node: v20.10.0 | Outil: c8 (nyc incompatible Node 20)

> Commande de mesure : `NODE_ENV=test npx c8 npx mocha`
> `nyc` est incompatible Node 20. `c8` est le remplacement prévu à l'étape 0.4.

## Global (fichiers chargés durant les tests)

| Métrique   | Baseline Node 20 |
|------------|-----------------|
| Statements | **91.83 %**     |
| Branches   | **90.69 %**     |
| Functions  | **79.34 %**     |
| Lines      | **91.83 %**     |

Tests : **140 / 140 passing** (après fix babel targets:node:current pour env test)

## Fichiers sous 100% — cibles prioritaires step 0.1

| Fichier | Lines % | Branches % | Lignes non couvertes |
|---|---|---|---|
| plugin-loader.js | 33.33 | 100 | 6-10, 12-18 |
| revealjs-server-engine.js | 65.71 | 100 | 108-120, 122-128 |
| event-bus-websockets-server.js | 80.17 | 56.25 | 40-60, 77, 79-82, 105-106 |
| revealjs-client-engine.js | 89.87 | 75 | 48-49, 64-66, 74-76 |
| plugin.js | 89.23 | 100 | 21, 31, 40-43, 60 |
| tc-component.js | 87.5 | 80 | 30-34 |
| engine-resolver.js (server) | 85 | 100 | 18-20 |
| event-bus-websockets-client.js | 97.29 | 77.77 | 49-50 |
| proxy.controller.js | 100 | 66.66 | branche l.15 |

## Fichiers déjà à 100% lignes ET branches

- engine-resolver.js (client), event-bus-postmessage.js, event-bus-component.js
- actions.js, patcher.controller.js, tc-server.js
- config.js, context.js, logger.js, url.js

## Seuil de non-régression

| Seuil | Valeur |
|---|---|
| Tests passing | 140 / 140 |
| Lines (fichiers chargés) | >= 91% |
| Branches | >= 90% |
| Objectif step 0.4 | >= 70% global avec --all src/ |
