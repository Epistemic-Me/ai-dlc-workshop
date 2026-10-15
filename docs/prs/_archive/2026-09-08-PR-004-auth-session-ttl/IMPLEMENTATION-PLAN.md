# PR #004: auth-session-ttl - Implementation Plan

Created: 2026-09-08
Branch: feature/pr-004-auth-session-ttl

## Approach

Option A from RESEARCH.md.

## Scope

- In scope: `expiresAt` on `Session`, the check in `getSession`, an injected clock, the open question in `docs/specs/auth.md`.
- Out of scope: sliding sessions, refresh tokens, "remember me", a sweep timer, any change to the login page.

## Files

| File | Action | Purpose |
|---|---|---|
| `src/domains/auth/types.ts` | Modify | Add `expiresAt: number` to `Session`. |
| `src/domains/auth/service.ts` | Modify | Add `SESSION_TTL_MS = 60 * 60 * 1000` and the `now` option. Check and delete in `getSession`. |
| `src/domains/auth/index.ts` | Modify | Export `SESSION_TTL_MS`. |
| `src/domains/auth/service.test.ts` | Modify | Fake clock in `beforeEach`. T1 and T3 new. |
| `docs/specs/auth.md` | Modify | AC5 and the open question on session length. |

## Risk and rollback

- Blast radius: every route that calls `authService.getSession`: `/api/auth/session`, `/api/checkout` with `place: true`, `/api/billing`, `/api/orders`. If the check is wrong, logged-in users look logged out and get 401 `unauthenticated`.
- Signal: a rise in 401 responses right after deploy.
- Rollback: revert the PR. Sessions are in memory; a restart clears them, so users log in once more.
