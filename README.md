# Kgalagadi Checklist

Small offline-first web app for tracking mammal sightings in Kgalagadi Transfrontier Park.

Features:
- single shared checklist
- grouped by mammal family
- English, Spanish, and scientific names
- local bundled `webp` images
- browser-local persistence
- backup and restore as JSON
- service-worker support for offline use after first load

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy

This is a static site. Any simple web server or static hosting setup works.
