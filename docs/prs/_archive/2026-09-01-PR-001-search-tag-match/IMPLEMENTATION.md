# PR #001: search-tag-match - Implementation

Created: 2026-09-01
Branch: feature/pr-001-search-tag-match
Status: Merged 2026-09-02

## Summary

`SearchService.search` now matches name, tags, and description, and ranks name matches first.

## Key changes

- `src/domains/search/service.ts`: new `score()` function. `search()` maps each product to a score, drops score 0, and sorts by score, then by name.
- `src/domains/search/service.test.ts`: tests T1 to T5 from TEST-STRATEGY.md.

## Deviations from plan

None.

## Learnings

- `"writing"` is a useful fixture for ranking. It is a tag on the Gel Pen Set and a description word on the Desk Lamp.

## Follow-up

- O1.OP1.S2 (category filter) is still `pending`. Its experiment O1.OP1.S2.A1.E1 has not run.
