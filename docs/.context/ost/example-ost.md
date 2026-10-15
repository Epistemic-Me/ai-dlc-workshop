# Example OST: Workshop Store

This is an example tree for the app in this repo. The numbers are illustrative sample data for the workshop, not real measurements.

Owner: product lead. Reviewer: engineering lead.

## Outcome

**O1: Raise the share of sessions that start with a search and end with a placed order.**

- Metric: orders placed ÷ sessions with at least one search.
- Baseline: 3.1% (sample data).
- Target: 4.0%.

## Opportunities

### O1.OP1: Shoppers do not find products when they use a general word

- Evidence: in sample search logs, 18% of queries return no results. Most are general words such as "coffee" or "desk".
- State: `validated`

#### Solution O1.OP1.S1: Match tags and descriptions, rank name matches first

- Assumption O1.OP1.S1.A1 (desirability): shoppers type words that appear in tags but not in names.
  - Experiment O1.OP1.S1.A1.E1: replay 200 sample queries against names only and against names plus tags.
  - Pass criterion: 20% or more of zero-result queries return a result with tags.
  - Result: 41%. `validated`
- Assumption O1.OP1.S1.A2 (usability): shoppers still see the product they named at the top.
  - Experiment O1.OP1.S1.A2.E1: unit test that a name match always ranks above a tag match.
  - Pass criterion: test passes for every product in the catalog.
  - Result: passes. `validated`
- State: `shipped` (see `src/domains/search/service.ts`)

#### Solution O1.OP1.S2: Category filter on the search page

- Assumption O1.OP1.S2.A1 (usability): shoppers use a filter when results are long.
  - Experiment O1.OP1.S2.A1.E1: count filter use across 100 sample sessions with more than 5 results.
  - Pass criterion: 15% or more of those sessions use the filter.
  - Result: not run. `pending`
- State: `pending`

### O1.OP2: Shoppers leave checkout when the total is higher than they expected

- Evidence: in sample session notes, 6 of 10 shoppers who left checkout said tax was a surprise.
- State: `testing`

#### Solution O1.OP2.S1: Show subtotal, discount, and tax before the shopper places the order

- Assumption O1.OP2.S1.A1 (desirability): a full price breakdown reduces exits at checkout.
  - Experiment O1.OP2.S1.A1.E1: compare exit rate on the checkout page with and without the breakdown table.
  - Pass criterion: exit rate drops by 10% or more relative to the baseline.
  - Result: running. `testing`
- State: `testing`

#### Solution O1.OP2.S2: Discount codes

- Assumption O1.OP2.S2.A1 (viability): a 10% code raises orders enough to cover the lost margin.
  - Experiment O1.OP2.S2.A1.E1: offer `WORKSHOP10` to half of sample sessions.
  - Pass criterion: order rate rises by 12% or more relative to the control half.
  - Result: 5%. `invalidated`
- State: `invalidated`. The code stays in the app for the workshop exercises.

### O1.OP3: Returning shoppers must log in again before checkout

- Evidence: unknown. The team needs session length data from auth logs before this opportunity can be ranked.
- State: `pending`

## Gaps

- O1.OP3 has no evidence yet. Needed: how often a session expires between search and checkout.
- Billing plans are not on this tree. They serve a different outcome (paid conversion) and need their own tree.
