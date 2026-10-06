import { CharacterProfile } from 'shared/character/profile';
import { CharacterConfig } from './types';
import evelynConfig from './characters/evelyn';

export function characterConfigFromProfile(
  profile: CharacterProfile,
  overrides?: Partial<CharacterConfig>
): CharacterConfig {
  return {
    ...evelynConfig,
    id: profile.metadata.id || evelynConfig.id,
    name: profile.metadata.name || evelynConfig.name,
    profile,
    ...overrides,
  };
}
