#!/usr/bin/env bash
#
# Baut die Site und synct dist/ auf den VPS.
#
#   DEPLOY_HOST=1.2.3.4 ./deploy/deploy.sh
#
# Konfiguration ueber Env-Variablen (oder deploy/deploy.env, siehe unten):
#   DEPLOY_HOST  Pflicht. IP oder Hostname des VPS.
#   DEPLOY_USER  Default: deploy
#   DEPLOY_PATH  Default: /var/www/zir
#   SKIP_INSTALL Auf 1 setzen, um `npm ci` zu ueberspringen.

set -euo pipefail

cd "$(dirname "$0")/.."

# Optionale lokale Konfig, nicht im Repo (siehe .gitignore)
[ -f deploy/deploy.env ] && . deploy/deploy.env

DEPLOY_USER="${DEPLOY_USER:-deploy}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/zir}"

if [ -z "${DEPLOY_HOST:-}" ]; then
  echo "Fehler: DEPLOY_HOST ist nicht gesetzt." >&2
  echo "  DEPLOY_HOST=1.2.3.4 ./deploy/deploy.sh" >&2
  exit 1
fi

if [ ! -f .env ]; then
  echo "Fehler: .env fehlt - der Build braucht VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY." >&2
  echo "  cp .env.example .env   und den anon key eintragen" >&2
  exit 1
fi

if [ "${SKIP_INSTALL:-0}" != "1" ]; then
  echo "==> Dependencies installieren"
  npm ci
fi

echo "==> Build (prebuild generiert die Sitemap mit)"
npm run build

if [ ! -f dist/index.html ]; then
  echo "Fehler: dist/index.html fehlt - Build fehlgeschlagen." >&2
  exit 1
fi

echo "==> Upload nach ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
# --delete raeumt Assets alter Builds ab. index.html zuletzt, damit
# Besucher waehrend des Uploads keine noch fehlenden Assets anfragen.
rsync -avz --delete --exclude=index.html \
  dist/ "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
rsync -avz dist/index.html "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/index.html"

echo "==> Fertig: https://www.zukunft-ist-relativ.de/"
