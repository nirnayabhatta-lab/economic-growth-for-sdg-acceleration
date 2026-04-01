from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote_plus
from urllib.request import Request, urlopen
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
NEWS_PATH = DATA_DIR / "news_signals.json"
SITE_META_PATH = DATA_DIR / "site_meta.json"

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
        "summary": "Automatically refreshed headline tagged into policy channels and linked indicators for weekly momentum monitoring.",
        "channels": channels,
        "linked_indicator_ids": indicator_ids,
        "direction": direction,
        "impact_score": impact_score(headline["title"], channels),
        "source_label": headline["source"],
        "source_url": headline["link"],
    }


def main() -> None:
    today = datetime.now(timezone.utc).date().isoformat()
    current_news = json.loads(NEWS_PATH.read_text(encoding="utf-8"))
    static_fallbacks = {}
    for item in current_news:
        static_fallbacks.setdefault(item["country_code"], []).append(item)

    refreshed = []
    for country_code, query in QUERY_COUNTRIES.items():
        try:
            headlines = fetch_google_news(query)
        except Exception:
            headlines = []

        if headlines:
            refreshed.extend(build_headline_entry(country_code, headline, idx, today) for idx, headline in enumerate(headlines, start=1))
        else:
            refreshed.extend(static_fallbacks.get(country_code, []))

    untouched_codes = {item["country_code"] for item in current_news} - set(QUERY_COUNTRIES.keys())
    for code in untouched_codes:
        refreshed.extend(static_fallbacks.get(code, []))

    NEWS_PATH.write_text(json.dumps(refreshed, indent=2) + "\n", encoding="utf-8")

    site_meta = json.loads(SITE_META_PATH.read_text(encoding="utf-8"))
    site_meta["weekly_refreshed_on"] = today
    site_meta["weekly_refresh_note"] = (
        f"Automated weekly refresh last ran on {today}. Headlines are heuristically tagged into channels such as jobs, gender, industry, trade, resilience, and fiscal space."
    )
    SITE_META_PATH.write_text(json.dumps(site_meta, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
