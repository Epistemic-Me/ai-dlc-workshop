# /execute-pr <TICKET>

Type the arguments after the command, for example `/execute-pr <TICKET>`.

Implement the plan for one ticket, one step at a time, and log each step.

Argument: the ticket ID, for example `BUG-01`.

## Before you start

1. Find the folder `docs/prs/planning/*-PR-<TICKET>-*` or `docs/prs/implementing/*-PR-<TICKET>-*`. If it is in `planning/`, move it: `git mv docs/prs/planning/<folder> docs/prs/implementing/<folder>`.
2. Check that `RESEARCH.md`, `TEST-STRATEGY.md`, and `IMPLEMENTATION-PLAN.md` are filled: no template placeholders, every AC in the test matrix, a scope, steps, and a rollback. If one is not ready, stop and tell me what is missing. The thinking happens before this command.
3. Check that you are on the branch `feature/pr-<TICKET>-<short-name>`.

## Steps

1. Read only the files the plan names. Ask before you read or change others.
2. Do one plan step at a time. Write or update its tests first or alongside.
3. After each step, run `npm test` and add a row to `IMPLEMENTATION.md`: what changed and what the tests showed.
4. If the plan turns out to be wrong, stop and ask me. Record the change in the "Changes from the plan" table.
5. At the end, run `npm run lint && npm run typecheck && npm test && npm run build` and paste the result in `IMPLEMENTATION.md`.
6. Commit on the feature branch. Do not push or open a PR until I say so.

Report: the steps done, the check results, and anything you did not do.

## No commands set up?

Paste this instead:

```
Implement IMPLEMENTATION-PLAN.md one step at a time. After each step, run the
tests and add what changed and what the tests showed to IMPLEMENTATION.md.
Stop and ask me if the plan turns out to be wrong.
```
