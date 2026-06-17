# Étape 3 — Tooling qualité (prettier · eslint · husky)

## Objectif

Mettre à jour les trois outils de qualité de code sans impact sur le runtime
ni les tests fonctionnels. Ces upgrades sont **parallélisables** (fichiers de
config disjoints) et regroupés dans une seule PR.

## Périmètre — ce qui change

### prettier 1 → 3

| Aspect | Avant | Après |
|--------|-------|-------|
| Version | `^1.19.1` | `^3.x` |
| `pretty-quick` | `^2.0.1` | `^4.x` (compat. prettier 3) |
| `eslint-plugin-prettier` | `^3.1.4` | `^5.x` |
| `eslint-config-prettier` | `^6.11.0` | `^9.x` |

**Comportement préservé** : deux options ajoutées à `.prettierrc` pour figer les
défauts prettier v3 qui diffèrent de v1 :

```json
"trailingComma": "none"   // v1: "none" → v3 default: "all"
"arrowParens": "avoid"    // v1: "avoid" → v3 default: "always"
```

Le reformatage automatique (`eslint --fix`) a été appliqué à `src/` et `test/`
pour aligner le code existant sur les nouvelles règles prettier 3.

### eslint 6 → 8

| Aspect | Avant | Après |
|--------|-------|-------|
| Version | `^6.8.0` | `^8.x` |
| Parser | `babel-eslint@10` (déprécié) | `@babel/eslint-parser@7` |
| `eslint-plugin-mocha` | `^6.3.0` | `^10.x` |
| `eslint-plugin-jsdoc` | `^15.12.2` | `^50.x` |

**Migrations config (`.eslintrc`)** :

```json
// avant
"parser": "babel-eslint"

// après
"parser": "@babel/eslint-parser",
"parserOptions": {
    ...,
    "requireConfigFile": false   // ajouté : pas de babel.config.js au projet
}
```

**Règles nouvelles désactivées** (comportement pré-existant non conforme,
pas de refactor en scope migration) :

```json
"jsdoc/tag-lines": "off"             // jsdoc v50 : lignes entre tags
"mocha/max-top-level-suites": "off"  // mocha v10 : 2 describe dans event-bus-resolver.spec.js
```

### husky 3 → 9

| Aspect | Avant | Après |
|--------|-------|-------|
| Version | `^3.1.0` | `^9.x` |
| Config | `"husky": {}` dans package.json (vide) | `.husky/pre-commit` |
| Script prepare | absent | `"prepare": "husky"` |

**Hook activé** (dormant en v3 faute de config) :

```sh
# .husky/pre-commit
npx pretty-quick --staged
```

`pretty-quick` était dans les devDependencies sans jamais être branché. Le hook
formate uniquement les fichiers stagés avant chaque commit.

## Tests — état avant / après

| Métrique | Avant étape 3 | Après étape 3 |
|---------|---------------|---------------|
| Tests unitaires + intégration | 196 passing | **196 passing** |
| Tests E2E Playwright | 24 passing | non relancés (hors périmètre tooling) |
| Lint `eslint src/ test/` | non utilisé en CI | **0 erreur, 0 warning** |

Aucun test supplémentaire ajouté : les upgrades touchent exclusivement le
tooling de qualité (formatage, linting, hooks git), pas le code fonctionnel.

## Décisions d'architecture

- **Pas de migration vers eslint 9 (flat config)** : eslint 9 abandonne
  `.eslintrc` pour `eslint.config.js`. Cela nécessite une migration de config
  non triviale, hors scope Node 24. Étape dédiée après babel 8.
- **`trailingComma: "none"`** : on préserve le style existant plutôt que
  d'adopter les nouveaux défauts prettier 3, pour minimiser le bruit de diff.

## Commandes de validation

```bash
# Lint
npx eslint src/ test/

# Tests
NODE_ENV=test npm test          # 196 passing attendu

# Vérifier le hook pre-commit
git stash                       # simuler un commit propre
git stash pop
```
