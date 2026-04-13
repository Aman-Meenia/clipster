import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { resendVerificationSchema } from "@/types/auth";
import authService from "@/service/auth/auth.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import { AppError } from "@/lib/errors";

/**
 * POST /api/auth/resend-verification
 * Resend email verification link to the user.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP — strict (3 per minute)
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateLimitResult = rateLimit(`resend-verify:${ip}`, 3, 60_000);
    if (!rateLimitResult.success) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const body = await request.json();
    const validated = resendVerificationSchema.parse(body);

    const result = await authService.resendVerificationEmail(validated.email);

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
