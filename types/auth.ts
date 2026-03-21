import { z } from "zod";

/**
 * Zod schemas for auth request validation.
 * Inferred TypeScript types are exported alongside.
 */

// ── Signup (multi-step) ──────────────────────────────

/** Step 1: Email + Phone → triggers OTP send */
export const signupStepOneSchema = z.object({
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^\+?[0-9]+$/, "Phone number can only contain digits and an optional + prefix"),
});

/** Send OTP request */
export const sendOtpSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^\+?[0-9]+$/, "Phone number can only contain digits and an optional + prefix"),
});

/** Verify phone OTP */
export const verifyOtpSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});

/** Step 3: Complete signup (after phone is verified) */
export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

// ── Login ────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ── Email Verification ───────────────────────────────

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// ── Forgot / Reset Password ──────────────────────────

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

// ── Legacy compat — keep registerSchema for now ──────

export const registerSchema = signupSchema;

// ── Inferred Types ───────────────────────────────────

export type SignupStepOneInput = z.infer<typeof signupStepOneSchema>;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type RegisterInput = SignupInput;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ── JWT & Response ───────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    phoneNumber: string | null;
    role: string;
    isEmailVerified: boolean;
    createdAt: Date;
  };
  accessToken: string;
}
