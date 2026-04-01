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
  "../data/toolkit.json"
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

const ANALYSIS_MODES = [
  {
    title: "Structural anchor",
    body: "Keeps the slow-moving official development position visible through the SDG index and the seven core lenses."
  },
  {
    title: "Weekly pulse",
    body: "Builds a prototype near-term acceleration signal from jobs, financing, resilience, implementation, and transition channels."
  },
  {
    title: "Driver decomposition",
    body: "Shows which indicators are strengthening or dragging momentum relative to the selected benchmark group."
  },
  {
    title: "Intervention prioritization",
    body: "Ranks accelerator interventions by how strongly they target the country's weakest live channels."
  }
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

const elements = {
  heroText: document.getElementById("heroText"),
  heroCountry: document.getElementById("heroCountry"),
  heroPeerNote: document.getElementById("heroPeerNote"),
  installAppBtn: document.getElementById("installAppBtn"),
  exportSnapshotBtn: document.getElementById("exportSnapshotBtn"),
  printBriefBtn: document.getElementById("printBriefBtn"),
  countrySelect: document.getElementById("countrySelect"),
  peerSelect: document.getElementById("peerSelect"),
  groupSelect: document.getElementById("groupSelect"),
  lensSelect: document.getElementById("lensSelect"),
  asOfNote: document.getElementById("asOfNote"),
  heroMetrics: document.getElementById("heroMetrics"),
  growthStory: document.getElementById("growthStory"),
  financingStory: document.getElementById("financingStory"),
  transitionStory: document.getElementById("transitionStory"),
  pulseMethodNote: document.getElementById("pulseMethodNote"),
  analysisModeGrid: document.getElementById("analysisModeGrid"),
  pulseStatusBadge: document.getElementById("pulseStatusBadge"),
  pulseScore: document.getElementById("pulseScore"),
  pulseDelta: document.getElementById("pulseDelta"),
  pulseSummaryText: document.getElementById("pulseSummaryText"),
  pulseChannels: document.getElementById("pulseChannels"),
  positiveDrivers: document.getElementById("positiveDrivers"),
  negativeDrivers: document.getElementById("negativeDrivers"),
  interventionPriority: document.getElementById("interventionPriority"),
  riskList: document.getElementById("riskList"),
  topAccelerators: document.getElementById("topAccelerators"),
  lensChips: document.getElementById("lensChips"),
  lensIntro: document.getElementById("lensIntro"),
  lensIndicatorGrid: document.getElementById("lensIndicatorGrid"),
  pathwayFilters: document.getElementById("pathwayFilters"),
  pathwayExplorer: document.getElementById("pathwayExplorer"),
  policyList: document.getElementById("policyList"),
  budgetList: document.getElementById("budgetList"),
  acceleratorGrid: document.getElementById("acceleratorGrid"),
  comparisonGrid: document.getElementById("comparisonGrid"),
  toolkitGrid: document.getElementById("toolkitGrid"),
  sourceList: document.getElementById("sourceList"),
  methodNote: document.getElementById("methodNote")
};

init();

async function init() {
  const [
    siteMeta,
    sources,
    countries,
    comparators,
    indicators,
    lenses,
    pathways,
    policies,
    budgetMap,
    accelerators,
    signals,
    toolkit
  ] = await Promise.all(DATA_FILES.map((file) => fetch(file).then((response) => response.json())));

  state.data = {
    siteMeta,
    sources,
    sourceMap: Object.fromEntries(sources.map((item) => [item.id, item])),
    countries,
    countryMap: Object.fromEntries(countries.map((item) => [item.country_code, item])),
    comparators,
    indicators,
    lenses,
    lensMap: Object.fromEntries(lenses.map((item) => [item.id, item])),
    pathways,
    policies,
    budgetMap,
    accelerators,
    signals,
    toolkit
  };

  state.selectedCountry = siteMeta.default_country;
  state.selectedPeer = state.data.countryMap[state.selectedCountry].aspirational_peer_code;

  populateControls();
  bindEvents();
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
    const country = currentCountry();
    state.selectedPeer = country.aspirational_peer_code || peerOptions()[0].country_code;
    fillSelect(elements.peerSelect, peerOptions(), state.selectedPeer, (item) => `${item.country_name} (${item.peer_type})`, (item) => item.country_code);
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
    render();
  });

  elements.exportSnapshotBtn.addEventListener("click", exportSnapshot);
  elements.printBriefBtn.addEventListener("click", () => window.print());
}

