const DATA_FILES = [
  "../data/site_meta.json",
  "../data/sources.json",
  "../data/countries.json",
  "../data/comparators.json",
  "../data/indicators.json",
  "../data/lenses.json",
  "../data/pathways.json",
  "../data/policies.json",
  "../data/budget_map.json",
  "../data/accelerators.json",
  "../data/signals.json",
  "../data/news_signals.json",
  "../data/external_scores.json",
  "../data/pulse_history.json",
  "../data/toolkit.json"
];

const PULSE_CHANNELS = [
  {
    id: "jobs",
    title: "Jobs and inclusion",
    weight: 1.25,
    keywords: ["job", "jobs", "employment", "labor", "labour", "skills", "women", "enterprise", "formalization", "inclusion"],
    indicators: [
      { id: "quality_jobs_index", positive: true, weight: 1.5 },
      { id: "youth_unemployment", positive: false, weight: 1.2 },
      { id: "informality", positive: false, weight: 1.0 },
      { id: "female_lfp", positive: true, weight: 0.8 }
    ]
  },
  {
    id: "financing",
    title: "Fiscal space and finance",
    weight: 1.15,
    keywords: ["finance", "fiscal", "capital", "investment", "revenue", "tax", "budget", "procurement"],
    indicators: [
      { id: "tax_gdp", positive: true, weight: 1.1 },
      { id: "private_capital", positive: true, weight: 1.2 },
      { id: "public_investment", positive: true, weight: 0.9 },
      { id: "budget_execution", positive: true, weight: 1.0 }
    ]
  },
  {
    id: "implementation",
    title: "Implementation and state capability",
    weight: 1.2,
    keywords: ["implementation", "delivery", "coordination", "execution", "governance", "local", "data", "digital public finance"],
    indicators: [
      { id: "implementation_capacity", positive: true, weight: 1.3 },
      { id: "budget_execution", positive: true, weight: 1.1 },
      { id: "data_readiness", positive: true, weight: 0.9 }
    ]
  },
  {
    id: "resilience",
    title: "Resilience and continuity",
    weight: 1.05,
    keywords: ["resilience", "climate", "disaster", "infrastructure", "energy", "roads", "shock"],
    indicators: [
      { id: "resilience_readiness", positive: true, weight: 1.2 },
      { id: "clean_energy", positive: true, weight: 0.9 },
      { id: "disaster_risk", positive: false, weight: 1.1 }
    ]
  },
  {
    id: "transition",
    title: "Trade and transition readiness",
    weight: 1.0,
    keywords: ["export", "trade", "transition", "competitiveness", "diversification", "logistics"],
    indicators: [
      { id: "readiness_index", positive: true, weight: 1.2 },
      { id: "export_readiness", positive: true, weight: 1.0 },
      { id: "transition_risk", positive: false, weight: 1.0 },
      { id: "preference_exposure", positive: false, weight: 0.8 }
    ]
  }
];

const state = {
  data: null,
  selectedCountry: "NPL",
  selectedPeer: "VNM",
  selectedGroup: "south_asia_core",
  selectedLens: "macro_productivity",
  selectedPathwayDriver: "all",
  deferredInstallPrompt: null
};

const elements = {
  gapStatement: document.getElementById("gapStatement"),
  heroDescription: document.getElementById("heroDescription"),
  snapshotStamp: document.getElementById("snapshotStamp"),
  topGithubLink: document.getElementById("topGithubLink"),
  topLinkedinLink: document.getElementById("topLinkedinLink"),
  countrySelect: document.getElementById("countrySelect"),
  peerSelect: document.getElementById("peerSelect"),
  groupSelect: document.getElementById("groupSelect"),
  lensSelect: document.getElementById("lensSelect"),
  controlNote: document.getElementById("controlNote"),
  heroPeerNote: document.getElementById("heroPeerNote"),
  peerStrip: document.getElementById("peerStrip"),
  peerExplainGrid: document.getElementById("peerExplainGrid"),
  officialAnchorNote: document.getElementById("officialAnchorNote"),
  externalAnchorGrid: document.getElementById("externalAnchorGrid"),
  scoreFamilyGrid: document.getElementById("scoreFamilyGrid"),
  heroMetrics: document.getElementById("heroMetrics"),
  growthStory: document.getElementById("growthStory"),
  financingStory: document.getElementById("financingStory"),
  transitionStory: document.getElementById("transitionStory"),
  riskList: document.getElementById("riskList"),
  topAccelerators: document.getElementById("topAccelerators"),
  pulseMethodNote: document.getElementById("pulseMethodNote"),
  pulseLastRefresh: document.getElementById("pulseLastRefresh"),
  pulseStatusBadge: document.getElementById("pulseStatusBadge"),
  pulseScore: document.getElementById("pulseScore"),
  pulseBenchmarkLabel: document.getElementById("pulseBenchmarkLabel"),
  pulseDelta: document.getElementById("pulseDelta"),
  pulseSummaryText: document.getElementById("pulseSummaryText"),
  pulseChangeSinceLast: document.getElementById("pulseChangeSinceLast"),
  pulse30Day: document.getElementById("pulse30Day"),
  pulse90Day: document.getElementById("pulse90Day"),
  pulseConfidence: document.getElementById("pulseConfidence"),
  pulseNextRefresh: document.getElementById("pulseNextRefresh"),
  pulseChannels: document.getElementById("pulseChannels"),
  scoreExplainer: document.getElementById("scoreExplainer"),
  historyChart: document.getElementById("historyChart"),
  historyChartNote: document.getElementById("historyChartNote"),
  positiveDrivers: document.getElementById("positiveDrivers"),
  negativeDrivers: document.getElementById("negativeDrivers"),
  interventionPriority: document.getElementById("interventionPriority"),
  newsRefreshNote: document.getElementById("newsRefreshNote"),
  newsSignalBoard: document.getElementById("newsSignalBoard"),
  lensChips: document.getElementById("lensChips"),
  lensIntro: document.getElementById("lensIntro"),
  lensIndicatorGrid: document.getElementById("lensIndicatorGrid"),
  pathwayFilters: document.getElementById("pathwayFilters"),
  pathwayExplorer: document.getElementById("pathwayExplorer"),
  policyList: document.getElementById("policyList"),
  budgetList: document.getElementById("budgetList"),
  acceleratorGrid: document.getElementById("acceleratorGrid"),
  comparisonPeerGuide: document.getElementById("comparisonPeerGuide"),
  comparisonGrid: document.getElementById("comparisonGrid"),
  toolkitGrid: document.getElementById("toolkitGrid"),
  methodNote: document.getElementById("methodNote"),
  methodLinkStack: document.getElementById("methodLinkStack"),
  sourceList: document.getElementById("sourceList"),
  footerCredit: document.getElementById("footerCredit"),
  footerGithubLink: document.getElementById("footerGithubLink"),
  footerLinkedinLink: document.getElementById("footerLinkedinLink")
};

