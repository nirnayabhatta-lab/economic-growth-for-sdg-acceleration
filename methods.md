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

Why this approach is realistic:
- easy to deploy on GitHub Pages
- easy to review and version on GitHub
- easier to expand incrementally without overbuilding infrastructure
