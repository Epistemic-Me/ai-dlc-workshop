# AGENTS.md

Rules for any coding agent working in this repo (Claude Code, Codex, Cursor, Copilot, or others).

## What this repo is

A Next.js 15 (App Router, React 19, TypeScript) example store with four domains: auth, search, checkout, billing. Each domain uses an in-memory mock provider. There is no database server, no network call, no `.env`, and no secret.

## Where things live

- Domains: `src/domains/<name>/`. API routes: `src/app/api/<name>/`. Pages: `src/app/`.
- Orders data: `src/db/` (new layer) and `src/legacy/` (old layer, being replaced).
- Architecture, conventions, and commands: `docs/.context/ARCHITECTURE.md`.
- Specs: `docs/specs/`. Opportunity Solution Tree and registers: `docs/.context/`.
- Tickets: `backlog/`. Skills: `.claude/skills/`. Prompts per tool: `prompts/`.

This file is short on purpose. In Lab 1 you add three lines here: how to run the tests, the one architecture rule that matters most, and one thing agents get wrong in this repo.

## Domain ownership (Lab 2 swarm)

| Owner | Files |
|---|---|
| auth agent | `src/domains/auth/`, `src/app/api/auth/`, `src/app/login/`, `docs/specs/auth.md`, `docs/plans/auth-*.md`, `docs/reviews/auth-*.md` |
| search agent | `src/domains/search/`, `src/app/api/search/`, `src/app/page.tsx`, `docs/specs/search.md`, `docs/plans/search-*.md`, `docs/reviews/search-*.md` |
| checkout agent | `src/domains/checkout/`, `src/app/api/checkout/`, `src/app/api/orders/`, `src/app/checkout/`, `docs/specs/checkout.md`, `docs/plans/checkout-*.md`, `docs/reviews/checkout-*.md` |
| billing agent | `src/domains/billing/`, `src/app/api/billing/`, `src/app/billing/`, `docs/specs/billing.md`, `docs/plans/billing-*.md`, `docs/reviews/billing-*.md` |
| lead (human) | everything else: `src/domains/errors.ts`, `src/domains/singleton.ts`, `src/lib/`, `src/db/`, `src/legacy/`, `src/app/layout.tsx`, `src/app/globals.css`, config, `package.json`, `docs/.context/` |

If you are a domain agent:

- Edit only files you own.
- If you need a change in a file you do not own, stop and put the request in your final report. Say which file, what change, and why.
- If you change your domain's public exports in `index.ts`, list the change in your final report so other agents can adapt.
- Do not edit `docs/.context/registers/`. Put the register rows you want (spec state, node state, evidence) in your final report. The lead adds them after the merge, so four agents do not edit the same file.

## AI DLC steps

Work in this order. Write each step's output to disk.

1. **Spec**: Read or write `docs/specs/<domain>.md`. It states the behavior, the acceptance criteria, and the outcome it serves in `docs/.context/ost/`. Add a row to `docs/.context/registers/spec-register.md` (in a swarm, put the row in your final report instead).
2. **Plan**: Write a plan to `docs/plans/<domain>-<short-name>.md` before code: files to change, tests to add, risks. Wait for approval if a person is in the loop.
3. **Execute**: Implement inside your owned files. Tests first or alongside.
4. **Review**: Run lint, typecheck, test, build. Review the diff against the spec. Record findings and fixes in `docs/reviews/<domain>-<short-name>.md`.
5. **Learn**: Update `docs/.context/registers/` with what the change taught: which assumption held, which did not. In a swarm, the lead does this after the merge from the rows in each final report.

