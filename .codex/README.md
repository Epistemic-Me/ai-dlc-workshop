# Codex prompts

The PR commands for Codex: `start-pr.md`, `execute-pr.md`, `review-pr.md`, `research-pr.md`, `plan-pr.md`, and `handoff-pr.md`. They are the same as `.claude/commands/`.

Codex reads custom prompts from `~/.codex/prompts/`, not from the repo. To use them as commands, copy them:

```bash
mkdir -p ~/.codex/prompts && cp .codex/prompts/*.md ~/.codex/prompts/
```

Then run `/prompts:start-pr BUG-01 <short-name>` in Codex. Or open a file and paste its text, with the ticket ID filled in. Codex reads `AGENTS.md` by itself.
