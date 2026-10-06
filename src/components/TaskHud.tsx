import React from 'react';
import { PerformanceStats } from '../character/animation/PerformanceController';
import { QualityTier } from '../character/core/quality';
import { CharacterBehaviourState } from '../character/behaviour/behaviours';

interface TaskHudProps {
  stats?: PerformanceStats;
  qualityTier: QualityTier;
  behaviourState: CharacterBehaviourState;
  modelName?: string;
  onOpenImport: () => void;
  onOpenSettings: () => void;
  onOpenStudio?: () => void;
}

export const TaskHud: React.FC<TaskHudProps> = ({
  stats,
  qualityTier,
  behaviourState,
  modelName,
  onOpenImport,
  onOpenSettings,
  onOpenStudio,
}) => {
  return (
    <div className="absolute top-0 inset-x-0 pt-safe px-4 py-3 z-30 pointer-events-none flex items-center justify-between">
      {/* Left: Model Name & Behaviour */}
      <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold text-white tracking-wide">
          {modelName || 'MYRAA'}
        </span>
        <span className="text-[10px] text-slate-400 capitalize px-1.5 py-0.5 rounded bg-slate-800/80 font-medium">
          {behaviourState}
        </span>
      </div>

      {/* Right: FPS & Engine Controls */}
      <div className="pointer-events-auto flex items-center gap-2">
        {stats && (
          <div className="bg-slate-950/70 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-800 text-[11px] font-mono font-medium text-slate-300 shadow-lg flex items-center gap-1.5">
            <span className={stats.fps < 30 ? 'text-amber-400' : 'text-emerald-400'}>
              {stats.fps}
            </span>
            <span className="text-[9px] text-slate-500 uppercase">fps</span>
            <span className="text-slate-600">|</span>
            <span className="text-[9px] text-indigo-400 uppercase font-semibold">
              {qualityTier}
            </span>
          </div>
        )}

        <button
          onClick={onOpenImport}
          className="bg-slate-950/70 hover:bg-slate-900 active:scale-95 transition-all backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs font-medium text-slate-200 shadow-lg"
        >
          Model
        </button>

        <button
          onClick={onOpenSettings}
          className="bg-slate-950/70 hover:bg-slate-900 active:scale-95 transition-all backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs font-medium text-slate-200 shadow-lg"
        >
          Config
        </button>
      </div>
    </div>
  );
};