function render() {
  renderOverview();
  renderPulse();
  renderLenses();
  renderPathways();
  renderPolicies();
  renderAccelerators();
  renderComparisons();
  renderToolkit();
  renderSources();
}

function renderOverview() {
  const country = currentCountry();
  const saAvg = averageForGroup("sdg_index", "south_asia_core");
  const seaAvg = averageForGroup("sdg_index", "southeast_asia_benchmark");
  const metrics = [
    metricCard("Selected country", country.country_name, "Anchor country for the current view."),
    metricCard("SDG index", valueFor(country.country_code, "sdg_index"), `South Asia avg ${formatNumber(saAvg)}, Southeast Asia avg ${formatNumber(seaAvg)}.`),
    metricCard("GDP growth", `${formatNumber(valueFor(country.country_code, "gdp_growth"))}%`, "Recent macro momentum in the curated snapshot."),
    metricCard("Quality jobs", formatNumber(valueFor(country.country_code, "quality_jobs_index")), "Composite signal for labor absorption and job quality."),
    metricCard("Tax to GDP", `${formatNumber(valueFor(country.country_code, "tax_gdp"))}%`, "A simple fiscal-space anchor."),
    metricCard("Implementation", formatNumber(valueFor(country.country_code, "implementation_capacity")), "Execution and coordination capability."),
    metricCard("South Asia benchmark", formatNumber(saAvg), "Average SDG index across the South Asia comparison basket."),
    metricCard("Southeast Asia benchmark", formatNumber(seaAvg), "Average SDG index across the Southeast Asia benchmark set.")
  ];

  elements.heroCountry.textContent = country.country_name;
  elements.heroPeerNote.textContent = `${country.country_name} is benchmarked against ${groupById(state.selectedGroup).label}, with ${peerCountry().country_name} as the selected comparator.`;
  elements.heroText.textContent = `${country.growth_story} The platform emphasizes how growth, fiscal space, and implementation connect to SDG acceleration.`;
  elements.asOfNote.textContent = `Curated snapshot built on ${state.data.siteMeta.built_on}.`;
  elements.heroMetrics.innerHTML = metrics.join("");
  elements.growthStory.textContent = country.growth_story;
  elements.financingStory.textContent = country.financing_story;
  elements.transitionStory.textContent = country.transition_story;
  renderList(elements.riskList, topSignals(country.country_code).map(signalCard));
  renderList(elements.topAccelerators, acceleratorsFor(country.country_code).slice(0, 3).map(acceleratorMiniCard));
}

function renderPulse() {
  const country = currentCountry();
  const pulse = pulseForCountry(country.country_code);
  const benchmarkLabel = groupById(state.selectedGroup).label;
  const benchmarkPulse = averagePulseForGroup(state.selectedGroup);
  const delta = pulse.score - benchmarkPulse;
  const drivers = pulseDrivers(country.country_code);
  const positives = drivers.filter((item) => item.effect > 0).slice(0, 4);
  const negatives = drivers.filter((item) => item.effect < 0).slice(0, 4);
  const interventions = rankedInterventions(country.country_code).slice(0, 3);
  const strongest = pulse.channels.slice().sort((a, b) => b.score - a.score)[0];
  const weakest = pulse.channels.slice().sort((a, b) => a.score - b.score)[0];

  elements.pulseMethodNote.textContent =
    "This platform combines a structural annual anchor with a prototype weekly pulse, driver decomposition, and intervention ranking. In v1, the pulse is a proxy-based nowcast rather than an official weekly SDG score.";
  elements.analysisModeGrid.innerHTML = ANALYSIS_MODES.map(analysisModeCard).join("");
  elements.pulseStatusBadge.textContent = pulse.status.label;
  elements.pulseStatusBadge.className = `status-badge ${pulse.status.tone}`;
  elements.pulseScore.textContent = `${formatNumber(pulse.score)} / 100`;
  elements.pulseDelta.textContent = `${delta >= 0 ? "+" : ""}${formatNumber(delta)} pts`;
  elements.pulseDelta.className = `pulse-delta ${delta > 1 ? "positive" : delta < -1 ? "negative" : "neutral"}`;
  elements.pulseSummaryText.textContent =
    `${country.country_name}'s prototype acceleration pulse is ${pulse.status.label.toLowerCase()} relative to ${benchmarkLabel}. ` +
    `${strongest.title} is the strongest live channel, while ${weakest.title} is the main drag on near-term momentum.`;
  elements.pulseChannels.innerHTML = pulse.channels.map(channelCard).join("");
  renderList(elements.positiveDrivers, positives.map(driverCard), "No strengthening drivers identified yet.");
  renderList(elements.negativeDrivers, negatives.map(driverCard), "No weakening drivers identified yet.");
  renderList(elements.interventionPriority, interventions.map(simulatorCard), "No intervention ranking available yet.");
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
  elements.lensIndicatorGrid.innerHTML = lens.indicator_ids
    .map((indicatorId) => renderIndicatorCard(indicatorId, lens))
    .join("");
}

