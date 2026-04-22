import { Position, BodyLandmarks } from '@/types';

/**
 * Draw simple overlay mode - fixed position with manual adjustment
 */
export function drawSimpleOverlay(
  canvas: HTMLCanvasElement,
  userImageData: CanvasImageSource,
  clothingImage: HTMLImageElement,
  position: Position
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw user photo
  ctx.drawImage(userImageData, 0, 0, canvas.width, canvas.height);

  // Draw clothing overlay
  ctx.globalAlpha = position.opacity;
  const clothingWidth = clothingImage.width * position.scale;
  const clothingHeight = clothingImage.height * position.scale;

  ctx.drawImage(
    clothingImage,
    position.x,
    position.y,
    clothingWidth,
    clothingHeight
  );
  ctx.globalAlpha = 1.0;
}

/**
 * Draw smart overlay mode - positioned based on detected body landmarks
 */
export function drawSmartOverlay(
  canvas: HTMLCanvasElement,
  userImageData: CanvasImageSource,
  clothingImage: HTMLImageElement,
  landmarks: BodyLandmarks,
  position: Position
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw user photo
  ctx.drawImage(userImageData, 0, 0, canvas.width, canvas.height);

  // Calculate clothing position based on landmarks
  const clothingWidth = clothingImage.width * position.scale;
  const clothingHeight = clothingImage.height * position.scale;

  // Center horizontally on chest, position vertically at shoulders
  const x = landmarks.chestCenterX - clothingWidth / 2 + position.x;
  const y = landmarks.shoulderY + position.y;

  // Draw clothing overlay
  ctx.globalAlpha = position.opacity;
  ctx.drawImage(clothingImage, x, y, clothingWidth, clothingHeight);
  ctx.globalAlpha = 1.0;
}

/**
 * Load image from URL or file
 */
export async function loadImage(
  source: string | File | Blob
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = reject;

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const url = URL.createObjectURL(source);
      img.src = url;
    }
  });
}

/**
 * Resize canvas to match image dimensions while maintaining aspect ratio
 */
export function resizeCanvasToImage(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  maxWidth: number = 800,
  maxHeight: number = 600
): { width: number; height: number } {
  let width = image.width;
  let height = image.height;

  // Scale down if too large
  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
  }

  canvas.width = width;
  canvas.height = height;

  return { width, height };
}

/**
 * Convert canvas to base64 image for saving
 */
export function canvasToBase64(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}

/**
 * Download canvas as PNG file
 */
export function downloadCanvasAsImage(
  canvas: HTMLCanvasElement,
  filename: string = 'tryon-look.png'
): void {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Validate if image is within size limits
 */
export function validateImageSize(
  file: File,
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Image must be smaller than ${maxSizeMB}MB. Your file is ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB.`,
    };
  }
  return { valid: true };
}

/**
 * Validate if file is a supported image type
 */
export function validateImageType(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a JPEG, PNG, or WebP image.',
    };
  }
  return { valid: true };
}

/**
 * Create gradient overlay for better clothing visibility
 */
export function applyGradientOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strength: number = 0.1
): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, `rgba(0, 0, 0, ${strength * 0.5})`);
  gradient.addColorStop(0.5, `rgba(0, 0, 0, ${strength})`);
  gradient.addColorStop(1, `rgba(0, 0, 0, ${strength * 0.5})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Get canvas pixel data for processing
 */
export function getCanvasPixelData(
  canvas: HTMLCanvasElement
): Uint8ClampedArray | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
}

/**
 * Compare two canvas outputs (for testing/validation)
 */
export function compareCanvases(
  canvas1: HTMLCanvasElement,
  canvas2: HTMLCanvasElement
): boolean {
  if (
    canvas1.width !== canvas2.width ||
    canvas1.height !== canvas2.height
  ) {
    return false;
  }

  const data1 = canvas1
    .getContext('2d')
    ?.getImageData(0, 0, canvas1.width, canvas1.height).data;
  const data2 = canvas2
    .getContext('2d')
    ?.getImageData(0, 0, canvas2.width, canvas2.height).data;

  if (!data1 || !data2) return false;

  for (let i = 0; i < data1.length; i++) {
    if (data1[i] !== data2[i]) return false;
  }

  return true;
}
