import React from 'react';
import { StudioButton, StudioSection } from './ui';
import { CharacterSystem } from '../../character/core/CharacterSystem';

interface PosePanelProps {
  system: CharacterSystem | null;
}

export const PosePanel: React.FC<PosePanelProps> = ({ system }) => {
  const handleReset = () => {
    if (system?.currentModel?.skeleton) {
      system.poseBuffer.restore(system.currentModel.skeleton);
    }
  };

  const handleTpose = () => {
    if (!system?.currentModel?.skeleton) return;
    for (const bone of system.currentModel.skeleton.bones) {
      bone.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <StudioSection title="Pose Controls">
        <div className="flex flex-wrap gap-2">
          <StudioButton onClick={handleReset}>Reset to Base</StudioButton>
          <StudioButton onClick={handleTpose}>T-Pose</StudioButton>
        </div>
      </StudioSection>
    </div>
  );
};
