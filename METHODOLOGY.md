# World Alpha — Research Synthesis Methodology

## §0. Definitions

  Session:
    One trading day: Monday through Friday, excluding public holidays
    observed by the primary exchange or financial centre most relevant
    to the theme's affected dimension.
    Example: a MONETARY_POLICY theme affecting USD rates uses NYSE/Fed
    calendar. A GEOPOLITICAL_RISK theme affecting European energy uses
    the Frankfurt/London calendar.
    When a theme spans multiple geographies, use the union of their
    holiday calendars (i.e., a day is a non-session if either market
    is closed).

## Objective

Transform raw global information into structured, mechanism-grounded
research narratives that answer three questions:

  1. What has materially changed in the underlying picture?
  2. Why does it matter — what is the causal chain?
  3. How confident are we, and what would invalidate this view?

## 1. Research-first framing

World Alpha does NOT start from market price action.
Starting from prices introduces recency and anchoring bias.

  Correct:   Event → Mechanism → Structural implication → Dimensions
  Incorrect: Price move → Rationalization → Narrative

If the only evidence for a narrative is a price move,
it is not promoted to Active Theme status.

## 2. Mechanism chain requirement

Every promoted item must include a complete mechanism chain:

  [TRIGGER] → [TRANSMISSION] → [AFFECTED DIMENSION] → [HORIZON]

Horizon categories:
  TACTICAL:    1–5 sessions  (see §0 for session definition)
  SHORT:       1–4 weeks
  STRUCTURAL:  1–6 months
  SECULAR:     6+ months

Example chains:
  Central bank hawkish surprise
  → Reprices terminal rate expectations
  → Compresses risk appetite, strengthens funding currency
  → TACTICAL / SHORT

  Export control expansion (strategic tech)
  → Disrupts capex planning for downstream manufacturers
  → Sector growth and margin uncertainty
  → STRUCTURAL

  Confirmed chokepoint disruption
  → Insurance premium spike, rerouting costs
  → Energy + freight inflation impulse
  → SHORT

## 3. Promotion criteria

Promote to Active Theme when ALL four conditions are met:
  a) Confirmed or credible trigger (not rumor-only)
  b) Complete mechanism chain (§2 above)
  c) Expected to compound or evolve over ≥ 2 weeks
  d) Affects ≥ 2 distinct economic dimensions (TAXONOMY.md)

Remain as Watchpoint when ANY of the following:
  - Source is Speculative (not yet Confirmed or Reported)
  - Mechanism is partial or contested
  - Expected duration < 1 week
  - Affects only one dimension

## 4. Evidence tiers

  CONFIRMED    Primary source: official release, legal text, CB
               statement, verified data release, official transcript.
               Confidence multiplier: 1.0

  REPORTED     Secondary source: credible wire (Reuters, Bloomberg,
               FT, WSJ, Nikkei), multiple corroborating outlets,
               named officials.
               Confidence multiplier: 0.7

  SPECULATIVE  Single source, unnamed officials, unverified claims,
               analyst extrapolation.
               Confidence multiplier: 0.3

Evidence tier must be declared inline for every promoted item.

## 5. What to synthesize

  INCLUDE:
  - Official policy changes (CB decisions, guidance, regulations,
    sanctions, legal texts)
  - Confirmed geopolitical events with economic transmission paths
  - Hard data releases that materially shift the structural picture
  - Cross-theme interactions (where two themes reinforce or offset)
  - Consensus shift signals (when analyst community pivots, note it
    as a Reported observation — not as evidence)

  EXCLUDE:
  - Opinion, commentary, analyst notes (unless flagging consensus shift)
  - Rumor or unnamed-source reports (Speculative only, Watchpoints)
  - Price moves without structural catalyst
  - Repeated noise on known themes (log as Ongoing delta, not new signal)

## 6. Continuity discipline

Every item in daily synthesis must declare:

  Status:  New | Ongoing | Reversal | Closed
  Ref:     YYYY-MM-DD (first appearance or last major change)
  Delta:   One sentence describing what changed vs. prior synthesis

Ongoing items with no material delta for > 5 days must be:
  - Escalated: new development justifies a refresh, OR
  - Archived: moved to state/active_themes.yml as background context
  Stale items must NOT be repeated as if they carry new information.

## 7. Cross-theme interaction mapping (required weekly)

At least once per week, the synthesis must map interactions
between active themes:

  AMPLIFYING:   Theme A accelerates Theme B's mechanism
  OFFSETTING:   Theme A dampens Theme B's expected outcome
  CONDITIONAL:  Theme B only activates if Theme A resolves
                a specific way

This is the highest-value synthesis output. It must not be skipped.
Failure to produce a cross-theme map triggers a Linear issue.

For Task A runs: apply elevated thinking effort to this step only,
even within a medium-effort run (see INVOKE.md Thinking effort reference).

## 8. Invalidation discipline

Every Active Theme must state explicit, observable invalidation
conditions at the time of promotion:

  Format: "Invalidated if [specific observable event or data]"

  Good:  "Invalidated if Fed delivers ≥25bp cut with no
          hawkish guidance offset at next meeting."
  Bad:   "Invalidated if the situation changes."

Unfalsifiable themes are not promoted. If invalidation conditions
cannot be stated in observable terms, the item remains a Watchpoint.
