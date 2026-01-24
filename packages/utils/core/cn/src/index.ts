/**
 * Conditionally join class names together
 * Simple implementation - can be replaced with clsx or classnames if needed
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
