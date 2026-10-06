/**
 * Neutral Base Character Configuration
 * Rule 2: Neutral base CharacterConfig satisfying config/types.ts without invented identity.
 */

import { CharacterConfig } from '../types';
import { createDefaultProfile } from 'shared/character/profile';

export const evelynConfig: CharacterConfig = {
  id: 'evelyn',
  name: 'Base Character',
  modelUrl: '',
  profile: createDefaultProfile('evelyn', 'Base Character'),
  initialPosition: [0, 0, 0],
  initialRotation: [0, 0, 0],
  cameraOffset: { x: 0, y: 1.4, z: 2.5 },
  targetOffset: { x: 0, y: 1.2, z: 0 },
  qualityTier: 'balanced',
  features: {
    physics: true,
    lipSync: true,
    eyeTracking: true,
    proceduralIdle: true,
    outline: true,
  },
};

export default evelynConfig;
