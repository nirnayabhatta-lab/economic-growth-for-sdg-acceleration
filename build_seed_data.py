from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)


def country(code, name, region, income, peer_type, is_default, aspirational, structural, growth, financing, transition, sdg_index, gdp_growth, manufacturing_share, export_readiness, youth_unemployment, informality, quality_jobs_index, female_lfp, territorial_gap, inclusion_readiness, transition_risk, preference_exposure, readiness_index, tax_gdp, public_investment, private_capital, disaster_risk, clean_energy, resilience_readiness, implementation_capacity, budget_execution, data_readiness):
    return {
        "country_code": code,
        "country_name": name,
        "region_group": region,
        "income_group": income,
        "peer_type": peer_type,
        "is_default": is_default,
        "aspirational_peer_code": aspirational,
        "structural_peer_code": structural,
        "growth_story": growth,
        "financing_story": financing,
        "transition_story": transition,
        "profile": {
            "sdg_index": sdg_index,
            "gdp_growth": gdp_growth,
            "manufacturing_share": manufacturing_share,
            "export_readiness": export_readiness,
            "youth_unemployment": youth_unemployment,
            "informality": informality,
            "quality_jobs_index": quality_jobs_index,
            "female_lfp": female_lfp,
            "territorial_gap": territorial_gap,
            "inclusion_readiness": inclusion_readiness,
            "transition_risk": transition_risk,
            "preference_exposure": preference_exposure,
            "readiness_index": readiness_index,
            "tax_gdp": tax_gdp,
            "public_investment": public_investment,
            "private_capital": private_capital,
            "disaster_risk": disaster_risk,
            "clean_energy": clean_energy,
            "resilience_readiness": resilience_readiness,
            "implementation_capacity": implementation_capacity,
            "budget_execution": budget_execution,
            "data_readiness": data_readiness,
        },
    }


def sdg_links(indicator_id):
    mapping = {
        "sdg_index": ["SDG1", "SDG8", "SDG17"],
        "gdp_growth": ["SDG8"],
        "manufacturing_share": ["SDG8", "SDG9"],
        "export_readiness": ["SDG8", "SDG9", "SDG17"],
        "youth_unemployment": ["SDG8", "SDG10"],
        "informality": ["SDG8", "SDG10"],
        "quality_jobs_index": ["SDG8"],
        "female_lfp": ["SDG5", "SDG8", "SDG10"],
        "territorial_gap": ["SDG10"],
        "inclusion_readiness": ["SDG5", "SDG10", "SDG16"],
        "transition_risk": ["SDG8", "SDG17"],
        "preference_exposure": ["SDG8", "SDG17"],
        "readiness_index": ["SDG8", "SDG9", "SDG17"],
        "tax_gdp": ["SDG17"],
        "public_investment": ["SDG9", "SDG17"],
        "private_capital": ["SDG8", "SDG17"],
        "disaster_risk": ["SDG11", "SDG13"],
        "clean_energy": ["SDG7", "SDG13"],
        "resilience_readiness": ["SDG11", "SDG13"],
        "implementation_capacity": ["SDG16", "SDG17"],
        "budget_execution": ["SDG16", "SDG17"],
        "data_readiness": ["SDG16", "SDG17"],
    }
    return mapping[indicator_id]


def source_ids(indicator_id, country_code):
    if country_code == "NPL" and indicator_id in {"transition_risk", "preference_exposure", "readiness_index"}:
        return ["npc-nepal", "undp-insights"]
    if indicator_id in {"youth_unemployment", "informality", "female_lfp"}:
        return ["ilostat", "worldbank"]
    if indicator_id == "sdg_index":
        return ["sdsn2025"]
    if indicator_id in {"implementation_capacity", "budget_execution", "data_readiness"}:
        return ["undp-diagnostics", "adb-key"]
    return ["worldbank", "adb-key"]


def trend_label(indicator_id, value):
    high_good = {
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
        "data_readiness",
    }
    if indicator_id in high_good:
        return "Strengthening" if value >= 60 else "Mixed progress" if value >= 45 else "Needs acceleration"
    return "Contained" if value <= 30 else "Watchlist" if value <= 55 else "High concern"


def pathway(pid, country_scope, driver, channel, outcome, sdgs, directness, evidence_strength, policy_relevance):
    return {
        "id": pid,
        "country_scope": country_scope,
        "driver": driver,
        "channel": channel,
        "outcome": outcome,
        "sdg_links": sdgs,
        "directness": directness,
        "evidence_strength": evidence_strength,
        "policy_relevance": policy_relevance,
    }


