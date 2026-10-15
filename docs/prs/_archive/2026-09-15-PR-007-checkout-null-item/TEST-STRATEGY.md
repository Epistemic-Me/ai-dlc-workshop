# PR #007: checkout-null-item - Test Strategy

Created: 2026-09-15
Branch: feature/pr-007-checkout-null-item

There is no route test file yet. This PR adds `src/app/api/checkout/route.test.ts`, which calls `POST` with a real `Request`.

## Acceptance criteria

| AC | Criterion |
|---|---|
| AC1 | `{"items":[null]}` returns status 400 with `error.code` `invalid_quantity`. It does not throw. |
| AC2 | A valid cart still returns 200 with a quote: 2 x `prod_pen` gives `subtotalCents` 1798. |

## Edge cases

- Invalid: `null` item (AC1).
- Empty: `{"items":[]}` already returns `empty_cart`. Unchanged; covered by the service test "rejects an empty cart".
- Error: a body that is not JSON already returns `invalid_json` from `readJson`. Unchanged.

## Test matrix

| Test-ID | File | Test case | AC covered |
|---|---|---|---|
| T1 | `src/app/api/checkout/route.test.ts` | rejects a null item instead of throwing | AC1 |
| T2 | `src/app/api/checkout/route.test.ts` | returns a quote for a valid cart | AC2 |
| T3 | `src/domains/checkout/service.test.ts` | rejects an empty cart (existing) | empty edge |
