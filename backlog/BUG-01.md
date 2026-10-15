# BUG-01: Order limit of 99 per product can be passed

- Kind: bug
- Domain: checkout
- Reported by: support team
- Size: 2

## What happened

A customer placed an order with 150 notebooks. The order page showed "Dot Grid Notebook" on two lines, one with quantity 99 and one with quantity 51. The store limit is 99 of one product per order.

Steps to reproduce:

1. Log in as `ada@example.com`.
2. `POST /api/checkout` with `{"items":[{"productId":"prod_notebook","quantity":99},{"productId":"prod_notebook","quantity":51}],"place":true}`.
3. The response is 201 and the order has two lines for the same product.

## Expected

One line per product, and the 99 limit applies to the total quantity of that product.

## Acceptance criteria

1. A cart with the same product on two or more lines gives a quote with one line for that product, with the quantities added.
2. If the added quantity is more than 99, the quote and the order fail with `invalid_quantity`.
3. Carts with one line per product behave as they do today. The existing checkout tests still pass.
4. A test covers each of the cases above.

## Out of scope

- Changes to the checkout page.
- A different limit per product.
