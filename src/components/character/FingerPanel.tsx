import React from 'react';
import { StudioButton, StudioSection } from './ui';
import { CharacterSystem } from '../../character/core/CharacterSystem';
import { HandPose, HandPoseType } from '../../character/animation/HandPose';

const handPose = new HandPose();

export const FingerPanel: React.FC<{ system: CharacterSystem | null }> = ({ system }) => {
  const apply = (side: 'left' | 'right', pose: HandPoseType) => {
    if (!system?.currentModel?.skeleton) return;
    handPose.applyPreset(system.currentModel.skeleton, side, pose);
  };

  const poses: HandPoseType[] = ['relaxed', 'open', 'fist', 'peace', 'pointing'];

  return (
    <div className="p-4 space-y-4">
      <StudioSection title="Left Hand">
        <div className="flex flex-wrap gap-2">
          {poses.map((p) => (
            <StudioButton key={p} onClick={() => apply('left', p)}>
              {p}
            </StudioButton>
          ))}
        </div>
      </StudioSection>

      <StudioSection title="Right Hand">
        <div className="flex flex-wrap gap-2">
          {poses.map((p) => (
            <StudioButton key={p} onClick={() => apply('right', p)}>
              {p}
            </StudioButton>
          ))}
        </div>
      </StudioSection>
    </div>
  );
};
