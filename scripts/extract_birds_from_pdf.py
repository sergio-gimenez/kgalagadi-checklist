#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path


SKIP = {
    "Kgalagadi Transfrontier Park",
    "Birds Checklist",
    "No.",
    "English Name",
    "Scientific Name",
    "Roberts Number",
}


def extract_pages(pdf_path: Path) -> list[str]:
    text = subprocess.check_output(["pdftotext", str(pdf_path), "-"], text=True)
    return text.split("\f")


def clean_page(page: str) -> list[str]:
    rows: list[str] = []
    for raw in page.splitlines():
        value = raw.strip()
        if not value or value in SKIP:
            continue
        if value.startswith("https://") or value.startswith("Powered by TCPDF"):
            continue
        if re.fullmatch(r"\d+\.", value):
            continue
        rows.append(value)
    return rows


def parse_birds(pdf_path: Path) -> list[dict[str, str]]:
    birds: list[dict[str, str]] = []
    for page in extract_pages(pdf_path):
        rows = clean_page(page)
        if not rows:
            continue
        third = len(rows) // 3
        names = rows[:third]
        scientific = rows[third : third * 2]
        roberts = rows[third * 2 : third * 3]
        for english, latin, roberts_number in zip(names, scientific, roberts, strict=True):
            birds.append(
                {
                    "english": english,
                    "scientific": latin,
                    "roberts": roberts_number,
                }
            )
    return birds


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract Kgalagadi bird checklist from a SANParks PDF.")
    parser.add_argument("pdf", type=Path, help="Path to birds.pdf")
    parser.add_argument("output", type=Path, help="Path to write birds-source.json")
    args = parser.parse_args()

    birds = parse_birds(args.pdf)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(birds, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(birds)} birds to {args.output}")


if __name__ == "__main__":
    main()
