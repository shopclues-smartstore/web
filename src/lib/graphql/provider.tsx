import { ApolloProvider } from '@apollo/client/react';

import { apolloClient } from './client';

interface GraphQLProviderProps {
  children: React.ReactNode;
}

/**
 * GraphQL Provider component that wraps the app with Apollo Client
 */
export function GraphQLProvider({ children }: GraphQLProviderProps) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
