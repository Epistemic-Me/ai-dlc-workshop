<p align="center"><img src="public/clarity-logo.png" width="360" alt="Clarity"></p>

# AI DLC Workshop: Clarinet x Clarity (Track A)

A small Next.js store you can change with AI coding agents. It has four domains (auth, search, checkout, billing), each with an in-memory mock provider, a service, types, and unit tests. It needs no `.env`, no network, and no secrets.

The workshop uses this repo to practice the AI development lifecycle (AI DLC): **Spec → Plan → Execute → Review → Learn**.

## Run it

```bash
git clone https://github.com/Epistemic-Me/ai-dlc-workshop.git && cd ai-dlc-workshop && npm install && npm run dev
```

Open http://localhost:3000.

Demo login: `ada@example.com` / `demo-password`. These are fake values in the mock provider, not real credentials. Data lives in memory and resets when the server restarts.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals` + `next/typescript`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests |

CI (`.github/workflows/ci.yml`) runs `npm ci`, lint, typecheck, test, and build on Node 22 for every push and pull request.

## The AI DLC in this repo

| Step | What you do | Where it lives in this repo |
|---|---|---|
| **Spec** | Write what the change must do and how you will know it works. Tie it to an outcome and opportunity in the Opportunity Solution Tree. | `docs/specs/<domain>.md`, `docs/.context/ost/`, `docs/.context/registers/spec-register.md` |
| **Plan** | Have the agent read the spec and the code, then write a plan: files to change, tests to add, risks. You approve the plan before any code. | `docs/PLAN.md` (example for this repo), `docs/plans/<domain>-<change>.md` for each change |
| **Execute** | The agent implements the plan inside its domain folder and writes tests first or alongside. | `src/domains/<domain>/`, `src/app/api/<domain>/`, the domain's page |
| **Review** | Run the checks. Have a second agent (or a person) review the diff against the spec. Fix what it finds. | `npm run lint && npm run typecheck && npm test && npm run build`, `docs/REVIEW.md` (example), `docs/reviews/<domain>-<change>.md` for each change |
| **Learn** | Record what you learned: which assumption held, which did not, what changes in the tree. | `docs/.context/registers/`, `docs/.context/ost/` |

Copy-paste prompts for each step are in `prompts/` for Claude Code, Codex, Cursor, and Copilot.

Two skills in `.claude/skills/` support the Spec step:

- `ost-bootstrap`: proposes an Opportunity Solution Tree for one area from your notes.
- `create-tickets`: turns a transcript or doc into deduplicated tickets mapped to the tree.

## Lab 2: agent swarm

In Lab 2 you run four agents at the same time, one per domain. Each agent owns its files and does not edit files that another agent owns. This lets them work in parallel without merge conflicts.

| Agent | Owns | Must not edit |
|---|---|---|
| auth | `src/domains/auth/`, `src/app/api/auth/`, `src/app/login/`, `docs/specs/auth.md` | other domains |
| search | `src/domains/search/`, `src/app/api/search/`, `src/app/page.tsx`, `docs/specs/search.md` | other domains |
| checkout | `src/domains/checkout/`, `src/app/api/checkout/`, `src/app/checkout/`, `docs/specs/checkout.md` | other domains |
| billing | `src/domains/billing/`, `src/app/api/billing/`, `src/app/billing/`, `docs/specs/billing.md` | other domains |

Shared files have no agent owner. Only the lead (you) changes them: `src/domains/errors.ts`, `src/domains/singleton.ts`, `src/lib/`, `src/app/layout.tsx`, `src/app/globals.css`, config files, and `package.json`. If an agent needs a shared change, it writes the request in its final report and stops.

Cross-domain calls go through a domain's `index.ts` only. For example, checkout reads prices through `@/domains/search`, not through search internals.

How to run it:

1. Give each agent its own git worktree or branch.
2. Paste the Lab 2 prompt from `prompts/<tool>.md` and set the domain name.
3. Each agent runs `npm test` and `npm run typecheck` before it reports done.
4. You merge the branches, then run the full check list once.

See `AGENTS.md` for the full rules agents follow.

## Folder tree

```
ai-dlc-workshop/
├── .claude/skills/          ost-bootstrap and create-tickets skills
├── .github/workflows/ci.yml lint, typecheck, test, build
├── docs/
│   ├── PLAN.md              example plan for this repo
│   ├── REVIEW.md            example review for this repo
│   ├── specs/               one example spec per domain
│   └── .context/            Opportunity Solution Tree and registers
├── prompts/                 copy-paste prompts per tool and DLC step
├── public/clarity-logo.png
├── src/
│   ├── app/
│   │   ├── page.tsx         / (product search)
│   │   ├── login/           /login
│   │   ├── checkout/        /checkout
│   │   ├── billing/         /billing
│   │   └── api/             auth, search, checkout, billing route handlers
│   ├── domains/
│   │   ├── auth/            types, provider, service, tests
│   │   ├── search/
│   │   ├── checkout/
│   │   └── billing/
│   └── lib/                 shared HTTP and client helpers
├── AGENTS.md                rules for coding agents
├── CLAUDE.md                points Claude Code to AGENTS.md
└── LICENSE                  MIT
```

## License

MIT. See `LICENSE`.
