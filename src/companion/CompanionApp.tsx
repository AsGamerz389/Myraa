import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Settings,
  Sliders,
  Smile,
  Activity,
  HardDrive,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { MyraaCharacter } from '../character/MyraaCharacter';
import { CharacterSystem } from '../character/core/CharacterSystem';
import { evelynConfig } from '../character/config/characters/evelyn';
import { CharacterConfig } from '../character/config/types';
import { QUALITY_TIERS } from '../character/core/quality';
import { PerformanceStats } from '../character/animation/PerformanceController';
import { ModelSelector } from '../components/ModelSelector';
import { SettingsPanel } from '../components/SettingsPanel';
import { CharacterStudio } from '../components/character/CharacterStudio';
import { MemoryDashboard } from '../components/MemoryDashboard';
import { TaskHud } from '../components/TaskHud';
import { ApiKeyGate } from '../components/ApiKeyGate';
import { Onboarding } from '../components/Onboarding';
import { loadSettings, saveSettings, AppSettings } from '../lib/settingsStore';
import { loadCharacterFromDB, StoredCharacterData } from '../lib/db';
import { companionActor } from './CompanionActor';

export const CompanionApp: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [characterData, setCharacterData] = useState<StoredCharacterData | null>(null);
  const [stats, setStats] = useState<PerformanceStats>();
  const [activeSheet, setActiveSheet] = useState<
    'none' | 'import' | 'settings' | 'studio' | 'memory' | 'expressions'
  >('none');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showApiGate, setShowApiGate] = useState<boolean>(true);
  const [hasLoadedModel, setHasLoadedModel] = useState<boolean>(false);

  const systemRef = useRef<CharacterSystem | null>(null);

  // 1. Check if model already in DB
  useEffect(() => {
    async function checkDb() {
      const stored = await loadCharacterFromDB('current');
      if (stored) {
        setCharacterData(stored);
      } else {
        setShowOnboarding(true);
      }
    }
    checkDb();
  }, []);

  // 2. Android Back Button handling (Rule 6)
  useEffect(() => {
    // Push history state whenever a sheet is opened
    if (activeSheet !== 'none') {
      window.history.pushState({ sheet: activeSheet }, '');
    }

    const handlePopState = () => {
      if (activeSheet !== 'none') {
        setActiveSheet('none');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeSheet]);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    if (systemRef.current) {
      systemRef.current.quality = QUALITY_TIERS[newSettings.qualityTier];
      systemRef.current.secondary.springBones.enabled = newSettings.enablePhysics;
      systemRef.current.gaze.enabled = newSettings.enableGaze;
    }
  };

  const handleCharacterLoaded = () => {
    setHasLoadedModel(true);
    if (systemRef.current) {
      companionActor.bindSystem(systemRef.current);
    }
  };

  const currentConfig: CharacterConfig = characterData
    ? {
        ...evelynConfig,
        id: characterData.id,
        name: characterData.name,
        profile: characterData.profile || evelynConfig.profile,
      }
    : evelynConfig;

  return (
    <div className="relative w-full h-[100dvh] bg-slate-950 text-white overflow-hidden select-none">
      {/* 1. Main 3D Full-Screen Character View (Rule 6) */}
      <div
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
        onClick={() => companionActor.triggerTapReaction()}
      >
        <MyraaCharacter
          config={currentConfig}
          quality={QUALITY_TIERS[settings.qualityTier]}
          systemRef={systemRef}
          onPerformanceUpdate={setStats}
          onLoaded={handleCharacterLoaded}
        />
      </div>

      {/* 2. Top Status HUD (Safe area padding for phone notch / camera cutouts) */}
      <TaskHud
        stats={stats}
        qualityTier={settings.qualityTier}
        behaviourState={systemRef.current?.behaviour.getState() || 'idle'}
        modelName={characterData?.name}
        onOpenImport={() => setActiveSheet('import')}
        onOpenSettings={() => setActiveSheet('settings')}
      />

      {/* 3. Offline STUB Notification Pill */}
      {showApiGate && (
        <div className="absolute top-14 inset-x-4 z-20 pointer-events-auto max-w-sm mx-auto">
          <ApiKeyGate onDismiss={() => setShowApiGate(false)} />
        </div>
      )}

      {/* 4. Bottom Action Bar (Floating mobile bottom pills with safe area) */}
      <div className="absolute bottom-0 inset-x-0 pb-safe p-4 z-20 pointer-events-none flex flex-col items-center gap-3">
        {/* Expression quick buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-slate-950/75 backdrop-blur-md rounded-full border border-slate-800 shadow-xl overflow-x-auto max-w-full">
          {[
            { id: 'smile', label: 'Smile' },
            { id: 'joy', label: 'Joy' },
            { id: 'surprised', label: 'Surprise' },
            { id: 'wink', label: 'Wink' },
            { id: 'shy', label: 'Shy' },
            { id: 'neutral', label: 'Reset' },
          ].map((exp) => (
            <button
              key={exp.id}
              onClick={() => companionActor.setExpression(exp.id)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-slate-200 transition-all whitespace-nowrap"
            >
              {exp.label}
            </button>
          ))}
        </div>

        {/* Primary Navigation Bar */}
        <div className="pointer-events-auto flex items-center gap-2 p-2 bg-slate-950/85 backdrop-blur-lg rounded-2xl border border-slate-800 shadow-2xl">
          <button
            onClick={() => setActiveSheet('import')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 active:scale-95 transition-all"
          >
            <Upload size={16} className="text-indigo-400" />
            <span>Import</span>
          </button>

          <button
            onClick={() => setActiveSheet('studio')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 active:scale-95 transition-all"
          >
            <Activity size={16} className="text-purple-400" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => setActiveSheet('memory')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 active:scale-95 transition-all"
          >
            <HardDrive size={16} className="text-emerald-400" />
            <span>Storage</span>
          </button>

          <button
            onClick={() => setActiveSheet('settings')}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 active:scale-95 transition-all"
            title="Engine Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* 5. Modals & Bottom Sheets */}
      {showOnboarding && !characterData && (
        <Onboarding
          onStartImport={() => {
            setShowOnboarding(false);
            setActiveSheet('import');
          }}
          onDismiss={() => setShowOnboarding(false)}
        />
      )}

      {activeSheet === 'import' && (
        <ModelSelector
          currentData={characterData}
          onImportSuccess={async (res) => {
            const fresh = await loadCharacterFromDB('current');
            setCharacterData(fresh);
            setActiveSheet('none');
          }}
          onClose={() => setActiveSheet('none')}
        />
      )}

      {activeSheet === 'settings' && (
        <SettingsPanel
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setActiveSheet('none')}
        />
      )}

      {activeSheet === 'studio' && (
        <CharacterStudio
          system={systemRef.current}
          onClose={() => setActiveSheet('none')}
        />
      )}

      {activeSheet === 'memory' && (
        <MemoryDashboard
          currentData={characterData}
          stats={stats}
          onClose={() => setActiveSheet('none')}
        />
      )}
    </div>
  );
};

export default CompanionApp;
