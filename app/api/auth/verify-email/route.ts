import { NextRequest } from "next/server";
import { verifyEmailSchema } from "@/types/auth";
import authService from "@/service/auth/auth.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { AppError } from "@/lib/errors";

/**
 * GET /api/auth/verify-email?token=xxx
 * Verify user's email using the token from the verification link.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token") ?? "";

    // Validate
    const validated = verifyEmailSchema.parse({ token });

    // Verify email
    const result = await authService.verifyEmail(validated.token);

    return successResponse(result, 200);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }

    console.error("Verify email error:", error);
    return errorResponse("Internal server error", 500);
  }
}
