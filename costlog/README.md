# Cost log

Log what each agent task costs, so the team can compare approaches on the same work. The number to track is cost per merged PR that stays merged (not reverted or reworked within 14 days).

## What to log for each task

| Field | What it is |
|---|---|
| `date` | The day of the run |
| `ticket` | The backlog ID, for example `BUG-01` |
| `run` | A short label: `before`, `after`, `swarm-auth`, `arena-a` |
| `tool` | The agent tool and model |
| `input_tokens`, `output_tokens`, `cached_tokens` | From your tool's usage report. Leave empty if the tool does not report them. |
| `requests` | For seat-based tools that count requests, not tokens |
| `agent_minutes` | Wall-clock time the agent ran |
| `human_minutes` | Your time during the run: prompting, answering, unblocking |
| `review_minutes` | Time a person spent reviewing the result |
| `rework_minutes` | Time spent fixing it after review, including the re-run |
| `rereview_minutes` | Time spent reviewing it again |
| `outcome` | `merged`, `reworked`, `reverted`, or `abandoned` |
| `cost_usd` | Only if your tool or provider reports dollars. Do not estimate. |

Add one row per task to `costlog.csv`. Copy `costlog.template.csv` to start.

## Where the numbers come from

- Claude Code: `/cost` in the session, or the usage page.
- Codex: `/status` in the session.
- Cursor and Copilot: the usage page. Log requests and wall-clock time.

## Recorded runs

`recorded-before-runs/` holds runs recorded for the labs, with their cost already logged. They are illustrative sample data, not measurements.

- `recorded-before-runs/BUG-01/`: the BUG-01 "before" run (the Lab 2 baseline), and the BUG-01 plan for pairs that planned a different ticket in Lab 1.
- `../arena/MIGRATE-04/`: three recorded MIGRATE-04 attempts for the Lab 2 arena.
