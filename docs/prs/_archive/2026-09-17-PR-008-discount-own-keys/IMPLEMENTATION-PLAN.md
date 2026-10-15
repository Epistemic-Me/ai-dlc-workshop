# PR #008: discount-own-keys - Implementation Plan

Created: 2026-09-17
Branch: feature/pr-008-discount-own-keys

## Approach

Option A from RESEARCH.md.

## Scope

- In scope: the code lookup in `quote()`, the type check for `discountCode` in the route, tests T1, T2, T4.
- Out of scope: new codes, a `Map` for the table, changes to the checkout page.

## Files

| File | Action | Purpose |
|---|---|---|
| `src/domains/checkout/service.ts` | Modify | `code = discountCode?.trim().toUpperCase() \|\| null`. Check `Object.hasOwn(DISCOUNT_CODES, code)`. |
| `src/app/api/checkout/route.ts` | Modify | Return `invalid_discount` when `discountCode` is present and not a string. |
| `src/domains/checkout/service.test.ts` | Modify | T1, T2. |
| `src/app/api/checkout/route.test.ts` | Modify | T4. |

## Risk and rollback

- Blast radius: every quote and order that sends a code. If the check is wrong, `WORKSHOP10` stops working; T3 guards this.
- Rollback: revert the PR. No data change. Orders stored with `null` totals before the fix are in memory and clear on restart.
