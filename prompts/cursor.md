# Prompts for Cursor

Copy-paste prompts for each AI DLC step. Replace text in `<angle brackets>`.

## Setup

- Open the repo in Cursor and use Agent mode in the chat panel. Cursor reads `AGENTS.md` as a project rule.
- Reference files with `@`, for example `@docs/specs/search.md`.
- The skills in `.claude/skills/` are plain Markdown. Attach the `SKILL.md` file with `@` and ask the agent to follow it.
- Use Ask mode for the Plan step so the agent cannot edit files until you approve.

## PR commands

The Plan, Execute, and Review steps below are also packaged as three commands that take a ticket ID from `backlog/`. Run `/start-pr`, `/execute-pr`, and `/review-pr` in Agent mode. The commands are in `.cursor/commands/`. Each command file has a plain-language fallback.

## 0. Orient

```
Read @AGENTS.md and @README.md. Then tell me:
- the four domains and the files each one owns
- the commands to lint, typecheck, test, and build
- which files are shared and owned by the lead
Do not change any files.
```

## 1. Spec

```
I want to change the <domain> domain: <one sentence describing the change>.

Read @docs/.context/README.md, @docs/.context/ost/example-ost.md, and @docs/specs/<domain>.md.

Update @docs/specs/<domain>.md with:
- the tree node this change serves (use an existing ID; if none fits, say so and stop)
- new or changed acceptance criteria, each one testable
- what is out of scope

Add or update the row in @docs/.context/registers/spec-register.md with state `draft`. In a Lab 2 swarm, put the row in your final report instead; the lead adds it.
Do not change any code.
```

## 2. Plan

```
Read @AGENTS.md and @docs/specs/<domain>.md. Read the code in src/domains/<domain>/ and src/app/api/<domain>/.

Write the plan to IMPLEMENTATION-PLAN.md in the PR docs folder (docs/prs/planning/<date>-PR-<TICKET>-<short-name>/, created by /start-pr) with:
- each acceptance criterion and the file and function that will satisfy it
- the tests you will add or change, by name
- any file you need that you do not own (stop and ask if there is one)
- risks and open questions

Do not change any code. Wait for my approval.
```

## 3. Execute

```
Implement the approved IMPLEMENTATION-PLAN.md in the PR docs folder. After each step, add what changed and what the tests showed to IMPLEMENTATION.md.

Rules:
- Edit only files the <domain> agent owns (see @AGENTS.md).
- Write or update tests in src/domains/<domain>/service.test.ts first or alongside the code.
- Keep business rules in service.ts. Route handlers only parse input and map errors.
- Money in integer cents. No new dependencies.

When done, run npm test and npm run typecheck and show me the output.
```

## 4. Review

```
Review the current diff against @docs/specs/<domain>.md.

1. Run: npm run lint && npm run typecheck && npm test && npm run build. Show the output.
2. For each acceptance criterion, say pass or fail and point to the test that proves it.
3. List bugs, missing tests, and edits outside the <domain> agent's owned files.
4. Fix what you can inside the owned files. List the rest.

Write the findings and fixes to REVIEW.md in the PR docs folder.
```

Then open a new chat (no shared history) and ask it to review the diff against the spec.

## 5. Learn

```
Read the PR's REVIEW.md and @docs/specs/<domain>.md.

Update:
- @docs/.context/registers/spec-register.md: set the spec state (shipped, testing, or retired) and add a one-line note.
- @docs/.context/registers/ost-register.md: change a node state only if there is evidence (a test result, a measurement). Link the evidence. A merged change by itself is not evidence.

In a Lab 2 swarm, do not edit the registers. Put the rows in your final report; the lead adds them after the merge.

Then list what the next spec should address, as a short list. Do not change code.
```

## Lab 2: swarm, one agent per domain

Open four Cursor windows, one per worktree, or start four background agents, one per domain:

```bash
git worktree add ../wt-auth -b lab2/auth
git worktree add ../wt-search -b lab2/search
git worktree add ../wt-checkout -b lab2/checkout
git worktree add ../wt-billing -b lab2/billing
```

Paste the prompt below in each, with the domain filled in.

Prompt for each domain agent:

```
You are the <domain> agent. Read @AGENTS.md.

You own only these paths:
- src/domains/<domain>/
- src/app/api/<domain>/
- the <domain> page (see the ownership table in AGENTS.md)
- docs/specs/<domain>.md
- the PR docs folders you start in docs/prs/

Do not edit any other file. If you need a change in a file you do not own, stop and write the request in your final report: file, change, reason.

Task: <the change for this domain>

Follow the AI DLC steps: update the spec, write a plan, implement, then review.
Before you report done, run npm run lint && npm run typecheck && npm test && npm run build and include the output.

Final report:
- what changed, by file
- test results
- any change to the public exports in src/domains/<domain>/index.ts
- requests for files you do not own
- register rows for the lead to add (spec state, node state, evidence)
```

Lead prompt after all four agents report:

```
Merge the four lab2/* branches into one branch. Then run npm run lint && npm run typecheck && npm test && npm run build and show the output.
List every file changed outside its owner's paths. List every cross-domain request from the four reports.
Then add the register rows from the four reports to docs/.context/registers/.
```
