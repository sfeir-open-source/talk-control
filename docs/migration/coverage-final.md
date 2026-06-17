# Coverage final — étape 0.4
# Node: v20 | Outil: c8 11.0.0 | Scope: src/ hors web-components/layouts/environment

> Commande : `NODE_ENV=test npm run coverage && npm run coverage:check`
> Config : `.c8rc` — exclut `src/client/web-components/**`, `src/client/layouts/**`, `src/environment/**`
> Raison des exclusions : code browser-only (LitHTML/DOM) non testable en Node.js unit/integration

## Global (--all src/, périmètre testable)

| Métrique   | Valeur      | Seuil CI |
|------------|-------------|----------|
| Statements | **70.55 %** | ≥ 70 %   |
| Branches   | **93.95 %** | ≥ 90 %   |
| Functions  | **62.20 %** | ≥ 60 %   |
| Lines      | **70.55 %** | ≥ 70 %   |

Tests : **196 / 196 passing**

## Périmètre couvert

| Répertoire                    | Stmts % | Branches % | Notes |
|-------------------------------|---------|------------|-------|
| common/services               | 82.63   | 96.15      |       |
| common/event-bus              | 98.45   | 95.91      |       |
| server/controllers            | 100     | 100        |       |
| server/engines                | 93.93   | 100        |       |
| server                        | 54.21   | 75         |       |
| client/tc-controller          | 77.7    | 94.11      |       |
| client/tc-component           | 49.38   | 83.33      |       |
| plugins                       | 93.54   | 100        |       |

## Périmètre exclu (browser-only, pas de seuil CI)

- `src/client/web-components/**` — composants LitHTML (DOM requis)
- `src/client/layouts/**` — bootstrap browser
- `src/environment/**` — scripts CLI (create-tunnels, get-started)

## Seuils de non-régression

| Seuil | Valeur |
|-------|--------|
| Tests passing | 196 / 196 |
| Statements | ≥ 70 % |
| Branches | ≥ 90 % |
| Lines | ≥ 70 % |
| Functions | ≥ 60 % |
