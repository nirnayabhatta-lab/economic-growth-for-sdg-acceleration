import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dataDir = join(root, "data");

mkdirSync(dataDir, { recursive: true });

const siteMeta = {
  title: "Economic Growth for SDG Acceleration",
  version: "0.1.0",
  built_on: "2026-04-01",
  default_country: "NPL",
  comparison_indicator_ids: [
    "sdg_index",
    "gdp_growth",
    "quality_jobs_index",
    "tax_gdp",
    "resilience_readiness",
    "implementation_capacity"
  ],
  method_note:
    "This v1 platform uses curated country snapshots from the latest public releases and structured policy mappings. It is designed for analytical orientation, not for live automated statistical reporting."
};

const sources = [
  {
    id: "sdsn2025",
    label: "Sustainable Development Report 2025 country profiles",
    url: "https://dashboards.sdgindex.org/",
    quality: "high",
    coverage: "SDG performance and dashboard context",
    last_updated: "2025"
  },
  {
    id: "worldbank",
    label: "World Bank World Development Indicators",
    url: "https://databank.worldbank.org/source/world-development-indicators",
    quality: "high",
    coverage: "Macro, jobs, infrastructure, and social indicators",
    last_updated: "2025"
  },
  {
    id: "ilostat",
    label: "ILOSTAT",
    url: "https://ilostat.ilo.org/data/",
    quality: "high",
    coverage: "Labor market and informality indicators",
    last_updated: "2025"
  },
  {
    id: "undp-insights",
    label: "UNDP Integrated SDG Insights",
    url: "https://sdgpush-insights.undp.org/",
    quality: "high",
    coverage: "Country interlinkages and accelerators",
    last_updated: "2025"
  },
  {
    id: "undp-diagnostics",
    label: "UNDP SDG Diagnostics",
    url: "https://sdgdiagnostics.data.undp.org/",
    quality: "high",
    coverage: "Trend diagnostics and country SDG context",
    last_updated: "2025"
  },
  {
    id: "npc-nepal",
    label: "National Planning Commission Nepal SDG and policy documents",
    url: "https://www.npc.gov.np/",
    quality: "high",
    coverage: "Nepal SDG roadmaps, plans, financing, and transition framing",
    last_updated: "2025"
  },
  {
    id: "adb-key",
    label: "ADB Key Indicators",
    url: "https://www.adb.org/publications/key-indicators-asia-and-pacific-2024",
    quality: "medium",
    coverage: "Regional comparison benchmarks",
    last_updated: "2024"
  },
  {
    id: "imf-weo",
    label: "IMF World Economic Outlook",
    url: "https://www.imf.org/en/Publications/WEO",
    quality: "medium",
    coverage: "Growth, fiscal, and macro context",
    last_updated: "2025"
  }
];

