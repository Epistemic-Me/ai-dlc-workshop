# PR #003: discount-codes - Test Strategy

Created: 2026-09-05
Branch: feature/pr-003-discount-codes

## Acceptance criteria

| AC | Criterion |
|---|---|
| AC1 | `WORKSHOP10` takes 10% off the subtotal. |
| AC2 | The discount works with tax and the total. |
| AC3 | Codes are handled correctly, including codes that do not exist. |
| AC4 | The checkout page lets the shopper apply a code and shows the discount. |

## Edge cases

- Lower case and spaces: `" workshop10 "` applies the same discount as `WORKSHOP10`.
- Empty: no code, or an empty string, gives `discountCents` 0.
- Unknown code: returns `invalid_discount`.

## Test matrix

| Test-ID | File | Test case | AC covered |
|---|---|---|---|
| T1 | `src/domains/checkout/service.test.ts` | applies the WORKSHOP10 code case-insensitively | AC1, AC2 |
| T2 | `src/domains/checkout/service.test.ts` | computes subtotal, tax, and total without a discount (existing) | AC2 |
| - | - | Covered by the `invalid_discount` path in `quote()` | AC3 |
| M1 | `src/app/checkout/page.tsx` | Manual: type `workshop10`, click Apply, see the Discount row change | AC4 |
