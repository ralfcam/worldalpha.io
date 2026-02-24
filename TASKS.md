# World Alpha — Task Definitions

## Task philosophy

Tasks are research workflows with defined research questions,
not topic-coverage scripts. Each task must produce a structured
output that answers its specific research question.

---

## Task A: Daily Research Synthesis  [07:00 CET, daily]

Thinking effort: medium
Exception: elevate to high for Step 5 cross-theme interaction map only.

Research question:
  "What has materially changed in the last 24 hours, and does
  it upgrade, downgrade, or invalidate any active theme?"

Output: outputs/daily/YYYY-MM-DD.md
Template: TEMPLATES.md §Daily

Process:
  1. BOOTSTRAP
     Load state/active_themes.yml + continuity_last7d.md.
     Read Linear open 🔴 critical issues (MCP).
     HALT if state/active_themes.yml missing or > 36h stale.

  2. RETRIEVE
     Execute retrieval stack (RETRIEVAL.md Layers 1–3).
     Run pre-synthesis diagnostics (RETRIEVAL.md §Diagnostics).

  3. FILTER
     Apply mechanism chain test (METHODOLOGY.md §2).
     Apply promotion criteria (METHODOLOGY.md §3).

  4. SCORE
     Assign conviction scores (CONVICTION.md).
     Check for anchoring (CONVICTION.md §Anchoring check).
     Score each dimension in a single pass; do not revisit unless
     a new fact changes the basis for that dimension.

  5. SYNTHESIZE
     Write structured narrative per promoted item (max 5).
     Write Watchpoints section.
     Write cross-theme interaction map.  ← elevate thinking to high
     Write theme registry delta.
     Write tomorrow's focus (1–3 items).

  6. STATE UPDATE
     Overwrite state/active_themes.yml (MCP GitHub write).
     Append to state/continuity_last7d.md (rolling 7d).

  7. LINEAR
     Create issues for triggered conditions (LINEAR.md §Task A).
     Max 3 issues per run. Triage by priority if limit reached.
     Attempt auto-close of resolved issues.

  8. WRITE OUTPUT
     Write outputs/daily/YYYY-MM-DD.md (MCP GitHub, direct-to-main).

Linear issue triggers: see LINEAR.md §Task A triggers.

---

## Task B: Deep Theme Brief  [on-demand]

Thinking effort: max

Research question:
  "For a given active theme, what is the complete structural
  picture: origin, current state, mechanism, scenarios,
  and invalidation conditions?"

Trigger:
  - Manual operator request, OR
  - Theme reaches HIGH conviction (10–12) for ≥ 3 consecutive days

Output: outputs/themes/THEME-NAME-YYYY-MM-DD.md
Template: TEMPLATES.md §Theme Brief

Required sections:
  1. Theme summary (instrument-agnostic, ≤ 3 sentences)
  2. Origin and timeline
  3. Current state (live status of each driver)
  4. Mechanism chain (full articulation, §2 METHODOLOGY.md)
  5. Scenario matrix (base / upside / downside for the theme)
  6. Cross-theme dependencies
  7. Key data/events that could shift conviction
  8. Invalidation conditions (observable, per CONVICTION.md)

Linear issue triggers: see LINEAR.md §Task B triggers.
Max 2 issues per brief.

---

## Task C: Weekly Consolidation  [Sunday 18:00 CET]

Thinking effort: medium

Research question:
  "Which themes changed conviction this week? What cross-theme
  interactions emerged? What is the structural picture entering
  next week?"

Output: outputs/weekly/YYYY-Www.md
Template: TEMPLATES.md §Weekly

Required sections:
  1. Week summary (≤ 5 sentences)
  2. Theme ledger: opened / upgraded / downgraded / closed
  3. Cross-theme interaction map (week's key edges)
  4. Conviction changes (↑↓→ per theme with rationale)
  5. Data calendar (key events next 5 sessions)
  6. Linear issue ledger (opened / resolved this week)
  7. Open questions (what the synthesis cannot yet resolve)

State writes:
  - Overwrite state/active_themes.yml
  - Overwrite state/conviction_log.yml
  - Overwrite state/continuity_last7d.md (rolling 7d window)

Linear issue triggers: see LINEAR.md §Task C triggers.
Max 4 issues per run.

---

## Task D: Source Audit  [monthly, first Sunday]

Thinking effort: low

Research question:
  "Are active sources producing signal or noise? Which need
  to be added, demoted, or retired?"

Output: Changelog section appended to SOURCES.md

Process:
  1. Review past month's synthesis for source citations.
  2. Flag Tier 1/2 sources cited 0 times (retirement candidates).
  3. Flag sources that produced Speculative items never upgraded.
  4. Identify theme coverage gaps (active themes with no
     Tier 1 source in registry for primary actor).
  5. Propose additions/demotions with rationale.
  6. Write findings as a dated changelog entry in SOURCES.md.

Output format (append to SOURCES.md):

  ## Source Audit — YYYY-MM-DD

  ### Retirement candidates (cited 0 times this month)
  - [source domain] — [rationale]

  ### Noise sources (Speculative items never upgraded)
  - [source domain] — [N items, never confirmed]

  ### Coverage gaps
  - [THEME_TAG] — [missing Tier 1 actor] — [proposed addition]

  ### Proposed changes
  - [Add / Demote / Retire]: [source domain] — [rationale]

Linear issue triggers: see LINEAR.md §Task D triggers.
Max 5 issues per audit.

---

## Scheduling summary

  Task A:  Daily          07:00 CET
  Task B:  On-demand      (manual or auto at HIGH × 3 days)
  Task C:  Weekly         Sunday 18:00 CET
  Task D:  Monthly        First Sunday of month (after Task C)

## Failure handling (all tasks)

  If MCP GitHub write fails:
    Write output as fenced block in task response.
    Label: "## Output (MCP unavailable — paste to repo)"
    Retry at next scheduled run.

  If MCP Linear fails:
    Write issue drafts as fenced block in task response.
    Label: "## Linear Issue Drafts (MCP unavailable)"
    Do not silently drop issues.

  If state files missing and no fallback available:
    HALT Task A. Create Linear issue manually or via fallback.
    Do not synthesize without state context.
