# outputs/weekly/

## Purpose

Holds Task C: Weekly Consolidation outputs.
One file per ISO week. Written by agent via MCP GitHub (direct-to-main).

## Naming convention

  YYYY-Www.md

  ISO 8601 week notation. W prefix + zero-padded week number.

  Examples:
    2026-W08.md   (week of 2026-02-16)
    2026-W09.md   (week of 2026-02-23)

## Produced by

  Task C — Weekly Consolidation
  Schedule: Sunday 18:00 CET
  Template: TEMPLATES.md §Weekly

## Read by

  Layer 2 retrieval (Task C only):
    Load last 3 weekly files by filename date.

## State writes at Task C run

  Task C overwrites all three state files in addition to writing here:
    state/active_themes.yml
    state/conviction_log.yml
    state/continuity_last7d.md

## Index

  [populated by agent as files are created]

---
_This README is a directory manifest. It is not a canonical doc and is not a Space file._
