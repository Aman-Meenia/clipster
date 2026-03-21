import prisma from "@/lib/prisma";
import authRegistry from "./auth.registry";
import { AuthenticationError, ConflictError, AppError } from "@/lib/errors";
import { generateSecureToken, getTokenExpiry } from "@/lib/token";
import { sendVerificationEmail, sendResetPasswordEmail } from "@/lib/email";
import type {
  SignupInput,
  LoginInput,
  AuthResponse,
  JwtPayload,
} from "@/types/auth";

/**
 * Auth service — Facade that orchestrates auth flows
 * using strategies retrieved from the AuthRegistry.
 */

class AuthService {
  /**
   * Register a new user (called after phone OTP is verified on frontend).
   * Creates user with username = email, sends verification email.
   */
  async register(input: SignupInput): Promise<AuthResponse> {
    const passwordStrategy = authRegistry.getPasswordStrategy();
    const tokenStrategy = authRegistry.getTokenStrategy();

    // Check for existing user by email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { phoneNumber: input.phoneNumber }],
      },
    });

    if (existingUser) {
      if (existingUser.email === input.email) {
        throw new ConflictError("A user with this email already exists");
      }
      throw new ConflictError("A user with this phone number already exists");
    }

    // Hash password
    const hashedPassword = await passwordStrategy.hash(input.password);

    // Generate email verification token (valid for 24 hours)
    const emailToken = generateSecureToken();
    const tokenExpiry = getTokenExpiry(24 * 60); // 24 hours

    // Create user — username defaults to email
    const user = await prisma.user.create({
      data: {
        username: input.email,
        email: input.email,
        phoneNumber: input.phoneNumber,
        password: hashedPassword,
        emailVerificationToken: emailToken,
        tokenExpiry,
      },
    });

    // Send verification email (non-blocking — don't fail signup if email fails)
    sendVerificationEmail(user.email, emailToken).catch((err) => {
      console.error("Failed to send verification email:", err);
    });

    // Generate access token
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = tokenStrategy.generateAccessToken(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
      accessToken,
    };
  }

  /**
   * Verify email using token from the verification link.
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new AppError("Invalid or expired verification token", 400);
    }

    // Check expiry
    if (user.tokenExpiry && new Date() > user.tokenExpiry) {
      throw new AppError("Verification token has expired. Please request a new one.", 400);
    }

    // Mark as verified and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        tokenExpiry: null,
      },
    });

    return { message: "Email verified successfully" };
  }

  /**
   * Login with email + password.
   * Rejects if email is not verified.
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    const passwordStrategy = authRegistry.getPasswordStrategy();
    const tokenStrategy = authRegistry.getTokenStrategy();

    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Check password
    const isPasswordValid = await passwordStrategy.compare(
      input.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Check email verification
    if (!user.isEmailVerified) {
      throw new AppError(
        "Please verify your email address before logging in. Check your inbox for the verification link.",
        403
      );
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = tokenStrategy.generateAccessToken(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
      accessToken,
    };
  }

  /**
   * Forgot password — sends reset email with secure token.
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: "If an account exists with that email, a reset link has been sent." };
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = generateSecureToken();
    const tokenExpiry = getTokenExpiry(60); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        tokenExpiry,
      },
    });

    // Send reset email
    await sendResetPasswordEmail(user.email, resetToken);

    return { message: "If an account exists with that email, a reset link has been sent." };
  }

  /**
   * Reset password using token from reset email.
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const passwordStrategy = authRegistry.getPasswordStrategy();

    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    // Check expiry
    if (user.tokenExpiry && new Date() > user.tokenExpiry) {
      throw new AppError("Reset token has expired. Please request a new one.", 400);
    }

    // Hash new password and clear token
    const hashedPassword = await passwordStrategy.hash(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        tokenExpiry: null,
      },
    });

    return { message: "Password reset successfully. You can now log in with your new password." };
  }
}

const authService = new AuthService();
export default authService;
