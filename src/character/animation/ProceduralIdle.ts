import * as THREE from 'three';
import { pseudoNoise } from './noise';

export class ProceduralIdle {
  private time: number = 0;
  private spineBone: THREE.Bone | null = null;
  private chestBone: THREE.Bone | null = null;
  private hipsBone: THREE.Bone | null = null;
  private initialSpineRot: THREE.Euler = new THREE.Euler();
  private initialChestRot: THREE.Euler = new THREE.Euler();
  private initialHipsPos: THREE.Vector3 = new THREE.Vector3();

  public bindSkeleton(skeleton: THREE.Skeleton): void {
    for (const bone of skeleton.bones) {
      if (bone.name === '上半身' || bone.name.toLowerCase() === 'spine') {
        this.spineBone = bone;
        this.initialSpineRot.copy(bone.rotation);
      } else if (bone.name === '上半身2' || bone.name.toLowerCase() === 'chest') {
        this.chestBone = bone;
        this.initialChestRot.copy(bone.rotation);
      } else if (bone.name === 'センター' || bone.name.toLowerCase() === 'hips') {
        this.hipsBone = bone;
        this.initialHipsPos.copy(bone.position);
      }
    }
  }

  public update(delta: number): void {
    this.time += delta;

    // Breathing: cycle of ~4 seconds (0.25 Hz)
    const breathRate = 1.6;
    const breath = Math.sin(this.time * breathRate);
    const microSway = pseudoNoise(this.time * 0.5) * 0.015;

    if (this.chestBone) {
      this.chestBone.rotation.x = this.initialChestRot.x + breath * 0.02 + microSway;
    }

    if (this.spineBone) {
      this.spineBone.rotation.x = this.initialSpineRot.x + breath * 0.01;
      this.spineBone.rotation.y = this.initialSpineRot.y + Math.cos(this.time * 0.6) * 0.015;
    }

    if (this.hipsBone) {
      this.hipsBone.position.y = this.initialHipsPos.y + breath * 0.003;
    }
  }
}