function renderPathways() {
  const countryScope = currentCountry().country_code;
  const visiblePathways = state.data.pathways.filter((pathway) => {
    const scopeMatches = pathway.country_scope === countryScope || pathway.country_scope === "cross-country";
    const driverMatches = state.selectedPathwayDriver === "all" || pathway.driver === state.selectedPathwayDriver;
    return scopeMatches && driverMatches;
  });

  const drivers = ["all", ...new Set(state.data.pathways.filter((item) => item.country_scope === countryScope || item.country_scope === "cross-country").map((item) => item.driver))];
  elements.pathwayFilters.innerHTML = drivers
    .map((driver) => `<button class="filter-chip ${driver === state.selectedPathwayDriver ? "active" : ""}" data-driver="${escapeHtml(driver)}">${escapeHtml(driver === "all" ? "All pathways" : shortLabel(driver))}</button>`)
    .join("");
  elements.pathwayFilters.querySelectorAll("[data-driver]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedPathwayDriver = button.dataset.driver;
      renderPathways();
    });
  });

  elements.pathwayExplorer.innerHTML = visiblePathways
    .map(
      (pathway) => `
        <article class="pathway-card">
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
      `
    )
    .join("");
}

function renderPolicies() {
  const countryCode = currentCountry().country_code;
  const policies = state.data.policies.filter((item) => item.country_code === countryCode);
  const budgetRows = state.data.budgetMap.filter((item) => item.country_code === countryCode);
  renderList(elements.policyList, policies.map(policyCard), "No policy mappings loaded for this country yet.");
  renderList(elements.budgetList, budgetRows.map(budgetCard), "No budget mappings loaded for this country yet.");
}

function renderAccelerators() {
  elements.acceleratorGrid.innerHTML = acceleratorsFor(currentCountry().country_code)
    .map(
      (item) => `
        <article class="accelerator-card">
          <div class="subsection-head">
            <h3>${escapeHtml(item.title)}</h3>
            <span class="mini-badge">${escapeHtml(item.country_code)}</span>
          </div>
          <p>${escapeHtml(item.mechanism)}</p>
          <p class="indicator-note">${escapeHtml(item.why_now)}</p>
          <div class="chip-set">${item.sdg_links.map((sdg) => `<span class="sdg-chip">${escapeHtml(sdg)}</span>`).join("")}</div>
        </article>
      `
    )
    .join("");
}

function renderComparisons() {
  const country = currentCountry();
  const peer = peerCountry();
  const structural = state.data.countryMap[country.structural_peer_code];
  const group = groupById(state.selectedGroup);
  const comparisonIds = state.data.siteMeta.comparison_indicator_ids;

  elements.comparisonGrid.innerHTML = comparisonIds
    .map((indicatorId) => {
      const indicatorLabel = labelForIndicator(indicatorId);
      const rows = [
        comparisonRow(country.country_name, valueFor(country.country_code, indicatorId), indicatorId),
        comparisonRow(group.label, averageForGroup(indicatorId, group.id), indicatorId),
        comparisonRow("South Asia avg", averageForGroup(indicatorId, "south_asia_core"), indicatorId),
        comparisonRow("Southeast Asia avg", averageForGroup(indicatorId, "southeast_asia_benchmark"), indicatorId),
        comparisonRow(peer.country_name, valueFor(peer.country_code, indicatorId), indicatorId),
        comparisonRow(structural.country_name, valueFor(structural.country_code, indicatorId), indicatorId)
      ];

      return `
        <article class="comparison-card">
          <h3>${escapeHtml(indicatorLabel)}</h3>
          <div class="bar-group">${rows.join("")}</div>
        </article>
      `;
    })
    .join("");
}

function renderToolkit() {
  elements.toolkitGrid.innerHTML = state.data.toolkit
    .map(
      (item) => `
        <article class="tool-card">
          <div class="subsection-head">
            <h3>${escapeHtml(item.title)}</h3>
            <span class="mini-badge">${escapeHtml(item.role)}</span>
          </div>
          <p>${escapeHtml(item.what_it_does)}</p>
          <p class="indicator-note">${escapeHtml(item.when_to_use)}</p>
        </article>
      `
    )
    .join("");
}

