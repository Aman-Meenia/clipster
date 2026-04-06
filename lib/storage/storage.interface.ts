/**
 * StorageService — Provider-agnostic interface for object storage.
 *
 * Any storage backend (R2, S3, GCS, Azure Blob, etc.) must implement
 * this contract. The rest of the codebase depends ONLY on this interface,
 * making the storage layer fully swappable.
 */
export interface StorageService {
  /**
   * Upload a buffer to storage.
   *
   * @param buffer      - The file contents
   * @param key         - Object key / path within the bucket (e.g. "campaigns/abc123.webp")
   * @param contentType - MIME type (e.g. "image/webp")
   * @returns           - The public URL of the uploaded object
   */
  upload(buffer: Buffer, key: string, contentType: string): Promise<string>;

  /**
   * Delete an object from storage by its key.
   *
   * @param key - Object key / path within the bucket
   */
  delete(key: string): Promise<void>;

  /**
   * Get the publicly accessible URL for an object.
   *
   * @param key - Object key / path
   * @returns   - Full public URL
   */
  getPublicUrl(key: string): string;

  /**
   * Generate a pre-signed URL for direct client upload (PUT).
   *
   * Useful for large files that should bypass the server.
   *
   * @param key         - Destination key in the bucket
   * @param contentType - Expected MIME type of the upload
   * @param expiresIn   - URL validity in seconds (default: 3600)
   * @returns           - Signed PUT URL
   */
  generatePresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn?: number,
  ): Promise<string>;

  /**
   * Generate a pre-signed URL for private file download (GET).
   *
   * Useful for serving private/restricted files with temporary access.
   *
   * @param key       - Object key in the bucket
   * @param expiresIn - URL validity in seconds (default: 3600)
   * @returns         - Signed GET URL
   */
  generatePresignedDownloadUrl(
    key: string,
    expiresIn?: number,
  ): Promise<string>;
}
