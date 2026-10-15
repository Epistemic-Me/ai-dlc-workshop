---
name: verify
description: Prove each acceptance criterion of a change to this store with evidence (test output, an API response body, or stored rows) before calling it done. Use after implementing a ticket, before /review-pr, or when asked to verify, prove, or show evidence.
---

# /verify <TICKET or PR folder>

Show evidence for each acceptance criterion before you call a change done, in the form the criterion is about. Passing tests alone are not evidence for a criterion they do not check.

## 1. Find the criteria

- Read the acceptance criteria in the PR's `TEST-STRATEGY.md` (`docs/prs/*/*-PR-<TICKET>-*/`). If there is none, use `backlog/<TICKET>.md`.
- List them as AC1, AC2, ... Do not add criteria of your own. Do not drop any.

## 2. Pick the evidence for each criterion

| The criterion is about | Evidence to capture |
|---|---|
| A service rule (quote math, plan change, session expiry) | A named unit test and its passing output line. If no test exists, write one first and show it fail before the fix when you can. |
| An API response (status, body shape, error code) | A real request to the running app and the status and body it returned. |
| Stored data (orders, schema, migrations) | The rows after the action: a test that reads the table, or the API that returns them. |
| A page | The API call the page makes, plus a screenshot only if the criterion is about what the page shows. |
| "Behavior does not change" | The same request or test before and after, with both outputs. |

## 3. Start the app

```bash
npm run build && PORT=3100 npm start
```

Use a production server for evidence; it does not reload while you edit. Data is in memory and resets when the server stops. Stop it when you are done.

Get a session token (demo values from the mock provider):

```bash
TOKEN=$(curl -s -X POST localhost:3100/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ada@example.com","password":"demo-password"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).session.token')
```

## 4. Feature map

| Feature | Drive it | Look at | Tests |
|---|---|---|---|
| Login | `POST /api/auth/login` `{"email","password"}` | `session.token`, `session.expiresAt`; 400 `invalid_input`, 401 `invalid_credentials` | `src/domains/auth/service.test.ts` |
| Session | `GET /api/auth/session` with `Authorization: Bearer $TOKEN` | `user` (no password field) or `null` | `src/domains/auth/service.test.ts` |
| Logout | `POST /api/auth/logout` with the token | `{ ok: true }`, then session returns `null` | `src/domains/auth/service.test.ts` |
| Search | `GET /api/search?q=coffee&category=kitchen&limit=5` | `results[].id` order, `categories` | `src/domains/search/service.test.ts` |
| Quote | `POST /api/checkout` `{"items":[{"productId":"prod_pen","quantity":2}],"discountCode":"WORKSHOP10"}` | `quote` cents: subtotal, discount, tax, total | `src/domains/checkout/service.test.ts`, `src/app/api/checkout/route.test.ts` |
| Place order | Same body plus `"place":true`, with the token | 201 and `order.id`; 401 without a token | same |
| Order history | `GET /api/orders` with the token | `orders` (legacy shape), `totalSpent` | `src/legacy/order-dao.test.ts` |
| Support agent | `POST /api/support` `{"message":"Where are my orders?"}`, with and without the token | `reply`, `toolCalls`, `handoff`; never another user's order | `src/support-agent/agent.test.ts`, `src/app/api/support/route.test.ts` |
| Billing | `GET /api/billing`; `POST /api/billing` `{"planId":"pro"}` with the token | `subscription.planId`, `invoices[].amountCents` | `src/domains/billing/service.test.ts` |
| Orders data layer | A test that builds a database with `createDatabase()` and reads `db.table("orders")` | Row values in cents; `schemaVersion` | `src/db/order-repository.test.ts` |
| Migrations | `migrate(db, n)` up and down in a test | Rows before and after, and `hasTable(...)` | `src/db/order-repository.test.ts` |

Example, with the output kept as evidence:

```bash
curl -s -X POST localhost:3100/api/checkout -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"items":[{"productId":"prod_pen","quantity":2}],"place":true}' -w '\nstatus %{http_code}\n'
```

## 5. Check the whole suite

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

Lint warnings for `jsonError` are known debt; do not count them as new.

## 6. Report

Write the evidence into the PR's `REVIEW.md` or `IMPLEMENTATION.md`:

| AC | Evidence type | Command or test | Result | Output (short) |
|---|---|---|---|---|
| AC1 | API response | `curl ... /api/checkout` | PASS | `status 400 {"error":{"code":"invalid_quantity",...}}` |

## Rules

- Evidence is output you ran in this session. Paste the real line. Do not write what it "should" return.
- If you cannot get evidence for a criterion, write `NO EVIDENCE` and why. Do not mark it PASS.
- A test you wrote counts only if you also saw it pass, and, for a bug, fail before the fix.
- Note any change you made that no criterion asked for.
- Do not use real customer data or real credentials. The demo login is mock data.
