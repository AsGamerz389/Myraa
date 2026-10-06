import * as THREE from 'three';

export class MorphController {
  private mesh: THREE.Mesh | null = null;
  private dict: Record<string, number> = {};
  private targetWeights: Record<string, number> = {};
  private currentWeights: Record<string, number> = {};

  public setMesh(mesh: THREE.Mesh): void {
    this.mesh = mesh;
    this.dict = mesh.morphTargetDictionary || {};
    this.targetWeights = {};
    this.currentWeights = {};
  }

  public setWeight(name: string, weight: number): void {
    this.targetWeights[name] = Math.max(0, Math.min(1, weight));
  }

  public getWeight(name: string): number {
    return this.currentWeights[name] || 0;
  }

  public update(delta: number): void {
    if (!this.mesh || !this.mesh.morphTargetInfluences) return;

    const lerpSpeed = Math.min(1.0, delta * 15.0);

    for (const [name, target] of Object.entries(this.targetWeights)) {
      const idx = this.dict[name];
      if (idx !== undefined) {
        const cur = this.currentWeights[name] || 0;
        const next = THREE.MathUtils.lerp(cur, target, lerpSpeed);
        this.currentWeights[name] = next;
        this.mesh.morphTargetInfluences[idx] = next;
      }
    }
  }

  public resetAll(): void {
    if (!this.mesh || !this.mesh.morphTargetInfluences) return;
    for (let i = 0; i < this.mesh.morphTargetInfluences.length; i++) {
      this.mesh.morphTargetInfluences[i] = 0;
    }
    this.targetWeights = {};
    this.currentWeights = {};
  }
}
