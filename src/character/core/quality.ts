/**
 * Quality Tier Configuration & Hardware Adaptation
 */

export type QualityTier = 'potato' | 'low' | 'balanced' | 'high';

export interface QualityProfile {
  tier: QualityTier;
  maxTextureSize: {
    hairClothes: number;
    other: number;
  };
  shadowMapSize: number;
  enableShadows: boolean;
  enableOutline: boolean;
  enablePhysics: boolean;
  physicsSubsteps: number;
  dpr: number;
  antiAliasing: boolean;
  toonSteps: number;
  enableBloom: boolean;
}

export const QUALITY_TIERS: Record<QualityTier, QualityProfile> = {
  potato: {
    tier: 'potato',
    maxTextureSize: {
      hairClothes: 512,
      other: 256,
    },
    shadowMapSize: 0,
    enableShadows: false,
    enableOutline: false,
    enablePhysics: false,
    physicsSubsteps: 1,
    dpr: 1.0,
    antiAliasing: false,
    toonSteps: 2,
    enableBloom: false,
  },
  low: {
    tier: 'low',
    maxTextureSize: {
      hairClothes: 512,
      other: 512,
    },
    shadowMapSize: 512,
    enableShadows: true,
    enableOutline: true,
    enablePhysics: true,
    physicsSubsteps: 1,
    dpr: 1.0,
    antiAliasing: false,
    toonSteps: 2,
    enableBloom: false,
  },
  balanced: {
    tier: 'balanced',
    maxTextureSize: {
      hairClothes: 1024,
      other: 512,
    },
    shadowMapSize: 1024,
    enableShadows: true,
    enableOutline: true,
    enablePhysics: true,
    physicsSubsteps: 2,
    dpr: Math.min(window.devicePixelRatio || 1.5, 2.0),
    antiAliasing: true,
    toonSteps: 3,
    enableBloom: false,
  },
  high: {
    tier: 'high',
    maxTextureSize: {
      hairClothes: 1024,
      other: 1024,
    },
    shadowMapSize: 2048,
    enableShadows: true,
    enableOutline: true,
    enablePhysics: true,
    physicsSubsteps: 3,
    dpr: Math.min(window.devicePixelRatio || 2.0, 2.5),
    antiAliasing: true,
    toonSteps: 4,
    enableBloom: true,
  },
};

export function detectDefaultQualityTier(): QualityTier {
  // Mobile device memory & hardware heuristic
  const nav = typeof navigator !== 'undefined' ? navigator : null;
  const memory = (nav as any)?.deviceMemory; // in GB
  const cores = nav?.hardwareConcurrency || 4;

  if (memory && memory <= 2) return 'potato';
  if (memory && memory <= 4) return 'balanced';
  if (cores <= 4) return 'low';
  return 'balanced';
}
