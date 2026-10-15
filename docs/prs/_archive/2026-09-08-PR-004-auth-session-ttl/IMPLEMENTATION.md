# PR #004: auth-session-ttl - Implementation

Created: 2026-09-08
Branch: feature/pr-004-auth-session-ttl
Status: Merged 2026-09-09

## Summary

Sessions expire one hour after login. `getSession` returns `null` for an expired token and deletes it from the provider.

## Key changes

- `SESSION_TTL_MS = 60 * 60 * 1000` in `src/domains/auth/service.ts`.
- `AuthService` takes `{ now?, createToken? }`. Defaults are `Date.now` and `crypto.randomUUID`.
- `getSession`: if `session.expiresAt <= this.now()`, call `provider.deleteSession(token)` and return `null`.
- `docs/specs/auth.md`: AC5 and the open question "Do not change the one-hour TTL until the tree has evidence."

## Deviations from plan

None.

## Learnings

- Injecting `createToken` as well as `now` makes token values fixed (`token_1`), so T1 can use `toEqual` on the whole session.

## Follow-up

- O1.OP3 needs data on how often a session expires between search and checkout.
