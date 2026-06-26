# Étape 13 — Remplacement @granite-elements/granite-lit-bulma + lit-fontawesome (DEC-001)

## Problème

`lit-fontawesome@0.1.3` provoquait 16 erreurs webpack à cause d'un `url-loader` qui réclamait `file-loader` (absent) pour charger les fichiers de fonte. Ce package plante aussi en Node 22+ (`window is not defined`).

`@granite-elements/granite-lit-bulma` n'a plus de commit depuis 2020 ; Bulma est déjà une dépendance directe.

## Solution

### Bulma

`lit-styles-compat.js` importait `@granite-elements/granite-lit-bulma` pour obtenir un objet CSSResult compatible lit 3.
Remplacé par un import direct du CSS Bulma avec la query webpack `?raw` (`asset/source`), puis wrappé via `unsafeCSS()`.

Règle ajoutée dans `webpack.config.common.cjs` :
```js
{ test: /\.css$/i, resourceQuery: /raw/, type: 'asset/source' },
```

`lit-styles-compat.js` devient :
```js
import { unsafeCSS } from 'lit-element';
import bulmaCss from 'bulma/css/bulma.min.css?raw';
export const bulmaStyles = unsafeCSS(bulmaCss);
```

Les 11 composants consommateurs de `bulmaStyles` n'ont pas été modifiés.

### FontAwesome

Remplacé `lit-fontawesome` par `@fortawesome/fontawesome-svg-core` + `@fortawesome/free-solid-svg-icons`.

Les `<i class="fas fa-xxx">` dans les templates LitElement ont été remplacés par `${unsafeHTML(icon(faXxx).html[0])}` (directive `unsafeHTML` de `lit-html/directives/unsafe-html.js`).

Fichiers modifiés :
- `src/client/web-components/view-selector/view-selector.js` : `faChalkboard`, `faChalkboardTeacher`
- `src/client/web-components/menu-navigation/menu-navigation.js` : `faBars`, `faHome`, `faDesktop`, `faChalkboardTeacher`, `faMobileAlt`
- `src/client/web-components/menu-plugins/menu-plugins.js` : `faCube`
- `src/client/web-components/remote-control/remote-control.js` : suppression de `Fontawesome` dans `styles[]` (pas d'icônes dans le template)

Les 3 imports directs `lit-fontawesome/css/font.css` supprimés dans :
- `src/client/layouts/on-stage/index.js`
- `src/client/tc-controller/index.js`
- `src/client/layouts/presenter/index.js`

## Packages

Désinstallés : `@granite-elements/granite-lit-bulma`, `lit-fontawesome`  
Installés : `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`

## Noms d'icônes v5 → v6

Les noms v5 (`faChalkboardTeacher`, `faMobileAlt`) sont toujours présents dans free-solid-svg-icons v6 (aucun renommage nécessaire pour ce projet).

## Validation

- `NODE_ENV=test npm test` : 196/196 ✓
- `npm run lint` : 0 erreurs ✓
- `npm run build` : 0 erreurs ✓ (les 16 erreurs DEC-001 ont disparu)