def nepal_pathways():
    return [
        pathway("npl_hydro", "NPL", "Hydropower and energy reliability", "Industrial power availability", "Higher-value jobs and SDG 7, 8, 9 outcomes", ["SDG7", "SDG8", "SDG9"], "direct", "strong", "Requires grid quality, industrial policy, and subnational delivery."),
        pathway("npl_agri", "NPL", "Agrifood productivity", "Rural incomes and nutrition", "Poverty reduction and SDG 1, 2, 8 gains", ["SDG1", "SDG2", "SDG8"], "direct", "strong", "Most effective when market access and climate resilience improve together."),
        pathway("npl_women", "NPL", "Care, skills, and women's enterprise support", "Female labor participation", "SDG 5, 8, and 10 gains through quality jobs", ["SDG5", "SDG8", "SDG10"], "direct", "strong", "Requires childcare, finance, transport, and social norm shifts."),
        pathway("npl_exports", "NPL", "Trade logistics and export upgrading", "Foreign exchange and firm productivity", "Fiscal space and SDG financing resilience", ["SDG8", "SDG9", "SDG17"], "indirect", "strong", "Especially important post-LDC graduation."),
        pathway("npl_localgov", "NPL", "Local capital execution", "Service delivery quality", "Direct SDG gains in health, education, and water", ["SDG3", "SDG4", "SDG6", "SDG16"], "direct", "strong", "Execution quality matters as much as budget allocation."),
        pathway("npl_msmes", "NPL", "MSME finance and digitalization", "Productivity and formalization", "Better jobs and more inclusive growth", ["SDG8", "SDG9", "SDG10"], "indirect", "medium", "Works best with targeted business development support."),
        pathway("npl_roads", "NPL", "Climate-resilient local roads", "Market access and territorial inclusion", "SDG 8, 10, 11, and 13 spillovers", ["SDG8", "SDG10", "SDG11", "SDG13"], "indirect", "strong", "Most valuable in lagging provinces and high-exposure districts."),
        pathway("npl_dpf", "NPL", "Digital public finance and procurement", "Budget execution and accountability", "Higher implementation quality and SDG 16, 17 outcomes", ["SDG16", "SDG17"], "direct", "medium", "Reduces leakage and improves financing credibility."),
        pathway("npl_tourism", "NPL", "Tourism quality upgrading", "Local nonfarm employment", "Jobs, local revenue, and resilience co-benefits", ["SDG8", "SDG11", "SDG12"], "indirect", "medium", "Needs local capacity and sustainability safeguards."),
        pathway("npl_remit", "NPL", "Remittance-to-investment conversion", "Household enterprise and local capital", "Inclusive growth and reduced vulnerability", ["SDG1", "SDG8", "SDG10"], "indirect", "medium", "Requires financial products and credible local investment channels."),
    ]


def cross_country_pathways():
    return [
        pathway("regional_jobs", "cross-country", "Export diversification", "Quality jobs and wage growth", "SDG 8 and 10 progress", ["SDG8", "SDG10"], "indirect", "strong", "Seen most clearly in structural transformation success cases such as Vietnam."),
        pathway("regional_fiscal", "cross-country", "Tax effort and budget credibility", "Public investment quality", "SDG delivery capacity", ["SDG16", "SDG17"], "direct", "strong", "Fiscal capacity amplifies all other SDG pathways."),
        pathway("regional_resilience", "cross-country", "Resilience-sensitive infrastructure", "Shock absorption", "Lower losses and more stable development gains", ["SDG9", "SDG11", "SDG13"], "indirect", "strong", "Countries with stronger resilience systems retain more growth gains."),
        pathway("regional_gender", "cross-country", "Women's economic inclusion", "Labor supply and firm productivity", "Broad-based SDG acceleration", ["SDG5", "SDG8", "SDG10"], "indirect", "strong", "One of the clearest multi-SDG accelerators across regions."),
    ]


def default_policies(country_obj):
    code = country_obj["country_code"]
    return [
        {
            "id": f"{code.lower()}_policy_jobs",
            "country_code": code,
            "policy_name": f"{country_obj['country_name']} jobs and productivity compact",
            "period": "2025-2027",
            "lead_agency": "National Planning Commission and line ministries" if code == "NPL" else "National planning and economic institutions",
            "policy_type": "growth-and-jobs",
            "growth_channels": ["quality jobs", "productivity", "formalization"],
            "direct_sdgs": ["SDG8"],
            "indirect_sdgs": ["SDG5", "SDG10"],
            "implementation_status": "Priority reform track",
            "source_ids": ["npc-nepal", "undp-insights"] if code == "NPL" else ["worldbank", "adb-key"],
        },
        {
            "id": f"{code.lower()}_policy_finance",
            "country_code": code,
            "policy_name": f"{country_obj['country_name']} SDG financing and public investment package",
            "period": "2025-2027",
            "lead_agency": "Finance ministry",
            "policy_type": "fiscal-and-financing",
            "growth_channels": ["fiscal space", "public investment", "crowding-in private capital"],
            "direct_sdgs": ["SDG17"],
            "indirect_sdgs": ["SDG8", "SDG9", "SDG16"],
            "implementation_status": "Active policy agenda",
            "source_ids": ["npc-nepal", "imf-weo"] if code == "NPL" else ["imf-weo", "worldbank"],
        },
    ]


