/**
 * Redaction utility for logs and safe outputs
 */

export function redactSensitive(str: string): string {
  if (!str) return '';
  return str.replace(/(api[_-]?key|secret|token|password)=([^&\s]+)/gi, '$1=[REDACTED]');
}
