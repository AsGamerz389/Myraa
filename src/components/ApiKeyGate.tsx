import React from 'react';
import { ShieldCheck, WifiOff } from 'lucide-react';

interface ApiKeyGateProps {
  onDismiss?: () => void;
}

export const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onDismiss }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 backdrop-blur-md shadow-xl flex items-start gap-3">
      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
        <WifiOff size={18} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5 font-semibold text-white mb-0.5">
          <span>Standalone Offline Mode</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
            STUBBED API
          </span>
        </div>
        <p className="text-slate-400 leading-relaxed mb-2">
          Running 100% on-device. No API keys or remote server required. All /api calls are stubbed.
        </p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};
