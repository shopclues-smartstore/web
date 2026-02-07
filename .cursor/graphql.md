SMARTSTORE – GRAPHQL SETUP CONTEXT CLIENT FOCUS

SCOPE
Consume SmartStore GraphQL APIs from Seller Web and Ops/Admin Web with:
- type safety
- consistent error handling
- good UX (loading/empty/error)
- E2E tests for new UI flows

CLIENT STRATEGY
- Prefer ONE GraphQL client per app:
  - Apollo Client OR urql OR Relay
Choose based on existing repo; do not mix.

TYPE SAFETY (MANDATORY)
- Use GraphQL Code Generator to generate:
  - TypeScript types
  - typed documents
  - (optionally) typed hooks
- Schema source:
  - local schema file (checked in) OR introspection from dev server
- Do not write “any” types around GraphQL responses.

OPERATION CONVENTIONS
- Keep queries/mutations near features:
  - src/features/iam/graphql/*
  - src/features/admin/graphql/*
- Prefer fragments for reusable shapes:
  - UserListRow, UserDetail, PageInfo

AUTH HANDLING
- Access token storage strategy must be consistent:
  - Prefer httpOnly cookies if supported, else secure token storage.
- Attach correlationId header to every request:
  - generate per user action or per request
- Handle UNAUTHORIZED/FORBIDDEN:
  - redirect to login
  - show access denied for Ops screens

ERROR HANDLING (STANDARDIZED)
- Map GraphQL errors by extensions.code:
  - VALIDATION_ERROR -> show field errors
  - NOT_FOUND -> empty/not-found state
  - CONFLICT -> show conflict UI hint
  - UNAUTHORIZED/FORBIDDEN -> auth/permission UI
  - INTERNAL -> generic error
- Always show correlationId (copy button) on error surfaces.

CACHING & PERFORMANCE
- Use normalized caching (Apollo) or document caching (urql) appropriately.
- Avoid overfetching:
  - use fragments
  - request only what the UI needs
- Lists must use cursor pagination patterns consistent with server.

PAGINATION UX (MANDATORY)
- Implement cursor pagination in UI:
  - “Load more” OR infinite scroll
- Maintain filter/sort/search state in URL when possible.

N+1 AWARENESS
- If UI needs nested fields at scale, prefer server fields that already batch
  rather than fetching per-row follow-up queries.

TESTING (MANDATORY FOR NEW UI)
- Unit tests:
  - validation schemas (Zod)
  - key state reducers (filters/pagination)
- E2E tests (Playwright):
  - For each new flow/page, include:
    1) happy path
    2) failure path
    3) loading state + success state assertions
- Prefer mocking GraphQL in E2E when needed:
  - Playwright route interception OR MSW
- Never rely on production services.

DELIVERABLE EXPECTATIONS (FRONTEND)
When implementing frontend GraphQL:
1) Provide codegen config + scripts (if not present).
2) Create typed operations + hooks/SDK.
3) Implement UI with shadcn/ui and responsive layout rules.
4) Provide loading/empty/error states (with correlationId display).
5) Add E2E tests for the flow.