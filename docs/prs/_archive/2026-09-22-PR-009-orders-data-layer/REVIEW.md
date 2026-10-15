# PR #009: orders-data-layer - Review

Created: 2026-09-22
Branch: feature/pr-009-orders-data-layer
Reviewer: fresh AI reviewer (second model family)
Verdict: Approve

## Checks run

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`: all pass. I also ran `migrate(db, 0)` then `migrate(db)` on one database: version 0 then 1, table dropped then created.

## Per-AC evidence

| AC | Test | Result | Evidence |
|---|---|---|---|
| AC1 | T1 | PASS | `schemaVersion` 1 and `hasTable("orders")` true; after `migrate(db, 0)`, 0 and false. |
| AC2 | T2 | PASS | Throws `Unknown schema version`. |
| AC3 | T3 | PASS | `findById("order_1")` equals the inserted record. `"missing"` is `undefined`. |
| AC4 | T4 | PASS | `["order_3", "order_1"]` for `user_1`. `[]` for `nobody`. |
| AC5 | T5 | PASS | 3399 and 0. Integers. |
| AC6 | T6 | PASS | Throws `Duplicate order id`. |
| AC7 | T7 | PASS | Order `order_1` for `user_1`; `user_2` has 0 orders. |
| AC8 | T8 | PASS | `orderId` `order_1`, `total` 10.8. |

## Issues

- Critical: none.
- Suggestion: the legacy reads listed in IMPLEMENTATION.md keep their float and ordering quirks. LEGACY-06 covers them.

## Risk

Medium. Order writes moved. Rollback is tested.
