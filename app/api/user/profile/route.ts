import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { updatePhoneSchema } from "@/types/auth";
import { requireAuth } from "@/lib/auth";
import authService from "@/service/auth/auth.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { AppError } from "@/lib/errors";

/**
 * PATCH /api/user/profile
 * Update authenticated user's profile (currently: phone number).
 */
export async function PATCH(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    const body = await request.json();
    const validated = updatePhoneSchema.parse(body);

    const result = await authService.updatePhone(userId, validated.phoneNumber);

    return successResponse(
      { message: "Profile updated successfully", ...result },
      200
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return errorResponse(validationError.message, 422);
    }

    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }

    console.error("Update profile error:", error);
    return errorResponse("Internal server error", 500);
  }
}
