# Étape 16 — Migration JavaScript → TypeScript

**Branche :** `update-node-20`  
**Date :** 2026-06-29  
**Résultat :** 196/196 tests, 0 erreur TypeScript, 0 erreur lint, `npm run build` OK

---

## Contexte

Après les étapes 14 (Vitest) et 15 (Vite), l'outillage TypeScript est en place (`tsx`, `tsconfig.json`, `vite-tsconfig-paths`). L'étape 16 migre les 73 fichiers `.js` de `src/` et les 27 fichiers `.js` de `test/` vers TypeScript avec `strict: true`.

---

## Approche

Migration **bottom-up par graphe de dépendances** : les feuilles d'abord, les racines ensuite. `strict: true` est activé dès 16.0, mais `checkJs: false` protège les `.js` restants pendant la transition.

```
src/compat/          → step 16.1
src/common/services/ → step 16.2
src/common/event-bus/ → step 16.3
src/plugins/         → step 16.4
src/environment/     → step 16.5
src/server/          → step 16.6
src/client/engines/ + layouts/ → step 16.7
src/client/web-components/ → step 16.8
src/client/tc-component/ + tc-controller/ → step 16.9
src/common/services/plugin.js (différé) → step 16.9
test/ (helpers + specs) → step 16.10
```

---

## Sous-étapes et commits

| Étape | Commit | Fichiers |
|---|---|---|
| 16.0 | `feat(ts): initialiser configuration TypeScript strict` | `tsconfig.json`, `package.json`, `eslint.config.mjs` |
| 16.1 | `feat(ts): migrer src/compat/` | 2 fichiers |
| 16.2 | `feat(ts): migrer src/common/services/` | 5 fichiers (plugin.js différé) |
| 16.3 | `feat(ts): migrer src/common/event-bus/` | 8 fichiers |
| 16.4 | `feat(ts): migrer src/plugins/` | 9 fichiers |
| 16.5 | `feat(ts): migrer src/environment/` | 4 fichiers + scripts `package.json` |
| 16.6 | `feat(ts): migrer src/server/` | 11 fichiers + scripts `package.json` |
| 16.7 | `feat(ts): migrer src/client/engines et layouts` | 5 fichiers |
| 16.8 | `feat(ts): migrer src/client/web-components/` | 16 fichiers |
| 16.9 | `feat(ts): migrer src/client/tc-component et tc-controller` | 6 fichiers + plugin.js |
| 16.10 | `feat(ts): migrer test/` | 27 fichiers + `tsconfig.json`, `vitest.config.ts` |

---

## Configuration TypeScript finale

```json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "checkJs": false,
    "resolveJsonModule": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022",
    "allowJs": true,
    "allowImportingTsExtensions": true,
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*", "test/**/*", "config/**/*"]
}
```

**Choix clés :**
- `moduleResolution: bundler` — résout les imports extensionless vers `.ts` sans changer les imports existants
- `allowImportingTsExtensions: true` — permet les imports `.ts` explicites dans les HTML `<script>` et les entrées Vite
- `checkJs: false` — zéro erreur dans les `.js` restants pendant la migration
- `types: ["vitest/globals"]` — expose `vi`, `describe`, `it`, `expect` sans import explicite dans les tests

---

## Patterns récurrents

### Propriétés de classe non initialisées

```typescript
// Avant
class Foo {
    bar;  // TypeScript strict : TS2564 "not definitely assigned"
}

// Après
class Foo {
    bar!: string;   // assertion d'affectation définitive
    // ou
    bar: string = '';  // valeur initiale
}
```

### Imports JSON dans TypeScript

```typescript
// @config/config (sans extension) → erreur en .ts
import config from '@config/config.json';  // toujours utiliser .json
```

### LitElement : conflit de propriété réactive avec HTMLElement

`focus` est une méthode de `HTMLElement`. Déclarer `focus: boolean` en propriété LitElement crée un conflit TypeScript :

