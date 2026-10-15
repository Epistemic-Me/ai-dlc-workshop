# PR #005: billing-upgrade-invoice - Implementation Plan

Created: 2026-09-10
Branch: feature/pr-005-billing-upgrade-invoice

## Approach

Option B from RESEARCH.md.

## Files

| File | Action | Purpose |
|---|---|---|
| `src/domains/billing/types.ts` | Modify | Add `Invoice` and `addInvoice` / `listInvoices` to `BillingProvider`. |
| `src/domains/billing/provider.ts` | Modify | Store invoices in memory. |
| `src/domains/billing/service.ts` | Modify | `changePlan` returns `{ subscription, invoice }`. Add `listInvoices`. |
| `src/app/api/billing/route.ts` | Modify | Return `invoices` from GET and `invoice` from POST. |
| `src/domains/billing/service.test.ts` | Modify | T1 and T2. |

## Steps

1. Add the `Invoice` type and the provider methods.
2. In `changePlan`, compute `difference = next.monthlyPriceCents - currentPlan.monthlyPriceCents`.
3. If `difference > 0`, create an invoice with `description: "Upgrade to <plan name>"`.
4. Return `{ subscription, invoice }` (`invoice` is `null` when there is none).
5. Update the route and the tests.
6. Run `npm run lint && npm run typecheck && npm test && npm run build`.

## Verification

- [x] T1 to T6 pass.
- [x] Build passes.
