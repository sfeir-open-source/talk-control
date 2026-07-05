# Prompt 2 — Audit de code (rapport priorisé, lecture seule)

> Prompt calibré pour un modèle **Sonnet**. À jouer indépendamment.
> Branche dédiée : `chore/v0.5.0-cleanup`.

```
Task: Auditer tout le repo talk-control pour repérer les vieux patterns, anti-patterns
      et pratiques à éviter, et produire un rapport priorisé — sans modifier le code.

Input: L'intégralité du repo (branche develop) : src, tests, config, scripts, CI.
       Contexte : Node 24, TypeScript strict, LitElement/lit-html, Vite, Vitest.

Constraints:
  - Modèle cible : Sonnet. Analyse par lots de fichiers/dossiers, point d'étape entre chaque.
  - LECTURE SEULE : aucune correction, aucun commit, aucune PR.
  - Ne pas signaler de faux positifs liés à des choix déjà validés (ex. conventions du repo).
  - Ne pas renommer / suggérer de renommer les variables existantes sans nécessité fonctionnelle.
  - Rester factuel : chaque finding doit pointer un fichier:ligne réel.

Output: Rapport priorisé, findings triés par sévérité (CRITICAL | HIGH | MEDIUM | LOW).
        Pour chaque finding : fichier:ligne | catégorie (anti-pattern, dette, obsolète,
        sécurité, perf, DX) | description | reco actionnable | effort estimé.
        Synthèse en tête : nombre de findings par sévérité + top 5 à traiter en priorité.

Verify: Chaque finding est classé par sévérité, pointe un fichier:ligne vérifiable et
        propose une reco actionnable. Le rapport couvre tout le repo (aucun dossier
        source ignoré sans justification).
```
