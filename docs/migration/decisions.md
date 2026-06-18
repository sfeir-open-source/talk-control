# Décisions techniques — Migration Node 24

Ce fichier trace les décisions d'architecture prises pendant la migration.
Format : contexte → options évaluées → décision → conséquences.

---

## DEC-001 — Remplacement de `@granite-elements/granite-lit-bulma` et `lit-fontawesome`

**Date :** 2026-06-18
**Étape concernée :** à planifier (post étape 6)
**Statut :** décidé, pas encore implémenté

### Contexte

L'étape 6 (Babel 7→8 + lit-element 2→4) a introduit un shim `src/compat/lit-styles-compat.js`
pour contourner l'incompatibilité de `CSSResult` entre lit-element 2.x et lit 3.x.
Ce shim a mis en évidence que les deux packages wrappés n'apportent aucune logique propre.

- `@granite-elements/granite-lit-bulma` : le package entier est `export const bulmaStyles = css\`<12000 lignes de Bulma>\``. Dernier commit en 2020.
- `lit-fontawesome` : même chose — Font Awesome 5 CSS complet empaqueté en `CSSResult`. Plante en Node 22+ (`window is not defined`).
- `bulma` est **déjà présent** dans les `dependencies` du projet.
- Seules 7 icônes `fas` sont utilisées, dans 3 composants (menu-navigation, menu-plugins, view-selector).

### Options évaluées

**Bulma**

| Option | Notes |
|--------|-------|
| Conserver le shim actuel | Fonctionne mais lie le CSS Bulma à une version figée dans un package abandonné |
| Import direct `bulma/css/bulma.min.css` via `unsafeCSS` | CSS issu du vrai package `bulma` déjà en dep, mis à jour avec les futures upgrades Bulma |

**Font Awesome**

| Option | Notes |
|--------|-------|
| CSS global via `<link>` | Ne fonctionne pas : les classes `.fas` ne traversent pas le shadow DOM |
| `@fortawesome/fontawesome-svg-core` + SVG | Tree-shakeable (7 icônes ≈ 5 KB vs ~400 KB CSS), natif shadow DOM, pas de webfont |
| Conserver le shim actuel | Package crashe en Node 22+ hors webpack, maintenabilité nulle |

### Décision

- **Bulma** : supprimer `@granite-elements/granite-lit-bulma`, importer `bulma/css/bulma.min.css` directement via css-loader dans le shim.
- **Font Awesome** : supprimer `lit-fontawesome`, migrer vers `@fortawesome/fontawesome-svg-core` + `@fortawesome/free-solid-svg-icons`. Remplacer les `<i class="fas fa-xxx">` par `unsafeHTML(icon(faXxx).html[0])` dans les 3 composants concernés.

### Conséquences

- Suppression de 2 packages abandonnés
- CSS Bulma aligné sur la vraie version dans `dependencies`
- 7 icônes SVG inline → ~395 KB de CSS Font Awesome éliminés du bundle
- 13 occurrences à migrer dans les templates LitElement (effort faible, localisé)
- `src/compat/lit-styles-compat.js` mis à jour ou supprimé selon implémentation finale

---

## DEC-002 — Tests complets des composants LitElement

**Date :** 2026-06-18
**Étape concernée :** à planifier (étape finale de migration)
**Statut :** décidé, pas encore implémenté

### Contexte

Les composants LitElement (`url-form`, `menu-navigation`, `view-selector`, `menu-plugins`,
`remote-control`, `timer`, `notes`, `slide-view`, `loader`, `magic-info-tutorial`, `clock`,
`touch-pointer-mask`, `touch-pointer-settings`) n'ont **aucun test unitaire**.

La suite actuelle (196 tests Mocha) ne valide pas le rendu, les interactions, ni le comportement
des web components. La seule vérification existante est le build webpack.
Cette dette a été identifiée lors de DEC-001 : la migration Bulma/FA ne cassera aucun test
existant, ce qui signifie qu'une régression de rendu passerait inaperçue.

### Décision

Après la fin de la migration Node 24, ajouter une suite de tests pour les composants LitElement.

**Stack retenue :** `@web/test-runner` + `@open-wc/testing`
- Tourne dans un vrai browser headless (Chromium via Playwright)
- Compatible LitElement/Lit 3, shadow DOM natif
- Complète les tests Mocha existants sans les remplacer

**Périmètre minimal attendu à la fin de migration :**
- Chaque composant : smoke test (rendu sans erreur, élément présent dans le DOM)
- Composants avec état (`timer`, `slide-view`, `url-form`) : tests de comportement basiques
- `src/compat/lit-styles-compat.js` : vérifier que `bulmaStyles` et `Fontawesome` sont des `CSSResult` valides

### Conséquences

- Nouvelle commande `npm run test:components` distincte des tests Mocha serveur
- CI : job supplémentaire dans `.github/workflows/update-node-20.yml`
- Couverture réelle du code frontend pour la première fois
