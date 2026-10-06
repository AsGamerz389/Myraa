import { CharacterProfile } from 'shared/character/profile';
import { QualityTier } from '../core/quality';

export interface CharacterConfig {
  id: string;
  name: string;
  modelUrl?: string;
  textures?: Record<string, string>;
  profile: CharacterProfile;
  initialPosition?: [number, number, number];
  initialRotation?: [number, number, number];
  cameraOffset?: { x: number; y: number; z: number };
  targetOffset?: { x: number; y: number; z: number };
  qualityTier?: QualityTier;
  features?: {
    physics?: boolean;
    lipSync?: boolean;
    eyeTracking?: boolean;
    proceduralIdle?: boolean;
    outline?: boolean;
  };
}

export interface CharacterRegistryEntry {
  id: string;
  name: string;
  config: CharacterConfig;
  isCustom?: boolean;
}
