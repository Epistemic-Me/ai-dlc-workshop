# Arena: MIGRATE-04

Three recorded attempts at `backlog/MIGRATE-04.md`, for the Lab 2 arena. Each attempt ran from the same brief, in its own worktree, from commit `42d2b3b`.

Illustrative sample data: the diffs and test results are real, and each `diff.patch` applies to `42d2b3b` with `git apply`. The cost numbers are sample values, not measurements.

## The brief

```
Design and implement MIGRATE-04 as described in backlog/MIGRATE-04.md.
Include the migration, the rollback and the tests. Don't touch other tickets.
```

## The attempts

| Attempt | Files changed | Tests | Tokens in / out | Agent | Review | Rework |
|---|---|---|---|---|---|---|
| [A](attempt-a/SUMMARY.md) | 7 (+87, -17) | 51 passed, 1 skipped | 96,400 / 6,100 | 5 min | 22 min | 40 min |
| [B](attempt-b/SUMMARY.md) | 8 (+196, -17) | 55 passed, 1 skipped | 228,000 / 14,800 | 13 min | 11 min | 0 min |
| [C](attempt-c/SUMMARY.md) | 9 (+183, -38) | 53 passed, 1 skipped | 171,500 / 12,300 | 10 min | 28 min | 25 min |

Each folder has `SUMMARY.md` (the agent's final report), `diff.patch`, and `cost.json`.

## How to judge

1. Write the rubric first. Score 1 to 5 on each: correctness against the ticket's acceptance criteria, reversibility, blast radius, test coverage, readability.
2. Before the judge runs, the room votes on which attempt it would merge.
3. Judge with a second approved model family. Quote evidence from the diffs. Do not trust the agent's own report.
4. Pick a base and name what to graft from the other two.

To run an attempt yourself:

```bash
git worktree add ../arena-a 42d2b3b
cd ../arena-a && npm install
git apply ../ai-dlc-workshop/arena/MIGRATE-04/attempt-a/diff.patch
npm test
```
