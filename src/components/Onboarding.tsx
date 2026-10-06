import React from 'react';
import { Upload, Sparkles, Smartphone, Layers } from 'lucide-react';

interface OnboardingProps {
  onStartImport: () => void;
  onDismiss: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onStartImport, onDismiss }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
          <Sparkles size={28} />
        </div>

        <h1 className="text-xl font-bold text-white mb-1.5">Welcome to MYRAA</h1>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          High-performance 3D character engine featuring real-time anime toon shading, spring physics, and mobile touch gestures.
        </p>

        <div className="space-y-2.5 text-left mb-6 text-xs text-slate-300">
          <div className="flex items-center gap-3 p-2.5 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <Smartphone size={18} className="text-indigo-400 shrink-0" />
            <span>Mobile-optimized for low-end to high-end devices</span>
          </div>
          <div className="flex items-center gap-3 p-2.5 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <Layers size={18} className="text-amber-400 shrink-0" />
            <span>Auto-downscaled textures for fast GPU loading</span>
          </div>
        </div>

        <button
          onClick={onStartImport}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-medium text-sm shadow-lg shadow-indigo-600/30 mb-2.5"
        >
          <Upload size={18} />
          <span>Import 3D Character</span>
        </button>

        <button
          onClick={onDismiss}
          className="text-xs text-slate-500 hover:text-slate-400 py-1"
        >
          Explore Engine Later
        </button>
      </div>
    </div>
  );
};
