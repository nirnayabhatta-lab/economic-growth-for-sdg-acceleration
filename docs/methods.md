# Methods Note

This repository uses a curated snapshot approach for v1.

Design choices:
- no backend
- no live scraping in the app
- all public-facing data served from static JSON files
- comparison groups defined in `data/comparators.json`
- source references resolved through `data/sources.json`

What the numbers mean:
- values are structured, policy-facing analytical snapshots assembled from the latest public source mix
- they are intended for comparative orientation and decision support
- they are not a substitute for official statistical releases or full model-based estimation

Analytical layers:
- structural anchor: official or slow-moving development position
- pulse layer: proxy-based nowcast of near-term acceleration conditions
- decomposition layer: benchmark-relative explanation of what is lifting or dragging the pulse
- intervention layer: illustrative priority ranking of accelerators mapped to weak channels

Weekly updates:
- v1 does not claim an official weekly SDG score
- a weekly updating layer can be added by linking higher-frequency data and tagged news/event signals to the pulse channels
- the most suitable channels for weekly updates are jobs, prices, trade, implementation, resilience, tourism, energy, and local disruptions
- this repo now includes a prototype weekly news-and-signals layer that can be refreshed through scheduled automation and heuristically linked to indicator families

Why this approach is realistic:
- easy to deploy on GitHub Pages
- easy to review and version on GitHub
- easier to expand incrementally without overbuilding infrastructure
