# PR #006: search-category-filter - Implementation

Created: 2026-09-12
Branch: feature/pr-006-search-category-filter
Status: Merged 2026-09-13

## Summary

Shoppers can filter search results by one category. The API returns the list of categories so the page can build the select.

## Key changes

- `search({ query, category, limit })` filters with `p.category === category` before scoring.
- `categories()` returns a sorted, de-duplicated list from the provider.
- The route passes `params.get("category") || undefined`, so an empty value means no filter.
- The home page has a select with `aria-label="Category"`.

## Deviations from plan

None.

## Follow-up

- Add counts per category if shoppers ask for them.
