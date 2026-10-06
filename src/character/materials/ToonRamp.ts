import * as THREE from 'three';
import { ToonRampConfig } from 'shared/character/appearance';

export function createToonRampTexture(config?: Partial<ToonRampConfig>): THREE.DataTexture {
  const width = 64;
  const data = new Uint8Array(width * 4);
  const type = config?.type || 'cel';
  const steps = config?.steps || 2;

  for (let i = 0; i < width; i++) {
    const t = i / (width - 1);
    let val = 0;

    if (type === 'cel') {
      const stepT = Math.floor(t * steps) / (steps - 1);
      val = Math.floor(stepT * 255);
    } else if (type === 'soft') {
      val = Math.floor(Math.pow(t, 0.8) * 255);
    } else if (type === 'step3') {
      if (t < 0.3) val = 80;
      else if (t < 0.7) val = 170;
      else val = 255;
    } else {
      val = Math.floor(t * 255);
    }

    const idx = i * 4;
    data[idx] = val;
    data[idx + 1] = val;
    data[idx + 2] = val;
    data[idx + 3] = 255;
  }

  const texture = new THREE.DataTexture(data, width, 1, THREE.RGBAFormat);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}
