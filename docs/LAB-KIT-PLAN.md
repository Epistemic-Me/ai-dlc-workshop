# Lab kit plan

This plan lists the lab kit items that the course deck promises for this repo and that the repo does not have yet. Each item stays small. Each item names the lab that uses it.

All data in the lab kit is mock data. Recorded runs and costs are illustrative sample data, not measurements. Nothing calls a network service.

## What exists today

- The store: auth, search, checkout, and billing domains with mock providers, services, tests, API routes, and pages.
- `AGENTS.md`, `CLAUDE.md`, `docs/.context/` (tree and registers), `docs/specs/`, `prompts/`.
- Skills: `.claude/skills/ost-bootstrap/` and `.claude/skills/create-tickets/`.
- CI: lint, typecheck, test, and build on every push and pull request.

## Target tree

```
ai-dlc-workshop/
  src/app/ src/domains/      auth, search, checkout, billing (exists)
  src/lib/ src/db/           shared helpers; new data-access layer
  src/legacy/                old data-access layer, halfway migrated
  src/support-agent/         support agent with a mock LLM provider
  .claude/commands/ .cursor/ .codex/ .github/prompts/
  .claude/skills/verify/ ost-bootstrap/ create-tickets/
  docs/.context/ docs/prs/
  .github/workflows/pr-docs-gate.yml
  backlog/ meetings/
  costlog/recorded-before-runs/
  arena/MIGRATE-04/
```

## Items

### a. Seeded backlog (`backlog/`, `scripts/seed-issues.sh`)

Used by: Lab 1 (BUG-01, REFACTOR-03, MIGRATE-04), Lab 2 (BUG-01 runs, MIGRATE-04 arena), Lab 3 (LEGACY-06), the worked example (FEAT-02).

| Ticket | Kind | What is in the code |
|---|---|---|
| BUG-01 | Bug | Checkout accepts the same product on two cart lines, so the 99-per-product limit can be passed. The bug is real and no test covers it. |
| FEAT-02 | Feature | Save a cart for later. Not built. |
| REFACTOR-03 | Refactor | The billing, checkout, orders, and support routes each copy the same session lookup. |
| MIGRATE-04 | Schema migration | Order lines live in a JSON text column. Move them to an `order_lines` table with a rollback. |
| FLAKY-05 | Flaky test | A repository test uses the real clock and fails when two inserts land in the same millisecond. It is skipped unless `RUN_FLAKY=1`, so CI stays green. |
| LEGACY-06 | Legacy migration | Four call sites still read orders through `src/legacy/`. Move them to `src/db/` one at a time. |

Each ticket is one Markdown file with the problem, the acceptance criteria, and the scope. `scripts/seed-issues.sh` creates them as GitHub issues with `gh`. Nobody runs it from this repo; a facilitator runs it on a fork.

### b. Legacy module and seeded tech debt (`src/db/`, `src/legacy/`)

Used by: Lab 1 (thin context file), Lab 2 (swarm), Lab 3 (LEGACY-06, characterization tests).

- `src/db/`: an in-memory database with a schema version, migration `001` (up and down), and an `OrderRepository` (integer cents, newest first, empty list when there are no rows).
- `src/legacy/`: the old order data-access layer over the same store. It keeps old habits on purpose: it returns `null` instead of an empty list, sorts by ID text, returns dollars as floats, and throws on an empty ID. It has one thin test.
- Checkout writes orders through the new layer. Reads still go through the legacy layer in four call sites: two in the order history route and two in the support agent tools. That is the "halfway" state.
- Seeded tech debt for the Lab 2 swarm: a deprecated `jsonError` helper in `src/lib/http.ts`, used once in each domain's route. An ESLint rule at `warn` level flags each use, so `npm run lint` still passes.
- Thin context files: `AGENTS.md` keeps what the repo is, where things live, and the Lab 2 ownership table. It does not say how to run the tests, the main architecture rule, or what agents get wrong; Lab 1 adds those three lines. The full conventions move to `docs/.context/ARCHITECTURE.md`, so they stay accurate and findable.

### c. Ten merged PRs with docs, and the PR commands (`docs/prs/`, command folders)

Used by: Lab 1 (`/start-pr`, `/execute-pr`, `/review-pr`), Lab 3 (labeling ten PRs good or bad against the spec checklist).

