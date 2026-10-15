# Spec register

One row per spec in `docs/specs/`. Each spec serves one tree node.

| Spec | Domain | Serves node | State | Owner | Notes |
|---|---|---|---|---|---|
| [search.md](../../specs/search.md) | search | O1.OP1.S1 | `shipped` | search agent | Tag match and name-first ranking |
| [checkout.md](../../specs/checkout.md) | checkout | O1.OP2.S1 | `testing` | checkout agent | Price breakdown and discount codes |
| [auth.md](../../specs/auth.md) | auth | O1.OP3 | `draft` | auth agent | Waits on session-length evidence |
| [billing.md](../../specs/billing.md) | billing | none (separate outcome) | `shipped` | billing agent | Not on the example tree; needs its own |

States: `draft`, `approved`, `in progress`, `testing`, `shipped`, `retired`.
