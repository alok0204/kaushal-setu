/**
 * Utility helper to concatenate conditional CSS class strings.
 * Keeps dependency footprint minimal without external libraries.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
