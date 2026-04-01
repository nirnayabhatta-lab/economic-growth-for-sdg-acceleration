# Economic Growth for SDG Acceleration

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
