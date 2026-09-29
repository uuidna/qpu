#!/bin/sh
# pre-commit — HARD. README regenerated from the tree, and the Lean kernel checks.
# Tracked here, installed by `npm run hooks`, for the reason scripts/pre-push.sh gives.
set -e
cd "$(git rev-parse --show-toplevel)"

# Generate live README from current codebase state. Its output is kept, not discarded: a generator that fails
# under `set -e` used to abort the commit with no line saying which step did it.
echo "pre-commit: README — regenerating from live codebase"
if ! log=$(node scripts/generate-readme.mjs 2>&1); then
  echo "$log" | tail -20
  echo "pre-commit: RED — README generation failed. Commit BLOCKED."
  exit 1
fi
git add README.md

src="src/quantum/processing/unit/index.lean"
echo "pre-commit: HARD — lean $src"
command -v lean >/dev/null || { echo "pre-commit: RED — lean missing. Commit BLOCKED."; exit 1; }
lean "$src" || { echo "pre-commit: RED — the kernel rejected $src. Commit BLOCKED."; exit 1; }
