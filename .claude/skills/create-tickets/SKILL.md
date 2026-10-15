---
name: create-tickets
description: Turn a transcript, document, or description into deduplicated tickets mapped to the team's Opportunity Solution Tree. Drafts first and creates nothing until the user confirms. Supports --dry-run. Works with any tracker (Linear first; Jira or GitHub Issues if that is what the team uses).
---

# /create-tickets <source> [--team <team>] [--project <project>] [--dry-run]

## Steps

1. **Extract.** From the source, pull out explicit bugs, feature requests, decisions, and committed actions. Skip chatter, vague wishes, and work the speakers deferred. For each item, keep a source pointer (document or meeting, speaker, timestamp). Do not copy sensitive text.

2. **Check three sources** before you propose any ticket. Record what you checked and what you found:
   - The tree: `docs/.context/README.md`, the area's file in `docs/.context/ost/`, and `docs/.context/registers/ost-register.md`.
   - The specs: `docs/specs/` and `docs/.context/registers/spec-register.md`.
   - Open tickets in the tracker, searched by the candidate's main nouns, its outcome, and its solution.

   If a source is missing or you cannot reach the tracker, say so. Never imply a check passed when it did not run.

3. **Pick one disposition** for each candidate:
   - `new`: draft a new ticket.
   - `update`: add to an existing ticket (give its ID).
   - `covered`: an existing ticket already covers it (give its ID).
   - `scope flag`: it does not map to the tree. Do not draft a ticket; list it for the human.

   Prefer `update` over a near-duplicate `new`.

4. **Map to the tree.** Each ticket maps to one solution under one opportunity and is exactly one of:
   - **Assumption test**: the assumption type, the smallest test, and the pass criterion set before the test.
   - **Solution delivery**: the capability shipped, and the evidence that graduated the solution.

5. **Write the ticket** in this order:

   ```
   ## OST context
   Outcome: <ID> <title>
   Opportunity: <ID> <title>
   Solution: <ID> <title>
   Assumption test: <ID> <type>, <test>, pass if <criterion>
     OR
   Delivers: <capability>, graduated by <evidence>

   ## What
   ## Why
   ## Acceptance criteria
   ## Scope (in / out)
   ## Technical context (files, domains, specs)
   ## Size
   ```

   Size uses points 1, 2, 3, 5, 8, 13 to show complexity. Default is 3. A 13 means split the ticket.

6. **Labels.** One type label (bug, feature, chore, experiment). One bucket label (delivery, graduation, discovery). Domain labels that already exist in the tracker only. Do not create labels.

7. **Present and wait.** Show the full draft set: each candidate, its disposition, its tree mapping, and the evidence from step 2. Wait for the user to confirm. Create or update tickets only after they confirm. With `--dry-run`, draft only and never write to the tracker.

## Tracker notes

- Linear: use the Linear MCP server or API. Search open issues in the team before drafting.
- Jira: use JQL text search on summary and description. Map "Size" to story points.
- GitHub Issues: use `gh issue list --search` and `gh issue create`. Put labels in `--label`.

## Rules

- Never invent ticket IDs, tree IDs, metrics, or evidence.
- One ticket per solution or assumption. Split anything that spans two.
- Keep source quotes short and attributed. Leave out personal or customer data.
