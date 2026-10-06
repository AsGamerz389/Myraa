/**
 * Appearance, Toon Material, and Shading Configuration
 */

export interface ToonRampConfig {
  type: 'cel' | 'soft' | 'step3' | 'custom';
  steps?: number;
  shadowColor?: string;
  highlightColor?: string;
}

export interface OutlineConfig {
  enabled: boolean;
  color: string;
  thickness: number;
  alpha?: number;
}

export interface CharacterAppearanceConfig {
  toonRamp: ToonRampConfig;
  outline: OutlineConfig;
  rimLight: {
    enabled: boolean;
    color: string;
    power: number;
  };
  ambientOcclusion?: {
    enabled: boolean;
    intensity: number;
  };
  materialOverrides?: Record<string, Partial<{
    roughness: number;
    metalness: number;
    outline: boolean;
    cullFace: boolean;
  }>>;
}

export const DEFAULT_APPEARANCE_CONFIG: CharacterAppearanceConfig = {
  toonRamp: {
    type: 'cel',
    steps: 2,
    shadowColor: '#8a7d8f',
  },
  outline: {
    enabled: true,
    color: '#1a181f',
    thickness: 0.002,
  },
  rimLight: {
    enabled: true,
    color: '#ffffff',
    power: 2.0,
  },
  ambientOcclusion: {
    enabled: true,
    intensity: 0.5,
  },
};
