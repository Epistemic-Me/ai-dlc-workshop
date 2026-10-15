# PR #008: discount-own-keys - Test Strategy

Created: 2026-09-17
Branch: feature/pr-008-discount-own-keys

## Acceptance criteria

| AC | Criterion |
|---|---|
| AC1 | `quote(items, "constructor")` returns `invalid_discount`. |
| AC2 | An unknown code (`"FREE"`) returns `invalid_discount`. |
| AC3 | `" workshop10 "` still applies: on a 1000-cent cart, `discountCode` `WORKSHOP10`, `discountCents` 100, `taxCents` 72, `totalCents` 972. |
| AC4 | `POST /api/checkout` with a code that is not text (`123`) returns 400 `invalid_discount`. |

## Edge cases

- Empty: no code, or `""`, gives no discount (`discountCode: null`).
- Invalid: inherited names (AC1), unknown codes (AC2), non-text codes (AC4).
- Error: no path returns status 200 with a `null` money field.

## Test matrix

| Test-ID | File | Test case | AC covered |
|---|---|---|---|
| T1 | `src/domains/checkout/service.test.ts` | rejects inherited object names as discount codes | AC1 |
| T2 | `src/domains/checkout/service.test.ts` | rejects an unknown discount code | AC2 |
| T3 | `src/domains/checkout/service.test.ts` | applies the WORKSHOP10 code case-insensitively | AC3 |
| T4 | `src/app/api/checkout/route.test.ts` | rejects a discount code that is not text | AC4 |
| T5 | `src/domains/checkout/service.test.ts` | computes subtotal, tax, and total without a discount (existing) | empty edge |
