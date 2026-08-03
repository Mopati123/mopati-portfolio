#!/usr/bin/env bash
set -euo pipefail

OWNER="Mopati123"
PROFILE_REPO="${OWNER}/${OWNER}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="${ROOT}/github-profile"
WORK_DIR="${TMPDIR:-/tmp}/mopati-github-profile"
PORTFOLIO_URL="https://${OWNER,,}.github.io/mopati-portfolio/"

fail() {
  printf 'REFUSED: %s\n' "$1" >&2
  exit 1
}

command -v gh >/dev/null 2>&1 || fail "GitHub CLI (gh) is required."
gh auth status >/dev/null 2>&1 || fail "GitHub CLI is not authenticated."
[[ -f "${SOURCE_DIR}/README.md" ]] || fail "Profile README source is missing."
[[ -f "${SOURCE_DIR}/assets/quantum-profile-banner.svg" ]] || fail "Profile banner source is missing."

printf '\n=== VALIDATE PROFILE SOURCE ===\n'
python3 "${ROOT}/auto_setup.py" validate

printf '\n=== ENSURE SPECIAL PROFILE REPOSITORY ===\n'
if gh repo view "${PROFILE_REPO}" >/dev/null 2>&1; then
  printf 'Repository exists: %s\n' "${PROFILE_REPO}"
else
  gh repo create "${PROFILE_REPO}" \
    --public \
    --description "Systems architecture, quantum computing, algorithmic trading and governed software engineering." \
    --clone=false
fi

rm -rf "${WORK_DIR}"
git clone "https://github.com/${PROFILE_REPO}.git" "${WORK_DIR}"

install -d "${WORK_DIR}/assets"
install -m 0644 "${SOURCE_DIR}/README.md" "${WORK_DIR}/README.md"
install -m 0644 "${SOURCE_DIR}/assets/quantum-profile-banner.svg" "${WORK_DIR}/assets/quantum-profile-banner.svg"

cd "${WORK_DIR}"

git config user.name >/dev/null 2>&1 || fail "Git user.name is not configured."
git config user.email >/dev/null 2>&1 || fail "Git user.email is not configured."

git add README.md assets/quantum-profile-banner.svg
if git diff --cached --quiet; then
  printf 'Profile repository is already synchronized.\n'
else
  git commit -m "feat: publish evidence-native GitHub profile"
  git push origin HEAD:main
fi

printf '\n=== ALIGN PUBLIC PROFILE METADATA ===\n'
gh api --method PATCH user \
  -f name='Mopati Ramaologa' \
  -f bio='Systems Architect · Quantum Computing Researcher · Algorithmic Trading Engineer · Governed AI Builder' \
  -f location='Gaborone, Botswana' \
  -f blog="${PORTFOLIO_URL}" >/dev/null

printf '\n=== ALIGN FLAGSHIP REPOSITORY METADATA ===\n'
set_repo() {
  local repo="$1"
  local description="$2"
  local homepage="$3"
  shift 3
  local topics=("$@")

  if ! gh repo view "${OWNER}/${repo}" >/dev/null 2>&1; then
    printf 'SKIP missing repository: %s/%s\n' "${OWNER}" "${repo}"
    return 0
  fi

  gh api --method PATCH "repos/${OWNER}/${repo}" \
    -f description="${description}" \
    -f homepage="${homepage}" >/dev/null

  local topic_json
  topic_json="$(printf '%s\n' "${topics[@]}" | python3 -c 'import json,sys; print(json.dumps({"names":[line.strip() for line in sys.stdin if line.strip()]}))')"
  gh api --method PUT "repos/${OWNER}/${repo}/topics" \
    -H 'Accept: application/vnd.github+json' \
    --input - <<<"${topic_json}" >/dev/null

  printf 'Aligned: %s/%s\n' "${OWNER}" "${repo}"
}

set_repo "mopati-portfolio" \
  "Evidence-native engineering portfolio for quantum computing, algorithmic trading, governed AI, finance and platform systems." \
  "${PORTFOLIO_URL}" \
  portfolio systems-architecture quantum-computing algorithmic-trading governed-ai github-pages

set_repo "hpl-spec" \
  "Hamiltonian Programming Language: scheduler-governed execution, typed refusal, deterministic evidence and cryptographic anchoring." \
  "${PORTFOLIO_URL}#systems" \
  programming-language governed-runtime deterministic-systems cryptography evidence scheduler python

set_repo "universal-hamiltonian-framework" \
  "Research framework for Hamiltonian evolution, phase space, symplectic structure, quantum systems and invariant validation." \
  "${PORTFOLIO_URL}#quantum" \
  hamiltonian-mechanics quantum-computing scientific-computing symplectic-geometry jax python research

set_repo "duma-boko-contradiction-engine-v2" \
  "Source-traceable evidence and promise-delivery divergence analysis for governance research." \
  "${PORTFOLIO_URL}#systems" \
  evidence governance research source-tracing auditability python botswana

set_repo "codebase-prompting" \
  "Repository traversal and context packaging utilities for AI-assisted codebase analysis." \
  "${PORTFOLIO_URL}#systems" \
  codebase-analysis developer-tools ai python repository-context

printf '\n=== COMPLETED ===\n'
printf 'Profile: https://github.com/%s\n' "${OWNER}"
printf 'Portfolio: %s\n' "${PORTFOLIO_URL}"
printf '\nManual GitHub step: review and pin the flagship repositories on the profile page.\n'
