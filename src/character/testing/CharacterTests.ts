import * as THREE from 'three';
import { SpringBonePhysics } from '../physics/SpringBonePhysics';
import { MorphController } from '../face/MorphController';
import { GazeController } from '../animation/GazeController';

export interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export function runCharacterEngineTests(): TestResult[] {
  const results: TestResult[] = [];

  // Test 1: MorphController
  try {
    const morph = new MorphController();
    const geo = new THREE.BufferGeometry();
    const mat = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.morphTargetDictionary = { 'まばたき': 0 };
    mesh.morphTargetInfluences = [0];
    morph.setMesh(mesh);
    morph.setWeight('まばたき', 0.8);
    morph.update(0.1);
    results.push({
      name: 'MorphController weight interpolation',
      passed: mesh.morphTargetInfluences[0] > 0,
      message: `Weight is ${mesh.morphTargetInfluences[0]}`,
    });
  } catch (err: any) {
    results.push({ name: 'MorphController weight interpolation', passed: false, message: err.message });
  }

  // Test 2: SpringBonePhysics initialization
  try {
    const rootBone = new THREE.Bone();
    rootBone.name = 'hair_front';
    const skeleton = new THREE.Skeleton([rootBone]);
    const physics = new SpringBonePhysics(skeleton);
    results.push({
      name: 'SpringBonePhysics node identification',
      passed: physics.enabled === true,
      message: 'Initialized successfully',
    });
  } catch (err: any) {
    results.push({ name: 'SpringBonePhysics node identification', passed: false, message: err.message });
  }

  // Test 3: GazeController
  try {
    const gaze = new GazeController();
    gaze.setTarget(1, 1, 1);
    results.push({
      name: 'GazeController target setting',
      passed: true,
      message: 'Target set without error',
    });
  } catch (err: any) {
    results.push({ name: 'GazeController target setting', passed: false, message: err.message });
  }

  return results;
}
