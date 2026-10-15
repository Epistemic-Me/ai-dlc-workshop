# Backlog

Seeded tickets for the labs. Each file is one ticket. The problems are real: the code in this repo has them today.

| Ticket | Kind | Domain | Used in |
|---|---|---|---|
| [BUG-01](BUG-01.md) | Bug | checkout | Session 1 live prompt, Lab 1, Lab 2 before and after runs |
| [FEAT-02](FEAT-02.md) | Feature | checkout | Worked example (ticket to merged PR) |
| [REFACTOR-03](REFACTOR-03.md) | Refactor | auth, billing, checkout | Lab 1 (legacy-code pairs) |
| [MIGRATE-04](MIGRATE-04.md) | Schema migration | db | Lab 1 (legacy-code pairs), Lab 2 arena |
| [FLAKY-05](FLAKY-05.md) | Flaky test | db | Practice ticket |
| [LEGACY-06](LEGACY-06.md) | Legacy data-access migration | legacy, db | Session 3 cold run, Lab 3 |

To create these as GitHub issues on your fork, run `scripts/seed-issues.sh` (it needs `gh` and a login).
