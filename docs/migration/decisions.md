# Décisions techniques — Migration Node 24

Ce fichier trace les décisions d'architecture prises pendant la migration.
Format : contexte → options évaluées → décision → conséquences.

---

## DEC-001 — Remplacement de `@granite-elements/granite-lit-bulma` et `lit-fontawesome`

**Date :** 2026-06-18 | **Étape :** 13 | **Statut :** décidé, pas encore implémenté

### Contexte

L'étape 6 a introduit `src/compat/lit-styles-compat.js` pour contourner l'incompatibilité `CSSResult` entre lit-element 2.x et lit 3.x. Ces deux packages n'apportent aucune logique propre.

- `@granite-elements/granite-lit-bulma` : juste du CSS Bulma empaqueté. Dernier commit 2020. `bulma` est déjà dans les `dependencies`.
- `lit-fontawesome` : Font Awesome 5 CSS complet empaqueté. Plante en Node 22+ (`window is not defined`).
- 7 icônes `fas` utilisées au total, dans 3 composants.

### Décision

- **Bulma** : importer `bulma/css/bulma.min.css` directement via css-loader + `unsafeCSS`. Supprimer `@granite-elements/granite-lit-bulma`.
- **Font Awesome** : migrer vers `@fortawesome/fontawesome-svg-core` + `@fortawesome/free-solid-svg-icons`. Remplacer `<i class="fas fa-xxx">` par `unsafeHTML(icon(faXxx).html[0])` dans les 3 composants. 7 icônes = ~5 KB vs ~400 KB CSS actuel.

### Conséquences

- 2 packages abandonnés supprimés, CSS Bulma aligné sur la vraie version
- 13 occurrences à migrer dans les templates LitElement
- `src/compat/lit-styles-compat.js` mis à jour ou supprimé

---

## DEC-002 — Tests des composants LitElement

**Date :** 2026-06-18 | **Étape :** 17 | **Statut :** décidé, pas encore implémenté

### Contexte

13 composants LitElement sans aucun test. La seule vérification existante est le build webpack. Identifié lors de DEC-001 : une régression de rendu passerait inaperçue.

### Décision

Après la migration Vitest (étape 14), utiliser le **browser mode de Vitest** pour les composants LitElement — cohérent avec l'outillage Vite déjà en place (étape 15).

**Périmètre minimal :**
- Smoke test par composant (rendu sans erreur, élément présent dans le DOM)
- Tests comportementaux sur `timer`, `slide-view`, `url-form` (état mutable)

### Conséquences

- Commande `npm run test:components` distincte des tests serveur
- CI : job supplémentaire
- Couverture réelle du code frontend pour la première fois

---

## DEC-003 — Migration TypeScript + Vite

**Date :** 2026-06-23 | **Étapes :** 14 (Vitest), 15 (Vite), 16 (TypeScript) | **Statut :** étapes 14 et 15 implémentées (2026-06-26)

### Contexte

L'étape 7 a introduit `test/helpers/make-stubbable.js` — un double patch `Object.defineProperty` + `Module._load` parce que esbuild crée des exports en live bindings incompatibles avec sinon 9. Signal clair que Mocha + Sinon + esbuild ne cohabitent pas proprement en ESM.

### Décision

**Étape 14 — Mocha → Vitest**
- `vitest` remplace `mocha` + `sinon` + `jsdom-global`
- `vi.mock()` mocke au niveau de la résolution des modules — pas de problème de getters esbuild
- `make-stubbable.js` supprimé
- `.mocharc.yml` → `vitest.config.ts`

**Étape 15 — Webpack → Vite**
- `vite` remplace webpack pour le build front et le dev server
- `webpack.config.*.cjs` supprimés, `vite.config.ts` créé
- Partage les mêmes `resolve.alias` que `tsconfig.json` — zéro config dupliquée

**Étape 16 — JavaScript → TypeScript**
- `allowJs: true` dans tsconfig → migration fichier par fichier sans blocage
- `src/` d'abord (code serveur + common), `test/` ensuite
- Types stricts sur le code nouveau, `any` permissif sur l'existant

### Conséquences

- `make-stubbable.js` supprimé dès l'étape 14
- `tsconfig.json` déjà en place depuis l'étape 7 — base prête
- Vuepress 1.x (mort, cassé Node 22+) adressé séparément en étape 11

---

## DEC-004 — Express 4 → Express 5

**Date :** 2026-06-23 | **Étape :** 8 | **Statut :** décidé, pas encore implémenté

### Contexte

`proxy.controller.js` utilise `router.all('*')`. Cette syntaxe est incompatible avec `path-to-regexp` v8+ sous Node 22+ : le `*` non échappé lève une erreur. C'est un **bloqueur** pour faire tourner le serveur sur Node 22.

La correction locale serait `router.all('/{*splat}')` ou une regex. Mais Express 5 (stable depuis fin 2024) a revu complètement la gestion des routes et intègre `path-to-regexp` v8 nativement avec la bonne syntaxe.

