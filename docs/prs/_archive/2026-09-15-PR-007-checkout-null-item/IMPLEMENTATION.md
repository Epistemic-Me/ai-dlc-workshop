# PR #007: checkout-null-item - Implementation

Created: 2026-09-15
Branch: feature/pr-007-checkout-null-item
Status: Merged 2026-09-16

## Summary

`POST /api/checkout` no longer throws on a `null` item. It returns 400 `invalid_quantity`.

## Key changes

- `parseItems` checks `item && typeof item === "object" && "productId" in item` before it reads a field.
- New `src/app/api/checkout/route.test.ts` with a `post(body)` helper and T1, T2.

## Deviations from plan

None.

## Learnings

- `CheckoutService.quote` checks quantity before product, so an item that is not an object reports `invalid_quantity`, not `unknown_product`.

## Follow-up

- Quantity `"2"` is accepted today. `docs/specs/checkout.md` says a string is not a valid quantity. Needs its own ticket.
