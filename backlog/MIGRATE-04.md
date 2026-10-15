# MIGRATE-04: Move order lines into their own table

- Kind: schema migration
- Domain: db (lead), with the legacy layer as a consumer
- Size: 5

## What

Orders keep their lines as a JSON string in `orders.lines_json` (`src/db/schema.ts`). Add migration `002` that moves the lines into a new `order_lines` table, one row per line, with an `order_id` column.

## Why

Reports that need "how many notebooks did we sell" must parse JSON for every order. A table makes those reads simple and lets the data layer check each line.

## Acceptance criteria

1. Migration `002` creates `order_lines` with columns `order_id`, `position`, `product_id`, `name`, `quantity`, `unit_price_cents`, `line_total_cents`.
2. `up` copies every line of every existing order into `order_lines`, in order, and removes `lines_json` from the orders rows.
3. `down` puts `lines_json` back on each order with the same content as before, and drops `order_lines`. Up then down gives back the same rows.
4. `OrderRepository` reads and writes lines through `order_lines`. Its public methods keep their signatures and results.
5. The legacy layer (`src/legacy/order-dao.ts`) still returns the same results for the same data.
6. Tests cover: up on an empty database, up with existing orders, down after up, and the repository after up.

## Out of scope

- Changes to API responses.
- Moving the legacy call sites (that is LEGACY-06).

## Notes

- `migrate()` in `src/db/migrations/index.ts` runs migrations in order. Add the new migration at the end of `MIGRATIONS`.
- The arena in `arena/MIGRATE-04/` has three recorded attempts at this ticket.
