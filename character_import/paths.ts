/**
 * Path utilities for character file import
 */

export function normalizeZipPath(path: string): string {
  return path.replace(/\\/g, '/').replace(/^\.\//, '').trim();
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

export function isTextureFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ['png', 'jpg', 'jpeg', 'tga', 'bmp', 'webp', 'spa', 'sph'].includes(ext);
}

export function isModelFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ext === 'pmx';
}

export function isProfileFile(filename: string): boolean {
  return filename.endsWith('profile.json');
}
