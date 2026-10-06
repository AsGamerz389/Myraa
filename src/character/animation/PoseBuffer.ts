import * as THREE from 'three';

export interface BoneTransform {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
}

export class PoseBuffer {
  private initialPose: Map<string, { pos: THREE.Vector3; rot: THREE.Quaternion }> = new Map();

  public capture(skeleton: THREE.Skeleton): void {
    this.initialPose.clear();
    for (const bone of skeleton.bones) {
      this.initialPose.set(bone.name, {
        pos: bone.position.clone(),
        rot: bone.quaternion.clone(),
      });
    }
  }

  public restore(skeleton: THREE.Skeleton): void {
    for (const bone of skeleton.bones) {
      const saved = this.initialPose.get(bone.name);
      if (saved) {
        bone.position.copy(saved.pos);
        bone.quaternion.copy(saved.rot);
      }
    }
  }

  public getInitial(name: string) {
    return this.initialPose.get(name);
  }
}
