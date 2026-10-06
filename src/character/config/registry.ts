import { CharacterConfig, CharacterRegistryEntry } from './types';
import evelynConfig from './characters/evelyn';

class CharacterRegistry {
  private entries: Map<string, CharacterRegistryEntry> = new Map();

  constructor() {
    this.register('evelyn', 'Base Character', evelynConfig);
  }

  register(id: string, name: string, config: CharacterConfig, isCustom = false): void {
    this.entries.set(id, { id, name, config, isCustom });
  }

  get(id: string): CharacterConfig | undefined {
    return this.entries.get(id)?.config;
  }

  getAll(): CharacterRegistryEntry[] {
    return Array.from(this.entries.values());
  }

  has(id: string): boolean {
    return this.entries.has(id);
  }

  unregister(id: string): boolean {
    if (id === 'evelyn') return false; // keep base
    return this.entries.delete(id);
  }
}

export const characterRegistry = new CharacterRegistry();
export default characterRegistry;
