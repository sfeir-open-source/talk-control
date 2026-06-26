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

- `src/client/tc-controller/index.html` — `<script type="module" src="./index.js">`
- `src/client/layouts/on-stage/on-stage.html` — idem
- `src/client/layouts/presenter/presenter.html` — idem
- `src/client/layouts/presenter/presenter-mobile.html` — idem
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

## Pièges identifiés

| Problème | Cause | Solution |
|---|---|---|
| `vite.config.ts` → erreur ESM | `vite-tsconfig-paths@6` est ESM-only, projet CJS | Renommer en `.mts` |
| `@compat/lit-styles-compat` non résolu | `vite-tsconfig-paths` ne couvrait pas les fichiers JS | Ajouter `resolve.alias` explicites en complément |
| `"Server" is not exported by "__vite-browser-external"` | `socket.io` bundlé côté navigateur | Stub `src/compat/socket-io-browser-stub.js` via alias |
| HTML imbriqués dans `dist/src/...` | Vite préserve la structure de dossiers source | Plugin `flatHtmlOutput` avec `closeBundle` + réécriture des refs |

## Scripts mis à jour

| Script | Avant | Après |
|---|---|---|
| `build` | `npx webpack --config webpack.config.prod.cjs` | `vite build` |
| `tc-controller-and-component` | `npx webpack-dev-server --config webpack.config.dev.cjs` | `vite --port 3000` |
