# PR #010: orders-history-route - Test Strategy

Created: 2026-09-24
Branch: feature/pr-010-orders-history-route

## Acceptance criteria

| AC | Criterion |
|---|---|
| AC1 | `GET /api/orders` with no session returns 401 with `error.code` `unauthenticated`. |
| AC2 | With a session, it returns 200 and `{ orders, totalSpent }` for that user. |
| AC3 | A user does not see another user's orders. |

## Edge cases

- No session or an expired token: 401 (AC1).

## Test matrix

| Test-ID | File | Test case | AC covered |
|---|---|---|---|
| M1 | `src/app/api/orders/route.ts` | Manual: `curl /api/orders` with no header. 401 `unauthenticated`. | AC1 |
| M2 | `src/app/api/orders/route.ts` | Manual: log in as `user_1`, place one order, `curl /api/orders` with the token. One order in `orders`. | AC2 |
| T1 | `src/legacy/order-dao.test.ts` | returns a user's orders (existing) | AC2, AC3 |
