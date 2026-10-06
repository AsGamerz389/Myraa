import * as THREE from 'three';

export interface SpringNode {
  bone: THREE.Bone;
  initialLocalPos: THREE.Vector3;
  initialLocalRot: THREE.Quaternion;
  currentWorldPos: THREE.Vector3;
  prevWorldPos: THREE.Vector3;
  length: number;
  radius: number;
  stiffness: number;
  drag: number;
  gravity: THREE.Vector3;
}

export class SpringBonePhysics {
  private nodes: SpringNode[] = [];
  public enabled: boolean = true;
  public gravity: THREE.Vector3 = new THREE.Vector3(0, -9.8, 0);

  constructor(private skeleton?: THREE.Skeleton) {
    if (skeleton) {
      this.initFromSkeleton(skeleton);
    }
  }

  public initFromSkeleton(skeleton: THREE.Skeleton): void {
    this.skeleton = skeleton;
    this.nodes = [];

    // Identify hair / skirt / accessory bones
    const springBoneRegex = /(hair|髪|ツインテ|ポニテ|前髪|横髪|後髪|リボン|スカート|skirt|ribbon|胸|breast)/i;

    for (const bone of skeleton.bones) {
      if (springBoneRegex.test(bone.name)) {
        const worldPos = new THREE.Vector3();
        bone.getWorldPosition(worldPos);

        this.nodes.push({
          bone,
          initialLocalPos: bone.position.clone(),
          initialLocalRot: bone.quaternion.clone(),
          currentWorldPos: worldPos.clone(),
          prevWorldPos: worldPos.clone(),
          length: Math.max(bone.position.length(), 0.1),
          radius: 0.05,
          stiffness: 0.15,
          drag: 0.4,
          gravity: new THREE.Vector3(0, -0.05, 0),
        });
      }
    }
  }

  public update(delta: number): void {
    if (!this.enabled || this.nodes.length === 0) return;
    const dt = Math.min(delta, 0.033);

    for (const node of this.nodes) {
      const parent = node.bone.parent;
      if (!parent) continue;

      const parentWorldPos = new THREE.Vector3();
      parent.getWorldPosition(parentWorldPos);

      // Verlet integration
      const velocity = node.currentWorldPos.clone().sub(node.prevWorldPos).multiplyScalar(1.0 - node.drag);
      node.prevWorldPos.copy(node.currentWorldPos);

      // Force = gravity + spring back to target
      const targetWorldPos = node.initialLocalPos.clone().applyMatrix4(parent.matrixWorld);
      const springForce = targetWorldPos.sub(node.currentWorldPos).multiplyScalar(node.stiffness);

      node.currentWorldPos.add(velocity).add(springForce).add(node.gravity.clone().multiplyScalar(dt));

      // Constraint length to parent
      const dir = node.currentWorldPos.clone().sub(parentWorldPos);
      if (dir.lengthSq() > 0.00001) {
        dir.normalize().multiplyScalar(node.length);
        node.currentWorldPos.copy(parentWorldPos).add(dir);

        // Apply rotation to bone
        const localTarget = node.currentWorldPos.clone();
        parent.worldToLocal(localTarget);
        node.bone.lookAt(node.currentWorldPos);
      }
    }
  }

  public reset(): void {
    for (const node of this.nodes) {
      node.bone.position.copy(node.initialLocalPos);
      node.bone.quaternion.copy(node.initialLocalRot);
      node.bone.getWorldPosition(node.currentWorldPos);
      node.prevWorldPos.copy(node.currentWorldPos);
    }
  }
}
