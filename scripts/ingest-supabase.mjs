#!/usr/bin/env node
/**
 * World Alpha — Supabase Ingest Script
 * Parses state/ YAML and outputs/ Markdown then upserts into Supabase.
 *
 * Tables targeted:
 *   public.themes            — upsert on id
 *   public.watchpoints       — upsert on id
 *   public.conviction_log    — upsert on (scored_at, theme_id), duplicates ignored
 *   public.pipeline_runs     — insert 'running' at start; update at end
 *   public.synthesis_outputs — upsert on (output_date, output_type)
 *   public.issues            — upsert on code (Linear mirror)
 *
 * Run: node scripts/ingest-supabase.mjs
 * Env: SUPABASE_URL, SUPABASE_SERVICE_KEY, SYSTEM_USER_ID, LINEAR_API_KEY (optional)
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { load as parseYaml } from 'js-yaml'
import { createClient } from '@supabase/supabase-js'

// ── Env ─────────────────────────────────────────────────────────────────────────
const { SUPABASE_URL, SUPABASE_SERVICE_KEY, SYSTEM_USER_ID, LINEAR_API_KEY } = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !SYSTEM_USER_ID) {
  console.error('[ingest] FATAL: Missing required env vars (SUPABASE_URL, SUPABASE_SERVICE_KEY, SYSTEM_USER_ID)')
  process.exit(1)
}

// Service role client — bypasses RLS; never use in browser/client bundles
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
})

const RUN_DATE = new Date().toISOString().slice(0, 10)
const STARTED_AT = new Date().toISOString()
let pipelineRunId = null

// ── Helpers ──────────────────────────────────────────────────────────────────
const DELTA_MAP = { up: 'up', down: 'down', flat: 'flat', '↑': 'up', '↓': 'down', '→': 'flat' }
function normalizeDelta(raw) { return DELTA_MAP[raw] ?? 'flat' }

function fatal(label, error, payload) {
  console.error(`\n[ingest] ❌ ERROR in ${label}`)
  console.error(`  message : ${error.message}`)
  console.error(`  code    : ${error.code ?? 'n/a'}`)
  console.error(`  details : ${error.details ?? 'n/a'}`)
  console.error(`  hint    : ${error.hint ?? 'n/a'}`)
  if (payload) console.error(`  payload : ${JSON.stringify(payload[0], null, 2)}  (first row shown)`)
  process.exit(1)
}

async function upsertAndLog(table, rows, conflictCol, label) {
  if (!rows.length) { console.log(`[ingest] ${label}: nothing to upsert — skipping`); return }
  console.log(`[ingest] ${label}: upserting ${rows.length} row(s) on conflict(${conflictCol})…`)
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflictCol, ignoreDuplicates: false })
  if (error) fatal(label, error, rows)
  console.log(`[ingest] ${label}: ✓ done`)
}

// Parse YAML frontmatter from a Markdown file
function parseFrontmatter(md) {
  const match = md.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  try { return parseYaml(match[1]) } catch { return {} }
}

// ── Step 0: Open pipeline_run ──────────────────────────────────────────────────
{
  const { data, error } = await supabase
    .from('pipeline_runs')
    .insert({
      run_date:     RUN_DATE,
      task_type:    'A',
      started_at:   STARTED_AT,
      status:       'running',
      steps_total:  8,
      user_id:      SYSTEM_USER_ID,
    })
    .select('id')
    .single()
  if (error) {
    console.warn(`[ingest] WARNING: could not open pipeline_run: ${error.message}`)
  } else {
    pipelineRunId = data.id
    console.log(`[ingest] pipeline_run opened: id=${pipelineRunId}`)
  }
}

let stepsCompleted = 0
let themesPromoted = 0

try {
  // ── Step 1: Staleness guard ─────────────────────────────────────────────────────
  const { data: lastRun } = await supabase
    .from('pipeline_runs')
    .select('completed_at, status, diagnostics')
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  if (lastRun?.completed_at) {
    const staleHours = (Date.now() - new Date(lastRun.completed_at).getTime()) / 36e5
    if (staleHours > 36) {
      console.warn(`[ingest] WARNING: last completed run was ${staleHours.toFixed(1)}h ago (>36h — STALE). Dashboard will show staleness banner.`)
    } else {
      console.log(`[ingest] Staleness OK: last run ${staleHours.toFixed(1)}h ago`)
    }
  }
  stepsCompleted++

  // ── Step 2: Parse & upsert active_themes.yml ──────────────────────────────────
  console.log('[ingest] Reading state/active_themes.yml')
  const themesRaw = parseYaml(readFileSync('state/active_themes.yml', 'utf8'))
  console.log(`[ingest] Found ${themesRaw.themes?.length ?? 0} theme(s), ${themesRaw.watchpoints?.length ?? 0} watchpoint(s)`)

  const regimeStateStr = themesRaw.regime_state
    ? [
        themesRaw.regime_state.composite_signal,
        `CAPE ${themesRaw.regime_state.cape_current}`,
        `monetary ${themesRaw.regime_state.monetary_stance}`,
      ].filter(Boolean).join(' | ')
    : null

  const themeRows = (themesRaw.themes ?? []).map(t => ({
    id:                      t.id,
    tag:                     t.tag,
    secondary_tags:          t.secondary_tags ?? [],
    title:                   t.title,
    status:                  t.status ?? 'Watchpoint',
    continuity:              t.continuity ?? null,
    first_seen:              t.first_seen,
    last_updated:            t.last_updated,
    conviction:              t.conviction,
    score_e:                 t.conviction_scores?.E ?? 0,
    score_m:                 t.conviction_scores?.M ?? 0,
    score_c:                 t.conviction_scores?.C ?? 0,
    score_t:                 t.conviction_scores?.T ?? 0,
    conviction_delta:        normalizeDelta(t.conviction_delta),
    conviction_delta_reason: t.conviction_delta_reason ?? null,
    horizon:                 t.horizon,
    evidence_tier:           t.evidence_tier ?? 'Speculative',
    mechanism_chain:         t.mechanism_chain,
    chain_detail:            t.chain_detail ?? [],
    invalidation:            t.invalidation,
    anchored:                t.anchored ?? false,
    anchored_since:          t.anchored_since ?? null,
    source:                  t.source ?? null,
    dimensions:              t.dimensions ?? [],
    regime_state:            regimeStateStr,
    user_id:                 SYSTEM_USER_ID,
    updated_at:              new Date().toISOString(),
  }))

  await upsertAndLog('themes', themeRows, 'id', 'themes')
  themesPromoted = themeRows.filter(t => t.status === 'Active').length
  stepsCompleted++

  // ── Step 3: Watchpoints ────────────────────────────────────────────────────────
  const watchpointRows = (themesRaw.watchpoints ?? []).map(w => ({
    id:            w.id,
    tag:           w.tag,
    trigger_desc:  w.trigger,
    evidence_tier: w.evidence_tier ?? 'Speculative',
    conviction:    w.conviction,
    watch_until:   w.watch_until ?? null,
    user_id:       SYSTEM_USER_ID,
  }))
  await upsertAndLog('watchpoints', watchpointRows, 'id', 'watchpoints')
  stepsCompleted++

  // ── Step 4: Conviction log ─────────────────────────────────────────────────────
  console.log('[ingest] Reading state/conviction_log.yml')
  const logRaw = parseYaml(readFileSync('state/conviction_log.yml', 'utf8'))

  const logRows = (logRaw.entries ?? []).map(e => ({
    user_id:   SYSTEM_USER_ID,
    theme_id:  e.theme_id,
    scored_at: e.date ? new Date(e.date).toISOString() : new Date().toISOString(),
    evidence:  e.conviction_scores?.E ?? e.evidence ?? 0,
    mechanism: e.conviction_scores?.M ?? e.mechanism ?? 0,
    consensus: e.conviction_scores?.C ?? e.consensus ?? 0,
    timing:    e.conviction_scores?.T ?? e.timing ?? 0,
    total:     e.conviction ?? (e.conviction_scores
      ? Object.values(e.conviction_scores).reduce((a, b) => a + b, 0)
      : 0),
    delta:     e.delta ? normalizeDelta(e.delta) : null,
    reason:    e.reason ?? null,
  }))

  if (logRows.length) {
    console.log(`[ingest] conviction_log: inserting ${logRows.length} entry(ies) (duplicates ignored)…`)
    const { error } = await supabase
      .from('conviction_log')
      .upsert(logRows, { onConflict: 'scored_at,theme_id', ignoreDuplicates: true })
    if (error) fatal('conviction_log', error, logRows)
    console.log('[ingest] conviction_log: ✓ done')
  } else {
    console.log('[ingest] conviction_log: empty — skipping')
  }
  stepsCompleted++

  // ── Step 5: Synthesis outputs (daily MD) ─────────────────────────────────────
  const dailyDir = 'outputs/daily'
  if (existsSync(dailyDir)) {
    const files = readdirSync(dailyDir).filter(f => f.endsWith('.md')).sort().slice(-7) // last 7 days
    const outputRows = files.map(fname => {
      const md = readFileSync(`${dailyDir}/${fname}`, 'utf8')
      const fm = parseFrontmatter(md)
      const dateMatch = fname.match(/(\d{4}-\d{2}-\d{2})/)
      const outputDate = dateMatch?.[1] ?? RUN_DATE
      return {
        output_date:    outputDate,
        output_type:    'daily',
        title:          fm.title ?? `Daily Synthesis ${outputDate}`,
        content_md:     md,
        themes_count:   fm.themes_count ?? 0,
        tomorrow_focus: fm.tomorrow_focus ?? [],
        user_id:        SYSTEM_USER_ID,
      }
    })
    if (outputRows.length) {
      console.log(`[ingest] synthesis_outputs: upserting ${outputRows.length} daily file(s)…`)
      const { error } = await supabase
        .from('synthesis_outputs')
        .upsert(outputRows, { onConflict: 'output_date,output_type', ignoreDuplicates: false })
      if (error) console.warn(`[ingest] WARNING: synthesis_outputs upsert failed: ${error.message}`)
      else console.log('[ingest] synthesis_outputs: ✓ done')
    }
  }
  stepsCompleted++

  // ── Step 6: Linear issues sync (optional) ──────────────────────────────────────
  if (LINEAR_API_KEY) {
    try {
      const res = await fetch('https://api.linear.app/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: LINEAR_API_KEY },
        body: JSON.stringify({
          query: `{
            issues(filter: { project: { id: { eq: "bae0b90a-60b9-443c-b01f-775d1698fb5e" } }, state: { type: { neq: "completed" } } }) {
              nodes {
                identifier title state { name } priority
                description
              }
            }
          }`,
        }),
      })
      const { data } = await res.json()
      const issueRows = (data?.issues?.nodes ?? []).map(i => ({
        code:           i.identifier,
        title:          i.title,
        label_function: 'synthesis',
        label_priority: ['critical','high','medium','low'][i.priority - 1] ?? 'medium',
        label_origin:   'agent-raised',
        problem:        i.description ?? i.title,
        resolved:       false,
        user_id:        SYSTEM_USER_ID,
      }))
      if (issueRows.length) {
        const { error } = await supabase
          .from('issues')
          .upsert(issueRows, { onConflict: 'code', ignoreDuplicates: false })
        if (error) console.warn(`[ingest] WARNING: issues sync failed: ${error.message}`)
        else console.log(`[ingest] issues: ✓ synced ${issueRows.length} Linear issue(s)`)
      }
    } catch (e) {
      console.warn(`[ingest] WARNING: Linear sync skipped: ${e.message}`)
    }
  } else {
    console.log('[ingest] LINEAR_API_KEY not set — issues sync skipped')
  }
  stepsCompleted++

  // ── Step 7–8: Close pipeline_run (completed) ────────────────────────────────────
  if (pipelineRunId) {
    const { error } = await supabase
      .from('pipeline_runs')
      .update({
        completed_at:    new Date().toISOString(),
        status:          'completed',
        steps_completed: stepsCompleted,
        themes_promoted: themesPromoted,
        diagnostics:     'HEALTHY',
      })
      .eq('id', pipelineRunId)
    if (error) console.warn(`[ingest] WARNING: could not close pipeline_run: ${error.message}`)
    else console.log(`[ingest] pipeline_run ${pipelineRunId} closed as completed`)
  }

  console.log('✔ [ingest] All steps complete.')

} catch (err) {
  console.error(`[ingest] FATAL: ${err.message}`)
  if (pipelineRunId) {
    await supabase
      .from('pipeline_runs')
      .update({
        completed_at: new Date().toISOString(),
        status:       'failed',
        steps_completed: stepsCompleted,
        error_detail: err.message,
      })
      .eq('id', pipelineRunId)
  }
  process.exit(1)
}
