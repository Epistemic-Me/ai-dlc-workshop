# PR #001: search-tag-match - Implementation Plan

Created: 2026-09-01
Branch: feature/pr-001-search-tag-match

## Approach

Option A from RESEARCH.md.

## Scope

- In scope: the match and sort logic in `SearchService.search`, and its tests.
- Out of scope: typo tolerance, synonyms, pagination, changes to `src/app/page.tsx` or `GET /api/search`.

## Files

| File | Action | Purpose |
|---|---|---|
| `src/domains/search/service.ts` | Modify | Add `score(product, term)`: 3 name, 2 tag, 1 description, 0 none. Filter score > 0, sort by score then name. |
| `src/domains/search/service.test.ts` | Modify | Add T1 to T5. |

## Steps

1. Write T1 to T5. Confirm T1, T2, and T4 fail on the current code.
2. Add `score()` and the new sort in `search()`.
3. Run `npm run lint && npm run typecheck && npm test && npm run build`.

## Risk and rollback

- Blast radius: the order and content of search results on the home page and in `GET /api/search`. Checkout reads prices with `searchService.getProduct`, which does not change.
- If it is wrong: shoppers see extra results or a different order. No data is written.
- Rollback: revert the PR. There is no schema or data change.
