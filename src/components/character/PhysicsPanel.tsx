import React, { useState } from 'react';
import { StudioButton, StudioSection } from './ui';
import { CharacterSystem } from '../../character/core/CharacterSystem';

interface PhysicsPanelProps {
  system: CharacterSystem | null;
}

export const PhysicsPanel: React.FC<PhysicsPanelProps> = ({ system }) => {
  const [enabled, setEnabled] = useState(true);

  const togglePhysics = () => {
    if (!system) return;
    const next = !enabled;
    setEnabled(next);
    system.secondary.springBones.enabled = next;
  };

  const resetBones = () => {
    system?.secondary.springBones.reset();
  };

  return (
    <div className="p-4 space-y-4">
      <StudioSection title="Spring-Bone Dynamics">
        <div className="flex flex-wrap gap-2">
          <StudioButton active={enabled} onClick={togglePhysics}>
            {enabled ? 'Physics Active' : 'Physics Paused'}
          </StudioButton>
          <StudioButton onClick={resetBones}>Reset Spring Nodes</StudioButton>
        </div>
      </StudioSection>
    </div>
  );
};
