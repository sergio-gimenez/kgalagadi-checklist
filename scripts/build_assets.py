#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import re
import subprocess
import time
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
ASSET_DIR = ROOT / "assets"
CACHE_DIR = ROOT / ".cache" / "build_assets"

USER_AGENT = "KgalagadiChecklistBuilder/1.0"

PANGOLIN_OVERRIDE = "https://media.gettyimages.com/id/1470551652/photo/ground-pangolin-okonjima-nature-reserve-near-otjiwarongo-otjozondjupa-region-namibia.jpg?s=612x612&w=0&k=20&c=VY2C4Iw2J-OcRw7MwP3UyVJvJrZuKsBMYmHAyDXwHm8="

BIRD_FAMILY_OVERRIDES = {
    "Secretarybird": "Sagittariidae",
}

APP_DATA_JS = "window.CHECKLIST_DATA = "


def slugify(value: str) -> str:
    value = value.lower().replace("’", "").replace("'", "")
    return re.sub(r"[^a-z0-9]+", "-", value).strip("-")


def get_json(url: str, cache_name: str | None = None) -> dict:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    if cache_name:
        cache_path = CACHE_DIR / cache_name
        if cache_path.exists():
            return json.loads(cache_path.read_text(encoding="utf-8"))
    last_error: Exception | None = None
    for attempt in range(5):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(request, timeout=60) as response:
                data = json.load(response)
            break
        except Exception as exc:  # pragma: no cover - network retry path
            last_error = exc
            time.sleep(1.5 * (attempt + 1))
    else:
        raise RuntimeError(f"Failed to fetch {url}") from last_error
    if cache_name:
        cache_path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    time.sleep(0.15)
    return data


def wikipedia_summary(query: str) -> dict:
    url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + urllib.parse.quote(query.replace(" ", "_"), safe="")
    return get_json(url, f"wiki-summary-{slugify(query)}.json")


def inat_autocomplete(query: str) -> dict | None:
    url = "https://api.inaturalist.org/v1/taxa/autocomplete?q=" + urllib.parse.quote(query)
    data = get_json(url, f"inat-autocomplete-{slugify(query)}.json")
    results = data.get("results", [])
    lowered = query.lower()
    for result in results:
        if result.get("name", "").lower() == lowered:
            return result
    return results[0] if results else None


def inat_family(taxon_id: int) -> str:
    url = f"https://api.inaturalist.org/v1/taxa/{taxon_id}"
    data = get_json(url, f"inat-taxon-{taxon_id}.json")
    results = data.get("results", [])
    if not results:
        return "Unknown"
    for ancestor in results[0].get("ancestors", []):
        if ancestor.get("rank") == "family":
            return ancestor.get("name", "Unknown")
    return "Unknown"


def download_file(url: str, target: Path) -> None:
    last_error: Exception | None = None
    for attempt in range(5):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(request, timeout=90) as response:
                target.write_bytes(response.read())
            return
        except Exception as exc:  # pragma: no cover - network retry path
            last_error = exc
            time.sleep(2 * (attempt + 1))
    raise RuntimeError(f"Failed to download {url}") from last_error


def ensure_webp(image_url: str, asset_dir: Path, slug: str) -> str:
    asset_dir.mkdir(parents=True, exist_ok=True)
    target = asset_dir / f"{slug}.webp"
    if target.exists() and target.stat().st_size > 0:
        return f"./assets/{asset_dir.name}/{target.name}"

    source_ext = ".png" if ".png" in image_url.lower() else ".jpeg" if ".jpeg" in image_url.lower() else ".jpg"
    source = asset_dir / f"{slug}{source_ext}"
    if not source.exists() or source.stat().st_size == 0:
        download_file(image_url, source)
        time.sleep(0.2)

    subprocess.run(
        [
            "magick",
            str(source),
            "-auto-orient",
            "-resize",
            "420x420>",
            "-strip",
            "-quality",
            "68",
            str(target),
        ],
        check=True,
    )
    return f"./assets/{asset_dir.name}/{target.name}"


def resolve_entry(entry: dict[str, str], category: str) -> dict[str, str]:
    english = entry["english"]
    scientific = entry["scientific"]
    slug = slugify(english)
    override_url = entry.get("image_url", "")

    photo_url = override_url
    family = entry.get("family", "")
    if not photo_url or not family:
        taxon = inat_autocomplete(scientific) or inat_autocomplete(english)
        if taxon:
            photo_url = photo_url or ((taxon.get("default_photo") or {}).get("medium_url") or "")
            family = family or inat_family(taxon["id"])

    if not photo_url:
        summary = wikipedia_summary(scientific)
        photo_url = ((summary.get("thumbnail") or {}).get("source")) or ""

    if category == "mammals" and english == "Pangolin":
        photo_url = PANGOLIN_OVERRIDE

    if not photo_url:
        raise RuntimeError(f"Missing image source for {english}")

    if category == "birds" and english in BIRD_FAMILY_OVERRIDES:
        family = BIRD_FAMILY_OVERRIDES[english]

    if not family:
        family = "Unknown"

    image_path = ensure_webp(photo_url, ASSET_DIR / category, slug)

    result = {
        "category": category,
        "english": english,
        "scientific": scientific,
        "family": family,
        "image": image_path,
    }
    if entry.get("spanish"):
        result["spanish"] = entry["spanish"]
    if entry.get("roberts"):
        result["roberts"] = entry["roberts"]
    return result


def load_json(path: Path) -> list[dict[str, str]]:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> None:
    parser = argparse.ArgumentParser(description="Build local assets and checklist JSON for the Kgalagadi app.")
    parser.add_argument("--mammals", type=Path, default=DATA_DIR / "mammals-source.json")
    parser.add_argument("--birds", type=Path, default=DATA_DIR / "birds-source.json")
    parser.add_argument("--output", type=Path, default=DATA_DIR / "checklists.json")
    parser.add_argument("--output-js", type=Path, default=DATA_DIR / "checklists.js")
    parser.add_argument("--categories", nargs="+", choices=["mammals", "birds"], default=["mammals", "birds"])
    args = parser.parse_args()

    payload: dict[str, list[dict[str, str]]] = {}
    if "mammals" in args.categories:
        payload["mammals"] = [resolve_entry(entry, "mammals") for entry in load_json(args.mammals)]
    if "birds" in args.categories:
        payload["birds"] = [resolve_entry(entry, "birds") for entry in load_json(args.birds)]

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    args.output_js.write_text(APP_DATA_JS + json.dumps(payload, ensure_ascii=False) + ";\n", encoding="utf-8")
    mammals_count = len(payload.get("mammals", []))
    birds_count = len(payload.get("birds", []))
    print(f"Wrote {mammals_count} mammals and {birds_count} birds to {args.output}")


if __name__ == "__main__":
    main()
