import React, { useState } from 'react';
import { X, Activity, Hand, Move, Cpu, Layers } from 'lucide-react';
import { CharacterSystem } from '../../character/core/CharacterSystem';
import { PosePanel } from './PosePanel';
import { PhysicsPanel } from './PhysicsPanel';
import { FingerPanel } from './FingerPanel';
import { BonesPanel } from './BonesPanel';
import { ReportPanel } from './ReportPanel';

interface CharacterStudioProps {
  system: CharacterSystem | null;
  onClose: () => void;
}

export const CharacterStudio: React.FC<CharacterStudioProps> = ({ system, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pose' | 'physics' | 'fingers' | 'bones' | 'tests'>('pose');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity size={16} className="text-indigo-400" />
            Character Studio
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-2 pt-1 gap-1 overflow-x-auto">
          {[
            { id: 'pose', label: 'Pose', icon: Move },
            { id: 'physics', label: 'Physics', icon: Cpu },
            { id: 'fingers', label: 'Hands', icon: Hand },
            { id: 'bones', label: 'Bones', icon: Layers },
            { id: 'tests', label: 'Tests', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                  active
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'pose' && <PosePanel system={system} />}
          {activeTab === 'physics' && <PhysicsPanel system={system} />}
          {activeTab === 'fingers' && <FingerPanel system={system} />}
          {activeTab === 'bones' && <BonesPanel system={system} />}
          {activeTab === 'tests' && <ReportPanel />}
        </div>
      </div>
    </div>
  );
};
