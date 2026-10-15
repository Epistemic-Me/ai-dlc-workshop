# Architecture and conventions

Owner: lead. Update it in the same PR as any change to the layout or a rule below.

## Commands

```bash
npm install          # install
npm run dev          # dev server on http://localhost:3000
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Vitest
npm run build        # production build
```

## Domain layout

Every domain under `src/domains/<name>/` has the same files:

| File | Purpose |
|---|---|
| `types.ts` | Domain types and the provider interface |
| `provider.ts` | In-memory mock provider with seed data |
| `service.ts` | Business rules. Takes a provider in the constructor. |
| `service.test.ts` | Unit tests for the service |
| `index.ts` | Public exports and the shared service instance |

API route handlers live in `src/app/api/<name>/`. They parse input, call the service, and map errors to HTTP status codes with `errorResponse` from `src/lib/http.ts`. Business rules go in the service, not the route.

## Orders data layer

Orders are stored in an in-memory database in `src/db/`:

| Path | What it is |
|---|---|
| `src/db/database.ts` | Tables of rows and a schema version |
| `src/db/schema.ts` | Row shapes. Columns are snake_case. Money is integer cents. |
| `src/db/migrations/` | Numbered migrations, each with `up` and `down`. `migrate()` runs them in order. |
| `src/db/order-repository.ts` | The new data-access layer: `OrderRepository` |
| `src/legacy/order-dao.ts` | The old data-access layer: `LegacyOrderDao`. Being replaced (`backlog/LEGACY-06.md`). |

Both layers read the same tables. Checkout writes through `OrderRepository`. Some reads still go through `LegacyOrderDao`. The two layers return different shapes:

| | `OrderRepository` | `LegacyOrderDao` |
|---|---|---|
| No orders | `[]` | `null` |
| List order | newest first | by order ID as text |
| Money | integer cents | dollars as a float |
| Dates | epoch milliseconds | ISO string |
| Empty ID | returns `undefined` | throws `LegacyDataError` |

New code uses `@/db`. Do not add new calls to `@/legacy`.

## Support agent

`src/support-agent/` is a customer support agent inside the store, served by `POST /api/support` with `{ message }`.

- `types.ts` defines `LlmProvider`. `mock-llm.ts` is the only provider: it is deterministic, picks a tool from keywords, and makes no network call.
- `tools.ts` has four tools: `list_orders`, `lookup_order`, `search_products`, `get_plan`. Order and plan tools need a session and only return the user's own data.
- `agent.ts` runs at most three model steps, then hands off to a person.

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

## Known debt

- `jsonError` in `src/lib/http.ts` is deprecated. ESLint warns on each import. Routes should return `errorResponse` or `invalidJson`.
- The order reads listed in `backlog/LEGACY-06.md` still use `src/legacy/`.
