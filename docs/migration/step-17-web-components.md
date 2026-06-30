# Étape 17 — Tests des web components LitElement

**Branche :** `chore/step-17-web-component-tests`  
**Date :** 2026-06-30  
**Résultat :** 196/196 tests jsdom, 23/23 tests browser (Vitest browser mode), 0 erreur TypeScript, 0 erreur lint, `npm run build` OK

---

## Contexte

Les 11 éléments custom LitElement dans `src/client/web-components/` n'avaient aucun test. DEC-002 prescrit Vitest browser mode pour les couvrir dans un vrai navigateur (Chromium headless via Playwright).

---

## Approche

Config séparée `vitest.browser.config.ts` → commande `npm run test:components`.  
Les tests jsdom existants (`npm test`) restent inchangés.

**Stratégie de test :**
- Smoke test : 11 composants × shadowRoot présent
- Tests comportementaux : `tc-timer`, `tc-slide`, `tc-url-form`

---

## Pièges rencontrés et solutions

### Vitest 4.x : API browser mode changée
Le provider n'est plus une string mais une factory importée depuis un package dédié :
```typescript
import { playwright } from '@vitest/browser-playwright';
// provider: playwright()  (appelé, pas passé comme valeur)
```
Package à installer : `@vitest/browser-playwright` (en plus de `@vitest/browser` et `playwright`).

### Vite 8 bundlé dans vitest 4.x
`vite-tsconfig-paths` ne supporte pas Vite 8. Remplacé par la résolution native :
```typescript
resolve: { tsconfigPaths: true }  // Vite 6+ natif
```

### EventBusResolver importe socket.io côté serveur
`EventBusResolver` importe `EventBusWebsocketsServer` (socket.io server) de façon inconditionnelle. Tous les TC components (`TimerTCComponent`, `SlideViewTCComponent`, etc.) héritent de `EventBusComponent` qui importe `EventBusResolver`.  
Solution : mock global dans `test/client/web-components/setup.ts` via `vi.mock('@event-bus/event-bus-resolver', ...)`.

### Tag `tc-magic-info` (pas `tc-magic-info-tutorial`)
Le composant `magic-info-tutorial.ts` enregistre `customElements.define('tc-magic-info', ...)`.

### Tests jsdom découvrent les smoke tests
Le pattern `test/**/*.spec.ts` du config jsdom captait aussi les smoke tests.  
Solution : `exclude: ['test/client/web-components/**']` dans `vitest.config.ts`.

### `tc-url-form` dispatche sur `window`
Les events `url-form-validated` et `url-form-editing` sont envoyés via `dispatchEvent(...)` global (= `window`), pas `this.dispatchEvent(...)`. Les tests écoutent sur `window`.

### `tc-slide` : `_loadFrame()` via `attributeChangedCallback`
La mise à jour de `iframe.src` ne passe pas par le cycle render de Lit — pas besoin de `await updateComplete` après `setAttribute('url', ...)`.

### `tc-timer` : reset + restart au 2e clic
`reset()` efface le compteur **et** relance immédiatement `startTimer()`. La vérification `00:00:00` doit être synchrone, avant le 1er tick du nouvel interval.

---

## Résultat par sous-étape

| Étape | Contenu | Tests |
|---|---|---|
| 17.0 | Config browser mode + script | 0 |
| 17.1 | Smoke tests 11 composants | 11 |
| 17.2 | `tc-timer` comportemental | +4 = 15 |
| 17.3 | `tc-slide` comportemental | +4 = 19 |
| 17.4 | `tc-url-form` comportemental | +4 = 23 |
| 17.5 | Couverture + CI | — |

---

## Fichiers créés/modifiés

```
vitest.browser.config.ts            # nouvelle config browser mode
vitest.config.ts                    # exclut test/client/web-components/**
package.json                        # script test:components, deps @vitest/browser*
test/client/web-components/
  setup.ts                          # mock global EventBusResolver
  smoke.spec.ts                     # 11 smoke tests
  timer.spec.ts                     # 4 tests comportementaux tc-timer
  slide-view.spec.ts                # 4 tests comportementaux tc-slide
  url-form.spec.ts                  # 4 tests comportementaux tc-url-form
.github/workflows/update-node-20.yml  # job web-components
```
