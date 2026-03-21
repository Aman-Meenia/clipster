/**
 * Simple in-memory rate limiter for auth endpoints.
 * Uses a Map to track request counts per key (IP or identifier).
 *
 * NOTE: This is suitable for single-instance deployments.
 * For multi-instance production, replace with Redis-based rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}, 60_000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetInMs: number;
}

/**
 * Check rate limit for a given key.
 * @param key - Unique identifier (e.g. IP address, email)
 * @param limit - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60_000
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // First request or window expired
  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1, resetInMs: windowMs };
  }

  // Within window
  if (entry.count < limit) {
    entry.count++;
    return {
      success: true,
      remaining: limit - entry.count,
      resetInMs: entry.resetTime - now,
    };
  }

  // Rate limited
  return {
    success: false,
    remaining: 0,
    resetInMs: entry.resetTime - now,
  };
}
