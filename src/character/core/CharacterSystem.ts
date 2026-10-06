import * as THREE from 'three';
import { Stage } from './Stage';
import { PmxLoader, pmxLoader } from '../loaders/PmxLoader';
import { LoadedPmxModel } from '../loaders/pmxTypes';
import { FaceController } from '../face/FaceController';
import { GazeController } from '../animation/GazeController';
import { SecondaryMotion } from '../physics/SecondaryMotion';
import { ProceduralIdle } from '../animation/ProceduralIdle';
import { GrantSolver } from '../animation/GrantSolver';
import { BehaviourDirector } from '../behaviour/BehaviourDirector';
import { PerformanceController, PerformanceStats } from '../animation/PerformanceController';
import { PoseBuffer } from '../animation/PoseBuffer';
import { Seating } from '../scene/Seating';
import { CharacterConfig } from '../config/types';
import { QualityProfile, QUALITY_TIERS } from './quality';

export interface CharacterSystemOptions {
  stage: Stage;
  config: CharacterConfig;
  quality?: QualityProfile;
  onPerformanceUpdate?: (stats: PerformanceStats) => void;
  onError?: (err: Error) => void;
}

export class CharacterSystem {
  public stage: Stage;
  public config: CharacterConfig;
  public quality: QualityProfile;

  public currentModel: LoadedPmxModel | null = null;
  public face: FaceController;
  public gaze: GazeController;
  public secondary: SecondaryMotion;
  public idle: ProceduralIdle;
  public grantSolver: GrantSolver;
  public behaviour: BehaviourDirector;
  public perf: PerformanceController;
  public poseBuffer: PoseBuffer;
  public seating: Seating;

  private clock: THREE.Clock = new THREE.Clock();
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private onPerformanceUpdate?: (stats: PerformanceStats) => void;

  constructor(options: CharacterSystemOptions) {
    this.stage = options.stage;
    this.config = options.config;
    this.quality = options.quality || QUALITY_TIERS.balanced;
    this.onPerformanceUpdate = options.onPerformanceUpdate;

    this.face = new FaceController();
    this.gaze = new GazeController();
    this.secondary = new SecondaryMotion();
    this.idle = new ProceduralIdle();
    this.grantSolver = new GrantSolver();
    this.behaviour = new BehaviourDirector(this.face, this.gaze);
    this.perf = new PerformanceController();
    this.poseBuffer = new PoseBuffer();
    this.seating = new Seating();
  }

  public async loadCharacter(modelUrl: string, textureMap: Record<string, string> = {}): Promise<LoadedPmxModel> {
    if (!modelUrl) {
      throw new Error('No character model URL provided. Please import a PMX character file.');
    }

    // Clean up existing model
    this.unloadCurrentModel();

    try {
      const loaded = await pmxLoader.load({
        modelUrl,
        textureMap,
        quality: this.quality,
      });

      this.currentModel = loaded;
      this.stage.characterGroup.add(loaded.mesh);

      // Bind subsystems to skeleton and mesh
      if (loaded.skeleton) {
        this.poseBuffer.capture(loaded.skeleton);
        this.gaze.bindBones(loaded.skeleton);
        this.idle.bindSkeleton(loaded.skeleton);
        this.secondary.setSkeleton(loaded.skeleton);
        this.grantSolver.build(loaded.skeleton);
      }

      this.face.setMesh(loaded.mesh);
      this.behaviour.setState('idle');

      return loaded;
    } catch (err: any) {
      console.error('CharacterSystem: failed to load model:', err);
      throw err;
    }
  }

  public unloadCurrentModel(): void {
    if (this.currentModel) {
      this.stage.characterGroup.remove(this.currentModel.mesh);
      if (this.currentModel.mesh.geometry) {
        this.currentModel.mesh.geometry.dispose();
      }
      this.currentModel = null;
    }
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.loop();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = (): void => {
    if (!this.isRunning) return;
    this.animationFrameId = requestAnimationFrame(this.loop);

    const delta = Math.min(this.clock.getDelta(), 0.05);

    if (this.currentModel) {
      // 1. Procedural breathing and spine
      this.idle.update(delta);

      // 2. Look-at and gaze tracking
      this.gaze.update(delta);

      // 3. Grant solver (twist bones)
      this.grantSolver.update();

      // 4. Secondary spring-bone physics
      if (this.quality.enablePhysics) {
        this.secondary.update(delta);
      }

      // 5. Facial morphs, speech, blinking
      this.face.update(delta);

      // 6. Behaviour director updates
      this.behaviour.update(delta);
    }

    // Render 3D scene
    this.stage.render();

    // Stats
    const stats = this.perf.tick();
    if (this.onPerformanceUpdate) {
      this.onPerformanceUpdate(stats);
    }
  };

  public dispose(): void {
    this.stop();
    this.unloadCurrentModel();
    this.stage.dispose();
  }
}
