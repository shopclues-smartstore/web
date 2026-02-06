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
