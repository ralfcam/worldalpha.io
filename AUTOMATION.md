# World Alpha — Automation (MCP) Policy

## Write policy

  Mode:    direct-to-main (no PR flow for scheduled tasks)
  Repo:    worldalpha.io (default branch: main)
  Trigger: task completion only (not mid-synthesis)

## Permitted MCP actions (automated tasks)

  GitHub:
    ✓ Create/overwrite files in outputs/ and state/
    ✓ Overwrite state files (active_themes.yml,
      conviction_log.yml, continuity_last7d.md)
    ✓ Append changelog entries to SOURCES.md (Task D)
    ✗ Modify canonical Space files (see list below)
      → Canonical file changes require operator action only

  Linear:
    ✓ Create issues (agent-raised)
    ✓ Close issues where Auto-close: Yes and criterion met
    ✓ Add comments to existing issues
    ✗ Delete issues
    ✗ Modify labels set by operator
    ✗ Close issues where Auto-close: No

## Canonical Space files (read-only for agents)

  README.md, METHODOLOGY.md, SOURCES.md, TAXONOMY.md,
  CONVICTION.md, TASKS.md, RETRIEVAL.md, LINEAR.md,
  TEMPLATES.md, AUTOMATION.md, INVOKE.md,
  STATE-SCHEMA.md, SYNC.md

  These 13 files must never be written by automated tasks.
  Operator action required for all changes.

## Forbidden actions (all agents, all tasks)

  ✗ Force-push to any branch
  ✗ Delete files or branches
  ✗ Modify canonical Space files
  ✗ Create pull requests (scheduled tasks write direct-to-main)
  ✗ Write to any repo other than worldalpha.io
  ✗ Close Linear issues requiring operator confirmation

## POC canonical sync policy

  See SYNC.md for the full operator checklist and drift detection rules.

  Summary: Space is runtime source-of-truth. GitHub copies are
  version-controlled backups. Sync after every GitHub canonical edit.

## Write path reference

  Daily outputs:    outputs/daily/YYYY-MM-DD.md
  Theme briefs:     outputs/themes/THEME-NAME-YYYY-MM-DD.md
  Weekly:           outputs/weekly/YYYY-Www.md
  State (overwrite at each Task A and Task C run):
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
