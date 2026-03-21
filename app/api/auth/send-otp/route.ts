import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { sendOtpSchema } from "@/types/auth";
import { generateOtp } from "@/lib/token";
import { storeOtp } from "@/service/auth/otp.store";
import { rateLimit } from "@/lib/rate-limit";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * POST /api/auth/send-otp
 * Generate a 6-digit OTP for phone verification.
 * OTP is returned in the response (mock — replace with Twilio later).
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateLimitResult = rateLimit(`send-otp:${ip}`, 10, 60_000);
    if (!rateLimitResult.success) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const body = await request.json();
    const validated = sendOtpSchema.parse(body);

    // Generate OTP and store in memory
    const otp = generateOtp();
    storeOtp(validated.phoneNumber, otp);

    console.log(`📱 OTP for ${validated.phoneNumber}: ${otp}`);

    // Return OTP in response (for development/testing — remove when Twilio is integrated)
    return successResponse(
      {
        message: "OTP sent successfully",
        otp, // ⚠️ REMOVE in production when real SMS is enabled
        phoneNumber: validated.phoneNumber,
      },
      200
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return errorResponse(validationError.message, 422);
    }

    console.error("Send OTP error:", error);
    return errorResponse("Internal server error", 500);
  }
}
