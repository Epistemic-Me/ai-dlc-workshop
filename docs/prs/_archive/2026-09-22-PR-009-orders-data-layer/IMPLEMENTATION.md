# PR #009: orders-data-layer - Implementation

Created: 2026-09-22
Branch: feature/pr-009-orders-data-layer
Status: Merged 2026-09-23

## Summary

Orders now live in one `orders` table in `src/db/`. Checkout writes through `OrderRepository`. The legacy layer reads the same table and returns its old shape.

## Key changes

- `Database` with `schemaVersion`, `createTable`, `dropTable`, `table`.
- `MIGRATIONS = [createOrders]`, `LATEST_VERSION = 1`, `migrate(db, target)` moves one step at a time.
- `OrderRepository`: `insert`, `findById`, `listByUser` (newest first), `totalCentsByUser`.
- `InMemoryCheckoutProvider` takes an `OrderRepository`. The app singleton uses `orderRepository` from `@/db`.

## Deviations from plan

None.

## Still on the old layer

Order reads still use `src/legacy/`: `findOrdersByUser`, `findOrderById`, `getUserTotal`. They return float dollars, sort by order ID text, and return `null` (not `[]`) for a user with no orders. Opened **LEGACY-06** to move each read call site, one per PR, with characterization tests first.

## Follow-up

- LEGACY-06.
