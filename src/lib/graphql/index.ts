/**
 * GraphQL client exports
 */

export { apolloClient } from './client';
export { GraphQLProvider } from './provider';
export {
  getCorrelationId,
  getErrorCode,
  getFieldErrors,
  getUserFriendlyErrorMessage,
  type GraphQLErrorCode,
  type GraphQLErrorExtension,
  isAuthError,
  isValidationError,
} from './error-handler';
