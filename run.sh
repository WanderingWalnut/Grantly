#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/server"

if [[ -d "venv" ]]; then
  # shellcheck disable=SC1091
  source venv/bin/activate
fi

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

