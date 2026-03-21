/**
 * In-memory OTP store for phone number verification.
 * 
 * This is a temporary mock implementation. When Twilio credentials
 * are available, replace this with actual SMS sending and keep the
 * same verification interface.
 */

interface OtpEntry {
  otp: string;
  expiresAt: number;
}

const otpStore = new Map<string, OtpEntry>();

// Clean up expired OTPs every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of otpStore.entries()) {
    if (now > entry.expiresAt) {
      otpStore.delete(key);
    }
  }
}, 60_000);

/**
 * Store an OTP for a phone number.
 * @param phone - Phone number (key)
 * @param otp - The 6-digit OTP
 * @param expiresInMs - Expiration time in milliseconds (default: 5 minutes)
 */
export function storeOtp(
  phone: string,
  otp: string,
  expiresInMs: number = 5 * 60 * 1000
): void {
  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + expiresInMs,
  });
}

/**
 * Verify an OTP for a phone number.
 * Deletes the OTP on successful verification (one-time use).
 * @returns true if OTP is valid and not expired
 */
export function verifyOtp(phone: string, otp: string): boolean {
  const entry = otpStore.get(phone);

  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone);
    return false;
  }
  if (entry.otp !== otp) return false;

  // Valid — delete after successful verification
  otpStore.delete(phone);
  return true;
}

/**
 * Check if a phone number has a pending OTP.
 */
export function hasPendingOtp(phone: string): boolean {
  const entry = otpStore.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone);
    return false;
  }
  return true;
}
