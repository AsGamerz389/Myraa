/**
 * Character Rig & Inverse Kinematics Configuration
 */

export interface IkChainConfig {
  targetBone: string;
  effectorBone: string;
  links: { bone: string; limitation?: { min: [number, number, number]; max: [number, number, number] } }[];
  iteration?: number;
  maxAngle?: number;
}

export interface CharacterRigConfig {
  scale: number;
  centerBone?: string;
  eyeHeight: number;
  centerOffset: [number, number, number];
  ikChains?: Record<string, IkChainConfig>;
}

export const DEFAULT_RIG_CONFIG: CharacterRigConfig = {
  scale: 0.1,
  centerBone: 'センター',
  eyeHeight: 14.5,
  centerOffset: [0, 0, 0],
};
