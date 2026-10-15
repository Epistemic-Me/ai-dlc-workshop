# PR #010: orders-history-route - Implementation

Created: 2026-09-24
Branch: feature/pr-010-orders-history-route
Status: Merged 2026-09-25

## Summary

`GET /api/orders` returns the logged-in user's orders and the total they have spent.

## Key changes

- New `src/app/api/orders/route.ts` with `userIdFrom` and `GET`.
- The route uses `legacyOrders.findOrdersByUser(userId) ?? []` so a user with no orders gets a list.
- Comment in the route: reads go through the legacy layer, tracked in LEGACY-06.

## Deviations from plan

None.

## Follow-up

- A history page on the front end.
