import crypto from "crypto";

/**
 * Secure token and OTP generation utilities.
 */

/** Generate a cryptographically secure random token (hex string). */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/** Generate a 6-digit numeric OTP. */
export function generateOtp(): string {
  // Use crypto for better randomness than Math.random
  const num = crypto.randomInt(100000, 999999);
  return num.toString();
}

/** Get a Date object representing `minutes` from now. */
export function getTokenExpiry(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
