import React from 'react';
import { X, Sparkles, Cpu, Eye, Wind, Sliders } from 'lucide-react';
import { QualityTier, QUALITY_TIERS } from '../character/core/quality';
import { AppSettings } from '../lib/settingsStore';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const tiers: QualityTier[] = ['potato', 'low', 'balanced', 'high'];

  const handleTierChange = (tier: QualityTier) => {
    onUpdateSettings({
      ...settings,
      qualityTier: tier,
      enablePhysics: QUALITY_TIERS[tier].enablePhysics,
      enableOutline: QUALITY_TIERS[tier].enableOutline,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-indigo-400" />
            <h2 className="text-base font-bold text-white">Engine Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quality Tiers */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
            Hardware Quality Tier
          </label>
          <div className="grid grid-cols-4 gap-2">
            {tiers.map((t) => {
              const active = settings.qualityTier === t;
              return (
                <button
                  key={t}
                  onClick={() => handleTierChange(t)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-medium capitalize border transition-all text-center ${
                    active
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {settings.qualityTier === 'potato' && 'Minimal overhead: no physics/shadows, max 512px textures.'}
            {settings.qualityTier === 'low' && 'Lite rendering: simple physics, 512px textures.'}
            {settings.qualityTier === 'balanced' && 'Standard mobile profile: spring bones, anime outlines, 1024px hair/clothes.'}
            {settings.qualityTier === 'high' && 'Maximum visual fidelity: full physics, 2x shadows, 1024px textures.'}
          </p>
        </div>

        {/* Feature toggles */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Engine Subsystems
          </label>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <Cpu size={16} className="text-indigo-400" />
              <span>Spring-Bone Physics</span>
            </div>
            <input
              type="checkbox"
              checked={settings.enablePhysics}
              onChange={(e) => onUpdateSettings({ ...settings, enablePhysics: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <Sparkles size={16} className="text-amber-400" />
              <span>Anime Inverted-Hull Outline</span>
            </div>
            <input
              type="checkbox"
              checked={settings.enableOutline}
              onChange={(e) => onUpdateSettings({ ...settings, enableOutline: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <Eye size={16} className="text-sky-400" />
              <span>Touch & Screen Gaze Tracking</span>
            </div>
            <input
              type="checkbox"
              checked={settings.enableGaze}
              onChange={(e) => onUpdateSettings({ ...settings, enableGaze: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <Wind size={16} className="text-teal-400" />
              <span>Procedural Breathing Idle</span>
            </div>
            <input
              type="checkbox"
              checked={settings.enableBreathing}
              onChange={(e) => onUpdateSettings({ ...settings, enableBreathing: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
        >
          Save & Apply
        </button>
      </div>
    </div>
  );
};
