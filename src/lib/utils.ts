/**
 * Utility helper to concatenate conditional CSS class strings.
 * Keeps dependency footprint minimal without external libraries.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Generate unique entity identifiers safely outside React component render scopes.
 */
export function generateUniqueId(prefix = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}
