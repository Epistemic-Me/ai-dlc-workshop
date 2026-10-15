# LEGACY-06: Move order reads off the legacy data-access layer

- Kind: legacy migration
- Domain: legacy, db
- Size: 5 (one call site per PR)

## What

Checkout writes orders through the new `OrderRepository` (`src/db/`). Some reads still go through the old `LegacyOrderDao` (`src/legacy/`). Move each call site to the new layer, one at a time.

Call sites on the legacy layer:

1. `src/app/api/orders/route.ts`: `legacyOrders.findOrdersByUser`
2. `src/app/api/orders/route.ts`: `legacyOrders.getUserTotal`
3. `src/support-agent/tools.ts`: `legacyOrders.findOrdersByUser`
4. `src/support-agent/tools.ts`: `legacyOrders.findOrderById`

## Why

The two layers answer the same question in different ways. New code cannot rely on one shape. The legacy layer is removed when no call site uses it.

## Acceptance criteria (per call site)

1. Before the change, characterization tests record what the call site returns today: nulls, empty results, ordering, and error paths.
2. The call site uses `OrderRepository` from `@/db`. It no longer imports `@/legacy`.
3. The response body that callers see does not change, unless the PR lists the change and the reason, and a reviewer accepts it.
4. Money stays in integer cents inside the code. Any change in what the API returns is listed.
5. Each acceptance criterion has evidence: test output, a response body, or stored rows.

## Out of scope

- Deleting `src/legacy/` (a later ticket, after the last call site moves).
- Schema changes (that is MIGRATE-04).
