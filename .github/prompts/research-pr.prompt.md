---
agent: agent
description: "Research a backlog ticket before planning"
---

# /research-pr <TICKET>

Arguments: ${input:args:<TICKET>}

Read `backlog/<TICKET>.md`, `AGENTS.md`, the related spec, and the current code. Write the problem, current behavior with file paths, two options and their trade-offs, risks, and open questions to the PR folder `RESEARCH.md`. Do not change app code. Mark facts that you did not verify.
