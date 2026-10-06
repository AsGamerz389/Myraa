import * as THREE from 'three';

export class GazeController {
  private target: THREE.Vector3 = new THREE.Vector3(0, 1.4, 2.0);
  private currentLookAt: THREE.Vector3 = new THREE.Vector3(0, 1.4, 2.0);
  private headBone: THREE.Bone | null = null;
  private neckBone: THREE.Bone | null = null;
  private leftEyeBone: THREE.Bone | null = null;
  private rightEyeBone: THREE.Bone | null = null;

  public enabled: boolean = true;
  private saccadeTimer: number = 0;
  private saccadeOffset: THREE.Vector3 = new THREE.Vector3();

  public bindBones(skeleton: THREE.Skeleton): void {
    for (const bone of skeleton.bones) {
      if (bone.name === '頭' || bone.name.toLowerCase() === 'head') this.headBone = bone;
      else if (bone.name === '首' || bone.name.toLowerCase() === 'neck') this.neckBone = bone;
      else if (bone.name === '左目' || bone.name.toLowerCase().includes('lefteye')) this.leftEyeBone = bone;
      else if (bone.name === '右目' || bone.name.toLowerCase().includes('righteye')) this.rightEyeBone = bone;
    }
  }

  public setTarget(x: number, y: number, z: number): void {
    this.target.set(x, y, z);
  }

  public update(delta: number): void {
    if (!this.enabled || !this.headBone) return;

    // Saccadic eye micro-movements
    this.saccadeTimer += delta;
    if (this.saccadeTimer > 1.2) {
      this.saccadeTimer = 0;
      this.saccadeOffset.set(
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.05,
        0
      );
    }

    const effectiveTarget = this.target.clone().add(this.saccadeOffset);
    this.currentLookAt.lerp(effectiveTarget, Math.min(1.0, delta * 4.0));

    // Rotate head slightly towards lookAt
    const headWorldPos = new THREE.Vector3();
    this.headBone.getWorldPosition(headWorldPos);

    const diff = this.currentLookAt.clone().sub(headWorldPos).normalize();
    const yaw = Math.atan2(diff.x, diff.z);
    const pitch = -Math.asin(Math.max(-1, Math.min(1, diff.y)));

    // Clamp angles to natural human head range
    const clampedYaw = Math.max(-0.4, Math.min(0.4, yaw));
    const clampedPitch = Math.max(-0.3, Math.min(0.3, pitch));

    this.headBone.rotation.y = THREE.MathUtils.lerp(this.headBone.rotation.y, clampedYaw * 0.6, delta * 4.0);
    this.headBone.rotation.x = THREE.MathUtils.lerp(this.headBone.rotation.x, clampedPitch * 0.6, delta * 4.0);

    if (this.neckBone) {
      this.neckBone.rotation.y = THREE.MathUtils.lerp(this.neckBone.rotation.y, clampedYaw * 0.4, delta * 4.0);
    }
  }
}
