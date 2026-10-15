<p align="center"><img src="public/clarity-logo.png" width="360" alt="Clarity"></p>

# AI DLC Workshop (Track A)

A small Next.js store you can change with AI coding agents. It has four domains (auth, search, checkout, billing), a customer support agent, and an orders data layer halfway through a migration. Every provider is an in-memory mock. It needs no `.env`, no network, and no secrets.

The workshop uses this repo to practice the AI development lifecycle (AI DLC): **Spec → Plan → Execute → Review → Learn**.

## This branch

`sprint` includes the run scaffold. `/review-pr` can score stakeholder alignment through Clarity when `CLARITY_API_KEY` and the external scoring setup are present. It records a skip when the key is absent. Research, planning, and handoff commands are available for all four tools. [PR #001](docs/prs/_archive/2026-09-01-PR-001-search-tag-match/RESEARCH.md) is the worked example.

The optional scorer uses `CLARITY_API_PATH/scripts/compound.py` and stakeholder configuration in `scripts/compound_config.py` or `.stakeholders.json`. Keep credentials outside the repo. The normal review and docs gate work without them.

## Run it

```bash
git clone https://github.com/Epistemic-Me/ai-dlc-workshop.git && cd ai-dlc-workshop && npm install && npm run dev
```

Open http://localhost:3000.

Demo login: `ada@example.com` / `demo-password`. These are fake values in the mock provider, not real credentials. Data lives in memory and resets when the server restarts.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals` + `next/typescript`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests |

CI (`.github/workflows/ci.yml`) runs `npm ci`, lint, typecheck, test, and build on Node 22 for every push and pull request. The PR docs gate (`.github/workflows/pr-docs-gate.yml`) runs on pull requests only.

`npm run lint` prints four warnings about `jsonError`. They are seeded on purpose for the Lab 2 swarm.

## What is in the lab kit

| Item | Where | Used in |
|---|---|---|
| Seeded backlog: BUG-01, FEAT-02, REFACTOR-03, MIGRATE-04, FLAKY-05, LEGACY-06 | `backlog/`, `scripts/seed-issues.sh` | All labs |
| Thin context files, with the full conventions kept separately | `AGENTS.md`, `CLAUDE.md`, `docs/.context/ARCHITECTURE.md` | Lab 1 |
| Three PR commands for four tools | `.claude/commands/`, `.cursor/`, `.codex/`, `.github/prompts/` | Lab 1 |
| PR doc templates and the docs gate | `docs/prs/_TEMPLATE/`, `scripts/pr-docs-check.mjs` | Lab 1 |
| Spec checklist | `docs/SPEC-CHECKLIST.md` | Lab 1, Lab 3 |
| Cost log and the recorded BUG-01 "before" run | `costlog/` | Lab 2 |
| Three recorded MIGRATE-04 attempts | `arena/MIGRATE-04/` | Lab 2 |
| Seeded lint class: a deprecated helper used once per domain | `src/lib/http.ts`, `eslint.config.mjs` | Lab 2 |
| Legacy data-access layer, halfway migrated, with thin tests | `src/legacy/`, `src/db/` | Lab 3 |
| Verification skill | `.claude/skills/verify/` | Lab 3 |
| Ten merged PRs with their docs | `docs/prs/_archive/` | Lab 3 |
| Customer support agent with a mock LLM provider | `src/support-agent/`, `POST /api/support` | Running example, Lab 3 |
| Team skills `/ost-bootstrap` and `/create-tickets`, and a sample transcript | `.claude/skills/`, `meetings/` | After Lab 4 |
| Facilitator keys (PR labels, arena) | `docs/facilitator/` | Facilitators |

Recorded runs and costs are illustrative sample data, and each file says so.

## The AI DLC in this repo

| Step | What you do | Where it lives in this repo |
|---|---|---|
| **Spec** | Write what the change must do and how you will know it works. Tie it to an outcome and opportunity in the Opportunity Solution Tree. | `backlog/<TICKET>.md`, `docs/specs/<domain>.md`, `docs/.context/ost/`, `docs/SPEC-CHECKLIST.md` |
| **Plan** | `/start-pr <TICKET> <short-name>` creates the branch and the PR docs. Write the research, the test strategy, and the plan before any code. | `docs/prs/planning/<date>-PR-<TICKET>-<short-name>/`: `RESEARCH.md`, `TEST-STRATEGY.md`, `IMPLEMENTATION-PLAN.md` |
| **Execute** | `/execute-pr <TICKET>` implements the plan one step at a time and logs each step. | `docs/prs/implementing/.../IMPLEMENTATION.md`, the code |
| **Review** | `/review-pr <TICKET>` runs a fresh reviewer from a second model family against the test strategy, with evidence per criterion, then the docs gate. A person merges. | `REVIEW.md`, `.claude/skills/verify/`, `scripts/pr-docs-check.mjs` |
| **Learn** | Record what the change taught: which assumption held, which did not, and any decision. | `docs/.context/registers/`, `docs/decisions/`, `docs/prs/_archive/` |

`docs/REVIEW.md` is the review log for the repo itself.

## The PR commands

The commands take a ticket ID: `/start-pr BUG-01 <short-name>`, `/execute-pr BUG-01`, `/review-pr BUG-01`. Each command file has a plain-language fallback under it.

| Tool | Where | How to run |
|---|---|---|
| Claude Code | `.claude/commands/` | `/start-pr BUG-01 <short-name>` in the session |
| Codex | `.codex/prompts/` | Copy them to `~/.codex/prompts/` (see `.codex/README.md`), or paste the text |
| Cursor | `.cursor/commands/`, rule in `.cursor/rules/` | `/start-pr` in Agent mode |
| Copilot | `.github/prompts/`, `.github/copilot-instructions.md` | `/start-pr` in VS Code chat, agent mode |

The PR docs gate blocks a pull request when `RESEARCH.md`, `TEST-STRATEGY.md`, or `IMPLEMENTATION-PLAN.md` is missing or still a template. `IMPLEMENTATION.md` and `REVIEW.md` are advisory. Docs-only changes, dependency bumps, and changes of 20 lines or fewer are exempt. Run it locally with `node scripts/pr-docs-check.mjs --ticket BUG-01`.

Copy-paste prompts for each AI DLC step, and for the Lab 2 swarm, are in `prompts/`.

## Lab 2: agent swarm

In Lab 2 you run four agents at the same time, one per domain. Each agent owns its files and does not edit files that another agent owns. This lets them work in parallel without merge conflicts.

| Agent | Owns | Must not edit |
|---|---|---|
| auth | `src/domains/auth/`, `src/app/api/auth/`, `src/app/login/`, `docs/specs/auth.md`, its PR docs | other domains |
| search | `src/domains/search/`, `src/app/api/search/`, `src/app/page.tsx`, `docs/specs/search.md`, its PR docs | other domains |
| checkout | `src/domains/checkout/`, `src/app/api/checkout/`, `src/app/api/orders/`, `src/app/checkout/`, `docs/specs/checkout.md`, its PR docs | other domains |
| billing | `src/domains/billing/`, `src/app/api/billing/`, `src/app/billing/`, `docs/specs/billing.md`, its PR docs | other domains |

Shared files have no agent owner. Only the lead (you) changes them: `src/domains/errors.ts`, `src/domains/singleton.ts`, `src/lib/`, `src/db/`, `src/legacy/`, `src/support-agent/`, `src/app/layout.tsx`, `src/app/globals.css`, config files, and `package.json`. If an agent needs a shared change, it writes the request in its final report and stops. The registers in `docs/.context/registers/` are shared too: agents report the rows, and the lead adds them after the merge.

Cross-domain calls go through a domain's `index.ts` only. For example, checkout reads prices through `@/domains/search`, not through search internals.

The seeded swarm task: each domain's route imports the deprecated `jsonError` helper once, and ESLint warns on each import. One worker per domain moves its route to `errorResponse` or `invalidJson`, proves it with that domain's tests, and reports.

How to run it:

1. Give each agent its own git worktree or branch.
2. Paste the Lab 2 prompt from `prompts/<tool>.md` and set the domain name.
3. Each agent runs `npm test` and `npm run typecheck` before it reports done.
4. You merge the branches, then run the full check list once.

See `AGENTS.md` for the rules agents follow.

## Branches

| Branch | Harness |
|---|---|
| `main` | Everything in this README. |
| `walk` | Context files, the three PR commands, and the docs gate. `/review-pr` reviews in the same tool. |
| `run` | `walk`, plus `/review-pr` with a fresh reviewer from a second model family, decision records in `docs/decisions/`, and `docs/.context/CURRENT_SPRINT.md`. |
| `sprint` | `run`, plus optional extras: an alignment-scoring step that skips cleanly without a key, and commands for research, planning, and handoffs. |

The lab kit is on every branch. Walk and run need nothing beyond your agent. The sprint branch is optional.

## Folder tree

```
ai-dlc-workshop/
├── .claude/
│   ├── commands/            /start-pr, /execute-pr, /review-pr
│   └── skills/              verify, ost-bootstrap, create-tickets
├── .codex/prompts/          the same three commands for Codex
├── .cursor/                 commands/ and rules/ for Cursor
├── .github/
│   ├── prompts/             the same three commands for Copilot
│   ├── copilot-instructions.md
│   └── workflows/           ci.yml, pr-docs-gate.yml
├── arena/MIGRATE-04/        three recorded attempts for the Lab 2 arena
├── backlog/                 seeded tickets
├── costlog/                 cost log and recorded-before-runs/
├── docs/
│   ├── .context/            ARCHITECTURE.md, CURRENT_SPRINT.md, tree and registers
│   ├── decisions/           decision records
│   ├── facilitator/         keys for the labeling step and the arena
│   ├── prs/                 _TEMPLATE/, planning/, implementing/, _archive/ (ten example PRs)
│   ├── specs/               one spec per domain
│   ├── LAB-KIT-PLAN.md      plan for the lab kit
│   ├── PLAN.md              first plan for this repo
│   ├── REVIEW.md            review log for this repo
│   └── SPEC-CHECKLIST.md    the Module 1 spec checklist
├── meetings/                sample transcript for /create-tickets
├── prompts/                 copy-paste prompts per tool and DLC step
├── public/clarity-logo.png
├── scripts/                 seed-issues.sh, pr-docs-check.mjs
├── src/
│   ├── app/
│   │   ├── page.tsx         / (product search)
│   │   ├── login/           /login
│   │   ├── checkout/        /checkout
│   │   ├── billing/         /billing
│   │   └── api/             auth, search, checkout, orders, billing, support
│   ├── domains/             auth, search, checkout, billing
│   ├── db/                  in-memory tables, migrations, OrderRepository
│   ├── legacy/              old order data-access layer (LEGACY-06)
│   ├── support-agent/       support agent and mock LLM provider
│   └── lib/                 shared HTTP and client helpers
├── AGENTS.md                rules for coding agents (thin on purpose)
├── CLAUDE.md                points Claude Code to AGENTS.md
└── LICENSE                  MIT
```

## License

MIT. See `LICENSE`.
