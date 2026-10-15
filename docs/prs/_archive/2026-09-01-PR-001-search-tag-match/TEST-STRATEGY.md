# PR #001: search-tag-match - Test Strategy

Created: 2026-09-01
Branch: feature/pr-001-search-tag-match

## Acceptance criteria

| AC | Criterion |
|---|---|
| AC1 | `search({ query: "ergonomic" })` returns `["prod_stand"]` (tag match). |
| AC2 | A word only in a description matches: `"writing"` includes `prod_lamp`. |
| AC3 | Name match ranks above tag match, tag above description. Ties sort by name. `"writing"` returns `["prod_pen", "prod_lamp"]`. `"kettle"` returns `["prod_kettle"]`. |
| AC4 | Match is case-insensitive: `"MUG"` returns `["prod_mug"]`. |
| AC5 | No match returns `[]`, not an error: `"submarine"` returns `[]`. |
| AC6 | A blank query (`"  "`) returns all products, sorted by name. |

## Edge cases

- Empty: blank query returns the full catalog (AC6). No match returns `[]` (AC5).
- Invalid: `limit` of `NaN`, `0`, or `1000` is clamped to 20, 1, and 50 by `clampLimit`. Unchanged by this PR; the test stays green.
- Error: the service has no error path. The route's 400 `invalid_input` for a query over 200 characters is unchanged.

## Test matrix

All tests are in `src/domains/search/service.test.ts`.

| Test-ID | Test case | AC covered |
|---|---|---|
| T1 | matches tags | AC1 |
| T2 | ranks name matches above tag and description matches | AC2, AC3 |
| T3 | is case-insensitive | AC4 |
| T4 | returns an empty list when nothing matches | AC5 |
| T5 | returns all products sorted by name for an empty query | AC6 |
| T6 | clamps the limit | invalid `limit` edge case |
