import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { config } from "@/lib/config";
import { authStorage } from "@/features/auth/lib/auth-storage";

/**
 * HTTP link for GraphQL requests
 */
const httpLink = createHttpLink({
  uri: `${config.apiUrl}/graphql`,
});

/**
 * Auth link to attach access token and correlation ID to requests
 */
const authLink = setContext((_, { headers }) => {
  const token = authStorage.getAccessToken();
  const correlationId = crypto.randomUUID();

  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      "x-correlation-id": correlationId,
    },
  };
});

/**
 * Error link to handle GraphQL errors consistently
 */
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      const code = extensions?.code as string | undefined;
      const correlationId = operation.getContext().response?.headers?.get("x-correlation-id");

      console.error(
        `[GraphQL error]: Message: ${message}, Code: ${code}, Location: ${locations}, Path: ${path}, CorrelationId: ${correlationId}`
      );

      // Handle authentication/authorization errors
      if (code === "UNAUTHORIZED" || code === "FORBIDDEN") {
        // Clear auth storage and redirect to login
        authStorage.clear();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    });
  }

  if (networkError) {
    const correlationId = operation.getContext().response?.headers?.get("x-correlation-id");
    console.error(`[Network error]: ${networkError}, CorrelationId: ${correlationId}`);
  }
});

/**
 * Apollo Client instance configured for SmartStore
 */
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add field policies for pagination if needed
          // Example:
          // products: {
          //   keyArgs: ["filter"],
          //   merge(existing, incoming, { args }) {
          //     // Handle cursor-based pagination
          //   },
          // },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});