- `docs/prs/_TEMPLATE/`: the five docs: `RESEARCH.md`, `TEST-STRATEGY.md`, `IMPLEMENTATION-PLAN.md`, `IMPLEMENTATION.md`, `REVIEW.md`.
- `docs/prs/planning/`, `docs/prs/implementing/`, `docs/prs/_archive/`: the lifecycle folders.
- `docs/prs/_archive/`: ten example merged PRs about this repo's own history, each with the five docs, kept short. Some meet the spec checklist and some miss it on purpose. The docs do not say which; a facilitator key is in `docs/facilitator/pr-labels.md`.
- `docs/SPEC-CHECKLIST.md`: the Module 1 spec checklist that the labels use.
- The three commands take a ticket ID (`/start-pr BUG-01 <short-name>`), with a plain-language fallback under each one:
  - `.claude/commands/` (Claude Code)
  - `.cursor/commands/` and `.cursor/rules/` (Cursor)
  - `.codex/prompts/` (Codex)
  - `.github/prompts/*.prompt.md` and `.github/copilot-instructions.md` (Copilot)

### d. Recorded runs and costs (`costlog/`, `arena/MIGRATE-04/`)

Used by: Lab 2 (baseline, arena).

- `costlog/README.md`: what to log for each task (tokens or requests, agent wall-clock time, review minutes, rework minutes, re-review) and a CSV template.
- `costlog/recorded-before-runs/BUG-01/`: the recorded BUG-01 "before" run: its plan, its diff, and its logged cost. The deck uses it as the Lab 2 baseline.
- `arena/MIGRATE-04/`: three recorded attempts at MIGRATE-04 from the same brief. Each attempt has a summary, a real diff against a named base commit, its test result, and its logged cost. The attempts differ on purpose in reversibility, blast radius, and test coverage, so the rubric has something to separate.
- Every file carries the label "Illustrative sample data".

### e. Verification skill (`.claude/skills/verify/SKILL.md`)

Used by: Lab 3 (migrate with evidence).

A skill that tells an agent how to prove each acceptance criterion in this store: how to start the app, a feature map (route or page, how to drive it, what evidence to capture), and the evidence rules (test output, a response body, or stored rows; say so when there is no evidence).

### f. Support agent (`src/support-agent/`)

Used by: the running example ("a customer support agent inside it"), LEGACY-06 call sites.

- An `LlmProvider` interface and a `MockLlmProvider` that is deterministic and makes no network call.
- A small agent loop with three tools: look up the user's orders, search products, and read the user's plan.
- `POST /api/support` with `{ message }`.
- Tests for each tool path, for the step limit, and for the rule that a user never sees another user's orders.

### g. PR docs gate (`.github/workflows/pr-docs-gate.yml`, `scripts/pr-docs-check.mjs`)

Used by: Lab 1 (review step), the 30-day plan.

- Runs on `pull_request` only, so a push to `main` never runs it.
- Finds the PR docs folder from the branch name (`feature/pr-<ticket>-<slug>`).
- Blocks when `RESEARCH.md`, `TEST-STRATEGY.md`, or `IMPLEMENTATION-PLAN.md` is missing or empty. `IMPLEMENTATION.md` and `REVIEW.md` are advisory.
- Exempts docs-only changes, dependency bumps, and small changes under a line limit the team sets (default 20 changed lines).
- Prints a table of pass and fail checks to the job summary and posts it as one PR comment. The comment step does not fail the job when the token cannot write (for example, on a fork).
- The script is Node so the repo needs one runtime. It has unit tests.

### h. Meeting transcript (`meetings/`)

Used by: optional `/create-tickets --dry-run` after Lab 4.

One short sample transcript with a bug, a feature request, a decision, a committed action, an item an existing ticket already covers (FEAT-02), an item that does not map to the tree, and chatter to skip.

### i. README and docs

Update the README tree, the AI DLC table (the PR docs in `docs/prs/` replace the old `docs/plans/` and `docs/reviews/` paths), the prompts, and `docs/.context/` with the new items.

## Branches

Built last, from the final `main`, and kept local:

| Branch | Harness |
|---|---|
| `walk` | Context files, the three PR commands, and the docs gate. `/review-pr` reviews in the same session. No decision records. |
| `run` | `walk`, plus `/review-pr` that starts a fresh reviewer from a second model family, decision records in `docs/decisions/`, and `docs/.context/CURRENT_SPRINT.md`. This matches `main`. |
| `sprint` | `run`, plus optional extras: an alignment-scoring step in `/review-pr` and a small command library for research, planning, and handoffs. The scoring step skips cleanly when no key is set. |

The lab kit (backlog, legacy module, recorded runs, support agent, verification skill) is on all three branches, because every lab needs it.

## Checks for every item

`npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` pass after each item. Each item is one commit on `main`.
