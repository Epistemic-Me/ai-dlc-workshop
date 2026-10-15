---
agent: agent
description: "Start a PR for a backlog ticket: branch, planning docs, first research pass"
---

# /start-pr <TICKET> <short-name>

Arguments: ${input:args:<TICKET> <short-name>}

Start a PR for one backlog ticket: create the branch and the planning docs, then do the first research pass. Do not write code.

Arguments: the ticket ID and a short name, for example `BUG-01 merge-cart-lines`.

## Steps

1. Read `backlog/<TICKET>.md`, `AGENTS.md`, `docs/.context/ARCHITECTURE.md`, and `docs/SPEC-CHECKLIST.md`. If the ticket file does not exist, stop and say so.
2. Create the branch: `git checkout -b feature/pr-<TICKET>-<short-name>`.
3. Create `docs/prs/planning/<today's date as YYYY-MM-DD>-PR-<TICKET>-<short-name>/`.
4. Copy the five files from `docs/prs/_TEMPLATE/` into that folder. Replace `<TICKET>`, `<short-name>`, and the date.
5. Fill `RESEARCH.md`: the problem (with evidence from the ticket), the tree node it serves, what exists today (with file paths you read), two options with trade-offs, your recommendation, and the risks.
6. Commit only the docs folder: `git add docs/prs/planning/<folder> && git commit -m "docs: start <TICKET> <short-name>"`.
7. Report the branch, the folder, and the open questions. Then ask me what you are missing.

Do not fill `TEST-STRATEGY.md` or `IMPLEMENTATION-PLAN.md` until I answer. Do not edit any code.

## No commands set up?

Paste this instead:

```
Create branch feature/pr-<TICKET>-<short-name> and
docs/prs/planning/<today's date>-PR-<TICKET>-<short-name>/. Copy the five
templates from docs/prs/_TEMPLATE/. Read backlog/<TICKET>.md and write
RESEARCH.md: the problem, what exists today (with file references), two
options with trade-offs, your recommendation and the risks. Then ask me
what you're missing. Don't edit code.
```
