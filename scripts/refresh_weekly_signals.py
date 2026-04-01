from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote_plus
from urllib.request import Request, urlopen
from xml.etree import ElementTree

from build_seed_data import (
    COMPARATORS,
    COUNTRIES,
    DATA_DIR,
    ESCAP_METHOD_URL,
    SDSN_NEPAL_PROFILE_URL,
    build_external_scores,
    build_trajectory,
    pulse_drivers_for_country,
    pulse_for_country,
)


ROOT = Path(__file__).resolve().parents[1]
NEWS_PATH = DATA_DIR / "news_signals.json"
SITE_META_PATH = DATA_DIR / "site_meta.json"
INDICATORS_PATH = DATA_DIR / "indicators.json"
PULSE_HISTORY_PATH = DATA_DIR / "pulse_history.json"
TRAJECTORY_PATH = DATA_DIR / "trajectory_2030.json"
EXTERNAL_SCORES_PATH = DATA_DIR / "external_scores.json"

QUERY_COUNTRIES = {
    "NPL": "Nepal economy jobs exports budget hydropower women",
    "BGD": "Bangladesh economy exports jobs women climate",
    "IND": "India economy manufacturing jobs inflation exports",
    "VNM": "Vietnam economy exports manufacturing jobs",
    "IDN": "Indonesia economy fiscal jobs resilience",
    "THA": "Thailand economy industry tourism jobs",
}

CHANNEL_RULES = {
    "industry": {
        "keywords": ["industry", "manufacturing", "factory", "industrial", "firm", "enterprise"],
        "indicators": ["manufacturing_share", "export_readiness", "quality_jobs_index"],
    },
    "jobs": {
        "keywords": ["jobs", "employment", "hiring", "labour", "labor", "wages", "workers", "skills"],
        "indicators": ["quality_jobs_index", "youth_unemployment", "informality"],
    },
    "gender": {
        "keywords": ["women", "female", "gender", "girls", "care economy", "entrepreneurship"],
        "indicators": ["female_lfp", "inclusion_readiness", "quality_jobs_index"],
    },
    "trade": {
        "keywords": ["trade", "exports", "logistics", "shipping", "border", "competitiveness"],
        "indicators": ["export_readiness", "readiness_index", "transition_risk"],
    },
    "fiscal space": {
        "keywords": ["budget", "fiscal", "revenue", "tax", "debt", "investment", "procurement"],
        "indicators": ["tax_gdp", "public_investment", "budget_execution"],
    },
    "resilience": {
        "keywords": ["flood", "climate", "disaster", "resilience", "storm", "landslide", "energy", "power"],
        "indicators": ["disaster_risk", "resilience_readiness", "clean_energy"],
    },
    "implementation": {
        "keywords": ["implementation", "delivery", "governance", "coordination", "service", "local government", "digital"],
        "indicators": ["implementation_capacity", "budget_execution", "data_readiness"],
    },
}

POSITIVE_WORDS = {
    "boost",
    "improve",
    "improved",
    "increase",
    "expands",
    "growth",
    "strong",
    "surge",
    "recovery",
    "accelerate",
    "record",
    "support",
}
NEGATIVE_WORDS = {
    "fall",
    "drop",
    "crisis",
    "decline",
    "risk",
    "weak",
    "shock",
    "disruption",
    "flood",
    "delay",
    "shortfall",
    "cut",
}


def fetch_google_news(query: str) -> list[dict]:
    url = f"https://news.google.com/rss/search?q={quote_plus(query)}&hl=en-US&gl=US&ceid=US:en"
    request = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(request, timeout=20) as response:
        payload = response.read()

    root = ElementTree.fromstring(payload)
    items = []
    for item in root.findall("./channel/item")[:4]:
        source_node = item.find("source")
        items.append(
            {
                "title": (item.findtext("title") or "").strip(),
                "link": (item.findtext("link") or "").strip(),
                "source": (source_node.text or "Google News").strip() if source_node is not None else "Google News",
            }
        )
    return items


def classify_channels(text: str) -> tuple[list[str], list[str]]:
    lowered = text.lower()
    channels = []
    indicator_ids = []
    for channel, rule in CHANNEL_RULES.items():
        if any(keyword in lowered for keyword in rule["keywords"]):
            channels.append(channel)
            indicator_ids.extend(rule["indicators"])

    if not channels:
        channels = ["industry", "jobs"]
        indicator_ids.extend(["quality_jobs_index", "export_readiness"])

    return channels, list(dict.fromkeys(indicator_ids))


def classify_direction(text: str) -> str:
    lowered = text.lower()
    positive_hits = sum(word in lowered for word in POSITIVE_WORDS)
    negative_hits = sum(word in lowered for word in NEGATIVE_WORDS)
    if positive_hits > negative_hits:
        return "positive"
    if negative_hits > positive_hits:
        return "negative"
    return "watch"


def impact_score(text: str, channels: list[str]) -> float:
    lowered = text.lower()
    positive_hits = sum(word in lowered for word in POSITIVE_WORDS)
    negative_hits = sum(word in lowered for word in NEGATIVE_WORDS)
    return round(min(9.2, 5.6 + len(channels) * 0.55 + positive_hits * 0.2 + negative_hits * 0.25), 1)


