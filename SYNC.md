# Canonical Doc Sync (POC)

## Policy

During POC, the Perplexity Space is the runtime source-of-truth for canonical docs.
GitHub canonical-doc copies may be edited, but edits only become effective once the
operator applies the same changes to the Space.

---

## Operator checklist (after any GitHub edit to canonical docs)

  Step 1  Identify which canonical files changed in the commit.
  Step 2  For each changed file: open the matching Space file and apply
          the identical edit.
  Step 3  Record the HEAD SHA of the commit you consider "current" as the
          canonical docs version for subsequent runs.
  Step 4  Note the timestamp of the sync as the Space canonical sync timestamp.
  Step 5  In the next produced output, confirm the Retrieval metadata footer
          contains both values (git SHA and sync timestamp).

---

## Canonical files subject to sync (13 files)

All of these live as Space files AND as GitHub copies.
Space file = runtime source. GitHub copy = version-controlled backup.

  1.  README.md
  2.  METHODOLOGY.md
  3.  SOURCES.md
  4.  TAXONOMY.md
  5.  CONVICTION.md
  6.  TASKS.md
  7.  RETRIEVAL.md
  8.  LINEAR.md
  9.  TEMPLATES.md
  10. AUTOMATION.md
  11. INVOKE.md
  12. STATE-SCHEMA.md
  13. SYNC.md          ← this file

---

## NOT subject to sync (GitHub only — written by agents)

  outputs/daily/*.md
  outputs/themes/*.md
  outputs/weekly/*.md
  state/active_themes.yml
  state/conviction_log.yml
  state/continuity_last7d.md

  Agents write these files via MCP GitHub directly.
  They are NOT Space files and must NOT be copied to the Space.

---

## Detecting drift

  If the Space sync timestamp in an output footer is > 48h behind
  the git SHA commit date, the operator must re-sync before the
  next synthesis run.

  If a synthesis output references behaviour not present in the
  currently loaded Space files, this signals undocumented drift.
  Create a Linear issue: workflow [🟡 medium].
