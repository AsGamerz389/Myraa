import React from 'react';
import { StudioSection } from './ui';
import { CharacterSystem } from '../../character/core/CharacterSystem';

export const BonesPanel: React.FC<{ system: CharacterSystem | null }> = ({ system }) => {
  const bones = system?.currentModel?.bones || [];

  return (
    <div className="p-4 space-y-3">
      <StudioSection title={`Skeleton Bones (${bones.length})`}>
        <div className="max-h-48 overflow-y-auto space-y-1 bg-slate-950 p-2 rounded-xl text-[11px] font-mono text-slate-400">
          {bones.length === 0 ? (
            <p className="text-slate-600 p-2">No bones found</p>
          ) : (
            bones.map((b, idx) => (
              <div key={idx} className="flex justify-between hover:text-white py-0.5">
                <span>{b.name}</span>
                <span className="text-slate-600">#{idx}</span>
              </div>
            ))
          )}
        </div>
      </StudioSection>
    </div>
  );
};
