#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

MODE="dev"          # dev | prod
INSTALL_DEPS=0
DRY_RUN=0

RUN_BACKEND=1
RUN_INGEST=1
RUN_WEB=1
RUN_INTERNSHIP=1

usage() {
  cat <<'EOF'
Usage:
  ./scripts/start-all.sh [options]

Starts multiple services from this repo in one go.

Options:
  --dev                Use dev scripts (default)
  --prod               Use start/preview scripts where available
  --install             Run npm install in each service before starting
  --dry-run             Print what would run without starting anything

  --no-backend          Do not start server/ (timetable backend)
  --no-ingest           Do not start timetable/ingest-server/
  --no-web              Do not start packages/starterkit/ (Vite)
  --no-internship       Do not start internship-api-server.js

  -h, --help            Show this help

Examples:
  ./scripts/start-all.sh
  ./scripts/start-all.sh --install
  ./scripts/start-all.sh --no-internship
  ./scripts/start-all.sh --dry-run
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dev) MODE="dev"; shift ;;
    --prod) MODE="prod"; shift ;;
    --install) INSTALL_DEPS=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --no-backend) RUN_BACKEND=0; shift ;;
    --no-ingest) RUN_INGEST=0; shift ;;
    --no-web) RUN_WEB=0; shift ;;
    --no-internship) RUN_INTERNSHIP=0; shift ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "Unknown option: $1" >&2
      echo "" >&2
      usage >&2
      exit 2
      ;;
  esac
done

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 127
  fi
}

require_cmd node
require_cmd npm

declare -a SERVICE_NAMES=()
declare -a SERVICE_PGIDS=()

start_service() {
  local name="$1"
  local cwd="$2"
  local cmd="$3"

  if [[ ! -d "$cwd" ]]; then
    echo "Skipping $name: directory not found: $cwd" >&2
    return 0
  fi

  if [[ "$INSTALL_DEPS" == "1" ]]; then
    echo "[$name] Installing dependencies..."
    if [[ "$DRY_RUN" == "1" ]]; then
      echo "  (dry-run) cd \"$cwd\" && npm install"
    else
      (cd "$cwd" && npm install)
    fi
  fi

  echo "[$name] Starting: $cmd"
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "  (dry-run) cd \"$cwd\" && $cmd"
    return 0
  fi

  # Prefer starting in its own session (process group) so we can kill it reliably.
  # If setsid is unavailable, fall back to a plain background process.
  if command -v setsid >/dev/null 2>&1; then
    # The PID we capture is the session leader; killing "-PID" targets the whole group.
    setsid bash -lc "cd \"$cwd\" && exec $cmd" &
  else
    bash -lc "cd \"$cwd\" && exec $cmd" &
  fi
  local pid="$!"
  SERVICE_NAMES+=("$name")
  SERVICE_PGIDS+=("$pid")
}

cleanup() {
  if [[ "${#SERVICE_PGIDS[@]}" -eq 0 ]]; then
    return 0
  fi

  echo ""
  echo "Stopping services..."

  # Ask nicely first
  for pid in "${SERVICE_PGIDS[@]}"; do
    if command -v setsid >/dev/null 2>&1; then
      kill -TERM -- "-$pid" >/dev/null 2>&1 || true
    else
      kill -TERM "$pid" >/dev/null 2>&1 || true
    fi
  done

  # Give them a moment
  sleep 2 || true

  # Force kill anything still running
  for pid in "${SERVICE_PGIDS[@]}"; do
    if kill -0 "$pid" >/dev/null 2>&1; then
      if command -v setsid >/dev/null 2>&1; then
        kill -KILL -- "-$pid" >/dev/null 2>&1 || true
      else
        kill -KILL "$pid" >/dev/null 2>&1 || true
      fi
    fi
  done
}

trap cleanup EXIT INT TERM

echo "Repo: $REPO_ROOT"
echo "Mode: $MODE"

if [[ "$MODE" == "dev" ]]; then
  [[ "$RUN_BACKEND" == "1" ]] && start_service "backend" "$REPO_ROOT/server" "npm run dev"
  [[ "$RUN_INGEST" == "1" ]] && start_service "ingest" "$REPO_ROOT/timetable/ingest-server" "npm run dev"
  [[ "$RUN_WEB" == "1" ]] && start_service "web" "$REPO_ROOT/packages/starterkit" "npm run dev"
  [[ "$RUN_INTERNSHIP" == "1" ]] && start_service "internship" "$REPO_ROOT" "node internship-api-server.js"
elif [[ "$MODE" == "prod" ]]; then
  [[ "$RUN_BACKEND" == "1" ]] && start_service "backend" "$REPO_ROOT/server" "npm run start"
  [[ "$RUN_INGEST" == "1" ]] && start_service "ingest" "$REPO_ROOT/timetable/ingest-server" "npm run start"
  # Vite "preview" expects a build; keep it explicit rather than auto-building.
  [[ "$RUN_WEB" == "1" ]] && start_service "web" "$REPO_ROOT/packages/starterkit" "npm run preview"
  [[ "$RUN_INTERNSHIP" == "1" ]] && start_service "internship" "$REPO_ROOT" "node internship-api-server.js"
else
  echo "Invalid mode: $MODE" >&2
  exit 2
fi

if [[ "$DRY_RUN" == "1" ]]; then
  echo "Dry run complete."
  exit 0
fi

if [[ "${#SERVICE_PGIDS[@]}" -eq 0 ]]; then
  echo "No services were started."
  exit 1
fi

echo ""
echo "All services started:"
for i in "${!SERVICE_NAMES[@]}"; do
  echo " - ${SERVICE_NAMES[$i]} (pgid ${SERVICE_PGIDS[$i]})"
done
echo ""
echo "Press Ctrl+C to stop everything."

# Wait for any one service to exit; then we stop the rest via trap.
wait -n "${SERVICE_PGIDS[@]}"

