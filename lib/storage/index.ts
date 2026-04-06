import { randomUUID } from "crypto";
import type { StorageService } from "./storage.interface";
import { CloudflareR2Service } from "./r2.service";
import { compressImages } from "./image.utils";

// ── Re-exports ──────────────────────────────────────────────────────────────
export type { StorageService } from "./storage.interface";
export { CloudflareR2Service } from "./r2.service";
export { compressImage, compressImages } from "./image.utils";

// ── Singleton (lazy) ────────────────────────────────────────────────────────

/**
 * The application-wide storage service instance.
 *
 * Lazy-initialized on first access so that import-time (build, prisma generate)
 * doesn't crash when R2 env vars aren't set yet.
 *
 * Currently backed by Cloudflare R2. To switch providers, simply
 * instantiate a different StorageService implementation here.
 */
let _storageService: StorageService | null = null;

export function getStorageService(): StorageService {
  if (!_storageService) {
    _storageService = new CloudflareR2Service();
  }
  return _storageService;
}

// ── High-level helpers ──────────────────────────────────────────────────────

/**
 * Compress + upload an array of raw image buffers to R2.
 *
 * Returns only the **storage keys** (relative paths), NOT full URLs.
 * This makes the system portable across environments and providers.
 *
 * @param buffers  - Raw file buffers (e.g. from `req.formData()`)
 * @param folder   - Folder/prefix within the bucket (defaults to "campaigns")
 * @returns        - Array of storage keys in the same order as input
 *
 * @example
 * const keys = await uploadCampaignImages([buffer1, buffer2]);
 * // ["campaigns/b1a46c4c-e872-4383-90da-11ca63584d80.webp", ...]
 */
export async function uploadCampaignImages(
  buffers: Buffer[],
  folder: string = "campaigns",
): Promise<string[]> {
  if (buffers.length === 0) {
    throw new Error("At least one image is required");
  }

  // Compress all images in parallel
  const compressed = await compressImages(buffers);

  // Upload all in parallel with unique keys
  const storage = getStorageService();

  const keys = await Promise.all(
    compressed.map(async (buf) => {
      const key = `${folder}/${randomUUID()}.webp`;
      await storage.upload(buf, key, "image/webp");
      return key; // Return just the key, not the full URL
    }),
  );

  return keys;
}

/**
 * Delete a campaign image from R2 by its storage key.
 *
 * @param key - The storage key/path (e.g. "campaigns/abc123.webp")
 */
export async function deleteCampaignImage(key: string): Promise<void> {
  await getStorageService().delete(key);
}

/**
 * Convert a storage key to its full public URL.
 *
 * Use this when returning data to the client — the DB stores only keys,
 * but clients need full URLs to render images.
 *
 * @param key - Storage key (e.g. "campaigns/abc123.webp")
 * @returns   - Full public URL
 */
export function getImageUrl(key: string): string {
  return getStorageService().getPublicUrl(key);
}

/**
 * Convert an array of storage keys to full public URLs.
 *
 * @param keys - Array of storage keys
 * @returns    - Array of full public URLs
 */
export function getImageUrls(keys: string[]): string[] {
  const storage = getStorageService();
  return keys.map((key) => storage.getPublicUrl(key));
}