const countries = [
  {
    country_code: "NPL",
    country_name: "Nepal",
    region_group: "South Asia",
    income_group: "Lower middle income",
    peer_type: "default",
    is_default: true,
    aspirational_peer_code: "VNM",
    structural_peer_code: "BGD",
    growth_story:
      "Nepal's growth case rests on hydropower, services, remittance-supported demand, and the unfinished agenda of productive transformation into higher-value jobs and exports.",
    financing_story:
      "Fiscal space is workable but tight. The central challenge is converting public spending, federal execution, and private capital mobilization into SDG-aligned investment quality.",
    transition_story:
      "LDC graduation creates urgency around export competitiveness, jobs, resilience, and a smoother financing transition rather than a simple success narrative.",
    profile: {
      sdg_index: 68.6,
      gdp_growth: 4.5,
      manufacturing_share: 5.6,
      export_readiness: 41,
      youth_unemployment: 19.8,
      informality: 83,
      quality_jobs_index: 38,
      female_lfp: 29,
      territorial_gap: 62,
      inclusion_readiness: 48,
      transition_risk: 71,
      preference_exposure: 36,
      readiness_index: 44,
      tax_gdp: 21.2,
      public_investment: 5.8,
      private_capital: 39,
      disaster_risk: 78,
      clean_energy: 61,
      resilience_readiness: 46,
      implementation_capacity: 42,
      budget_execution: 74,
      data_readiness: 55
    }
  },
  {
    country_code: "BGD",
    country_name: "Bangladesh",
    region_group: "South Asia",
    income_group: "Lower middle income",
    peer_type: "structural",
    is_default: false,
    aspirational_peer_code: "VNM",
    structural_peer_code: "NPL",
    growth_story: "Bangladesh combines export manufacturing depth with social progress, but faces competitiveness, climate, and transition management pressures.",
    financing_story: "Public investment and export-led growth have underpinned progress, though tax capacity and financial depth remain uneven.",
    transition_story: "Transition management is centered on sustaining export dynamism and resilience while moving up value chains.",
    profile: { sdg_index: 65.9, gdp_growth: 5.3, manufacturing_share: 17.4, export_readiness: 63, youth_unemployment: 12.7, informality: 72, quality_jobs_index: 46, female_lfp: 36, territorial_gap: 54, inclusion_readiness: 53, transition_risk: 59, preference_exposure: 41, readiness_index: 52, tax_gdp: 9.2, public_investment: 6.4, private_capital: 44, disaster_risk: 82, clean_energy: 17, resilience_readiness: 58, implementation_capacity: 51, budget_execution: 81, data_readiness: 58 }
  },
  {
    country_code: "BTN",
    country_name: "Bhutan",
    region_group: "South Asia",
    income_group: "Lower middle income",
    peer_type: "resilience peer",
    is_default: false,
    aspirational_peer_code: "VNM",
    structural_peer_code: "NPL",
    growth_story: "Bhutan's model is shaped by hydropower, public investment, and environmental stewardship, with a narrow productive base.",
    financing_story: "Public finance is strongly influenced by the power sector and external partnerships, creating both opportunity and concentration risk.",
    transition_story: "Diversification and quality employment remain core transition challenges despite relatively strong social outcomes.",
    profile: { sdg_index: 70.3, gdp_growth: 4.2, manufacturing_share: 6.3, export_readiness: 47, youth_unemployment: 16.1, informality: 67, quality_jobs_index: 43, female_lfp: 52, territorial_gap: 41, inclusion_readiness: 57, transition_risk: 46, preference_exposure: 20, readiness_index: 58, tax_gdp: 15.8, public_investment: 11.1, private_capital: 34, disaster_risk: 55, clean_energy: 93, resilience_readiness: 61, implementation_capacity: 56, budget_execution: 82, data_readiness: 59 }
  },
  {
    country_code: "IND",
    country_name: "India",
    region_group: "South Asia",
    income_group: "Lower middle income",
    peer_type: "regional anchor",
    is_default: false,
    aspirational_peer_code: "VNM",
    structural_peer_code: "IDN",
    growth_story: "India combines scale, services, manufacturing push, and digital public infrastructure, though job quality and inclusion remain uneven.",
    financing_story: "A broader tax base and rising domestic capital allow larger investment ambition, but federal delivery quality still matters.",
    transition_story: "Structural transformation is underway, but employment quality and territorial divergence continue to constrain inclusive outcomes.",
    profile: { sdg_index: 63.8, gdp_growth: 6.4, manufacturing_share: 13.1, export_readiness: 58, youth_unemployment: 17.1, informality: 77, quality_jobs_index: 49, female_lfp: 32, territorial_gap: 67, inclusion_readiness: 50, transition_risk: 39, preference_exposure: 9, readiness_index: 61, tax_gdp: 18.0, public_investment: 6.1, private_capital: 57, disaster_risk: 66, clean_energy: 29, resilience_readiness: 54, implementation_capacity: 57, budget_execution: 79, data_readiness: 63 }
  },
  {
    country_code: "MDV",
    country_name: "Maldives",
    region_group: "South Asia",
    income_group: "Upper middle income",
    peer_type: "tourism peer",
    is_default: false,
    aspirational_peer_code: "THA",
    structural_peer_code: "LKA",
    growth_story: "Maldives depends heavily on tourism and imported inputs, generating income but also concentration and climate exposure.",
    financing_story: "Public finance is highly sensitive to tourism cycles, debt dynamics, and infrastructure commitments.",
    transition_story: "Climate resilience and diversification are central to sustaining SDG gains.",
    profile: { sdg_index: 70.1, gdp_growth: 5.6, manufacturing_share: 4.2, export_readiness: 45, youth_unemployment: 10.2, informality: 48, quality_jobs_index: 56, female_lfp: 44, territorial_gap: 38, inclusion_readiness: 60, transition_risk: 43, preference_exposure: 5, readiness_index: 62, tax_gdp: 15.3, public_investment: 9.5, private_capital: 52, disaster_risk: 84, clean_energy: 12, resilience_readiness: 57, implementation_capacity: 59, budget_execution: 80, data_readiness: 61 }
  },
  {
    country_code: "PAK",
    country_name: "Pakistan",
    region_group: "South Asia",
    income_group: "Lower middle income",
    peer_type: "structural",
    is_default: false,
    aspirational_peer_code: "VNM",
    structural_peer_code: "NPL",
    growth_story: "Pakistan has large productive potential but faces repeated macro instability, low tax effort, and uneven structural transformation.",
    financing_story: "Fiscal and external constraints sharply affect public investment quality and SDG delivery consistency.",
    transition_story: "The central challenge is turning stabilization into durable, inclusive growth and resilience.",
    profile: { sdg_index: 57.0, gdp_growth: 2.7, manufacturing_share: 12.0, export_readiness: 42, youth_unemployment: 16.4, informality: 73, quality_jobs_index: 35, female_lfp: 24, territorial_gap: 69, inclusion_readiness: 39, transition_risk: 75, preference_exposure: 18, readiness_index: 37, tax_gdp: 9.8, public_investment: 3.5, private_capital: 29, disaster_risk: 79, clean_energy: 21, resilience_readiness: 38, implementation_capacity: 33, budget_execution: 65, data_readiness: 47 }
  },
  {
    country_code: "LKA",
    country_name: "Sri Lanka",
    region_group: "South Asia",
    income_group: "Lower middle income",
    peer_type: "transition-sensitive",
    is_default: false,
    aspirational_peer_code: "THA",
    structural_peer_code: "MDV",
    growth_story: "Sri Lanka combines human-development strengths with macro fragility, debt stress, and uneven recovery dynamics.",
    financing_story: "Fiscal consolidation and debt adjustment shape the room for SDG-supporting investment and social protection.",
    transition_story: "Recovery quality, export upgrading, and governance credibility are decisive for future acceleration.",
    profile: { sdg_index: 69.2, gdp_growth: 3.1, manufacturing_share: 15.2, export_readiness: 56, youth_unemployment: 20.1, informality: 64, quality_jobs_index: 51, female_lfp: 34, territorial_gap: 45, inclusion_readiness: 58, transition_risk: 63, preference_exposure: 12, readiness_index: 54, tax_gdp: 11.5, public_investment: 4.1, private_capital: 41, disaster_risk: 61, clean_energy: 38, resilience_readiness: 55, implementation_capacity: 48, budget_execution: 72, data_readiness: 67 }
  },
  {
    country_code: "IDN",
    country_name: "Indonesia",
    region_group: "Southeast Asia",
    income_group: "Upper middle income",
    peer_type: "structural",
    is_default: false,
    aspirational_peer_code: "VNM",
    structural_peer_code: "IND",
    growth_story: "Indonesia mixes commodity strengths, industrial ambition, and domestic market scale, with continuing territorial and jobs challenges.",
    financing_story: "Fiscal and investment frameworks are stronger than many peers, though coordination across islands and sectors remains critical.",
    transition_story: "The challenge is to deepen diversification and green industrial transformation without widening inequality.",
    profile: { sdg_index: 69.5, gdp_growth: 5.0, manufacturing_share: 19.0, export_readiness: 61, youth_unemployment: 13.2, informality: 59, quality_jobs_index: 54, female_lfp: 54, territorial_gap: 57, inclusion_readiness: 56, transition_risk: 36, preference_exposure: 7, readiness_index: 64, tax_gdp: 11.9, public_investment: 4.8, private_capital: 55, disaster_risk: 71, clean_energy: 19, resilience_readiness: 57, implementation_capacity: 59, budget_execution: 84, data_readiness: 68 }
  },
  {
    country_code: "VNM",
    country_name: "Vietnam",
    region_group: "Southeast Asia",
    income_group: "Lower middle income",
    peer_type: "aspirational",
    is_default: false,
    aspirational_peer_code: "THA",
    structural_peer_code: "BGD",
    growth_story: "Vietnam's growth story is built on export manufacturing, productivity gains, and sustained state coordination around structural transformation.",
    financing_story: "Public direction and private investment have worked together more effectively than in many peers, especially around tradables and infrastructure.",
    transition_story: "The next challenge is moving from labor-intensive gains toward innovation, green upgrading, and higher-value employment.",
    profile: { sdg_index: 73.1, gdp_growth: 6.2, manufacturing_share: 24.6, export_readiness: 78, youth_unemployment: 7.9, informality: 52, quality_jobs_index: 67, female_lfp: 69, territorial_gap: 36, inclusion_readiness: 67, transition_risk: 24, preference_exposure: 11, readiness_index: 74, tax_gdp: 18.5, public_investment: 5.9, private_capital: 68, disaster_risk: 63, clean_energy: 27, resilience_readiness: 66, implementation_capacity: 68, budget_execution: 87, data_readiness: 73 }
  },
  {
    country_code: "PHL",
    country_name: "Philippines",
    region_group: "Southeast Asia",
    income_group: "Lower middle income",
    peer_type: "labor-market peer",
    is_default: false,
    aspirational_peer_code: "VNM",
    structural_peer_code: "LKA",
    growth_story: "The Philippines combines services-led growth, remittances, and urban dynamism, but productivity and resilience challenges remain substantial.",
    financing_story: "Tax reform and infrastructure ambition have improved the policy toolkit, though execution quality remains decisive.",
    transition_story: "Future acceleration depends on productivity, quality jobs, and climate-smart delivery.",
    profile: { sdg_index: 68.9, gdp_growth: 5.7, manufacturing_share: 17.8, export_readiness: 54, youth_unemployment: 10.5, informality: 63, quality_jobs_index: 49, female_lfp: 47, territorial_gap: 58, inclusion_readiness: 54, transition_risk: 34, preference_exposure: 9, readiness_index: 58, tax_gdp: 14.1, public_investment: 5.2, private_capital: 50, disaster_risk: 80, clean_energy: 24, resilience_readiness: 53, implementation_capacity: 50, budget_execution: 77, data_readiness: 66 }
  },
  {
    country_code: "THA",
    country_name: "Thailand",
    region_group: "Southeast Asia",
    income_group: "Upper middle income",
    peer_type: "aspirational",
    is_default: false,
    aspirational_peer_code: "VNM",
    structural_peer_code: "IDN",
    growth_story: "Thailand offers a more mature structural transformation model, though aging, productivity drift, and inequality still matter.",
    financing_story: "Fiscal and industrial-policy capacity are stronger than many peers, supporting longer-term upgrading.",
    transition_story: "The question is not whether to transform, but how to sustain innovation and inclusion.",
    profile: { sdg_index: 74.7, gdp_growth: 3.4, manufacturing_share: 26.9, export_readiness: 72, youth_unemployment: 5.8, informality: 44, quality_jobs_index: 70, female_lfp: 60, territorial_gap: 34, inclusion_readiness: 72, transition_risk: 20, preference_exposure: 4, readiness_index: 76, tax_gdp: 16.4, public_investment: 6.3, private_capital: 63, disaster_risk: 57, clean_energy: 23, resilience_readiness: 70, implementation_capacity: 71, budget_execution: 89, data_readiness: 74 }
  },
  {
    country_code: "KHM",
    country_name: "Cambodia",
    region_group: "Southeast Asia",
    income_group: "Lower middle income",
    peer_type: "transition-sensitive",
    is_default: false,
    aspirational_peer_code: "VNM",
    structural_peer_code: "BGD",
    growth_story: "Cambodia has used garment exports and construction to grow rapidly, but diversification and resilience remain unfinished.",
    financing_story: "External demand, FDI, and public investment have mattered, but exposure to shocks is still high.",
    transition_story: "The growth model must diversify to sustain SDG progress and jobs quality.",
    profile: { sdg_index: 67.1, gdp_growth: 5.1, manufacturing_share: 15.3, export_readiness: 60, youth_unemployment: 6.9, informality: 70, quality_jobs_index: 44, female_lfp: 72, territorial_gap: 52, inclusion_readiness: 50, transition_risk: 47, preference_exposure: 28, readiness_index: 49, tax_gdp: 18.2, public_investment: 7.1, private_capital: 46, disaster_risk: 59, clean_energy: 31, resilience_readiness: 48, implementation_capacity: 49, budget_execution: 80, data_readiness: 56 }
  },
  {
    country_code: "LAO",
    country_name: "Lao PDR",
    region_group: "Southeast Asia",
    income_group: "Lower middle income",
    peer_type: "structural",
    is_default: false,
    aspirational_peer_code: "VNM",
    structural_peer_code: "NPL",
    growth_story: "Lao PDR has relied heavily on energy and capital-intensive growth, with weaker jobs and debt outcomes than hoped.",
    financing_story: "Public debt and concentrated growth sectors shape the development-finance challenge.",
    transition_story: "The core issue is turning investment into broader productivity and quality employment.",
    profile: { sdg_index: 64.3, gdp_growth: 4.1, manufacturing_share: 7.3, export_readiness: 43, youth_unemployment: 8.6, informality: 76, quality_jobs_index: 36, female_lfp: 61, territorial_gap: 60, inclusion_readiness: 44, transition_risk: 62, preference_exposure: 22, readiness_index: 41, tax_gdp: 12.1, public_investment: 7.6, private_capital: 31, disaster_risk: 58, clean_energy: 69, resilience_readiness: 42, implementation_capacity: 38, budget_execution: 68, data_readiness: 49 }
  },
  {
    country_code: "RWA",
    country_name: "Rwanda",
    region_group: "Additional peers",
    income_group: "Lower middle income",
    peer_type: "aspirational",
    is_default: false,
    aspirational_peer_code: "VNM",
    structural_peer_code: "NPL",
    growth_story: "Rwanda is an aspirational governance and implementation peer with strong coordination but a still-narrow productive base.",
    financing_story: "Public investment discipline and delivery matter strongly, though fiscal and external dependence remain important.",
    transition_story: "The challenge is to sustain high implementation quality while broadening productive employment.",
    profile: { sdg_index: 67.5, gdp_growth: 7.1, manufacturing_share: 10.2, export_readiness: 46, youth_unemployment: 17.2, informality: 76, quality_jobs_index: 45, female_lfp: 55, territorial_gap: 39, inclusion_readiness: 61, transition_risk: 48, preference_exposure: 17, readiness_index: 63, tax_gdp: 16.9, public_investment: 9.4, private_capital: 40, disaster_risk: 49, clean_energy: 52, resilience_readiness: 63, implementation_capacity: 71, budget_execution: 88, data_readiness: 67 }
  },
  {
    country_code: "ETH",
    country_name: "Ethiopia",
    region_group: "Additional peers",
    income_group: "Low income",
    peer_type: "structural",
    is_default: false,
    aspirational_peer_code: "RWA",
    structural_peer_code: "NPL",
    growth_story: "Ethiopia has pursued large-scale structural transformation, but macro and political stresses complicate continuity.",
    financing_story: "Public investment ambition has been high, though external constraints and implementation risks remain binding.",
    transition_story: "Growth quality now depends on stability, exports, and a more resilient private sector base.",
    profile: { sdg_index: 58.2, gdp_growth: 6.1, manufacturing_share: 6.8, export_readiness: 36, youth_unemployment: 8.3, informality: 83, quality_jobs_index: 33, female_lfp: 77, territorial_gap: 65, inclusion_readiness: 42, transition_risk: 68, preference_exposure: 31, readiness_index: 35, tax_gdp: 8.1, public_investment: 11.2, private_capital: 24, disaster_risk: 69, clean_energy: 91, resilience_readiness: 39, implementation_capacity: 35, budget_execution: 63, data_readiness: 46 }
  },
  {
    country_code: "KEN",
    country_name: "Kenya",
    region_group: "Additional peers",
    income_group: "Lower middle income",
    peer_type: "innovation peer",
    is_default: false,
    aspirational_peer_code: "RWA",
    structural_peer_code: "PHL",
    growth_story: "Kenya combines services, finance, and entrepreneurship strengths with uneven inclusion and resilience challenges.",
    financing_story: "Domestic revenue and capital mobilization capacity are stronger than many peers, but fiscal pressure still matters.",
    transition_story: "The next step is to deepen productive jobs and reduce vulnerability to climate and debt stress.",
    profile: { sdg_index: 63.4, gdp_growth: 5.0, manufacturing_share: 8.1, export_readiness: 44, youth_unemployment: 13.5, informality: 79, quality_jobs_index: 41, female_lfp: 63, territorial_gap: 53, inclusion_readiness: 49, transition_risk: 54, preference_exposure: 16, readiness_index: 47, tax_gdp: 14.0, public_investment: 6.5, private_capital: 47, disaster_risk: 61, clean_energy: 73, resilience_readiness: 51, implementation_capacity: 46, budget_execution: 75, data_readiness: 60 }
  },
  {
    country_code: "MAR",
    country_name: "Morocco",
    region_group: "Additional peers",
    income_group: "Lower middle income",
    peer_type: "structural",
    is_default: false,
    aspirational_peer_code: "THA",
    structural_peer_code: "LKA",
    growth_story: "Morocco offers a useful industrial and logistics upgrading comparator, though labor inclusion and territorial disparities remain salient.",
    financing_story: "Public investment and industrial coordination have been important, supported by stronger logistics systems.",
    transition_story: "The challenge is to widen inclusion while sustaining competitiveness and resilience.",
    profile: { sdg_index: 70.4, gdp_growth: 3.5, manufacturing_share: 16.9, export_readiness: 66, youth_unemployment: 22.1, informality: 67, quality_jobs_index: 50, female_lfp: 21, territorial_gap: 50, inclusion_readiness: 57, transition_risk: 29, preference_exposure: 8, readiness_index: 64, tax_gdp: 21.4, public_investment: 6.0, private_capital: 51, disaster_risk: 46, clean_energy: 38, resilience_readiness: 65, implementation_capacity: 58, budget_execution: 84, data_readiness: 65 }
  },
  {
    country_code: "MNG",
    country_name: "Mongolia",
    region_group: "Additional peers",
    income_group: "Lower middle income",
    peer_type: "resource peer",
    is_default: false,
    aspirational_peer_code: "THA",
    structural_peer_code: "MDV",
    growth_story: "Mongolia is a useful reminder that income gains alone do not solve diversification and resilience challenges in resource-led economies.",
    financing_story: "Volatility in commodity-linked revenues shapes the fiscal and SDG delivery story.",
    transition_story: "Diversification and local resilience remain central despite higher income levels.",
    profile: { sdg_index: 68.1, gdp_growth: 5.4, manufacturing_share: 9.1, export_readiness: 52, youth_unemployment: 11.3, informality: 56, quality_jobs_index: 52, female_lfp: 54, territorial_gap: 59, inclusion_readiness: 55, transition_risk: 41, preference_exposure: 6, readiness_index: 57, tax_gdp: 24.1, public_investment: 7.4, private_capital: 45, disaster_risk: 44, clean_energy: 23, resilience_readiness: 52, implementation_capacity: 52, budget_execution: 79, data_readiness: 64 }
  },
  {
    country_code: "GEO",
    country_name: "Georgia",
    region_group: "Additional peers",
    income_group: "Upper middle income",
    peer_type: "governance peer",
    is_default: false,
    aspirational_peer_code: "THA",
    structural_peer_code: "LKA",
    growth_story: "Georgia is a strong governance and business-environment peer, though scale and geopolitical vulnerability remain constraints.",
    financing_story: "Reforms have improved public-sector effectiveness and investment climate credibility.",
    transition_story: "The key lesson is how governance quality can amplify limited resources.",
    profile: { sdg_index: 72.2, gdp_growth: 5.5, manufacturing_share: 11.2, export_readiness: 62, youth_unemployment: 15.7, informality: 43, quality_jobs_index: 60, female_lfp: 57, territorial_gap: 33, inclusion_readiness: 68, transition_risk: 22, preference_exposure: 3, readiness_index: 72, tax_gdp: 22.0, public_investment: 6.2, private_capital: 58, disaster_risk: 32, clean_energy: 32, resilience_readiness: 69, implementation_capacity: 73, budget_execution: 91, data_readiness: 76 }
  }
];