init();

async function init() {
  const [siteMeta, sources, countries, comparators, indicators, lenses, pathways, policies, budgetMap, accelerators, signals, newsSignals, externalScores, pulseHistory, toolkit] =
    await Promise.all(DATA_FILES.map((file) => fetch(file).then((response) => response.json())));

  state.data = {
    siteMeta,
    sources,
    sourceMap: Object.fromEntries(sources.map((item) => [item.id, item])),
    countries,
    countryMap: Object.fromEntries(countries.map((item) => [item.country_code, item])),
    comparators,
    comparatorMap: Object.fromEntries(comparators.country_groups.map((item) => [item.id, item])),
    indicators,
    indicatorMap: Object.fromEntries(indicators.map((item) => [`${item.country_code}:${item.id}`, item])),
    lenses,
    lensMap: Object.fromEntries(lenses.map((item) => [item.id, item])),
    indicatorLensMap: Object.fromEntries(lenses.flatMap((lens) => lens.indicator_ids.map((id) => [id, lens.id]))),
    pathways,
    policies,
    budgetMap,
    accelerators,
    signals,
    newsSignals,
    externalScores,
    pulseHistory,
    toolkit
  };

  state.selectedCountry = siteMeta.default_country || "NPL";
  state.selectedGroup = defaultBenchmarkGroup(currentCountry());
  state.selectedPeer = currentCountry().aspirational_peer_code;

  populateControls();
  bindEvents();
  registerSectionObserver();
  registerInstallHooks();
  registerServiceWorker();
  render();
}

function populateControls() {
  fillSelect(elements.countrySelect, state.data.countries, state.selectedCountry, (country) => country.country_name, (country) => country.country_code);
  fillSelect(elements.peerSelect, peerOptions(), state.selectedPeer, (country) => `${country.country_name} (${country.peer_type})`, (country) => country.country_code);
  fillSelect(elements.groupSelect, state.data.comparators.country_groups, state.selectedGroup, (group) => group.label, (group) => group.id);
  fillSelect(elements.lensSelect, state.data.lenses, state.selectedLens, (lens) => lens.title, (lens) => lens.id);
}

