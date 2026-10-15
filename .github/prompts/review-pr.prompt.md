---
agent: agent
description: "Review a PR against its test strategy with evidence, then run the docs gate"
---

# /review-pr <TICKET>

Arguments: ${input:args:<TICKET>}

Review one PR against its own test strategy, then run the docs gate. Do not merge and do not post comments.

Argument: the ticket ID, for example `BUG-01`.

## Who reviews

Review the PR in this session. Record the reviewer as a self-review in `REVIEW.md`. Run the checks and inspect their output before you give a verdict.

## Review steps

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