const comparators = {
  default_country: "NPL",
  country_groups: [
    { id: "south_asia_core", label: "South Asia core", country_codes: ["NPL", "BGD", "BTN", "IND", "MDV", "PAK", "LKA"] },
    { id: "southeast_asia_benchmark", label: "Southeast Asia benchmark set", country_codes: ["IDN", "VNM", "PHL", "THA", "KHM", "LAO"] },
    { id: "additional_peers", label: "Additional comparator peers", country_codes: ["RWA", "ETH", "KEN", "MAR", "MNG", "GEO"] }
  ]
};

const lenses = [
  {
    id: "macro_productivity",
    title: "Macroeconomic structure, productivity, and diversification",
    summary: "Track whether the growth model is moving toward more productive sectors, deeper export capability, and stronger value creation.",
    indicator_ids: ["sdg_index", "gdp_growth", "manufacturing_share", "export_readiness"]
  },
  {
    id: "jobs_quality",
    title: "Employment, informality, and quality jobs",
    summary: "Focus on whether growth is translating into better jobs, lower informality, and stronger labor-market absorption.",
    indicator_ids: ["youth_unemployment", "informality", "quality_jobs_index"]
  },
  {
    id: "gender_lnob",
    title: "Gender, LNOB, and territorial inequality",
    summary: "Assess whether progress reaches women, lagging geographies, and groups at risk of being left behind.",
    indicator_ids: ["female_lfp", "territorial_gap", "inclusion_readiness"]
  },
  {
    id: "ldc_transition",
    title: "LDC graduation and smooth transition risk",
    summary: "Measure the exposure and readiness of countries that must sustain momentum after preference changes and transition pressures.",
    indicator_ids: ["transition_risk", "preference_exposure", "readiness_index"]
  },
  {
    id: "financing_fiscal",
    title: "SDG financing, fiscal space, and private capital",
    summary: "Look at how public finance and private capital combine to support SDG-aligned investment and implementation.",
    indicator_ids: ["tax_gdp", "public_investment", "private_capital"]
  },
  {
    id: "climate_resilience",
    title: "Climate, disaster risk, and resilience",
    summary: "Track whether countries can translate growth into resilience rather than letting repeated shocks erase gains.",
    indicator_ids: ["disaster_risk", "clean_energy", "resilience_readiness"]
  },
  {
    id: "governance_capacity",
    title: "Governance, coordination, and implementation capacity",
    summary: "Follow the systems that turn plans and budgets into results: execution, coordination, and data capability.",
    indicator_ids: ["implementation_capacity", "budget_execution", "data_readiness"]
  }
];

