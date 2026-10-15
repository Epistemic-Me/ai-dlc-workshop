# docs/.context: Opportunity Solution Tree

Linear holds the work; this folder holds the codified learning.

Tickets say what to build and who is building it. This folder says why: which outcome the team is trying to move, which opportunities it found, which solutions it is testing, and what the tests showed. Agents read this folder before they write a spec or a ticket so that new work maps to a known outcome.

## Folder layout

```
docs/.context/
├── README.md                  this file: vocabulary, states, rules
├── ARCHITECTURE.md            layout, conventions, the orders data layer
├── ost/
│   └── example-ost.md         one tree per area
└── registers/
    ├── ost-register.md        every node in every tree, with state and evidence
    └── spec-register.md       every spec, with the node it serves and its state
```

Specs live in `docs/specs/`. Each spec names the tree node it serves.

## Node vocabulary

| Node | What it is | Example |
|---|---|---|
| **Outcome** | A measurable change the team owns. One per tree. | Raise search-to-checkout conversion |
| **Opportunity** | A customer need, pain, or desire, backed by evidence. | Shoppers cannot find products when they use a synonym |
| **Solution** | One way to address an opportunity. | Match on product tags as well as names |
| **Assumption** | The thing that must be true for a solution to work. Tagged by type. | Shoppers type tag words such as "coffee" |
| **Experiment** | The smallest test of one assumption, with a pass criterion set before it runs. | Log 200 queries; pass if 20% or more match a tag and not a name |

Assumption types: desirability, usability, feasibility, viability, ethical.

## States

| State | Meaning |
|---|---|
| `pending` | Proposed. No evidence yet. |
| `testing` | An experiment is running. |
| `validated` | The experiment met its pass criterion. Evidence is linked in the register. |
| `invalidated` | The experiment failed its pass criterion. Keep the node; it records what did not work. |
| `shipped` | A validated solution is delivered and in use. |

## Rules

1. Every opportunity cites evidence: a measurement, a recurring manual step, a failing metric, or a quote. No brainstormed opportunities.
2. Set the pass criterion before the experiment runs. Do not change it after.
3. A node changes state only when a register row cites the evidence. A closed ticket is not evidence.
4. A solution graduates to delivery only after its riskiest assumption is `validated`.
5. Do not invent IDs, metrics, or evidence. If a value is unknown, write `unknown` and name what would fill it.
6. A human picks which opportunity to pursue. Agents propose; they do not decide.

## IDs

Use short, stable IDs so registers and specs can link to nodes:

- Outcome: `O1`
- Opportunity: `O1.OP1`
- Solution: `O1.OP1.S1`
- Assumption: `O1.OP1.S1.A1`
- Experiment: `O1.OP1.S1.A1.E1`

## How the AI DLC uses this folder

| Step | Use |
|---|---|
| Spec | Pick a node from the tree. The spec names that node ID. Add a row to `spec-register.md`. |
| Plan | The plan cites the spec and the node. |
| Execute | No change here. |
| Review | Check the change against the spec's acceptance criteria. |
| Learn | Update node states in `ost-register.md` with linked evidence. Update the spec's state in `spec-register.md`. |