function renderSources() {
  elements.methodNote.textContent = state.data.siteMeta.method_note;
  elements.sourceList.innerHTML = state.data.sources
    .map(
      (source) => `
        <article class="subsection-card">
          <div class="subsection-head">
            <h3>${escapeHtml(source.label)}</h3>
            <span class="mini-badge">${escapeHtml(source.quality)}</span>
          </div>
          <p class="indicator-note">${escapeHtml(source.coverage)}</p>
          <p class="meta-line">Last updated: ${escapeHtml(source.last_updated)}</p>
          <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">Open source</a>
        </article>
      `
    )
    .join("");
}

function analysisModeCard(item) {
  return `
    <article class="analysis-card">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
    </article>
  `;
}

function channelCard(item) {
  return `
    <article class="channel-card">
      <span class="metric-label">${escapeHtml(item.title)}</span>
      <strong>${escapeHtml(formatNumber(item.score))}</strong>
      <p class="indicator-note">${escapeHtml(channelStatus(item.score))}</p>
    </article>
  `;
}

function driverCard(item) {
  return `
    <article class="subsection-card driver-card">
      <div class="subsection-head">
        <h3>${escapeHtml(item.label)}</h3>
        <span class="driver-impact ${item.effect >= 0 ? "positive" : "negative"}">${item.effect >= 0 ? "+" : ""}${escapeHtml(formatNumber(item.effect))}</span>
      </div>
      <p class="indicator-note">${escapeHtml(item.channelTitle)}</p>
      <p>${escapeHtml(item.explanation)}</p>
    </article>
  `;
}

function simulatorCard(item) {
  return `
    <article class="subsection-card driver-card">
      <div class="subsection-head">
        <h3>${escapeHtml(item.title)}</h3>
        <span class="lift-badge">+${escapeHtml(formatNumber(item.simulatedLift))} pts</span>
      </div>
      <p class="indicator-note">${escapeHtml(item.channelSummary)}</p>
      <p>${escapeHtml(item.reason)}</p>
    </article>
  `;
}

function renderIndicatorCard(indicatorId) {
  const countryCode = currentCountry().country_code;
  const indicator = state.data.indicators.find((item) => item.country_code === countryCode && item.id === indicatorId);
  const peer = peerCountry();
  const structural = state.data.countryMap[currentCountry().structural_peer_code];
  const bars = [
    comparisonRow(currentCountry().country_name, indicator.value, indicator.id),
    comparisonRow(groupById(state.selectedGroup).label, averageForGroup(indicator.id, state.selectedGroup), indicator.id),
    comparisonRow("South Asia avg", averageForGroup(indicator.id, "south_asia_core"), indicator.id),
    comparisonRow("Southeast Asia avg", averageForGroup(indicator.id, "southeast_asia_benchmark"), indicator.id),
    comparisonRow(peer.country_name, valueFor(peer.country_code, indicator.id), indicator.id),
    comparisonRow(structural.country_name, valueFor(structural.country_code, indicator.id), indicator.id)
  ];
  const sourceNames = indicator.source_ids.map((id) => state.data.sourceMap[id].label).join("; ");

  return `
    <article class="indicator-card">
      <div class="subsection-head">
        <h3>${escapeHtml(indicator.label)}</h3>
        <span class="mini-badge">${escapeHtml(indicator.trend)}</span>
      </div>
      <strong>${escapeHtml(formatValue(indicator.value, indicator.unit))}</strong>
      <p class="indicator-note">${escapeHtml(indicator.note)}</p>
      <div class="bar-group">${bars.join("")}</div>
      <p class="meta-line">Source: ${escapeHtml(sourceNames)} | Year: ${escapeHtml(String(indicator.year))}</p>
    </article>
  `;
}

function comparisonRow(label, value, indicatorId) {
  const max = maxForIndicator(indicatorId);
  const width = Math.max(6, (Number(value) / max) * 100);
  return `
    <div class="bar-row">
      <span class="chip-label">${escapeHtml(label)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${width.toFixed(1)}%"></div></div>
      <strong>${escapeHtml(formatNumber(value))}</strong>
    </div>
  `;
}

