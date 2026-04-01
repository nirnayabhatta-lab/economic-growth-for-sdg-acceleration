# Economic Growth for SDG Acceleration (Growth4SDGs)

A Nepal-centered, regionally benchmarked policy atlas that shows how growth, fiscal space, implementation quality, and accelerator interventions connect to SDG outcomes.

## Live HTML site
- Planned public URL: `https://nirnayabhatta-lab.github.io/economic-growth-for-sdg-acceleration/`
- Hosting: `GitHub Pages`
- Delivery model: static HTML, CSS, JavaScript, and JSON served directly from this repository

## What this platform is
This repo is designed as a live policy atlas rather than a static write-up. Users can:
- start from Nepal as the anchor country
- compare Nepal against South Asia, Southeast Asia, and additional peers
- move across country lenses such as jobs, fiscal space, resilience, and implementation capacity
- inspect growth-to-SDG pathways
- review policy and budget channels
- identify accelerator interventions with direct and indirect SDG effects
- trace every narrative back to a source registry and methods note

## Unique analytical aspect
The distinctive lens in this platform is that it does not stop at a static SDG scorecard.

It combines four layers:
- `structural anchor`: the slower-moving official development position
- `weekly pulse`: a prototype near-term acceleration signal built from proxy channels
- `driver decomposition`: a view of what is pushing momentum up or down relative to a benchmark group
- `intervention simulator`: an illustrative ranking of which accelerators would most directly target the weakest live channels

This means the platform is designed to answer not just `where is Nepal now?`, but also:
- `what is moving momentum right now?`
- `through which economic channels?`
- `which policy or investment lever is most likely to change the trajectory?`

## Visual and interaction layer
- animated SDG wheel to signal continuous motion across goals and policy channels
- richer gradients and layered color so the atlas feels more dynamic in the browser
- a copyright footer crediting `Developer - Policy Economist NIRNAYA BHATTA`
- weekly news-and-signals cards that connect updates to channels such as jobs, gender, industry, trade, resilience, and fiscal space

## Weekly update path
Yes, this architecture can support weekly auto-updating analysis.

The right model is:
- keep the structural SDG anchor slow-moving and source-based
- add a weekly pulse layer that updates from higher-frequency indicators and curated event/news signals
- link news or shocks to channels such as industries, jobs, gender, trade, resilience, or implementation

In practice, this can be automated through GitHub Actions:
1. fetch weekly indicator updates or tagged news feeds
2. classify the update into channels like jobs, industry, gender, fiscal space, or resilience
3. regenerate JSON files
4. redeploy the static site through GitHub Pages

That lets the site stay static to host, but dynamic in content.

## Weekly automation in this repo
- `.github/workflows/weekly-refresh.yml`: scheduled Monday refresh and deploy workflow
- `scripts/refresh_weekly_signals.py`: lightweight headline fetch and heuristic tagging into channels and linked indicators
- `data/news_signals.json`: public-facing news-and-signals layer used by the site

## What this repo contains
- `app/`: static PWA for GitHub Pages
- `data/`: curated JSON snapshots for countries, indicators, pathways, policies, budgets, accelerators, signals, and toolkit objects
- `docs/`: framework, methods, sources, and Nepal policy mapping notes
- `scripts/`: seed-data generator and validation checks
- `.github/`: issue template, PR template, validation workflow, and Pages deployment workflow

## Local use
1. Rebuild the seed data:
   ```sh
   python3 scripts/build_seed_data.py
   ```
2. Validate the data contracts:
   ```sh
   python3 scripts/validate_data.py
   ```
3. Serve the repo from the project root:
   ```sh
   python3 -m http.server 8000
   ```
4. Open:
   ```text
   http://127.0.0.1:8000/
   ```

## GitHub Pages
- Default branch: `main`
- The root `index.html` redirects to `app/`
- The included Pages workflow publishes the whole repo as a static site
- Public URL pattern: `https://<owner>.github.io/<repo>/`
- For this repo, the expected URL is `https://nirnayabhatta-lab.github.io/economic-growth-for-sdg-acceleration/`
- If the site is not live immediately after push, open `Settings -> Pages` and confirm `Build and deployment -> Source` is set to `GitHub Actions`
- See [docs/github-launch-checklist.md](docs/github-launch-checklist.md) for labels, milestones, and publish steps

## Current scope
V1 is intentionally curated and lightweight:
- Nepal is the anchor country
- South Asia, Southeast Asia, and additional peers provide perspective
- data are curated snapshots, not live API pulls
- the emphasis is on analysis, pathways, and decision support rather than full econometric simulation

## Current implementation status
- Live PWA shell in `app/`
- Seeded comparator basket with 19 countries
- Validated JSON contracts for indicators, pathways, policies, budgets, accelerators, signals, toolkit, and sources
- GitHub Actions for data validation and Pages deployment

## Repository structure
```text
.
|-- app/
|-- data/
|-- docs/
|-- scripts/
|-- .github/
|-- index.html
|-- README.md
`-- LICENSE
```

## License
This repository is released under the [MIT License](LICENSE).
