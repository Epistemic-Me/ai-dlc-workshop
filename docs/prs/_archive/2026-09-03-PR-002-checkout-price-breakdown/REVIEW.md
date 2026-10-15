# PR #002: checkout-price-breakdown - Review

Created: 2026-09-03
Branch: feature/pr-002-checkout-price-breakdown
Reviewer: fresh AI reviewer (second model family)
Verdict: Approve

## Checks run

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`: all pass. M1 run on `npm run dev`.

## Per-AC evidence

| AC | Test | Result | Evidence |
|---|---|---|---|
| AC1 | T1 | PASS | `subtotalCents` 2333, `discountCents` 0. All values are integers. |
| AC2 | T1 | PASS | `taxCents` 187 (2333 x 0.08 = 186.64). |
| AC3 | T1 | PASS | `totalCents` 2520 = 2333 - 0 + 187. |
| AC4 | T2, T3, T4 | PASS | Codes `empty_cart`, `unknown_product`, `invalid_quantity` for each invalid input. |
| AC5 | M1 | PASS | Page rows: Subtotal $32.99, Discount -$0.00, Tax $2.64, Total $35.63. 3299 x 0.08 = 263.92, rounds to 264. |

## Issues

- Critical: none.
- Suggestion: the page shows "-$0.00" when there is no discount. Not blocking; the row stays for the experiment.

## Risk

Medium. Every order uses these numbers. Covered by T1 and M1. Rollback is a revert.
