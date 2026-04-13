import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { loginSchema } from "@/types/auth";
import authService from "@/service/auth/auth.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import { AppError, EmailNotVerifiedError } from "@/lib/errors";

/**
 * POST /api/auth/login
 * Authenticate user with email + password.
 * Rejects unverified emails. Sets HTTP-only cookie.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateLimitResult = rateLimit(`login:${ip}`, 5, 60_000);
    if (!rateLimitResult.success) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const body = await request.json();

    // Validate input
    const validated = loginSchema.parse(body);

    // Login user
    const result = await authService.login(validated);

    // Set access token as HTTP-only cookie
    const response = successResponse(result, 200);
    response.cookies.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return errorResponse(validationError.message, 422);
    }

    if (error instanceof EmailNotVerifiedError) {
      return NextResponse.json(
        { error: error.code, email: error.email },
        { status: 403 }
      );
    }

    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode);
    }

    console.error("Login error:", error);
    return errorResponse("Internal server error", 500);
  }
}
