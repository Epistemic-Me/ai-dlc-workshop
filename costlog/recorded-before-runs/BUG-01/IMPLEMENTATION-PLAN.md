# BUG-01: merge-cart-lines - Plan

Use this plan for the Lab 2 "after" run if your pair planned a different ticket in Lab 1.

## Approach

Merge cart lines by product in `CheckoutService.quote` before any other check, then apply the existing quantity rule to the merged total. The route and the page do not change.

## Scope

- In: `src/domains/checkout/service.ts`, `src/domains/checkout/service.test.ts`.
- Out: the checkout page, the route, a per-product limit, orders already stored.

## Acceptance criteria (from `backlog/BUG-01.md`)

| AC | Criterion |
|---|---|
| AC1 | Two or more lines for one product give one quote line with the quantities added, in the order the product first appears. |
| AC2 | A merged quantity above 99 fails with `invalid_quantity`. |
| AC3 | Carts with one line per product give the same quote as before. |
| AC4 | A test covers each case. |

## Steps

1. Add tests first: `merges duplicate lines` (AC1), `rejects a merged quantity above 99` (AC2), `keeps the order of first appearance` (AC1). Run them and see them fail.
2. In `quote`, build a map from product ID to total quantity, keeping first-appearance order. Loop over the map instead of `items`. (AC1, AC2)
3. Run `npm test`. The existing quote tests must pass unchanged. (AC3)
4. Run `npm run lint && npm run typecheck && npm test && npm run build`.

## Rollback

Revert the commit. No stored data changes. If the change is wrong, only quotes and new orders are affected.

## Verification checklist

- [ ] The three new tests fail before step 2 and pass after it.
- [ ] Existing checkout tests pass with no edits.
- [ ] All four checks pass.