### Décision

Monter sur Express 5. La surface de changement est faible : Express 5 est rétrocompatible sur la quasi-totalité de l'API utilisée dans ce projet.

### Conséquences

- Bloqueur Node 22 levé
- `router.all('*')` → `router.all('/{*splat}')` ou supprimé si Express 5 le gère automatiquement
- À vérifier : middlewares `cookie-parser`, `cors` — généralement compatibles Express 5

---

## DEC-005 — node-fetch → fetch natif

**Date :** 2026-06-23 | **Étape :** 9 | **Statut :** implémenté

### Contexte

`node-fetch@2.x` est utilisé dans `src/server/controllers/patcher.controller.js`. Node 22+ expose `fetch` en global stable (API Web standard). Garder `node-fetch` est une dette sans valeur.

Effet secondaire : le stub `stub(require('node-fetch'), 'default')` dans les tests devient `stub(globalThis, 'fetch')` avec Vitest ou un simple `vi.stubGlobal('fetch', ...)` — plus simple.

### Décision

Supprimer `node-fetch` des `dependencies`. Utiliser `fetch` global directement dans `patcher.controller.js`.

### Conséquences

- 1 fichier source modifié, 3 fichiers de test à mettre à jour
- Suppression d'une dépendance CJS complexe à stubber

---

## DEC-006 — Suppression des polyfills `@webcomponents/webcomponentsjs`

**Date :** 2026-06-23 | **Étape :** 10 | **Statut :** implémenté

### Contexte

Chaque composant LitElement importe :
```js
import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
```

Ces polyfills ciblent les navigateurs sans support natif des Custom Elements (IE11, Edge Legacy, Chrome < 67). En 2026, le browserslist du projet (`defaults`, `maintained node versions`) couvre des navigateurs qui ont tous le support natif depuis 2019.

`custom-elements-es5-adapter` est particulièrement suspect : il est conçu pour les bundles ES5, or notre webpack compile maintenant en ES2022+.

### Décision

Retirer les deux imports de tous les composants. Vérifier visuellement que l'app fonctionne (les tests Playwright valident le comportement navigateur).

### Conséquences

- ~26 lignes supprimées à travers les composants
- Bundle légèrement réduit
- Si un bug visuel apparaît : cibler le composant spécifique plutôt que réimporter globalement

---

## DEC-007 — Vuepress 1 → VitePress

**Date :** 2026-06-23 | **Étape :** 11 | **Statut :** décidé, pas encore implémenté

### Contexte

Vuepress 1.x est **cassé sur Node 22+** (conflict de peer deps webpack 4 vs 5, bug dans ses dépendances internes). C'est la raison pour laquelle `--legacy-peer-deps` est obligatoire depuis l'étape 0.

VitePress est le successeur officiel de l'équipe Vue : même syntaxe Markdown, même structure de dossiers, migré vers Vite.

### Décision

Remplacer `vuepress` + `vuepress-jsdoc` par `vitepress`. La config docs (`docs-sources/`) sera migrée. Les scripts `docs:dev` et `docs:build` mis à jour.

### Conséquences

- `--legacy-peer-deps` probablement plus nécessaire après cette étape
- Config docs à réécrire (`.vuepress/config.js` → `docs/.vitepress/config.ts`)
- La génération JSDoc automatique (`vuepress-jsdoc`) devra être remplacée ou abandonnée

---

## DEC-008 — ESLint 8 → ESLint 9

**Date :** 2026-06-26 | **Étape :** 12 | **Statut :** implémenté

### Contexte

ESLint 8 est en fin de vie (EOL). ESLint 9 abandonne le format `.eslintrc.*` au profit du **flat config** (`eslint.config.js`). Les plugins utilisés (`eslint-plugin-mocha`, `eslint-plugin-jsdoc`, `eslint-plugin-prettier`) ont tous des versions compatibles ESLint 9.

### Décision

Migrer vers ESLint 9 + flat config. Utilisation de `eslint.config.mjs` (`.mjs` car le projet est `type: commonjs`). `eslint-plugin-mocha` conservé à ce stade — migration vers `eslint-plugin-vitest` reportée à l'étape 14.

### Conséquences

- `.eslintrc` et `.eslintignore` supprimés, remplacés par `eslint.config.mjs`
- Ajout de `@eslint/js@^9.39.4` et `globals@^15.15.0`
- `eslint-plugin-mocha` montée à v11 (nécessite ESLint ≥9) ; `eslint-plugin-jsdoc` montée à v63
- `eslint-plugin-mocha@11` : le nom du flat config est `configs.recommended` (plus `configs['flat/recommended']`)
- 47 avertissements JSDoc apparaissent (nouvelles règles jsdoc@63) — non bloquants
- Corrections induites : `catch (e)` → `catch {}`, imports namespace inutilisés → imports de côté-effet, convention `_param` pour args intentionnellement inutilisés
