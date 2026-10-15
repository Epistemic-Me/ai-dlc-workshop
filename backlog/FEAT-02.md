# FEAT-02: Save a cart for later

- Kind: feature
- Domain: checkout
- Serves: O1.OP2 (shoppers leave checkout), `pending`
- Size: 3

## What

A logged-in shopper can save the current cart and load it again later in the same server session.

## Why

Shoppers who leave checkout lose their cart. Some come back and give up when they must find every product again.

## Acceptance criteria

1. `POST /api/cart/saved` with `{ items }` saves the cart for the logged-in user and returns `{ savedCart }` with status 201.
2. `GET /api/cart/saved` returns `{ savedCart }` for the logged-in user, or `{ savedCart: null }` when there is none.
3. Saving again replaces the earlier saved cart. One saved cart per user.
4. Both routes return 401 `unauthenticated` with no session.
5. Items are checked with the same rules as a quote (known product, quantity 1 to 99). A bad cart returns the same error code as a quote.
6. One user never sees another user's saved cart.

## Out of scope

- More than one saved cart per user.
- Keeping saved carts after a server restart.
- Page changes, unless the plan shows they are small.
