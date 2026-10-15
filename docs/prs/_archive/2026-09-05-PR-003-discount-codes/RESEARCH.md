# PR #003: discount-codes - Research

Created: 2026-09-05
Branch: feature/pr-003-discount-codes
Size: S

## Problem

Shoppers cannot use a promo code at checkout. The quote already has a `discountCents` field (PR #002), but it is always 0.

Evidence: the support lead forwarded two shopper messages that asked where to type a code from a workshop handout. One said: "I have a code but there is no box for it."

## Current state

- `CheckoutService.quote(items)` in `src/domains/checkout/service.ts` takes no code.
- `POST /api/checkout` reads `items` only.
- `/checkout` has the breakdown table from PR #002 with a Discount row.

## Approach

Add a `DISCOUNT_CODES` table in `service.ts` that maps a code to a rate: `{ WORKSHOP10: 0.1 }`. `quote(items, discountCode?)` looks up the code and sets `discountCents = Math.round(subtotalCents * rate)`. Tax is then 8% of the discounted subtotal, which matches the breakdown from PR #002.

The route passes `discountCode` from the body. The page gets a text box and an Apply button.

## Dependencies

- PR #002 (price breakdown) is merged.

## Open questions

- None.
