# PR #006: search-category-filter - Research

Created: 2026-09-12
Branch: feature/pr-006-search-category-filter
Size: S

## Problem

Since PR #001, a general word returns more products. A search for "coffee" now returns the Ceramic Mug and the Pour-Over Kettle, and a search for "desk" returns the Desk Lamp and the Laptop Stand. As the catalog grows, result lists get longer.

Users will obviously want a way to narrow a long list, and a category filter is the standard way stores do it.

## Outcome

Serves **O1.OP1.S2** (category filter on the search page).

## Current state

- Every product has a `category`: `stationery`, `kitchen`, or `office`.
- `SearchService.search` takes `{ query, limit }`.
- `GET /api/search` returns `{ results }`.

## Options

| Option | What | For | Against |
|---|---|---|---|
| A | A `<select>` with "All categories" plus each category. The route takes `category`. | One control. Works with the keyboard. List comes from the data. | One category at a time. |
| B | Clickable chips, more than one active. | Faster to switch. | Needs multi-value params and more page state. |

## Decision

Option A. The categories come from `SearchService.categories()`, so a new category shows up with no page change.
