import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { QualityProfile, QUALITY_TIERS } from './quality';
import { AnimeLightingRig } from '../lighting/AnimeLightingRig';

export interface StageOptions {
  container: HTMLElement;
  quality?: QualityProfile;
}

export class Stage {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;
  public lighting: AnimeLightingRig;
  public characterGroup: THREE.Group;

  private isDisposed: boolean = false;
  private resizeObserver: ResizeObserver | null = null;

  constructor(options: StageOptions) {
    const { container, quality = QUALITY_TIERS.balanced } = options;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f111a);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 1.35, 2.8);

    this.renderer = new THREE.WebGLRenderer({
      antialias: quality.antiAliasing,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(quality.dpr);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = quality.enableShadows;
    if (quality.enableShadows) {
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    container.appendChild(this.renderer.domElement);

    // Mobile-optimized orbit controls with touch pinch zoom
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1.25, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI * 0.52; // prevent going under floor
    this.controls.minDistance = 0.8;
    this.controls.maxDistance = 5.5;
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };

    this.lighting = new AnimeLightingRig(this.scene);

    this.characterGroup = new THREE.Group();
    this.scene.add(this.characterGroup);

    // Handle screen rotation and window resizing without reloading character
    this.setupResize(container);
  }

  private setupResize(container: HTMLElement): void {
    const handleResize = () => {
      if (this.isDisposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      if (w === 0 || h === 0) return;

      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 100);
    });

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => handleResize());
      this.resizeObserver.observe(container);
    }
  }

  public render(): void {
    if (this.isDisposed) return;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.isDisposed = true;
    if (this.resizeObserver) this.resizeObserver.disconnect();
    this.controls.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
