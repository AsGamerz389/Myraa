/**
 * Humanoid Bone Definitions and Standard MMD to Humanoid Mapping
 */

export type HumanoidBoneName =
  | 'hips'
  | 'spine'
  | 'chest'
  | 'upperChest'
  | 'neck'
  | 'head'
  | 'leftEye'
  | 'rightEye'
  | 'jaw'
  | 'leftShoulder'
  | 'leftUpperArm'
  | 'leftLowerArm'
  | 'leftHand'
  | 'rightShoulder'
  | 'rightUpperArm'
  | 'rightLowerArm'
  | 'rightHand'
  | 'leftUpperLeg'
  | 'leftLowerLeg'
  | 'leftFoot'
  | 'leftToes'
  | 'rightUpperLeg'
  | 'rightLowerLeg'
  | 'rightFoot'
  | 'rightToes'
  | 'leftThumbMetacarpal'
  | 'leftThumbProximal'
  | 'leftThumbDistal'
  | 'leftIndexProximal'
  | 'leftIndexIntermediate'
  | 'leftIndexDistal'
  | 'leftMiddleProximal'
  | 'leftMiddleIntermediate'
  | 'leftMiddleDistal'
  | 'leftRingProximal'
  | 'leftRingIntermediate'
  | 'leftRingDistal'
  | 'leftLittleProximal'
  | 'leftLittleIntermediate'
  | 'leftLittleDistal'
  | 'rightThumbMetacarpal'
  | 'rightThumbProximal'
  | 'rightThumbDistal'
  | 'rightIndexProximal'
  | 'rightIndexIntermediate'
  | 'rightIndexDistal'
  | 'rightMiddleProximal'
  | 'rightMiddleIntermediate'
  | 'rightMiddleDistal'
  | 'rightRingProximal'
  | 'rightRingIntermediate'
  | 'rightRingDistal'
  | 'rightLittleProximal'
  | 'rightLittleIntermediate'
  | 'rightLittleDistal';

export const MMD_TO_HUMANOID_BONES: Record<string, HumanoidBoneName> = {
  'センター': 'hips',
  '下半身': 'hips',
  '上半身': 'spine',
  '上半身2': 'chest',
  '首': 'neck',
  '頭': 'head',
  '両目': 'head',
  '左目': 'leftEye',
  '右目': 'rightEye',
  '左肩': 'leftShoulder',
  '左腕': 'leftUpperArm',
  '左ひじ': 'leftLowerArm',
  '左手首': 'leftHand',
  '右肩': 'rightShoulder',
  '右腕': 'rightUpperArm',
  '右ひじ': 'rightLowerArm',
  '右手首': 'rightHand',
  '左足': 'leftUpperLeg',
  '左ひざ': 'leftLowerLeg',
  '左足首': 'leftFoot',
  '左つま先': 'leftToes',
  '右足': 'rightUpperLeg',
  '右ひざ': 'rightLowerLeg',
  '右足首': 'rightFoot',
  '右つま先': 'rightToes',
  // Fingers
  '左親指０': 'leftThumbMetacarpal',
  '左親指１': 'leftThumbProximal',
  '左親指２': 'leftThumbDistal',
  '左人指１': 'leftIndexProximal',
  '左人指２': 'leftIndexIntermediate',
  '左人指３': 'leftIndexDistal',
  '左中指１': 'leftMiddleProximal',
  '左中指２': 'leftMiddleIntermediate',
  '左中指３': 'leftMiddleDistal',
  '左薬指１': 'leftRingProximal',
  '左薬指２': 'leftRingIntermediate',
  '左薬指３': 'leftRingDistal',
  '左小指１': 'leftLittleProximal',
  '左小指２': 'leftLittleIntermediate',
  '左小指３': 'leftLittleDistal',
  '右親指０': 'rightThumbMetacarpal',
  '右親指１': 'rightThumbProximal',
  '右親指２': 'rightThumbDistal',
  '右人指１': 'rightIndexProximal',
  '右人指２': 'rightIndexIntermediate',
  '右人指３': 'rightIndexDistal',
  '右中指１': 'rightMiddleProximal',
  '右中指２': 'rightMiddleIntermediate',
  '右中指３': 'rightMiddleDistal',
  '右薬指１': 'rightRingProximal',
  '右薬指２': 'rightRingIntermediate',
  '右薬指３': 'rightRingDistal',
  '右小指１': 'rightLittleProximal',
  '右小指２': 'rightLittleIntermediate',
  '右小指３': 'rightLittleDistal',
};

export interface HumanoidConfig {
  boneMapping: Record<string, string>;
  armatureScale?: number;
  height?: number;
}
