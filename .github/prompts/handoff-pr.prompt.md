---
agent: agent
description: "Write a short handoff for active PR work"
---

# /handoff-pr <TICKET>

Arguments: ${input:args:<TICKET>}

Read the ticket, the five PR docs, `git status`, and the current branch. Write `HANDOFF.md` in that PR docs folder with the goal, exact branch and commit, work done, check results you observed, open issues, and the next action. Do not invent test results or commit the handoff without an explicit request.
