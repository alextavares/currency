#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

BRANCH="${DEPLOY_BRANCH:-main}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-currency_strength}"

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE=(docker-compose)
else
  echo "ERROR: docker compose (plugin) ou docker-compose não encontrado." >&2
  exit 1
fi

COMPOSE_FILE="${COMPOSE_FILE:-}"
if [[ -z "${COMPOSE_FILE}" ]]; then
  if [[ -f docker-compose.prod.yml ]]; then
    COMPOSE_FILE="docker-compose.prod.yml"
  elif [[ -f docker-compose.yml ]]; then
    COMPOSE_FILE="docker-compose.yml"
  else
    echo "ERROR: não encontrei docker-compose.prod.yml nem docker-compose.yml." >&2
    exit 1
  fi
fi

echo "[deploy] repo: $(pwd)"
echo "[deploy] branch: ${BRANCH}"
echo "[deploy] compose file: ${COMPOSE_FILE}"

echo "[deploy] git fetch/pull…"
git fetch origin "${BRANCH}" --prune
git checkout "${BRANCH}"
git pull --ff-only origin "${BRANCH}"

echo "[deploy] build + up…"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME}" "${COMPOSE[@]}" -f "${COMPOSE_FILE}" up -d --build --remove-orphans

echo "[deploy] status:"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME}" "${COMPOSE[@]}" -f "${COMPOSE_FILE}" ps