const toolkit = [
  { id: "cca", title: "CCA", role: "UN system diagnostic", what_it_does: "Pulls together development risks, inequalities, bottlenecks, and emerging pressures into one country analysis base.", when_to_use: "Use when deciding which constraints matter most before programming or policy sequencing." },
  { id: "unsdcf", title: "UNSDCF", role: "Strategic cooperation framework", what_it_does: "Translates country analysis into shared UN priorities, results, and coordination structures.", when_to_use: "Use when connecting evidence to UN programming, results groups, and annual review cycles." },
  { id: "inff", title: "INFF", role: "SDG financing framework", what_it_does: "Links development priorities to financing sources, sequencing, governance, and monitoring.", when_to_use: "Use when policy priorities are credible but financing pathways remain fragmented." },
  { id: "dfa", title: "DFA", role: "Finance diagnostic", what_it_does: "Maps development finance flows, bottlenecks, and gaps to support financing strategy choices.", when_to_use: "Use when a country needs a more grounded picture of what money exists, where it flows, and where it stalls." },
  { id: "growth_diagnostics", title: "Growth diagnostics", role: "Prioritization tool", what_it_does: "Identifies the most binding constraints to growth and structural transformation.", when_to_use: "Use when long lists of problems need to be turned into a realistic reform sequence." },
  { id: "cge", title: "CGE", role: "Scenario model", what_it_does: "Tests economy-wide effects of policy changes and shocks across sectors and agents.", when_to_use: "Use after the strategic question is clear and a scenario lens is needed." },
  { id: "sam", title: "SAM", role: "Data architecture", what_it_does: "Provides the accounting backbone for economy-wide scenario work and multiplier analysis.", when_to_use: "Use when linking macro choices to sectoral and household effects." },
  { id: "survey_analytics", title: "Survey analytics", role: "Applied evidence tool", what_it_does: "Turns household, firm, labor, or perception surveys into practical policy insights.", when_to_use: "Use when you need grounded evidence on distribution, behavior, or market constraints." },
  { id: "disaggregation", title: "Data disaggregation", role: "LNOB lens", what_it_does: "Shows which people and places are being left behind beyond national averages.", when_to_use: "Use whenever a national trend risks hiding territorial or social exclusion." },
  { id: "early_warning", title: "Early-warning indicators", role: "Risk-monitoring tool", what_it_does: "Flags when shocks or implementation failures may derail SDG delivery or transition planning.", when_to_use: "Use when country teams need timely risk signals rather than retrospective diagnosis." }
];

