# AGENTS.md

Rules for any coding agent working in this repo (Claude Code, Codex, Cursor, Copilot, or others).

## What this repo is

A Next.js 15 (App Router, React 19, TypeScript) example store with four domains: auth, search, checkout, billing. Each domain uses an in-memory mock provider. There is no database, no network call, no `.env`, and no secret.

## Commands

```bash
npm install          # install
npm run dev          # dev server on http://localhost:3000
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Vitest
npm run build        # production build
```

A change is done only when lint, typecheck, test, and build all pass. Run them and read the output. Do not report a result you did not run.

## Domain layout

Every domain under `src/domains/<name>/` has the same files:

| File | Purpose |
|---|---|
| `types.ts` | Domain types and the provider interface |
| `provider.ts` | In-memory mock provider with seed data |
| `service.ts` | Business rules. Takes a provider in the constructor. |
| `service.test.ts` | Unit tests for the service |
| `index.ts` | Public exports and the shared service instance |

API route handlers live in `src/app/api/<name>/`. They parse input, call the service, and map errors to HTTP status codes. Business rules go in the service, not the route.

## Conventions

- TypeScript strict mode. No `any`.
- Services return `Result<T>` (`{ ok: true, value }` or `{ ok: false, error: { code, message } }`) for expected failures. Do not throw for input errors.
- Money is integer cents. Never use floats for stored amounts.
- Inject time and ID generators (`now`, `createId`, `createToken`) so tests are deterministic.
- Import another domain only through its `index.ts` (`@/domains/<name>`). Never import its `provider.ts` or `service.ts`.
- Pages and components import domain **types** only, never services. They call the API routes.
- Add or update tests in the same change as the code.
- No new dependencies without the lead's approval.
- No secrets, API keys, or real customer data in the repo. Mock data uses `example.com` addresses.

## Domain ownership (Lab 2 swarm)

| Owner | Files |
|---|---|
| auth agent | `src/domains/auth/`, `src/app/api/auth/`, `src/app/login/`, `docs/specs/auth.md` |
| search agent | `src/domains/search/`, `src/app/api/search/`, `src/app/page.tsx`, `docs/specs/search.md` |
| checkout agent | `src/domains/checkout/`, `src/app/api/checkout/`, `src/app/checkout/`, `docs/specs/checkout.md` |
| billing agent | `src/domains/billing/`, `src/app/api/billing/`, `src/app/billing/`, `docs/specs/billing.md` |
| lead (human) | everything else: `src/domains/errors.ts`, `src/domains/singleton.ts`, `src/lib/`, `src/app/layout.tsx`, `src/app/globals.css`, config, `package.json`, `docs/.context/` |

If you are a domain agent:

- Edit only files you own.
- If you need a change in a file you do not own, stop and put the request in your final report. Say which file, what change, and why.
- If you change your domain's public exports in `index.ts`, list the change in your final report so other agents can adapt.

## AI DLC steps

Work in this order. Write each step's output to disk.

1. **Spec**: Read or write `docs/specs/<domain>.md`. It states the behavior, the acceptance criteria, and the outcome it serves in `docs/.context/ost/`.
2. **Plan**: Write a plan before code: files to change, tests to add, risks. Wait for approval if a person is in the loop.
3. **Execute**: Implement inside your owned files. Tests first or alongside.
4. **Review**: Run lint, typecheck, test, build. Review the diff against the spec. Record findings and fixes.
5. **Learn**: Update `docs/.context/registers/` with what the change taught: which assumption held, which did not.

## Where things live

- Specs: `docs/specs/`
- Opportunity Solution Tree and registers: `docs/.context/`
- Skills: `.claude/skills/` (`ost-bootstrap`, `create-tickets`)
- Prompts per tool: `prompts/`
