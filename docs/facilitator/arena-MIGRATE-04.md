# Facilitator key: MIGRATE-04 arena

For facilitators. Do not share before the room has judged. Learners judge with their own rubric; this is one reference reading, with the evidence behind it.

## Evidence

A probe inserted two orders (`order_9` at time 30, `order_10` at time 20) for one user, read them through the legacy layer, then ran `migrate(db, 1)` and `migrate(db, 2)`. Results on the base commit and on each attempt:

| | Legacy order IDs | Legacy, user with no orders | After `down` | After `up` again |
|---|---|---|---|---|
| Base `42d2b3b` | `order_10, order_9` | `null` | n/a | n/a |
| A | `order_10, order_9` | `null` | orders have no `lines_json`; lines are gone | throws `SyntaxError: "undefined" is not valid JSON` |
| B | `order_10, order_9` | `null` | `lines_json` restored, same content | 1 line, as before |
| C | `order_9, order_10` | `[]` | `lines_json` restored, same content | 1 line, as before |

## Reference reading

| Criterion | A | B | C |
|---|---|---|---|
| Correctness (MIGRATE-04 ACs) | AC3 fails: `down` loses every line. AC6 partly: no test for up with data or for down. | All six ACs met, each with a test. | AC5 fails: legacy results change (`null` becomes `[]`, order changes). |
| Reversibility | Low. A rollback deletes data, and a second `up` crashes. | High. Up then down is tested to give the same rows. | High for the schema. The legacy behavior change is a separate revert. |
| Blast radius | Any rollback in production loses order lines. | Limited to `src/db` and the legacy row mapping. | Changes the `GET /api/orders` response order and empty value for every caller. This is LEGACY-06 work done without its characterization tests. |
| Test coverage | One new test (table exists). | Five new tests, including round trip and legacy results. | Two new tests. Nothing pins the legacy behavior it changed. |
| Readability | Short, but mutates rows in place and repeats the line mapping twice. | Clear. One pair of mapping helpers used in three places. | Clear code. The report describes a behavior change as a fix. |

Suggested base: B. Graft: from C, the idea of one read path for order lines, as a follow-up under LEGACY-06 with characterization tests first, not in this PR. From A, nothing.

## Points to land

- All three attempts were green. Green tests did not separate them; the rollback probe and the legacy output did.
- The cheapest attempt cost the most after review and rework.
- C's report calls a behavior change a fix. Judge the diff, not the report.
