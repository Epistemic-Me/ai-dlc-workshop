# Spec: search

- Domain: search
- Serves: O1.OP1.S1 (match tags and descriptions, rank names first)
- State: `shipped`
- Owner: search agent

## Behavior

Shoppers search the product catalog by text and filter by category.

## Acceptance criteria

1. Match is case-insensitive across name, tags, and description.
2. Ranking: name match, then tag match, then description match. Ties sort by name.
3. Empty or blank query returns all products (after the category filter), sorted by name.
4. `category` filters to an exact category value.
5. `limit` defaults to 20 and is clamped to 1..50.
6. No match returns an empty list, not an error.
7. `GET /api/search?q=&category=&limit=` returns `{ results, categories }`.

## Out of scope

- Typo tolerance, synonyms, pagination.

## Tests

`src/domains/search/service.test.ts`
