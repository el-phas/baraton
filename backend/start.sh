#!/usr/bin/env bash
set -euo pipefail

# Move into backend directory

echo "Installing dependencies..."
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "Starting backend..."
npm start
