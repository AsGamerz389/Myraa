/**
 * TGA to PNG parser & converter utility.
 * Supports uncompressed and RLE-compressed 24-bit and 32-bit TGA formats.
 */

export function parseTGA(buffer) {
  const data = new Uint8Array(buffer);
  if (data.length < 18) {
    throw new Error('TGA buffer too small (< 18 bytes)');
  }

  const idLength = data[0];
  const colorMapType = data[1];
  const imageType = data[2];
  const width = data[12] | (data[13] << 8);
  const height = data[14] | (data[15] << 8);
  const pixelDepth = data[16];
  const imageDescriptor = data[17];

  const isFlipY = !(imageDescriptor & 0x20); // bottom-up if bit 5 is 0
  const isFlipX = !!(imageDescriptor & 0x10);

  let offset = 18 + idLength;
  if (colorMapType === 1) {
    const colorMapLength = data[5] | (data[6] << 8);
    const colorMapDepth = data[7];
    offset += colorMapLength * Math.ceil(colorMapDepth / 8);
  }

  const bytesPerPixel = Math.floor(pixelDepth / 8);
  if (bytesPerPixel !== 3 && bytesPerPixel !== 4 && bytesPerPixel !== 1) {
    throw new Error(`Unsupported TGA pixel depth: ${pixelDepth}`);
  }

  const numPixels = width * height;
  const rgba = new Uint8ClampedArray(numPixels * 4);

  const isRLE = imageType === 10 || imageType === 11; // 10: RGB RLE, 11: Greyscale RLE
  const isRGB = imageType === 2 || imageType === 10;
  const isGrey = imageType === 3 || imageType === 11;

  if (!isRGB && !isGrey) {
    throw new Error(`Unsupported TGA image type: ${imageType}`);
  }

  let pixelIdx = 0;
  while (pixelIdx < numPixels && offset < data.length) {
    if (isRLE) {
      const packet = data[offset++];
      const count = (packet & 0x7f) + 1;
      const isRL = (packet & 0x80) !== 0;

      if (isRL) {
        let b = 0, g = 0, r = 0, a = 255;
        if (isGrey) {
          b = g = r = data[offset++];
          if (bytesPerPixel === 2) a = data[offset++];
        } else {
          b = data[offset++];
          g = data[offset++];
          r = data[offset++];
          if (bytesPerPixel === 4) a = data[offset++];
        }
        for (let i = 0; i < count && pixelIdx < numPixels; i++) {
          const outIdx = pixelIdx * 4;
          rgba[outIdx] = r;
          rgba[outIdx + 1] = g;
          rgba[outIdx + 2] = b;
          rgba[outIdx + 3] = a;
          pixelIdx++;
        }
      } else {
        for (let i = 0; i < count && pixelIdx < numPixels && offset < data.length; i++) {
          let b = 0, g = 0, r = 0, a = 255;
          if (isGrey) {
            b = g = r = data[offset++];
            if (bytesPerPixel === 2) a = data[offset++];
          } else {
            b = data[offset++];
            g = data[offset++];
            r = data[offset++];
            if (bytesPerPixel === 4) a = data[offset++];
          }
          const outIdx = pixelIdx * 4;
          rgba[outIdx] = r;
          rgba[outIdx + 1] = g;
          rgba[outIdx + 2] = b;
          rgba[outIdx + 3] = a;
          pixelIdx++;
        }
      }
    } else {
      // Uncompressed
      let b = 0, g = 0, r = 0, a = 255;
      if (isGrey) {
        b = g = r = data[offset++];
        if (bytesPerPixel === 2) a = data[offset++];
      } else {
        b = data[offset++];
        g = data[offset++];
        r = data[offset++];
        if (bytesPerPixel === 4) a = data[offset++];
      }
      const outIdx = pixelIdx * 4;
      rgba[outIdx] = r;
      rgba[outIdx + 1] = g;
      rgba[outIdx + 2] = b;
      rgba[outIdx + 3] = a;
      pixelIdx++;
    }
  }

  // Handle vertical flip if bottom-to-top
  if (isFlipY) {
    const rowSize = width * 4;
    const tempRow = new Uint8ClampedArray(rowSize);
    for (let y = 0; y < Math.floor(height / 2); y++) {
      const topOffset = y * rowSize;
      const bottomOffset = (height - 1 - y) * rowSize;
      tempRow.set(rgba.subarray(topOffset, topOffset + rowSize));
      rgba.set(rgba.subarray(bottomOffset, bottomOffset + rowSize), topOffset);
      rgba.set(tempRow, bottomOffset);
    }
  }

  return { width, height, data: rgba };
}

export function tgaToCanvas(tgaBuffer) {
  const { width, height, data } = parseTGA(tgaBuffer);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');
  const imgData = new ImageData(data, width, height);
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

export async function tgaToPngBlob(tgaBuffer) {
  const canvas = tgaToCanvas(tgaBuffer);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to convert TGA canvas to PNG blob'));
    }, 'image/png');
  });
}
