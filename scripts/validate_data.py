from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"

REQUIRED_FILES = [
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
    "news_signals.json",
    "toolkit.json",
]

SCHEMAS = {
    "countries": ["country_code", "country_name", "region_group", "income_group", "peer_type", "is_default"],
    "indicators": ["id", "country_code", "year", "lens", "label", "value", "unit", "trend", "sdg_links", "source_ids", "note"],
    "pathways": ["id", "country_scope", "driver", "channel", "outcome", "sdg_links", "directness", "evidence_strength", "policy_relevance"],
    "policies": ["id", "country_code", "policy_name", "period", "lead_agency", "policy_type", "growth_channels", "direct_sdgs", "indirect_sdgs", "implementation_status", "source_ids"],
    "budget_map": ["country_code", "year", "ministry_or_sector", "program_area", "budget_type", "growth_channels", "sdg_links", "confidence"],
    "accelerators": ["id", "country_code", "title", "mechanism", "why_now", "prerequisites", "lead_actors", "expected_channels", "sdg_links", "risk_flags", "source_ids"],
    "signals": ["id", "country_code", "theme", "label", "value", "direction", "threshold_note", "source_ids", "last_updated"],
    "news_signals": ["id", "country_code", "date", "headline", "summary", "channels", "linked_indicator_ids", "direction", "impact_score", "source_label", "source_url"],
    "lenses": ["id", "title", "summary", "indicator_ids"],
    "toolkit": ["id", "title", "role", "what_it_does", "when_to_use"],
}


def main():
    for file_name in REQUIRED_FILES:
        path = DATA_DIR / file_name
        if not path.exists():
            raise SystemExit(f"Missing required file: {file_name}")

    sources = load("sources.json")
    countries = load("countries.json")
    indicators = load("indicators.json")
    pathways = load("pathways.json")
    policies = load("policies.json")
    budget_map = load("budget_map.json")
    accelerators = load("accelerators.json")
    signals = load("signals.json")
    news_signals = load("news_signals.json")
    lenses = load("lenses.json")
    toolkit = load("toolkit.json")
    comparators = load("comparators.json")

    assert_shape("countries", countries, SCHEMAS["countries"])
    assert_shape("indicators", indicators, SCHEMAS["indicators"])
    assert_shape("pathways", pathways, SCHEMAS["pathways"])
    assert_shape("policies", policies, SCHEMAS["policies"])
    assert_shape("budget_map", budget_map, SCHEMAS["budget_map"])
    assert_shape("accelerators", accelerators, SCHEMAS["accelerators"])
    assert_shape("signals", signals, SCHEMAS["signals"])
    assert_shape("news_signals", news_signals, SCHEMAS["news_signals"])
    assert_shape("lenses", lenses, SCHEMAS["lenses"])
    assert_shape("toolkit", toolkit, SCHEMAS["toolkit"])

    country_codes = {country["country_code"] for country in countries}
    source_ids = {source["id"] for source in sources}
    lens_ids = {lens["id"] for lens in lenses}
    indicator_ids = {indicator["id"] for indicator in indicators}

    if comparators["default_country"] not in country_codes:
        raise SystemExit("comparators.json default_country must point to a valid country")

    for item in indicators:
        if item["country_code"] not in country_codes:
            raise SystemExit(f"Invalid country code in indicators: {item['country_code']}")
        if item["lens"] not in lens_ids:
            raise SystemExit(f"Invalid lens in indicators: {item['lens']}")
        assert_source_ids(item["source_ids"], source_ids, f"indicator {item['id']}/{item['country_code']}")

    for collection_name, collection in [("policies", policies), ("accelerators", accelerators), ("signals", signals)]:
        for item in collection:
            if item["country_code"] not in country_codes:
                raise SystemExit(f"Invalid country code in {collection_name}: {item['country_code']}")
            assert_source_ids(item["source_ids"], source_ids, item.get("id", item.get("label", collection_name)))

    for item in news_signals:
        if item["country_code"] not in country_codes:
            raise SystemExit(f"Invalid country code in news_signals: {item['country_code']}")
        for indicator_id in item["linked_indicator_ids"]:
            if indicator_id not in indicator_ids:
                raise SystemExit(f"Unknown linked indicator {indicator_id} in news signal {item['id']}")

    for pathway in pathways:
        if pathway["country_scope"] != "cross-country" and pathway["country_scope"] not in country_codes:
            raise SystemExit(f"Invalid pathway country_scope: {pathway['country_scope']}")

    for group in comparators["country_groups"]:
        for code in group["country_codes"]:
            if code not in country_codes:
                raise SystemExit(f"Invalid comparator country code {code} in group {group['id']}")

    print("Data validation passed.")


def load(file_name):
    return json.loads((DATA_DIR / file_name).read_text(encoding="utf-8"))


def assert_shape(name, collection, fields):
    if not isinstance(collection, list):
        raise SystemExit(f"{name} must be an array")
    for idx, item in enumerate(collection):
        for field in fields:
            if field not in item:
                raise SystemExit(f"{name}[{idx}] missing required field {field}")


def assert_source_ids(ids, source_ids, context):
    for source_id in ids:
        if source_id not in source_ids:
            raise SystemExit(f"Unknown source id {source_id} in {context}")


if __name__ == "__main__":
    main()
