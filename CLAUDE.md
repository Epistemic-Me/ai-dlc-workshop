# CLAUDE.md

Read `AGENTS.md` first. It has the commands, conventions, domain ownership, and AI DLC steps for this repo. Everything there applies to Claude Code.

Claude Code specifics:

- Skills are in `.claude/skills/`. Use `/ost-bootstrap <area>` to propose an Opportunity Solution Tree and `/create-tickets <source>` to draft tickets from a transcript or doc.
- In a Lab 2 swarm, run each domain agent as a subagent or a separate session in its own git worktree. Give it only its domain's owned files.
- Before you report done, run `npm run lint && npm run typecheck && npm test && npm run build` and read the output.
