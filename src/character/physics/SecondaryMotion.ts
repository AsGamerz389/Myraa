import * as THREE from 'three';
import { SpringBonePhysics } from './SpringBonePhysics';
import { ClothLayer } from './ClothLayer';

export class SecondaryMotion {
  public springBones: SpringBonePhysics;
  public cloth: ClothLayer;
  public wind: THREE.Vector3 = new THREE.Vector3(0.02, 0, 0.01);
  private time: number = 0;

  constructor(skeleton?: THREE.Skeleton) {
    this.springBones = new SpringBonePhysics(skeleton);
    this.cloth = new ClothLayer();
  }

  public setSkeleton(skeleton: THREE.Skeleton): void {
    this.springBones.initFromSkeleton(skeleton);
  }

  public update(delta: number): void {
    this.time += delta;
    // Add subtle ambient wind oscillation
    const windMagnitude = Math.sin(this.time * 2.5) * 0.05 + Math.cos(this.time * 1.2) * 0.02;
    this.springBones.gravity.x = windMagnitude;

    this.springBones.update(delta);
    this.cloth.update(delta);
  }
}
