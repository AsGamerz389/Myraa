import * as THREE from 'three';
import { QualityProfile } from '../core/quality';

export function createOutlineMesh(sourceMesh: THREE.SkinnedMesh, quality?: QualityProfile): THREE.SkinnedMesh | null {
  if (quality && !quality.enableOutline) return null;

  const outlineGeometry = sourceMesh.geometry.clone();
  const outlineMaterial = new THREE.ShaderMaterial({
    uniforms: {
      outlineColor: { value: new THREE.Color(0x1a1520) },
      outlineThickness: { value: 0.0025 },
    },
    vertexShader: `
      #include <skinning_pars_vertex>
      uniform float outlineThickness;
      void main() {
        #include <skinbase_vertex>
        #include <begin_vertex>
        #include <skinning_vertex>
        
        vec3 transformedNormal = objectNormal;
        #ifdef USE_SKINNING
          mat4 skinMat = skinMatrix;
          transformedNormal = (skinMat * vec4(objectNormal, 0.0)).xyz;
        #endif
        transformed += normalize(transformedNormal) * outlineThickness;
        
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 outlineColor;
      void main() {
        gl_FragColor = vec4(outlineColor, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: true,
    depthTest: true,
    transparent: false,
  });

  const outlineMesh = new THREE.SkinnedMesh(outlineGeometry, outlineMaterial);
  outlineMesh.name = `${sourceMesh.name}_outline`;
  if (sourceMesh.skeleton) {
    outlineMesh.bind(sourceMesh.skeleton, sourceMesh.bindMatrix);
  }
  return outlineMesh;
}
