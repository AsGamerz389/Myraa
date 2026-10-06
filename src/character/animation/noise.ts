/**
 * 1D & 2D Smooth Noise for Procedural Animation
 */

export function pseudoNoise(t: number): number {
  return Math.sin(t * 1.5) * 0.5 + Math.sin(t * 3.7 + 1.2) * 0.3 + Math.sin(t * 7.1 + 2.4) * 0.2;
}

export function smoothNoise2D(x: number, y: number): number {
  return (pseudoNoise(x) + pseudoNoise(y + 10.5)) * 0.5;
}
