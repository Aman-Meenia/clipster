import sharp from "sharp";

/**
 * Image compression utilities.
 *
 * These are storage-provider-agnostic — they prepare image buffers
 * before upload regardless of where the file ends up.
 */

/**
 * Compress a raw image buffer with Sharp.
 *
 * Strategy:
 *  - Resize to max 1280 px wide (preserving aspect ratio)
 *  - Convert to WebP at quality 80
 *
 * This keeps uploads small while maintaining visual quality for
 * campaign card / banner use-cases.
 *
 * @param buffer - Raw image buffer from upload
 * @returns      - Compressed WebP buffer
 */
export async function compressImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

/**
 * Compress multiple image buffers in parallel.
 *
 * @param buffers - Array of raw image buffers
 * @returns       - Array of compressed WebP buffers (same order as input)
 */
export async function compressImages(buffers: Buffer[]): Promise<Buffer[]> {
  return Promise.all(buffers.map(compressImage));
}