function bindEvents() {
  elements.countrySelect.addEventListener("change", (event) => {
    state.selectedCountry = event.target.value;
    state.selectedGroup = defaultBenchmarkGroup(currentCountry());
    state.selectedPeer = currentCountry().aspirational_peer_code || peerOptions()[0].country_code;
    fillSelect(elements.peerSelect, peerOptions(), state.selectedPeer, (country) => `${country.country_name} (${country.peer_type})`, (country) => country.country_code);
    fillSelect(elements.groupSelect, state.data.comparators.country_groups, state.selectedGroup, (group) => group.label, (group) => group.id);
    render();
  });

  elements.peerSelect.addEventListener("change", (event) => {
    state.selectedPeer = event.target.value;
    render();
  });

  elements.groupSelect.addEventListener("change", (event) => {
    state.selectedGroup = event.target.value;
    render();
  });

  elements.lensSelect.addEventListener("change", (event) => {
    state.selectedLens = event.target.value;
    renderLenses();
    document.getElementById("lenses")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.addEventListener("click", (event) => {
    const jump = event.target.closest("[data-jump-indicator]");
    if (jump) {
      event.preventDefault();
      const indicatorId = jump.dataset.jumpIndicator;
      const lensId = jump.dataset.jumpLens;
      if (lensId) {
        state.selectedLens = lensId;
        elements.lensSelect.value = lensId;
        renderLenses();
      }
      requestAnimationFrame(() => {
        document.getElementById(`indicator-${indicatorId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    const acceleratorJump = event.target.closest("[data-jump-accelerator]");
    if (acceleratorJump) {
      event.preventDefault();
      const targetId = acceleratorJump.dataset.jumpAccelerator;
      document.getElementById(`accelerator-${targetId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

function render() {
  renderHero();
  renderAnchors();
  renderOverview();
  renderPulse();
  renderLenses();
  renderPathways();
  renderPolicies();
  renderAccelerators();
  renderComparisons();
  renderToolkit();
  renderSources();
  renderFooter();
}

function renderHero() {
  const country = currentCountry();
  const peer = peerCountry();
  const structural = state.data.countryMap[country.structural_peer_code];
  const aspirational = state.data.countryMap[country.aspirational_peer_code];
  const regionalAnchor = state.data.countryMap[country.regional_anchor_code] || country;
  const group = groupById(state.selectedGroup);

  elements.gapStatement.textContent = state.data.siteMeta.platform_gap_statement;
  elements.heroDescription.textContent = state.data.siteMeta.hero_description;
  elements.snapshotStamp.textContent = `Static anchors reflect source publication dates. This curated build was assembled on ${state.data.siteMeta.built_on}.`;
  elements.controlNote.textContent = `Country updates the full atlas. Selected comparator and benchmark group update peer comparisons, bars, and pulse deltas. Lens changes the diagnostic view below.`;
  elements.heroPeerNote.textContent = `${country.country_name} is currently benchmarked against ${group.label}, with ${peer.country_name} as the selected comparator for the live view.`;
  elements.topGithubLink.href = state.data.siteMeta.external_links.github_repo;
  elements.topLinkedinLink.href = state.data.siteMeta.external_links.linkedin;

  const stripItems = [
    { label: "Selected country", value: country.country_name, note: "Anchor country for the current view." },
    { label: "Selected comparator", value: peer.country_name, note: `${peer.peer_type} comparator in the current view.` },
    { label: "Aspirational peer", value: aspirational.country_name, note: "Used to show stronger conversion from growth into jobs and SDG gains." },
    { label: "Structural peer", value: structural.country_name, note: "Used for like-for-like comparison on structure and constraints." },
    { label: "Regional anchor", value: regionalAnchor.country_name, note: regionalAnchor.country_code === country.country_code ? "This country itself acts as a regional anchor in the comparison basket." : "Reference economy shaping trade, logistics, and policy context." },
    { label: "Benchmark group", value: group.label, note: "Used for the main benchmark delta in the pulse section." }
  ];

  elements.peerStrip.innerHTML = stripItems.map(peerStripCard).join("");
  const rationale = country.peer_rationale;
  elements.peerExplainGrid.innerHTML = [
    peerExplainCard("Aspirational peer", rationale.aspirational),
    peerExplainCard("Structural peer", rationale.structural),
    peerExplainCard("Regional anchor", rationale.regional_anchor),
    peerExplainCard("Transition-sensitive", rationale.transition_sensitive)
  ].join("");
}

function renderAnchors() {
  const countryCode = currentCountry().country_code;
  const anchors = state.data.externalScores.filter((item) => item.country_code === countryCode);

  elements.officialAnchorNote.textContent = state.data.siteMeta.official_anchor_note;
  elements.externalAnchorGrid.innerHTML = anchors.length ? anchors.map(anchorCard).join("") : `<p class="empty-state">No source-pinned anchor cards loaded for this country yet.</p>`;
  elements.scoreFamilyGrid.innerHTML = state.data.siteMeta.score_family_notes.map(scoreFamilyCard).join("");
}

function renderOverview() {
  const country = currentCountry();
  const peer = peerCountry();
  const group = groupById(state.selectedGroup);
  const metrics = [
    metricCard("SDSN annual anchor", formatNumber(externalAnchorValue(country.country_code, "SDSN SDG Index")), "Source-verified for Nepal; curated comparator anchor for peers."),
    metricCard("Selected comparator", peer.country_name, `${peer.peer_type} comparator in this live view.`),
    metricCard("GDP growth", `${formatNumber(valueFor(country.country_code, "gdp_growth"))}%`, "Curated macro growth signal."),
    metricCard("Quality jobs", formatNumber(valueFor(country.country_code, "quality_jobs_index")), "Signal for labor absorption and better work."),
    metricCard("Tax to GDP", `${formatNumber(valueFor(country.country_code, "tax_gdp"))}%`, "Simple fiscal-space anchor."),
    metricCard("Implementation capacity", formatNumber(valueFor(country.country_code, "implementation_capacity")), `Selected benchmark: ${group.label}.`),
  ];

  elements.heroMetrics.innerHTML = metrics.join("");
  elements.growthStory.textContent = country.growth_story;
  elements.financingStory.textContent = country.financing_story;
  elements.transitionStory.textContent = country.transition_story;
  renderList(elements.riskList, topSignals(country.country_code).map(signalCard), "No risk signals loaded for this country yet.");
  renderList(elements.topAccelerators, acceleratorsFor(country.country_code).slice(0, 3).map(acceleratorMiniCard), "No accelerator priorities loaded for this country yet.");
}

function renderPulse() {
  const country = currentCountry();
  const pulse = pulseForCountry(country.country_code);
  const history = historyForCountry(country.country_code);
  const latestHistory = history.at(-1);
  const benchmarkLabel = groupById(state.selectedGroup).label;
  const benchmarkPulse = averagePulseForGroup(state.selectedGroup);
  const delta = pulse.score - benchmarkPulse;
  const deltaSinceLast = latestHistory?.delta_since_last ?? 0;
  const rolling30 = rollingDirection(history, 4);
  const rolling90 = rollingDirection(history, history.length);
  const strongest = pulse.channels.slice().sort((a, b) => b.score - a.score)[0];
  const weakest = pulse.channels.slice().sort((a, b) => a.score - b.score)[0];
  const drivers = pulseDrivers(country.country_code);
  const positives = drivers.filter((item) => item.effect > 0).slice(0, 4);
  const negatives = drivers.filter((item) => item.effect < 0).slice(0, 4);
  const interventions = rankedInterventions(country.country_code).slice(0, 4);

  elements.pulseMethodNote.textContent = "The live pulse is an internal twice-weekly benchmark-relative nowcast. It is not Nepal's official SDG Index score.";
  elements.pulseLastRefresh.textContent = latestHistory ? `Last updated ${formatDate(latestHistory.timestamp)}` : "Awaiting first refresh";
  elements.pulseStatusBadge.textContent = pulse.status.label;
  elements.pulseStatusBadge.className = `status-badge ${pulse.status.tone}`;
  elements.pulseScore.textContent = `${formatNumber(pulse.score)} / 100`;
  elements.pulseBenchmarkLabel.textContent = `vs ${benchmarkLabel}`;
  elements.pulseDelta.textContent = `${delta >= 0 ? "+" : ""}${formatNumber(delta)} pts`;
  elements.pulseDelta.className = `pulse-delta ${delta > 1 ? "positive" : delta < -1 ? "negative" : "neutral"}`;
  elements.pulseSummaryText.textContent = `${country.country_name}'s internal pulse is ${pulse.status.label.toLowerCase()} relative to ${benchmarkLabel}. ${strongest.title} is the strongest live channel, while ${weakest.title} is the main drag on near-term momentum.`;
  elements.pulseChangeSinceLast.textContent = `${deltaSinceLast >= 0 ? "+" : ""}${formatNumber(deltaSinceLast)} pts`;
  elements.pulse30Day.textContent = rolling30;
  elements.pulse90Day.textContent = rolling90;
  elements.pulseConfidence.textContent = latestHistory?.confidence || "Medium";
  elements.pulseNextRefresh.textContent = "Tuesday + Friday (Nepal time)";
  elements.pulseChannels.innerHTML = pulse.channels.map(channelCard).join("");
  elements.scoreExplainer.innerHTML = scoreExplainerCards().join("");
  elements.historyChart.innerHTML = historyChartSvg(history, externalAnchorValue(country.country_code, "SDSN SDG Index"));
  elements.historyChartNote.textContent = `The annual SDSN anchor is pinned as a dated reference point. The pulse line is a separate internal series built for twice-weekly monitoring.`;
  renderList(elements.positiveDrivers, positives.map(driverCard), "No strengthening drivers identified yet.");
  renderList(elements.negativeDrivers, negatives.map(driverCard), "No weakening drivers identified yet.");
  renderList(elements.interventionPriority, interventions.map(simulatorCard), "No intervention ranking available yet.");
  renderNewsSignals();
}

function renderLenses() {
  elements.lensChips.innerHTML = state.data.lenses
    .map((lens) => `<button class="filter-chip ${lens.id === state.selectedLens ? "active" : ""}" data-lens-chip="${escapeHtml(lens.id)}">${escapeHtml(shortLabel(lens.title))}</button>`)
    .join("");

  elements.lensChips.querySelectorAll("[data-lens-chip]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedLens = button.dataset.lensChip;
      elements.lensSelect.value = state.selectedLens;
      renderLenses();
    });
  });

  const lens = state.data.lensMap[state.selectedLens];
  elements.lensIntro.textContent = lens.summary;
  elements.lensIndicatorGrid.innerHTML = lens.indicator_ids.map((indicatorId) => renderIndicatorCard(indicatorId)).join("");
}

function renderPathways() {
  const countryCode = currentCountry().country_code;
  const drivers = ["all", ...new Set(state.data.pathways.filter((item) => item.country_scope === countryCode || item.country_scope === "cross-country").map((item) => item.driver))];
  elements.pathwayFilters.innerHTML = drivers
    .map((driver) => `<button class="filter-chip ${driver === state.selectedPathwayDriver ? "active" : ""}" data-driver="${escapeHtml(driver)}">${escapeHtml(driver === "all" ? "All pathways" : shortLabel(driver))}</button>`)
    .join("");

  elements.pathwayFilters.querySelectorAll("[data-driver]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedPathwayDriver = button.dataset.driver;
      renderPathways();
    });
  });

  const visible = state.data.pathways.filter((pathway) => {
    const scopeMatches = pathway.country_scope === countryCode || pathway.country_scope === "cross-country";
    const driverMatches = state.selectedPathwayDriver === "all" || pathway.driver === state.selectedPathwayDriver;
    return scopeMatches && driverMatches;
  });

  elements.pathwayExplorer.innerHTML = visible.map(pathwayCard).join("");
}

function renderPolicies() {
  const countryCode = currentCountry().country_code;
  renderList(elements.policyList, state.data.policies.filter((item) => item.country_code === countryCode).map(policyCard), "No policy mappings loaded for this country yet.");
  renderList(elements.budgetList, state.data.budgetMap.filter((item) => item.country_code === countryCode).map(budgetCard), "No budget mappings loaded for this country yet.");
}

function renderAccelerators() {
  elements.acceleratorGrid.innerHTML = acceleratorsFor(currentCountry().country_code).map(acceleratorCard).join("");
}

function renderComparisons() {
  const country = currentCountry();
  const peer = peerCountry();
  const structural = state.data.countryMap[country.structural_peer_code];
  const regionalAnchor = state.data.countryMap[country.regional_anchor_code] || country;
  const group = groupById(state.selectedGroup);
  const comparisonIds = state.data.siteMeta.comparison_indicator_ids;

  elements.comparisonPeerGuide.innerHTML = [
    peerExplainCard("Aspirational peer", country.peer_rationale.aspirational),
    peerExplainCard("Structural peer", country.peer_rationale.structural),
    peerExplainCard("Regional anchor", country.peer_rationale.regional_anchor),
    peerExplainCard("Transition-sensitive", country.peer_rationale.transition_sensitive)
  ].join("");

  elements.comparisonGrid.innerHTML = comparisonIds
    .map((indicatorId) => {
      const rows = [
        comparisonRow(country.country_name, valueFor(country.country_code, indicatorId), indicatorId),
        comparisonRow(group.label, averageForGroup(indicatorId, group.id), indicatorId),
        comparisonRow(peer.country_name, valueFor(peer.country_code, indicatorId), indicatorId),
        comparisonRow(structural.country_name, valueFor(structural.country_code, indicatorId), indicatorId),
        comparisonRow(regionalAnchor.country_name, valueFor(regionalAnchor.country_code, indicatorId), indicatorId),
        comparisonRow("South Asia avg", averageForGroup(indicatorId, "south_asia_core"), indicatorId),
        comparisonRow("Southeast Asia avg", averageForGroup(indicatorId, "southeast_asia_benchmark"), indicatorId)
      ];

      return `
        <article class="comparison-card card-surface">
          <h3>${escapeHtml(labelForIndicator(indicatorId))}</h3>
          <div class="bar-group">${rows.join("")}</div>
        </article>
      `;
    })
    .join("");
}

function renderToolkit() {
  elements.toolkitGrid.innerHTML = state.data.toolkit.map(toolCard).join("");
}

function renderSources() {
  elements.methodNote.textContent = state.data.siteMeta.method_note;
  const links = [
    { label: "GitHub repository", url: state.data.siteMeta.external_links.github_repo },
    { label: "Docs folder", url: state.data.siteMeta.external_links.github_docs },
    { label: "LinkedIn", url: state.data.siteMeta.external_links.linkedin }
  ];
  elements.methodLinkStack.innerHTML = links.map((item) => `<a class="method-link" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.label)}</a>`).join("");
  elements.sourceList.innerHTML = state.data.sources.map(sourceCard).join("");
}

function renderFooter() {
  elements.footerCredit.textContent = state.data.siteMeta.developer_credit || "Developer - Policy Economist NIRNAYA BHATTA";
  elements.footerGithubLink.href = state.data.siteMeta.external_links.github_repo;
  elements.footerLinkedinLink.href = state.data.siteMeta.external_links.linkedin;
}

function renderNewsSignals() {
  const countryCode = currentCountry().country_code;
  const items = state.data.newsSignals.filter((item) => item.country_code === countryCode).sort((a, b) => b.impact_score - a.impact_score).slice(0, 6);
  elements.newsRefreshNote.textContent = state.data.siteMeta.weekly_refresh_note;
  renderList(elements.newsSignalBoard, items.map(newsSignalCard), "No linked news signals are available for this country yet.");
}

function peerStripCard(item) {
  return `
    <article class="peer-strip-card">
      <span class="metric-label">${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
      <p class="indicator-note">${escapeHtml(item.note)}</p>
    </article>
  `;
}

function peerExplainCard(title, body) {
  return `
    <article class="peer-explain-card soft-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body)}</p>
    </article>
  `;
}

function anchorCard(item) {
  const rankText = item.rank ? `Rank ${item.rank} / ${item.rank_total}` : "No global rank attached in this card";
  return `
    <article class="anchor-card card-surface ${item.status}">
      <div class="subsection-head">
        <div>
          <h3>${escapeHtml(item.score_family)}</h3>
          <p class="mini-caption">${escapeHtml(item.organization)}</p>
        </div>
        <span class="mini-badge">${escapeHtml(item.status.replace(/-/g, " "))}</span>
      </div>
      <strong>${escapeHtml(formatNumber(item.value))} / ${escapeHtml(String(item.scale_max))}</strong>
      <p class="indicator-note">${escapeHtml(rankText)}</p>
      <p class="meta-line">Published: ${escapeHtml(String(item.publication_date))}</p>
      <p class="indicator-note">${escapeHtml(item.comparability_note)}</p>
      <a href="${escapeHtml(item.source_url)}" target="_blank" rel="noreferrer">Open source</a>
    </article>
  `;
}

function scoreFamilyCard(item) {
  return `
    <article class="score-family-card card-surface soft-card">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
    </article>
  `;
}

function metricCard(label, value, note) {
  return `
    <article class="metric-card card-surface soft-card">
      <span class="metric-label">${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <p class="indicator-note">${escapeHtml(note)}</p>
    </article>
  `;
}

function signalCard(item) {
  const indicatorId = item.linked_indicator_ids?.[0];
  const lensId = indicatorId ? state.data.indicatorLensMap[indicatorId] : state.selectedLens;
  return `
    <article class="overview-card signal-overview-card">
      <div class="subsection-head">
        <div>
          <h3>${
            indicatorId
              ? `<a href="#indicator-${escapeHtml(indicatorId)}" data-jump-indicator="${escapeHtml(indicatorId)}" data-jump-lens="${escapeHtml(lensId)}">${escapeHtml(item.label)}</a>`
              : escapeHtml(item.label)
          }</h3>
          <p class="mini-caption">${escapeHtml(item.theme)}</p>
        </div>
        <span class="status-badge ${escapeHtml(item.direction)}">${escapeHtml(item.direction)}</span>
      </div>
      <p>${escapeHtml(item.value)}</p>
      <p class="indicator-note">${escapeHtml(item.threshold_note)}</p>
      <p class="indicator-note"><strong>Why flagged:</strong> ${escapeHtml(item.why_flagged || item.threshold_note)}</p>
      <div class="link-row">
        ${indicatorId ? `<a href="#indicator-${escapeHtml(indicatorId)}" data-jump-indicator="${escapeHtml(indicatorId)}" data-jump-lens="${escapeHtml(lensId)}">Open relevant indicators</a>` : ""}
        ${sourceLinks(item.source_ids)}
      </div>
    </article>
  `;
}

function acceleratorMiniCard(item) {
  return `
    <article class="overview-card accelerator-mini-card">
      <div class="subsection-head">
        <div>
          <h3><a href="#accelerator-${escapeHtml(item.id)}" data-jump-accelerator="${escapeHtml(item.id)}">${escapeHtml(item.title)}</a></h3>
          <p class="mini-caption">Why this matters now</p>
        </div>
        <span class="mini-badge">${escapeHtml(item.country_code)}</span>
      </div>
      <p>${escapeHtml(item.why_now)}</p>
      <div class="link-row">
        <a href="#accelerator-${escapeHtml(item.id)}" data-jump-accelerator="${escapeHtml(item.id)}">Open accelerator</a>
        ${evidenceLink(item.source_ids)}
      </div>
    </article>
  `;
}

function channelCard(item) {
  return `
    <article class="channel-card card-surface soft-card">
      <span class="metric-label">${escapeHtml(item.title)}</span>
      <strong>${escapeHtml(formatNumber(item.score))}</strong>
      <p class="indicator-note">${escapeHtml(channelStatus(item.score))}</p>
    </article>
  `;
}

function driverCard(item) {
  const indicatorId = item.id;
  const lensId = state.data.indicatorLensMap[indicatorId];
  return `
    <article class="driver-card card-surface soft-card">
      <div class="subsection-head">
        <div>
          <h3>${escapeHtml(item.label)}</h3>
          <p class="mini-caption">${escapeHtml(item.channelTitle)}</p>
        </div>
        <span class="driver-impact ${item.effect >= 0 ? "positive" : "negative"}">${item.effect >= 0 ? "+" : ""}${escapeHtml(formatNumber(item.effect))}</span>
      </div>
      <p>${escapeHtml(item.explanation)}</p>
      <div class="link-row">
        <a href="#indicator-${escapeHtml(indicatorId)}" data-jump-indicator="${escapeHtml(indicatorId)}" data-jump-lens="${escapeHtml(lensId)}">To learn more</a>
        ${sourceLinks(indicatorFor(currentCountry().country_code, indicatorId)?.source_ids || [])}
      </div>
    </article>
  `;
}

function simulatorCard(item) {
  return `
    <article class="driver-card card-surface soft-card">
      <div class="subsection-head">
        <div>
          <h3><a href="#accelerator-${escapeHtml(item.id)}" data-jump-accelerator="${escapeHtml(item.id)}">${escapeHtml(item.title)}</a></h3>
          <p class="mini-caption">${escapeHtml(item.channelSummary)}</p>
        </div>
        <span class="lift-badge">+${escapeHtml(formatNumber(item.simulatedLift))} pts</span>
      </div>
      <p>${escapeHtml(item.reason)}</p>
      <div class="link-row">
        <a href="#accelerator-${escapeHtml(item.id)}" data-jump-accelerator="${escapeHtml(item.id)}">Open accelerator</a>
        ${evidenceLink(item.source_ids)}
      </div>
    </article>
  `;
}

function newsSignalCard(item) {
  return `
    <article class="news-card card-surface soft-card">
      <div class="subsection-head">
        <div>
          <h3>${escapeHtml(item.headline)}</h3>
          <p class="mini-caption">${escapeHtml(item.source_label)}</p>
        </div>
        <span class="status-badge ${escapeHtml(item.direction)}">${escapeHtml(item.direction)}</span>
      </div>
      <p>${escapeHtml(item.summary)}</p>
      <div class="chip-set">
        ${item.channels.map((channel) => `<span class="sdg-chip channel-chip">${escapeHtml(channel)}</span>`).join("")}
        ${item.linked_indicator_ids.map((indicatorId) => `<span class="mini-badge">${escapeHtml(labelForIndicator(indicatorId))}</span>`).join("")}
      </div>
      <p class="meta-line">Impact score ${escapeHtml(formatNumber(item.impact_score))} | ${escapeHtml(item.date)}</p>
      <div class="link-row">
        <a href="${escapeHtml(item.source_url)}" target="_blank" rel="noreferrer">Open source</a>
        ${item.linked_indicator_ids[0] ? `<a href="#indicator-${escapeHtml(item.linked_indicator_ids[0])}" data-jump-indicator="${escapeHtml(item.linked_indicator_ids[0])}" data-jump-lens="${escapeHtml(state.data.indicatorLensMap[item.linked_indicator_ids[0]])}">To learn more</a>` : ""}
      </div>
    </article>
  `;
}

function renderIndicatorCard(indicatorId) {
  const indicator = indicatorFor(currentCountry().country_code, indicatorId);
  const peer = peerCountry();
  const structural = state.data.countryMap[currentCountry().structural_peer_code];
  const group = groupById(state.selectedGroup);
  const rows = [
    comparisonRow(currentCountry().country_name, indicator.value, indicator.id),
    comparisonRow(group.label, averageForGroup(indicator.id, group.id), indicator.id),
    comparisonRow(peer.country_name, valueFor(peer.country_code, indicator.id), indicator.id),
    comparisonRow(structural.country_name, valueFor(structural.country_code, indicator.id), indicator.id),
    comparisonRow("South Asia avg", averageForGroup(indicator.id, "south_asia_core"), indicator.id),
    comparisonRow("Southeast Asia avg", averageForGroup(indicator.id, "southeast_asia_benchmark"), indicator.id)
  ];

  return `
    <article id="indicator-${escapeHtml(indicator.id)}" class="indicator-card card-surface">
      <div class="subsection-head">
        <div>
          <h3>${escapeHtml(indicator.label)}</h3>
          <p class="mini-caption">${escapeHtml(indicator.trend)}</p>
        </div>
        <span class="mini-badge">${escapeHtml(indicator.year)}</span>
      </div>
      <strong>${escapeHtml(formatValue(indicator.value, indicator.unit))}</strong>
      <p class="indicator-note">${escapeHtml(indicator.note)}</p>
      <div class="bar-group">${rows.join("")}</div>
      <div class="link-row split-links">
        <span class="meta-line">Sources: ${escapeHtml(indicator.source_ids.map((id) => state.data.sourceMap[id].label).join("; "))}</span>
        ${sourceLinks(indicator.source_ids)}
      </div>
    </article>
  `;
}

function pathwayCard(pathway) {
  return `
    <article class="pathway-card card-surface">
      <div class="subsection-head">
        <h3>${escapeHtml(pathway.driver)}</h3>
        <span class="pill">${escapeHtml(pathway.directness)}</span>
      </div>
      <div class="pathway-flow">
        <span class="pathway-node">${escapeHtml(pathway.driver)}</span>
        <span class="pathway-arrow">→</span>
        <span class="pathway-node">${escapeHtml(pathway.channel)}</span>
        <span class="pathway-arrow">→</span>
        <span class="pathway-node">${escapeHtml(pathway.outcome)}</span>
      </div>
      <p class="indicator-note">${escapeHtml(pathway.policy_relevance)}</p>
      <div class="chip-set">${pathway.sdg_links.map((sdg) => `<span class="sdg-chip">${escapeHtml(sdg)}</span>`).join("")}</div>
    </article>
  `;
}

function policyCard(item) {
  return `
    <article class="subsection-card card-surface soft-card">
      <div class="subsection-head">
        <div>
          <h3>${escapeHtml(item.policy_name)}</h3>
          <p class="mini-caption">${escapeHtml(item.lead_agency)} | ${escapeHtml(item.period)}</p>
        </div>
        <span class="mini-badge">${escapeHtml(item.policy_type)}</span>
      </div>
      <p>${escapeHtml(item.growth_channels.join(", "))}</p>
      <div class="chip-set">${item.direct_sdgs.concat(item.indirect_sdgs).map((sdg) => `<span class="sdg-chip">${escapeHtml(sdg)}</span>`).join("")}</div>
      <div class="link-row">${sourceLinks(item.source_ids)}</div>
    </article>
  `;
}

function budgetCard(item) {
  return `
    <article class="subsection-card card-surface soft-card">
      <div class="subsection-head">
        <div>
          <h3>${escapeHtml(item.ministry_or_sector)}</h3>
          <p class="mini-caption">${escapeHtml(item.budget_type)} | ${escapeHtml(item.year)}</p>
        </div>
        <span class="mini-badge">${escapeHtml(item.confidence)}</span>
      </div>
      <p>${escapeHtml(item.program_area)}</p>
      <p class="indicator-note">${escapeHtml(item.growth_channels.join(", "))}</p>
      <div class="chip-set">${item.sdg_links.map((sdg) => `<span class="sdg-chip">${escapeHtml(sdg)}</span>`).join("")}</div>
    </article>
  `;
}

function acceleratorCard(item) {
  return `
    <article id="accelerator-${escapeHtml(item.id)}" class="accelerator-card card-surface">
      <div class="subsection-head">
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="mini-caption">${escapeHtml(item.country_code)} | ${escapeHtml(item.lead_actors.join(", "))}</p>
        </div>
        <span class="mini-badge">${escapeHtml(item.expected_channels.join(" / "))}</span>
      </div>
      <p>${escapeHtml(item.mechanism)}</p>
      <p class="indicator-note"><strong>Why this matters now:</strong> ${escapeHtml(item.why_now)}</p>
      <p class="indicator-note"><strong>Risks:</strong> ${escapeHtml(item.risk_flags.join(", "))}</p>
      <div class="chip-set">${item.sdg_links.map((sdg) => `<span class="sdg-chip">${escapeHtml(sdg)}</span>`).join("")}</div>
      <div class="link-row">
        ${evidenceLink(item.source_ids)}
      </div>
    </article>
  `;
}

function toolCard(item) {
  return `
    <article class="tool-card card-surface soft-card">
      <div class="subsection-head">
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="mini-caption">${escapeHtml(item.role)}</p>
        </div>
      </div>
      <p>${escapeHtml(item.what_it_does)}</p>
      <p class="indicator-note">${escapeHtml(item.when_to_use)}</p>
    </article>
  `;
}

function sourceCard(source) {
  return `
    <article class="subsection-card card-surface soft-card">
      <div class="subsection-head">
        <div>
          <h3>${escapeHtml(source.label)}</h3>
          <p class="mini-caption">${escapeHtml(source.coverage)}</p>
        </div>
        <span class="mini-badge">${escapeHtml(source.quality)}</span>
      </div>
      <p class="meta-line">Last updated: ${escapeHtml(source.last_updated)}</p>
      <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">Open source</a>
    </article>
  `;
}

function scoreExplainerCards() {
  const thresholds = state.data.siteMeta.pulse_thresholds;
  return [
    explainerItem("Structural anchor", "Slower-moving annual reference from recognized scorecards such as SDSN."),
    explainerItem("Pulse", "Internal twice-weekly nowcast on a 0-100 scale built from jobs, finance, implementation, resilience, and transition channels."),
    explainerItem("Benchmark delta", `Distance from the selected benchmark group: ${groupById(state.selectedGroup).label}.`),
    explainerItem("Status thresholds", `Strengthening ${thresholds.strengthening}; Mixed ${thresholds.mixed}; Under pressure ${thresholds.under_pressure}.`),
    explainerItem("Caveat", "This is not Nepal's official SDG Index score. It is a platform-generated live acceleration pulse.")
  ];
}

function explainerItem(title, body) {
  return `<article class="explainer-item soft-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`;
}

function sourceLinks(sourceIds) {
  if (!sourceIds?.length) {
    return "";
  }
  const links = sourceIds.slice(0, 2).map((id) => {
    const source = state.data.sourceMap[id];
    return `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a>`;
  });
  return links.join("");
}

function evidenceLink(sourceIds) {
  if (!sourceIds?.length) {
    return "";
  }
  const source = state.data.sourceMap[sourceIds[0]];
  return `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">Evidence</a>`;
}

function comparisonRow(label, value, indicatorId) {
  const max = maxForIndicator(indicatorId);
  const width = max === 0 ? 6 : Math.max(6, (Number(value) / max) * 100);
  return `
    <div class="bar-row">
      <span class="chip-label">${escapeHtml(label)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${width.toFixed(1)}%"></div></div>
      <strong>${escapeHtml(formatNumber(value))}</strong>
    </div>
  `;
}

function historyChartSvg(history, anchorValue) {
  if (!history.length) {
    return `<p class="empty-state">No pulse history available yet.</p>`;
  }

  const recent = history.slice(-8);
  const pulseValues = recent.map((item) => item.pulse_score);
  const yMin = Math.max(0, Math.min(anchorValue, ...pulseValues) - 6);
  const yMax = Math.min(100, Math.max(anchorValue, ...pulseValues) + 6);
  const width = 720;
  const height = 240;
  const left = 50;
  const right = 24;
  const top = 28;
  const bottom = 42;
  const anchorX = 85;
  const pulseStartX = 170;
  const chartWidth = width - pulseStartX - right;
  const step = recent.length > 1 ? chartWidth / (recent.length - 1) : chartWidth;
  const scaleY = (value) => top + ((yMax - value) / (yMax - yMin || 1)) * (height - top - bottom);
  const points = recent.map((item, index) => [pulseStartX + index * step, scaleY(item.pulse_score)]);
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point[0].toFixed(1)} ${point[1].toFixed(1)}`).join(" ");
  const anchorY = scaleY(anchorValue);
  const yTicks = [yMin, (yMin + yMax) / 2, yMax];

  return `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg" aria-label="Pulse history chart">
      <rect x="0" y="0" width="${width}" height="${height}" rx="20" fill="transparent"></rect>
      ${yTicks.map((value) => `<g><line x1="${left}" y1="${scaleY(value)}" x2="${width - right}" y2="${scaleY(value)}" stroke="rgba(11,47,69,0.12)" stroke-dasharray="4 6"></line><text x="12" y="${scaleY(value) + 4}" class="chart-label">${formatNumber(value)}</text></g>`).join("")}
      <line x1="${anchorX}" y1="${top}" x2="${anchorX}" y2="${height - bottom}" stroke="rgba(229,36,59,0.35)" stroke-width="2"></line>
      <circle cx="${anchorX}" cy="${anchorY}" r="8" fill="#E5243B"></circle>
      <text x="${anchorX - 34}" y="${height - 14}" class="chart-label strong">2025 SDSN</text>
      <path d="${path}" fill="none" stroke="#0A97D9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
      ${points.map((point, index) => `<g><circle cx="${point[0]}" cy="${point[1]}" r="5" fill="#0A97D9"></circle>${index === recent.length - 1 ? `<text x="${point[0] - 18}" y="${height - 14}" class="chart-label strong">${escapeHtml(shortDate(recent[index].timestamp))}</text>` : ""}</g>`).join("")}
      <text x="${anchorX - 28}" y="${anchorY - 14}" class="chart-label">${formatNumber(anchorValue)}</text>
      <text x="${points[points.length - 1][0] - 12}" y="${points[points.length - 1][1] - 14}" class="chart-label">${formatNumber(recent[recent.length - 1].pulse_score)}</text>
    </svg>
  `;
}

function topSignals(countryCode) {
  return state.data.signals.filter((item) => item.country_code === countryCode).sort((a, b) => b.severity - a.severity).slice(0, 3);
}

function acceleratorsFor(countryCode) {
  return state.data.accelerators.filter((item) => item.country_code === countryCode);
}

function pulseForCountry(countryCode) {
  const channels = PULSE_CHANNELS.map((channel) => {
    const weightedSignals = channel.indicators.map((indicator) => ({
      score: indicatorSignalScore(countryCode, indicator.id, indicator.positive),
      weight: indicator.weight
    }));

    return {
      id: channel.id,
      title: channel.title,
      score: weightedAverage(weightedSignals),
      weight: channel.weight
    };
  });

  const score = weightedAverage(channels.map((channel) => ({ score: channel.score, weight: channel.weight })));
  return {
    score: roundNumber(score),
    channels: channels.map((channel) => ({ ...channel, score: roundNumber(channel.score) })),
    status: pulseStatus(score)
  };
}

function pulseDrivers(countryCode) {
  return PULSE_CHANNELS.flatMap((channel) =>
    channel.indicators.map((indicator) => {
      const value = valueFor(countryCode, indicator.id);
      const benchmark = averageForGroup(indicator.id, state.selectedGroup);
      const range = indicatorRange(indicator.id);
      const relativeGap = range === 0 ? 0 : (value - benchmark) / range;
      const alignedGap = indicator.positive ? relativeGap : -relativeGap;
      const effect = alignedGap * 12 * indicator.weight * channel.weight;
      return {
        id: indicator.id,
        label: labelForIndicator(indicator.id),
        channelTitle: channel.title,
        effect,
        explanation: driverExplanation(indicator.id, value, benchmark, indicator.positive)
      };
    })
  ).sort((a, b) => Math.abs(b.effect) - Math.abs(a.effect));
}

function rankedInterventions(countryCode) {
  const pulse = pulseForCountry(countryCode);
  const weaknessByChannel = Object.fromEntries(pulse.channels.map((channel) => [channel.id, 100 - channel.score]));

  return acceleratorsFor(countryCode)
    .map((item) => {
      const mappedChannels = classifyAcceleratorChannels(item);
      const selectedChannels = mappedChannels.length ? mappedChannels : ["implementation"];
      const averageWeakness = selectedChannels.reduce((sum, key) => sum + (weaknessByChannel[key] || 40), 0) / selectedChannels.length;
      return {
        ...item,
        simulatedLift: Math.min(8.5, 1.5 + averageWeakness / 14),
        channelSummary: selectedChannels.map(channelTitleById).join(", "),
        reason: `${item.title} aligns most directly with the weakest live channels in ${currentCountry().country_name}: ${selectedChannels.map(channelTitleById).join(", ")}.`
      };
    })
    .sort((a, b) => b.simulatedLift - a.simulatedLift);
}

function classifyAcceleratorChannels(item) {
  const text = [item.title, item.mechanism, item.why_now, ...(item.expected_channels || [])].join(" ").toLowerCase();
  return PULSE_CHANNELS.filter((channel) => channel.keywords.some((keyword) => text.includes(keyword))).map((channel) => channel.id);
}

function driverExplanation(indicatorId, value, benchmark, positive) {
  const difference = value - benchmark;
  const differenceLabel = `${formatNumber(Math.abs(difference))} pts`;
  if (positive) {
    return `${labelForIndicator(indicatorId)} is ${difference >= 0 ? "above" : "below"} the selected benchmark by ${differenceLabel}.`;
  }
  return `${labelForIndicator(indicatorId)} risk is ${difference >= 0 ? "above" : "below"} the selected benchmark by ${differenceLabel}.`;
}

function indicatorSignalScore(countryCode, indicatorId, positive) {
  const value = valueFor(countryCode, indicatorId);
  const benchmark = averageForGroup(indicatorId, state.selectedGroup);
  const range = indicatorRange(indicatorId);
  const gap = range === 0 ? 0 : (value - benchmark) / range;
  const alignedGap = positive ? gap : -gap;
  return clamp(50 + alignedGap * 55, 0, 100);
}

function externalAnchorValue(countryCode, scoreFamily) {
  const item = state.data.externalScores.find((entry) => entry.country_code === countryCode && entry.score_family === scoreFamily);
  return item ? item.value : valueFor(countryCode, "sdg_index");
}

function historyForCountry(countryCode) {
  return state.data.pulseHistory.filter((item) => item.country_code === countryCode).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

function rollingDirection(history, windowSize) {
  if (!history.length) {
    return "No history yet";
  }
  const recent = history.slice(-Math.max(2, Math.min(windowSize, history.length)));
  const first = recent[0].pulse_score;
  const last = recent[recent.length - 1].pulse_score;
  const delta = last - first;
  if (delta > 1.2) {
    return `Improving (${delta >= 0 ? "+" : ""}${formatNumber(delta)} pts)`;
  }
  if (delta < -1.2) {
    return `Softening (${formatNumber(delta)} pts)`;
  }
  return `Broadly stable (${delta >= 0 ? "+" : ""}${formatNumber(delta)} pts)`;
}

function groupById(groupId) {
  return state.data.comparatorMap[groupId];
}

function currentCountry() {
  return state.data.countryMap[state.selectedCountry];
}

function peerCountry() {
  return state.data.countryMap[state.selectedPeer];
}

function peerOptions() {
  return state.data.countries.filter((country) => country.country_code !== state.selectedCountry);
}

function defaultBenchmarkGroup(country) {
  if (country.region_group === "South Asia") return "south_asia_core";
  if (country.region_group === "Southeast Asia") return "southeast_asia_benchmark";
  return "additional_peers";
}

function fillSelect(select, items, selectedValue, labelFn, valueFn) {
  select.innerHTML = items
    .map((item) => {
      const value = valueFn(item);
      return `<option value="${escapeHtml(value)}"${value === selectedValue ? " selected" : ""}>${escapeHtml(labelFn(item))}</option>`;
    })
    .join("");
}

function renderList(target, cards, emptyMessage = "No items available.") {
  target.innerHTML = cards.length ? cards.join("") : `<p class="empty-state">${escapeHtml(emptyMessage)}</p>`;
}

function indicatorFor(countryCode, indicatorId) {
  return state.data.indicatorMap[`${countryCode}:${indicatorId}`];
}

function valueFor(countryCode, indicatorId) {
  return indicatorFor(countryCode, indicatorId)?.value || 0;
}

function averageForGroup(indicatorId, groupId) {
  const group = groupById(groupId);
  const values = group.country_codes.map((code) => valueFor(code, indicatorId));
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function maxForIndicator(indicatorId) {
  return Math.max(...state.data.indicators.filter((item) => item.id === indicatorId).map((item) => Number(item.value)));
}

function indicatorRange(indicatorId) {
  const values = state.data.indicators.filter((item) => item.id === indicatorId).map((item) => Number(item.value));
  return Math.max(...values) - Math.min(...values);
}

function labelForIndicator(indicatorId) {
  return state.data.indicators.find((item) => item.id === indicatorId)?.label || indicatorId;
}

function averagePulseForGroup(groupId) {
  const group = groupById(groupId);
  return group.country_codes.reduce((sum, code) => sum + pulseForCountry(code).score, 0) / group.country_codes.length;
}

function pulseStatus(score) {
  if (score >= 58) return { label: "Strengthening", tone: "steady" };
  if (score >= 47) return { label: "Mixed", tone: "watch" };
  return { label: "Under pressure", tone: "warning" };
}

function channelStatus(score) {
  if (score >= 58) return "Above benchmark momentum";
  if (score >= 47) return "Near benchmark momentum";
  return "Below benchmark momentum";
}

function channelTitleById(id) {
  return PULSE_CHANNELS.find((channel) => channel.id === id)?.title || id;
}

function weightedAverage(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  return totalWeight === 0 ? 0 : items.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundNumber(value) {
  return Number(value.toFixed(1));
}

function shortLabel(text) {
  return text.split(",")[0];
}

function formatNumber(value) {
  return Number(value).toFixed(Number(value) >= 100 ? 0 : 1);
}

function formatValue(value, unit) {
  if (unit === "%") {
    return `${formatNumber(value)}%`;
  }
  return unit ? `${formatNumber(value)} ${unit}` : formatNumber(value);
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(timestamp));
}

function shortDate(timestamp) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(new Date(timestamp));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function exportSnapshot() {
  const payload = {
    exported_at: new Date().toISOString(),
    country: currentCountry(),
    peer: peerCountry(),
    benchmark_group: groupById(state.selectedGroup),
    external_anchors: state.data.externalScores.filter((item) => item.country_code === currentCountry().country_code),
    pulse: pulseForCountry(currentCountry().country_code),
    pulse_history: historyForCountry(currentCountry().country_code),
    top_risks: topSignals(currentCountry().country_code),
    top_accelerators: acceleratorsFor(currentCountry().country_code).slice(0, 3),
    weekly_news_signals: state.data.newsSignals.filter((item) => item.country_code === currentCountry().country_code).slice(0, 6)
  };
  downloadBlob(`${currentCountry().country_code.toLowerCase()}-growth-sdg-tracker.json`, "application/json", JSON.stringify(payload, null, 2));
}

function downloadBlob(fileName, mimeType, content) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function registerInstallHooks() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (!registrations.length) return;
        await Promise.all(registrations.map((registration) => registration.unregister()));
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }
        if (navigator.serviceWorker.controller) {
          window.location.reload();
        }
      } catch {
        // If the browser blocks this cleanup, the site still works over the network.
      }
    });
  }
}

function registerSectionObserver() {
  const sections = document.querySelectorAll("[id='overview'], #pulse, #lenses, #pathways, #policy-budget, #accelerators, #comparisons, #toolkit");
  const links = Array.from(document.querySelectorAll(".rail-link"));
  const map = Object.fromEntries(links.map((link) => [link.getAttribute("href").slice(1), link]));
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => link.classList.toggle("active", link === map[visible.target.id]));
    },
    { rootMargin: "-20% 0px -55% 0px", threshold: [0.2, 0.5, 0.8] }
  );
  sections.forEach((section) => observer.observe(section));
}
