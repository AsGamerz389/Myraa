import * as THREE from 'three';

export interface AoParams {
  intensity: number;
  color: THREE.Color;
}

export function applyFakeAmbientOcclusion(mesh: THREE.Mesh, params: Partial<AoParams> = {}): void {
  const intensity = params.intensity ?? 0.3;
  if (!mesh.geometry.attributes.color) {
    const count = mesh.geometry.attributes.position.count;
    const colors = new Float32Array(count * 3).fill(1.0);
    mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }
}
