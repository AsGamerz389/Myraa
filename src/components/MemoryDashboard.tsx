import React from 'react';
import { Database, HardDrive, Cpu, X } from 'lucide-react';
import { StoredCharacterData } from '../lib/db';
import { PerformanceStats } from '../character/animation/PerformanceController';

interface MemoryDashboardProps {
  currentData: StoredCharacterData | null;
  stats?: PerformanceStats;
  onClose: () => void;
}

export const MemoryDashboard: React.FC<MemoryDashboardProps> = ({
  currentData,
  stats,
  onClose,
}) => {
  const modelMb = currentData ? Math.round(currentData.pmxBuffer.byteLength / 1024 / 1024 * 10) / 10 : 0;
  const textureCount = currentData ? Object.keys(currentData.textures || {}).length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <HardDrive size={18} className="text-emerald-400" />
            <h2 className="text-base font-bold text-white">Memory & Diagnostics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Database size={14} className="text-indigo-400" />
              <span>Model File Size</span>
            </div>
            <p className="text-lg font-bold text-white font-mono">{modelMb} MB</p>
            <p className="text-[10px] text-slate-500 mt-0.5">PMX binary in IndexedDB</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Cpu size={14} className="text-sky-400" />
              <span>Textures Cached</span>
            </div>
            <p className="text-lg font-bold text-white font-mono">{textureCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Downscaled GPU maps</p>
          </div>
        </div>

        {stats && (
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5 mb-5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">FPS:</span>
              <span className="font-mono font-medium text-emerald-400">{stats.fps}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Frame Duration:</span>
              <span className="font-mono">{stats.frameTimeMs} ms</span>
            </div>
            {stats.memoryMb && (
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">JS Heap Footprint:</span>
                <span className="font-mono">{stats.memoryMb} MB</span>
              </div>
            )}
          </div>
        )}

        <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed mb-4">
          All textures and model geometry are preserved securely in local IndexedDB. No external servers or network data transfers are used.
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};
