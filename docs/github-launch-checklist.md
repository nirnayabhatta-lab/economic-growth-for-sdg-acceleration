# GitHub Launch Checklist

This repo is ready for a GitHub Pages launch as a static policy atlas.

## Recommended repository settings
1. Repository name: `economic-growth-for-sdg-acceleration`
2. Visibility: `Public`
3. Default branch: `main`
4. Pages source: `GitHub Actions`
5. Enable Discussions only if you want public policy feedback and issue intake separated

## Labels to create
- `country`
- `lens`
- `data`
- `policy-map`
- `budget-map`
- `accelerator`
- `comparison`
- `docs`

## Milestones to create
1. `v0.1 skeleton`
2. `v0.2 Nepal lenses`
3. `v0.3 comparator layer`
4. `v0.4 pathways + accelerators`
5. `v1 public launch`

## First project issues
1. Validate Nepal narratives against latest national planning documents
2. Review comparator basket and peer logic
3. Add chart annotations and screenshot-based homepage QA
4. Tighten pathways methodology and evidence-strength rules
5. Add downloadable country brief template

## Publish flow
1. Push this repo to GitHub on `main`
2. Open `Settings -> Pages`
3. Confirm `Build and deployment -> Source` is `GitHub Actions`
4. Push once more if needed to trigger `deploy-pages`
5. Open the generated Pages URL and verify:
   - root redirects to `app/`
   - country selector loads
   - `data/site_meta.json` is reachable
   - Sources and Methods section renders

## Useful local commands
```sh
python3 scripts/build_seed_data.py
python3 scripts/validate_data.py
python3 -m http.server 8000 --bind 127.0.0.1
```

## Notes
- The platform is intentionally static for v1 so it can stay transparent, auditable, and easy to maintain.
- The data layer is curated, not live-scraped.
- GitHub Actions already rebuild and validate the JSON payload before deployment.

