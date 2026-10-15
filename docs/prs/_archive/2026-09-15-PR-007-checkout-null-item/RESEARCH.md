# PR #007: checkout-null-item - Research

Created: 2026-09-15
Branch: feature/pr-007-checkout-null-item
Size: S

## Problem

`POST /api/checkout` with `{"items":[null]}` throws, and the client gets a 500 with no error code. Any client with a bug in its cart code can hit this.

Evidence: the server log shows `TypeError: Cannot read properties of null (reading 'productId')` from `parseItems` in `src/app/api/checkout/route.ts`. It reproduces with one `curl` call with that body.

## Current state

`parseItems` maps each item to `{ productId: String(item.productId ?? ""), quantity: Number(item.quantity) }`. It reads properties before it checks that `item` is an object.

## Outcome

Serves: **none** on the tree. This is a crash fix. It does not change what a shopper with a valid cart sees.

## Options

| Option | What | For | Against |
|---|---|---|---|
| A | In `parseItems`, check `item && typeof item === "object"` before reading. An item that is not an object gets `productId: ""` and `quantity: NaN`, so `CheckoutService.quote` returns `invalid_quantity`. | Reuses the domain check and an error code that already maps to 400. | The error code says "quantity" for an item that is not an object. |
| B | Return a new code, `invalid_item`, from the route. | More exact message. | New code in `STATUS` in `src/lib/http.ts` and in the page's error handling. |
| C | Wrap `POST` in `try/catch` and return 400. | Catches every throw. | Hides other bugs as 400s. |

## Decision

Option A. It is the smallest change, and the client already handles `invalid_quantity`.
