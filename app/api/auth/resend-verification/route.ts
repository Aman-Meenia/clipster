import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { resendVerificationSchema } from "@/types/auth";
import authService from "@/service/auth/auth.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { rateLimit, store } from "@/lib/rate-limit";
import config from "@/config/config";
import { AppError } from "@/lib/errors";

/**
 * POST /api/auth/resend-verification
 * Resend email verification link to the user.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const ipRateLimit = rateLimit(`resend-verify:ip:${ip}`, 5, 60_000);
    if (!ipRateLimit.success) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const body = await request.json();
    const validated = resendVerificationSchema.parse(body);
    const email = validated.email.toLowerCase();

    // Email rate limit based on config
    const emailRateLimit = rateLimit(
      `resend-verify:email:${email}`,
      config.EMAIL_VERIFICATION_RATE_LIMIT_REQUESTS,
      config.EMAIL_VERIFICATION_RATE_LIMIT_TIME * 60 * 1000
    );
    
    console.log("Rate Limit Map (Resend Verification):", store);

    if (!emailRateLimit.success) {
      const remainingMinutes = Math.ceil(emailRateLimit.resetInMs / 60000);
      return errorResponse(
        `Too many requests. Please try again after ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}.`,
        429
      );
    }

    const result = await authService.resendVerificationEmail(email);

    return successResponse(result, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return errorResponse(validationError.message, 422);
    }

    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }

    console.error("Resend verification error:", error);
    return errorResponse("Internal server error", 500);
  }
}
