#!/usr/bin/env python3
import subprocess, re, json
from pathlib import Path

LOG_GLOB = "/var/log/nginx/access.log*"
OUT_FILE = Path(__file__).parent / "counter.json"

EXCLUDE = (
    "127.0.0.1",
    "172.68.", "172.69.", "172.70.", "172.71.",
    "162.158.", "162.159.",
    "104.22.", "104.23.",
    "192.227.227.221",
)

try:
    out = subprocess.check_output(
        f"zcat -f {LOG_GLOB} 2>/dev/null | grep kgalagadi-checklist",
        shell=True, text=True
    )
    ips = re.findall(r'^(\S+)', out, re.MULTILINE)
    external = [ip for ip in ips if not any(ip.startswith(p) for p in EXCLUDE)]
    data = {"visits": len(set(external)), "requests": len(external)}
except Exception:
    data = {"visits": 0, "requests": 0}

OUT_FILE.write_text(json.dumps(data) + "\n")
