import { unzipBuffer, UnzippedFile } from './zip';
import { isModelFile, isTextureFile, isProfileFile, normalizeZipPath, getFileExtension } from './paths';
import { tgaToPngBlob } from '../tools/tga2png.mjs';
import { saveCharacterToDB, StoredCharacterData } from '../src/lib/db';
import { createDefaultProfile, CharacterProfile } from '../shared/character/profile';
import { QualityTier } from '../src/character/core/quality';

export interface ImportProgress {
  stage: 'extracting' | 'processing_textures' | 'saving' | 'complete';
  currentFile?: string;
  processedCount: number;
  totalCount: number;
  percentage: number;
}

export interface ImportResult {
  success: boolean;
  modelName: string;
  textureCount: number;
  hasProfile: boolean;
  totalSizeBytes: number;
  downscaledTexturesCount: number;
}

export async function downscaleImageBlob(
  blob: Blob,
  maxDimension: number
): Promise<{ blob: Blob; wasDownscaled: boolean }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width <= maxDimension && height <= maxDimension) {
        resolve({ blob, wasDownscaled: false });
        return;
      }

      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ blob, wasDownscaled: false });
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (resizedBlob) => {
          resolve({ blob: resizedBlob || blob, wasDownscaled: true });
        },
        blob.type === 'image/jpeg' ? 'image/jpeg' : 'image/png',
        0.88
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ blob, wasDownscaled: false });
    };
    img.src = url;
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function importCharacterFiles(
  files: File[] | FileList,
  onProgress?: (progress: ImportProgress) => void
): Promise<ImportResult> {
  let rawFiles: { name: string; data: Uint8Array | ArrayBuffer }[] = [];

  const fileList = Array.from(files);
  if (fileList.length === 0) {
    throw new Error('No files selected for character import.');
  }

  // Check if single ZIP file
  if (fileList.length === 1 && fileList[0].name.toLowerCase().endsWith('.zip')) {
    onProgress?.({
      stage: 'extracting',
      processedCount: 0,
      totalCount: 1,
      percentage: 10,
    });
    const zipBuffer = await fileList[0].arrayBuffer();
    const unzipped = await unzipBuffer(zipBuffer);
    rawFiles = unzipped.map((f) => ({ name: normalizeZipPath(f.name), data: f.data }));
  } else {
    // Direct folder or file picker selection
    onProgress?.({
      stage: 'extracting',
      processedCount: 0,
      totalCount: fileList.length,
      percentage: 15,
    });
    for (const f of fileList) {
      const buf = await f.arrayBuffer();
      // webkitRelativePath contains subfolder path if folder pick
      const name = normalizeZipPath(f.webkitRelativePath || f.name);
      rawFiles.push({ name, data: buf });
    }
  }

  // 1. Locate primary PMX file
  const pmxFile = rawFiles.find((f) => isModelFile(f.name));
  if (!pmxFile) {
    throw new Error('No .pmx character model found in the selected files. Please provide a valid PMX model.');
  }

  // 2. Locate or create profile
  let profile: CharacterProfile = createDefaultProfile('imported', pmxFile.name.replace(/\.pmx$/i, ''));
  const profileFile = rawFiles.find((f) => isProfileFile(f.name));
  let hasProfile = false;
  if (profileFile) {
    try {
      const text = new TextDecoder().decode(profileFile.data);
      profile = JSON.parse(text);
      hasProfile = true;
    } catch {
      console.warn('Failed to parse profile.json; using default profile.');
    }
  }

  // 3. Process & downscale textures
  // Rule 4: maximum 1024 px for hair and clothes, 512 px for the rest
  const textureFiles = rawFiles.filter((f) => isTextureFile(f.name));
  const textures: Record<string, string> = {};
  let downscaledCount = 0;

  for (let i = 0; i < textureFiles.length; i++) {
    const tf = textureFiles[i];
    const baseName = tf.name.split('/').pop() || tf.name;
    const ext = getFileExtension(baseName);

    onProgress?.({
      stage: 'processing_textures',
      currentFile: baseName,
      processedCount: i + 1,
      totalCount: textureFiles.length,
      percentage: 20 + Math.round(((i + 1) / textureFiles.length) * 60),
    });

    try {
      let imageBlob: Blob;
      if (ext === 'tga') {
        // Convert TGA to PNG using tools/tga2png.mjs
        imageBlob = await tgaToPngBlob(tf.data as any);
      } else {
        const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
        imageBlob = new Blob([tf.data as any], { type: mime });
      }

      // Determine max texture dimension according to Rule 4
      const isHairOrClothes = /(hair|髪|cloth|dress|服|suit|skirt|costume|body|wear)/i.test(tf.name);
      const maxDim = isHairOrClothes ? 1024 : 512;

      const { blob: processedBlob, wasDownscaled } = await downscaleImageBlob(imageBlob, maxDim);
      if (wasDownscaled) downscaledCount++;

      const dataUrl = await blobToDataUrl(processedBlob);
      // Map both full relative path and bare filename for three.js loader lookup
      textures[tf.name] = dataUrl;
      textures[baseName] = dataUrl;
      // Also map with .png extension if converted from .tga
      if (ext === 'tga') {
        const pngName = baseName.replace(/\.tga$/i, '.png');
        textures[pngName] = dataUrl;
      }
    } catch (err) {
      console.warn(`Failed to process texture ${tf.name}:`, err);
    }
  }

  // 4. Save to IndexedDB
  onProgress?.({
    stage: 'saving',
    processedCount: textureFiles.length,
    totalCount: textureFiles.length,
    percentage: 90,
  });

  const pmxBuffer = (pmxFile.data instanceof ArrayBuffer ? pmxFile.data : (pmxFile.data as Uint8Array).buffer) as ArrayBuffer;

  const storedData: StoredCharacterData = {
    id: 'current',
    name: profile.metadata?.name || pmxFile.name.replace(/\.pmx$/i, ''),
    pmxBuffer,
    textures,
    profile,
    importedAt: Date.now(),
  };

  await saveCharacterToDB(storedData);

  onProgress?.({
    stage: 'complete',
    processedCount: textureFiles.length,
    totalCount: textureFiles.length,
    percentage: 100,
  });

  return {
    success: true,
    modelName: storedData.name,
    textureCount: Object.keys(textures).length,
    hasProfile,
    totalSizeBytes: pmxBuffer.byteLength,
    downscaledTexturesCount: downscaledCount,
  };
}
