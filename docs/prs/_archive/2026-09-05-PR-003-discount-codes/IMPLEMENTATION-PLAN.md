# PR #003: discount-codes - Implementation Plan

Created: 2026-09-05
Branch: feature/pr-003-discount-codes

## Approach

The approach in RESEARCH.md.

## Scope

- In scope: one code, `WORKSHOP10`, at 10%. Service, route, and page.
- Out of scope: codes stored outside the code, expiry dates, one use per shopper, fixed-amount codes.

## Files

| File | Action | Purpose |
|---|---|---|
| `src/domains/checkout/service.ts` | Modify | Add `DISCOUNT_CODES`. Add `discountCode?` to `quote()` and `placeOrder()`. |
| `src/domains/checkout/index.ts` | Modify | Export `DISCOUNT_CODES`. |
| `src/app/api/checkout/route.ts` | Modify | Pass `body.discountCode`. |
| `src/lib/http.ts` | Modify | Map `invalid_discount` to 400. |
| `src/app/checkout/page.tsx` | Modify | Code box and Apply button. |
| `src/domains/checkout/service.test.ts` | Modify | T1. |

## Steps

1. Add the table and the lookup. Try the code as typed, then in upper case, so `workshop10` works.
2. Return `invalid_discount` when the lookup finds nothing.
3. Wire the route and the page.
4. Run `npm run lint && npm run typecheck && npm test && npm run build`.

## Risk and rollback

- Blast radius: quotes and orders that send a code. Quotes with no code do not change.
- Rollback: revert the PR. The page still works without the code box.