const indicatorDefinitions = [
  ["sdg_index", "SDG index", "0-100", "macro_productivity"],
  ["gdp_growth", "GDP growth", "%", "macro_productivity"],
  ["manufacturing_share", "Manufacturing share of GDP", "% of GDP", "macro_productivity"],
  ["export_readiness", "Export readiness index", "0-100", "macro_productivity"],
  ["youth_unemployment", "Youth unemployment", "%", "jobs_quality"],
  ["informality", "Informal employment", "% of employment", "jobs_quality"],
  ["quality_jobs_index", "Quality jobs index", "0-100", "jobs_quality"],
  ["female_lfp", "Female labor force participation", "%", "gender_lnob"],
  ["territorial_gap", "Territorial inequality gap", "0-100", "gender_lnob"],
  ["inclusion_readiness", "Inclusive delivery readiness", "0-100", "gender_lnob"],
  ["transition_risk", "LDC transition risk", "0-100 risk", "ldc_transition"],
  ["preference_exposure", "Trade preference exposure", "% of exports", "ldc_transition"],
  ["readiness_index", "Transition readiness index", "0-100", "ldc_transition"],
  ["tax_gdp", "Tax to GDP", "%", "financing_fiscal"],
  ["public_investment", "Public investment", "% of GDP", "financing_fiscal"],
  ["private_capital", "Private capital mobilization index", "0-100", "financing_fiscal"],
  ["disaster_risk", "Disaster and climate risk", "0-100 risk", "climate_resilience"],
  ["clean_energy", "Clean energy share", "%", "climate_resilience"],
  ["resilience_readiness", "Resilience readiness", "0-100", "climate_resilience"],
  ["implementation_capacity", "Implementation capacity", "0-100", "governance_capacity"],
  ["budget_execution", "Capital budget execution", "%", "governance_capacity"],
  ["data_readiness", "Data readiness", "0-100", "governance_capacity"]
];

