# PR #002: checkout-price-breakdown - Research

Created: 2026-09-03
Branch: feature/pr-002-checkout-price-breakdown
Size: M

## Problem

Shoppers see one total on the checkout page. Tax is not shown until after the order. Shoppers leave checkout when the total is higher than they expected.

Evidence: in the sample session notes on the tree, 6 of 10 shoppers who left checkout said tax was a surprise (sample data, O1.OP2).

## Outcome

Serves **O1.OP2.S1** (show subtotal, discount, and tax before the shopper places the order).

The assumption O1.OP2.S1.A1 is `testing`. Its experiment O1.OP2.S1.A1.E1 compares exit rate with and without the breakdown table. This PR builds the "with" side, which the experiment needs.

## Options

| Option | What | For | Against |
|---|---|---|---|
| A | `CheckoutService.quote` returns `subtotalCents`, `discountCents`, `taxCents`, `totalCents`. The page shows the rows. | One place computes money. The order stores the same numbers the shopper saw. | Changes the `Quote` type. |
| B | The page computes tax in the browser from `TAX_RATE`. | No API change. | Two places round money. The page and the stored order can differ by a cent. |

## Decision

Option A. Money is computed once, in integer cents, on the server.

## Notes

- `discountCents` is always 0 in this PR. No discount code exists yet. The field is there so the page has a fixed set of rows.
