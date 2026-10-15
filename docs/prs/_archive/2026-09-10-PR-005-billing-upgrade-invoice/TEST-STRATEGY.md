# PR #005: billing-upgrade-invoice - Test Strategy

Created: 2026-09-10
Branch: feature/pr-005-billing-upgrade-invoice

## Acceptance criteria

| AC | Criterion |
|---|---|
| AC1 | An upgrade creates an invoice. |
| AC2 | Invoices are correct. |
| AC3 | A downgrade does not charge the user. |
| AC4 | Plan changes behave as before for the other cases. |

## Edge cases

- Same plan: `changePlan("user_1", "free")` for a Free user returns `same_plan`.
- Unknown plan: `"enterprise"` returns `unknown_plan`.
- No user: an empty user ID returns `unauthenticated`.
- Empty history: a new user has no invoices and is on `free`.

## Test matrix

All tests are in `src/domains/billing/service.test.ts`.

| Test-ID | Test case | AC covered |
|---|---|---|
| T1 | creates an invoice for the price difference on upgrade | AC1, AC2 |
| T2 | creates no invoice on downgrade | AC3 |
| T3 | rejects a change to the current plan | AC4 |
| T4 | rejects an unknown plan | AC4 |
| T5 | requires a user | AC4 |
| T6 | puts new users on the free plan | AC4 |
