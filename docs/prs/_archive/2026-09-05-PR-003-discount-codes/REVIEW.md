# PR #003: discount-codes - Review

Created: 2026-09-05
Branch: feature/pr-003-discount-codes
Reviewer: checkout agent (same session)
Verdict: Approve

## Checks run

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`: all pass.

## Per-AC evidence

| AC | Test | Result | Evidence |
|---|---|---|---|
| AC1 | T1 | PASS | `discountCents` 100 on a 1000-cent cart. |
| AC2 | T1, T2 | PASS | `taxCents` 72, `totalCents` 972 with the code. T2 still passes. |
| AC3 | - | PASS | Manual: `POST /api/checkout` with `discountCode: "FREE"` returns 400 `invalid_discount`. |
| AC4 | M1 | PASS | Discount row shows -$3.30 after Apply on the sample cart. |

## Issues

- Critical: none.
- Suggestion: move codes to a provider if more codes come.

## Risk

Low. Only quotes with a code change.
