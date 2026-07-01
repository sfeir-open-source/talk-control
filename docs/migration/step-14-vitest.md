# Étape 14 — Mocha + Sinon + chai + jsdom-global → Vitest (DEC-003)

**Date :** 2026-06-26 | **Branche :** update-node-20 | **Statut :** ✅ Done

## Résultat

- **196/196 tests verts** sous Vitest 4.1.9
- `make-stubbable.js` supprimé
- Aucune référence à `mocha` / `sinon` / `chai` dans `test/`
- `npm run lint` : 0 erreur
- `npm run build` : 0 erreur (warnings de taille pré-existants)

## Dépendances supprimées

| Package | Raison |
|---|---|
| `mocha` | remplacé par vitest |
| `sinon` | remplacé par `vi.*` |
| `chai` | remplacé par `expect` vitest |
| `jsdom-global` | remplacé par `environment: 'jsdom'` vitest |
| `c8` | remplacé par `@vitest/coverage-v8` |
| `eslint-plugin-mocha` | remplacé par `@vitest/eslint-plugin` |

## Dépendances ajoutées

| Package | Rôle |
|---|---|
| `vitest` | runner + assertions |
| `@vitest/coverage-v8` | couverture via V8 |
| `vite-tsconfig-paths` | résolution des alias `@services/*`, `@server/*`, etc. |
| `@vitest/eslint-plugin` | règle `vitest/expect-expect` (pas de test sans assertion) |

## Fichiers supprimés

- `.mocharc.yml`
- `.c8rc`
- `test/helpers/make-stubbable.js`

## Fichiers créés

- `vitest.config.ts` — globals, jsdom, tsconfig paths, couverture V8
- `test/helpers/test-utils.js` — helpers `spyOnAll` et `createStubInstance`

## Patterns de migration notables

### A. Auto-mock de module (`@plugins/plugin-loader`)
```js
vi.mock('@plugins/plugin-loader');
vi.mocked(loadPluginModule).mockResolvedValue({ instance: pluginInstance });
afterEach(() => vi.resetAllMocks());
```

### B. Spy sur export ESM non-configurable (`@services/config`)
```js
import * as configModule from '@services/config';
vi.mock('@services/config', async orig => ({ ...(await orig()) }));
vi.spyOn(configModule, 'config', 'get').mockReturnValue({...});
```
Nécessaire car esbuild compile les exports ESM en getters non-configurables. Le spread `...(await orig())` crée une copie mutable. `vi.spyOn(..., 'get')` intercepte l'accès à la propriété.

### C. Mock de constructeur (classes transport event-bus)
```js
vi.mock('@event-bus/websockets/event-bus-websockets-server');
vi.mocked(EventBusWebsocketsServer).mockImplementation(class { constructor() { return fakeBus; } });
```
**⚠️ `mockReturnValue` interdit avec `new` en Vitest 4.x** — utiliser `mockImplementation` avec une `class`.

### D. Stub du global `fetch`
```js
vi.stubGlobal('fetch', vi.fn());
afterAll(() => vi.unstubAllGlobals());
```

### E. Callbacks `done()` → tests synchrones
Les tests `proxy.integration.spec.js` qui utilisaient `done()` ont été réécrits en tests synchrones directs avec `vi.fn()` sur `proxy.web`.

## Pièges identifiés

| Sinon | Vitest | Différence |
|---|---|---|
| `spy.calledWith(a)` | `toHaveBeenCalledWith(a, b)` | Sinon = **partial match**, Vitest = **exact match** |
| `mockReturnValue(obj)` sur un constructeur | `mockImplementation(class { constructor() { return obj } })` | Vitest 4.x refuse `mockReturnValue` avec `new` |
| `vi.spyOn(obj, 'm')` | idem mais appelle l'original | Sinon noop par défaut, Vitest appelle l'original — ajouter `.mockImplementation(() => {})` |

## Fichiers de test convertis (25 fichiers)

### Étape 14.1 — Specs pures
- `test/server/store/store.spec.js`
- `test/server/store/actions.spec.js`
- `test/common/services/url.spec.js`
- `test/common/services/context.spec.js`
- `test/server/engines/engine-resolver.spec.js`
- `test/common/event-bus/event-bus.spec.js`
- `test/plugins/plugin-loader.spec.js`

### Étape 14.2 — Specs à spies/stubs locaux
- `test/common/services/logger.spec.js`
- `test/common/event-bus/event-bus-logger.spec.js`
- `test/server/engines/revealjs-server-engine.spec.js`
- `test/client/engines/generic-client-engine.spec.js`
- `test/client/engines/revealjs-client-engine.spec.js`
- `test/client/tc-component/tc-component.spec.js`
- `test/common/event-bus/postmessage/event-bus-postmessage.spec.js`
- `test/common/event-bus/websockets/event-bus-websockets-client.spec.js`
- `test/common/event-bus/websockets/event-bus-websockets-server.spec.js`

### Étape 14.3 — Specs faux timers + spyOnAll
- `test/server/tc-server.spec.js`
- `test/client/tc-controller/tc-controller.spec.js`

### Étape 14.4 — Specs vi.mock
- `test/common/services/plugin.spec.js`
- `test/server/controllers/patcher.controller.spec.js`
- `test/common/event-bus/event-bus-resolver.spec.js`

### Étape 14.5 — Specs controllers + intégration
- `test/server/controllers/proxy.controller.spec.js`
- `test/server/integration/patcher.integration.spec.js`
- `test/server/integration/router.integration.spec.js`
- `test/server/integration/proxy.integration.spec.js`
