# PR #004: auth-session-ttl - Research

Created: 2026-09-08
Branch: feature/pr-004-auth-session-ttl
Size: S

## Problem

A session token never expires. `AuthService.getSession` in `src/domains/auth/service.ts` returns any saved session with no time check. A token that leaks from a shared computer or a log works until the server restarts.

Evidence: the engineering lead's security pass on auth found that `Session` has no `expiresAt` field and no code path ends a session except `logout`. A token issued at login still returned the user from `GET /api/auth/session` after a full test run with the clock moved forward.

## Outcome

Serves: **none** on the tree. This is a security fix, not a step toward O1.

It touches **O1.OP3** (returning shoppers must log in again), which is `pending` with no evidence. A shorter session could make O1.OP3 worse. So this PR picks one hour as a start value and writes the open question into `docs/specs/auth.md`. The TTL does not change until O1.OP3 has evidence.

## Options

| Option | What | For | Against |
|---|---|---|---|
| A | Fixed TTL. `login` sets `expiresAt = now + SESSION_TTL_MS`. `getSession` checks it on read and deletes an expired session. Clock injected. | Small. Easy to test with a fake clock. | A shopper who is active for over an hour must log in again. |
| B | Sliding TTL. Each request moves `expiresAt` forward. | Active shoppers stay logged in. | Changes O1.OP3 behavior with no evidence. Every read becomes a write. |
| C | Fixed TTL plus a timer that sweeps expired sessions. | Memory stays small. | A timer in a server module is hard to test and runs in every test file. |

## Decision

Option A. It closes the gap and does not guess about O1.OP3. Deleting on read keeps memory in check without a timer.
