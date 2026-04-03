# Scripts

These scripts keep the checklist content reproducible.

## 1. Extract birds from the SANParks PDF

```bash
python3 scripts/extract_birds_from_pdf.py ~/Downloads/birds.pdf data/birds-source.json
```

## 2. Build local image assets and final app data

```bash
python3 scripts/build_assets.py
```

What this does:
- reads `data/mammals-source.json` and `data/birds-source.json`
- resolves image sources using iNaturalist and Wikipedia fallbacks
- converts them to local `webp` files under `assets/`
- writes the app dataset to `data/checklists.json`
- writes a browser-ready bundle to `data/checklists.js`

Build only one category while working on it:

```bash
python3 scripts/build_assets.py --categories birds
```

Notes:
- `ImageMagick` is required because the script uses `magick`
- the script creates request caches under `.cache/build_assets/`
- the pangolin uses a manual source override in `scripts/build_assets.py`
