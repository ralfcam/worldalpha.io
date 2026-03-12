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
     Write tomorrow’s focus (1–3 items).

  5b. EMIT FENCED BLOCKS (always, before any MCP write attempt)
     Emit the following as labeled fenced blocks in the response:
       • Full synthesized daily output (TEMPLATES.md format)
           Label: ## Output — outputs/daily/YYYY-MM-DD.md
       • Updated state/active_themes.yml (STATE-SCHEMA.md compliant)
           Label: ## State — state/active_themes.yml
       • Updated state/continuity_last7d.md
           Label: ## State — state/continuity_last7d.md
       • Linear issue drafts (if any triggered)
           Label: ## Linear Issue Drafts
     These blocks are the source-of-truth for Turn 2 MCP writes.
     If MCP writes succeed in the same turn, fenced blocks remain
     in the response as the audit record. Do not suppress them.

  6. STATE UPDATE
     Overwrite state/active_themes.yml (MCP GitHub write).
     Overwrite state/continuity_last7d.md (rolling 7d window, MCP GitHub write).
     If MCP write unavailable in current turn: defer to Turn 2
     (INVOKE.md two-turn pattern). Do NOT silently skip.
     Log in retrieval metadata footer: ⚠ State write deferred to Turn 2.

  7. LINEAR
     Create issues for triggered conditions (LINEAR.md §Task A).
     Max 3 issues per run. Triage by priority if limit reached.
     Attempt auto-close of resolved issues.
     If MCP Linear unavailable: emit as fenced block (Step 5b label).

  8. WRITE OUTPUT
     Write outputs/daily/YYYY-MM-DD.md (MCP GitHub, direct-to-main).
     If MCP write unavailable in current turn: defer to Turn 2.
     Log in retrieval metadata footer: ⚠ Output write deferred to Turn 2.

  9. CHECKPOINT LINE (required if any write deferred to Turn 2)
     Last line of response must be:
     > ⏸ CHECKPOINT: Turn 1 complete. Awaiting Turn 2 to execute MCP writes.
     > Artifacts ready: [list filenames]

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

  Emit full output as fenced block before MCP write attempt.
  Label: ## Output — outputs/themes/THEME-NAME-YYYY-MM-DD.md
  If MCP write unavailable: defer to Turn 2 (INVOKE.md).

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
  3. Cross-theme interaction map (week’s key edges)
  4. Conviction changes (↑↓→ per theme with rationale)
  5. Data calendar (key events next 5 sessions)
  6. Linear issue ledger (opened / resolved this week)
  7. Open questions (what the synthesis cannot yet resolve)

State writes:
  - Overwrite state/active_themes.yml
  - Overwrite state/conviction_log.yml
  - Overwrite state/continuity_last7d.md (rolling 7d window)

  Emit all state files and output as fenced blocks before MCP write
  attempt. If any write unavailable: defer to Turn 2 (INVOKE.md).

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
  1. Review past month’s synthesis for source citations.
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

  Emit changelog entry as fenced block before MCP write attempt.
  Label: ## Output — SOURCES.md changelog append
  If MCP write unavailable: defer to Turn 2 (INVOKE.md).

Linear issue triggers: see LINEAR.md §Task D triggers.
Max 5 issues per audit.

---

## Scheduling summary

  Task A:  Daily          07:00 CET
  Task B:  On-demand      (manual or auto at HIGH × 3 days)
  Task C:  Weekly         Sunday 18:00 CET
  Task D:  Monthly        First Sunday of month (after Task C)

## Failure handling (all tasks)

  Write steps unreachable in current turn (tool call budget exhausted):
    1. All write artifacts MUST already be emitted as fenced blocks
       in Step 5b (Task A) or equivalent emit step for other tasks.
       Fenced block labels:
         • ## Output — [filepath]          (synthesized output)
         • ## State — [filepath]           (state file)
         • ## Linear Issue Drafts          (Linear issues)
    2. End response with CHECKPOINT line (see Task A Step 9).
    3. On next operator turn: execute Turn 2 MCP writes only
       (INVOKE.md §Two-turn execution pattern).
    4. Never silently skip a write. Never re-synthesize in Turn 2.

  If MCP GitHub write fails (tool error, not budget):
    Write output as fenced block in task response.
    Label: ## Output (MCP unavailable — paste to repo)
    Retry at next scheduled run.

  If MCP Linear fails:
    Write issue drafts as fenced block in task response.
    Label: ## Linear Issue Drafts (MCP unavailable)
    Do not silently drop issues.

  If state files missing and no fallback available:
    HALT Task A. Create Linear issue manually or via fallback.
    Do not synthesize without state context.
