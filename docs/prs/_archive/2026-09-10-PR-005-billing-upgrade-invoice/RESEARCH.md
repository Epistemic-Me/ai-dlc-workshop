# PR #005: billing-upgrade-invoice - Research

Created: 2026-09-10
Branch: feature/pr-005-billing-upgrade-invoice
Size: S

## Problem

A user who upgrades a plan is not charged for it. `BillingService.changePlan` in `src/domains/billing/service.ts` saves the new subscription and creates no invoice.

Evidence: the support lead logged a ticket. A user moved from Pro to Team, and `GET /api/billing` returned `invoices: []`. The billing page showed "Team" with no invoice line.

## Outcome

Serves: **none** on the example tree. Billing serves paid conversion, which is a different outcome. The tree's Gaps section says billing needs its own tree.

## Options

| Option | What | For | Against |
|---|---|---|---|
| A | Invoice the full monthly price of the new plan. | Simple. | Charges Pro users the full Team price after they already paid for Pro. |
| B | Invoice the monthly price difference (new minus current). No invoice on a downgrade. | Fair for a mid-month change. Simple math in cents. | Not exact by day. |
| C | Prorate by the days left in the month. | Exact. | Needs a billing period, which the model does not have. |

## Decision

Option B. Plans have a monthly price in cents (Free 0, Pro 1900, Team 4900), so the difference is one subtraction.
