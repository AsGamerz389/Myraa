import * as THREE from 'three';

export interface PmxHeader {
  magic: string;
  version: number;
  modelName: string;
  modelNameEnglish: string;
  comment: string;
  commentEnglish: string;
}

export interface PmxMaterialData {
  name: string;
  englishName: string;
  diffuse: [number, number, number, number];
  specular: [number, number, number];
  shininess: number;
  ambient: [number, number, number];
  flag: number;
  edgeColor: [number, number, number, number];
  edgeSize: number;
  textureIndex: number;
  sphereTextureIndex: number;
  sphereMode: number;
  isSharedToon: boolean;
  toonIndex: number;
  faceCount: number;
}

export interface PmxBoneData {
  name: string;
  englishName: string;
  position: [number, number, number];
  parentIndex: number;
  transformLevel: number;
  flag: number;
}

export interface PmxMorphData {
  name: string;
  englishName: string;
  panelType: number;
  morphType: number;
  elementCount: number;
}

export interface PmxRigidBodyData {
  name: string;
  boneIndex: number;
  groupIndex: number;
  groupTarget: number;
  shapeType: number;
  width: number;
  height: number;
  depth: number;
  position: [number, number, number];
  rotation: [number, number, number];
  weight: number;
  friction: number;
  restitution: number;
  type: number;
}

export interface LoadedPmxModel {
  mesh: THREE.SkinnedMesh;
  skeleton: THREE.Skeleton;
  materials: THREE.Material[];
  bones: THREE.Bone[];
  morphTargetDictionary?: Record<string, number>;
  morphTargetInfluences?: number[];
  userData: {
    header: PmxHeader;
    materials: PmxMaterialData[];
    bones: PmxBoneData[];
    morphs: PmxMorphData[];
    rigidBodies: PmxRigidBodyData[];
  };
}