def default_budgets(country_obj):
    code = country_obj["country_code"]
    return [
        {
            "country_code": code,
            "year": 2025,
            "ministry_or_sector": "Transport and connectivity",
            "program_area": "Logistics, roads, and market access",
            "budget_type": "Capital",
            "growth_channels": ["connectivity", "trade", "territorial inclusion"],
            "sdg_links": ["SDG8", "SDG9", "SDG10", "SDG11"],
            "confidence": "Medium",
        },
        {
            "country_code": code,
            "year": 2025,
            "ministry_or_sector": "Education and skills",
            "program_area": "Skills, employability, and inclusion",
            "budget_type": "Recurrent and capital",
            "growth_channels": ["human capital", "quality jobs", "women and youth inclusion"],
            "sdg_links": ["SDG4", "SDG5", "SDG8", "SDG10"],
            "confidence": "Medium",
        },
        {
            "country_code": code,
            "year": 2025,
            "ministry_or_sector": "Climate and local resilience",
            "program_area": "Resilient infrastructure and local risk reduction",
            "budget_type": "Capital",
            "growth_channels": ["resilience", "service continuity", "asset protection"],
            "sdg_links": ["SDG11", "SDG13", "SDG16"],
            "confidence": "Medium",
        },
    ]


def default_accelerators(country_obj):
    code = country_obj["country_code"]
    name = country_obj["country_name"]
    return [
        {
            "id": f"{code.lower()}_accel_jobs",
            "country_code": code,
            "title": "Quality jobs and firm upgrading platform",
            "mechanism": "Links skills, enterprise support, logistics, and sector prioritization to raise productivity and labor absorption.",
            "why_now": f"High relevance because {name} still faces quality-jobs constraints and uneven structural transformation.",
            "prerequisites": ["sector prioritization", "delivery coordination", "private sector engagement"],
            "lead_actors": ["finance ministry", "planning institutions", "private sector", "development partners"],
            "expected_channels": ["jobs", "productivity", "formalization", "fiscal space"],
            "sdg_links": ["SDG8", "SDG9", "SDG10"],
            "risk_flags": ["weak implementation", "fragmented coordination"],
            "source_ids": ["undp-insights", "npc-nepal"] if code == "NPL" else ["worldbank", "undp-insights"],
        },
        {
            "id": f"{code.lower()}_accel_resilience",
            "country_code": code,
            "title": "Resilience-sensitive infrastructure and public finance package",
            "mechanism": "Improves infrastructure and public spending quality so shocks do not erase growth gains.",
            "why_now": f"Important because {name} faces meaningful resilience and implementation pressures.",
            "prerequisites": ["budget discipline", "subnational capacity", "risk-informed planning"],
            "lead_actors": ["line ministries", "local governments", "finance ministry"],
            "expected_channels": ["resilience", "service delivery", "investment quality"],
            "sdg_links": ["SDG9", "SDG11", "SDG13", "SDG16"],
            "risk_flags": ["capital underspending", "maintenance gaps"],
            "source_ids": ["npc-nepal", "undp-diagnostics"] if code == "NPL" else ["worldbank", "adb-key"],
        },
    ]


def build_signals(country_obj):
    p = country_obj["profile"]
    code = country_obj["country_code"]
    jobs_direction = "steady" if p["quality_jobs_index"] >= 55 else "watch" if p["quality_jobs_index"] >= 45 else "warning"
    finance_direction = "steady" if p["tax_gdp"] >= 18 and p["private_capital"] >= 50 else "watch" if p["tax_gdp"] >= 13 else "warning"
    resilience_direction = "steady" if p["disaster_risk"] <= 45 and p["resilience_readiness"] >= 60 else "watch" if p["resilience_readiness"] >= 50 else "warning"
    return [
        {
            "id": f"{code.lower()}_signal_jobs",
            "country_code": code,
            "theme": "jobs",
            "label": "Youth jobs pressure",
            "value": f"{p['youth_unemployment']}% youth unemployment, quality jobs index {p['quality_jobs_index']}",
            "direction": jobs_direction,
            "threshold_note": "Warning if youth unemployment stays high while quality jobs remain weak.",
            "source_ids": ["ilostat", "worldbank"],
            "last_updated": "2025",
            "severity": 2 if jobs_direction == "steady" else 3 if jobs_direction == "watch" else 5,
        },
        {
            "id": f"{code.lower()}_signal_finance",
            "country_code": code,
            "theme": "financing",
            "label": "Fiscal and financing pressure",
            "value": f"Tax/GDP {p['tax_gdp']}%, private capital mobilization {p['private_capital']}",
            "direction": finance_direction,
            "threshold_note": "Warning when low tax effort combines with weak investment mobilization.",
            "source_ids": ["imf-weo", "worldbank"],
            "last_updated": "2025",
            "severity": 2 if finance_direction == "steady" else 3 if finance_direction == "watch" else 5,
        },
        {
            "id": f"{code.lower()}_signal_resilience",
            "country_code": code,
            "theme": "resilience",
            "label": "Climate and implementation pressure",
            "value": f"Risk {p['disaster_risk']}, resilience readiness {p['resilience_readiness']}, implementation capacity {p['implementation_capacity']}",
            "direction": resilience_direction,
            "threshold_note": "Warning when hazard exposure is high and resilience systems are weak.",
            "source_ids": ["worldbank", "undp-diagnostics"],
            "last_updated": "2025",
            "severity": 2 if resilience_direction == "steady" else 3 if resilience_direction == "watch" else 5,
        },
    ]


