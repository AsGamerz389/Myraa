import * as THREE from 'three';

export type HandPoseType = 'relaxed' | 'fist' | 'open' | 'peace' | 'pointing';

export interface FingerRotations {
  thumb: number;
  index: number;
  middle: number;
  ring: number;
  little: number;
}

export const HAND_PRESETS: Record<HandPoseType, FingerRotations> = {
  relaxed: { thumb: 0.2, index: 0.35, middle: 0.4, ring: 0.45, little: 0.5 },
  open: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, little: 0.05 },
  fist: { thumb: 0.9, index: 1.4, middle: 1.4, ring: 1.4, little: 1.4 },
  peace: { thumb: 0.8, index: 0.05, middle: 0.05, ring: 1.4, little: 1.4 },
  pointing: { thumb: 0.8, index: 0.05, middle: 1.4, ring: 1.4, little: 1.4 },
};

export class HandPose {
  public applyPreset(skeleton: THREE.Skeleton, side: 'left' | 'right', pose: HandPoseType): void {
    const preset = HAND_PRESETS[pose] || HAND_PRESETS.relaxed;
    const prefix = side === 'left' ? '左' : '右';

    for (const bone of skeleton.bones) {
      if (bone.name.startsWith(prefix)) {
        if (bone.name.includes('親指')) bone.rotation.z = preset.thumb * 0.5;
        else if (bone.name.includes('人指')) bone.rotation.x = preset.index * 0.6;
        else if (bone.name.includes('中指')) bone.rotation.x = preset.middle * 0.6;
        else if (bone.name.includes('薬指')) bone.rotation.x = preset.ring * 0.6;
        else if (bone.name.includes('小指')) bone.rotation.x = preset.little * 0.6;
      }
    }
  }
}
