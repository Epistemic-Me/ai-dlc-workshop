# PR #004: auth-session-ttl - Review

Created: 2026-09-08
Branch: feature/pr-004-auth-session-ttl
Reviewer: fresh AI reviewer (second model family)
Verdict: Approve

## Checks run

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`: all pass. T3 fails on the parent commit: `getSession` returned the session after the clock moved.

## Per-AC evidence

| AC | Test | Result | Evidence |
|---|---|---|---|
| AC1 | T1 | PASS | `{ token: "token_1", userId: "user_1", expiresAt: now + SESSION_TTL_MS }`. |
| AC2 | T2 | PASS | `getSession("token_1")?.userId` is `user_1`. `getUser` returns `{ id, email, name }` only. |
| AC3 | T3 | PASS | `now += SESSION_TTL_MS`, then `getSession("token_1")` is `null`. This is the exact boundary. |
| AC4 | T4 | PASS | After `logout("token_1")`, `getSession` is `null`. |

## Issues

- Critical: none.
- Suggestion: T3 checks the `null` return but not that the provider dropped the token. Add an assertion on `provider.getSession` in a later change. Not blocking; the delete call is on the expiry branch in `getSession`.

## Risk

Medium. Every logged-in route depends on `getSession`. Rollback is a revert.
