/**
 * Returns the currency symbol for a given ISO 4217 code.
 * Uses Intl.NumberFormat so it handles any valid currency code automatically.
 *
 * Examples:
 *   currencySymbol("INR") → "₹"
 *   currencySymbol("USD") → "$"
 *   currencySymbol("EUR") → "€"
 *   currencySymbol("GBP") → "£"
 */
export function currencySymbol(code: string): string {
  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value ?? code;
  } catch {
    return code;
  }
}

/**
 * Formats a number as a currency string.
 *
 * Examples:
 *   formatCurrency(79, "USD")  → "$79"
 *   formatCurrency(999, "INR") → "₹999"
 *   formatCurrency(9.99, "EUR") → "€9.99"
 */
export function formatCurrency(
  amount: number,
  code: string,
  options?: { fractionDigits?: number }
): string {
  try {
    const fractionDigits =
      options?.fractionDigits ?? (Number.isInteger(amount) ? 0 : 2);
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  } catch {
    return `${code} ${amount}`;
  }
}
