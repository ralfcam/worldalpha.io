#!/usr/bin/env node
/**
 * World Alpha — Supabase Ingest Script (POC)
 * Parses state/active_themes.yml and state/conviction_log.yml
 * then upserts into Supabase using the service role key.
 *
 * Tables targeted:
 *   public.themes          — upsert on id
 *   public.watchpoints     — upsert on id
 *   public.conviction_log  — upsert on (log_date, theme_id)
 *
 * Run: node scripts/ingest-supabase.mjs
 * Env: SUPABASE_URL, SUPABASE_SERVICE_KEY, SYSTEM_USER_ID
 */

import { readFileSync } from 'fs'
import { load as parseYaml } from 'js-yaml'
import { createClient } from '@supabase/supabase-js'

// ── Env ──────────────────────────────────────────────────────────────────────
const { SUPABASE_URL, SUPABASE_SERVICE_KEY, SYSTEM_USER_ID } = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !SYSTEM_USER_ID) {
  console.error('[ingest] FATAL: Missing required env vars (SUPABASE_URL, SUPABASE_SERVICE_KEY, SYSTEM_USER_ID)')
  process.exit(1)
}

// Service role client — bypasses RLS; never use in browser/client bundles
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
})

// ── Helpers ──────────────────────────────────────────────────────────────────
const DELTA_MAP = { up: 'up', down: 'down', flat: 'flat', '↑': 'up', '↓': 'down', '→': 'flat' }

function normalizeDelta(raw) {
  return DELTA_MAP[raw] ?? 'flat'
}

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
  if (!rows.length) {
    console.log(`[ingest] ${label}: nothing to upsert — skipping`)
    return
  }
  console.log(`[ingest] ${label}: upserting ${rows.length} row(s) on conflict(${conflictCol})…`)
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflictCol, ignoreDuplicates: false })
  if (error) fatal(label, error, rows)
  console.log(`[ingest] ${label}: ✓ done`)
}

// ── 1. Parse active_themes.yml ───────────────────────────────────────────────
console.log('[ingest] Reading state/active_themes.yml')
const themesRaw = parseYaml(readFileSync('state/active_themes.yml', 'utf8'))
console.log(`[ingest] Found ${themesRaw.themes?.length ?? 0} theme(s), ${themesRaw.watchpoints?.length ?? 0} watchpoint(s)`)
console.log(`[ingest] State generated_at: ${themesRaw.generated_at}`)

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
  user_id:                 SYSTEM_USER_ID,
  updated_at:              new Date().toISOString(),
}))

await upsertAndLog('themes', themeRows, 'id', 'themes')

// ── 2. Parse watchpoints ─────────────────────────────────────────────────────
const watchpointRows = (themesRaw.watchpoints ?? []).map(w => ({
  id:            w.id,
  tag:           w.tag,
  trigger_desc:  w.trigger,
  evidence_tier: w.evidence_tier ?? 'Speculative',
  conviction:    w.conviction,
  watch_until:   w.watch_until,
  user_id:       SYSTEM_USER_ID,
}))

await upsertAndLog('watchpoints', watchpointRows, 'id', 'watchpoints')

// ── 3. Parse conviction_log.yml ──────────────────────────────────────────────
console.log('[ingest] Reading state/conviction_log.yml')
const logRaw = parseYaml(readFileSync('state/conviction_log.yml', 'utf8'))

const logRows = (logRaw.entries ?? []).map(e => ({
  log_date:   e.date,
  theme_id:   e.theme_id,
  conviction: e.conviction,
  delta:      normalizeDelta(e.delta),
  reason:     e.reason,
  user_id:    SYSTEM_USER_ID,
}))

if (logRows.length) {
  console.log(`[ingest] conviction_log: inserting ${logRows.length} entry(ies) (duplicates ignored)…`)
  const { error } = await supabase
    .from('conviction_log')
    .upsert(logRows, { onConflict: 'log_date,theme_id', ignoreDuplicates: true })
  if (error) fatal('conviction_log', error, logRows)
  console.log('[ingest] conviction_log: ✓ done')
} else {
  console.log('[ingest] conviction_log: entries[] is empty — nothing to insert')
}

// ── 4. Regime state — stdout only (schema migration pending)
if (themesRaw.regime_state) {
  const r = themesRaw.regime_state
  console.log(`[ingest] regime_state: ${r.composite_signal} | CAPE ${r.cape_current} | monetary ${r.monetary_stance}`)
  console.log('[ingest] NOTE: regime_state not persisted yet — run scripts/003_add_missing_cols.sql first')
}

console.log('[ingest] ✅ All steps complete.')
