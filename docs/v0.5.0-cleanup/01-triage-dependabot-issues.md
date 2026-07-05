# Prompt 1 — Triage Dependabot & nettoyage des issues

> Prompt calibré pour un modèle **Sonnet**. À jouer indépendamment.
> Branche dédiée : `chore/v0.5.0-cleanup`.

```
Task: Analyser les alertes Dependabot et les issues ouvertes du repo talk-control
      pour décider, une par une, lesquelles traiter / classer obsolètes / fermer,
      en vue d'une V0.5.0 propre.

Input: Le repo courant (branche develop). Alertes Dependabot et issues via `gh`.
       Contexte : migration Node 24 + TypeScript strict déjà faite, 196/196 tests
       Vitest verts, v0.5.0 en cours de finalisation.

Constraints:
  - Modèle cible : Sonnet. Chaque étape doit être autonome et non ambiguë.
  - Travailler PAR ÉTAPES : présenter un lot, STOP, attendre validation avant la suite.
  - Ne JAMAIS fermer une issue sans mon accord explicite (proposer, ne pas exécuter).
  - Outils : `gh` CLI (issues, dependabot alerts) + `git`. Pas de modif de code ici.
  - Ne pas toucher aux dépendances / ouvrir de PR dans ce prompt (triage only).

Output: Un tableau par lot avec, pour chaque alerte/issue :
        id | titre | type (dependabot|issue) | statut proposé
        (À TRAITER | OBSOLÈTE | À FERMER) | justification courte | action recommandée.
        À la fin de chaque lot : liste des fermetures proposées en attente de mon OK.

Verify: Chaque alerte Dependabot et chaque issue ouverte a un statut décidé
        (aucune laissée sans décision). Objectif de sortie : zéro alerte de
        sévérité high non traitée ou non justifiée. Les fermetures ne sont
        exécutées qu'après mon accord.
```
