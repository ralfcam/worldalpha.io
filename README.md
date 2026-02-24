# World Alpha — worldalpha.io

**Tagline:** Research-first. Signal-second. Instrument-agnostic.
**Status:** Bootstrap v0.1 | 2026-02-18

## What it is

World Alpha is an autonomous research synthesis engine that monitors
global macro, policy, and geopolitical developments and compresses
them into structured, mechanism-grounded intelligence. It produces
conviction-ranked narratives and cross-theme interaction maps —
without prescribing instruments, pairs, or positions.

Users bring their own book, mandate, and risk tolerance.
World Alpha brings the synthesis.

## What it is NOT

- Not a trading signals service
- Not a curated news feed
- Not dependent on any external monitoring system
- Not a recommendation engine for instruments or pairs
- Not a news aggregator or summarization tool

## Who it is for

- Discretionary macro investors who need research scaffolding
- Systematic strategists who want structured narrative inputs
- Risk officers who need thematic exposure audit triggers
- Analysts who want a daily synthesis baseline to interrogate

## Core design principles

  1. RESEARCH-FIRST
     Synthesis starts from events and mechanisms, not price moves.
     Markets confirm; research leads.

  2. INSTRUMENT-AGNOSTIC
     Outputs describe what is changing and why it matters.
     The user maps findings to instruments.

  3. MECHANISM-FIRST
     Every actionable item requires a falsifiable causal chain:
     Trigger → Transmission → Affected dimension → Horizon.
     No chain = not actionable.

  4. CONVICTION IS EARNED
     Items carry a structured conviction score based on source
     quality, mechanism clarity, consensus position, and time
     definition. Scores are stated, not implied.

  5. SYNTHESIS OVER AGGREGATION
     World Alpha extracts structural content: what changed in
     the underlying picture, not what was said about it.

  6. SELF-IMPROVING
     The system uses Linear to surface its own gaps, source
     failures, and scoring anomalies. Improvement is automated
     and traceable.

## Canonical file index

  README.md          ← this file (project overview)
  METHODOLOGY.md     ← synthesis rules and promotion criteria
  SOURCES.md         ← source authority tiers and curation rules
  TAXONOMY.md        ← thematic classification system
  CONVICTION.md      ← conviction scoring framework
  TASKS.md           ← task definitions, schedules, and triggers
  RETRIEVAL.md       ← context retrieval and augmentation stack
  LINEAR.md          ← Linear integration: self-reflection + ops
  TEMPLATES.md       ← all output templates in one file
  AUTOMATION.md      ← MCP write policy and guardrails
  INVOKE.md          ← POC task invocation protocol
  STATE-SCHEMA.md    ← state file schemas and validation rules
  SYNC.md            ← canonical doc sync checklist (POC)

## Repository structure

  worldalpha/
  ├── [canonical docs — Space files, source of truth]
  ├── outputs/
  │   ├── daily/YYYY-MM-DD.md
  │   ├── themes/THEME-NAME-YYYY-MM-DD.md
  │   └── weekly/YYYY-Www.md
  └── state/
      ├── active_themes.yml
      ├── conviction_log.yml
      └── continuity_last7d.md

## Source of truth

  Canonical docs:   Space files (this set)
  Output artifacts: GitHub repo (worldalpha, branch: main)
  Operational state: GitHub repo /state/ + Linear project

### POC sync policy (manual)

During POC, the Perplexity Space is the effective runtime source-of-truth for
canonical docs (METHODOLOGY, SOURCES, TAXONOMY, CONVICTION, TASKS, RETRIEVAL,
LINEAR, TEMPLATES, AUTOMATION, INVOKE, STATE-SCHEMA, SYNC, README).

If canonical docs are edited in GitHub, the operator must manually apply the
same edits to the Space immediately after each GitHub edit.

To make drift detectable, every output footer must include:
- Canonical docs version (git SHA)
- Space canonical sync timestamp
(see TEMPLATES.md Retrieval metadata)
