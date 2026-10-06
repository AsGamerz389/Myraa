import * as THREE from 'three';
import { MorphController } from './MorphController';
import { LipSync } from './LipSync';
import { EXPRESSION_PRESETS, ExpressionPreset } from './ExpressionLibrary';

export class FaceController {
  public morphs: MorphController;
  public lipSync: LipSync;

  private currentExpression: string = 'neutral';
  private blinkTimer: number = 0;
  private blinkInterval: number = 3.5;
  private isBlinking: boolean = false;
  private blinkProgress: number = 0;

  constructor() {
    this.morphs = new MorphController();
    this.lipSync = new LipSync();
    this.lipSync.setMorphController(this.morphs);
    this.scheduleNextBlink();
  }

  public setMesh(mesh: THREE.Mesh): void {
    this.morphs.setMesh(mesh);
  }

  public setExpression(name: string): void {
    const preset = EXPRESSION_PRESETS[name] || EXPRESSION_PRESETS.neutral;
    this.currentExpression = name;
    for (const [morphName, weight] of Object.entries(preset.weights)) {
      this.morphs.setWeight(morphName, weight);
    }
  }

  public update(delta: number): void {
    this.updateBlink(delta);
    this.lipSync.update(delta);
    this.morphs.update(delta);
  }

  private scheduleNextBlink(): void {
    this.blinkInterval = 2.0 + Math.random() * 3.5;
    this.blinkTimer = 0;
  }

  private updateBlink(delta: number): void {
    if (!this.isBlinking) {
      this.blinkTimer += delta;
      if (this.blinkTimer >= this.blinkInterval) {
        this.isBlinking = true;
        this.blinkProgress = 0;
      }
    } else {
      this.blinkProgress += delta * 7.0; // blink duration ~140ms
      if (this.blinkProgress >= 1.0) {
        this.isBlinking = false;
        this.morphs.setWeight('まばたき', 0);
        this.scheduleNextBlink();
      } else {
        // Curve: fast close, smooth open
        const weight = Math.sin(this.blinkProgress * Math.PI);
        this.morphs.setWeight('まばたき', weight);
      }
    }
  }
}
