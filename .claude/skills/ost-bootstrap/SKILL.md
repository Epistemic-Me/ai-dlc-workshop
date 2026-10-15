---
name: ost-bootstrap
description: Propose a scoped Opportunity Solution Tree (OST) for one product area from discovery notes and recent tickets. Proposes only; a human picks the opportunity and approves the change before any file is written.
---

# /ost-bootstrap <area>

Build a first Opportunity Solution Tree for one area of the product. The tree goes in `docs/.context/ost/<area>.md`.

## Inputs

Ask the user to paste or point to:

- Discovery notes they are allowed to share: interviews, product notes, decisions.
- 3 to 5 recent tickets that represent the area.
- The team's scope, the outcome it owns, and how that outcome is measured.
- Who owns the tree and who reviews it.

If an input is missing, say which one and continue with what you have. Record the gap in step 4.

## Steps

1. Read `docs/.context/README.md` for node vocabulary, states, ID format, and rules. Read any existing tree for this area in `docs/.context/ost/` and its rows in `docs/.context/registers/ost-register.md`.
2. Propose one outcome and up to three opportunities. Every opportunity cites evidence from the inputs: a measurement, a recurring manual step, a failing metric, or a quote. Do not propose an opportunity without evidence.
3. Under the opportunity the human picks, propose candidate solutions. For each solution, name its riskiest assumption, tag it (desirability, usability, feasibility, viability, or ethical), and propose the smallest experiment with a pass criterion set now.
4. List the gaps you could not fill and the evidence that would fill each one.
5. Stop. Ask the human to confirm the area and pick one opportunity. Do not write files before they answer.
6. After confirmation:
   - Write `docs/.context/ost/<area>.md` using the structure in `docs/.context/ost/example-ost.md`.
   - Add one row per node to `docs/.context/registers/ost-register.md`. All new nodes start as `pending`.
   - Open a pull request (or hand the diff to the user) for review. A human merges it.

## Rules

- Never invent IDs, metrics, evidence, or validated results. Write `unknown` and name what would fill it.
- A Done ticket is not a validated assumption. A node changes state only when a register row cites evidence.
- Use plain language. Quote sources with a pointer (document, speaker, date). Do not copy sensitive text.
- Keep the tree to one outcome. If the inputs point at a second outcome, list it as a gap.

## Output format (before confirmation)

```
Area: <area>
Outcome (proposed): <outcome> | Metric: <metric> | Baseline: <value or unknown>

Opportunities:
1. <title> | Evidence: <pointer>
2. ...

Gaps:
- <gap> | Needed: <evidence>

Question: Which opportunity should the tree pursue first?
```