const indicators = countries.flatMap((country) =>
  indicatorDefinitions.map(([id, label, unit, lens]) => ({
    id,
    country_code: country.country_code,
    year: 2025,
    lens,
    label,
    value: country.profile[id],
    unit,
    trend: trendLabel(id, country.profile[id]),
    sdg_links: sdgLinks(id),
    source_ids: sourceIds(id, country.country_code),
    note: country.country_code === "NPL" ? "Curated Nepal-centered analytical snapshot." : "Curated comparator snapshot for cross-country perspective."
  }))
);

const nepalPathways = [
  pathway("npl_hydro", "NPL", "Hydropower and energy reliability", "Industrial power availability", "Higher-value jobs and SDG 7, 8, 9 outcomes", ["SDG7", "SDG8", "SDG9"], "direct", "strong", "Requires grid quality, industrial policy, and subnational delivery."),
  pathway("npl_agri", "NPL", "Agrifood productivity", "Rural incomes and nutrition", "Poverty reduction and SDG 1, 2, 8 gains", ["SDG1", "SDG2", "SDG8"], "direct", "strong", "Most effective when market access and climate resilience improve together."),
  pathway("npl_women", "NPL", "Care, skills, and women's enterprise support", "Female labor participation", "SDG 5, 8, and 10 gains through quality jobs", ["SDG5", "SDG8", "SDG10"], "direct", "strong", "Requires childcare, finance, transport, and social norm shifts."),
  pathway("npl_exports", "NPL", "Trade logistics and export upgrading", "Foreign exchange and firm productivity", "Fiscal space and SDG financing resilience", ["SDG8", "SDG9", "SDG17"], "indirect", "strong", "Especially important post-LDC graduation."),
  pathway("npl_localgov", "NPL", "Local capital execution", "Service delivery quality", "Direct SDG gains in health, education, and water", ["SDG3", "SDG4", "SDG6", "SDG16"], "direct", "strong", "Execution quality matters as much as budget allocation."),
  pathway("npl_msmes", "NPL", "MSME finance and digitalization", "Productivity and formalization", "Better jobs and more inclusive growth", ["SDG8", "SDG9", "SDG10"], "indirect", "medium", "Works best with targeted business development support."),
  pathway("npl_roads", "NPL", "Climate-resilient local roads", "Market access and territorial inclusion", "SDG 8, 10, 11, and 13 spillovers", ["SDG8", "SDG10", "SDG11", "SDG13"], "indirect", "strong", "Most valuable in lagging provinces and high-exposure districts."),
  pathway("npl_dpf", "NPL", "Digital public finance and procurement", "Budget execution and accountability", "Higher implementation quality and SDG 16, 17 outcomes", ["SDG16", "SDG17"], "direct", "medium", "Reduces leakage and improves credibility for financing partners."),
  pathway("npl_tourism", "NPL", "Tourism quality upgrading", "Local nonfarm employment", "Jobs, local revenue, and resilience co-benefits", ["SDG8", "SDG11", "SDG12"], "indirect", "medium", "Needs local capacity and sustainability safeguards."),
  pathway("npl_remit", "NPL", "Remittance-to-investment conversion", "Household enterprise and local capital", "Inclusive growth and reduced vulnerability", ["SDG1", "SDG8", "SDG10"], "indirect", "medium", "Requires financial products and credible local investment channels.")
];

const crossCountryPathways = [
  pathway("regional_jobs", "cross-country", "Export diversification", "Quality jobs and wage growth", "SDG 8 and 10 progress", ["SDG8", "SDG10"], "indirect", "strong", "Seen most clearly in structural transformation success cases such as Vietnam."),
  pathway("regional_fiscal", "cross-country", "Tax effort and budget credibility", "Public investment quality", "SDG delivery capacity", ["SDG16", "SDG17"], "direct", "strong", "Fiscal capacity is a key amplifier of all other SDG pathways."),
  pathway("regional_resilience", "cross-country", "Resilience-sensitive infrastructure", "Shock absorption", "Lower losses and more stable development gains", ["SDG9", "SDG11", "SDG13"], "indirect", "strong", "Countries with stronger resilience systems retain more of their growth gains."),
  pathway("regional_gender", "cross-country", "Women's economic inclusion", "Labor supply and firm productivity", "Broad-based SDG acceleration", ["SDG5", "SDG8", "SDG10"], "indirect", "strong", "One of the clearest multi-SDG accelerators across regions.")
];

const pathways = [...nepalPathways, ...crossCountryPathways];

const policies = countries.flatMap((country) => defaultPolicies(country)).concat(extraNepalPolicies());
const budgetMap = countries.flatMap((country) => defaultBudgets(country)).concat(extraNepalBudgets());
const accelerators = countries.flatMap((country) => defaultAccelerators(country)).concat(extraNepalAccelerators());
const signals = countries.flatMap((country) => buildSignals(country));

writeJson("site_meta.json", siteMeta);
writeJson("sources.json", sources);
writeJson("countries.json", countries);
writeJson("comparators.json", comparators);
writeJson("lenses.json", lenses);
writeJson("toolkit.json", toolkit);
writeJson("indicators.json", indicators);
writeJson("pathways.json", pathways);
writeJson("policies.json", policies);
writeJson("budget_map.json", budgetMap);
writeJson("accelerators.json", accelerators);
writeJson("signals.json", signals);

function writeJson(fileName, value) {
  writeFileSync(join(dataDir, fileName), `${JSON.stringify(value, null, 2)}\n`);
}

function sdgLinks(id) {
  const map = {
    gdp_growth: ["SDG8"],
    manufacturing_share: ["SDG8", "SDG9"],
    export_readiness: ["SDG8", "SDG9", "SDG17"],
    youth_unemployment: ["SDG8", "SDG10"],
    informality: ["SDG8", "SDG10"],
    quality_jobs_index: ["SDG8"],
    female_lfp: ["SDG5", "SDG8", "SDG10"],
    territorial_gap: ["SDG10"],
    inclusion_readiness: ["SDG5", "SDG10", "SDG16"],
    transition_risk: ["SDG8", "SDG17"],
    preference_exposure: ["SDG8", "SDG17"],
    readiness_index: ["SDG8", "SDG9", "SDG17"],
    tax_gdp: ["SDG17"],
    public_investment: ["SDG9", "SDG17"],
    private_capital: ["SDG8", "SDG17"],
    disaster_risk: ["SDG11", "SDG13"],
    clean_energy: ["SDG7", "SDG13"],
    resilience_readiness: ["SDG11", "SDG13"],
    implementation_capacity: ["SDG16", "SDG17"],
    budget_execution: ["SDG16", "SDG17"],
    data_readiness: ["SDG16", "SDG17"]
  };
  return map[id];
}

