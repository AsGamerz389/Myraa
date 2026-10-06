import * as THREE from 'three';

export interface SeatingAnchor {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  seatHeight: number;
}

export class Seating {
  private isSeated: boolean = false;
  private currentAnchor: SeatingAnchor | null = null;

  public sitAt(anchor: SeatingAnchor, characterGroup: THREE.Group): void {
    this.isSeated = true;
    this.currentAnchor = anchor;
    characterGroup.position.copy(anchor.position);
    characterGroup.rotation.copy(anchor.rotation);
  }

  public standUp(characterGroup: THREE.Group): void {
    this.isSeated = false;
    this.currentAnchor = null;
    characterGroup.position.set(0, 0, 0);
  }

  public getIsSeated(): boolean {
    return this.isSeated;
  }
}
