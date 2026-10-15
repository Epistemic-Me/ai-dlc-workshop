# PR #002: checkout-price-breakdown - Implementation

Created: 2026-09-03
Branch: feature/pr-002-checkout-price-breakdown
Status: Merged 2026-09-04

## Summary

A quote now returns subtotal, discount, tax, and total in integer cents. The checkout page shows all four rows before the shopper places the order.

## Key changes

- `TAX_RATE = 0.08` in `src/domains/checkout/service.ts`.
- `taxCents = Math.round((subtotalCents - discountCents) * TAX_RATE)`.
- `Quote` has the four money fields and `discountCode: null`.
- `/checkout` renders the rows with `formatCents`.

## Deviations from plan

None.

## Learnings

- The 2 x 1000 + 1 x 333 cart gives 186.64 cents of tax. It is a useful fixture because it tests the rounding.

## Follow-up

- Record the start of O1.OP2.S1.A1.E1 in the tree register.
