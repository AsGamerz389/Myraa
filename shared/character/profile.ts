/**
 * Character Profile Definition
 */

import { CharacterRigConfig, DEFAULT_RIG_CONFIG } from './rig';
import { SecondaryMotionConfig, DEFAULT_SECONDARY_CONFIG } from './secondary';
import { CharacterAppearanceConfig, DEFAULT_APPEARANCE_CONFIG } from './appearance';
import { HumanoidConfig } from './humanoid';

export interface CharacterMetadata {
  id: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  tags?: string[];
}

export interface CharacterProfile {
  metadata: CharacterMetadata;
  humanoid?: HumanoidConfig;
  rig: CharacterRigConfig;
  appearance: CharacterAppearanceConfig;
  secondary: SecondaryMotionConfig;
  expressions?: Record<string, string>; // semantic name -> morph target name
  defaultPose?: Record<string, [number, number, number]>;
}

export function createDefaultProfile(id: string = 'evelyn', name: string = 'Evelyn'): CharacterProfile {
  return {
    metadata: {
      id,
      name,
      version: '1.0.0',
      description: 'Default character base profile',
    },
    rig: { ...DEFAULT_RIG_CONFIG },
    appearance: { ...DEFAULT_APPEARANCE_CONFIG },
    secondary: { ...DEFAULT_SECONDARY_CONFIG },
    expressions: {
      blink: 'まばたき',
      smile: '笑顔',
      surprised: 'びっくり',
      anger: '怒り',
      sad: '困る',
      aa: 'あ',
      ih: 'い',
      ou: 'う',
      ee: 'え',
      oh: 'お',
    },
  };
}
