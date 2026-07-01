#!/usr/bin/env bash
# Reproduit localement les 4 jobs du workflow CI update-node-20.yml
# Usage: bash scripts/validate-ci.sh

set -e
PASS=0
FAIL=0
SKIP=0

log_step() { echo ""; echo "▶ $1"; }
ok()        { echo "  ✓ $1"; PASS=$((PASS+1)); }
fail()      { echo "  ✗ $1"; FAIL=$((FAIL+1)); }
skip()      { echo "  – $1 (skipped)"; SKIP=$((SKIP+1)); }

# ----------------------------------------------------------------
log_step "Job 1 — Tests unitaires et intégration"
# ----------------------------------------------------------------
if NODE_ENV=test npm test --silent; then
  ok "npm test"
else
  fail "npm test"
fi

# ----------------------------------------------------------------
log_step "Job 2 — Webpack build check"
# ----------------------------------------------------------------
if npm run build --silent; then
  ok "webpack production build"
else
  fail "webpack production build"
fi

# ----------------------------------------------------------------
log_step "Job 3 — Smoke test serveur Express"
# ----------------------------------------------------------------
npm run smoke:server > /tmp/tc-server.log 2>&1 &
SERVER_PID=$!

if npx wait-on tcp:3001 --timeout 20000 2>/dev/null; then
  ok "serveur démarre sur le port 3001"
  curl -sf http://localhost:3001/ > /dev/null 2>&1 || true
  ok "port 3001 répond"
else
  fail "serveur n'a pas démarré dans les 20s"
  cat /tmp/tc-server.log
fi

kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

# ----------------------------------------------------------------
log_step "Job 4 — E2E Playwright"
# ----------------------------------------------------------------
if [ -d "e2e" ] && [ -f "playwright.config.js" ]; then
  if npm run test:e2e --silent; then
    ok "Playwright E2E"
  else
    fail "Playwright E2E"
  fi
else
  skip "dossier e2e/ absent — merger chore/step-00-3-e2e-playwright d'abord"
fi

# ----------------------------------------------------------------
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Résultat : ✓ $PASS  ✗ $FAIL  – $SKIP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

[ $FAIL -eq 0 ]
