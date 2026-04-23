#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/infra/docker-compose.yml"
ENV_FILE="$ROOT_DIR/backend/.env.production"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  echo "Copy backend/.env.production.example to backend/.env.production and fill in real values."
  exit 1
fi

docker compose -f "$COMPOSE_FILE" build --pull islamic-app-api
docker compose -f "$COMPOSE_FILE" up -d islamic-app-api
docker compose -f "$COMPOSE_FILE" ps
