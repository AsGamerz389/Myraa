import * as fflate from 'fflate';

export interface UnzippedFile {
  name: string;
  data: Uint8Array;
}

export function unzipBuffer(buffer: ArrayBuffer): Promise<UnzippedFile[]> {
  return new Promise((resolve, reject) => {
    const uint8 = new Uint8Array(buffer);
    fflate.unzip(uint8, (err, unzipped) => {
      if (err) {
        return reject(new Error(`Failed to extract ZIP: ${err.message}`));
      }
      const files: UnzippedFile[] = [];
      for (const [name, data] of Object.entries(unzipped)) {
        if (!name.endsWith('/') && !name.startsWith('__MACOSX/')) {
          files.push({ name, data });
        }
      }
      resolve(files);
    });
  });
}
