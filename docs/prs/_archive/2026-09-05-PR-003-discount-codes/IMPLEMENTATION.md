# PR #003: discount-codes - Implementation

Created: 2026-09-05
Branch: feature/pr-003-discount-codes
Status: Merged 2026-09-06

## Summary

Shoppers can apply the code `WORKSHOP10` for 10% off. The quote shows the discount, and tax is computed on the discounted subtotal.

## Key changes

- `DISCOUNT_CODES: Record<string, number> = { WORKSHOP10: 0.1 }` in `service.ts`.
- The lookup reads `DISCOUNT_CODES[code]`, then `DISCOUNT_CODES[code.toUpperCase()]`. If both are undefined, `quote()` returns `invalid_discount`.
- The quote returns `discountCode` in upper case, or `null`.
- `/checkout` has a code box and an Apply button.

## Deviations from plan

None.

## Learnings

- For a 1000-cent cart: discount 100, tax 72, total 972.

## Follow-up

- None.
