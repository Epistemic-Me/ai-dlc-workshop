# Spec: billing

- Domain: billing
- Serves: none on the example tree (paid conversion is a separate outcome)
- State: `shipped`
- Owner: billing agent

## Behavior

Logged-in users see the plans, their current plan, and their invoices, and can change plans.

## Acceptance criteria

1. Plans: Free ($0), Pro ($19/month), Team ($49/month). Prices in integer cents.
2. A user with no subscription is on the Free plan.
3. `changePlan` to an unknown plan returns `unknown_plan`.
4. `changePlan` to the current plan returns `same_plan`.
5. An upgrade creates one invoice for the monthly price difference.
6. A downgrade creates no invoice.
7. Changing plans requires a logged-in user (`unauthenticated` otherwise).
8. `GET /api/billing` returns `{ plans, subscription, invoices }`. `subscription` is `null` when logged out. `POST /api/billing` with `{ planId }` returns `{ subscription, invoice }`.

## Out of scope

- Proration by day, refunds, payment methods.

## Tests

`src/domains/billing/service.test.ts`
