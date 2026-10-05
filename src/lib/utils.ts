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

/**
 * Deterministically formats an ISO date string to "Mon DD, YYYY" using UTC
 * so that server and client render the exact same string across all locales and timezones.
 */
export function formatDeterministicDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  } catch {
    return String(dateStr);
  }
}
