#!/usr/bin/env bash
# Card Optimizer deployment script (Cloudflare Pages)
# Usage: bash deploy.sh staging|prod
set -euo pipefail

ENV="${1:-}"
if [[ "$ENV" != "staging" && "$ENV" != "prod" ]]; then
  echo "Usage: bash deploy.sh staging|prod"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== Card Optimizer $ENV Deployment ==="

if [ "$ENV" = "staging" ]; then
  DB_NAME="card-optimizer-db-staging"
  DB_ENV_FLAG="--env preview"
  PAGES_BRANCH="staging"
  DEPLOY_URL="https://staging.card-optimizer.pages.dev"
else
  DB_NAME="card-optimizer-db"
  DB_ENV_FLAG=""
  PAGES_BRANCH="main"
  DEPLOY_URL="https://cards.keylightdigital.com"
fi

# Step 1: Build
echo "[1/4] Building (tsc + vite)..."
npm run build
echo "  Build complete"

# Step 2: Apply D1 migrations
echo "[2/4] Applying D1 migrations to $DB_NAME..."
# shellcheck disable=SC2086
npx wrangler d1 migrations apply "$DB_NAME" --remote $DB_ENV_FLAG
echo "  Migrations applied"

# Step 3: Deploy to Cloudflare Pages
echo "[3/4] Deploying to Cloudflare Pages ($PAGES_BRANCH)..."
npx wrangler pages deploy dist --project-name card-optimizer --branch "$PAGES_BRANCH"
echo "  Pages deployed"

# Step 4: Health check
echo "[4/4] Verifying deployment..."
sleep 5
STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "$DEPLOY_URL/api/health" 2>/dev/null || echo "000")
if [ "$STATUS" = "200" ]; then
  echo "  Health check passed (HTTP $STATUS)"
else
  echo "  WARNING: Health check returned HTTP $STATUS"
fi

echo ""
echo "=== $ENV deploy complete ==="
echo "DEPLOY_URL=$DEPLOY_URL"
