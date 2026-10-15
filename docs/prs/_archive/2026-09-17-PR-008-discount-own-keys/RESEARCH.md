# PR #008: discount-own-keys - Research

Created: 2026-09-17
Branch: feature/pr-008-discount-own-keys
Size: S

## Problem

A discount code that is the name of a built-in object property breaks the quote. `POST /api/checkout` with `discountCode: "constructor"` returns status 200 with `discountCents: null` and `totalCents: null`. A shopper who places that order stores an order with no total.

Evidence: the support lead's ticket has the response body. It reproduces with one `curl` call.

Cause: the lookup in `CheckoutService.quote` reads `DISCOUNT_CODES[code]` with the code as typed, then in upper case. `DISCOUNT_CODES` is a plain object, so `DISCOUNT_CODES["constructor"]` is the inherited `Object` function, not `undefined`. `Math.round(subtotalCents * fn)` is `NaN`, and `NaN` becomes `null` in JSON.

## Outcome

Serves: **none** on the tree. This is a correctness fix for the code added in PR #003. Note that O1.OP2.S2 (discount codes) is `invalidated`; the code stays for the workshop.

## Options

| Option | What | For | Against |
|---|---|---|---|
| A | Normalize once (`trim().toUpperCase()`), then accept the code only if `Object.hasOwn(DISCOUNT_CODES, code)`. | Small. Keeps the exported `DISCOUNT_CODES` type. | Every future lookup must remember `hasOwn`. |
| B | Change `DISCOUNT_CODES` to a `Map`. | `Map.get` has no inherited keys. | Changes a public export of `@/domains/checkout`. |
| C | Build the table with `Object.create(null)`. | No prototype. | Easy to undo by accident with an object literal. |

## Decision

Option A. It fixes the bug in one place and does not change the public export.
