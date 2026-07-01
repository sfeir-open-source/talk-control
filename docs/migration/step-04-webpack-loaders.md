# Étape 4 — Webpack loaders (css-loader + mini-css-extract-plugin)

## Objectif

Mettre à jour les loaders CSS webpack obsolètes pour assurer la compatibilité
avec webpack 5 et Node 24.

## Packages mis à jour

| Package | Avant | Après |
|---|---|---|
| `css-loader` | 4.3.0 | 7.1.4 |
| `mini-css-extract-plugin` | 0.11.3 | 2.10.2 |
| `webpack` | 5.0.0 | 5.107.2 |
| `html-webpack-plugin` | 4.5.0 | 5.6.7 |

> **Note :** webpack 5.0.0 était trop ancien pour mini-css-extract-plugin v2
> (`WeakSet.add` — API webpack interne changée entre 5.0 et 5.x). Upgrade vers
> 5.107.2 obligatoire. html-webpack-plugin v4 était incompatible avec
> webpack >= 5.x récent → upgrade vers v5 en conséquence.

## Breaking changes — analyse

### css-loader 4→7

- `esModule: true` par défaut depuis v5 (était `false` en v4). Transparent
  pour notre usage : import CSS plain sans modules, extraction via
  `MiniCssExtractPlugin.loader`.
- Requiert webpack ≥ 5 et Node ≥ 14. ✅

### mini-css-extract-plugin 0.11→2

- Requiert webpack ≥ 5. ✅
- `experimentalUseImportModule` supprimé en v2 (devenu le comportement par
  défaut). Non utilisé dans la config.
- API inchangée : `MiniCssExtractPlugin.loader` et `new MiniCssExtractPlugin()`.

### html-webpack-plugin 4→5

- v5 supporte officiellement webpack 5.
- Options `filename`, `template`, `chunks` inchangées.
- Templates HTML non modifiés.

## Config webpack

Aucun changement dans `webpack.config.common.js` — la règle CSS reste :

```js
{ test: /\.css$/i, use: [MiniCssExtractPlugin.loader, 'css-loader'] }
```

## Validation

```bash
npm run build        # webpack 5.107.2 — 0 erreurs, 2 warnings de taille (connus)
NODE_ENV=test npm test  # 196/196 passing
```

## Installation

```bash
npm install --legacy-peer-deps   # conflit vuepress toujours présent
```
