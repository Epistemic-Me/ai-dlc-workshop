# PR #004: auth-session-ttl - Test Strategy

Created: 2026-09-08
Branch: feature/pr-004-auth-session-ttl

Tests use `new AuthService(new InMemoryAuthProvider(), { now: () => now, createToken })` with `now = 1_000_000`. No test reads the real clock.

## Acceptance criteria

| AC | Criterion |
|---|---|
| AC1 | `login` returns `{ token, userId, expiresAt }` with `expiresAt = now + SESSION_TTL_MS` (3,600,000 ms). |
| AC2 | Before `expiresAt`, `getSession(token)` returns the session and `getUser(token)` returns `{ id, email, name }` with no password. |
| AC3 | At `expiresAt` or later, `getSession(token)` returns `null`. |
| AC4 | `logout(token)` ends the session: `getSession(token)` returns `null`. |

## Edge cases

- Boundary: `now` equal to `expiresAt` counts as expired (`expiresAt <= now`). AC3 tests this exact value.
- Empty / unknown: a token that is not saved returns `null` (the logout test checks a deleted token).
- Invalid: empty password still returns `invalid_input`; wrong password still returns `invalid_credentials`.

## Test matrix

All tests are in `src/domains/auth/service.test.ts`.

| Test-ID | Test case | AC covered |
|---|---|---|
| T1 | returns a session for valid credentials | AC1 |
| T2 | returns the session and user for a valid token | AC2 |
| T3 | returns null for an expired session | AC3 |
| T4 | removes the session on logout | AC4, unknown-token edge |
| T5 | rejects an empty password | invalid edge |
| T6 | rejects a wrong password | invalid edge |
