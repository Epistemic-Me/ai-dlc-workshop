# Plan: ai-dlc-workshop (Track A)

This plan was written before any code. It defines the file tree, the four domains, and the test plan.

## Goal

A small open-source Next.js app that workshop participants clone, run, and change with AI coding agents. It is shaped like a product with four domains so that a swarm of agents can each own one domain without file conflicts.

## Constraints

- TypeScript, Next.js 15.x (App Router), React 19.
- `npm install && npm run dev` works with no `.env`, no network calls, and no secrets.
- Each domain uses an in-memory mock provider.
- Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`.
- ESLint flat config with `next/core-web-vitals` and `next/typescript`.
- CI on push and pull request: Node 22, `npm ci`, lint, typecheck, test, build.
- No client names in app text, docs, or skills. The logo, the license holder, and the clone URL name the repo owner only. No time estimates.

## File tree

```
ai-dlc-workshop/
├── .claude/skills/
│   ├── create-tickets/SKILL.md
│   └── ost-bootstrap/SKILL.md
├── .github/workflows/ci.yml
├── docs/
│   ├── PLAN.md
│   ├── REVIEW.md
│   ├── .context/
│   │   ├── README.md
│   │   ├── ost/example-ost.md
│   │   └── registers/
│   │       ├── ost-register.md
│   │       └── spec-register.md
│   └── specs/
│       ├── auth.md
│       ├── billing.md
│       ├── checkout.md
│       └── search.md
├── prompts/
│   ├── claude-code.md
│   ├── codex.md
│   ├── copilot.md
│   └── cursor.md
├── public/clarity-logo.png          (README logo)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx                 (/ product search)
│   │   ├── login/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── billing/page.tsx
│   │   └── api/
│   │       ├── auth/login/route.ts
│   │       ├── auth/logout/route.ts
│   │       ├── auth/session/route.ts
│   │       ├── search/route.ts
│   │       ├── checkout/route.ts
│   │       └── billing/route.ts
│   ├── lib/
│   │   ├── client.ts                (browser fetch helper, money format)
│   │   └── http.ts                  (JSON parsing, error to status code)
│   └── domains/
│       ├── errors.ts                (Result type, ok, fail)
│       ├── singleton.ts             (one store per domain across routes)
│       ├── auth/      { types.ts, provider.ts, service.ts, service.test.ts, index.ts }
│       ├── search/    { same shape }
│       ├── checkout/  { same shape }
│       └── billing/   { same shape }
├── AGENTS.md
├── CLAUDE.md
├── LICENSE (MIT)
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── vitest.config.mts
```

## Domains

Each domain folder has the same shape:

- `types.ts`: domain types and the provider interface.
- `provider.ts`: in-memory mock provider. Seeded data, no network.
- `service.ts`: business rules. Takes a provider in its constructor so tests can inject one.
- `service.test.ts`: unit tests for the service.
- `index.ts`: public exports and a default service instance used by API routes.

Domains do not import from each other's internals. Cross-domain data passes through plain types (for example, checkout receives product IDs and prices, not the search service).

### auth

- Mock users with email and password (demo values, documented in the README, not secrets).
- `login(email, password)` returns a session `{ token, userId, expiresAt }` or an error.
- `getSession(token)` returns the session or `null`. Expired sessions return `null`.
- `logout(token)` removes the session.
- Rules: email is case-insensitive and trimmed; empty password is rejected.

### search

- Seeded product catalog (id, name, description, category, priceCents, tags).
- `search({ query, category?, limit? })` returns ranked results.
- Rules: case-insensitive match on name, description, tags; name match ranks higher; empty query returns all products sorted by name; `limit` clamped to 1..50.

### checkout

- Cart and order model. Prices in integer cents.
- `quote(items)` returns subtotal, discount, tax, and total.
- `placeOrder(userId, items, discountCode?)` validates and stores an order.
- Rules: quantity must be an integer 1..99; unknown product IDs are rejected; discount code `WORKSHOP10` takes 10% off subtotal; tax is 8% of the discounted subtotal, rounded to the nearest cent.

### billing

- Plans (free, pro, team) and per-user subscriptions and invoices.
- `listPlans()`, `getSubscription(userId)`, `changePlan(userId, planId)`, `listInvoices(userId)`.
- Rules: unknown plan is rejected; changing to the same plan is a no-op error; an upgrade creates an invoice for the price difference; a downgrade creates no invoice.

## API routes

| Route | Method | Domain | Purpose |
|---|---|---|---|
| `/api/auth/login` | POST | auth | Log in, return `{ session }` |
| `/api/auth/logout` | POST | auth | Delete the session in `Authorization: Bearer <token>` |
| `/api/auth/session` | GET | auth | Read session from `Authorization: Bearer <token>` |
| `/api/search` | GET | search | `?q=&category=&limit=` |
| `/api/checkout` | POST | checkout | `{ items, discountCode? }` returns quote; with `place: true` places order |
| `/api/billing` | GET / POST | billing | GET plans and subscription; POST `{ planId }` changes plan |

Route handlers are thin: parse input, call the service, map errors to status codes.

## Pages

- `/`: search box and results list (client component calling `/api/search`).
- `/login`: email and password form calling `/api/auth/login`; stores token in `sessionStorage`.
- `/checkout`: fixed sample cart, discount code field, quote, and place order.
- `/billing`: plans list, current plan, change plan, invoices.

## Test plan

Unit tests run with Vitest in the Node environment. One test file per domain service.

| Domain | Tests |
|---|---|
| auth | valid login returns session; wrong password fails; unknown user fails; email is case-insensitive; empty password fails; getSession returns session; expired session returns null; logout removes session |
| search | name match ranks first; tag match works; case-insensitive; category filter; empty query returns all sorted; limit is clamped; no match returns empty |
| checkout | quote math with and without discount; tax rounding; unknown product rejected; bad quantity rejected; empty cart rejected; placeOrder stores order; invalid discount code rejected |
| billing | list plans; default subscription is free; upgrade creates invoice for difference; downgrade creates no invoice; same plan rejected; unknown plan rejected |

Checks that must pass before the work is done: `npm install`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. A repo grep for client names and secret patterns must come back clean.

## Docs and agent files

- `README.md`: logo header, AI DLC steps (Spec, Plan, Execute, Review, Learn) mapped to this repo, Lab 2 swarm with file ownership, clone and run snippet, folder tree.
- `AGENTS.md`: conventions, commands, domain ownership, DLC steps. `CLAUDE.md` points to it.
- `docs/.context/`: Opportunity Solution Tree README, one example tree, spec and OST registers.
- `docs/specs/`: one example spec per domain.
- `.claude/skills/`: generic `ost-bootstrap` and `create-tickets` skills.
- `prompts/`: copy-paste prompts for each DLC step, one file per tool.
