#!/usr/bin/env bash
set -euo pipefail

VERSION="1.0.0"

usage() {
  cat <<'EOF'
Agent Workflow Kit

Usage:
  ./agent-workflow.sh init [project-name]
  ./agent-workflow.sh work-item <slug> "<title>"
  ./agent-workflow.sh handoff [slug]
  ./agent-workflow.sh prompt <plan|implement|verify|review|handoff> [work-item-file]
  ./agent-workflow.sh status
  ./agent-workflow.sh help

Examples:
  ./agent-workflow.sh init safari-wheels
  ./agent-workflow.sh work-item account-lock "Add account-lock observability"
  ./agent-workflow.sh prompt implement docs/work-items/WI-001-account-lock.md
  ./agent-workflow.sh handoff account-lock
EOF
}

die() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

require_git_repo() {
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 ||
    die "Run this command inside a Git repository."
}

next_work_item_number() {
  local max=0 file n
  shopt -s nullglob
  for file in docs/work-items/WI-[0-9][0-9][0-9]-*.md; do
    n="$(basename "$file" | sed -E 's/^WI-([0-9]{3})-.*/\1/' | sed 's/^0*//')"
    n="${n:-0}"
    (( n > max )) && max="$n"
  done
  printf '%03d' "$((max + 1))"
}

init_project() {
  require_git_repo
  local project="${1:-$(basename "$PWD")}"

  mkdir -p docs/{decisions,work-items,handoffs,prompts}

  if [[ ! -f AGENTS.md ]]; then
    cat > AGENTS.md <<EOF
# Repository Instructions

## Project

- Name: ${project}
- Treat the repository and executable tests as the source of truth for implementation state.
- Treat approved specifications and ADRs as the source of truth for intent.

## Before editing

1. Read the assigned work item.
2. Inspect relevant implementation and tests.
3. Report conflicts between the repository and the work item.
4. State the exact files you expect to modify.
5. Run the narrowest relevant existing tests.

## During implementation

- Implement only the assigned work item.
- Do not silently change public interfaces, schemas, or business rules.
- Do not modify unrelated files.
- Do not add dependencies without documenting the reason.
- Prefer small, reviewable changes.

## Verification

Before declaring completion:

1. Run formatting and linting.
2. Run type checking where applicable.
3. Run focused tests.
4. Run the broader test suite when practical.
5. Map every acceptance criterion to evidence.

## Completion report

Include:

- Files changed
- Commands executed
- Test results
- Deviations from the work item
- Residual risks
- Recommended next work item
EOF
  fi

  if [[ ! -f CLAUDE.md ]]; then
    cat > CLAUDE.md <<'EOF'
# Claude Code Instructions

Read and follow `AGENTS.md` as the canonical repository instruction file.

Keep this file intentionally small. Put durable project rules in `AGENTS.md`,
feature intent in `docs/product-spec.md`, technical rationale in ADRs, and
bounded implementation tasks in `docs/work-items/`.
EOF
  fi

  if [[ ! -f docs/product-spec.md ]]; then
    cat > docs/product-spec.md <<EOF
# ${project}: Product Specification

## Problem

Describe the user or business problem.

## Objective

Describe the measurable outcome.

## Users and actors

- Primary user:
- Secondary actors:

## Required behaviour

1.
2.
3.

## Business rules

- 

## Non-goals

- 

## Edge cases

- 

## Acceptance criteria

- [ ] AC-01:
- [ ] AC-02:

## Open questions

- 
EOF
  fi

  if [[ ! -f docs/architecture.md ]]; then
    cat > docs/architecture.md <<'EOF'
# Architecture

## System context

Describe the system boundary and external dependencies.

## Components

| Component | Responsibility | Owner/source of truth |
|---|---|---|
| | | |

## Data flow

Describe the main request/event flow.

## Constraints

- 

## Verification commands

```bash
# Install
# Lint
# Type check
# Focused tests
# Full tests
```
EOF
  fi

  if [[ ! -f docs/current-state.md ]]; then
    cat > docs/current-state.md <<'EOF'
# Current State

Last updated: YYYY-MM-DD

## Completed

- 

## In progress

- 

## Blocked

- 

## Known defects

- 

## Next recommended work item

- 
EOF
  fi

  if [[ ! -f docs/work-items/index.md ]]; then
    cat > docs/work-items/index.md <<'EOF'
# Work Items

| ID | Title | Status | Dependencies |
|---|---|---|---|
EOF
  fi

  cat > docs/prompts/plan.md <<'EOF'
Do not implement production code.

Read `AGENTS.md`, `docs/product-spec.md`, `docs/architecture.md`, relevant ADRs,
and inspect the repository.

Produce a bounded implementation plan. Separate:
- confirmed facts;
- assumptions;
- unresolved questions;
- superseded decisions.

Decompose the work into independently executable work items. Each work item
must have one primary outcome, explicit scope, dependencies, acceptance
criteria, verification commands, and a definition of done.
EOF

  cat > docs/prompts/implement.md <<'EOF'
Implement only the assigned work item.

Before editing:
1. Read `AGENTS.md`, the assigned work item, linked specification sections,
   and linked ADRs.
2. Inspect the current implementation and tests.
3. Report any conflict between the repository and the work item.
4. State the exact files you expect to modify.

During implementation:
- Keep scope bounded.
- Do not silently alter contracts or unrelated code.
- Add or update tests for every acceptance criterion.

At completion, report files changed, commands run, results, deviations,
residual risks, and the next recommended work item.
EOF

  cat > docs/prompts/verify.md <<'EOF'
Verify the assigned work item against every acceptance criterion.

For each criterion provide:
- supporting code location;
- test or executable check;
- command executed;
- actual result;
- residual risk.

Do not treat code inspection alone as proof when an executable check is
possible. Do not modify production code unless explicitly instructed.
EOF

  cat > docs/prompts/review.md <<'EOF'
Act as an independent reviewer.

Read the specification, relevant ADRs, assigned work item, and Git diff.
Do not assume the implementation is correct.

Review for:
- requirement mismatches;
- correctness and edge cases;
- security or data-integrity risks;
- concurrency issues;
- insufficient tests;
- unnecessary scope expansion;
- backward compatibility;
- maintainability.

Return findings ordered by severity with file and line references.
EOF

  cat > docs/prompts/handoff.md <<'EOF'
Prepare a durable handoff. Do not implement new functionality.

Inspect the repository; do not rely only on chat history. Record:
1. Objective
2. Current implementation status
3. Confirmed decisions
4. Files changed
5. Tests and commands run
6. Known defects
7. Incomplete work
8. Superseded decisions
9. Risks and assumptions
10. Best next work item

Clearly distinguish confirmed facts, assumptions, unresolved questions, and
historical decisions that are no longer valid.
EOF

  printf 'Initialized agent workflow files for %s.\n' "$project"
}

