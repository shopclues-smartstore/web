# GraphQL Setup

This directory contains the GraphQL client configuration for SmartStore.

## Overview

- **Client**: Apollo Client
- **Type Safety**: GraphQL Code Generator
- **Error Handling**: Standardized error handling with correlation IDs
- **Authentication**: Automatic token attachment from `authStorage`

## Usage

### Running Code Generation

Generate TypeScript types from your GraphQL schema:

```bash
npm run codegen
```

Watch mode (regenerates on file changes):

```bash
npm run codegen:watch
```

### Creating GraphQL Operations

1. Create GraphQL operations in feature directories:
   ```
   src/features/products/graphql/
     - queries.ts
     - mutations.ts
     - fragments.ts
   ```

2. Write your GraphQL operations using the `gql` tag:
   ```typescript
   import { gql } from "@apollo/client";

   export const GET_PRODUCTS = gql`
     query GetProducts($first: Int!, $after: String) {
       products(first: $first, after: $after) {
         edges {
           node {
             id
             name
             price
           }
         }
         pageInfo {
           hasNextPage
           endCursor
         }
       }
     }
   `;
   ```

3. Run codegen to generate typed hooks:
   ```bash
   npm run codegen
   ```

4. Use the generated hooks in your components:
   ```typescript
   import { useGetProductsQuery } from "@/lib/graphql/generated";
   
   function ProductsList() {
     const { data, loading, error } = useGetProductsQuery({
       variables: { first: 10 },
     });
     
     // ... component logic
   }
   ```

### Error Handling

Use the error handler utilities:

```typescript
import { useQuery } from "@apollo/client";
import {
  getUserFriendlyErrorMessage,
  getCorrelationId,
  isValidationError,
  getFieldErrors,
} from "@/lib/graphql/error-handler";
import { GET_PRODUCTS } from "./queries";

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
  ├── client.ts          # Apollo Client configuration
  ├── provider.tsx        # GraphQL Provider component
  ├── error-handler.ts   # Error handling utilities
  └── generated/         # Generated types and hooks (gitignored)
```

## Best Practices

1. **Keep operations near features**: Place GraphQL operations in `src/features/{feature}/graphql/`
2. **Use fragments**: Create reusable fragments for common data shapes
3. **Handle loading/error states**: Always provide loading and error UI
4. **Show correlation IDs**: Display correlation IDs in error messages for debugging
5. **Type safety**: Never use `any` types - rely on generated types from codegen
