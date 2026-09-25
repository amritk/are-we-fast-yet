#!/bin/bash
set -e # make script fail on first error
SCRIPT_PATH="$(dirname "$0")"
source "$SCRIPT_PATH/../script.inc"

pushd "$SCRIPT_PATH" > /dev/null

if [ ! -x node_modules/.bin/nish ]; then
  INFO Install Nish
  npm install --no-audit --no-fund
fi

if [[ "$1" = "style" ]]
then
  # Nish has no separate linter; its checker is the style gate, so compile
  # without linking and fail on any rejected construct.
  INFO Check Nish Benchmarks
  node_modules/.bin/nish harness.ts -o build/ --no-warn-performance
  exit 0
fi

INFO Build Nish Benchmarks
node_modules/.bin/nish harness.ts -o build/ --link harness --no-warn-performance
