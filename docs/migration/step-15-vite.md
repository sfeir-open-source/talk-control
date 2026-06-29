# Étape 15 — Webpack → Vite (DEC-003)

**Date :** 2026-06-26 | **Branche :** update-node-20 | **Statut :** ✅ Done

## Résultat

- **196/196 tests verts** sous Vitest 4.1.9
- `npm run lint` : 0 erreur
- `npm run build` : success (Vite 5.4.21)
- `dist/` produit le même périmètre de bundles qu'avant

## Dépendances supprimées

| Package | Raison |
|---|---|
| `webpack` | remplacé par vite build |
| `webpack-cli` | idem |
| `webpack-dev-server` | remplacé par `vite --port 3000` |
| `webpack-bundle-analyzer` | outil webpack uniquement |
| `clean-webpack-plugin` | `build.emptyOutDir: true` dans Vite |
| `css-loader` | Vite gère CSS nativement |
| `mini-css-extract-plugin` | Vite extrait le CSS nativement |
| `html-webpack-plugin` | Vite utilise les HTML comme entrées directes |
| `url-loader` | Vite gère les assets nativement |
| `@vue/component-compiler-utils` | résidu webpack (jamais utilisé directement) |

## Dépendances ajoutées

| Package | Rôle |
|---|---|
| `vite@5` | build + dev server |

`vite-tsconfig-paths` était déjà en devDependencies (étape 14).
`vite` était déjà transitif via `vitepress` — ajout explicite.

## Fichiers supprimés

- `webpack.config.common.cjs`
- `webpack.config.dev.cjs`
- `webpack.config.prod.cjs`

## Fichiers créés

- `vite.config.mts` — config Vite (`.mts` = ESM explicite, nécessaire car
  `vite-tsconfig-paths@6` est ESM-only et le projet est `type: commonjs`)
- `src/compat/socket-io-browser-stub.js` — stub vide `{ Server, Socket }`
  pour remplacer `socket.io` côté navigateur

## Fichiers modifiés

- `src/client/tc-controller/index.html` — `<script type="module" src="/src/client/tc-controller/index.js">`
- `src/client/layouts/on-stage/on-stage.html` — `<script type="module" src="/src/client/layouts/on-stage/index.js">`
- `src/client/layouts/presenter/presenter.html` — `<script type="module" src="/src/client/layouts/presenter/index.js">`
- `src/client/layouts/presenter/presenter-mobile.html` — idem presenter.html
- `src/client/tc-component/index.js` — suppression de `__webpack_public_path__`
- `package.json` — scripts `build` et `tc-controller-and-component` mis à jour

## Architecture de `vite.config.mts`

### Entrées multi-page (rollupOptions.input)

| Clé | Fichier source | Bundle JS produit |
|---|---|---|
| `tc-controller` | `src/client/tc-controller/index.html` | `tc-controller.bundle.js` |
| `on-stage` | `src/client/layouts/on-stage/on-stage.html` | `on-stage.bundle.js` |
| `presenter` | `src/client/layouts/presenter/presenter.html` | partage des chunks |
| `presenter-mobile` | `src/client/layouts/presenter/presenter-mobile.html` | partage des chunks |
| `tc-component` | `src/client/tc-component/index.js` | `tc-component.bundle.js` |

### Plugin `flatHtmlOutput`

Vite génère les HTML en préservant le chemin source (`dist/src/client/.../foo.html`).
Le plugin `closeBundle` déplace chaque HTML à la racine de `dist/` et réécrit
les références relatives (`../../../` → `./`) en calculant la profondeur du
chemin original.

Résultat : `dist/index.html`, `dist/on-stage.html`, `dist/presenter.html`,
`dist/presenter-mobile.html` — identique à la sortie webpack.

### Alias `socket.io` → stub navigateur

`event-bus-resolver.js` importe statiquement `EventBusWebsocketsServer`
(qui importe `{ Server }` de `socket.io`). En production, le code serveur
n'est jamais exécuté côté navigateur (guard `isClientSide()`), mais le
bundler ne peut pas le savoir statiquement.

Webpack résolvait ce problème via `"browser": { "socket.io": false }` dans
`package.json`. Vite requiert un alias explicite :
```
'socket.io' → src/compat/socket-io-browser-stub.js
```
Le stub exporte des classes vides `Server` et `Socket` pour satisfaire l'import.

### `__webpack_public_path__`

Dans `tc-component/index.js`, la ligne webpack-specific était :
```js
__webpack_public_path__ = window.tcResourcePath;
```
Vite utilise `base: './'` → les chunks sont chargés relativement à l'URL
du bundle courant. Quand le patcher charge `tc-component.bundle.js` depuis
`componentUrl/`, tous les chunks relatifs pointent vers `componentUrl/`.
Comportement équivalent, sans variable globale webpack.

## Output `dist/` — comparaison webpack vs Vite

