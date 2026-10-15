# Phase 3 review

## Scope checked

- The Next.js and TypeScript store has auth, search, checkout, and billing domains. Each domain has a mock provider, service, types, and service tests. Pages call API routes.
- `npm install` completed. `npm run dev` started. The home page returned HTTP 200. A demo login returned HTTP 200.
- CI exists at `.github/workflows/ci.yml` and runs install, lint, typecheck, test, and build.
- The README has a logo header, the clone command, all five AI DLC steps, and Lab 2 ownership for one agent per domain.
- `docs/.context/` has the OST guide, example tree, and OST and spec registers. `AGENTS.md`, `CLAUDE.md`, the four tool prompts, and both generic Claude skills exist.
- The skills contain no client or company names. The reviewed text contains no aphorisms or time estimates. The source and built client files had no matches for the scanned API key and secret patterns.
- `.gitignore` excludes `node_modules`, `.next`, and `tsconfig.tsbuildinfo`; `git check-ignore` confirmed all three.

## Findings and fixes

1. The checkout API threw on a cart with a `null` item. The item parser now gives malformed items an invalid quantity. A live request with `{"items":[null]}` returned HTTP 400 with `invalid_quantity`.
2. The discount lookup accepted inherited object names such as `constructor`. That could make the quote total non-finite. The service now accepts only codes that the discount table owns. A new service test covers this case. A live request with `constructor` returned HTTP 400 with `invalid_discount`.

## Verification after fixes

| Check | Result |
|---|---|
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | Passed: 4 files, 35 tests |
| `npm run build` | Passed |

## Open finding

`npm audit` reported five high severity entries in one development-tool chain: `eslint-config-next` to `@next/eslint-plugin-next` to `fast-glob` to `micromatch` to `braces`. The installed `braces` version is 3.0.3, and the registry reported 3.0.3 as its latest version during this review. The audit's proposed fix downgrades `eslint-config-next` from 15 to 14, so this review did not apply it.
