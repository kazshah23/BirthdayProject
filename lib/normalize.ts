export function normalize(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[’'`]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matches(input: string, expected: string): boolean {
  return normalize(input) === normalize(expected);
}
