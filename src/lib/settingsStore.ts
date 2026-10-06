import { QualityTier } from '../character/core/quality';

export interface AppSettings {
  qualityTier: QualityTier;
  enablePhysics: boolean;
  enableOutline: boolean;
  enableGaze: boolean;
  enableBreathing: boolean;
  voiceInputEnabled: boolean;
  theme: 'dark' | 'light';
  fov: number;
}

const SETTINGS_KEY = 'myraa_app_settings';

const DEFAULT_SETTINGS: AppSettings = {
  qualityTier: 'balanced',
  enablePhysics: true,
  enableOutline: true,
  enableGaze: true,
  enableBreathing: true,
  voiceInputEnabled: false,
  theme: 'dark',
  fov: 40,
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}
