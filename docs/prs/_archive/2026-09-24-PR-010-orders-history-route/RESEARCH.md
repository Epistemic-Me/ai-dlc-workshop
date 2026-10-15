# PR #010: orders-history-route - Research

Created: 2026-09-24
Branch: feature/pr-010-orders-history-route
Size: S

## Problem

Logged-in shoppers cannot see the orders they placed. There is no API for order history.

Evidence: the support lead tagged recent tickets "where is my order". One said: "I placed an order yesterday and cannot find it anywhere."

## Outcome

Serves: **none** on the tree. Order history helps returning shoppers, but O1.OP3 is about logging in again, not about past orders. Recorded as none.

## Current state

- Orders are stored in the `orders` table (PR #009).
- `src/legacy/index.ts` exports `legacyOrders`, which already has `findOrdersByUser(userId)` and `getUserTotal(userId)`.
- Routes read the session with `tokenFromHeader` and `authService.getSession`.

## Approach

Add `GET /api/orders` in `src/app/api/orders/route.ts`. Read the user from the session. Return `{ orders, totalSpent }` from `legacyOrders.findOrdersByUser` and `legacyOrders.getUserTotal`. Both helpers exist and are tested, so the route is a thin wrapper.

## Dependencies

- PR #009 (orders table).
