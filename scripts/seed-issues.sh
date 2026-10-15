#!/usr/bin/env bash
# Creates the seeded backlog tickets (backlog/*.md) as GitHub issues.
# Run it from the root of your fork, after `gh auth login`:
#   scripts/seed-issues.sh            create the issues in the current repo
#   scripts/seed-issues.sh --dry-run  print what it would create
#   scripts/seed-issues.sh --repo <owner>/<repo>
set -euo pipefail

dry_run=false
repo_args=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) dry_run=true; shift ;;
    --repo) repo_args=(--repo "$2"); shift 2 ;;
    *) echo "Unknown argument: $1" >&2; exit 2 ;;
  esac
done

cd "$(dirname "$0")/.."

if ! $dry_run; then
  command -v gh >/dev/null || { echo "gh is not installed: https://cli.github.com" >&2; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "Run 'gh auth login' first." >&2; exit 1; }
fi

tickets=(BUG-01 FEAT-02 REFACTOR-03 MIGRATE-04 FLAKY-05 LEGACY-06)

for id in "${tickets[@]}"; do
  file="backlog/${id}.md"
  [[ -f "$file" ]] || { echo "Missing $file" >&2; exit 1; }
  # The first line of each ticket is "# <ID>: <title>".
  title="$(head -n 1 "$file" | sed 's/^# //')"
  body="$(tail -n +2 "$file")"

  if $dry_run; then
    echo "Would create: $title"
    continue
  fi

  existing="$(gh issue list ${repo_args[@]+"${repo_args[@]}"} --state all --search "\"${id}:\" in:title" --json number --jq 'length')"
  if [[ "$existing" != "0" ]]; then
    echo "Skip $id: an issue with this ID already exists."
    continue
  fi
  gh issue create ${repo_args[@]+"${repo_args[@]}"} --title "$title" --body "$body"
done
