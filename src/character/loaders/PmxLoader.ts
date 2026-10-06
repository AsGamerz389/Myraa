import * as THREE from 'three';
import { MMDLoader } from 'three/addons/loaders/MMDLoader.js';
import { LoadedPmxModel } from './pmxTypes';
import { createAnimeMaterial } from '../materials/AnimeMaterial';
import { createOutlineMesh } from '../materials/OutlineMesh';
import { QualityProfile } from '../core/quality';

export interface PmxLoadOptions {
  modelUrl: string;
  textureMap?: Record<string, string>; // filename -> blobUrl or objectUrl
  quality?: QualityProfile;
  onProgress?: (progress: number) => void;
}

export class PmxLoader {
  private loader: MMDLoader;
  private loadingManager: THREE.LoadingManager;

  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.loader = new MMDLoader(this.loadingManager);
  }

  async load(options: PmxLoadOptions): Promise<LoadedPmxModel> {
    const { modelUrl, textureMap = {}, quality, onProgress } = options;

    // Configure loading manager URL remapping for embedded textures
    this.loadingManager.setURLModifier((url) => {
      // Extract clean filename without path
      const cleanName = url.split('/').pop()?.split('?')[0]?.toLowerCase() || '';
      for (const [key, val] of Object.entries(textureMap)) {
        if (key.toLowerCase() === cleanName || key.toLowerCase().endsWith(cleanName)) {
          return val;
        }
      }
      return url;
    });

    return new Promise((resolve, reject) => {
      this.loader.load(
        modelUrl,
        (mesh: THREE.SkinnedMesh) => {
          try {
            // Apply custom anime materials & outline
            const materials = this.processMaterials(mesh, quality);
            if (quality?.enableOutline !== false) {
              const outline = createOutlineMesh(mesh, quality);
              if (outline) mesh.add(outline);
            }

            const skeleton = mesh.skeleton;
            const bones = skeleton ? skeleton.bones : [];

            const result: LoadedPmxModel = {
              mesh,
              skeleton,
              materials,
              bones,
              morphTargetDictionary: mesh.morphTargetDictionary,
              morphTargetInfluences: mesh.morphTargetInfluences,
              userData: {
                header: (mesh.geometry as any).userData?.header || {
                  magic: 'PMX',
                  version: 2.0,
                  modelName: mesh.name || 'PMX Model',
                  modelNameEnglish: '',
                  comment: '',
                  commentEnglish: '',
                },
                materials: (mesh.geometry as any).userData?.materials || [],
                bones: (mesh.geometry as any).userData?.bones || [],
                morphs: (mesh.geometry as any).userData?.morphs || [],
                rigidBodies: (mesh.geometry as any).userData?.rigidBodies || [],
              },
            };

            resolve(result);
          } catch (err) {
            reject(err);
          }
        },
        (xhr) => {
          if (onProgress && xhr.total > 0) {
            onProgress(xhr.loaded / xhr.total);
          }
        },
        (error) => {
          console.error('MMDLoader error:', error);
          reject(new Error(`Failed to load PMX model from ${modelUrl}: ${(error as any)?.message || error}`));
        }
      );
    });
  }

  private processMaterials(mesh: THREE.SkinnedMesh, quality?: QualityProfile): THREE.Material[] {
    if (!mesh.material) return [];
    const matArray = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

    const converted = matArray.map((mat) => {
      const animeMat = createAnimeMaterial(mat, quality);
      return animeMat;
    });

    mesh.material = Array.isArray(mesh.material) ? converted : converted[0];
    return converted;
  }
}

export const pmxLoader = new PmxLoader();
