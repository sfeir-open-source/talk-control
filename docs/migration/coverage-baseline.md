# Coverage baseline — 2026-06-09

> **IMPORTANT** : La couverture est mesurée sur Node v22.18.0 avec nyc + mocha.
> Aucun test ne s'exécute (incompatibilités ESM — voir baseline-tests.log).
> La couverture de code **réelle** (état des tests avant migration) est inconnue
> sur Node 22 ; elle ne peut être reconstituée qu'en rétablissant un environnement
> Node 14 ou en corrigeant le filet ESM (étape 0.1).

## Global (Node 22.18.0 — aucun test exécuté)

| Métrique   | % Node 22 | Note |
|------------|-----------|------|
| Statements | 0%        | 0 tests exécutés |
| Branches   | 0%        | 0 tests exécutés |
| Functions  | 0%        | 0 tests exécutés |
| Lines      | 0%        | 0 tests exécutés |

## Cause de la couverture nulle

```
Exception during run: Error: Cannot find module '.../module-alias/register'
```

L'outil nyc instrumente le code source mais mocha ne peut pas charger les spec files
car le resolver ESM de Node 22 bloque `import 'module-alias/register'` (sans `.js`).
Résultat : 0 ligne de code src/ n'est jamais exécutée.

## Top fichiers les MOINS couverts (dans src/) — tous à 0%

Puisque la couverture est 0% globale, voici les 20 fichiers les plus critiques
(estimés par complexité et importance architecturale) à prioriser pour le filet :

| Fichier | Lines% | Branches% | Spec existante ? |
|---|---|---|---|
| src/common/event-bus/event-bus.js | 0% | 0% | Oui (event-bus.spec.js) |
| src/common/event-bus/event-bus-proxy.js | 0% | 0% | Non |
| src/common/event-bus/event-bus-resolver.js | 0% | 0% | Oui (event-bus-resolver.spec.js) |
| src/common/event-bus/websockets/event-bus-websockets-server.js | 0% | 0% | Oui |
| src/common/event-bus/websockets/event-bus-websockets-client.js | 0% | 0% | Oui |
| src/common/event-bus/postmessage/event-bus-postmessage.js | 0% | 0% | Oui |
| src/server/tc-server.js | 0% | 0% | Oui (tc-server.spec.js) |
| src/server/controllers/patcher.controller.js | 0% | 0% | Oui |
| src/server/controllers/proxy.controller.js | 0% | 0% | Oui |
| src/server/engines/revealjs-server-engine.js | 0% | 0% | Oui |
| src/server/store/index.js | 0% | 0% | Non |
| src/client/engines/revealjs-client-engine.js | 0% | 0% | Oui |
| src/client/tc-controller/tc-controller.js | 0% | 0% | Oui |
| src/client/tc-component/tc-component.js | 0% | 0% | Oui |
| src/common/services/plugin.js | 0% | 0% | Oui (plugin.spec.js) |
| src/common/services/context.js | 0% | 0% | Oui (context.spec.js) |
| src/plugins/input/touch-pointer/index.js | 0% | 0% | Non |
| src/plugins/input/keyboard/index.js | 0% | 0% | Non |
| src/client/web-components/url-form/url-form.js | 0% | 0% | Non |
| src/client/web-components/slide-view/slide-view.js | 0% | 0% | Non |

## Fichiers src/ sans aucune spec dans test/ (44 fichiers)

Ces fichiers n'ont pas de test/**/*.spec.js correspondant :

```
src/client/engines/engine-resolver.js
src/client/layouts/on-stage/index.js
src/client/layouts/presenter/index.js
src/client/tc-component/index.js
src/client/tc-controller/bootstrap.js
src/client/tc-controller/index.js
src/client/web-components/clock/clock.js
src/client/web-components/loader/loader.js
src/client/web-components/loader/loader-tc-component.js
src/client/web-components/magic-info-tutorial/magic-info-tutorial.js
src/client/web-components/menu-navigation/menu-navigation.js
src/client/web-components/menu-plugins/menu-plugins.js
src/client/web-components/menu-plugins/menu-plugins-tc-component.js
src/client/web-components/notes/notes.js
src/client/web-components/notes/notes-tc-component.js
src/client/web-components/remote-control/remote-control.js
src/client/web-components/slide-view/slide-view.js
src/client/web-components/slide-view/slide-view-tc-component.js
src/client/web-components/timer/timer.js
src/client/web-components/timer/timer-tc-component.js
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
src/plugins/input/touch-pointer/components/touch-pointer-mask.js
src/plugins/input/touch-pointer/components/touch-pointer-mask-tc-component.js
src/plugins/input/touch-pointer/components/touch-pointer-settings.js
src/plugins/input/touch-pointer/components/touch-pointer-settings-tc-component.js
src/plugins/input/touch-pointer/index.js
src/plugins/input/touch/index.js
src/plugins/plugin.js
src/plugins/plugin-loader.js
src/server/bootstrap.js
src/server/engines/engine-resolver.js
src/server/engines/generic-server-engine.js
src/server/index.js
src/server/router.js
src/server/store/index.js
```

**Total : 45 fichiers src/*.js | 20 spec files | 45 fichiers sans spec**

## Prochain jalon

La couverture réelle ne peut être mesurée qu'après l'étape 0.1 (correction du filet ESM).
Le doc `coverage-final.md` sera créé à l'étape 0.4 avec les vraies métriques.
