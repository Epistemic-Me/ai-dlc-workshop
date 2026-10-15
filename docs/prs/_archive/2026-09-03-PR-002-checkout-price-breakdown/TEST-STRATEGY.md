# PR #002: checkout-price-breakdown - Test Strategy

Created: 2026-09-03
Branch: feature/pr-002-checkout-price-breakdown

## Acceptance criteria

| AC | Criterion |
|---|---|
| AC1 | `quote()` returns `subtotalCents`, `discountCents`, `taxCents`, `totalCents` as integers. For 2 x 1000 + 1 x 333 cents: subtotal 2333, discount 0. |
| AC2 | Tax is 8% (`TAX_RATE = 0.08`) of the discounted subtotal, rounded to the nearest cent: 186.64 becomes 187. |
| AC3 | `totalCents = subtotalCents - discountCents + taxCents`: 2520 for the cart in AC1. |
| AC4 | Invalid carts return an error, not a quote: `empty_cart`, `unknown_product`, `invalid_quantity` (0, -1, 1.5, 100). |
| AC5 | `/checkout` shows Subtotal, Discount, Tax, and Total rows from the quote. |

## Edge cases

- Empty: empty cart returns `empty_cart`.
- Invalid: unknown product ID returns `unknown_product`. Quantity 0, -1, 1.5, or 100 returns `invalid_quantity`.
- Error / rounding: a tax value with a fraction of a cent (186.64) rounds to a whole cent.

## Test matrix

| Test-ID | File | Test case | AC covered |
|---|---|---|---|
| T1 | `src/domains/checkout/service.test.ts` | computes subtotal, tax, and total without a discount | AC1, AC2, AC3 |
| T2 | `src/domains/checkout/service.test.ts` | rejects an empty cart | AC4 |
| T3 | `src/domains/checkout/service.test.ts` | rejects an unknown product | AC4 |
| T4 | `src/domains/checkout/service.test.ts` | rejects quantity %s (0, -1, 1.5, 100) | AC4 |
| M1 | `src/app/checkout/page.tsx` | Manual: `npm run dev`, open `/checkout` with the sample cart (2 notebooks, 1 pen). Rows read $32.99, -$0.00, $2.64, $35.63. | AC5 |
