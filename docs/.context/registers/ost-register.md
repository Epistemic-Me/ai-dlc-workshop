# OST register

One row per tree node. A state changes only when the Evidence column links to the proof. A closed ticket is not evidence.

| ID | Type | Title | State | Evidence | Updated |
|---|---|---|---|---|---|
| O1 | Outcome | Raise search-to-order conversion | `testing` | Baseline 3.1% (sample data) | 2026-10-01 |
| O1.OP1 | Opportunity | General words return no results | `validated` | 18% zero-result queries in sample logs | 2026-10-01 |
| O1.OP1.S1 | Solution | Match tags and descriptions, rank names first | `shipped` | `src/domains/search/service.test.ts` | 2026-10-08 |
| O1.OP1.S1.A1 | Assumption (desirability) | Shoppers type tag words | `validated` | E1: 41% of zero-result queries recovered | 2026-10-05 |
| O1.OP1.S1.A2 | Assumption (usability) | Name matches stay on top | `validated` | E1: ranking unit test passes | 2026-10-05 |
| O1.OP1.S2 | Solution | Category filter | `pending` | none | 2026-10-01 |
| O1.OP2 | Opportunity | Total higher than expected at checkout | `testing` | 6 of 10 session notes cite tax surprise | 2026-10-02 |
| O1.OP2.S1 | Solution | Price breakdown before order | `testing` | E1 running | 2026-10-08 |
| O1.OP2.S2 | Solution | Discount codes | `invalidated` | E1: +5% against a 12% pass criterion | 2026-10-09 |
| O1.OP3 | Opportunity | Repeat login before checkout | `pending` | unknown | 2026-10-01 |
