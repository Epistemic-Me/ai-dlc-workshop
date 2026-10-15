# PR #008: discount-own-keys - Implementation

Created: 2026-09-17
Branch: feature/pr-008-discount-own-keys
Status: Merged 2026-09-18

## Summary

The discount lookup accepts only codes that the `DISCOUNT_CODES` table owns. `"constructor"` and other inherited names return `invalid_discount`.

## Key changes

- `quote()` normalizes the code once, then checks `Object.hasOwn(DISCOUNT_CODES, code)` before it reads the rate.
- The two-step lookup (as typed, then upper case) is gone.
- The route rejects a non-string `discountCode` with `errorResponse({ code: "invalid_discount", ... })`.

## Deviations from plan

None.

## Learnings

- With the code normalized to upper case, `"constructor"` becomes `"CONSTRUCTOR"`, which no object inherits. T1 now passes from the normalization alone. `Object.hasOwn` is the guard if a later change drops the normalization.

## Follow-up

- None.
