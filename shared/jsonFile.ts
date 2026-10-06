/**
 * JSON File helper utilities
 */

export function parseJsonSafe<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export function stringifyJsonPretty(data: unknown): string {
  return JSON.stringify(data, null, 2);
}