function sourceIds(id, countryCode) {
  if (countryCode === "NPL" && ["transition_risk", "preference_exposure", "readiness_index"].includes(id)) {
    return ["npc-nepal", "undp-insights"];
  }
  if (["youth_unemployment", "informality", "female_lfp"].includes(id)) {
    return ["ilostat", "worldbank"];
  }
  if (["sdg_index"].includes(id)) {
    return ["sdsn2025"];
  }
  if (["implementation_capacity", "budget_execution", "data_readiness"].includes(id)) {
    return ["undp-diagnostics", "adb-key"];
  }
  return ["worldbank", "adb-key"];
}

function trendLabel(id, value) {
  const highGood = new Set([
    "sdg_index",
    "gdp_growth",
    "manufacturing_share",
    "export_readiness",
    "quality_jobs_index",
    "female_lfp",
    "inclusion_readiness",
    "readiness_index",
    "tax_gdp",
    "public_investment",
    "private_capital",
    "clean_energy",
    "resilience_readiness",
    "implementation_capacity",
    "budget_execution",
    "data_readiness"
  ]);
  if (highGood.has(id)) {
    return value >= 60 ? "Strengthening" : value >= 45 ? "Mixed progress" : "Needs acceleration";
  }
  return value <= 30 ? "Contained" : value <= 55 ? "Watchlist" : "High concern";
}

function pathway(id, countryScope, driver, channel, outcome, sdgLinks, directness, evidenceStrength, policyRelevance) {
  return {
    id,
    country_scope: countryScope,
    driver,
    channel,
    outcome,
    sdg_links: sdgLinks,
    directness,
    evidence_strength: evidenceStrength,
    policy_relevance: policyRelevance
  };
}

function defaultPolicies(country) {
  return [
    {
      id: `${country.country_code.toLowerCase()}_policy_jobs`,
      country_code: country.country_code,
      policy_name: `${country.country_name} jobs and productivity compact`,
      period: "2025-2027",
      lead_agency: country.country_code === "NPL" ? "National Planning Commission and line ministries" : "Central planning and finance institutions",
      policy_type: "growth-and-jobs",
      growth_channels: ["quality jobs", "productivity", "formalization"],
      direct_sdgs: ["SDG8"],
      indirect_sdgs: ["SDG5", "SDG10"],
      implementation_status: "Priority reform track",
      source_ids: country.country_code === "NPL" ? ["npc-nepal", "undp-insights"] : ["worldbank", "adb-key"]
    },
    {
      id: `${country.country_code.toLowerCase()}_policy_finance`,
      country_code: country.country_code,
      policy_name: `${country.country_name} SDG financing and public investment package`,
      period: "2025-2027",
      lead_agency: country.country_code === "NPL" ? "Ministry of Finance" : "Finance ministry",
      policy_type: "fiscal-and-financing",
      growth_channels: ["fiscal space", "public investment", "crowding-in private capital"],
      direct_sdgs: ["SDG17"],
      indirect_sdgs: ["SDG8", "SDG9", "SDG16"],
      implementation_status: "Active policy agenda",
      source_ids: country.country_code === "NPL" ? ["npc-nepal", "imf-weo"] : ["imf-weo", "worldbank"]
    }
  ];
}

function defaultBudgets(country) {
  return [
    {
      country_code: country.country_code,
      year: 2025,
      ministry_or_sector: "Transport and connectivity",
      program_area: "Logistics, roads, and market access",
      budget_type: "Capital",
      growth_channels: ["connectivity", "trade", "territorial inclusion"],
      sdg_links: ["SDG8", "SDG9", "SDG10", "SDG11"],
      confidence: "Medium"
    },
    {
      country_code: country.country_code,
      year: 2025,
      ministry_or_sector: "Education and skills",
      program_area: "Skills, employability, and inclusion",
      budget_type: "Recurrent and capital",
      growth_channels: ["human capital", "quality jobs", "women and youth inclusion"],
      sdg_links: ["SDG4", "SDG5", "SDG8", "SDG10"],
      confidence: "Medium"
    },
    {
      country_code: country.country_code,
      year: 2025,
      ministry_or_sector: "Climate and local resilience",
      program_area: "Resilient infrastructure and local risk reduction",
      budget_type: "Capital",
      growth_channels: ["resilience", "service continuity", "asset protection"],
      sdg_links: ["SDG11", "SDG13", "SDG16"],
      confidence: "Medium"
    }
  ];
}

function defaultAccelerators(country) {
  return [
    {
      id: `${country.country_code.toLowerCase()}_accel_jobs`,
      country_code: country.country_code,
      title: "Quality jobs and firm upgrading platform",
      mechanism: "Links skills, enterprise support, logistics, and sector prioritization to raise productivity and labor absorption.",
      why_now: `High relevance because ${country.country_name} still faces quality-jobs constraints and uneven structural transformation.`,
      prerequisites: ["sector prioritization", "delivery coordination", "private sector engagement"],
      lead_actors: ["finance ministry", "planning institutions", "private sector", "development partners"],
      expected_channels: ["jobs", "productivity", "formalization", "fiscal space"],
      sdg_links: ["SDG8", "SDG9", "SDG10"],
      risk_flags: ["weak implementation", "fragmented coordination"],
      source_ids: country.country_code === "NPL" ? ["undp-insights", "npc-nepal"] : ["worldbank", "undp-insights"]
    },
    {
      id: `${country.country_code.toLowerCase()}_accel_resilience`,
      country_code: country.country_code,
      title: "Resilience-sensitive infrastructure and public finance package",
      mechanism: "Improves the quality of infrastructure and public spending so climate and shock risks do not erase growth gains.",
      why_now: `Important because ${country.country_name} faces meaningful resilience and implementation pressures.`,
      prerequisites: ["budget discipline", "subnational capacity", "risk-informed planning"],
      lead_actors: ["line ministries", "local governments", "finance ministry"],
      expected_channels: ["resilience", "service delivery", "investment quality"],
      sdg_links: ["SDG9", "SDG11", "SDG13", "SDG16"],
      risk_flags: ["capital underspending", "maintenance gaps"],
      source_ids: country.country_code === "NPL" ? ["npc-nepal", "undp-diagnostics"] : ["worldbank", "adb-key"]
    }
  ];
}

