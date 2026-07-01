# Étape 17 — Tests des web components LitElement (DEC-002)

**Date :** 2026-06-30 | **Branche :** `chore/step-17-web-component-tests` | **Statut :** ✅ Done

## Résultat

- **196/196 tests jsdom** (inchangés)
- **23/23 tests browser** (Vitest browser mode, Chromium headless)
- `npm run lint` : 0 erreur
- `npx tsc --noEmit` : 0 erreur
- `npm run build` : 0 erreur

---

## Contexte

Les 11 éléments custom LitElement dans `src/client/web-components/` n'avaient aucun test. DEC-002 prescrit Vitest browser mode pour les couvrir dans un vrai navigateur (Chromium headless via Playwright), cohérent avec l'outillage Vite déjà en place (étape 15).

---

## Dépendances ajoutées

| Package | Rôle |
|---|---|
| `@vitest/browser` | runner browser mode |
| `@vitest/browser-playwright` | factory provider Playwright (API Vitest 4.x) |
| `playwright` | core Playwright (distinct de `@playwright/test` déjà présent) |

---

## Approche

Config séparée `vitest.browser.config.ts` → commande `npm run test:components`.  
Les tests jsdom existants (`npm test`) restent inchangés.

**Stratégie de test :**
- Smoke test : 11 composants × `shadowRoot` présent
- Tests comportementaux : `tc-timer`, `tc-slide`, `tc-url-form`

---

## Sous-étapes et commits

| Étape | Commit | Contenu |
|---|---|---|
| 17.0 | `d461c80` | Config browser mode, script `test:components`, packages |
| 17.1 | `f45b55d` | Smoke tests 11 composants, setup.ts, fix jsdom exclusion |
| 17.2 | `045559d` | Tests comportementaux `tc-timer` |
| 17.3 | `498ecb4` | Tests comportementaux `tc-slide` |
| 17.4 | `1f95d77` | Tests comportementaux `tc-url-form` |
| 17.5 | `dfcd1ba` | Couverture étendue aux web components, job CI |
| 17.6 | `476521b` | Documentation |
| review | `3e69748` | Fix code review (mock broadcast, COMPONENT_CONTROLLER, timers) |
| fix | `9a135e5` | Retrait `@ts-expect-error` stale |

---

## Pièges rencontrés et solutions

### Vitest 4.x : API browser mode changée
Le provider n'est plus une string mais une factory importée depuis un package dédié :
```typescript
import { playwright } from '@vitest/browser-playwright';
// provider: playwright()  (appelé, pas passé comme valeur)
// instances: [{ browser: 'chromium' }]  (remplace name: 'chromium')
```

### Vite 8 bundlé dans vitest 4.x
`vite-tsconfig-paths` ne supporte pas Vite 8. Remplacé par la résolution native :
```typescript
resolve: { tsconfigPaths: true }  // option native Vite 6+, typée dans Vite 8
```

### EventBusResolver importe socket.io côté serveur
`EventBusResolver` importe `EventBusWebsocketsServer` de façon inconditionnelle. Tous les TC components héritent de `EventBusComponent` → `EventBusResolver` → socket.io server.  
Solution : mock global dans `test/client/web-components/setup.ts` :
```typescript
vi.mock('@event-bus/event-bus-resolver', () => ({
    EventBusResolver: { channel: vi.fn().mockReturnValue({ on: vi.fn(), broadcast: vi.fn(), emitTo: vi.fn() }), init: vi.fn() },
    Channels: { CONTROLLER_SERVER: 'CONTROLLER_SERVER', CONTROLLER_COMPONENT: 'CONTROLLER_COMPONENT' }
}));
```

### Tests jsdom découvrent les smoke tests
Le pattern `test/**/*.spec.ts` du config jsdom captait aussi les browser tests.  
Solution : `exclude: ['test/client/web-components/**']` dans `vitest.config.ts`.

### Tag `tc-magic-info` (pas `tc-magic-info-tutorial`)
Le composant `magic-info-tutorial.ts` enregistre `customElements.define('tc-magic-info', ...)`.

### `tc-url-form` dispatche sur `window`
Les events `url-form-validated` et `url-form-editing` sont envoyés via `dispatchEvent(...)` global (= `window`), pas `this.dispatchEvent(...)`. Les tests écoutent sur `window`.

### `tc-slide` : `_loadFrame()` via `attributeChangedCallback`
La mise à jour de `iframe.src` ne passe pas par le cycle render de Lit — pas besoin de `await updateComplete` après `setAttribute('url', ...)`.

### `tc-timer` : reset + restart au 2e clic
`reset()` efface le compteur **et** relance immédiatement `startTimer()`. La vérification `00:00:00` doit être synchrone, avant le 1er tick du nouvel interval. `vi.useRealTimers()` dans `afterEach` garantit le cleanup même en cas d'assertion qui fail.

---

## Fichiers créés/modifiés

```
vitest.browser.config.ts                  # nouvelle config browser mode
vitest.config.ts                          # exclut test/client/web-components/**
package.json                              # script test:components, deps @vitest/browser*
.gitignore                                # ignore test-results/, __screenshots__/
test/client/web-components/
  setup.ts                                # mock global EventBusResolver + contextService
  smoke.spec.ts                           # 11 smoke tests
  timer.spec.ts                           # 4 tests comportementaux tc-timer
  slide-view.spec.ts                      # 4 tests comportementaux tc-slide
  url-form.spec.ts                        # 4 tests comportementaux tc-url-form
.github/workflows/update-node-20.yml      # job web-components (browser mode)
```

---

## Bugs pré-existants découverts (hors scope)

| Composant | Bug | Impact |
|---|---|---|
| `slide-view.ts:57` | `_loadFrame()` accède à `this.frame` avant `firstUpdated()` — crash si attribut `url` posé en HTML statique | Faible (usage dynamique en pratique) |
| `clock.ts`, `timer.ts` | `setInterval` sans `disconnectedCallback` → interval fantôme après retrait du DOM | Fuite mémoire/CPU en SPA |
| `slide-view.ts:73` | `document.addEventListener('click', fn)` anonyme, jamais retiré → fuite de listeners | Fuite en navigation SPA |
