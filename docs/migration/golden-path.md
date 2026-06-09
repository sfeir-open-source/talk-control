# Golden path — contrat comportemental

> Document de référence pour la vérification manuelle à chaque étape de migration.
> Toute régression visible dans ce scénario = étape à ne pas merger.

## Environnement de test

- Node baseline: v20.10.0 (étape 0 — baseline fonctionnelle)
- Node cible: v24.x (étape finale migration)
- npm: 10.2.3 (Node 20) / 10.9.3 (Node 22)
- npm start : lance tc-server (:3001) + tc-controller-and-component (:3000) + tc-showcase (:3002)

## Notes d'exécution — Baseline Node 20.10.0 (2026-06-09)

**tc-server DÉMARRE sous Node 20.10.0** via `npx babel-node --ignore 'nothing' src/server/index.js`.

Validation :
```
curl http://localhost:3001/
→ Express répond "Cannot GET /" (route / non définie — comportement correct)
curl http://localhost:3001/patcher (sans URL)
→ "Invalid presentation URL" (validation correcte)
```

Le serveur démarre correctement. Le golden path est **vérifiable** sur Node 20.

### Différence Node 22 vs Node 20

Node 22 : tc-server NE DÉMARRE PAS (path-to-regexp incompatible — `app.all('*')`)
Node 20 : tc-server DÉMARRE (path-to-regexp compatible)

### AVERTISSEMENT Node 22 (pour référence)

Sur Node 22.18.0, le serveur crashe au démarrage :
```
PathError [TypeError]: Missing parameter name at index 1: *;
    at name (.../node_modules/path-to-regexp/src/index.ts:225:13)
    at Object.<anonymous> (.../src/server/controllers/proxy.controller.js:9:8)
```
Cause : route wildcard `app.all('*', ...)` dans proxy.controller.js (ligne 9).

## Pré-requis

1. `npm ci` propre (ou `npm install --legacy-peer-deps` sur Node 22 le temps de la migration)
2. `npm start` → les 3 services UP (vérifier logs : "listening on port 3001/3000/3002")

## Scénario 1 — Chargement initial

1. Ouvrir http://localhost:3000
2. Saisir URL slides : `http://localhost:3002/sample/index.html`
3. Valider le formulaire

**Attendu** : iframe chargée, slides Reveal.js visibles, URL de l'iframe contient `/patcher?tc-presentation-url=`

## Scénario 2 — Navigation horizontale

1. Appuyer flèche droite x3

**Attendu** : slide counter avance (h:1, h:2, h:3), slide visible dans iframe change

## Scénario 3 — Navigation verticale

1. Depuis un slide avec sous-slides, appuyer flèche bas

**Attendu** : h reste identique, v incrémente (v:1)

## Scénario 4 — Fragment

1. Appuyer espace

**Attendu** : fragment suivant révélé (f incrémente) OU slide suivant si pas de fragment

## Scénario 5 — Timer

1. Démarrer le timer

**Attendu** : affichage secondes croissantes

2. Pause

**Attendu** : timer figé

## Scénario 6 — Notes

1. Ouvrir la vue notes / on-stage

**Attendu** : notes du slide courant visibles

## Scénario 7 — Menu plugins

1. Ouvrir le menu plugins

**Attendu** : liste des plugins avec état autoActivate visible

## Scénario 8 — Touch pointer

1. Activer le plugin touch-pointer
2. Faire un drag dans l'iframe

**Attendu** : pointeur DOM visible côté iframe, suit le mouvement

## Scénario 9 — Multi-vues

1. Ouvrir on-stage.html dans un 2e onglet

**Attendu** : même état de slide, notes affichées

## Scénario 10 — Multi-client

1. Ouvrir 2 onglets controller pointant sur le même serveur
2. Naviguer dans l'onglet A

**Attendu** : onglet B reflète immédiatement l'état

## Notes d'exécution

- Dernière vérification manuelle complète : TODO (à remplir manuellement avant étape 1)
- Node version pour la baseline : v20.10.0
- tc-server démarre sous Node 20 : **OUI** (babel-node, répond sur :3001)
- tc-server démarre sous Node 22 : **NON** (path-to-regexp incompatible)
- Points d'attention identifiés :
  - `caniuse-lite` obsolète → Babel transpile async/await en generators → regeneratorRuntime manquant
  - `nyc` (`append-transform`) incompatible Node 20 → coverage 0% (migrer vers c8)
  - `npm ci` échoue (vuepress + webpack5 peer conflict) → utiliser `--legacy-peer-deps --ignore-scripts`
  - `path-to-regexp` incompatible Node 22 → proxy.controller.js ligne 9 (`app.all('*')`)
  - ESM resolver Node 22 bloque `module-alias/register` sans `.js` → tous les tests
