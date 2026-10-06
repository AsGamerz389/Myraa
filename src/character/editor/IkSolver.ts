import * as THREE from 'three';

export interface CCDIKLink {
  index: number;
  limitation?: {
    min: THREE.Vector3;
    max: THREE.Vector3;
  };
}

export interface CCDIKChain {
  target: number;
  effector: number;
  links: CCDIKLink[];
  iteration: number;
  maxAngle: number;
}

export class IkSolver {
  constructor(private skeleton?: THREE.Skeleton) {}

  public setSkeleton(skeleton: THREE.Skeleton): void {
    this.skeleton = skeleton;
  }

  public solveChain(chain: CCDIKChain): void {
    if (!this.skeleton) return;
    const bones = this.skeleton.bones;
    const targetBone = bones[chain.target];
    const effectorBone = bones[chain.effector];
    if (!targetBone || !effectorBone) return;

    const targetPos = new THREE.Vector3();
    targetBone.getWorldPosition(targetPos);

    for (let it = 0; it < chain.iteration; it++) {
      for (const link of chain.links) {
        const linkBone = bones[link.index];
        if (!linkBone) continue;

        const linkPos = new THREE.Vector3();
        linkBone.getWorldPosition(linkPos);

        const effectorPos = new THREE.Vector3();
        effectorBone.getWorldPosition(effectorPos);

        const toEffector = effectorPos.clone().sub(linkPos).normalize();
        const toTarget = targetPos.clone().sub(linkPos).normalize();

        const dot = toEffector.dot(toTarget);
        if (dot < 0.9999) {
          const axis = toEffector.clone().cross(toTarget).normalize();
          const angle = Math.min(Math.acos(Math.max(-1, Math.min(1, dot))), chain.maxAngle);
          const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
          linkBone.quaternion.premultiply(q);
        }
      }
    }
  }
}