def build_headline_entry(country_code: str, headline: dict, rank: int, today: str) -> dict:
    channels, indicator_ids = classify_channels(headline["title"])
    direction = classify_direction(headline["title"])
    return {
        "id": f"{country_code.lower()}_auto_{today.replace('-', '')}_{rank}",
        "country_code": country_code,
        "date": today,
        "headline": headline["title"],
        "summary": "Automatically refreshed headline tagged into policy channels and linked indicators for twice-weekly momentum monitoring.",
        "channels": channels,
        "linked_indicator_ids": indicator_ids,
        "direction": direction,
        "impact_score": impact_score(headline["title"], channels),
        "source_label": headline["source"],
        "source_url": headline["link"],
    }


def load_json(path: Path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def default_benchmark_group(country_obj):
    if country_obj["region_group"] == "South Asia":
        return "south_asia_core"
    if country_obj["region_group"] == "Southeast Asia":
        return "southeast_asia_benchmark"
    return "additional_peers"


def refresh_pulse_history(today: str, indicators, comparator_map, existing_history):
    seen = {(item["country_code"], item["timestamp"][:10]) for item in existing_history}
    refreshed = list(existing_history)
    current_time = f"{today}T08:00:00+05:45"

    for country_obj in COUNTRIES:
        key = (country_obj["country_code"], today)
        if key in seen:
            continue

        history_for_country = [item for item in refreshed if item["country_code"] == country_obj["country_code"]]
        previous = history_for_country[-1] if history_for_country else None
        pulse = pulse_for_country(indicators, comparator_map, country_obj["country_code"], default_benchmark_group(country_obj))
        drivers = pulse_drivers_for_country(country_obj, indicators, comparator_map)
        score = round(pulse["score"], 1)
        refreshed.append(
            {
                "timestamp": current_time,
                "country_code": country_obj["country_code"],
                "benchmark_group": default_benchmark_group(country_obj),
                "pulse_score": score,
                "delta_since_last": None if previous is None else round(score - previous["pulse_score"], 1),
                "channel_scores": {item["id"]: round(item["score"], 1) for item in pulse["channels"]},
                "top_positive_drivers": [item["label"] for item in drivers if item["effect"] > 0][:2],
                "top_negative_drivers": [item["label"] for item in drivers if item["effect"] < 0][:2],
                "confidence": "Medium" if country_obj["country_code"] == "NPL" else "Medium-low",
                "notes": "Automated twice-weekly pulse update based on the platform's internal benchmark-relative nowcast.",
            }
        )

    return refreshed


def main() -> None:
    today = datetime.now(timezone.utc).date().isoformat()
    current_news = load_json(NEWS_PATH, [])
    static_fallbacks = {}
    for item in current_news:
        static_fallbacks.setdefault(item["country_code"], []).append(item)

    refreshed_news = []
    for country_code, query in QUERY_COUNTRIES.items():
        try:
            headlines = fetch_google_news(query)
        except Exception:
            headlines = []

        if headlines:
            refreshed_news.extend(build_headline_entry(country_code, headline, idx, today) for idx, headline in enumerate(headlines, start=1))
        else:
            refreshed_news.extend(static_fallbacks.get(country_code, []))

    untouched_codes = {item["country_code"] for item in current_news} - set(QUERY_COUNTRIES.keys())
    for code in untouched_codes:
        refreshed_news.extend(static_fallbacks.get(code, []))

    NEWS_PATH.write_text(json.dumps(refreshed_news, indent=2) + "\n", encoding="utf-8")

    indicators = load_json(INDICATORS_PATH, [])
    comparator_map = {item["id"]: item for item in COMPARATORS["country_groups"]}
    current_history = load_json(PULSE_HISTORY_PATH, [])
    refreshed_history = refresh_pulse_history(today, indicators, comparator_map, current_history)
    PULSE_HISTORY_PATH.write_text(json.dumps(refreshed_history, indent=2) + "\n", encoding="utf-8")

    external_scores = load_json(EXTERNAL_SCORES_PATH, build_external_scores(COUNTRIES))
    TRAJECTORY_PATH.write_text(json.dumps(build_trajectory(COUNTRIES, indicators, comparator_map, external_scores, refreshed_history), indent=2) + "\n", encoding="utf-8")

    site_meta = load_json(SITE_META_PATH, {})
    site_meta["weekly_refreshed_on"] = today
    site_meta["weekly_refresh_note"] = (
        f"Automated twice-weekly refresh last ran on {today}. Headlines and the internal pulse are heuristically updated every Tuesday and Friday against channels such as jobs, gender, industry, trade, resilience, and fiscal space."
    )
    site_meta["official_anchor_note"] = (
        "Source-verified annual anchors remain separate from the platform's live pulse. SDSN, NPC, ESCAP, and the platform pulse are different score families and should not be read as the same metric."
    )
    site_meta.setdefault("external_links", {})
    site_meta["external_links"].update(
        {
            "github_repo": "https://github.com/nirnayabhatta-lab/economic-growth-for-sdg-acceleration",
            "github_docs": "https://github.com/nirnayabhatta-lab/economic-growth-for-sdg-acceleration/tree/main/docs",
            "linkedin": "https://www.linkedin.com/in/nirnayabhatta/",
        }
    )
    SITE_META_PATH.write_text(json.dumps(site_meta, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