| Fichier | Webpack | Vite | Notes |
|---|---|---|---|
| `index.html` | ✅ | ✅ | Contrôleur |
| `on-stage.html` | ✅ | ✅ | |
| `presenter.html` | ✅ | ✅ | |
| `presenter-mobile.html` | ✅ | ✅ | |
| `tc-component.bundle.js` | ✅ | ✅ | Injecté par le patcher |
| `tc-controller.bundle.js` | ✅ | ✅ | |
| `on-stage.bundle.js` | ✅ | ✅ | |
| CSS extrait | `*.css` flat | `*.css` flat | Même position |
| Assets | `assets/` | `assets/` | |
| Chunks partagés | `NNN.bundle.js` | `name-hash.bundle.js` | Nommage différent, fonctionnel identique |

### Plugin `devUrlRewrite`

Webpack-dev-server servait les HTML à la racine par convention (`/` → `index.html`).
Vite sert les fichiers depuis leur chemin source (`/src/client/tc-controller/index.html`).

Le plugin `devUrlRewrite` ajoute un middleware qui réécrit les URLs plate
vers les chemins source :

| URL demandée | Rewrite vers |
|---|---|
| `/` | `/src/client/tc-controller/index.html` |
| `/index.html` | `/src/client/tc-controller/index.html` |
| `/on-stage.html` | `/src/client/layouts/on-stage/on-stage.html` |
| `/presenter.html` | `/src/client/layouts/presenter/presenter.html` |
| `/presenter-mobile.html` | `/src/client/layouts/presenter/presenter-mobile.html` |

### Chemins absolus dans les `<script>` HTML

Les balises `<script src="./index.js">` utilisaient des chemins relatifs.
En dev, quand le browser est à l'URL `/` (rewritten depuis `/src/client/tc-controller/index.html`),
le relatif `./index.js` résout en `/index.js` → 404.

Solution : chemins absolus depuis la racine du projet (`/src/client/tc-controller/index.js`).
Vite résout ces chemins absolus depuis la racine du projet en dev, et les bundle correctement en prod.

### Patcher et `tc-component.bundle.js` — régression mode magique

Webpack produisait `tc-component.bundle.js` au format IIFE/UMD (script classique).
Vite le produit en **ESM** (commence par `import{...}from"..."`).

Le patcher (`src/server/controllers/patcher.controller.js`) injectait :
```html
<script type="application/javascript" src="…/tc-component.bundle.js"></script>
```
Un script classique ne peut pas contenir de `import` → SyntaxError, le composant
ne se chargeait jamais → le mode magique restait bloqué sur l'écran d'erreur.

**Fix :** `type="module"` sur le script injecté. Les chunks ESM se résolvent
relativement à l'URL du module (pas à `window.tcResourcePath`), donc la variable
webpack `window.tcResourcePath` a aussi été supprimée.

**Dev mode :** Vite ne génère pas de fichier bundle. Le `devUrlRewrite` mappe
`/tc-component.bundle.js` → `/src/client/tc-component/index.js` (source ESM)
pour que le patcher fonctionne aussi en dev sans build intermédiaire.

## Pièges identifiés

| Problème | Cause | Solution |
|---|---|---|
| `vite.config.ts` → erreur ESM | `vite-tsconfig-paths@6` est ESM-only, projet CJS | Renommer en `.mts` |
| `@compat/lit-styles-compat` non résolu | `vite-tsconfig-paths` ne couvrait pas les fichiers JS | Ajouter `resolve.alias` explicites en complément |
| `"Server" is not exported by "__vite-browser-external"` | `socket.io` bundlé côté navigateur | Stub `src/compat/socket-io-browser-stub.js` via alias |
| HTML imbriqués dans `dist/src/...` | Vite préserve la structure de dossiers source | Plugin `flatHtmlOutput` avec `closeBundle` + réécriture des refs |
| `http://localhost:3000/` → 404 | Vite sert depuis les chemins source, pas les URLs plate | Plugin `devUrlRewrite` avec middleware `configureServer` |
| `/index.js` → 404 en dev | Chemin relatif résout depuis l'URL browser (`/`), pas le chemin source | `<script src="/src/client/.../index.js">` (chemin absolu) |
| Mode magique cassé (SyntaxError ESM) | Patcher injectait `type="application/javascript"` mais bundle Vite est ESM | `type="module"` dans `injectComponent` + `window.tcResourcePath` supprimé |
| `/tc-component.bundle.js` → 404 en dev | Vite dev ne génère pas de bundle | `devUrlRewrite` mappe vers le source ESM (`/src/client/tc-component/index.js`) |

## Scripts mis à jour

| Script | Avant | Après |
|---|---|---|
| `build` | `npx webpack --config webpack.config.prod.cjs` | `vite build` |
| `tc-controller-and-component` | `npx webpack-dev-server --config webpack.config.dev.cjs` | `vite --port 3000` |
