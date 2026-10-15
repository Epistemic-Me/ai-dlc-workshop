# <TICKET>: <short-name> - Test strategy

Write this after RESEARCH.md and before IMPLEMENTATION-PLAN.md. It says what "done" means before any code.

## Acceptance criteria

| AC | Criterion (pass or fail, checkable by someone else) | Priority |
|---|---|---|
| AC1 | | P0 |
| AC2 | | P0 |

## Edge cases

- Empty:
- Invalid:
- Error path:

## Test matrix

| Test | File | Case | Covers | Passes when |
|---|---|---|---|---|
| T1 | | | AC1 | |
| T2 | | | AC2 | |

## Definition of done

- [ ] Every AC has at least one test.
- [ ] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` pass.
- [ ] REVIEW.md shows evidence for every AC.
