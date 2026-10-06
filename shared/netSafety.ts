/**
 * Network Safety & URL Validation
 */

export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('blob:') || url.startsWith('data:')) return true;
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function sanitizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/').replace(/\/\.\.\//g, '/').trim();
}
