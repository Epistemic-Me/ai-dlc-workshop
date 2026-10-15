# FLAKY-05: Order list test fails about half the time

- Kind: flaky test
- Domain: db
- Size: 1

## What happened

The test "lists the most recent order first" in `src/db/order-repository.test.ts` passes on some runs and fails on others with no code change. CI skips it. It runs only when `RUN_FLAKY=1` is set:

```bash
RUN_FLAKY=1 npx vitest run src/db/order-repository.test.ts
```

Run it a few times to see both results.

## Acceptance criteria

1. Find the cause and write it in the PR's `RESEARCH.md`.
2. The test passes 20 runs in a row with `RUN_FLAKY=1`.
3. The fix follows the repo rule for time in tests.
4. The test runs in CI again: remove the skip.

## Out of scope

- Changes to other tests.
