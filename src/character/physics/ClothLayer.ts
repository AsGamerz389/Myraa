import * as THREE from 'three';

export interface ClothCollider {
  position: THREE.Vector3;
  radius: number;
}

export class ClothLayer {
  public enabled: boolean = true;
  private colliders: ClothCollider[] = [];

  constructor() {}

  public addCollider(position: THREE.Vector3, radius: number): void {
    this.colliders.push({ position, radius });
  }

  public update(delta: number): void {
    if (!this.enabled) return;
  }
}