function topSignals(countryCode) {
  return state.data.signals
    .filter((item) => item.country_code === countryCode)
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3);
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
    score,
    channels,
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
      const unit = unitForIndicator(indicator.id);
      return {
        id: indicator.id,
        label: labelForIndicator(indicator.id),
        channelTitle: channel.title,
        effect,
        explanation: driverExplanation(indicator.id, value, benchmark, unit, indicator.positive)
      };
    })
  )
    .sort((a, b) => Math.abs(b.effect) - Math.abs(a.effect));
}

function rankedInterventions(countryCode) {
  const pulse = pulseForCountry(countryCode);
  const weaknessByChannel = Object.fromEntries(pulse.channels.map((channel) => [channel.id, 100 - channel.score]));

  return acceleratorsFor(countryCode)
    .map((item) => {
      const mappedChannels = classifyAcceleratorChannels(item);
      const selectedChannels = mappedChannels.length ? mappedChannels : ["implementation"];
      const averageWeakness = selectedChannels.reduce((sum, key) => sum + (weaknessByChannel[key] || 40), 0) / selectedChannels.length;
      const simulatedLift = Math.min(8.5, 1.5 + averageWeakness / 14);
      return {
        ...item,
        simulatedLift,
        channelSummary: selectedChannels.map(channelTitleById).join(", "),
        reason: `${item.title} aligns most directly with the weakest live channels in ${currentCountry().country_name}: ${selectedChannels.map(channelTitleById).join(", ")}.`
      };
    })
    .sort((a, b) => b.simulatedLift - a.simulatedLift);
}

function classifyAcceleratorChannels(item) {
  const text = [
    item.title,
    item.mechanism,
    item.why_now,
    ...(item.expected_channels || [])
  ]
    .join(" ")
    .toLowerCase();

  return PULSE_CHANNELS.filter((channel) => channel.keywords.some((keyword) => text.includes(keyword))).map((channel) => channel.id);
}

function channelTitleById(id) {
  const channel = PULSE_CHANNELS.find((item) => item.id === id);
  return channel ? channel.title : id;
}

function driverExplanation(indicatorId, value, benchmark, unit, positive) {
  const difference = value - benchmark;
  const aboveBelow = difference >= 0 ? "above" : "below";
  const opposite = difference >= 0 ? "below" : "above";
  const differenceLabel = `${formatNumber(Math.abs(difference))} pts`;

  if (positive) {
    return `${labelForIndicator(indicatorId)} is ${aboveBelow} the selected benchmark by ${differenceLabel}.`;
  }

  return `${labelForIndicator(indicatorId)} risk is ${opposite} the selected benchmark by ${differenceLabel}.`;
}

function indicatorSignalScore(countryCode, indicatorId, positive) {
  const value = valueFor(countryCode, indicatorId);
  const benchmark = averageForGroup(indicatorId, state.selectedGroup);
  const range = indicatorRange(indicatorId);
  const gap = range === 0 ? 0 : (value - benchmark) / range;
  const alignedGap = positive ? gap : -gap;
  return clamp(50 + alignedGap * 55, 0, 100);
}

function indicatorRange(indicatorId) {
  const values = state.data.indicators.filter((item) => item.id === indicatorId).map((item) => Number(item.value));
  return Math.max(...values) - Math.min(...values);
}

function averagePulseForGroup(groupId) {
  const group = groupById(groupId);
  return group.country_codes.reduce((sum, countryCode) => sum + pulseForCountry(countryCode).score, 0) / group.country_codes.length;
}

function pulseStatus(score) {
  if (score >= 58) {
    return { label: "Strengthening", tone: "steady" };
  }
  if (score >= 47) {
    return { label: "Mixed", tone: "watch" };
  }
  return { label: "Under pressure", tone: "warning" };
}

function channelStatus(score) {
  if (score >= 58) {
    return "Above benchmark momentum";
  }
  if (score >= 47) {
    return "Near benchmark momentum";
  }
  return "Below benchmark momentum";
}

function policyCard(item) {
  return `
    <article class="subsection-card">
      <div class="subsection-head">
        <h3>${escapeHtml(item.policy_name)}</h3>
        <span class="mini-badge">${escapeHtml(item.policy_type)}</span>
      </div>
      <p class="indicator-note">${escapeHtml(item.lead_agency)} | ${escapeHtml(item.period)}</p>
      <p>${escapeHtml(item.growth_channels.join(", "))}</p>
      <div class="chip-set">${item.direct_sdgs.concat(item.indirect_sdgs).map((sdg) => `<span class="sdg-chip">${escapeHtml(sdg)}</span>`).join("")}</div>
    </article>
  `;
}

