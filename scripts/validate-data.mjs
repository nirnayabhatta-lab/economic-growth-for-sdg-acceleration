import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dataDir = join(root, "data");

const requiredFiles = [
  "site_meta.json",
  "sources.json",
  "countries.json",
  "comparators.json",
  "indicators.json",
  "lenses.json",
  "pathways.json",
  "policies.json",
  "budget_map.json",
  "accelerators.json",
  "signals.json",
  "toolkit.json"
];

const schemas = {
  countries: ["country_code", "country_name", "region_group", "income_group", "peer_type", "is_default"],
  indicators: ["id", "country_code", "year", "lens", "label", "value", "unit", "trend", "sdg_links", "source_ids", "note"],
  pathways: ["id", "country_scope", "driver", "channel", "outcome", "sdg_links", "directness", "evidence_strength", "policy_relevance"],
  policies: ["id", "country_code", "policy_name", "period", "lead_agency", "policy_type", "growth_channels", "direct_sdgs", "indirect_sdgs", "implementation_status", "source_ids"],
  budget_map: ["country_code", "year", "ministry_or_sector", "program_area", "budget_type", "growth_channels", "sdg_links", "confidence"],
  accelerators: ["id", "country_code", "title", "mechanism", "why_now", "prerequisites", "lead_actors", "expected_channels", "sdg_links", "risk_flags", "source_ids"],
  signals: ["id", "country_code", "theme", "label", "value", "direction", "threshold_note", "source_ids", "last_updated"],
  lenses: ["id", "title", "summary", "indicator_ids"],
  toolkit: ["id", "title", "role", "what_it_does", "when_to_use"]
};

for (const file of requiredFiles) {
  if (!existsSync(join(dataDir, file))) {
    throw new Error(`Missing required data file: ${file}`);
  }
}

const sources = load("sources.json");
const countries = load("countries.json");
const indicators = load("indicators.json");
const pathways = load("pathways.json");
const policies = load("policies.json");
const budgetMap = load("budget_map.json");
const accelerators = load("accelerators.json");
const signals = load("signals.json");
const lenses = load("lenses.json");
const toolkit = load("toolkit.json");
const comparators = load("comparators.json");

assertShape("countries", countries, schemas.countries);
assertShape("indicators", indicators, schemas.indicators);
assertShape("pathways", pathways, schemas.pathways);
assertShape("policies", policies, schemas.policies);
assertShape("budget_map", budgetMap, schemas.budget_map);
assertShape("accelerators", accelerators, schemas.accelerators);
assertShape("signals", signals, schemas.signals);
assertShape("lenses", lenses, schemas.lenses);
assertShape("toolkit", toolkit, schemas.toolkit);

const countryCodes = new Set(countries.map((country) => country.country_code));
const sourceIds = new Set(sources.map((source) => source.id));
const lensIds = new Set(lenses.map((lens) => lens.id));

if (!comparators.default_country || !countryCodes.has(comparators.default_country)) {
  throw new Error("comparators.json default_country must reference a valid country");
}

for (const indicator of indicators) {
  if (!countryCodes.has(indicator.country_code)) {
    throw new Error(`Invalid country code in indicators: ${indicator.country_code}`);
  }
  if (!lensIds.has(indicator.lens)) {
    throw new Error(`Invalid lens in indicators: ${indicator.lens}`);
  }
  assertSourceRefs(indicator.source_ids, sourceIds, `indicator ${indicator.id}/${indicator.country_code}`);
}

for (const item of [...policies, ...accelerators, ...signals]) {
  if (!countryCodes.has(item.country_code)) {
    throw new Error(`Invalid country code in ${item.id || item.label}`);
  }
  assertSourceRefs(item.source_ids, sourceIds, item.id || item.label);
}

for (const pathway of pathways) {
  if (!["cross-country", ...countryCodes].includes(pathway.country_scope)) {
    throw new Error(`Invalid country_scope in pathway ${pathway.id}`);
  }
}

for (const group of comparators.country_groups) {
  for (const code of group.country_codes) {
    if (!countryCodes.has(code)) {
      throw new Error(`Invalid comparator country code ${code} in group ${group.id}`);
    }
  }
}

console.log("Data validation passed.");

function load(fileName) {
  return JSON.parse(readFileSync(join(dataDir, fileName), "utf8"));
}

function assertShape(name, collection, requiredFields) {
  if (!Array.isArray(collection)) {
    throw new Error(`${name} must be an array`);
  }

  collection.forEach((item, index) => {
    requiredFields.forEach((field) => {
      if (!(field in item)) {
        throw new Error(`${name}[${index}] is missing field ${field}`);
      }
    });
  });
}

function assertSourceRefs(ids, sourceSet, context) {
  ids.forEach((id) => {
    if (!sourceSet.has(id)) {
      throw new Error(`Unknown source id ${id} referenced in ${context}`);
    }
  });
}
