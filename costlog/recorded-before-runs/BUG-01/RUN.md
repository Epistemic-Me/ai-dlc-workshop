# BUG-01 "before" run

Illustrative sample data. The diff is real and applies to commit `42d2b3b`. The cost numbers are sample values, not measurements.

## How it ran

One session, no plan, no context file changes. The whole prompt was:

```
Fix BUG-01 in backlog/. Make the tests pass.
```

The agent read `backlog/BUG-01.md` and `src/domains/checkout/service.ts`, made the change in [`diff.patch`](diff.patch), ran `npm test` (50 passed, 1 skipped), and reported "fixed, all tests pass".

## What the review found

| BUG-01 criterion | Result | Evidence |
|---|---|---|
| AC1: duplicate lines merge into one line | FAIL | The change rejects a second line for a product. It does not merge them. |
| AC2: more than 99 in total fails with `invalid_quantity` | PASS, by accident | Any duplicate fails, so 99 + 51 fails too. So does 1 + 1. |
| AC3: carts with one line per product behave as before | PASS | Existing checkout tests pass. |
| AC4: a test covers each case | FAIL | No test was added. The suite was green before the change too. |

Other findings: the error message ("Each product can only appear once") does not match the code `invalid_quantity`.

## Cost

| Item | Value |
|---|---|
| Tokens (input / output / cached) | 41,200 / 1,900 / 18,000 |
| Agent time | 2 min |
| Your time during the run | 3 min |
| Review | 18 min |
| Rework (re-run with a plan, add tests) | 35 min |
| Re-review | 10 min |
| Outcome | reworked |

The run used few tokens. Most of its cost is review and rework: no test strategy said what "done" meant before the code.

## For Lab 2

Start your "after" run from the commit before any BUG-01 fix, with [`IMPLEMENTATION-PLAN.md`](IMPLEMENTATION-PLAN.md) (or your own plan from Lab 1). Log it in `costlog/costlog.csv` the same way, then compare the two rows.
