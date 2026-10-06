import * as THREE from 'three';
import { createToonRampTexture } from './ToonRamp';
import { QualityProfile } from '../core/quality';

export function createAnimeMaterial(
  sourceMaterial: THREE.Material,
  quality?: QualityProfile
): THREE.Material {
  const ramp = createToonRampTexture({
    type: 'cel',
    steps: quality?.toonSteps ?? 2,
  });

  const m = sourceMaterial as any;
  const toonMat = new THREE.MeshToonMaterial({
    color: m.color ? m.color.clone() : new THREE.Color(0xffffff),
    map: m.map || null,
    gradientMap: ramp,
    bumpMap: m.bumpMap || null,
    bumpScale: m.bumpScale || 0.05,
    normalMap: m.normalMap || null,
    transparent: m.transparent ?? (m.opacity < 0.99),
    opacity: m.opacity ?? 1.0,
    depthWrite: m.depthWrite ?? true,
    depthTest: m.depthTest ?? true,
    side: m.side ?? THREE.DoubleSide,
  });

  toonMat.name = sourceMaterial.name;
  return toonMat;
}
