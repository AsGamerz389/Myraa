import * as THREE from 'three';
import { StudioLightingSetup, createStudioLighting } from '../materials/StudioEnvironment';

export class AnimeLightingRig {
  public lights: StudioLightingSetup;

  constructor(public scene: THREE.Scene) {
    this.lights = createStudioLighting(scene);
  }

  setIntensity(intensity: number): void {
    this.lights.ambient.intensity = 0.7 * intensity;
    this.lights.keyLight.intensity = 1.2 * intensity;
    this.lights.fillLight.intensity = 0.5 * intensity;
    this.lights.rimLight.intensity = 0.8 * intensity;
  }

  updateLightDirection(theta: number): void {
    const r = 3.0;
    this.lights.keyLight.position.x = Math.sin(theta) * r;
    this.lights.keyLight.position.z = Math.cos(theta) * r;
  }
}
