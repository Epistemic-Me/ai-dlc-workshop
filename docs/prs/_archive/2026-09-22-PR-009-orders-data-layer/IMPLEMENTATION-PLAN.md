# PR #009: orders-data-layer - Implementation Plan

Created: 2026-09-22
Branch: feature/pr-009-orders-data-layer

## Approach

Option A from RESEARCH.md.

## Scope

- In scope: `src/db/` (database, schema, migration 001, repository), checkout writes through `orderRepository`, `LegacyOrderDao` reads the `orders` table.
- Out of scope: moving reads off `src/legacy/` (opened as LEGACY-06), deleting `src/legacy/`, moving order lines out of `lines_json`, a real database server.

## Files

| File | Action | Purpose |
|---|---|---|
| `src/db/database.ts`, `src/db/schema.ts` | Create | Tables of rows. `OrderRow` in snake_case, money in cents. |
| `src/db/migrations/001_create_orders.ts`, `src/db/migrations/index.ts` | Create | `up` creates `orders`, `down` drops it. `migrate(db, target)`. |
| `src/db/order-repository.ts`, `src/db/index.ts` | Create | `OrderRepository`. Singletons `db` and `orderRepository`. |
| `src/domains/checkout/provider.ts`, `src/domains/checkout/index.ts` | Modify | `saveOrder` and `listOrders` go through the repository. |
| `src/legacy/order-dao.ts` | Modify | Read `db.table("orders")`. Same return shape as before. |
| Test files in the matrix | Create / modify | T1 to T8. |

## Risk and rollback

- Blast radius: placing an order (`POST /api/checkout` with `place: true`) and every legacy order read. If `insert` throws, placing an order fails; quotes do not touch the table.
- Rollback, schema: `migrate(db, 0)` runs `down` (T1 proves it).
- Rollback, code: revert the PR. Data is in memory, so nothing needs a backfill.
