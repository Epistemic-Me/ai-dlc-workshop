# ADR-001: New order code uses `@/db`; `@/legacy` gets no new callers

- Date: 2026-09-22
- Status: Accepted
- PR: `docs/prs/_archive/2026-09-22-PR-009-orders-data-layer/`

## Context

Orders were read through `LegacyOrderDao` (`src/legacy/order-dao.ts`). It returns `null` for no orders, sorts by order ID as text, and returns dollars as floats. The repo rule is integer cents. `OrderRepository` (`src/db/order-repository.ts`) reads the same tables with the repo's rules.

## Decision

All new order code uses `OrderRepository` from `@/db`. No new call sites use `@/legacy`. Existing call sites move one at a time under `backlog/LEGACY-06.md`, each with characterization tests first. `src/legacy/` is deleted after the last call site moves.

## Consequences

- Good: one shape for orders in new code; each migration step is small and can be checked.
- Cost: two layers live side by side for a while, and callers can see different results for the same data. `docs/.context/ARCHITECTURE.md` lists the differences.

## Options not chosen

- Move every call site in one PR: a large blast radius, and no characterization of the old behavior first.
- Make the legacy layer an adapter over the repository: it changes legacy results for every caller at once.