def extra_nepal_policies():
    return [
        {
            "id": "npl_policy_ldc",
            "country_code": "NPL",
            "policy_name": "Smooth transition and export competitiveness package",
            "period": "2025-2027",
            "lead_agency": "National Planning Commission",
            "policy_type": "LDC transition",
            "growth_channels": ["exports", "firm capability", "transition risk management"],
            "direct_sdgs": ["SDG17"],
            "indirect_sdgs": ["SDG8", "SDG9", "SDG10"],
            "implementation_status": "Transition-critical",
            "source_ids": ["npc-nepal", "undp-insights"],
        },
        {
            "id": "npl_policy_local",
            "country_code": "NPL",
            "policy_name": "Subnational execution and service delivery reform",
            "period": "2025-2027",
            "lead_agency": "Ministry of Federal Affairs and General Administration",
            "policy_type": "implementation",
            "growth_channels": ["budget execution", "local delivery", "territorial inclusion"],
            "direct_sdgs": ["SDG16"],
            "indirect_sdgs": ["SDG3", "SDG4", "SDG6", "SDG10"],
            "implementation_status": "Priority reform track",
            "source_ids": ["npc-nepal", "undp-diagnostics"],
        },
    ]


def extra_nepal_budgets():
    return [
        {
            "country_code": "NPL",
            "year": 2025,
            "ministry_or_sector": "Energy",
            "program_area": "Grid reliability and productive electricity use",
            "budget_type": "Capital",
            "growth_channels": ["industrial power", "firm competitiveness", "clean energy"],
            "sdg_links": ["SDG7", "SDG8", "SDG9", "SDG13"],
            "confidence": "High",
        },
        {
            "country_code": "NPL",
            "year": 2025,
            "ministry_or_sector": "Federal and local development",
            "program_area": "Local capital execution and maintenance",
            "budget_type": "Capital",
            "growth_channels": ["service delivery", "territorial inclusion", "implementation quality"],
            "sdg_links": ["SDG10", "SDG11", "SDG16"],
            "confidence": "High",
        },
    ]


def extra_nepal_accelerators():
    return [
        {
            "id": "npl_accel_women",
            "country_code": "NPL",
            "title": "Women's economic participation accelerator",
            "mechanism": "Combines care support, mobility, finance, and skills so more women move into productive work.",
            "why_now": "Nepal's SDG acceleration case is weakened when growth does not translate into stronger female labor participation.",
            "prerequisites": ["care economy support", "safe transport", "credit access", "provincial tailoring"],
            "lead_actors": ["labor ministry", "private sector", "local governments", "development partners"],
            "expected_channels": ["female employment", "household incomes", "inclusive growth"],
            "sdg_links": ["SDG5", "SDG8", "SDG10"],
            "risk_flags": ["fragmented design", "weak local implementation"],
            "source_ids": ["npc-nepal", "ilostat", "undp-insights"],
        },
        {
            "id": "npl_accel_hydro",
            "country_code": "NPL",
            "title": "Hydropower-to-productivity conversion platform",
            "mechanism": "Moves beyond generation alone by connecting reliable electricity to firms, logistics, and local productive use.",
            "why_now": "Nepal's energy story becomes transformational only when it feeds productive jobs and exports.",
            "prerequisites": ["grid quality", "industrial policy", "investment coordination"],
            "lead_actors": ["energy ministry", "planning institutions", "private sector"],
            "expected_channels": ["productivity", "jobs", "exports", "fiscal space"],
            "sdg_links": ["SDG7", "SDG8", "SDG9", "SDG13"],
            "risk_flags": ["weak downstream industrial linkages", "grid bottlenecks"],
            "source_ids": ["npc-nepal", "worldbank"],
        },
    ]


def write(file_name, payload):
    (DATA_DIR / file_name).write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


SITE_META = {
    "title": "Economic Growth for SDG Acceleration",
    "version": "0.1.0",
    "built_on": "2026-04-01",
    "default_country": "NPL",
    "comparison_indicator_ids": ["sdg_index", "gdp_growth", "quality_jobs_index", "tax_gdp", "resilience_readiness", "implementation_capacity"],
    "method_note": "This v1 platform uses curated country snapshots from public sources and structured policy mappings. It is designed for analytical orientation and decision support, not live statistical reporting.",
}