```typescript
// Solution : renommer la propriété interne + mapper l'attribut HTML
class SlideViewComponent extends LitElement {
    _focus: boolean = false;
    static get properties() {
        return {
            _focus: { type: Boolean, attribute: 'focus' }
        };
    }
}
```

### http-proxy : pattern `export =`

`http-proxy` utilise `export = Server` :

```typescript
// Pas de httpProxy.Server
// Utiliser ReturnType :
function forwardTraffic(req, res, proxy: ReturnType<typeof httpProxy.createProxyServer>) { }
```

### redux-logger sans types

```typescript
// vite-env.d.ts
declare module 'redux-logger';
```

### Colors : bgBrightBlue absent des types

```typescript
// vite-env.d.ts
interface String {
    bgBrightBlue: string;
}
```

### window.Reveal (RevealJS global)

```typescript
// vite-env.d.ts
interface Window {
    Reveal: any;
}
```

### EventBus : callback typé `unknown`

Tous les callbacks `on('event', data => ...)` reçoivent `data: unknown`. Toujours caster :

```typescript
this.channel.on('gotoSlide', data => {
    const { slide } = data as { slide: unknown };
    // ...
});
```

### Extensions d'import dans les fichiers HTML

Après renommage, les `<script>` HTML doivent référencer l'extension `.ts` :

```html
<!-- on-stage.html — AVANT -->
<script type="module" src="/src/client/layouts/on-stage/index.js">
<!-- APRÈS -->
<script type="module" src="/src/client/layouts/on-stage/index.ts">
```

### Tests : variables de scope externe

```typescript
// Vitest : let déclaré hors beforeEach
let controller!: TCController;   // ! = affectation garantie en beforeEach
```

### Tests : objets mock ne respectant pas l'interface TypeScript

```typescript
// Les mocks structurels ne satisfont pas le type nominal
pluginService.activateOnController(pluginName, params as unknown as TCController);
```

---

## Difficultés rencontrées

### 1. Vite ne résout pas `.js` → `.ts` dans les fichiers `.js`

Dans un fichier `.ts`, un import `./foo.js` est résolu vers `./foo.ts` par TypeScript (`moduleResolution: bundler`). Mais dans un fichier `.js`, Vite cherche littéralement `foo.js`.

**Solution :** Lors du renommage d'un module `.ts`, mettre à jour les imports explicites `.js` dans les fichiers `.js` importateurs vers extensionless ou `.ts`.

### 2. `http.Server(app)` non constructible en TypeScript strict

`http.Server` est une classe — l'appel sans `new` est invalide en TypeScript strict.

**Solution :** `new http.Server(app)`

### 3. Dépendance circulaire `plugin.js ↔ tc-component.js`

`plugin.js` importe `TCComponent` et `TCController`. Ces classes importent `pluginService`. TypeScript gère les cycles de types avec résolution lazy — pas de changement de code nécessaire, juste de la vigilance sur l'ordre d'initialisation.

**Décision :** `plugin.js` migré en dernier (après `tc-component.ts` et `tc-controller.ts`).

### 4. `ChannelOptions.server` typé `HttpServer` mais passé `string` côté client

`EventBusResolver.channel()` déclare `server?: HttpServer` mais le client passe une URL string (castée en `as unknown as string` en interne).

**Solution :** Élargir le type : `server?: HttpServer | string` et ajouter le cast explicite côté serveur.

### 5. Suppression du second argument erroné à `deactivateOnController`

L'ancien JS passait `pluginService.deactivateOnController(pluginName, this)` mais la fonction ne prend qu'un argument. TypeScript l'a révélé. Le test correspondant attendait 2 arguments — corrigé en même temps.

---

## Résultat final

| Métrique | Valeur |
|---|---|
| Fichiers `.ts` dans `src/` | 73 |
| Fichiers `.ts` dans `test/` | 27 |
| Fichiers `.js` restants dans `src/` | 0 |
| Fichiers `.js` restants dans `test/` | 0 |
| Tests | 196/196 ✅ |
| `npx tsc --noEmit` | 0 erreur ✅ |
| `npm run lint` | 0 erreur ✅ |
| `npm run build` | dist/ généré ✅ |
