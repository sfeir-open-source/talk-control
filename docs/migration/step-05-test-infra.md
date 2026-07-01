# Étape 5 — Test infra : chai 4→6 + jsdom 15→29

## Objectif

Mettre à jour l'infrastructure de test pour éliminer deux dépendances
désormais incompatibles avec Node 24 :

- **chai** `4.2.0` → `6.2.2`
- **jsdom** `15.2.0` → `29.1.1`

## Analyse préalable

### chai 6 : ESM-only

chai 5+ est distribué avec `"type": "module"` (ESM-only, pas de build CJS).
Les tests utilisent `import { expect } from 'chai'` (ESM), transpilé par
`@babel/register` en `require('chai')` au runtime.

**Pourquoi ça fonctionne sur Node 22+ :** Node 22.12+ supporte
`require(esm)` nativement (stabilisé sans flag). Notre Node 22.18 ✓.
Pour Node 24 (cible finale), le support est intégral.

Aucune modification du code de test n'est nécessaire.

### jsdom 29 : compatibilité Node

jsdom 29 requiert `^20.19.0 || ^22.13.0 || >=24.0.0`.
Notre Node 22.18 tombe dans `^22.13.0`. ✓

`jsdom-global 3.0.2` déclare `peerDependencies: { jsdom: ">=10.0.0" }` —
pleinement compatible avec jsdom 29.

La configuration mocha (`require: ['@babel/register', 'jsdom-global/register']`
dans `.mocharc.yml`) reste inchangée.

## Changements

| Fichier | Modification |
|---|---|
| `package.json` | `chai`: `^4.2.0` → `^6.2.2` |
| `package.json` | `jsdom`: `15.2.0` → `^29.1.1` |

## Résultat

```
196 passing (131ms)
```

Aucun test cassé. Aucune modification de code source nécessaire.

## Installation

```bash
npm install --legacy-peer-deps
```

Le flag `--legacy-peer-deps` reste obligatoire (conflit vuepress/webpack
non résolu à cette étape).