SOURCES = [
    {"id": "sdsn2025", "label": "Sustainable Development Report 2025 country profiles", "url": "https://dashboards.sdgindex.org/", "quality": "high", "coverage": "SDG performance and dashboard context", "last_updated": "2025"},
    {"id": "worldbank", "label": "World Bank World Development Indicators", "url": "https://databank.worldbank.org/source/world-development-indicators", "quality": "high", "coverage": "Macro, jobs, infrastructure, and social indicators", "last_updated": "2025"},
    {"id": "ilostat", "label": "ILOSTAT", "url": "https://ilostat.ilo.org/data/", "quality": "high", "coverage": "Labor market and informality indicators", "last_updated": "2025"},
    {"id": "undp-insights", "label": "UNDP Integrated SDG Insights", "url": "https://sdgpush-insights.undp.org/", "quality": "high", "coverage": "Country interlinkages and accelerators", "last_updated": "2025"},
    {"id": "undp-diagnostics", "label": "UNDP SDG Diagnostics", "url": "https://sdgdiagnostics.data.undp.org/", "quality": "high", "coverage": "Trend diagnostics and country SDG context", "last_updated": "2025"},
    {"id": "npc-nepal", "label": "National Planning Commission Nepal SDG and policy documents", "url": "https://www.npc.gov.np/", "quality": "high", "coverage": "Nepal SDG roadmaps, plans, financing, and transition framing", "last_updated": "2025"},
    {"id": "adb-key", "label": "ADB Key Indicators", "url": "https://www.adb.org/publications/key-indicators-asia-and-pacific-2024", "quality": "medium", "coverage": "Regional comparison benchmarks", "last_updated": "2024"},
    {"id": "imf-weo", "label": "IMF World Economic Outlook", "url": "https://www.imf.org/en/Publications/WEO", "quality": "medium", "coverage": "Growth, fiscal, and macro context", "last_updated": "2025"},
]

