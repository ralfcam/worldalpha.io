# World Alpha — Context Retrieval & Augmentation

## Design philosophy

Retrieval serves synthesis, not coverage. The goal is not to
retrieve everything relevant — it is to retrieve the minimum
context needed to:
  1. Answer the task's research question with high confidence
  2. Detect what has materially CHANGED vs. prior synthesis
  3. Surface cross-theme interactions missed by single-theme queries

Retrieval quality = precision + temporal accuracy + source authority.
Recall is secondary. Noise is the primary failure mode.

---

## Layer 1: State Retrieval (always first)

Purpose: Load prior understanding before any external query.

Files loaded in order:
  1. state/active_themes.yml         (HALT if missing or > 36h stale)
  2. state/continuity_last7d.md      (rolling 7d synthesis digest)
  3. state/conviction_log.yml        (anchoring detection)
  4. outputs/daily/[yesterday].md    (delta detection)
  5. Linear open 🔴 critical issues  (via MCP read, Task A only)

Rules:
  - If active_themes.yml missing: HALT. Issue: task [🔴 critical].
  - If yesterday's output missing: load most recent available.
    Note gap in synthesis header. Do NOT treat all themes as New.
  - If conviction_log < 5 days: skip anchoring check; log reason.
  - State ALWAYS overrides web: if L1 says Ongoing and L3 says New,
    the theme is Ongoing. New content updates the delta only.

Output: structured state context object passed to Layer 2.

---

## Layer 2: Semantic Retrieval (corpus, scoped)

Purpose: Retrieve constraints and deep context from canonical docs
and prior outputs before issuing live queries.

Load order and budget:
  Priority 1 (always): METHODOLOGY.md, CONVICTION.md,
                        TAXONOMY.md, SOURCES.md
  Priority 2 (if theme active + conviction ≥ 7):
    outputs/themes/[THEME-NAME].md (most recent)
  Priority 3 (Task C only): outputs/weekly/[last 3 weeks]
  Priority 4 (on-demand): outputs/daily/[specific date]
    → Only when Reversal suspected and ref > 7 days ago

Retrieval strategies:
  Active themes:      Dense embedding, top-3 chunks per theme,
                      filter: date ≥ theme first_seen
  Cross-theme:        BM25 + graph traversal, top-2 chunks per pair,
                      must span ≥ 2 distinct theme tags
  Methodology rules:  BM25 exact, top-5 rule chunks, load verbatim

Fusion: Reciprocal Rank Fusion (RRF, k=60). De-duplicate by doc ID.
Source filter: drop Tier 3 chunks unless in Watchpoints context.

---

## Layer 3: Live Retrieval (web, gated)

Purpose: Retrieve current-day information on active themes
and scan for new theme emergence.

Layer 3 is only issued AFTER Layers 1 and 2 are complete.

Query generation rules:
  Primary queries (state-derived):
    - One query per active theme's "Tomorrow's Focus" item
    - One query per open Linear [🟠 high] source-gap issue
    - One query per watchpoint approaching promotion threshold

  Secondary queries (horizon scan):
    - One query per taxonomy theme NOT in active list
    - Max 3 horizon scan queries per Task A run

Query construction requirements (all three must be present):
  a) Specific actor, institution, or geography
  b) Time scope: "last 24 hours" or specific date
  c) Targeted at Tier 1 or Tier 2 source domain

Query budget:
  Task A:  Max 12 queries
  Task B:  Max 20 queries
  Task C:  Max 6 queries
  Task D:  Max 8 queries

Post-retrieval filtering:
  ACCEPT:   Tier 1 or 2 domain + within time scope + factual claim
  FLAG:     Credible outlet not in pre-approved list → Reported only
  REJECT:   Tier 3, outside time scope, pure opinion, duplicate

Corrective retrieval:
  If item scores REPORTED and mechanism chain candidate:
  → One retry: more specific query + Tier 1 domain only.
  → If confirmed: promote to CONFIRMED.
  → If not: keep REPORTED. Max one retry. Do not loop.
  → If pattern recurs for same theme: issue source [🟠 high].

---

## Context Assembly

Context window budget (assembly order = priority):

  | Component                    | Max tokens | Priority |
  |------------------------------|------------|----------|
  | Methodology rules (L2)       | 800        | 1st      |
  | State context (L1)           | 1,200      | 2nd      |
  | Active theme briefs (L2)     | 2,000      | 3rd      |
  | Confirmed live items (L3)    | 2,500      | 4th      |
  | Reported live items (L3)     | 1,000      | 5th      |
  | Cross-theme candidates       | 800        | 6th      |
  | New theme signals (L3)       | 700        | 7th      |
  | Total                        | ~9,000     |          |

  If budget exceeded: truncate from lowest priority upward.
  Never truncate methodology rules or state context.

Conflict resolution:
  - CONFIRMED overrides REPORTED on same fact (drop REPORTED).
  - If CONFIRMED and REPORTED conflict (different facts):
    surface both with [CONFLICT] label for synthesis agent.

Assembly anti-patterns (never do these):
  PADDING:      Background facts already in base knowledge.
  OVER-RECALL:  All docs mentioning a theme keyword, regardless
                of recency.
  RAW DUMPS:    Unstructured web text passed directly to agent.
  LATE LOADING: METHODOLOGY.md loaded after live retrieval.

---

## Pre-synthesis Diagnostics

Run after assembly, before synthesis begins.

  ⚠ THIN_COVERAGE
    < 2 confirmed items for an active HIGH-conviction theme.
    → One corrective retrieval pass. If still thin: synthesize
      with caveat; issue source [🟠 high].

  ⚠ STALENESS
    All confirmed items for a theme > 48h old.
    → Treat as Ongoing, no new delta. Do NOT invent a delta.
      Note: "No new developments in 24h."

  ⚠ SOURCE_CONCENTRATION
    ≥ 3 of 5 promoted items from same outlet.
    → Flag in synthesis footer; issue source [🟡 medium].

  ⚠ BUDGET_EXCEEDED
    > 12 queries issued in Task A.
    → Log count; issue workflow [🟡 medium].

  ⚠ HIGH_REJECTION
    > 40% of Layer 3 results rejected.
    → Queries may be too broad. Log; issue workflow [🟡 medium].

  🔴 STATE_MISSING
    active_themes.yml not loaded, no fallback available.
    → HALT. Do not synthesize. Issue task [🔴 critical].

---

## Retrieval metadata (required in every output footer)

  ---
  ## Retrieval metadata
  Timestamp:             YYYY-MM-DDTHH:MM CET
  Queries issued:        N
  Results accepted:      N (confirmed: N, reported: N)
  Results rejected:      N
  Corrective retrievals: N
  State loaded:          Yes | Partial | No
  Diagnostics:           [HEALTHY | THIN_COVERAGE | STALENESS | ...]
  Linear issues created: [IDs or "none"]
  ---
