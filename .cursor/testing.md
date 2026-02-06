SMARTSTORE – TESTING CONTEXT (UNIT / INTEGRATION / E2E)

This file defines how tests must be written across SmartStore.
Cursor MUST follow these conventions when generating any tests.

--------------------------------------------------
GOALS
--------------------------------------------------
- Confidence in critical flows (auth, sync, outbox, idempotency).
- Fast feedback loop for developers.
- Deterministic tests (no flaky timing, no reliance on external services).

--------------------------------------------------
TEST LAYERS
--------------------------------------------------
1) Unit Tests (fastest)
- Target: domain logic, pure utilities, Zod schemas, reducers.
- No DB, no network.
- Run on every commit.

2) Integration Tests (selective)
- Target: repositories, outbox processor with DB, API handlers with test DB.
- Use ephemeral infra (local docker) or test containers.
- Avoid heavy end-to-end stacks unless needed.

3) E2E Tests (mandatory for new UI)
- Target: user journeys across UI + API boundary.
- Default tool: Playwright.
- Must include happy path + failure path + key UI states.

--------------------------------------------------
DEFAULT TOOLING
--------------------------------------------------
Backend:
- Test runner: Vitest (preferred) or Jest if repo already uses it.
- HTTP testing: supertest (if Express/Fastify compatible) or fetch-based tests.
- DB testing: use a dedicated test database schema or separate test DB.

Frontend:
- Unit tests: Vitest + Testing Library (if present).
- E2E: Playwright (default).

Do NOT introduce a new testing framework if one already exists in the repo.
Prefer existing conventions.

--------------------------------------------------
TEST FILE LOCATIONS & NAMING
--------------------------------------------------
- Unit/Integration:
  - colocated: *.test.ts / *.spec.ts near code
  - OR central: src/**/__tests__/*
  - Follow the repo’s existing pattern; do not mix randomly.

- E2E:
  - tests/e2e/* OR e2e/*
  - Prefer tests/e2e if no convention exists.

--------------------------------------------------
STABLE SELECTORS (MANDATORY FOR E2E)
--------------------------------------------------
- UI elements that are used in E2E tests MUST have stable selectors:
  - data-testid="..."
- Avoid selectors based on CSS classes or deep DOM structure.

Examples:
- data-testid="signup-email"
- data-testid="signup-password"
- data-testid="signup-submit"
- data-testid="toast-success"
- data-testid="error-correlation-id"

--------------------------------------------------
E2E TEST REQUIREMENTS (MANDATORY)
--------------------------------------------------
When Cursor creates a new user-facing UI page/component that represents a flow,
it MUST also create Playwright E2E tests.

Minimum per new page/flow:
1) Happy path
- user completes primary action successfully

2) Failure path
- server returns an error OR validation fails
- UI shows correct error state

3) State assertions
- loading state visible (or button disabled)
- success state / confirmation message
- double-submit prevention (button disabled while pending)

E2E tests must:
- be deterministic (no arbitrary sleep)
- use Playwright expect() + proper waiting semantics
- isolate state per test (fresh user/test data where possible)

--------------------------------------------------
NETWORK CONTROL FOR E2E
--------------------------------------------------
Preferred approach (in order):
A) Run against local dev server + local API with test DB
B) Use Playwright request interception/mocking for non-critical endpoints
C) Use seeded test environment

Do NOT hit production services.
Do NOT require real email delivery in E2E; instead:
- verify UI says “Check your email”
- optionally assert that an outbox event was created via a test helper API (if available)

--------------------------------------------------
TEST DATA STRATEGY
--------------------------------------------------
- Provide deterministic test data.
- Prefer factories for test objects:
  - createUserFactory
  - createSkuFactory
- Avoid hard-coded IDs unless necessary.
- Reset state between tests:
  - truncate tables (test DB)
  - use transactions
  - or unique identifiers per test

--------------------------------------------------
AUTH TESTING STRATEGY
--------------------------------------------------
For auth flows:
- Unit tests:
  - Zod validation
  - token hashing/expiry rules (domain/application)

- Integration tests:
  - signup -> creates pending user + email verification token + outbox event
  - verify-email -> activates user, token single-use
  - forgot-password -> non-enumerating response + outbox event when user exists
  - reset-password -> password changed + emits confirmation email event

- E2E tests:
  - signup page happy path: form submit -> “check your email” success state
  - signup page failure path: invalid email/password -> shows validation errors
  - optional: server error -> shows friendly error + correlationId

--------------------------------------------------
OUTBOX & IDEMPOTENCY TESTING (MANDATORY)
--------------------------------------------------
- Outbox:
  - assert event exists in DB after state change
  - assert retries/backoff/dead-letter behavior via worker tests

- Idempotency:
  - repeated request with same idempotency key does not duplicate side effects
  - verify only one outbox event or one external call is produced

--------------------------------------------------
WHAT TO AVOID
--------------------------------------------------
- Flaky tests relying on timeouts/sleeps.
- Snapshot-only tests for logic.
- Tests that assert implementation details instead of behavior.
- Mocking everything (integration tests should test real boundaries).

--------------------------------------------------
DELIVERABLE EXPECTATION
--------------------------------------------------
Whenever Cursor generates a feature:
- include the tests
- explain briefly what they cover
- ensure they run locally with a single command:
  - pnpm test / npm test / yarn test (use repo convention)
  - pnpm e2e / npm run e2e (for Playwright)
