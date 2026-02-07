--------------------------------------------------
E2E TESTING (MANDATORY FOR UI)
--------------------------------------------------
- Any new UI page or UI component that represents a user-facing flow
  MUST include E2E tests by default.

- E2E tests are REQUIRED for:
  - auth flows (signup, login, reset password)
  - forms that trigger side effects
  - critical user journeys (sync, publish, save, submit)
  - pages with conditional UI states (loading, error, success)

- E2E tests must be written even if unit tests already exist.

DEFAULT E2E STACK
- Use Playwright unless explicitly overridden.
- Tests live under:
  - e2e/ or tests/e2e/ (follow existing repo convention)

MINIMUM E2E COVERAGE
For each new UI page/component:
1) Happy path
   - user can complete the primary action successfully
2) Failure path
   - API error or validation error is surfaced correctly
3) UI state assertions
   - loading state
   - disabled buttons / prevention of double submit
   - success or confirmation message

E2E GUIDELINES
- Prefer API mocking or test env where possible.
- Do NOT rely on production services.
- Use stable selectors (data-testid).
- Avoid brittle selectors (CSS class names, deep DOM paths).

NON-NEGOTIABLE RULE
- If E2E tests are not included, Cursor must:
  1) explicitly state why E2E tests are omitted, AND
  2) provide a concrete E2E test plan for later addition.


--------------------------------------------------
TYPE SCRIPT STRICT TYPING RULES (MANDATORY)
--------------------------------------------------

1) Strict mode is required
- tsconfig must enable:
  - "strict": true
  - "noImplicitAny": true
  - "strictNullChecks": true

2) Never use `any`
- `any` is запрещено (not allowed).
- Use:
  - `unknown` + type guards
  - Zod inference (`z.infer<>`)
  - discriminated unions
  - generics

3) Minimize type assertions
- Avoid `as SomeType` unless absolutely required.
- If a cast is needed, prefer a runtime validator or type guard.

4) No `@ts-ignore`
- `@ts-ignore` is not allowed.
- If unavoidable, use `@ts-expect-error` with a comment explaining WHY and link to a ticket.

5) Null/undefined must be handled explicitly
- No unsafe optional chaining chains without fallback.
- For nullable fields:
  - validate at boundaries
  - narrow types before use

6) Use typed boundaries for external data
- Any data from:
  - HTTP requests
  - GraphQL inputs
  - database rows (if not strongly typed)
  - third-party APIs
must be parsed/validated into typed objects at the boundary (Zod preferred).

7) Prefer readonly and immutability
- Use `readonly` where helpful.
- Prefer `ReadonlyArray<T>` for arrays that should not be mutated.

8) Enums and unions
- Prefer string union types for domain states:
  - type UserStatus = "PENDING_EMAIL_VERIFY" | "ACTIVE" | "DISABLED"
- Use `as const` objects for constant maps.

9) Error types must be explicit
- Define a typed error model:
  - code: string union
  - message: string
  - details?: unknown
- Avoid throwing raw strings.

10) Function signatures must be explicit in core layers
- Domain/application functions must have explicit:
  - parameter types
  - return types
- Avoid implicit `Promise<any>`.

--------------------------------------------------
DELIVERABLE EXPECTATION
--------------------------------------------------
- If Cursor generates code that would introduce `any`, it must instead:
  - propose a typed alternative, or
  - use `unknown` + a validator/guard.