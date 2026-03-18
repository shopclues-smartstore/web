import { ApolloError } from "@apollo/client";

export type GraphQLErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL"
  | string;

export interface GraphQLErrorExtension {
  code?: GraphQLErrorCode;
  field?: string;
  message?: string;
  correlationId?: string;
}

/**
 * Extracts error code from Apollo error
 */
export function getErrorCode(error: ApolloError): GraphQLErrorCode | undefined {
  const firstError = error.graphQLErrors[0];
  return firstError?.extensions?.code as GraphQLErrorCode | undefined;
}

/**
 * Extracts correlation ID from Apollo error
 */
export function getCorrelationId(error: ApolloError): string | undefined {
  // Try to get from error extensions first
  const firstError = error.graphQLErrors[0];
  const correlationId = firstError?.extensions?.correlationId as string | undefined;
  if (correlationId) return correlationId;

  // Fallback to network error response headers
  const networkError = error.networkError as any;
  return networkError?.result?.headers?.["x-correlation-id"] || networkError?.response?.headers?.get?.("x-correlation-id");
}

/**
 * Gets user-friendly error message based on error code
 */
export function getUserFriendlyErrorMessage(error: ApolloError): string {
  const code = getErrorCode(error);
  const correlationId = getCorrelationId(error);

  switch (code) {
    case "VALIDATION_ERROR":
      return "Please fix the errors in the form.";
    case "NOT_FOUND":
      return "The requested resource was not found.";
    case "CONFLICT":
      return "This action conflicts with existing data. Please check and try again.";
    case "UNAUTHORIZED":
      return "You are not authorized. Please log in.";
    case "FORBIDDEN":
      return "You don't have permission to perform this action.";
    case "INTERNAL":
      return "An internal error occurred. Please try again later.";
    default:
      return error.message || "Something went wrong. Please try again.";
  }
}

/**
 * Checks if error is a validation error
 */
export function isValidationError(error: ApolloError): boolean {
  return getErrorCode(error) === "VALIDATION_ERROR";
}

/**
 * Checks if error is an authentication error
 */
export function isAuthError(error: ApolloError): boolean {
  const code = getErrorCode(error);
  return code === "UNAUTHORIZED" || code === "FORBIDDEN";
}

/**
 * Extracts field-level validation errors
 */
export function getFieldErrors(error: ApolloError): Record<string, string> {
  if (!isValidationError(error)) return {};

  const fieldErrors: Record<string, string> = {};
  error.graphQLErrors.forEach((graphQLError) => {
    const extensions = graphQLError.extensions as GraphQLErrorExtension | undefined;
    if (extensions?.field && extensions?.message) {
      fieldErrors[extensions.field] = extensions.message;
    }
  });

  return fieldErrors;
}
