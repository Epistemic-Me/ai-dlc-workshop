# PR #005: billing-upgrade-invoice - Implementation

Created: 2026-09-10
Branch: feature/pr-005-billing-upgrade-invoice
Status: Merged 2026-09-11

## Summary

An upgrade now creates one invoice for the monthly price difference. A downgrade creates none.

## Key changes

- `Invoice = { id, userId, amountCents, description, createdAt }`.
- `changePlan` returns `PlanChange = { subscription, invoice }`.
- `BillingService` takes `{ now?, createId? }` so tests get fixed IDs (`inv_1`, `inv_2`).
- `GET /api/billing` returns `{ plans, subscription, invoices }`.

## Deviations from plan

- The subscription is saved before the invoice is added. Order did not matter for the tests.

## Learnings

- Free to Pro to Team gives invoices of 1900 and 3000 cents.

## Follow-up

- None.
