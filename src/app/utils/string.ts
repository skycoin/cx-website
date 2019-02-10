/**
 * Replaces non alpha-numerical characters with dashes
 */
export function linkify(input: string): string {
  return input.trim().replace(/\W+/g, '-').toLowerCase();
}
