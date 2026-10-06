import * as THREE from 'three';

export interface SerializedPose {
  name: string;
  bones: Record<string, { rot: [number, number, number, number]; pos?: [number, number, number] }>;
}

export class PoseEditor {
  private selectedBone: THREE.Bone | null = null;

  public selectBone(bone: THREE.Bone | null): void {
    this.selectedBone = bone;
  }

  public getSelectedBone(): THREE.Bone | null {
    return this.selectedBone;
  }

  public rotateSelectedBone(deltaEuler: THREE.Euler): void {
    if (!this.selectedBone) return;
    const deltaQ = new THREE.Quaternion().setFromEuler(deltaEuler);
    this.selectedBone.quaternion.multiply(deltaQ);
  }

  public exportPose(skeleton: THREE.Skeleton, name: string = 'custom'): SerializedPose {
    const bonesData: Record<string, { rot: [number, number, number, number]; pos?: [number, number, number] }> = {};
    for (const bone of skeleton.bones) {
      bonesData[bone.name] = {
        rot: [bone.quaternion.x, bone.quaternion.y, bone.quaternion.z, bone.quaternion.w],
        pos: [bone.position.x, bone.position.y, bone.position.z],
      };
    }
    return { name, bones: bonesData };
  }

  public applyPose(skeleton: THREE.Skeleton, pose: SerializedPose): void {
    for (const bone of skeleton.bones) {
      const data = pose.bones[bone.name];
      if (data) {
        bone.quaternion.fromArray(data.rot);
        if (data.pos) bone.position.fromArray(data.pos);
      }
    }
  }
}
