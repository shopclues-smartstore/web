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

If a request conflicts with these rules, propose the closest compliant alternative.
