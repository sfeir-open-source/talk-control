# Étape 8 — Express 4 → Express 5

## Objectif

Lever le bloqueur Node 22+ : `router.all('*')` est incompatible avec
`path-to-regexp` v8+ sur Node 22+. Express 5 (stable depuis fin 2024) intègre
nativement path-to-regexp v8 et résout ce problème avec la syntaxe
`/{*splat}`.

## Analyse préalable

### Cause du bloqueur

`path-to-regexp` v8+ (utilisé par Express 5) refuse le `*` nu en position de
chemin — il interprète désormais le wildcard comme un segment nommé avec la
syntaxe `{*nom}`. Sous Node 22+, la version antérieure de la bibliothèque
levait une erreur au démarrage du serveur.

### Compatibilité des middlewares

- `cookie-parser@1.4.7` : compatible Express 5 sans modification (middleware
  pur, aucune dépendance à l'API interne Express).
- `cors@2.8.6` : compatible Express 5 sans modification.
- `supertest@6.3.4` : agnostique à la version Express.

### APIs supprimées dans Express 5 — audit

Aucune API supprimée n'est utilisée dans ce projet :

| API retirée    | Présent dans le code source |
|---|---|
| `req.param()`  | Non |
| `app.del()`    | Non |
| `res.sendfile()` | Non |

## Changements

| Fichier | Modification |
|---|---|
| `package.json` | `express` : `^4.22.2` → `^5.2.1` |
| `src/server/controllers/proxy.controller.js` | `router.all('*', ...)` → `router.all('/{*splat}', ...)` |

### Avant / après — proxy.controller.js ligne 9

```js
// Avant (Express 4 / path-to-regexp v6)
router.all('*', (req, res) => forwardTraffic(req, res, proxy));

// Après (Express 5 / path-to-regexp v8)
router.all('/{*splat}', (req, res) => forwardTraffic(req, res, proxy));
```

`/{*splat}` correspond à `/`, `/foo`, `/foo/bar/…` après que Express a strippé
le préfixe `/proxy` déclaré dans `router.js`.

## Résultat

```
196 passing (144ms)
```

Aucun changement de test nécessaire. Build webpack et smoke server OK.

## Installation

```bash
npm install --legacy-peer-deps express@5
```

Le flag `--legacy-peer-deps` reste obligatoire jusqu'à l'étape 11 (Vuepress).
