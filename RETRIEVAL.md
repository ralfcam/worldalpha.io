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
  - If conviction_log entries cover fewer than 5 distinct dates:
    skip anchoring check; log reason in output footer.
  - State ALWAYS overrides web: if L1 says Ongoing and L3 says New,
    the theme is Ongoing. New content updates the delta only.

Output: structured state context object passed to Layer 2.

---

## Layer 2: Canonical Doc Retrieval (Space files, always loaded)

Purpose: Load synthesis rules and deep theme context from Space files
before issuing any live queries.

In the Perplexity POC runtime, canonical docs are Space files and are
always present in context. No retrieval query is required.

Load priority:
  Priority 1 (always, already in context):
    METHODOLOGY.md, CONVICTION.md, TAXONOMY.md, SOURCES.md

  Priority 2 (if theme active + conviction ≥ 7):
    outputs/themes/[THEME-NAME].md
    (most recent by filename date; via MCP GitHub read)

  Priority 3 (Task C only):
    outputs/weekly/[last 3 weeks] (via MCP GitHub read)

  Priority 4 (on-demand):
    outputs/daily/[specific date] (via MCP GitHub read)
    → Only when Reversal suspected and ref > 7 days ago

Rules:
  - Canonical Space files are loaded before any live retrieval.
    This is enforced by the Space file architecture, not by agent action.
  - Prior output files (theme briefs, weekly) are fetched via MCP GitHub
    read only when their priority condition is met.
  - Do not fetch prior output files speculatively or for background context
    that is already in base knowledge.

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
  c) Phrased to surface primary-source language
     (e.g., "official statement", "data release", "enacted legislation")
     Note: domain-level filtering is not possible via Perplexity search.
     Apply source authority filtering post-retrieval (see below).

Query budget:
  Task A:  Max 12 queries
  Task B:  Max 20 queries
  Task C:  Max 6 queries
  Task D:  Max 8 queries

Post-retrieval filtering:
  ACCEPT:   Tier 1 or 2 source + within time scope + factual claim
  FLAG:     Credible outlet not in pre-approved list → Reported only
  REJECT:   Tier 3, outside time scope, pure opinion, duplicate

Corrective retrieval:
  If item scores REPORTED and mechanism chain candidate:
  → One retry: more specific query targeting primary-source language.
  → If confirmed: promote to CONFIRMED.
  → If not: keep REPORTED. Max one retry. Do not loop.
  → If corrective retrieval fails for the same theme in ≥ 3 consecutive
    Task A runs: create Linear issue: source [🟠 high].

Semantic deduplication:
  If the same underlying fact appears from multiple outlets
  (e.g., Reuters, Bloomberg, FT on the same event), retain the
  highest-authority source only. Do not let multi-outlet reporting
  of one fact inflate confidence in that fact.

---

## Context Assembly

Context window budget for synthesis content.
(Claude Sonnet 4.6 context window: 200K tokens.
 Space files + task prompt consume ~12–15K tokens of base overhead.
 Remaining available for synthesis content: ~185K tokens.
 The ~33K synthesis budget below is a quality cap, not a hard limit —
 it ensures focused, high-precision context rather than exhaustive recall.
 The remaining headroom is reserved for model reasoning and output generation.)

  | Component                    | Max tokens | Priority |
  |------------------------------|------------|----------|
  | Canonical docs (L2, Space)   | —          | 1st      |
  |   (always loaded via Space)  |            |          |
  | State context (L1)           | 4,000      | 2nd      |
  | Active theme briefs (L2)     | 8,000      | 3rd      |
  | Confirmed live items (L3)    | 12,000     | 4th      |
  | Reported live items (L3)     | 4,000      | 5th      |
  | Cross-theme candidates       | 3,000      | 6th      |
  | New theme signals (L3)       | 2,000      | 7th      |
  | Total synthesis content      | ~33,000    |          |

  Budget may be expanded up to ~80,000 tokens for Task B (deep brief)
  where extended prior-output context materially improves scenario
  matrix quality. Do not expand for Task A or Task D.

  If budget exceeded: truncate from lowest priority upward.
  Never truncate state context or canonical docs.

Conflict resolution:
  - CONFIRMED overrides REPORTED on same fact (drop REPORTED).
  - If CONFIRMED and REPORTED conflict (different facts):
    surface both with [CONFLICT] label for synthesis agent.

Assembly anti-patterns (never do these):
  PADDING:      Background facts already in base knowledge.
  OVER-RECALL:  All prior outputs mentioning a theme keyword,
                regardless of recency.
  RAW DUMPS:    Unstructured web text passed directly to synthesis.
  LATE LOADING: METHODOLOGY.md loaded after live retrieval.
  DUPE INFLATE: Same fact from multiple outlets counted as
                independent confirmation.

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
  Timestamp:                        YYYY-MM-DDTHH:MM CET
  Canonical docs version (git SHA): [HEAD SHA at time of run]
  Space canonical sync timestamp:   [operator-entered, YYYY-MM-DDTHH:MM CET]
  Queries issued:                   N
  Results accepted:                 N (confirmed: N, reported: N)
  Results rejected:                 N
  Corrective retrievals:            N
  State loaded:                     Yes | Partial | No
  Diagnostics:                      HEALTHY | [flags]
  Linear issues created:            [IDs or "none"]
  ---
