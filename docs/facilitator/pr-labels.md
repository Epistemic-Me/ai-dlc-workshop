# Facilitator key: labels for the ten archived PRs

Learners label each PR in `docs/prs/_archive/` as `good` or `bad` against `docs/SPEC-CHECKLIST.md`, and tag its domain. Do not share this file with learners before the exercise.

A PR is `good` only when all nine checklist items are yes.

## Labels

| PR | Folder | Domain | Label | Items missed |
|---|---|---|---|---|
| #001 | `2026-09-01-PR-001-search-tag-match` | search | good | none |
| #002 | `2026-09-03-PR-002-checkout-price-breakdown` | checkout | good | none |
| #003 | `2026-09-05-PR-003-discount-codes` | checkout | bad | 2, 3, 4, 6 |
| #004 | `2026-09-08-PR-004-auth-session-ttl` | auth | good | none |
| #005 | `2026-09-10-PR-005-billing-upgrade-invoice` | billing | bad | 4, 7, 8, 9 |
| #006 | `2026-09-12-PR-006-search-category-filter` | search | bad | 1, 5, 6 |
| #007 | `2026-09-15-PR-007-checkout-null-item` | checkout | good | none |
| #008 | `2026-09-17-PR-008-discount-own-keys` | checkout | good | none |
| #009 | `2026-09-22-PR-009-orders-data-layer` | db | good | none |
| #010 | `2026-09-24-PR-010-orders-history-route` | checkout | bad | 3, 5, 8, 9 |

## Evidence for the bad PRs

### PR #003 discount-codes (checkout)

| Item | Evidence |
|---|---|
| 2 Outcome | RESEARCH.md names no tree node and does not say "none". The tree has O1.OP2.S2 (discount codes) for this exact change. |
| 3 Options | RESEARCH.md has one "Approach". No second option, no reason for the pick. |
| 4 Testable criteria | AC2 "The discount works with tax and the total" and AC3 "Codes are handled correctly" have no checkable result. |
| 6 Test matrix | AC3 maps to "-" ("covered by the `invalid_discount` path"). No test for an unknown code. PR #008 later fixes a bug on that path. |

### PR #005 billing-upgrade-invoice (billing)

| Item | Evidence |
|---|---|
| 4 Testable criteria | AC2 "Invoices are correct" and AC4 "behave as before for the other cases" state no amount or code. |
| 7 Scope | IMPLEMENTATION-PLAN.md has no Scope section. Proration, refunds, and payment methods are not ruled out. |
| 8 Risk and rollback | IMPLEMENTATION-PLAN.md has no blast radius and no undo step. Invoices are money records. |
| 9 Review with evidence | REVIEW.md says "LGTM, tests pass." No per-AC table, no test output, no values. |

### PR #006 search-category-filter (search)

| Item | Evidence |
|---|---|
| 1 Problem | The evidence is "Users will obviously want a way to narrow a long list." The tree node O1.OP1.S2 is `pending` and its experiment (O1.OP1.S2.A1.E1) has "not run". Item 2 is technically met (the node is named), but the PR ships a solution with no evidence. |
| 5 Edge cases | No unknown category (for example `category=garden`, which silently returns `[]`). |
| 6 Test matrix | AC3 (`GET /api/search?q=coffee&category=kitchen`) has no row in the matrix. M1 maps to AC4 only. The review fills the gap with a browser check that the matrix never planned. |

### PR #010 orders-history-route (checkout)

| Item | Evidence |
|---|---|
| 3 Options | RESEARCH.md has one "Approach": the legacy helpers. It does not compare `OrderRepository` from `@/db`, which PR #009 and LEGACY-06 say new code should use. |
| 5 Edge cases | Only "no session" is named. Nothing on what the legacy layer returns: `null` for no orders, order by ID text (random for `order_<uuid>` IDs) instead of newest first, `total` and `totalSpent` in float dollars, `created` as ISO text. |
| 8 Risk and rollback | IMPLEMENTATION-PLAN.md has no risk or rollback section. The route adds a new caller to the layer LEGACY-06 is removing, and the response shape becomes a public contract. |
| 9 Review with evidence | AC2 evidence is "has `orders` and `totalSpent`, as described". No body checked for shape, units, or order. AC3 evidence is a description of the helper; T1 inserts one user only and does not test exclusion. |

## Why the good PRs pass

- #001: sample-data evidence, node O1.OP1.S1, three options, exact result lists, edge cases incl. limit clamp, rollback by revert.
- #002: node O1.OP2.S1 (builds the experiment's variant), cents math with a rounding fixture (186.64 to 187), manual page check with exact values.
- #004: tree "none" with the reason and the O1.OP3 risk, three options, injected clock, boundary test at exactly `SESSION_TTL_MS`.
- #007: log line as evidence, three options, new route test, failing-on-parent proof.
- #008: response body as evidence, three options, T1 to T4 with codes, the review notes that T1 does not isolate `Object.hasOwn`.
- #009: float-sum evidence, three options, migration up and down tested, names what still reads from `src/legacy/` and opens LEGACY-06.
