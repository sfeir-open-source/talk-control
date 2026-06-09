# Coverage baseline — 2026-06-09
# Node: v20.10.0

> **IMPORTANT** : La couverture via `npm run coverage` (nyc) est **non-fonctionnelle**
> sous Node 20. `append-transform` (dépendance interne de nyc) est incompatible avec
> Node 20 et génère `TypeError [ERR_INVALID_ARG_TYPE]` lors du chargement.
> La couverture instrumentée retourne 0% pour tous les fichiers src/.
>
> Les **97 tests qui passent** (`npm test` sans nyc) constituent la baseline
> comportementale. La couverture chiffrée sera disponible après migration nyc → c8.

## Global (Node 20.10.0 — nyc incompatible)

| Métrique   | % Node 20 | Note |
|------------|-----------|------|
| Statements | 0%        | append-transform incompatible — ERR_INVALID_ARG_TYPE |
| Branches   | 0%        | idem |
| Functions  | 0%        | idem |
| Lines      | 0%        | idem |

## Erreur nyc sous Node 20

```
TypeError [ERR_INVALID_ARG_TYPE]: The "mod" argument must be an instance of Module.
    at makeRequireFunction (node:internal/modules/helpers:131:11)
    at Module._compile (node:internal/modules/cjs/loader:1366:19)
    at Module.replacementCompile (.../node_modules/append-transform/index.js:60:13)
    ...
```

`append-transform` tente de remplacer `Module._compile` avec une API interne Node
qui a changé de signature entre Node 14 et Node 20. Cela ne peut pas être corrigé
sans migrer vers `c8` (coverage via V8 native).

## Baseline fonctionnelle : 97 tests passent sous Node 20

| Spec file | Tests | Async ? | État |
|---|---|---|---|
| test/client/engines/generic-client-engine.spec.js | ? | Non | PASS |
| test/client/engines/revealjs-client-engine.spec.js | ? | Non | PASS |
| test/client/tc-component/tc-component.spec.js | ? | Non | PASS |
| test/common/event-bus/event-bus-logger.spec.js | ? | Non | PASS |
| test/common/event-bus/event-bus-resolver.spec.js | ? | Non | PASS |
| test/common/event-bus/event-bus.spec.js | ? | Non | PASS |
| test/common/event-bus/postmessage/event-bus-postmessage.spec.js | ? | Non | PASS |
| test/common/event-bus/websockets/event-bus-websockets-client.spec.js | ? | Non | PASS |
| test/common/event-bus/websockets/event-bus-websockets-server.spec.js | ? | Non | PASS |
| test/common/services/context.spec.js | ? | Non | PASS |
| test/common/services/logger.spec.js | ? | Non | PASS |
| test/common/services/url.spec.js | ? | Non | PASS |
| test/server/controllers/proxy.controller.spec.js | ? | Non | PASS |
| test/server/engines/revealjs-server-engine.spec.js | ? | Non | PASS |
| test/server/store/actions.spec.js | ? | Non | PASS |
| test/server/store/store.spec.js | ? | Non | PASS |
| test/client/tc-controller/tc-controller.spec.js | 21 | **Oui** | CRASH (regeneratorRuntime) |
| test/common/services/plugin.spec.js | 3 | **Oui** | CRASH (regeneratorRuntime) |
| test/server/tc-server.spec.js | 12 | **Oui** | CRASH (regeneratorRuntime) |
| test/server/controllers/patcher.controller.spec.js | 13 | **Oui** | CRASH (regeneratorRuntime) |

**Total estimé : ~146 tests dont 97 passent, ~49 non-exécutés (crash chargement)**

## Fichiers src/ sans aucune spec dans test/ (45 fichiers sur 64 total)

Ces 45 fichiers src/**/*.js n'ont pas de test/**/*.spec.js correspondant :

```
src/client/engines/engine-resolver.js
src/client/layouts/on-stage/index.js
src/client/layouts/presenter/index.js
src/client/tc-component/index.js
src/client/tc-controller/bootstrap.js
src/client/tc-controller/index.js
src/client/web-components/clock/clock.js
src/client/web-components/loader/loader-tc-component.js
src/client/web-components/loader/loader.js
src/client/web-components/magic-info-tutorial/magic-info-tutorial.js
src/client/web-components/menu-navigation/menu-navigation.js
src/client/web-components/menu-plugins/menu-plugins-tc-component.js
src/client/web-components/menu-plugins/menu-plugins.js
src/client/web-components/notes/notes-tc-component.js
src/client/web-components/notes/notes.js
src/client/web-components/remote-control/remote-control.js
src/client/web-components/slide-view/slide-view-tc-component.js
src/client/web-components/slide-view/slide-view.js
src/client/web-components/timer/timer-tc-component.js
src/client/web-components/timer/timer.js
src/client/web-components/url-form/url-form.js
src/client/web-components/view-selector/view-selector.js
src/common/event-bus/event-bus-component.js
src/common/event-bus/event-bus-proxy.js
src/common/services/config.js
src/common/services/presentation.js
src/environment/create-tunnels.js
src/environment/get-started.js
src/environment/services/config-file.js
src/environment/services/tunnel.js
src/plugins/input/keyboard/index.js
src/plugins/input/touch-pointer/components/touch-pointer-mask-tc-component.js
src/plugins/input/touch-pointer/components/touch-pointer-mask.js
src/plugins/input/touch-pointer/components/touch-pointer-settings-tc-component.js
src/plugins/input/touch-pointer/components/touch-pointer-settings.js
src/plugins/input/touch-pointer/index.js
src/plugins/input/touch/index.js
src/plugins/plugin-loader.js
src/plugins/plugin.js
src/server/bootstrap.js
src/server/engines/engine-resolver.js
src/server/engines/generic-server-engine.js
src/server/index.js
src/server/router.js
src/server/store/index.js
```

**Résumé : 64 fichiers src/*.js | 20 spec files | 19 fichiers avec spec directe | 45 sans spec**

## Top fichiers prioritaires sans spec (par importance architecturale)

| Fichier | Rôle | Priorité |
|---|---|---|
| src/common/event-bus/event-bus-proxy.js | Wrapping de tous les canaux event-bus | Haute |
| src/server/engines/generic-server-engine.js | Base engine serveur | Haute |
| src/server/engines/engine-resolver.js | Factory engines serveur | Haute |
| src/client/engines/engine-resolver.js | Factory engines client | Haute |
| src/server/store/index.js | Store Redux — coeur état serveur | Haute |
| src/common/services/presentation.js | Gestion URL présentation | Moyenne |
| src/plugins/plugin-loader.js | Chargement plugins | Moyenne |
| src/server/router.js | Routing Express | Moyenne |

## Prochain jalon

La couverture chiffrée sera disponible après :
1. Migration nyc → c8 (étape 1 de la migration Node 20 → 24)
2. Fix regeneratorRuntime dans .mocharc.yml (ajout de regenerator-runtime/runtime)

Le doc `coverage-final.md` sera créé après l'étape 1.
