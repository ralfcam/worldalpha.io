# World Alpha — State File Schemas

## Purpose

Defines the required structure of all files in state/.
Every Task A and Task C write must conform to these schemas.
Non-conforming files cause Layer 1 failures.

---

## state/active_themes.yml

  version: "1.0"                    # schema version; increment on structural change
  generated_at: "YYYY-MM-DDTHH:MM CET"
  generated_by: "task-A" | "task-C" | "operator-seed"

  themes:
    - id: "THEME_TAG-YYYY-MM-DD"    # unique: primary tag + first_seen date
      tag: "MONETARY_POLICY"        # primary theme tag (TAXONOMY.md)
      secondary_tags:               # up to 2; omit field if none
        - "GEOPOLITICAL_RISK"
      title: "Short descriptive title"
      status: "Active"              # Active | Watchpoint | Archived
      first_seen: "YYYY-MM-DD"
      last_updated: "YYYY-MM-DD"
      conviction: 9                 # integer 0–12
      conviction_scores:
        E: 3                        # Evidence quality   0–3
        M: 2                        # Mechanism clarity  0–3
        C: 2                        # Consensus position 0–3
        T: 2                        # Time definition    0–3
      conviction_delta: "↑"         # ↑ | ↓ | →
      conviction_delta_reason: "One sentence."
      horizon: "SHORT"              # TACTICAL | SHORT | STRUCTURAL | SECULAR
      evidence_tier: "Confirmed"    # Confirmed | Reported | Speculative
      mechanism_chain: "TRIGGER → TRANSMISSION → AFFECTED DIMENSION → HORIZON"
      invalidation: "Invalidated if [specific observable condition]."
      anchored: false               # true if conviction flat > 5 consecutive runs
      anchored_since: null          # YYYY-MM-DD or null

  watchpoints:
    - id: "THEME_TAG-YYYY-MM-DD"
      tag: "FISCAL_SOVEREIGN"
      trigger: "One sentence describing the emerging signal."
      evidence_tier: "Speculative"
      conviction: 5
      watch_until: "YYYY-MM-DD"     # date to close/promote if no upgrade

## Required fields (all must be present or file is invalid)

  Root:       version, generated_at, generated_by, themes, watchpoints
  Per theme:  id, tag, title, status, first_seen, last_updated,
              conviction, conviction_scores (E/M/C/T), conviction_delta,
              conviction_delta_reason, horizon, evidence_tier,
              mechanism_chain, invalidation, anchored, anchored_since
  Watchpoint: id, tag, trigger, evidence_tier, conviction, watch_until

  Empty lists (themes: [] or watchpoints: []) are valid (cold start).
  Missing required field = file is malformed → HALT Layer 1.

---

## state/conviction_log.yml

  version: "1.0"
  generated_at: "YYYY-MM-DDTHH:MM CET"
  generated_by: "task-A" | "task-C" | "operator-seed"

  entries:
    - date: "YYYY-MM-DD"
      theme_id: "THEME_TAG-YYYY-MM-DD"
      conviction: 9
      delta: "↑"                    # ↑ | ↓ | →
      reason: "One sentence."

## Required fields

  Root:       version, generated_at, generated_by, entries
  Per entry:  date, theme_id, conviction, delta, reason

  Empty list (entries: []) is valid (cold start).
  Used by Layer 1 for anchoring detection.
  If entries span < 5 days: skip anchoring check; log reason.

---

## state/continuity_last7d.md

  Free-form Markdown. Rolling 7-day digest of synthesis outputs.
  Overwritten at each Task A and Task C run.
  Must contain at minimum:

  # World Alpha — Continuity: Last 7 Days
  Generated: YYYY-MM-DDTHH:MM CET

  ## [YYYY-MM-DD] (most recent first)
  [2–4 sentence summary of that day's synthesis: themes, deltas,
   conviction changes, key events. No templates, no tables.]

  ...repeat for each day in window...

  Cold-start seed is a single entry stating system initialisation.
  If file is missing: log gap in output header; do NOT treat all
  themes as New. Load most recent available file.