COUNTRIES = [
    country("NPL", "Nepal", "South Asia", "Lower middle income", "default", True, "VNM", "BGD", "Hydropower, services, remittances, and unfinished structural transformation define Nepal's growth story.", "Fiscal space is workable but tight; the challenge is turning public spending and private capital into SDG-aligned investment quality.", "LDC graduation raises urgency around exports, jobs, resilience, and smooth transition planning.", 68.6, 4.5, 5.6, 41, 19.8, 83, 38, 29, 62, 48, 71, 36, 44, 21.2, 5.8, 39, 78, 61, 46, 42, 74, 55),
    country("BGD", "Bangladesh", "South Asia", "Lower middle income", "structural", False, "VNM", "NPL", "Export manufacturing depth and social progress are key strengths, with competitiveness and climate risks growing.", "Public investment and export-led growth have mattered, though tax effort and financial depth remain uneven.", "Transition management depends on sustaining export dynamism and resilience.", 65.9, 5.3, 17.4, 63, 12.7, 72, 46, 36, 54, 53, 59, 41, 52, 9.2, 6.4, 44, 82, 17, 58, 51, 81, 58),
    country("BTN", "Bhutan", "South Asia", "Lower middle income", "resilience peer", False, "VNM", "NPL", "Bhutan's model is shaped by hydropower, public investment, and environmental stewardship.", "Power-sector concentration and partnership finance create both opportunity and risk.", "Diversification and quality employment remain core transition issues.", 70.3, 4.2, 6.3, 47, 16.1, 67, 43, 52, 41, 57, 46, 20, 58, 15.8, 11.1, 34, 55, 93, 61, 56, 82, 59),
    country("IND", "India", "South Asia", "Lower middle income", "regional anchor", False, "VNM", "IDN", "India combines scale, services, manufacturing ambition, and digital public infrastructure.", "A broader tax base supports larger investment ambition, but federal delivery quality still matters.", "Structural transformation continues, but jobs quality and territorial divergence constrain inclusion.", 63.8, 6.4, 13.1, 58, 17.1, 77, 49, 32, 67, 50, 39, 9, 61, 18.0, 6.1, 57, 66, 29, 54, 57, 79, 63),
    country("MDV", "Maldives", "South Asia", "Upper middle income", "tourism peer", False, "THA", "LKA", "Tourism dependence generates income but also concentration and climate exposure.", "Public finance is sensitive to tourism cycles, debt dynamics, and infrastructure commitments.", "Climate resilience and diversification are central to sustaining gains.", 70.1, 5.6, 4.2, 45, 10.2, 48, 56, 44, 38, 60, 43, 5, 62, 15.3, 9.5, 52, 84, 12, 57, 59, 80, 61),
    country("PAK", "Pakistan", "South Asia", "Lower middle income", "structural", False, "VNM", "NPL", "Large productive potential is constrained by macro instability and weak structural transformation.", "Fiscal and external constraints sharply affect investment quality and SDG delivery consistency.", "The challenge is turning stabilization into durable inclusive growth.", 57.0, 2.7, 12.0, 42, 16.4, 73, 35, 24, 69, 39, 75, 18, 37, 9.8, 3.5, 29, 79, 21, 38, 33, 65, 47),
    country("LKA", "Sri Lanka", "South Asia", "Lower middle income", "transition-sensitive", False, "THA", "MDV", "Human-development strengths coexist with debt stress and uneven recovery.", "Fiscal consolidation shapes room for SDG-supporting investment.", "Recovery quality, exports, and governance credibility matter most.", 69.2, 3.1, 15.2, 56, 20.1, 64, 51, 34, 45, 58, 63, 12, 54, 11.5, 4.1, 41, 61, 38, 55, 48, 72, 67),
    country("IDN", "Indonesia", "Southeast Asia", "Upper middle income", "structural", False, "VNM", "IND", "Indonesia mixes commodity strengths, industrial ambition, and domestic market scale.", "Fiscal and investment frameworks are stronger than many peers, though coordination remains critical.", "The challenge is deepening diversification without widening inequality.", 69.5, 5.0, 19.0, 61, 13.2, 59, 54, 54, 57, 56, 36, 7, 64, 11.9, 4.8, 55, 71, 19, 57, 59, 84, 68),
    country("VNM", "Vietnam", "Southeast Asia", "Lower middle income", "aspirational", False, "THA", "BGD", "Vietnam's story is built on export manufacturing, productivity gains, and sustained coordination.", "Public direction and private investment work together more effectively than in many peers.", "The next challenge is moving toward innovation and greener upgrading.", 73.1, 6.2, 24.6, 78, 7.9, 52, 67, 69, 36, 67, 24, 11, 74, 18.5, 5.9, 68, 63, 27, 66, 68, 87, 73),
    country("PHL", "Philippines", "Southeast Asia", "Lower middle income", "labor-market peer", False, "VNM", "LKA", "Services-led growth and remittances support dynamism, but productivity and resilience challenges remain.", "Tax reform and infrastructure ambition improved the toolkit, though execution matters.", "Future acceleration depends on productivity, jobs quality, and climate-smart delivery.", 68.9, 5.7, 17.8, 54, 10.5, 63, 49, 47, 58, 54, 34, 9, 58, 14.1, 5.2, 50, 80, 24, 53, 50, 77, 66),
    country("THA", "Thailand", "Southeast Asia", "Upper middle income", "aspirational", False, "VNM", "IDN", "Thailand offers a mature transformation model, though aging and productivity drift matter.", "Fiscal and industrial-policy capacity are stronger than many peers.", "The question is how to sustain innovation and inclusion.", 74.7, 3.4, 26.9, 72, 5.8, 44, 70, 60, 34, 72, 20, 4, 76, 16.4, 6.3, 63, 57, 23, 70, 71, 89, 74),
    country("KHM", "Cambodia", "Southeast Asia", "Lower middle income", "transition-sensitive", False, "VNM", "BGD", "Cambodia grew rapidly through garments and construction, but diversification and resilience remain unfinished.", "External demand, FDI, and public investment have mattered, but shock exposure is still high.", "The growth model must diversify to sustain jobs and SDG progress.", 67.1, 5.1, 15.3, 60, 6.9, 70, 44, 72, 52, 50, 47, 28, 49, 18.2, 7.1, 46, 59, 31, 48, 49, 80, 56),
    country("LAO", "Lao PDR", "Southeast Asia", "Lower middle income", "structural", False, "VNM", "NPL", "Energy and capital-intensive growth delivered less jobs broadening than expected.", "Debt and concentrated sectors shape the development-finance challenge.", "The issue is turning investment into productivity and employment.", 64.3, 4.1, 7.3, 43, 8.6, 76, 36, 61, 60, 44, 62, 22, 41, 12.1, 7.6, 31, 58, 69, 42, 38, 68, 49),
    country("RWA", "Rwanda", "Additional peers", "Lower middle income", "aspirational", False, "VNM", "NPL", "Rwanda is an implementation and coordination peer with a still-narrow productive base.", "Public investment discipline matters strongly, though external dependence remains important.", "The challenge is broadening productive employment while sustaining delivery quality.", 67.5, 7.1, 10.2, 46, 17.2, 76, 45, 55, 39, 61, 48, 17, 63, 16.9, 9.4, 40, 49, 52, 63, 71, 88, 67),
    country("ETH", "Ethiopia", "Additional peers", "Low income", "structural", False, "RWA", "NPL", "Large-scale structural transformation efforts are complicated by macro and political stress.", "Public investment ambition has been high, but external constraints remain binding.", "Growth quality depends on stability, exports, and a resilient private sector base.", 58.2, 6.1, 6.8, 36, 8.3, 83, 33, 77, 65, 42, 68, 31, 35, 8.1, 11.2, 24, 69, 91, 39, 35, 63, 46),
    country("KEN", "Kenya", "Additional peers", "Lower middle income", "innovation peer", False, "RWA", "PHL", "Kenya combines services and entrepreneurship strengths with uneven inclusion and resilience.", "Domestic revenue and capital mobilization are stronger than many peers, but fiscal pressure still matters.", "The next step is deeper productive jobs and lower climate vulnerability.", 63.4, 5.0, 8.1, 44, 13.5, 79, 41, 63, 53, 49, 54, 16, 47, 14.0, 6.5, 47, 61, 73, 51, 46, 75, 60),
    country("MAR", "Morocco", "Additional peers", "Lower middle income", "structural", False, "THA", "LKA", "Morocco is a useful industrial and logistics upgrading comparator.", "Public investment and industrial coordination have supported logistics and manufacturing.", "The challenge is widening inclusion while sustaining competitiveness.", 70.4, 3.5, 16.9, 66, 22.1, 67, 50, 21, 50, 57, 29, 8, 64, 21.4, 6.0, 51, 46, 38, 65, 58, 84, 65),
    country("MNG", "Mongolia", "Additional peers", "Lower middle income", "resource peer", False, "THA", "MDV", "Mongolia shows that income gains alone do not solve diversification and resilience problems.", "Commodity-linked revenues shape both opportunity and volatility.", "Diversification and local resilience remain central despite higher income.", 68.1, 5.4, 9.1, 52, 11.3, 56, 52, 54, 59, 55, 41, 6, 57, 24.1, 7.4, 45, 44, 23, 52, 52, 79, 64),
    country("GEO", "Georgia", "Additional peers", "Upper middle income", "governance peer", False, "THA", "LKA", "Georgia is a governance and business-environment peer with limited scale but strong state effectiveness.", "Reforms improved public-sector effectiveness and investment climate credibility.", "The lesson is how governance quality can amplify limited resources.", 72.2, 5.5, 11.2, 62, 15.7, 43, 60, 57, 33, 68, 22, 3, 72, 22.0, 6.2, 58, 32, 32, 69, 73, 91, 76),
]

