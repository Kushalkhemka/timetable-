#!/usr/bin/env bash
set -uo pipefail

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

kill_port() {
  local port="$1"
  echo "Checking for processes on port $port..."
  
  local pids=""
  
  # Try lsof first (macOS and many Linux distros)
  if command -v lsof >/dev/null 2>&1; then
    pids=$(lsof -ti:"$port" 2>/dev/null || true)
  # Fallback to fuser (common on Linux)
  elif command -v fuser >/dev/null 2>&1; then
    pids=$(fuser "$port/tcp" 2>/dev/null | tr -s ' ' '\n' || true)
  # Fallback to ss + awk (modern Linux)
  elif command -v ss >/dev/null 2>&1; then
    pids=$(ss -lptn "sport = :$port" 2>/dev/null | awk '/pid=/{match($0, /pid=([0-9]+)/, a); print a[1]}' | sort -u || true)
  # Last resort: netstat (older systems)
  elif command -v netstat >/dev/null 2>&1; then
    pids=$(netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1 | grep -E '^[0-9]+$' || true)
  fi
  
  if [[ -n "$pids" ]]; then
    echo "  Killing existing process(es) on port $port: $pids"
    echo "$pids" | xargs kill -9 2>/dev/null || true
    sleep 0.5
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
      # Use legacy-peer-deps for web service to handle React 19 conflicts
      if [[ "$name" == "web" ]]; then
        (cd "$cwd" && npm install --legacy-peer-deps) || echo "  Warning: npm install failed for $name" >&2
      else
        (cd "$cwd" && npm install) || echo "  Warning: npm install failed for $name" >&2
      fi
    fi
  fi

  echo "[$name] Starting: $cmd"
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "  (dry-run) cd \"$cwd\" && $cmd"
    return 0
  fi

  # Start the service in a subshell with its own process group
  (
    cd "$cwd" 2>/dev/null || exit 1
    exec $cmd 2>&1
  ) &
  local pid="$!"
  
  # Give the process a moment to start before continuing
  sleep 0.3
  
  # Verify the process actually started
  if ! kill -0 "$pid" 2>/dev/null; then
    echo "  ✗ Failed to start $name (PID $pid)" >&2
    return 1
  fi
  
  echo "  ✓ Started $name (PID $pid)"
  SERVICE_NAMES+=("$name")
  SERVICE_PGIDS+=("$pid")
}

cleanup() {
  if [[ "${#SERVICE_PGIDS[@]}" -eq 0 ]]; then
    return 0
  fi

  echo ""
  echo "Stopping services..."

  # Kill process groups (negative PID kills the entire group)
  for pid in "${SERVICE_PGIDS[@]}"; do
    if kill -0 "$pid" >/dev/null 2>&1; then
      # Try to kill the process group
      kill -TERM -- "-$pid" >/dev/null 2>&1 || kill -TERM "$pid" >/dev/null 2>&1 || true
    fi
  done

  # Give them a moment to shutdown gracefully
  sleep 2

  # Force kill anything still running
  for pid in "${SERVICE_PGIDS[@]}"; do
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill -KILL -- "-$pid" >/dev/null 2>&1 || kill -KILL "$pid" >/dev/null 2>&1 || true
    fi
  done
}

trap cleanup EXIT INT TERM

echo "Repo: $REPO_ROOT"
echo "Mode: $MODE"
echo ""

# Clean up ports that services will use
if [[ "$RUN_BACKEND" == "1" ]]; then
  kill_port 5055
fi
if [[ "$RUN_INGEST" == "1" ]]; then
  kill_port 5057
fi
if [[ "$RUN_WEB" == "1" ]]; then
  kill_port 5173  # Default Vite port
fi
if [[ "$RUN_INTERNSHIP" == "1" ]]; then
  kill_port 3001
fi

echo ""

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

# Wait for all services to complete or for interrupt signal
# The trap will handle cleanup when any service exits or on Ctrl+C
for pid in "${SERVICE_PGIDS[@]}"; do
  wait "$pid" 2>/dev/null || true
done

