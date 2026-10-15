# PR #002: checkout-price-breakdown - Implementation Plan

Created: 2026-09-03
Branch: feature/pr-002-checkout-price-breakdown

## Approach

Option A from RESEARCH.md.

## Scope

- In scope: the `Quote` type, `CheckoutService.quote`, the breakdown table on `/checkout`.
- Out of scope: discount codes, tax by region, payment capture, shipping.

## Files

| File | Action | Purpose |
|---|---|---|
| `src/domains/checkout/types.ts` | Modify | Add `subtotalCents`, `discountCents`, `taxCents`, `totalCents` to `Quote`. |
| `src/domains/checkout/service.ts` | Modify | Add `TAX_RATE = 0.08`. Compute the four values with `Math.round`. |
| `src/domains/checkout/service.test.ts` | Modify | T1 to T4. |
| `src/app/checkout/page.tsx` | Modify | Render the four rows with `formatCents`. |

## Steps

1. Write T1. Confirm it fails.
2. Change the type and `quote()`.
3. Add the table rows. Run M1.
4. Run `npm run lint && npm run typecheck && npm test && npm run build`.

## Risk and rollback

- Blast radius: every quote and every placed order. `placeOrder` stores the quote, so a wrong number is stored with the order.
- If it is wrong: totals are off by the tax amount or by a rounding cent.
- Rollback: revert the PR. Orders are in memory, so no stored data needs a fix after a restart.