function budgetCard(item) {
  return `
    <article class="subsection-card">
      <div class="subsection-head">
        <h3>${escapeHtml(item.ministry_or_sector)}</h3>
        <span class="mini-badge">${escapeHtml(item.budget_type)}</span>
      </div>
      <p>${escapeHtml(item.program_area)}</p>
      <p class="indicator-note">${escapeHtml(item.growth_channels.join(", "))}</p>
      <div class="chip-set">${item.sdg_links.map((sdg) => `<span class="sdg-chip">${escapeHtml(sdg)}</span>`).join("")}</div>
    </article>
  `;
}

function acceleratorMiniCard(item) {
  return `
    <article class="subsection-card">
      <div class="subsection-head">
        <h3>${escapeHtml(item.title)}</h3>
        <span class="mini-badge">${escapeHtml(item.country_code)}</span>
      </div>
      <p>${escapeHtml(item.why_now)}</p>
    </article>
  `;
}

function signalCard(item) {
  return `
    <article class="subsection-card">
      <div class="subsection-head">
        <h3>${escapeHtml(item.label)}</h3>
        <span class="status-badge ${escapeHtml(item.direction)}">${escapeHtml(item.direction)}</span>
      </div>
      <p>${escapeHtml(item.value)}</p>
      <p class="indicator-note">${escapeHtml(item.threshold_note)}</p>
    </article>
  `;
}

function metricCard(label, value, note) {
  return `
    <article class="metric-card">
      <span class="metric-label">${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <p class="indicator-note">${escapeHtml(note)}</p>
    </article>
  `;
}

function indicatorRows(countryCode, lensId) {
  return state.data.indicators.filter((item) => item.country_code === countryCode && item.lens === lensId);
}

function valueFor(countryCode, indicatorId) {
  const row = state.data.indicators.find((item) => item.country_code === countryCode && item.id === indicatorId);
  return row ? row.value : 0;
}

function maxForIndicator(indicatorId) {
  return Math.max(...state.data.indicators.filter((item) => item.id === indicatorId).map((item) => Number(item.value)));
}

function averageForGroup(indicatorId, groupId) {
  const group = groupById(groupId);
  const values = group.country_codes.map((countryCode) => valueFor(countryCode, indicatorId));
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function unitForIndicator(indicatorId) {
  const row = state.data.indicators.find((item) => item.id === indicatorId);
  return row ? row.unit : "";
}

function groupById(groupId) {
  return state.data.comparators.country_groups.find((group) => group.id === groupId);
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

function labelForIndicator(indicatorId) {
  const row = state.data.indicators.find((item) => item.id === indicatorId);
  return row ? row.label : indicatorId;
}

function fillSelect(select, items, selectedValue, labelFn, valueFn) {
  select.innerHTML = items
    .map((item) => {
      const value = valueFn(item);
      const selected = value === selectedValue ? " selected" : "";
      return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(labelFn(item))}</option>`;
    })
    .join("");
}

function renderList(target, cards, emptyMessage = "No items available.") {
  target.innerHTML = cards.length ? cards.join("") : `<p class="empty-state">${escapeHtml(emptyMessage)}</p>`;
}

function weightedAverage(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  return totalWeight === 0 ? 0 : items.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
  return `${formatNumber(value)} ${unit}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function exportSnapshot() {
  const pulse = pulseForCountry(currentCountry().country_code);
  const payload = {
    exported_at: new Date().toISOString(),
    country: currentCountry(),
    peer: peerCountry(),
    group: groupById(state.selectedGroup),
    lens: state.data.lensMap[state.selectedLens],
    pulse,
    pulse_drivers: pulseDrivers(currentCountry().country_code).slice(0, 8),
    intervention_priority: rankedInterventions(currentCountry().country_code).slice(0, 3),
    top_risks: topSignals(currentCountry().country_code),
    top_accelerators: acceleratorsFor(currentCountry().country_code).slice(0, 3)
  };
  downloadBlob(`${currentCountry().country_code.toLowerCase()}-growth-sdg-snapshot.json`, "application/json", JSON.stringify(payload, null, 2));
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
    elements.installAppBtn.classList.remove("hidden");
  });

  elements.installAppBtn.addEventListener("click", async () => {
    if (!state.deferredInstallPrompt) {
      return;
    }
    state.deferredInstallPrompt.prompt();
    await state.deferredInstallPrompt.userChoice;
    state.deferredInstallPrompt = null;
    elements.installAppBtn.classList.add("hidden");
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => null));
  }
}
