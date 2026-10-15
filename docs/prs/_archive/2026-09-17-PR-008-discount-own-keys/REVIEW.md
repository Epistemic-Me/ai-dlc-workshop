# PR #008: discount-own-keys - Review

Created: 2026-09-17
Branch: feature/pr-008-discount-own-keys
Reviewer: fresh AI reviewer (second model family)
Verdict: Approve

## Checks run

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`: all pass. T1 on the parent commit fails: `result.ok` is `true` with `discountCents` `NaN`.

## Per-AC evidence

| AC | Test | Result | Evidence |
|---|---|---|---|
| AC1 | T1 | PASS | `error.code` is `invalid_discount` for `"constructor"`. |
| AC2 | T2 | PASS | `error.code` is `invalid_discount` for `"FREE"`. |
| AC3 | T3 | PASS | `discountCode` `WORKSHOP10`, 100 / 72 / 972 cents. |
| AC4 | T4 | PASS | `{ status: 400, code: "invalid_discount" }` for `discountCode: 123`. |

## Issues

- Critical: none.
- Suggestion: T1 does not isolate `Object.hasOwn` (see Learnings). A test that calls the lookup with a lower-case inherited name and no normalization would. Not blocking.

## Risk

Low. Rollback is a revert.
