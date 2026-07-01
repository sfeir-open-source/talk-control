# Étape 6 — Babel 7→8 + lit-element 2→4

## Objectif

Moderniser la chaîne de transpilation (Babel 8) et le framework UI (lit-element 4 / Lit 3).

## Changements

### 6.1 — Babel 7→8

| Package | Avant | Après |
|---------|-------|-------|
| `@babel/core` | `^7.10.4` | `^8.0.1` |
| `@babel/cli` | `^7.10.4` | `^8.0.1` |
| `@babel/node` | `^7.10.4` | `^8.0.1` |
| `@babel/preset-env` | `^7.10.4` | `^8.0.1` |
| `@babel/register` | `^7.6.2` | `^8.0.1` |
| `@babel/eslint-parser` | `^7.29.7` | `^8.0.1` |
| `babel-eslint` | `^10.1.0` | **supprimé** |
| `babel-plugin-module-resolver` | `^3.2.0` | `^5.0.3` |

**`babel.config.js`** : alias `@compat` ajouté au `module-resolver`.
Format CJS (`module.exports = api => {}`) conservé — Babel 8 le supporte toujours.

**Compatibilité Babel 8** :
- Les tests utilisent `@babel/register` + `NODE_ENV=test`. La configuration `targets: { node: 'current' }` fonctionne identiquement.
- L'interop CJS/ESM de Babel 8 (`_interopRequireDefault`/`_interopRequireWildcard`) est stable pour les modules `__esModule: true` comme `node-fetch`.

### 6.2 — lit-element 2→4

| Package | Avant | Après |
|---------|-------|-------|
| `lit-element` | `^2.4.0` | `^4.2.2` |

**Pas de changement de syntaxe** : lit-element 4 re-exporte depuis `lit@3.x` les mêmes symboles (`LitElement`, `html`, `css`, `unsafeCSS`). Les imports `from 'lit-element'` sont inchangés.

**Shim CSS — `src/compat/lit-styles-compat.js`** :

`@granite-elements/granite-lit-bulma` et `lit-fontawesome` ont `lit-element@^2.x` en dépendance directe et produisent des `CSSResult` de lit 1.x. Or lit 3.x vérifie `instanceof CSSResult` depuis son propre scope — les anciens objets échouent ce test.

La solution : `unsafeCSS(oldCSSResult.cssText)` rewrappe le texte CSS brut dans un `CSSResult` compatible lit 3.

```js
// src/compat/lit-styles-compat.js
import { unsafeCSS } from 'lit-element';
import { bulmaStyles as _bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma.js';
import _Fontawesome from 'lit-fontawesome';

export const bulmaStyles = unsafeCSS(_bulmaStyles.cssText);
export const Fontawesome = unsafeCSS(_Fontawesome.cssText);
```

Tous les composants LitElement importent désormais depuis `@compat/lit-styles-compat` (alias résolu par babel-plugin-module-resolver et webpack).

**`webpack.config.common.js`** : alias `@compat` ajouté à `resolve.alias`.

## Résultats

- **Tests** : 196/196 (un test patcher est flaky par interaction — pré-existant, passe en isolation)
- **Build webpack** : `compiled with 2 warnings` (taille assets, pré-existant)
- **Babel** : `8.0.1 (@babel/core 8.0.1)`
- **lit-element** : `4.2.2` (lit@3.3.3 transitif)

## Notes

- `@granite-elements/granite-lit-bulma` et `lit-fontawesome` ne seront mis à jour que si une version lit 3.x compatible est publiée. Pour l'instant, le shim est suffisant.
- Le test flaky `patcher — should return presentation not found when fetch returns 404` échoue occasionnellement quand quelque chose tourne sur le port 3002 entre les tests. Pas lié à cette étape.
