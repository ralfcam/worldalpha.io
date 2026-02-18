# World Alpha — Thematic Taxonomy

## Design intent

Themes are structural research categories, not asset classes.
They cut across instruments, geographies, and time horizons.
Mapping to instruments is the user's responsibility.

## Primary themes

  MONETARY_POLICY
    Central bank rate paths, terminal rate expectations,
    QT/QE regime changes, FX interventions, YCC regimes.
    Dimensions: Rates, Credit, FX, Volatility

  FISCAL_SOVEREIGN
    Government deficit/debt dynamics, sovereign bond supply,
    funding stress, tax/spending regime changes,
    sovereign creditworthiness events.
    Dimensions: Rates, Credit, FX

  INFLATION_REGIME
    Supply-side vs demand-side drivers, wage-price dynamics,
    commodity input costs, expectations anchoring.
    Dimensions: Rates, FX, Real assets

  GROWTH_CYCLE
    Leading indicator shifts (PMI, employment, credit),
    hard data surprises, consumer/investment dynamics,
    recession/expansion regime change.
    Dimensions: Equities, Credit, FX, Rates

  GEOPOLITICAL_RISK
    Armed conflict and escalation, alliance framework changes,
    political transition risk, sanctions and economic warfare.
    Dimensions: Energy, Shipping, Credit spreads, FX

  SUPPLY_CHAIN
    Critical materials and minerals, semiconductor/tech supply,
    agricultural supply, logistics and freight disruption.
    Dimensions: Inflation, Sector equities, Credit

  ENERGY_TRANSITION
    Fossil fuel supply/pricing (OPEC+, shale, LNG),
    chokepoint disruption (Hormuz, Red Sea, Taiwan Strait),
    renewable policy and investment, carbon pricing.
    Dimensions: Inflation, Rates, Sector equities

  LIQUIDITY_CREDIT
    Global dollar liquidity, EM/DM credit spread dynamics,
    funding market stress (repo, cross-currency basis),
    banking system risk, regulatory shifts.
    Dimensions: Credit, FX, Rates, Volatility

  TECHNOLOGY_POLICY
    AI/compute regulation, export controls (semis, cloud),
    digital currency and payment system shifts,
    platform regulation with macro-level implications.
    Dimensions: Supply chains, Sector equities, FX

  STRUCTURAL_SHIFT
    Deglobalization, friendshoring, demographic inflection,
    long-cycle commodity supercycles,
    regime changes in global capital flows.
    Dimensions: All — multi-year horizon

## Tagging rules

  - Every promoted item: 1 primary theme + up to 2 secondary themes.
  - Cross-theme interactions format: PRIMARY × SECONDARY
    Example: MONETARY_POLICY × GEOPOLITICAL_RISK
  - Watchpoints may carry theme tags without mechanism chains.
  - Do not create ad-hoc themes outside this taxonomy.
    If a new theme is needed, propose it via Linear issue:
    theme [🟡 medium] with rationale.
