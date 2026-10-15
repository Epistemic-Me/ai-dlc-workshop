# Spec checklist

Use this before any code, in peer review of a spec or a PR's planning docs, and to label merged PRs good or bad. A spec passes when every item is yes.

| # | Check | Where it usually lives |
|---|---|---|
| 1 | **Problem.** It says who has the problem and what happens today, with evidence (a ticket, a log, a quote). | `RESEARCH.md` |
| 2 | **Outcome.** It names the tree node it serves in `docs/.context/ost/`, or says "none" and why. | `RESEARCH.md` or the spec |
| 3 | **Options.** It compares at least two options and says why it picked one. | `RESEARCH.md` |
| 4 | **Testable criteria.** Each acceptance criterion has a result another person could check as pass or fail. No "works well" or "is correct". | `TEST-STRATEGY.md` |
| 5 | **Edge cases.** It names the empty, invalid, and error cases. | `TEST-STRATEGY.md` |
| 6 | **Test matrix.** Every criterion maps to at least one named test. | `TEST-STRATEGY.md` |
| 7 | **Scope.** It says what is out of scope. | `IMPLEMENTATION-PLAN.md` |
| 8 | **Risk and rollback.** It says what breaks if the change is wrong (blast radius) and how to undo it. | `IMPLEMENTATION-PLAN.md` |
| 9 | **Review with evidence.** The review checks each criterion against evidence, not against the description. | `REVIEW.md` |

A label for a merged PR is `good` (all yes) or `bad` (one or more no), plus a domain tag: `auth`, `search`, `checkout`, `billing`, `db`, `support-agent`, or `harness`.
