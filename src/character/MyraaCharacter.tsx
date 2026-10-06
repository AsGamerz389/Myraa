import React, { useEffect, useRef, useState } from 'react';
import { Stage } from './core/Stage';
import { CharacterSystem } from './core/CharacterSystem';
import { CharacterConfig } from './config/types';
import { QualityProfile, QUALITY_TIERS } from './core/quality';
import { loadCharacterFromDB } from '../lib/db';
import { PerformanceStats } from './animation/PerformanceController';

interface MyraaCharacterProps {
  config: CharacterConfig;
  quality?: QualityProfile;
  onPerformanceUpdate?: (stats: PerformanceStats) => void;
  onError?: (err: Error) => void;
  onLoaded?: () => void;
  systemRef?: React.MutableRefObject<CharacterSystem | null>;
}

export const MyraaCharacter: React.FC<MyraaCharacterProps> = ({
  config,
  quality = QUALITY_TIERS.balanced,
  onPerformanceUpdate,
  onError,
  onLoaded,
  systemRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    let stage: Stage | null = null;
    let system: CharacterSystem | null = null;
    let isCancelled = false;

    async function init() {
      try {
        setLoading(true);
        setLoadError(null);

        // 1. Check IndexedDB for imported character
        const stored = await loadCharacterFromDB('current');
        if (!stored || !stored.pmxBuffer) {
          const err = new Error(
            'No character model found. Please import a PMX character package (.zip or folder) using the Import button.'
          );
          setLoadError(err.message);
          onError?.(err);
          setLoading(false);
          return;
        }

        if (isCancelled) return;

        // 2. Initialize Three.js Stage & CharacterSystem
        stage = new Stage({
          container: containerRef.current!,
          quality,
        });

        system = new CharacterSystem({
          stage,
          config,
          quality,
          onPerformanceUpdate,
        });

        if (systemRef) {
          systemRef.current = system;
        }

        // 3. Create Blob URL for model.pmx
        const pmxBlob = new Blob([stored.pmxBuffer], { type: 'application/octet-stream' });
        const pmxUrl = URL.createObjectURL(pmxBlob);
        objectUrlsRef.current.push(pmxUrl);

        // 4. Load character into 3D engine
        await system.loadCharacter(pmxUrl, stored.textures);

        if (isCancelled) return;

        system.start();
        setLoading(false);
        onLoaded?.();
      } catch (err: any) {
        console.error('Failed to initialize character:', err);
        const errMsg = err?.message || 'Error loading 3D character';
        setLoadError(errMsg);
        onError?.(new Error(errMsg));
        setLoading(false);
      }
    }

    init();

    // Touch / mouse gaze tracking
    const handlePointerMove = (e: PointerEvent) => {
      if (!system || !stage) return;
      // Convert normalized screen coords to 3D world space gaze
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      system.gaze.setTarget(x * 0.8, 1.4 + y * 0.4, 2.0);
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      isCancelled = true;
      window.removeEventListener('pointermove', handlePointerMove);
      if (system) {
        system.dispose();
        if (systemRef) systemRef.current = null;
      }
      // Revoke any created object URLs
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, [config, quality]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden touch-none">
      <div ref={containerRef} className="w-full h-full absolute inset-0" />

      {loading && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-20 text-white p-6 text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-base font-medium">Loading 3D Character...</p>
          <p className="text-xs text-slate-400 mt-1">Applying anime toon materials and physics</p>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 text-white p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-2xl font-bold mb-4">
            !
          </div>
          <h3 className="text-lg font-semibold text-rose-300 mb-2">No Character Loaded</h3>
          <p className="text-sm text-slate-300 max-w-sm mb-6 leading-relaxed">
            {loadError}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyraaCharacter;
