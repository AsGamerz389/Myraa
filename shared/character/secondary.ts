/**
 * Secondary Motion & Spring Bone Physics Config
 */

export interface SpringBoneChain {
  id: string;
  rootBone: string;
  childBones?: string[];
  stiffness: number;
  drag: number;
  gravity: [number, number, number];
  radius: number;
}

export interface ColliderConfig {
  bone: string;
  offset: [number, number, number];
  radius: number;
}

export interface SecondaryMotionConfig {
  enabled: boolean;
  chains: SpringBoneChain[];
  colliders: ColliderConfig[];
  windIntensity?: number;
  gravityMultiplier?: number;
}

export const DEFAULT_SECONDARY_CONFIG: SecondaryMotionConfig = {
  enabled: true,
  chains: [],
  colliders: [],
  windIntensity: 0.1,
  gravityMultiplier: 1.0,
};
