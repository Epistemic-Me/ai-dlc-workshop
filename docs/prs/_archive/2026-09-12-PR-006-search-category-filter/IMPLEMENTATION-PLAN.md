# PR #006: search-category-filter - Implementation Plan

Created: 2026-09-12
Branch: feature/pr-006-search-category-filter

## Approach

Option A from RESEARCH.md.

## Scope

- In scope: `category` in `SearchQuery`, `categories()`, the route param, the select on the home page.
- Out of scope: more than one category at a time, counts per category, category pages, saving the choice in the URL.

## Files

| File | Action | Purpose |
|---|---|---|
| `src/domains/search/types.ts` | Modify | Add `category?` to `SearchQuery`. |
| `src/domains/search/service.ts` | Modify | Filter by exact category before scoring. Add `categories()`. |
| `src/app/api/search/route.ts` | Modify | Read `category`. Return `categories`. |
| `src/app/page.tsx` | Modify | Add the select. |
| `src/domains/search/service.test.ts` | Modify | T1, T2. |

## Risk and rollback

- Blast radius: search results on the home page and in `GET /api/search`. Without `category`, results do not change.
- Rollback: revert the PR. No data change.
