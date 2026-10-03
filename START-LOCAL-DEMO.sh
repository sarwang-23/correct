#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/scale-api"
command -v node >/dev/null 2>&1 || { echo 'Node.js 22.16+ or 24+ is required.'; exit 1; }
command -v docker >/dev/null 2>&1 || { echo 'Docker with Compose is required.'; exit 1; }
npm run setup
npm run env:check
npm run local:up
npm run local:status
printf '\nBackend: http://localhost:5000\nUniversity: http://localhost:5000/university\nImports: http://localhost:5000/university/imports\nOperations: http://localhost:5000/operations\n\nFor a NEW university only: cd scale-api && npm run local:provision\n'
