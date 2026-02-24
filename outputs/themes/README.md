# outputs/themes/

## Purpose

Holds Task B: Deep Theme Brief outputs.
One file per theme per brief run. Written by agent via MCP GitHub (direct-to-main).

## Naming convention

  THEME-NAME-YYYY-MM-DD.md

  THEME-NAME: hyphenated slug derived from the theme title, in UPPER-KEBAB-CASE
  YYYY-MM-DD: date of the brief run

  Examples:
    US-TARIFF-ESCALATION-2026-02-24.md
    ECB-RATE-PATH-REPRICING-2026-03-01.md
    CHINA-TECH-EXPORT-CONTROLS-2026-02-28.md

## Produced by

  Task B — Deep Theme Brief
  Trigger: manual operator request, OR active theme reaches HIGH conviction
           (≥ 10/12) for ≥ 3 consecutive Task A runs
  Template: TEMPLATES.md §Theme

## Read by

  Layer 2 retrieval (if theme active + conviction ≥ 7):
    Load most recent file by filename date.

## Multiple briefs per theme

  If a theme is re-briefed, a new dated file is created.
  Prior files are retained. Layer 2 always loads the most recent.

## Index

  [populated by agent as files are created]

---
_This README is a directory manifest. It is not a canonical doc and is not a Space file._
