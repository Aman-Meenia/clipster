import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { verifyOtpSchema } from "@/types/auth";
import { verifyOtp } from "@/service/auth/otp.store";
import { rateLimit } from "@/lib/rate-limit";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * POST /api/auth/verify-otp
 * Verify the phone OTP from in-memory store.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateLimitResult = rateLimit(`verify-otp:${ip}`, 10, 60_000);
    if (!rateLimitResult.success) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const body = await request.json();
    const validated = verifyOtpSchema.parse(body);

    // Verify OTP from in-memory store
    const isValid = verifyOtp(validated.phoneNumber, validated.otp);

    if (!isValid) {
      return errorResponse("Invalid or expired OTP. Please request a new one.", 400);
    }

    return successResponse(
      {
        verified: true,
        message: "Phone number verified successfully",
        phoneNumber: validated.phoneNumber,
      },
      200
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return errorResponse(validationError.message, 422);
    }

    console.error("Verify OTP error:", error);
    return errorResponse("Internal server error", 500);
  }
}
