# Repo review log

This file records reviews of the repo itself. Reviews of a single change go in `docs/reviews/<domain>-<short-name>.md`.

## First review

### Scope checked

- The Next.js and TypeScript store has auth, search, checkout, and billing domains. Each domain has a mock provider, service, types, and service tests. Pages call API routes.
- `npm install` completed. `npm run dev` started. The home page returned HTTP 200. A demo login returned HTTP 200.
- CI exists at `.github/workflows/ci.yml` and runs install, lint, typecheck, test, and build.
- The README has a logo header, the clone command, all five AI DLC steps, and Lab 2 ownership for one agent per domain.
- `docs/.context/` has the OST guide, example tree, and OST and spec registers. `AGENTS.md`, `CLAUDE.md`, the four tool prompts, and both generic Claude skills exist.
- The skills contain no client or company names. The reviewed text contains no aphorisms or time estimates. The source and built client files had no matches for the scanned API key and secret patterns.
- `.gitignore` excludes `node_modules`, `.next`, and `tsconfig.tsbuildinfo`; `git check-ignore` confirmed all three.

### Findings and fixes

1. The checkout API threw on a cart with a `null` item. The item parser now gives malformed items an invalid quantity. A live request with `{"items":[null]}` returned HTTP 400 with `invalid_quantity`.
2. The discount lookup accepted inherited object names such as `constructor`. That could make the quote total non-finite. The service now accepts only codes that the discount table owns. A new service test covers this case. A live request with `constructor` returned HTTP 400 with `invalid_discount`.

### Verification after fixes

| Check | Result |
|---|---|
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | Passed: 4 files, 35 tests |
| `npm run build` | Passed |

### Open finding

`npm audit` reported five high severity entries in one development-tool chain: `eslint-config-next` to `@next/eslint-plugin-next` to `fast-glob` to `micromatch` to `braces`. The installed `braces` version is 3.0.3, and the registry reported 3.0.3 as its latest version during this review. The audit's proposed fix downgrades `eslint-config-next` from 15 to 14, so this review did not apply it.

## Claude Code review

### Scope checked

- The whole repo: `src/`, `docs/`, `prompts/`, `.claude/skills/`, CI, and config, plus the two fixes in the first review.
- A second agent with no shared context reviewed the repo first. It ran lint, typecheck, test, and build, a fresh `npm ci` in a clean clone, and live requests against `next start`. Its findings are below. The quantity and discount findings were checked again here: the new route tests fail on the old route code (4 of 7) and pass on the new code.
- Both fixes in the first review hold. `{"items":[null]}` returns 400 `invalid_quantity`. The code `constructor` returns 400 `invalid_discount`.

### Findings

MUST is a bug, a security problem, or a doc that misleads a learner. SHOULD is real but smaller. COULD is optional.

| # | Level | Finding | Result |
|---|---|---|---|
| 1 | MUST | The DLC steps told a domain agent to write plans, reviews, and register rows, but the ownership table did not give it those files. In a swarm, four agents would edit the same register files. | Fixed. Domain agents own `docs/plans/<domain>-*.md` and `docs/reviews/<domain>-*.md`. In a swarm, agents report register rows and the lead adds them after the merge. `AGENTS.md`, `README.md`, and the four prompt files say so. |
| 2 | MUST | The plan says "no client or company names", but the README title, `package.json`, and the page metadata named the client and the company. | Fixed. The names are gone from the title, `package.json`, and the metadata. The README logo, the license holder, and the clone URL stay; they name the repo owner. `docs/PLAN.md` states this rule. |
| 3 | MUST | `POST /api/checkout` turned `true`, `"2"`, and `[3]` into quantities, so the spec rule "whole number from 1 to 99" failed through the API. | Fixed. The route accepts only JSON numbers. Route tests cover each case. |
| 4 | SHOULD | `/billing` showed "Loading…" forever when the first request failed. | Fixed. It shows the error. |
| 5 | SHOULD | The search and checkout pages could show results from an older request that arrived late. | Fixed. Each effect ignores a response after a newer request starts. |
| 6 | SHOULD | The null-item fix from the first review had no test. | Fixed. `src/app/api/checkout/route.test.ts` covers it. |
| 7 | SHOULD | A `discountCode` that is not text (for example `123`) was ignored, not rejected. | Fixed. It returns 400 `invalid_discount`. The checkout spec says so. |
| 8 | SHOULD | A cart had no line limit. 20,000 lines returned a 2 MB quote on a route with no login. | Fixed. More than 50 lines returns `too_many_lines`. A test and the spec cover it. Duplicate lines for one product are not merged: that is the seeded bug BUG-01, kept on purpose. |
| 9 | SHOULD | `docs/PLAN.md` named `vitest.config.ts` (the file is `.mts`), and its tree and route table missed the logout route, `src/lib/`, `errors.ts`, and `singleton.ts`. The auth spec did not cover the login response or logout. | Fixed in `docs/PLAN.md` and `docs/specs/auth.md`. |
| 10 | SHOULD | `docs/PLAN.md` had two lines about the authoring session (`stubs/`, "do not modify") that a learner cannot act on. | Fixed. |
| 11 | SHOULD | This file was titled with an internal phase label, and the README presented it as the example of a per-change review, which it is not. | Fixed. It is now the repo review log. The README points per-change reviews to `docs/reviews/`. |
| 12 | COULD | `readJson` accepts a JSON array as a body. | Not changed. |
| 13 | COULD | The browser `api` helper reads JSON before it checks the status, so a non-JSON error body gives a parse error. | Not changed. |
| 14 | COULD | The login page does not catch a failed logout, and keeps an expired token. | Not changed. |
| 15 | COULD | `tokenFromHeader` accepts only `Bearer` with a capital B. | Not changed. |
| 16 | COULD | `findUserByEmail` relies on the service to lowercase the email; the provider interface does not say so. | Not changed. |
| 17 | COULD | Expired sessions are deleted only when they are read, so repeated logins grow memory until restart. | Not changed. |
| 18 | COULD | Error messages repeat raw input (for example an unknown discount code). React escapes it today. | Not changed. |
| 19 | COULD | The checkout page uses `productId` as the row key, which repeats when a cart has duplicate lines. | Not changed. It goes away with the BUG-01 fix. |
| 20 | COULD | Pages import `@/domains/<name>/types` directly, while the rule says to import another domain through `index.ts`. | Not changed. |
| 21 | COULD | A new domain error code maps to 400 until the lead adds it to `src/lib/http.ts`. | Not changed. |
| 22 | COULD | CI runs twice for a PR from a branch in this repo (`push` and `pull_request`) and has no `permissions` block. | Not changed. |
| 23 | COULD | `.gitignore` and `.ignore` mention a local tool that no doc explains. | Not changed. |
| 24 | COULD | `docs/.context/README.md` names one tracker; the skill works with any tracker. | Not changed. |
| 25 | COULD | A `null` cart item returns `invalid_quantity`, which names the wrong problem. | Not changed. The first review chose this on purpose. |
| 26 | SHOULD | The first review says the discount lookup accepted `constructor` and could make the total non-finite. It could not: the service upper-cases the code first, and no inherited name is upper case. With `Object.hasOwn` replaced by a plain lookup, the test "rejects inherited object names as discount codes" still passes (13 of 13). | Record corrected here. The `Object.hasOwn` check stays as a guard in case the case rule changes. Found while writing the example PRs. |
| 27 | COULD | The auth test "returns null for an expired session" does not check that the session is deleted, which the spec requires. | Not changed. |

### Verification after fixes

| Check | Result |
|---|---|
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | Passed: 5 files, 43 tests |
| `npm run build` | Passed |
