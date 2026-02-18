# World Alpha — Linear Integration

## Dual role

  1. SELF-REFLECTION LOOP
     Agents create issues when synthesis quality degrades,
     sources are insufficient, conviction scoring is ambiguous,
     or cross-theme interactions need human judgment.

  2. OPERATIONAL STATUS CHANNEL
     Linear project state mirrors system health.
     Open issues = known gaps. Closed issues = resolved.
     The backlog is a living audit trail.

Linear is not a to-do list. It is a structured signal from the
agent to the operator: "Here is what I cannot resolve autonomously."

---

## Project structure

  Team:     World Alpha
  Project:  Synthesis Engine
  Cycles:   Weekly (Monday–Sunday, aligns with Task C)

## Label taxonomy

  By function:
    synthesis     quality of daily/theme synthesis output
    conviction    scoring ambiguity or calibration issues
    source        source gaps, noise, authority problems
    theme         theme lifecycle events (open/close/merge)
    cross-theme   interaction mapping issues
    task          task execution failures or gaps
    workflow      system-level process improvements

  By priority:
    🔴 critical   blocks synthesis or creates silent errors
    🟠 high       degrades output quality within 48h
    🟡 medium     improvement opportunity within 1 week
    🟢 low        maintenance, polish, long-horizon

  By origin:
    agent-raised  created by automated task (MCP)
    human-raised  created manually by operator

---

## Issue anatomy (all fields required for agent-raised issues)

  Title:            [TASK-CODE] [THEME/DOMAIN] — short problem statement
  Labels:           function + priority + agent-raised
  Problem:          What specifically failed or degraded?
  Evidence:         Which output, date, section shows it?
  Proposed fix:     Concrete change to doc, rule, source, or template
  Success criteria: How will we know the fix worked?
  Auto-close:       Yes | No

  Missing any field = malformed issue. Agent must retry or escalate.

---

## Issue triggers by task

### Task A (Daily Synthesis) — max 3 issues per run

  SYNTHESIS-001  Mechanism chain incomplete → item demoted to Watchpoint
                 synthesis [🟡 medium]

  SYNTHESIS-002  Promoted item has no Tier 1 source; CONFIRMED claim
                 relied on Tier 2 only
                 source [🟠 high]

  SYNTHESIS-003  Active theme Ongoing > 5 days with no material delta
                 theme [🟡 medium]

  SYNTHESIS-004  Cross-theme interaction detected but mechanism
                 too ambiguous to label AMPLIFYING/OFFSETTING/CONDITIONAL
                 cross-theme [🟡 medium]

  SYNTHESIS-005  Conviction score disagrees with intuitive ranking;
                 possible calibration issue
                 conviction [🟡 medium]

  SYNTHESIS-006  Two promoted items share > 80% mechanism overlap;
                 possible theme duplication
                 theme [🟠 high]

  SYNTHESIS-007  Task execution failed (timeout, source error,
                 template parse failure)
                 task [🔴 critical]

### Task B (Deep Theme Brief) — max 2 issues per brief

  THEME-001  Source coverage below Tier 1 for ≥ 2 of 8 required sections
             source [🟠 high]

  THEME-002  Scenario matrix base/upside/downside produces near-identical
             outcomes; not sufficiently differentiated
             synthesis [🟡 medium]

  THEME-003  Invalidation conditions cannot be stated in observable terms;
             theme may be unfalsifiable
             conviction [🟠 high]

### Task C (Weekly Consolidation) — max 4 issues per run

  WEEKLY-001  Active theme ran full week with zero cross-theme interactions
              cross-theme [🟡 medium]

  WEEKLY-002  Conviction log shows no ↑↓ on any theme for full week;
              possible anchoring
              conviction [🟠 high]

  WEEKLY-003  ≥ 2 themes closed faster than TACTICAL horizon;
              triggers may be too loose
              theme [🟡 medium]

  WEEKLY-004  Data calendar has ≥ 3 high-impact events with no active
              theme coverage; scan gap
              synthesis [🟠 high]

### Task D (Source Audit) — max 5 issues per audit

  AUDIT-001  Source cited 0 times in past month
             source [🟡 medium]

  AUDIT-002  Source produced ≥ 2 Speculative items never upgraded
             source [🟠 high]

  AUDIT-003  Active theme has no Tier 1 source for primary actor
             source [🔴 critical]

---

## Operational status protocol

### Daily (Task A bootstrap)

  Read Linear open issues before synthesis:
  - 🔴 critical open: log in output header; attempt resolution
    before promoting narratives
  - 🟠 high open: note in output footer; flag for operator
  - 🟡 medium / 🟢 low: do not block synthesis

### Weekly (Task C)

  Summarize issue ledger in weekly output:
    Issues opened this week:   N
    Issues resolved this week: N
    Critical open:             N
    High open:                 N
  Flag any issue open > 14 days: create workflow [🟠 high] meta-issue.

### Escalation conditions (immediate operator notification)

  1. ≥ 3 🔴 critical issues open simultaneously
  2. Task A fails to complete ≥ 2 consecutive days
  3. state/active_themes.yml not updated in > 24h despite Task A running
  4. Task D finds ≥ 2 active themes with zero Tier 1 source coverage

  Escalation format: workflow [🔴 critical]
  Title: "ESCALATION — [condition] — operator action required"
  Auto-close: No

### Zero-issue warning

  0 open issues for > 5 consecutive days likely means
  self-reflection is not firing, not that the system is perfect.
  Task A must always self-audit and produce ≥ 1 issue per week
  unless all diagnostics are HEALTHY and all themes are clean.

---

## Auto-close protocol

  Auto-close: Yes → Agent closes when success criterion is met.
  Closure comment must include:
    Resolved in: [output file path + date]
    Evidence:    [one sentence confirming criterion met]

  Auto-close: No → Operator confirmation required.
  Agent may comment with proposed resolution but cannot close.

---

## Operator workflow (weekly triage)

  Sunday, after Task C output:
  1. Review Task C issue ledger summary
  2. Close all auto-closeable resolved issues
  3. Prioritize 🟠 high issues for next week
  4. Archive 🟢 low issues stale > 30 days
  5. Update METHODOLOGY.md / SOURCES.md if patterns recur ≥ 3×/month

---

## MCP call pattern

  Timing: at task END (not during synthesis)

  1. Collect triggered issue conditions
  2. Triage by priority; apply per-task max limit
  3. For each issue: compose full body → MCP create_issue → log ID
  4. For auto-closeable resolved issues:
     fetch open issues with matching label → check success criterion
     → if met: MCP update_issue (resolved) + closure comment
  5. Task A only: read open 🔴 critical issues at BOOTSTRAP

  Fallback (MCP unavailable):
    Write issue drafts as fenced block in output footer.
    Label: "## Linear Issue Drafts (MCP unavailable)"
    Retry at next task run. Never silently drop issues.
