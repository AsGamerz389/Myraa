import * as THREE from 'three';

export interface GrantBone {
  bone: THREE.Bone;
  parentBone: THREE.Bone;
  ratio: number;
  isRotation: boolean;
  isTranslation: boolean;
}

export class GrantSolver {
  private grantBones: GrantBone[] = [];

  public build(skeleton: THREE.Skeleton): void {
    this.grantBones = [];
    // Standard MMD twist helper bones (e.g. 手捩, 腕捩)
    for (const bone of skeleton.bones) {
      if (bone.name.includes('捩') || bone.name.includes('twist')) {
        const parent = bone.parent as THREE.Bone;
        if (parent && parent.isBone) {
          this.grantBones.push({
            bone,
            parentBone: parent,
            ratio: 0.5,
            isRotation: true,
            isTranslation: false,
          });
        }
      }
    }
  }

  public update(): void {
    for (const item of this.grantBones) {
      if (item.isRotation) {
        item.bone.quaternion.slerp(item.parentBone.quaternion, item.ratio);
      }
    }
  }
}