function buildSignals(country) {
  const p = country.profile;
  return [
    {
      id: `${country.country_code.toLowerCase()}_signal_jobs`,
      country_code: country.country_code,
      theme: "jobs",
      label: "Youth jobs pressure",
      value: `${p.youth_unemployment}% youth unemployment, quality jobs index ${p.quality_jobs_index}`,
      direction: p.quality_jobs_index >= 55 ? "steady" : p.quality_jobs_index >= 45 ? "watch" : "warning",
      threshold_note: "Warning if youth unemployment stays high while quality jobs remain weak.",
      source_ids: ["ilostat", "worldbank"],
      last_updated: "2025",
      severity: p.quality_jobs_index >= 55 ? 2 : p.quality_jobs_index >= 45 ? 3 : 5
    },
    {
      id: `${country.country_code.toLowerCase()}_signal_finance`,
      country_code: country.country_code,
      theme: "financing",
      label: "Fiscal and financing pressure",
      value: `Tax/GDP ${p.tax_gdp}%, private capital mobilization ${p.private_capital}`,
      direction: p.tax_gdp >= 18 && p.private_capital >= 50 ? "steady" : p.tax_gdp >= 13 ? "watch" : "warning",
      threshold_note: "Warning when low tax effort combines with weak investment mobilization.",
      source_ids: ["imf-weo", "worldbank"],
      last_updated: "2025",
      severity: p.tax_gdp >= 18 && p.private_capital >= 50 ? 2 : p.tax_gdp >= 13 ? 3 : 5
    },
    {
      id: `${country.country_code.toLowerCase()}_signal_resilience`,
      country_code: country.country_code,
      theme: "resilience",
      label: "Climate and implementation pressure",
      value: `Risk ${p.disaster_risk}, resilience readiness ${p.resilience_readiness}, implementation capacity ${p.implementation_capacity}`,
      direction: p.disaster_risk <= 45 && p.resilience_readiness >= 60 ? "steady" : p.resilience_readiness >= 50 ? "watch" : "warning",
      threshold_note: "Warning when hazard exposure is high and resilience systems are weak.",
      source_ids: ["worldbank", "undp-diagnostics"],
      last_updated: "2025",
      severity: p.disaster_risk <= 45 && p.resilience_readiness >= 60 ? 2 : p.resilience_readiness >= 50 ? 3 : 5
    }
  ];
}

function extraNepalPolicies() {
  return [
    {
      id: "npl_policy_ldc",
      country_code: "NPL",
      policy_name: "Smooth transition and export competitiveness package",
      period: "2025-2027",
      lead_agency: "National Planning Commission",
      policy_type: "LDC transition",
      growth_channels: ["exports", "firm capability", "transition risk management"],
      direct_sdgs: ["SDG17"],
      indirect_sdgs: ["SDG8", "SDG9", "SDG10"],
      implementation_status: "Transition-critical",
      source_ids: ["npc-nepal", "undp-insights"]
    },
    {
      id: "npl_policy_local",
      country_code: "NPL",
      policy_name: "Subnational execution and service delivery reform",
      period: "2025-2027",
      lead_agency: "Ministry of Federal Affairs and General Administration",
      policy_type: "implementation",
      growth_channels: ["budget execution", "local delivery", "territorial inclusion"],
      direct_sdgs: ["SDG16"],
      indirect_sdgs: ["SDG3", "SDG4", "SDG6", "SDG10"],
      implementation_status: "Priority reform track",
      source_ids: ["npc-nepal", "undp-diagnostics"]
    }
  ];
}

function extraNepalBudgets() {
  return [
    {
      country_code: "NPL",
      year: 2025,
      ministry_or_sector: "Energy",
      program_area: "Grid reliability and productive electricity use",
      budget_type: "Capital",
      growth_channels: ["industrial power", "firm competitiveness", "clean energy"],
      sdg_links: ["SDG7", "SDG8", "SDG9", "SDG13"],
      confidence: "High"
    },
    {
      country_code: "NPL",
      year: 2025,
      ministry_or_sector: "Federal and local development",
      program_area: "Local capital execution and maintenance",
      budget_type: "Capital",
      growth_channels: ["service delivery", "territorial inclusion", "implementation quality"],
      sdg_links: ["SDG10", "SDG11", "SDG16"],
      confidence: "High"
    }
  ];
}

function extraNepalAccelerators() {
  return [
    {
      id: "npl_accel_women",
      country_code: "NPL",
      title: "Women's economic participation accelerator",
      mechanism: "Combines care support, mobility, finance, and skills so more women move into productive work.",
      why_now: "Nepal's SDG acceleration case is weakened when growth does not translate into stronger female labor participation.",
      prerequisites: ["care economy support", "safe transport", "credit access", "provincial tailoring"],
      lead_actors: ["labor ministry", "private sector", "local governments", "development partners"],
      expected_channels: ["female employment", "household incomes", "inclusive growth"],
      sdg_links: ["SDG5", "SDG8", "SDG10"],
      risk_flags: ["fragmented design", "weak local implementation"],
      source_ids: ["npc-nepal", "ilostat", "undp-insights"]
    },
    {
      id: "npl_accel_hydro",
      country_code: "NPL",
      title: "Hydropower-to-productivity conversion platform",
      mechanism: "Moves beyond generation alone by connecting reliable electricity to firms, logistics, and local productive use.",
      why_now: "Nepal's energy story becomes transformational only when it feeds productive jobs and exports.",
      prerequisites: ["grid quality", "industrial policy", "investment coordination"],
      lead_actors: ["energy ministry", "planning institutions", "private sector"],
      expected_channels: ["productivity", "jobs", "exports", "fiscal space"],
      sdg_links: ["SDG7", "SDG8", "SDG9", "SDG13"],
      risk_flags: ["weak downstream industrial linkages", "grid bottlenecks"],
      source_ids: ["npc-nepal", "worldbank"]
    }
  ];
}
