# PR #001: search-tag-match - Research

Created: 2026-09-01
Branch: feature/pr-001-search-tag-match
Size: S

## Problem

Shoppers who search with a general word often get no results. Today `SearchService.search` in `src/domains/search/service.ts` matches product names only.

Evidence: in the sample search logs on the tree, 18% of queries return no results, and most are general words such as "coffee" or "desk" (sample data, O1.OP1). Example: `q=ergonomic` returns nothing, but the Laptop Stand has the tag `ergonomic`.

## Outcome

Serves **O1.OP1.S1** (match tags and descriptions, rank name matches first).

- O1.OP1.S1.A1 is `validated`: the replay of 200 sample queries found results for 41% of zero-result queries when tags were added (sample data).
- O1.OP1.S1.A2 (name match stays on top) is checked by a unit test in this PR.

## Options

| Option | What | For | Against |
|---|---|---|---|
| A | Match name, tags, and description. Score 3 / 2 / 1. Sort by score, then name. | Small change in one function. Uses data we already have. | No typo tolerance. |
| B | A hand-written synonym list per product. | Can match words that are in no field. | Someone must keep the list current. Not what A1 tested. |
| C | Fuzzy match on names. | Catches typos. | Does not help "coffee" or "desk", which are real words that are not in names. |

## Decision

Option A. It is the solution the experiment validated, and it keeps the name match on top. Typos are a separate problem.
