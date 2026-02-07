SMARTSTORE FRONTEND – RULES / STANDARDS

STACK ASSUMPTIONS
- TypeScript everywhere (strict).
- React + Next.js (App Router if applicable).
- Styling:
  - Prefer Tailwind for new work OR keep consistent with existing stack if already using react-jss.
  - If a page/component already uses react-jss, continue using react-jss (do not rewrite randomly).
  - Font Awesome may be used for icons if already present; otherwise use lucide-react for consistency.
- Data fetching:
  - Prefer React Query OR Apollo (if GraphQL is used in the app). Keep consistent with existing.
  - Do not mix patterns randomly in the same feature area.

ARCHITECTURE RULES
- Frontend should be modular by feature:
  - features/catalog/*
  - features/mapping/*
  - features/inventory/*
  - features/pricing/*
  - features/sync/*
- Each feature owns:
  - components/
  - hooks/
  - api/
  - types/
  - state/ (if needed)
- Shared components go in:
  - components/ui/*
- Shared utilities go in:
  - lib/*

DO NOT:
- create a “god” utils file
- create cross-feature circular dependencies
- import private files across features (only import from a feature’s public index)

API CONTRACT & TYPES
- Use Zod schemas for:
  - request validation (on client when building forms)
  - response parsing (runtime safety)
- Define typed API clients per feature:
  - features/<x>/api/client.ts
- Normalize response envelope:
  - { data, error, correlationId }
- Always surface correlationId on error UI (copy button).

STATE MANAGEMENT
- Prefer server state tools (React Query/Apollo) for remote data.
- Keep UI state local (useState/useReducer) unless it must be shared.
- Avoid global state unless absolutely necessary (and document why).

FORMS
- Use react-hook-form + zodResolver (preferred).
- Build reusable field components (TextField, SelectField, MoneyField, UnitField).
- Always support:
  - validation messages
  - disabled states
  - submit loading states
  - retry on failure

LISTS & PERFORMANCE
- For large lists:
  - server-side pagination is mandatory
  - use virtualization (TanStack Virtual) where needed
- Avoid rendering huge tables without virtualization.
- Debounce search inputs.
- Use memoization (useMemo/useCallback) only when justified.

UX SAFETY FOR SYNC ACTIONS (MANDATORY)
Any action that triggers external marketplace writes (sync/publish):
- Must show confirmation with scope
- Must show validation/dry-run result if available
- Must show “job created” with link to job detail
- Must prevent double-submit (disable button, idempotency key)

ERROR HANDLING
- Never show raw stack traces.
- Map error codes to friendly messages:
  - VALIDATION_ERROR -> show field errors
  - NOT_FOUND -> show empty or not found page
  - CONFLICT -> show conflict resolution hint
  - UNAUTHORIZED/FORBIDDEN -> redirect or show access denied
  - INTERNAL -> generic message + correlationId

TESTING (LIGHT BUT MEANINGFUL)
- Unit test key UI logic:
  - mapping transforms previews
  - pagination + filter state
  - sync action confirmation flows
- Use component tests where valuable, avoid snapshot spam.

ACCESSIBILITY (A11Y)
- Keyboard navigation for tables/forms.
- Proper labels, aria attributes.
- Focus management for dialogs.
- High-contrast friendly color choices.

DELIVERABLE EXPECTATION WHEN CURSOR GENERATES CODE
For any new feature/page:
1) Provide file paths and content.
2) Provide a minimal route/page wiring.
3) Provide typed API client + types.
4) Provide loading, empty, and error states.
5) Avoid overengineering; keep consistent with current project conventions.


IMPORT RULES

1) Always use alias-based imports.
   - Do NOT use relative imports like ../../..
   - Use configured aliases only.

Examples:
- ✅ import { createUser } from "@/modules/iam/application/createUser";
- ❌ import { createUser } from "../../../modules/iam/application/createUser";

2) Aliases must reflect architectural intent:
   - @/modules/*        → domain modules
   - @/shared/*         → shared utilities
   - @/components/*     → shared UI components
   - @/features/*       → frontend feature modules

3) Never import from another module’s internal/private files.
   - Only import from:
     - public exports
     - application ports
     - explicitly shared packages

--------------------------------------------------
CODING RULES (MANDATORY)
--------------------------------------------------

1) DRY (Don’t Repeat Yourself)
- If logic is duplicated more than once, extract it.
- Prefer:
  - shared helpers
  - domain services
  - reusable hooks/components
- Avoid premature abstractions; extract only when duplication is clear.

2) Single Responsibility Principle (SRP)
- Each file, function, and class must have ONE clear responsibility.
Examples:
- ❌ Controller doing validation + DB writes + email sending
- ✅ Controller → application use-case → domain logic → outbox event

3) Explicit is better than implicit
- Avoid magic behavior.
- Prefer explicit parameters, return types, and naming.
- Do not rely on hidden side effects.

4) Small files > large files
- Prefer many small, well-named files over large “god” files.
- If a file grows too large:
  - split by responsibility
  - not by random helpers

5) Naming rules
- Names must reflect intent, not implementation.
- Prefer:
  - createUser()
  - verifyEmailToken()
  - deactivateUser()
- Avoid:
  - handleUser()
  - processData()
  - doThing()

6) No business logic in framework layers
- API / GraphQL resolvers:
  - validate input
  - call application use-cases
- Business rules belong in:
  - domain
  - application layer
- Infra layer only adapts external systems.

7) No cross-layer violations
- Domain must not depend on:
  - framework
  - database
  - HTTP
- Application must not depend on:
  - concrete infra implementations
- Infra depends on domain + application, never the other way around.

8) Avoid shared mutable state
- Prefer pure functions where possible.
- If state is required:
  - scope it tightly
  - document why it exists

9) Error handling is mandatory
- Never swallow errors.
- Every error must:
  - have a clear error code
  - be logged with correlationId
  - be mapped to a user-safe response

10) Tests are part of the feature
- No feature is complete without tests.
- New code MUST include:
  - unit tests (where applicable)
  - E2E tests for UI flows
- If tests are omitted, Cursor must explain why.

--------------------------------------------------
WHEN IN DOUBT
--------------------------------------------------
- Prefer readability over cleverness.
- Prefer maintainability over micro-optimizations.
- Prefer boring, predictable code.


If a request conflicts with these rules, propose the closest compliant alternative.


--------------------------------------------------
REUSE-FIRST & SHARED-EXTRACTION RULES (MANDATORY)
--------------------------------------------------

1) Reuse-first is mandatory
Before writing ANY new helper/utility/service/component, Cursor must:
- search the repo for existing implementations
- reuse or extend existing code if it matches >= 70% of the need
- only create new code if no suitable implementation exists

2) No duplicate implementations
- If similar logic already exists, do NOT create a new version.
- Instead:
  a) refactor the existing logic to support the new use case, OR
  b) extract the common parts into a shared location and reuse from both places.

3) Shared extraction policy (when duplication is found)
If the same (or near-same) logic exists in 2+ places or will be used by 2+ modules/features:
- Extract a single implementation to an approved shared folder, then update callers.

Approved shared locations:
Backend:
- src/shared/*  (generic utilities, cross-cutting concerns)
- src/shared/domain/* (value objects, domain primitives)
- src/shared/application/* (common ports/types only if truly cross-cutting)
Frontend:
- src/components/ui/* (shared UI primitives)
- src/components/shared/* (shared composed components)
- src/lib/* (shared client utilities)
- src/features/* should not be used as “shared” across unrelated features.

4) Strict boundaries still apply
- Do NOT move module-owned business logic into shared.
- Shared code must be generic and cross-cutting (e.g., correlationId helpers, pagination utilities, error mapping, validation helpers).
- Module-specific rules stay inside the module.

5) Refactor guidelines (keep diffs small)
When extracting shared logic:
- keep function signatures stable where possible
- move only the minimal common subset
- remove old duplicated code after extraction
- update imports to use aliases

6) Output requirements when refactoring to shared
If Cursor extracts/moves code, it must:
- list the original locations of duplicated logic
- show the new shared file path
- show the updated import paths
- confirm old duplicates were removed

7) Don’t “pre-extract”
- Do not create shared utilities “just in case”.
- Extract only when reuse is real (existing duplication) or imminent (explicitly requested).

8) Default behavior
If there’s any doubt:
- prefer reusing/refactoring existing code
- avoid creating brand-new parallel helpers

--------------------------------------------------
CHANGE SAFETY: NO BREAKS / NO LINT ERRORS (MANDATORY)
--------------------------------------------------

1) Every change must be build-safe
- After implementing any change, Cursor must ensure it does not:
  - break TypeScript compilation
  - introduce lint errors
  - break formatting rules
  - break existing tests

2) Self-check requirement (must be stated explicitly)
At the end of every implementation, Cursor must include a short section:
"Post-change checks"
and list the exact commands that should pass (use repo conventions):
- typecheck (e.g., `pnpm typecheck` or `pnpm -w typecheck`)
- lint (e.g., `pnpm lint`)
- unit tests (e.g., `pnpm test`)
- e2e tests when UI changes (e.g., `pnpm e2e`)

3) Do not introduce new tooling unless requested
- Reuse existing lint/test/typecheck scripts from package.json.
- If scripts are missing, propose minimal additions and explain.

4) Minimal diffs for fixes
- If a lint/typecheck issue arises, fix it at the source.
- Do not “work around” issues with:
  - `any`
  - disabling lint rules
  - ts-ignore
  - unused vars
- Exceptions must be explicitly justified.

5) Keep codebase clean
- No unused imports.
- No dead code.
- No commented-out blocks.
- No console.logs (use structured logger where applicable).

6) If a change is risky, add regression coverage
- For bug fixes, add at least one test to prevent regression.
- For new UI components/pages, add E2E tests (as per testing.md).

7) Output format requirement
Every response that includes code must end with:
- "What changed" (1–3 bullets)
- "Post-change checks" (commands)
- "Notes" (only if needed)
