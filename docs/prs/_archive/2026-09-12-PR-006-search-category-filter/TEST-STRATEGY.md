# PR #006: search-category-filter - Test Strategy

Created: 2026-09-12
Branch: feature/pr-006-search-category-filter

## Acceptance criteria

| AC | Criterion |
|---|---|
| AC1 | `search({ query, category })` returns only products whose `category` equals the value. `"coffee"` + `kitchen` returns `["prod_mug", "prod_kettle"]`. |
| AC2 | `categories()` returns each category once, sorted: `["kitchen", "office", "stationery"]`. |
| AC3 | `GET /api/search?q=coffee&category=kitchen` returns `{ results, categories }` with only kitchen products in `results`. |
| AC4 | The search page shows a Category select with "All categories" first. Changing it runs the search again. |

## Edge cases

- Empty query with a category: returns every product in that category, sorted by name.
- No match in the category: `"coffee"` + `office` returns `[]`.
- No category (`category=` or missing): no filter.

## Test matrix

| Test-ID | File | Test case | AC covered |
|---|---|---|---|
| T1 | `src/domains/search/service.test.ts` | filters by category | AC1 |
| T2 | `src/domains/search/service.test.ts` | lists categories | AC2 |
| M1 | `src/app/page.tsx` | Manual: `npm run dev`, choose "kitchen", search "coffee". Two results. | AC4 |