new_work_item() {
  require_git_repo
  [[ $# -ge 2 ]] || die 'Usage: work-item <slug> "<title>"'

  local slug="$1"
  local title="$2"
  local number today file
  number="$(next_work_item_number)"
  today="$(date +%F)"
  file="docs/work-items/WI-${number}-${slug}.md"

  [[ ! -e "$file" ]] || die "$file already exists."

  cat > "$file" <<EOF
# WI-${number}: ${title}

Status: Proposed  
Created: ${today}

## Objective

Describe one primary outcome.

## Context

Why this work is needed and where it fits.

## Inputs

- \`AGENTS.md\`
- \`docs/product-spec.md\`
- \`docs/architecture.md\`
- Relevant ADRs:
- Relevant source files:

## Dependencies

- None

## Required changes

- 

## Allowed scope

- 

## Out of scope

- 

## Constraints

- 

## Acceptance criteria

- [ ] AC-01:
- [ ] AC-02:

## Verification

\`\`\`bash
# Add exact commands
\`\`\`

Expected evidence:

- 

## Definition of done

- [ ] Required implementation is complete.
- [ ] Acceptance criteria have executable evidence.
- [ ] Focused tests pass.
- [ ] Type checking/linting passes where applicable.
- [ ] No unrelated files were changed.
- [ ] \`docs/current-state.md\` is updated.
EOF

  printf '| WI-%s | %s | Proposed | None |\n' "$number" "$title" >> docs/work-items/index.md
  printf 'Created %s\n' "$file"
}

new_handoff() {
  require_git_repo
  mkdir -p docs/handoffs
  local slug="${1:-session}"
  local stamp file branch commit
  stamp="$(date +%Y-%m-%d-%H%M)"
  file="docs/handoffs/HANDOFF-${stamp}-${slug}.md"
  branch="$(git branch --show-current 2>/dev/null || true)"
  commit="$(git rev-parse --short HEAD 2>/dev/null || true)"

  cat > "$file" <<EOF
# Handoff: ${slug}

Created: $(date -Iseconds)  
Branch: ${branch:-unknown}  
Commit: ${commit:-uncommitted}

## Objective

- 

## Current implementation status

### Completed

- 

### In progress

- 

### Not started

- 

## Confirmed decisions

- 

## Assumptions

- 

## Unresolved questions

- 

## Superseded decisions

- 

## Files changed

\`\`\`text
$(git status --short 2>/dev/null || true)
\`\`\`

## Verification performed

| Command | Result |
|---|---|
| | |

## Known defects and risks

- 

## Best next work item

- 

## Fresh-session startup instructions

Read:

1. \`AGENTS.md\`
2. \`docs/product-spec.md\`
3. Relevant ADRs
4. The assigned work item
5. This handoff only when historical state is necessary

Do not depend on the retired chat session.
EOF

  printf 'Created %s\n' "$file"
}

print_prompt() {
  [[ $# -ge 1 ]] || die "Usage: prompt <plan|implement|verify|review|handoff> [work-item-file]"
  local kind="$1"
  local item="${2:-}"
  local prompt_file="docs/prompts/${kind}.md"
  [[ -f "$prompt_file" ]] || die "Unknown prompt '$kind'."

  cat "$prompt_file"
  if [[ -n "$item" ]]; then
    printf '\n\nAssigned work item: `%s`\n' "$item"
  fi
}

show_status() {
  require_git_repo
  printf 'Branch: %s\n' "$(git branch --show-current)"
  printf 'Commit: %s\n\n' "$(git rev-parse --short HEAD)"
  git status --short
  printf '\nWork items:\n'
  if [[ -f docs/work-items/index.md ]]; then
    cat docs/work-items/index.md
  else
    printf 'Workflow not initialized. Run: ./agent-workflow.sh init\n'
  fi
}

main() {
  local command="${1:-help}"
  shift || true

  case "$command" in
    init) init_project "$@" ;;
    work-item) new_work_item "$@" ;;
    handoff) new_handoff "$@" ;;
    prompt) print_prompt "$@" ;;
    status) show_status ;;
    help|-h|--help) usage ;;
    version|--version) printf '%s\n' "$VERSION" ;;
    *) die "Unknown command: $command" ;;
  esac
}

main "$@"
