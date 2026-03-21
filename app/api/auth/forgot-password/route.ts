import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { forgotPasswordSchema } from "@/types/auth";
import authService from "@/service/auth/auth.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import { AppError } from "@/lib/errors";

/**
 * POST /api/auth/forgot-password
 * Send password reset email with a secure token link.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateLimitResult = rateLimit(`forgot-pw:${ip}`, 3, 60_000);
    if (!rateLimitResult.success) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const body = await request.json();
    const validated = forgotPasswordSchema.parse(body);

    const result = await authService.forgotPassword(validated.email);

    return successResponse(result, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return errorResponse(validationError.message, 422);
    }

    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }

    console.error("Forgot password error:", error);
    return errorResponse("Internal server error", 500);
  }
}
