# PR #010: orders-history-route - Implementation Plan

Created: 2026-09-24
Branch: feature/pr-010-orders-history-route

## Approach

The approach in RESEARCH.md.

## Scope

- In scope: `GET /api/orders` for the logged-in user.
- Out of scope: an order history page, one order by ID, pagination, filters by date.

## Files

| File | Action | Purpose |
|---|---|---|
| `src/app/api/orders/route.ts` | Create | `GET` handler. `userIdFrom(request)` helper. |

## Steps

1. Add `userIdFrom`: read the bearer token, return the session's `userId` or `""`.
2. If no user, return `errorResponse({ code: "unauthenticated", ... })`.
3. Return `NextResponse.json({ orders: legacyOrders.findOrdersByUser(userId) ?? [], totalSpent: legacyOrders.getUserTotal(userId) })`.
4. Run M1, M2.
5. Run `npm run lint && npm run typecheck && npm test && npm run build`.

## Verification

- [x] M1 and M2 give the expected status.
- [x] Build passes.
