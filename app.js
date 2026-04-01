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
  const payload = {
    exported_at: new Date().toISOString(),
    country: currentCountry(),
    peer: peerCountry(),
    group: groupById(state.selectedGroup),
    lens: state.data.lensMap[state.selectedLens],
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
