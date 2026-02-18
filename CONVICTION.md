# World Alpha — Conviction Scoring Framework

## Purpose

Conviction is a structured estimate of how well-supported
and actionable a narrative is at synthesis time.
It is NOT a prediction of outcome probability.

## Scoring dimensions (each scored 1–3)

  E — Evidence quality
    3: All key facts from Tier 1 sources
    2: Mix of Tier 1 and Tier 2 sources
    1: Primarily Tier 2 or Tier 3 sources

  M — Mechanism clarity
    3: Complete chain with historical precedent
    2: Chain is plausible but missing one link
    1: Mechanism is asserted but not demonstrated

  C — Consensus position
    3: Narrative is under-appreciated by consensus
    2: Consensus is divided
    1: Narrative is widely held (lower residual value)

  T — Time definition
    3: Clear near-term catalyst or data event identified
    2: Horizon is identifiable but fuzzy
    1: No clear timing catalyst

## Composite score and tiers

  Conviction Score = E + M + C + T  (range: 4–12)

  HIGH:     10–12  → Promote to Active Theme, synthesize fully
  MEDIUM:    7–9   → Active Theme with stated caveats
  LOW:       4–6   → Watchpoint only; monitor for upgrade
  NOISE:      ≤3   → Exclude; log in state/active_themes.yml

## Conviction delta (required at each synthesis)

  ↑  Conviction raised   — one sentence reason
  ↓  Conviction lowered  — one sentence reason
  →  Unchanged           — note if approaching expiry (> 7 days flat)

## Anchoring check

  If a theme's conviction score has not changed (↑↓) in > 5
  consecutive synthesis runs: flag as ANCHORED.
  Action: explicitly re-examine each dimension independently.
  If still unchanged after re-examination: create Linear issue:
  conviction [🟡 medium].

## Invalidation conditions (required at promotion)

  Format: "Invalidated if [specific observable event or data]"

  Every Active Theme must state this condition at promotion.
  If condition cannot be stated in observable terms:
  theme remains Watchpoint. See METHODOLOGY.md §8.

## Conviction expiry

  TACTICAL horizon themes: close or re-evaluate after 5 sessions
  SHORT horizon themes: re-evaluate after 4 weeks
  STRUCTURAL themes: mandatory re-evaluation at monthly Task D
  SECULAR themes: reviewed in weekly Task C cross-theme map only
