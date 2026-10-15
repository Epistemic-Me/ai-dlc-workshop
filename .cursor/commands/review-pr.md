# /review-pr <TICKET>

Type the arguments after the command, for example `/review-pr <TICKET>`.

Review one PR against its own test strategy, then run the docs gate. Do not merge and do not post comments.

Argument: the ticket ID, for example `BUG-01`.

## Who reviews

The reviewer must be fresh: no history from the session that wrote the code. It must also be from a second model family, different from the one that wrote the code. This is required in this course.

- If this tool can run a model from a different family, start a fresh session or subagent on that model.
- If it cannot, run this command in a second tool that can (for example Codex, Cursor, or Copilot with a different model).
- If neither is possible, use a fresh subagent and write "same model family" in the Reviewer line of `REVIEW.md`.

## Steps for the reviewer

1. Find `docs/prs/implementing/*-PR-<TICKET>-*` (or `planning/`). Read `RESEARCH.md`, `TEST-STRATEGY.md`, `IMPLEMENTATION-PLAN.md`, and `IMPLEMENTATION.md`.
2. Read `AGENTS.md` and `docs/.context/ARCHITECTURE.md`.
3. Get the diff: `git diff main...HEAD`.
4. Run `npm run lint && npm run typecheck && npm test && npm run build`.
5. For each acceptance criterion: is it tested, does it pass, and what is the evidence (a test output line, a response body, or stored rows)? Do not accept the description in `IMPLEMENTATION.md` as evidence.
6. Look for: changes the plan did not ask for, files outside the owner's paths, missing edge cases, and the blast radius if the change is wrong.
7. Write or append `REVIEW.md` from the template: verdict, the AC table, issues, and risk. If a review exists, add `## Review v<N+1>`; the last verdict counts.

## Then

1. Run the docs gate: `node scripts/pr-docs-check.mjs --ticket <TICKET>`. If the script does not exist, check by hand that `RESEARCH.md`, `TEST-STRATEGY.md`, and `IMPLEMENTATION-PLAN.md` exist and are filled.
2. Report the verdict, the gate result, and the issues to fix.
3. Stop. A person decides what goes on the PR and merges it. After the merge, move the folder to `docs/prs/_archive/`.

## No commands set up?

Paste this instead:

```
Review the diff against TEST-STRATEGY.md. For each acceptance criterion:
tested or not, passing or not, with evidence. Write REVIEW.md with a verdict,
the AC table and the risks. Don't post comments; I'll decide what goes on the PR.
```