COMPARATORS = {
    "default_country": "NPL",
    "country_groups": [
        {"id": "south_asia_core", "label": "South Asia core", "country_codes": ["NPL", "BGD", "BTN", "IND", "MDV", "PAK", "LKA"]},
        {"id": "southeast_asia_benchmark", "label": "Southeast Asia benchmark set", "country_codes": ["IDN", "VNM", "PHL", "THA", "KHM", "LAO"]},
        {"id": "additional_peers", "label": "Additional comparator peers", "country_codes": ["RWA", "ETH", "KEN", "MAR", "MNG", "GEO"]},
    ],
}

LENSES = [
    {"id": "macro_productivity", "title": "Macroeconomic structure, productivity, and diversification", "summary": "Track whether the growth model is moving toward more productive sectors, deeper export capability, and stronger value creation.", "indicator_ids": ["sdg_index", "gdp_growth", "manufacturing_share", "export_readiness"]},
    {"id": "jobs_quality", "title": "Employment, informality, and quality jobs", "summary": "Focus on whether growth is translating into better jobs, lower informality, and stronger labor-market absorption.", "indicator_ids": ["youth_unemployment", "informality", "quality_jobs_index"]},
    {"id": "gender_lnob", "title": "Gender, LNOB, and territorial inequality", "summary": "Assess whether progress reaches women, lagging geographies, and groups at risk of being left behind.", "indicator_ids": ["female_lfp", "territorial_gap", "inclusion_readiness"]},
    {"id": "ldc_transition", "title": "LDC graduation and smooth transition risk", "summary": "Measure the exposure and readiness of countries that must sustain momentum after preference changes and transition pressures.", "indicator_ids": ["transition_risk", "preference_exposure", "readiness_index"]},
    {"id": "financing_fiscal", "title": "SDG financing, fiscal space, and private capital", "summary": "Look at how public finance and private capital combine to support SDG-aligned investment and implementation.", "indicator_ids": ["tax_gdp", "public_investment", "private_capital"]},
    {"id": "climate_resilience", "title": "Climate, disaster risk, and resilience", "summary": "Track whether countries can translate growth into resilience rather than letting repeated shocks erase gains.", "indicator_ids": ["disaster_risk", "clean_energy", "resilience_readiness"]},
    {"id": "governance_capacity", "title": "Governance, coordination, and implementation capacity", "summary": "Follow the systems that turn plans and budgets into results: execution, coordination, and data capability.", "indicator_ids": ["implementation_capacity", "budget_execution", "data_readiness"]},
]

