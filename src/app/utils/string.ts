/**
 * Replaces non alpha-numerical characters with dash
 */
export function linkable(input: string): string {
  return input.replace(/\W+/g, '-').toLowerCase();
}
