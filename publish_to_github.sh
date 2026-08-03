#!/usr/bin/env bash
set -euo pipefail

OWNER="${GITHUB_OWNER:-Mopati123}"
REPO="${GITHUB_REPO:-mopati-portfolio}"
VISIBILITY="${GITHUB_VISIBILITY:-public}"
REMOTE_URL="https://github.com/${OWNER}/${REPO}.git"

cd "$(dirname "$0")"
python3 auto_setup.py validate

if ! command -v git >/dev/null 2>&1; then
  echo "REFUSED: git is not installed." >&2
  exit 2
fi

if [[ ! -d .git ]]; then
  git init
  git branch -M main
fi

if ! git config user.name >/dev/null; then
  git config user.name "Mopati Ramaologa"
fi
if ! git config user.email >/dev/null; then
  echo "REFUSED: configure Git identity first: git config --global user.email 'you@example.com'" >&2
  exit 3
fi

if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  git add .
  git commit -m "feat: launch evidence-native engineering portfolio"
elif [[ -n "$(git status --porcelain)" ]]; then
  git add .
  git commit -m "chore: prepare portfolio publication"
fi

if command -v gh >/dev/null 2>&1; then
  gh auth status >/dev/null
  if ! gh repo view "${OWNER}/${REPO}" >/dev/null 2>&1; then
    gh repo create "${OWNER}/${REPO}" --"${VISIBILITY}" --source=. --remote=origin --push
    echo "Published ${OWNER}/${REPO}."
    exit 0
  fi
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

git branch -M main
git push -u origin main

echo "Published ${OWNER}/${REPO}. Configure Settings -> Pages -> Source: GitHub Actions."