TOOLKIT = [
    {"id": "cca", "title": "CCA", "role": "UN system diagnostic", "what_it_does": "Pulls together development risks, inequalities, bottlenecks, and emerging pressures into one country analysis base.", "when_to_use": "Use when deciding which constraints matter most before programming or policy sequencing."},
    {"id": "unsdcf", "title": "UNSDCF", "role": "Strategic cooperation framework", "what_it_does": "Translates country analysis into shared UN priorities, results, and coordination structures.", "when_to_use": "Use when connecting evidence to UN programming and results groups."},
    {"id": "inff", "title": "INFF", "role": "SDG financing framework", "what_it_does": "Links development priorities to financing sources, sequencing, governance, and monitoring.", "when_to_use": "Use when policy priorities are credible but financing pathways remain fragmented."},
    {"id": "dfa", "title": "DFA", "role": "Finance diagnostic", "what_it_does": "Maps finance flows, bottlenecks, and gaps to support financing choices.", "when_to_use": "Use when the financing picture is unclear or fragmented."},
    {"id": "growth_diagnostics", "title": "Growth diagnostics", "role": "Prioritization tool", "what_it_does": "Identifies the most binding constraints to growth and transformation.", "when_to_use": "Use when long lists of problems need to become a realistic sequence."},
    {"id": "cge", "title": "CGE", "role": "Scenario model", "what_it_does": "Tests economy-wide effects of shocks and policy changes across sectors and agents.", "when_to_use": "Use after the strategic question is clear and a scenario lens is needed."},
    {"id": "sam", "title": "SAM", "role": "Data architecture", "what_it_does": "Provides the accounting backbone for economy-wide scenario work.", "when_to_use": "Use when linking macro choices to sectoral and household effects."},
    {"id": "survey_analytics", "title": "Survey analytics", "role": "Applied evidence tool", "what_it_does": "Turns household, firm, labor, or perception surveys into practical policy insights.", "when_to_use": "Use when grounded evidence on behavior or constraints is needed."},
    {"id": "disaggregation", "title": "Data disaggregation", "role": "LNOB lens", "what_it_does": "Shows who and where is being left behind beyond national averages.", "when_to_use": "Use whenever a national trend risks hiding exclusion."},
    {"id": "early_warning", "title": "Early-warning indicators", "role": "Risk-monitoring tool", "what_it_does": "Flags when shocks or implementation failures may derail SDG delivery.", "when_to_use": "Use when country teams need timely risk signals rather than retrospective diagnosis."},
]

INDICATOR_DEFS = [
    ("sdg_index", "SDG index", "0-100", "macro_productivity"),
    ("gdp_growth", "GDP growth", "%", "macro_productivity"),
    ("manufacturing_share", "Manufacturing share of GDP", "% of GDP", "macro_productivity"),
    ("export_readiness", "Export readiness index", "0-100", "macro_productivity"),
    ("youth_unemployment", "Youth unemployment", "%", "jobs_quality"),
    ("informality", "Informal employment", "% of employment", "jobs_quality"),
    ("quality_jobs_index", "Quality jobs index", "0-100", "jobs_quality"),
    ("female_lfp", "Female labor force participation", "%", "gender_lnob"),
    ("territorial_gap", "Territorial inequality gap", "0-100", "gender_lnob"),
    ("inclusion_readiness", "Inclusive delivery readiness", "0-100", "gender_lnob"),
    ("transition_risk", "LDC transition risk", "0-100 risk", "ldc_transition"),
    ("preference_exposure", "Trade preference exposure", "% of exports", "ldc_transition"),
    ("readiness_index", "Transition readiness index", "0-100", "ldc_transition"),
    ("tax_gdp", "Tax to GDP", "%", "financing_fiscal"),
    ("public_investment", "Public investment", "% of GDP", "financing_fiscal"),
    ("private_capital", "Private capital mobilization index", "0-100", "financing_fiscal"),
    ("disaster_risk", "Disaster and climate risk", "0-100 risk", "climate_resilience"),
    ("clean_energy", "Clean energy share", "%", "climate_resilience"),
    ("resilience_readiness", "Resilience readiness", "0-100", "climate_resilience"),
    ("implementation_capacity", "Implementation capacity", "0-100", "governance_capacity"),
    ("budget_execution", "Capital budget execution", "%", "governance_capacity"),
    ("data_readiness", "Data readiness", "0-100", "governance_capacity"),
]


def main():
    indicators = []
    for c in COUNTRIES:
        for indicator_id, label, unit, lens in INDICATOR_DEFS:
            indicators.append({
                "id": indicator_id,
                "country_code": c["country_code"],
                "year": 2025,
                "lens": lens,
                "label": label,
                "value": c["profile"][indicator_id],
                "unit": unit,
                "trend": trend_label(indicator_id, c["profile"][indicator_id]),
                "sdg_links": sdg_links(indicator_id),
                "source_ids": source_ids(indicator_id, c["country_code"]),
                "note": "Curated Nepal-centered analytical snapshot." if c["country_code"] == "NPL" else "Curated comparator snapshot for cross-country perspective.",
            })

    pathways = nepal_pathways() + cross_country_pathways()
    policies = [item for c in COUNTRIES for item in default_policies(c)] + extra_nepal_policies()
    budget_map = [item for c in COUNTRIES for item in default_budgets(c)] + extra_nepal_budgets()
    accelerators = [item for c in COUNTRIES for item in default_accelerators(c)] + extra_nepal_accelerators()
    signals = [item for c in COUNTRIES for item in build_signals(c)]

    write("site_meta.json", SITE_META)
    write("sources.json", SOURCES)
    write("countries.json", COUNTRIES)
    write("comparators.json", COMPARATORS)
    write("lenses.json", LENSES)
    write("toolkit.json", TOOLKIT)
    write("indicators.json", indicators)
    write("pathways.json", pathways)
    write("policies.json", policies)
    write("budget_map.json", budget_map)
    write("accelerators.json", accelerators)
    write("signals.json", signals)


if __name__ == "__main__":
    main()
