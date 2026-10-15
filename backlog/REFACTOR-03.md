# REFACTOR-03: One helper for the session lookup in route handlers

- Kind: refactor (no behavior change)
- Domain: auth (owner), billing, checkout
- Size: 2

## What

Four route handlers repeat the same code to turn an `Authorization` header into a user ID:

- `src/app/api/billing/route.ts` (`userIdFrom`)
- `src/app/api/orders/route.ts` (`userIdFrom`)
- `src/app/api/checkout/route.ts` (inline, inside `POST`)
- `src/app/api/support/route.ts` (inline, inside `POST`)

Move this into one function exported from `@/domains/auth` and use it in all three.

## Why

When the session rules change, four copies must change together. Two copies already differ: checkout and support do not use a helper.

## Acceptance criteria

1. `@/domains/auth` exports one function that takes a `Request` and returns the user ID or an empty string.
2. The four routes use it. No route reads the `authorization` header itself.
3. Behavior does not change: same status codes and bodies for logged-in, logged-out, and expired-session requests.
4. A unit test covers the new function: valid token, missing header, wrong scheme, expired session.

## Out of scope

- Changes to how sessions are stored or how long they last.
