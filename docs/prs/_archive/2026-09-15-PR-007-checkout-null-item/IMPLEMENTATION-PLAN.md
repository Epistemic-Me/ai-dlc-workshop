# PR #007: checkout-null-item - Implementation Plan

Created: 2026-09-15
Branch: feature/pr-007-checkout-null-item

## Approach

Option A from RESEARCH.md.

## Scope

- In scope: the object check in `parseItems`, and the new route test file.
- Out of scope: quantity sent as a string such as `"2"` (today `Number("2")` turns it into 2), a new error code, changes to `CheckoutService`.

## Files

| File | Action | Purpose |
|---|---|---|
| `src/app/api/checkout/route.ts` | Modify | Guard each item before reading `productId` and `quantity`. |
| `src/app/api/checkout/route.test.ts` | Create | T1, T2. |

## Steps

1. Write T1. Confirm it throws on the current code.
2. Add the guard.
3. Run `npm run lint && npm run typecheck && npm test && npm run build`.

## Risk and rollback

- Blast radius: every `POST /api/checkout` call, quotes and placed orders.
- If it is wrong: valid carts fail with `invalid_quantity`. T2 checks this.
- Rollback: revert the PR. No data change.
