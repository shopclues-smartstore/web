# GraphQL Setup

This directory contains the GraphQL client configuration for SmartStore.

## Overview

- **Client**: Apollo Client 4 (hooks from `@apollo/client/react`)
- **Operations**: Central `.gql` files in `operations/mutations/` and `operations/queries/`
- **Codegen**: GraphQL Code Generator produces types and React hooks in `generated/types.ts`
- **Error Handling**: Standardized error handling with correlation IDs
- **Authentication**: Automatic token attachment from `authStorage`

## Usage

### Running Code Generation

Generate types and hooks from the GraphQL schema and operations:

```bash
npm run codegen
```

Watch mode (regenerates on file changes):

```bash
npm run codegen:watch
```

Requires a running GraphQL server for schema introspection. A post-codegen script (`scripts/patch-codegen-types.cjs`) runs automatically to ensure Apollo 4 compatibility.

### Creating GraphQL Operations

1. **Add a new `.gql` file** in the appropriate folder:
   - **Mutations**: `src/lib/graphql/operations/mutations/<name>.gql`
   - **Queries**: `src/lib/graphql/operations/queries/<name>.gql`

   Example `operations/mutations/create-workspace.gql`:
   ```graphql
   mutation CreateWorkspace($input: CreateWorkspaceInput!) {
     createWorkspace(input: $input) {
       workspace {
         id
         name
         country
         currency
         timezone
       }
     }
   }
   ```

2. **Export the document** from the loader so the app can use it at runtime:
   - In `operations/mutations.ts`: add `import myOpGql from "./mutations/<name>.gql?raw";` and `export const MY_OP = gql(myOpGql);`
   - In `operations/queries.ts`: same pattern for query files

3. **Run codegen** to generate types and hooks:
   ```bash
   npm run codegen
   ```

4. **Use the generated hook** in components:
   ```typescript
   import { useCreateWorkspaceMutation } from "@/lib/graphql/generated/types";

   function StoreForm() {
     const [createWorkspace, { loading }] = useCreateWorkspaceMutation();
     // ...
   }
   ```

   Or use the document from `@/lib/graphql/operations` in a custom hook (e.g. feature-level `useCreateWorkspaceMutation` that wraps `useMutation(CREATE_WORKSPACE)`).

### Error Handling

Use the error handler utilities:

```typescript
import { useQuery } from "@apollo/client/react";
import {
  getUserFriendlyErrorMessage,
  getCorrelationId,
  isValidationError,
  getFieldErrors,
} from "@/lib/graphql/error-handler";
import { GET_PRODUCTS } from "@/lib/graphql/operations";

function ProductsList() {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  if (error) {
    const message = getUserFriendlyErrorMessage(error);
    const correlationId = getCorrelationId(error);
    
    if (isValidationError(error)) {
      const fieldErrors = getFieldErrors(error);
      // Handle field-level errors
    }
    
    return <ErrorDisplay message={message} correlationId={correlationId} />;
  }
  
  // ... rest of component
}
```

### Authentication

The Apollo Client automatically:
- Attaches the access token from `authStorage` to all requests
- Generates a correlation ID for each request
- Handles UNAUTHORIZED/FORBIDDEN errors by clearing auth and redirecting to login

### Configuration

- **GraphQL Endpoint**: Configured via `VITE_API_URL` environment variable (defaults to `http://localhost:3000`)
- **Codegen Config**: See `codegen.ts` in the project root

## File Structure

```
src/lib/graphql/
  ├── client.ts           # Apollo Client configuration
  ├── provider.tsx        # GraphQL Provider component
  ├── error-handler.ts    # Error handling utilities
  ├── operations/         # Source of truth for GraphQL operations
  │   ├── mutations/      # .gql mutation files
  │   │   └── create-workspace.gql
  │   ├── queries/       # .gql query files
  │   │   └── admin-users-sample.gql
  │   ├── mutations.ts   # Loads .gql (via ?raw), exports document constants
  │   ├── queries.ts    # Same for queries
  │   └── index.ts      # Re-exports
  └── generated/         # Codegen output (gitignored)
      ├── types.ts       # Types, document nodes, and React hooks
      ├── graphql.ts     # Client preset output
      ├── gql.ts
      └── ...
```

## Best Practices

1. **Single source of truth**: Put all operations in `operations/mutations/*.gql` and `operations/queries/*.gql`; avoid defining the same operation in both a `.gql` file and a `.ts` file (codegen requires unique operation names).
2. **Use generated hooks**: Prefer hooks from `@/lib/graphql/generated/types` (e.g. `useCreateWorkspaceMutation`) when they fit; otherwise use `useMutation`/`useQuery` from `@/lib/graphql/operations` documents.
3. **Use fragments**: Create reusable fragments for common data shapes when needed.
4. **Handle loading/error states**: Always provide loading and error UI.
5. **Show correlation IDs**: Display correlation IDs in error messages for debugging.
6. **Type safety**: Rely on generated types from codegen; avoid `any`.
