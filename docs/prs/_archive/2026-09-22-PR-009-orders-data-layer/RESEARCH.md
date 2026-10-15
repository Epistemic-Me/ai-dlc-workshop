# PR #009: orders-data-layer - Research

Created: 2026-09-22
Branch: feature/pr-009-orders-data-layer
Size: L

## Problem

Engineers who add order features have no shared place to read and write orders. Checkout keeps orders in an array inside `InMemoryCheckoutProvider`. The only other read path is `LegacyOrderDao` in `src/legacy/`, which returns money as float dollars.

Evidence: for a user with orders of 10 and 20 cents, the legacy `getUserTotal` returns `0.30000000000000004`, because it adds `total_cents / 100` values. The support lead's order lookups show these values. The checkout spec says money is integer cents.

## Outcome

Serves: **none** on the tree. This is enabling work. No shopper sees a change. Later order features (for example, order history) need one store with money in cents.

## Options

| Option | What | For | Against |
|---|---|---|---|
| A | New `src/db/`: a small `Database`, versioned migrations with `up` and `down`, and `OrderRepository` in cents. Checkout writes through it. `LegacyOrderDao` reads the same `orders` table and keeps its old shape. | One store. Legacy callers do not change. Rollback is tested. | Two read layers exist until reads move. |
| B | Fix `LegacyOrderDao` in place to return cents. | One layer. | Changes the shape every legacy caller sees, all at once. |
| C | Add a read method to `InMemoryCheckoutProvider`. | Smallest diff. | Orders stay owned by one domain. No migrations. |

## Decision

Option A. It changes the write path now and lets reads move one call site at a time.
