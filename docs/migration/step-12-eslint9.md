# Étape 12 — ESLint 8 → 9 (DEC-008)

## Contexte

ESLint 8 est en fin de vie (EOL). ESLint 9 introduit un nouveau format de configuration appelé "flat config" (`eslint.config.js/mjs/cjs`) qui remplace les fichiers `.eslintrc.*`. Le nouveau format est plus explicite, composable, et aligne la résolution de modules sur les standards ESM.

## Décision

Migrer vers ESLint 9 avec le format "flat config" via `eslint.config.mjs` (`.mjs` car le projet est `type: commonjs` — l'extension force l'interprétation ESM).

## Changements de dépendances

| Package | Avant | Après | Raison |
|---|---|---|---|
| `eslint` | `^8.57.1` | `^9.39.4` | Migration cible |
| `@eslint/js` | — | `^9.39.4` | Remplace `eslint:recommended` dans le flat config |
| `globals` | — | `^15.15.0` | Remplace les `env:` du `.eslintrc` |
| `eslint-plugin-mocha` | `^10.5.0` | `^11.3.0` | v11 requiert ESLint ≥9, supprime `flat/recommended` (→ `recommended`) |
| `eslint-plugin-jsdoc` | `^50.8.0` | `^63.0.7` | Dernière version ESLint 9 compatible |
| `eslint-plugin-prettier` | `^5.5.6` | `^5.5.6` | Déjà compatible ESLint 9 |
| `eslint-config-prettier` | `^9.1.2` | `^9.1.2` | Déjà compatible ESLint 9 |

## Nouveaux fichiers

### `eslint.config.mjs`

Remplace `.eslintrc` + `.eslintignore`. Correspondances :

| `.eslintrc` | `eslint.config.mjs` |
|---|---|
| `env.node/browser/mocha` | `languageOptions.globals` via le package `globals` |
| `extends: eslint:recommended` | `js.configs.recommended` |
| `extends: plugin:mocha/recommended` | `mochaPlugin.configs.recommended` |
| `extends: plugin:jsdoc/recommended` | `jsdocPlugin.configs['flat/recommended']` |
| `extends: prettier` | `prettierConfig` |
| `plugins: [mocha, jsdoc, prettier]` | objets dans chaque config + `plugins: { prettier }` |
| `parserOptions` | `languageOptions.sourceType/ecmaVersion` |
| `.eslintignore` | bloc `{ ignores: [...] }` en tête du tableau |

## Fichiers supprimés

- `.eslintrc` — remplacé par `eslint.config.mjs`
- `.eslintignore` — les ignores sont dans `eslint.config.mjs`

## Corrections de code induites

ESLint 9 a modifié les valeurs par défaut de `no-unused-vars` :

- `caughtErrors` passe de `'none'` à `'all'` → les variables de clause `catch` sont désormais vérifiées

### `catch (e)` → `catch {}` (optional binding ES2019)

Trois fichiers avaient `catch (e)` où `e` n'était jamais utilisé :
- `src/common/services/url.js`
- `src/server/controllers/patcher.controller.js`
- `src/server/controllers/proxy.controller.js`

### Imports de namespace inutilisés → imports de côté-effet

Trois fichiers de test importaient `import * as X from '...'` sans utiliser la variable (le stub se faisait via `require()`). Convertis en `import '...'` :
- `test/common/event-bus/event-bus-resolver.spec.js`
- `test/server/controllers/patcher.controller.spec.js`
- `test/server/tc-server.spec.js`

### Autres corrections

- `scripts/jsdoc-build.mjs` : suppression de `statSync` non utilisé dans l'import `fs`
- `test/helpers/make-stubbable.js` : renommage des paramètres `request, parent, isMain` → `_request, _parent, _isMain` (convention d'intentionnellement inutilisé) ; clauses `catch (_)` → `catch {}`
- `eslint.config.mjs` : ajout de `'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]` pour respecter la convention `_param`

## Avertissements JSDoc (non bloquants)

Le passage de `eslint-plugin-jsdoc@50` à `@63` active de nouvelles règles en mode `warn` :
- `jsdoc/reject-any-type` — préfère des types spécifiques à `*`/`any`
- `jsdoc/require-throws-type` — `@throws` sans type
- `jsdoc/no-undefined-types` — type `Store` non défini

Ces 47 avertissements sont des problèmes de documentation préexistants, non bloquants (exit 0). Ils seront traités séparément si nécessaire.

## Résultats de validation

```
npm install          # OK, sans --legacy-peer-deps
npm run lint         # 0 erreurs, 47 warnings (JSDoc, non bloquants)
NODE_ENV=test npm test  # 196/196 ✓
npm run build        # 16 erreurs pré-existantes DEC-001 attendues ✓
```
