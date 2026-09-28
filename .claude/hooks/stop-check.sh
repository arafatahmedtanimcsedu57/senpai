#!/usr/bin/env bash
# Stop: before Claude ends a turn that left source changes behind, run the tests related
# to those files and react-doctor on them. Failures go back to Claude (exit 2) once;
# if the retry still fails, the turn ends and the human sees the red result.
set -u
input=$(cat)
[ "$(printf '%s' "$input" | jq -r '.stop_hook_active // false')" = "true" ] && exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

# Use the Node version in .nvmrc when nvm is installed: hooks run in a non-interactive shell
# that starts on nvm's default, and the test runner crashes on older Node. No nvm (CI, other
# setups) → the Node already on PATH is used.
nvm_sh="${NVM_DIR:-$HOME/.nvm}/nvm.sh"
if [ -s "$nvm_sh" ] && [ -f .nvmrc ]; then
  # shellcheck disable=SC1090
  . "$nvm_sh" --no-use
  if node_bin=$(nvm which "$(cat .nvmrc)" 2>/dev/null); then
    PATH="$(dirname "$node_bin"):$PATH"
  fi
fi

changed=$(
  {
    git diff --name-only --diff-filter=d HEAD -- src
    git ls-files --others --exclude-standard -- src
  } | grep -E '\.(ts|tsx)$' | sort -u
)
[ -z "$changed" ] && exit 0

# shellcheck disable=SC2086
if ! out=$(npx --no-install vitest related --run --passWithNoTests $changed 2>&1); then
  printf 'Tests related to your changes are failing. Fix them before finishing:\n%s\n' \
    "$(printf '%s' "$out" | tail -40)" >&2
  exit 2
fi
if ! out=$(npm run --silent doctor 2>&1); then
  printf 'react-doctor found new errors in changed files:\n%s\n' \
    "$(printf '%s' "$out" | tail -40)" >&2
  exit 2
fi
exit 0
