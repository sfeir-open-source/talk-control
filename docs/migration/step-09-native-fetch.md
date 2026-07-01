# Étape 9 — node-fetch → fetch natif

## Objectif

Supprimer la dépendance `node-fetch@2.7.0` en faveur du `fetch` global exposé
nativement par Node 22+. C'est une simplification sans valeur de compatibilité :
`node-fetch` est une dette CJS sans bénéfice fonctionnel sur Node 22+.

## Analyse préalable

### Périmètre d'impact

`node-fetch` n'est utilisé qu'à un seul endroit dans le code source :

| Fichier | Usage |
|---|---|
| `src/server/controllers/patcher.controller.js` | `import fetch from 'node-fetch'` → appel `fetch(url)` |

Trois fichiers de test stubbaient l'export default CJS du module :

| Fichier de test | Pattern avant |
|---|---|
| `test/server/controllers/patcher.controller.spec.js` | `stub(_fetchContextMod, 'default')` |
| `test/server/integration/patcher.integration.spec.js` | `stub(_nodeFetchMod, 'default')` |
| `test/server/integration/router.integration.spec.js` | `stub(_nodeFetchMod, 'default')` |

### Compatibilité Node 22+ / fetch global

`fetch` est disponible en global stable depuis Node 18 (flag expérimental) et
est stable sans flag depuis Node 21. Sur Node 22+, `globalThis.fetch` est
configurable, ce qui permet à Sinon de le stubber avec `stub(globalThis, 'fetch')`.

## Changements

### Code source

**`src/server/controllers/patcher.controller.js`** — suppression de l'import :
```js
// SUPPRIMÉ :
import fetch from 'node-fetch';
```
L'appel `fetch(presentationUrl.href)` (ligne 31) est inchangé — il résout
désormais directement le global.

### Tests

Pattern de remplacement identique dans les 3 fichiers de test :

```js
// AVANT :
import * as nodeFetch from 'node-fetch';
const _nodeFetchMod = require('node-fetch');
// ...
fetchStub = stub(_nodeFetchMod, 'default').resolves({ ... });

// APRÈS :
// (imports supprimés)
fetchStub = stub(globalThis, 'fetch').resolves({ ... });
```

Le `afterEach` `fetchStub.restore()` déjà présent dans chaque fichier est
conservé tel quel — Sinon restaure `globalThis.fetch` à l'original.

### Dépendance

**`package.json`** — suppression dans `dependencies` :
```json
"node-fetch": "^2.7.0",   ← supprimé
```

## Résultat

```
196 passing (141ms)
```

Build webpack : OK (2 warnings préexistants non liés).

## Installation

```bash
npm install --legacy-peer-deps
```
