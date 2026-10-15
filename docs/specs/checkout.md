# Spec: checkout

- Domain: checkout
- Serves: O1.OP2.S1 (show subtotal, discount, and tax before the order)
- State: `testing`
- Owner: checkout agent

## Behavior

Shoppers see a full price breakdown for a cart, can apply a discount code, and place an order when logged in.

## Acceptance criteria

1. `quote(items, discountCode?)` returns lines, subtotal, discount, tax, and total in integer cents.
2. Quantity must be a whole number from 1 to 99. Otherwise `invalid_quantity`.
3. Unknown product ID returns `unknown_product`. Empty cart returns `empty_cart`.
4. Discount code `WORKSHOP10` takes 10% off the subtotal. Codes are case-insensitive. An unknown code returns `invalid_discount`.
5. Tax is 8% of the discounted subtotal, rounded to the nearest cent.
6. `placeOrder` requires a logged-in user (`unauthenticated` otherwise) and stores the order.
7. Checkout reads product prices through `@/domains/search` only.
8. `POST /api/checkout` with `{ items, discountCode? }` returns `{ quote }`. With `place: true` it returns `{ order }` and status 201.

## Out of scope

- Payment capture, inventory, shipping.

## Tests

`src/domains/checkout/service.test.ts`
