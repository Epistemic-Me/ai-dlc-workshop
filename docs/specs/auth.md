# Spec: auth

- Domain: auth
- Serves: O1.OP3 (repeat login before checkout), `pending`
- State: `draft`
- Owner: auth agent

## Behavior

Shoppers log in with email and password and get a session token. API routes read the token from `Authorization: Bearer <token>`.

## Acceptance criteria

1. `login(email, password)` returns a session `{ token, userId, expiresAt }` for valid credentials.
2. Email match is case-insensitive and ignores leading and trailing spaces.
3. Empty email or password returns `invalid_input`.
4. Wrong password or unknown email returns `invalid_credentials`. The message does not say which one was wrong.
5. A session expires one hour after login. `getSession` returns `null` for an expired token and deletes it.
6. `logout(token)` deletes the session.
7. `GET /api/auth/session` returns `{ user }` with no password field, or `{ user: null }`.
8. `POST /api/auth/login` with `{ email, password }` returns `{ session }`, or an error with status 400 (`invalid_input`) or 401 (`invalid_credentials`).
9. `POST /api/auth/logout` deletes the session in `Authorization: Bearer <token>` and returns `{ ok: true }`, with or without a valid token.

## Out of scope

- Sign-up, password reset, real password hashing. The mock provider stores demo passwords in plain text on purpose.

## Open question

- Session length for O1.OP3 is not known. Do not change the one-hour TTL until the tree has evidence.

## Tests

`src/domains/auth/service.test.ts`
