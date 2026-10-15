# PR #009: orders-data-layer - Test Strategy

Created: 2026-09-22
Branch: feature/pr-009-orders-data-layer

## Acceptance criteria

| AC | Criterion |
|---|---|
| AC1 | `createDatabase()` runs migration 001: `schemaVersion` is 1 and table `orders` exists. `migrate(db, 0)` runs `down`: `schemaVersion` 0, no `orders` table. |
| AC2 | `migrate(db, 99)` throws `Unknown schema version`. |
| AC3 | `OrderRepository.insert` then `findById` returns the same record, money in integer cents. `findById("missing")` is `undefined`. |
| AC4 | `listByUser` returns only that user's orders, newest `createdAt` first. A user with none gets `[]`. |
| AC5 | `totalCentsByUser` sums integer cents: 1099 + 2300 = 3399. A user with none gets 0. |
| AC6 | A second `insert` with the same `id` throws `Duplicate order id`. |
| AC7 | `CheckoutService.placeOrder` stores through the repository; `listOrders` returns it for that user only. |
| AC8 | `LegacyOrderDao.findOrdersByUser` reads the new table and keeps its old shape: `total` 10.8 for 1080 cents. |

## Edge cases

- Empty: user with no orders (AC4, AC5). Missing ID (AC3).
- Invalid: unknown schema version (AC2). Duplicate ID (AC6).
- Error: rollback to version 0 (AC1).

## Test matrix

| Test-ID | File | Test case | AC covered |
|---|---|---|---|
| T1 | `src/db/order-repository.test.ts` | creates the orders table and rolls it back | AC1 |
| T2 | `src/db/order-repository.test.ts` | rejects an unknown version | AC2 |
| T3 | `src/db/order-repository.test.ts` | round-trips an order | AC3 |
| T4 | `src/db/order-repository.test.ts` | lists a user's orders newest first and only that user's | AC4 |
| T5 | `src/db/order-repository.test.ts` | sums a user's totals in cents | AC5 |
| T6 | `src/db/order-repository.test.ts` | rejects a duplicate id | AC6 |
| T7 | `src/domains/checkout/service.test.ts` | stores a placed order for the user | AC7 |
| T8 | `src/legacy/order-dao.test.ts` | returns a user's orders | AC8 |
