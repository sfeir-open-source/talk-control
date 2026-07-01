# Étape 11 — Vuepress 1 → VitePress (DEC-007)

## Contexte

VuePress 1.x impose `file-loader@3` qui exige webpack 4, incompatible avec notre webpack 5.
Depuis l'étape 0, `npm install` nécessite `--legacy-peer-deps` à cause de ce conflit.
VitePress est le successeur officiel de l'équipe Vue : même syntaxe Markdown, aucune dépendance webpack.

## Décisions

| Décision | Choix | Raison |
|---|---|---|
| Outil de doc | VitePress | Successeur officiel VuePress, compatible Node 22+ |
| Génération JSDoc | `jsdoc-to-markdown` + script custom | `vuepress-jsdoc` est spécifique à VuePress 1.x |
| Config | ESM (`export default`) | VitePress requiert ESM, pas `module.exports` |
| `ignoreDeadLinks` | `'localhostLinks'` | `http://localhost:3000` dans users/README.md est attendu |

## Fichiers modifiés

| Fichier | Action |
|---|---|
| `docs-sources/.vuepress/config.js` | Supprimé |
| `docs-sources/.vitepress/config.js` | Créé (VitePress ESM config) |
| `scripts/jsdoc-build.mjs` | Créé (remplace vuepress-jsdoc) |
| `docs-sources/developers/README.md` | Lien jsdoc corrigé (vers source) |
| `docs-sources/developers/code/README.md` | Auto-généré par jsdoc-build.mjs |
| `package.json` | Scripts docs:dev, docs:build, jsdoc:build mis à jour |

## Scripts

```json
"docs:dev": "vitepress dev docs-sources",
"docs:build": "npm run jsdoc:build && vitepress build docs-sources --outDir ../docs-dist",
"jsdoc:build": "node scripts/jsdoc-build.mjs"
```

## Piège VitePress vs VuePress

VuePress acceptait `README.md` comme page d'index d'un répertoire (convention GitHub).
VitePress n'accepte que `index.md`.

Tous les `README.md` ont donc été renommés :

| Avant | Après |
|---|---|
| `docs-sources/README.md` | `docs-sources/index.md` |
| `docs-sources/users/README.md` | `docs-sources/users/index.md` |
| `docs-sources/developers/README.md` | `docs-sources/developers/index.md` |
| `docs-sources/developers/code/README.md` | `docs-sources/developers/code/index.md` (généré) |

Le script `jsdoc-build.mjs` écrit désormais `index.md` pour la page de référence API.

## Résultat

- `npm install` : passe **sans** `--legacy-peer-deps`
- `npm run docs:build` : OK (29 fichiers JSDoc générés + VitePress build en ~2s)
- `npm run docs:dev` : OK — toutes les pages s'affichent
- `NODE_ENV=test npm test` : 196/196 passing
- `npm run build` (webpack) : 16 erreurs pré-existantes (DEC-001, step 13)
