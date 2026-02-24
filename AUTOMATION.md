# World Alpha — Automation (MCP) Policy

## Write policy

  Mode:    direct-to-main (no PR flow for scheduled tasks)
  Repo:    worldalpha (default branch: main)
  Trigger: task completion only (not mid-synthesis)

## Permitted MCP actions (automated tasks)

  GitHub:
    ✓ Create/overwrite files in outputs/ and state/
    ✓ Overwrite state files (active_themes.yml,
      conviction_log.yml, continuity_last7d.md)
    ✓ Append changelog entries to SOURCES.md (Task D)
    ✗ Modify canonical Space files (README, METHODOLOGY,
      SOURCES, TAXONOMY, CONVICTION, TASKS, RETRIEVAL,
      LINEAR, TEMPLATES, AUTOMATION, INVOKE, STATE-SCHEMA, SYNC)
      → Canonical file changes require operator action only

  Linear:
    ✓ Create issues (agent-raised)
    ✓ Close issues where Auto-close: Yes and criterion met
    ✓ Add comments to existing issues
    ✗ Delete issues
    ✗ Modify labels set by operator
    ✗ Close issues where Auto-close: No

## Forbidden actions (all agents, all tasks)

  ✗ Force-push to any branch
  ✗ Delete files or branches
  ✗ Modify canonical Space files
  ✗ Create pull requests (scheduled tasks write direct-to-main)
  ✗ Write to any repo other than worldalpha
  ✗ Close Linear issues requiring operator confirmation

## POC canonical sync policy (manual operator loop)

During POC, canonical docs are executed from the Perplexity Space (runtime),
not from the GitHub copies.

Operator workflow after any GitHub edit to canonical docs:
  1. Apply the identical edit to the matching Space file(s) immediately.
  2. Treat the Space as the effective source-of-truth for subsequent runs.
  3. Ensure the next produced output includes:
       - Canonical docs version (git SHA)
       - Space canonical sync timestamp
     (see TEMPLATES.md Retrieval metadata).

Agents:
  - Must not modify canonical docs (Space or GitHub copies).
  - Must not assume GitHub canonical-doc copies are current unless the operator
    states that the Space has been synced.

## Write path reference

  Daily outputs:    outputs/daily/YYYY-MM-DD.md
  Theme briefs:     outputs/themes/THEME-NAME-YYYY-MM-DD.md
  Weekly:           outputs/weekly/YYYY-Www.md
  State (overwrite daily):
    state/active_themes.yml
    state/conviction_log.yml
    state/continuity_last7d.md  (rolling 7d, overwrite)

## Failure handling

  GitHub write fails:
    Output as fenced block labeled:
    "## Output (MCP unavailable — paste to repo)"
    Retry next scheduled run.

  Linear write fails:
    Issue drafts as fenced block labeled:
    "## Linear Issue Drafts (MCP unavailable)"
    Retry next scheduled run. Never drop silently.

  State write fails:
    Log in output footer: "⚠ State write failed — manual update required"
    Create Linear issue: task [🔴 critical].
