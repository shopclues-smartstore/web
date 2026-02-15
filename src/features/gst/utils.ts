/**
 * Indian GSTIN format: 15 chars
 * - 2 digits: state code
 * - 10 chars: PAN (first 5 letters, next 4 digits, last 1 letter)
 * - 2 digits: entity number
 * - 1 char: Z (default) or letter
 * - 1 char: check digit (digit or letter)
 * Pattern: ^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]$
 */
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9][A-Z][0-9A-Z]$/;

/**
 * Returns true if the string looks like a valid Indian GSTIN (format only; does not verify with API).
 */
export function isValidGstinFormat(value: string): boolean {
  const normalized = value.trim().toUpperCase().replace(/\s/g, "");
  return normalized.length === 15 && GSTIN_REGEX.test(normalized);
}

/**
 * Normalizes GSTIN input (uppercase, no spaces) for display or API.
 */
export function normalizeGstin(value: string): string {
  return value.trim().toUpperCase().replace(/\s/g, "");
}
