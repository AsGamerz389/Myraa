import * as THREE from 'three';

export interface StudioLightingSetup {
  ambient: THREE.AmbientLight;
  keyLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
}

export function createStudioLighting(scene: THREE.Scene): StudioLightingSetup {
  const ambient = new THREE.AmbientLight(0xfff5f0, 0.7);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(1.5, 3.0, 2.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xdde8ff, 0.5);
  fillLight.position.set(-2.0, 1.5, 2.0);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffeedd, 0.8);
  rimLight.position.set(0.0, 2.5, -2.5);
  scene.add(rimLight);

  return { ambient, keyLight, fillLight, rimLight };
}
